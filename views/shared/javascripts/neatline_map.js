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

            // Application mode setting; 'edit' or 'public.'
            mode: 'edit',

            // Markup hooks.
            markup: {

            },

            // Animation constants.
            animation: {

            },

            // CSS constants.
            css: {

            },

            // Hexes.
            colors: {
                neatline_purple: '#724E85'
            }

        },

        _create: function() {

            var self = this;

            // Getters.
            this.params = Neatline;

            // Ignition.
            this._instantiateOpenLayers();

            // Trackers and buckets.
            this._isData = false;
            this._currentVectorLayers = [];
            this._currentEditItem = null;
            this._currentEditLayer = null;

            // Load data.
            this.loadData();

        },

        _instantiateOpenLayers: function() {

            OpenLayers.IMAGE_RELOAD_ATTEMTPS = 3;
            OpenLayers.Util.onImageLoadErrorColor = "transparent";
            OpenLayers.ImgPath = 'http://js.mapbox.com/theme/dark/';

            var tiled;
            var pureCoverage = true;

            // Pink tile avoidance.
            OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;

            // Make OL compute scale according to WMS spec.
            OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;

            format = 'image/png';
            if(pureCoverage) {
                format = "image/png8";
            }

            var boundsArray = this.params.map.boundingBox.split(',');
            var bounds = new OpenLayers.Bounds(
                parseFloat(boundsArray[0]),
                parseFloat(boundsArray[1]),
                parseFloat(boundsArray[2]),
                parseFloat(boundsArray[3])
            );

            var options = {
                controls: [
                  new OpenLayers.Control.PanZoomBar(),
                  new OpenLayers.Control.Permalink('permalink'),
                  new OpenLayers.Control.MousePosition(),
                  new OpenLayers.Control.Navigation(),
                  new OpenLayers.Control.ScaleLine(),
                ],
                maxExtent: bounds,
                maxResolution: 'auto',
                projection: this.params.map.epsg[0],
                units: 'm'
            };

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
            this.map.zoomToExtent(bounds);

        },

        loadData: function() {

            var self = this;

            // Clear existing vectors.
            if (this._isData) {

                $.each(this._currentVectorLayers, function(i, layer) {
                    self.map.removeLayer(layer);
                    // layer.destroy();
                });

                // Empty out the container.
                this._currentVectorLayers = [];

            }

            // Hit the json server.
            $.ajax({

                url: this.params.dataSources.map,
                dataType: 'json',

                success: function(data) {

                    // Build the new layers.
                    self._buildVectorLayers(data);
                    self._isData = true;

                    console.log(self._currentEditItem);

                    // If a layer was being edited before the save,
                    // make that layer the active edit layer again.
                    if (self._currentEditItem != null) {
                        self.edit(self._currentEditItem);
                    }

                }

            });

        },

        _buildVectorLayers: function(data) {

            var self = this;

            // Instantiate associations objects.
            this.idToLayer = {};
            this.layerToId = {};

            $.each(data, function(i, item) {

                // Get the id of the item.
                var itemId = item.id;

                // Build the layers.
                var vectorLayer = new OpenLayers.Layer.Vector(item.title);
                self.map.addLayer(vectorLayer);

                // Empty array to hold features objects.
                var features = [];

                // Build the features.
                $.each(item.wkt, function(i, wkt) {
                    var geometry = new OpenLayers.Geometry.fromWKT(wkt);
                    var feature = new OpenLayers.Feature.Vector(geometry);
                    features.push(feature);
                });

                // Add the vectors to the layer.
                vectorLayer.addFeatures(features);

                // Add to associations.
                self.idToLayer[itemId] = vectorLayer;
                self.layerToId[vectorLayer.id] = itemId;

                // Add to the layers array.
                self._currentVectorLayers.push(vectorLayer);

            });

            // Create the highlight and click control.
            this.highlightControl = new OpenLayers.Control.SelectFeature(self._currentVectorLayers, {
                hover: true,
                highlightOnly: true,
                renderIntent: 'temporary'
            });

            this.clickControl = new OpenLayers.Control.SelectFeature(self._currentVectorLayers, {
                clickout: true,
                onSelect: function(feature) {

                    // Trigger out to the deployment code.
                    self._trigger('featureclick', {}, {
                        'itemId': self.layerToId[feature.layer.id]
                    });

                }
            });

            // Add and activate.
            this.map.addControl(this.highlightControl);
            this.highlightControl.activate();
            this.map.addControl(this.clickControl);
            this.clickControl.activate();

        },

        edit: function(item) {

            var self = this;

            // If in edit mode, turn off the default feature selection
            // in preparation for the instantiation of the vector editing
            // controls.
            if (this.options.mode == 'edit') {
                this.clickControl.unselectAll();
                this.highlightControl.deactivate();
                this.clickControl.deactivate();
            }

            // Get the id of the item and try to fetch the layer.
            var itemId = item.attr('recordid');
            this._currentEditLayer = this.idToLayer[itemId];
            this._newVectors = false;

            // Record the id of the current edit layer, so that the layer can be
            // reactivated as the current layer after save.
            this._currentEditItem = item;

            // If the item does not have an existing vector layer, create a new one.
            if (!this._currentEditLayer) {

                var itemName = item.find('span.item-title-text').text();
                this._currentEditLayer = new OpenLayers.Layer.Vector(itemName);
                this.map.addLayer(this._currentEditLayer);

                // Push the edit layer onto the non-base layers stack.
                this._currentVectorLayers.push(this._currentEditLayer);

                this._newVectors = true;
                this.idToLayer[itemId] = this._currentEditLayer;

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
                onModificationStart: function() {
                    self._trigger('featureadded');
                }

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

                },

                'delete': function() {
                    self._currentEditLayer.eraseFeatures([ self.modifyFeatures.feature ]);
                }

            });

            // Insert the edit geometry button.
            this.element.editgeometry('showButtons');

        },

        endEditWithoutSave: function(id) {

            // Remove controls.
            this.editToolbar.deactivate();
            this.element.editgeometry('hideButtons');

            // Nuke the modify features control. For strange reasons,
            // this is necessary.
            this.modifyFeatures.deactivate();
            delete this.modifyFeatures;

            // Reactivate the default selection controls.
            this.clickControl.activate();
            this.highlightControl.activate();

            if (this._currentEditLayer.features.length == 0) {

                // Pop off the layer, remove the id-layer association.
                this.map.removeLayer(this._currentEditLayer);
                delete this.idToLayer[id];
                delete this.layerToId[this._currentEditLayer.id];
                this._currentEditLayer = null;

            }

            // Clear the item tracker.
            this._currentEditItem = null;

        },

        getWktForSave: function() {

            var wkts = {};

            this.modifyFeatures.selectControl.unselectAll();

            // Push each of the wkt representations of the geometry
            // onto the array.
            $.each(this._currentEditLayer.features, function(i, feature) {
                wkts[i] = feature.geometry.toString();
            });

            return wkts;

        },

        zoomToItemVectors: function(id) {

            var layer = this.idToLayer[id];

            if (layer != null && layer.features.length > 0) {
                this.map.zoomToExtent(layer.getDataExtent());
            }

        }

    });


})( jQuery );
