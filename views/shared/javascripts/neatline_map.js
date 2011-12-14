/*
 * Component widget that controls the map. Instantiated by the parent Neatline
 * widget.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by
 * applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * @package     omeka
 * @subpackage  neatline
 * @author      Scholars' Lab <>
 * @author      Bethany Nowviskie <bethany@virginia.edu>
 * @author      Adam Soroka <ajs6f@virginia.edu>
 * @author      David McClure <david.mcclure@virginia.edu>
 * @copyright   2011 The Board and Visitors of the University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */

(function($, undefined) {


    $.widget('neatline.neatlinemap', {

        options: {

            mode: 'edit',
            wkt_delimiter: '|',

            // Markup hooks.
            markup: {
                toolbar_class: 'olControlEditingToolbar'
            },

            // Animation constants.
            animation: {
                fade_duration: 500
            },

            // Hexes.
            colors: {
                neatline_purple: '#724E85',
                highlight_red: '#d04545'
            },

            styles: {
                default_opacity: 0.4,
                default_color: '#ffb80e',
                select_point_radius: 10,
                select_stroke_color: '#ea3a3a'
            }

        },

        /*
         * Grab the Neatline global, shell out trackers, startup.
         */
        _create: function() {

            var self = this;

            // Getters.
            this.params = Neatline;

            // Ignition.
            this._instantiateOpenLayers();

            // Trackers and buckets.
            this._currentVectorLayers = [];
            this._currentEditItem = null;
            this._currentEditLayer = null;
            this._clickedFeature = null;
            this.idToLayer = {};
            this.requestData = null;

            // Load data.
            this.loadData();

        },

        /*
         * Grab the Neatline global, shell out trackers, startup.
         */
        _instantiateOpenLayers: function() {

            // Set OL global attributes.
            OpenLayers.IMAGE_RELOAD_ATTEMTPS = 3;
            OpenLayers.Util.onImageLoadErrorColor = "transparent";
            OpenLayers.ImgPath = 'http://js.mapbox.com/theme/dark/';

            var tiled;
            var pureCoverage = true;

            // Pink tile avoidance.
            OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;

            // Make OL compute scale according to WMS spec.
            OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;

            // Set tile image format.
            format = 'image/png';
            if(pureCoverage) {
                format = "image/png8";
            }

            // Build the default bounds array.
            var boundsArray = this.params.map.boundingBox.split(',');
            var bounds = new OpenLayers.Bounds(
                parseFloat(boundsArray[0]),
                parseFloat(boundsArray[1]),
                parseFloat(boundsArray[2]),
                parseFloat(boundsArray[3])
            );

            // Starting options.
            var options = {
                controls: [
                  new OpenLayers.Control.PanZoomBar(),
                  new OpenLayers.Control.Permalink('permalink'),
                  new OpenLayers.Control.MousePosition(),
                  new OpenLayers.Control.LayerSwitcher(),
                  new OpenLayers.Control.Navigation(),
                  new OpenLayers.Control.ScaleLine(),
                ],
                maxExtent: bounds,
                maxResolution: 'auto',
                projection: this.params.map.epsg[0],
                units: 'm'
            };

            // Instantiate the map.
            this.map = new OpenLayers.Map('map', options);

            this.baseLayer = new OpenLayers.Layer.WMS(
                this.params.name, this.params.map.wmsAddress,
                {
                    LAYERS: this.params.map.layers,
                    STYLES: '',
                    format: 'image/jpeg',
                    tiled: !pureCoverage,
                    tilesOrigin : this.map.maxExtent.left + ',' + this.map.maxExtent.bottom
                },
                {
                    buffer: 0,
                    displayOutsideMaxExtent: true,
                    isBaseLayer: true
                }
            );

            this.map.addLayers([this.baseLayer]);

            // If there is a default bounding box set for the exhibit, construct
            // a second Bounds object to use as the starting zoom target.
            if (this.params.default_map_bounds != null) {
                var boundsArray = this.params.default_map_bounds.split(',');
                var bounds = new OpenLayers.Bounds(
                    parseFloat(boundsArray[0]),
                    parseFloat(boundsArray[1]),
                    parseFloat(boundsArray[2]),
                    parseFloat(boundsArray[3])
                );
            }

            // Set starting zoom focus.
            this.map.zoomToExtent(bounds);

        },

        /*
         * Load the feature data.
         */
        loadData: function() {

            var self = this;

            // If there are existing click and highlight controls, destroy them.
            this._removeControls();

            // Clear existing vectors.
            $.each(this._currentVectorLayers, function(i, layer) {
                self.map.removeLayer(layer);
                layer.destroy();
            });

            // Empty out the containers.
            this._currentVectorLayers = [];
            this.idToLayer = {};

            // Abort the request if it is running.
            if (this.requestData != null) {
                this.requestData.abort();
            }

            // Hit the json server.
            this.requestData = $.ajax({

                url: this.params.dataSources.map,
                dataType: 'json',

                success: function(data) {

                    // Build the new layers and add default click controls.
                    self._buildVectorLayers(data);
                    self._addClickControls();

                    // If a layer was being edited before the save,
                    // make that layer the active edit layer again.
                    if (self._currentEditItem != null) {
                        self.edit(self._currentEditItem, true);
                    }

                }

            });

        },

        /*
         * Construct the features from the source JSON.
         */
        _buildVectorLayers: function(data) {

            var self = this;

            // Instantiate database and associations objects.
            this._db = TAFFY();
            this.idToLayer = {};
            this.layerToId = {};

            $.each(data, function(i, item) {

                // Get item id and color, construct style.
                var itemId = item.id;
                var color = (item.color != '') ? item.color : self.options.styles.default_color;
                var style = self._getStyleMap(color);

                // Build the layers.
                var vectorLayer = new OpenLayers.Layer.Vector(item.title, {
                    styleMap: style
                });

                // Empty array to hold features objects.
                var features = [];

                // Build the features.
                $.each(item.wkt.split(self.options.wkt_delimiter), function(i, wkt) {
                    var geometry = new OpenLayers.Geometry.fromWKT(wkt);
                    var feature = new OpenLayers.Feature.Vector(geometry);
                    features.push(feature);
                });

                // Add the vectors to the layer.
                vectorLayer.addFeatures(features);
                vectorLayer.setMap(self.map);

                // Add to associations.
                self.idToLayer[itemId] = vectorLayer;
                self.layerToId[vectorLayer.id] = itemId;

                // Add the database record.
                self._db.insert({
                    recordid: itemId,
                    data: item,
                    layer: vectorLayer
                });

                // Add to the layers array and add to map.
                self._currentVectorLayers.push(vectorLayer);
                self.map.addLayer(vectorLayer);

            });

        },

        /*
         * Listen for mouseenter and mousedown on the features.
         */
        _addClickControls: function() {

            var self = this;

            // If there are existing click and highlight controls, destroy them.
            this._removeControls();

            // Create the highlight and click control.
            this.highlightControl = new OpenLayers.Control.SelectFeature(this._currentVectorLayers, {
                hover: true,
                highlightOnly: true,
                renderIntent: 'temporary'
            });

            this.clickControl = new OpenLayers.Control.SelectFeature(this._currentVectorLayers, {

                onSelect: function(feature) {

                    // Store the feature in the tracker.
                    self._clickedFeature = feature;

                    // Trigger out to the deployment code.
                    self._trigger('featureclick', {}, {
                        'itemId': self.layerToId[feature.layer.id]
                    });

                    if (self.modifyFeatures != undefined) {
                        self.modifyFeatures.selectFeature(feature);
                    }

                },

                onUnselect: function(feature) {

                    if (self.modifyFeatures != undefined) {
                        self.modifyFeatures.unselectFeature(feature);
                    }

                }

            });

            // Add and activate.
            this.map.addControl(this.highlightControl);
            this.highlightControl.activate();
            this.map.addControl(this.clickControl);
            this.clickControl.activate();

        },

        /*
         * Remove all edit/select controls.
         */
        _removeControls: function() {

            if (this.modifyFeatures !== undefined) {
                this.map.removeControl(this.modifyFeatures);
                this.modifyFeatures.destroy();
                delete this.modifyFeatures;
            }

            if (this.editToolbar !== undefined) {
                this.map.removeControl(this.editToolbar);
                this.editToolbar.destroy();
                delete this.editToolbar;
            }

            if (this.clickControl !== undefined) {
                this.map.removeControl(this.clickControl);
                this.clickControl.destroy();
                delete this.clickControl;
            }

            if (this.highlightControl !== undefined) {
                this.map.removeControl(this.highlightControl);
                this.highlightControl.destroy();
                delete this.highlightControl;
            }

        },

        /*
         * Build and activate the editing funcitonalty.
         */
        edit: function(item, immediate) {

            var self = this;

            if (this.highlightControl !== undefined) {
                this.highlightControl.deactivate();
            }

            // Get the id of the item and try to fetch the layer.
            var itemId = item.attr('recordid');
            this._currentEditLayer = this.idToLayer[itemId];
            this._currentEditId = itemId;

            // Record the id of the current edit layer, so that the layer can be
            // reactivated as the current layer after save.
            this._currentEditItem = item;

            // If the item does not have an existing vector layer, create a new one.
            if (!this._currentEditLayer) {

                var itemName = item.find('span.item-title-text').text();
                this._currentEditLayer = new OpenLayers.Layer.Vector(itemName);
                this.map.addLayer(this._currentEditLayer);
                this._currentEditLayer.setMap(this.map);

                // Push the edit layer onto the non-base layers stack.
                this._currentVectorLayers.push(this._currentEditLayer);
                this.idToLayer[itemId] = this._currentEditLayer;
                this.layerToId[this._currentEditLayer.id] = itemId;

            }

            // Create the controls and toolbar.
            var panelControls = [

                // Panning.
                new OpenLayers.Control.Navigation(),

                // Draw lines.
                new OpenLayers.Control.DrawFeature(this._currentEditLayer, OpenLayers.Handler.Path, {
                    displayClass: 'olControlDrawFeaturePath',
                    featureAdded: function() {
                        self._trigger('featureadded');
                    }
                }),

                // Draw points.
                new OpenLayers.Control.DrawFeature(this._currentEditLayer, OpenLayers.Handler.Point, {
                    displayClass: 'olControlDrawFeaturePoint',
                    featureAdded: function() {
                        self._trigger('featureadded');
                    }
                }),

                // Draw polygons.
                new OpenLayers.Control.DrawFeature(this._currentEditLayer, OpenLayers.Handler.Polygon, {
                    displayClass: 'olControlDrawFeaturePolygon',
                    featureAdded: function() {
                        self._trigger('featureadded');
                    }
                })

            ];

            // Instantiate the modify feature control.
            this.modifyFeatures = new OpenLayers.Control.ModifyFeature(this._currentEditLayer, {

                // OL marks this callback as deprecated, but I can't find
                // any alternative and kosher way of hooking on to this.
                onModification: function() {
                    self._trigger('featureadded');
                },

                standalone: true

            });

            // Instantiate the edit toolbar.
            this.editToolbar = new OpenLayers.Control.Panel({
                defaultControl: panelControls[0],
                displayClass: 'olControlEditingToolbar'
            });

            // Add the controls.
            this.editToolbar.addControls(panelControls);

            // Show the toolbar, add and activate the other controls.
            this.map.addControl(this.editToolbar);
            this.map.addControl(this.modifyFeatures);
            this.modifyFeatures.activate();

            // Instantiate the geometry editor.
            this.element.editgeometry({

                // On update.
                'update': function(event, obj) {

                    // Default to reshape.
                    self.modifyFeatures.mode = OpenLayers.Control.ModifyFeature.RESHAPE;

                    // Rotation.
                    if (obj.rotate) {
                        self.modifyFeatures.mode |= OpenLayers.Control.ModifyFeature.ROTATE;
                    }

                    // Resize.
                    if (obj.scale) {
                        self.modifyFeatures.mode |= OpenLayers.Control.ModifyFeature.RESIZE;
                    }

                    // Drag.
                    if (obj.drag) {
                        self.modifyFeatures.mode |= OpenLayers.Control.ModifyFeature.DRAG;
                    }

                    // If rotate or drag, pop off reshape.
                    if (obj.drag || obj.rotate) {
                        self.modifyFeatures.mode &= -OpenLayers.Control.ModifyFeature.RESHAPE;
                    }

                    var feature = self.modifyFeatures.feature;

                    // If there is a selected feature, unselect and reselect it to apply
                    // the new configuration.
                    if (feature != null) {
                        self.modifyFeatures.unselectFeature(feature);
                        self.modifyFeatures.selectFeature(feature);
                    }

                },

                'delete': function() {

                    if (self.modifyFeatures.feature) {

                        var feature = self.modifyFeatures.feature;
                        self.modifyFeatures.unselectFeature(feature);
                        self._currentEditLayer.destroyFeatures([ feature ]);

                    }

                }

            });

            // Only do the fade if the form open does not coincide with
            // another form close.
            if (!immediate) {

                // Insert the edit geometry button.
                this.element.editgeometry('showButtons', immediate);

                // Fade up the toolbar.
                $('.' + this.options.markup.toolbar_class).animate({
                    'opacity': 1
                }, this.options.animation.fade_duration);

            }

            else {

                // Pop up the toolbar.
                $('.' + this.options.markup.toolbar_class).css('opacity', 1);

            }

            // If the last selected features is among the features in the
            // new currentEditLayer, mark it as selected by default. Notably,
            // this would be the case of the edit flow was triggered by a
            // feature click in the editor.
            var inLayer = false;
            $.each(this._currentEditLayer.features, function(i, feature) {
                if (feature == self._clickedFeature) {
                    inLayer = true;
                }
            });

            if (inLayer) {
                this.modifyFeatures.selectFeature(this._clickedFeature);
            }

        },

        /*
         * Remove editing functionality, return to default mode.
         */
        endEditWithoutSave: function(id, immediate) {

            // Before OpenLayers axes the toolbar controls, clone the div so
            // that it can be faded down in unison with the buttons.
            var toolbarClone = $('.' + this.options.markup.toolbar_class).clone();

            // Remove controls.
            this.modifyFeatures.unselectFeature(this._clickedFeature);
            this.map.removeControl(this.modifyFeatures);
            this.map.removeControl(this.editToolbar);

            // If the form is immediately switching to another form, do not do
            // the fade down, as as to avoid a little opacity dip in the buttons
            // when the form switches.
            if (!immediate) {

                this.element.editgeometry('hideButtons');

                // Reinsert the dummy toolbar and fade it down.
                this.element.append(toolbarClone);
                toolbarClone.animate({
                    'opacity': 0
                }, this.options.animation.fade_duration, function() {
                    toolbarClone.remove();
                });

            }

            // Reactivate the default selection controls.
            this._addClickControls();

            if (this._currentEditLayer.features.length == 0) {

                // Pop off the layer, remove the id-layer association.
                this.map.removeLayer(this._currentEditLayer);
                this._currentVectorLayers.remove(this._currentEditLayer);
                delete this.idToLayer[id];
                delete this.layerToId[this._currentEditLayer.id];
                this._currentEditLayer = null;

            }

            // Clear the item tracker.
            this._currentEditItem = null;

        },

        /*
         * Get the WKT representation of the current layer.
         */
        getWktForSave: function() {

            var wkts = [];

            this.modifyFeatures.unselectFeature(this._clickedFeature);

            // Push the wkt's onto the array.
            $.each(this._currentEditLayer.features, function(i, feature) {
                wkts.push(feature.geometry.toString());
            });

            return wkts.join(this.options.wkt_delimiter);

        },

        /*
         * Get the current extent of the viewport.
         */
        getExtentForSave: function() {

            return this.map.getExtent().toString();

        },

        /*
         * Get the current zoom of the viewport.
         */
        getZoomForSave: function() {

            return this.map.getZoom();

        },

        /*
         * Focus the map on the feature data for a given item.
         */
        zoomToItemVectors: function(id) {

            var record = this._db({ recordid: parseInt(id) }).first();

            if (record.layer != null && record.layer.features.length > 0) {
                this.map.zoomToExtent(record.layer.getDataExtent());
            }

        },

        /*
         * Construct a StyleMap object with a given color.
         */
        _getStyleMap: function(fillColor) {

            return new OpenLayers.StyleMap({
                'default': new OpenLayers.Style({
                    fillColor: fillColor,
                    fillOpacity: this.options.styles.default_opacity,
                    strokeColor: fillColor,
                    pointRadius: this.options.styles.select_point_radius,
                    strokeWidth: 1
                }),
                'select': new OpenLayers.Style({
                    fillColor: fillColor,
                    fillOpacity: this.options.styles.default_opacity,
                    strokeColor: this.options.styles.select_stroke_color,
                    pointRadius: this.options.styles.select_point_radius,
                    strokeWidth: 2
                }),
            });

        },

        /*
         * Update the feature color for the current editing layer.
         */
        setItemColor: function(color) {

            // Rebuild the style map.
            this._currentEditLayer.styleMap = this._getStyleMap(color);

            // Rerender the layer to manifest the change.
            this._currentEditLayer.redraw();

        }

    });

})( jQuery );
