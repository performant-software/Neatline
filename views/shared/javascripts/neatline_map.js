/**
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

  'use strict';

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
                vector_color: '#ffb80e',
                stroke_color: '#ea3a3a',
                highlight_color: '#ff0000',
                vector_opacity: 0.4,
                stroke_opacity: 0.6,
                stroke_width: 1,
                point_radius: 6
            }

        },

        /*
         * Grab the Neatline global, shell out trackers, startup.
         */
        _create: function() {

            var self = this;

            // Getters.
            this._window = $(window);

            // Trackers and buckets.
            this._db =                      TAFFY();
            this._currentVectorLayers =     [];
            this._currentEditItem =         null;
            this._currentEditLayer =        null;
            this._clickedFeature =          null;
            this.record =                   null;
            this.requestData =              null;

            // Construct WMS-based map.
            if (Neatline.map_id) {
                this._instantiateGeoserverMap();
            }

            // Construct image-based map.
            else if (Neatline.image_id) {
                this._instantiateImageMap();
            }

            // Construct OSM.
            else {
                this._instantiateRealGeographyMap();
            }

            // Construct the editing manager.
            if (!Neatline.isPublic) {
                this._instantiateEditor();
            }

            // Start-up.
            this._constructTitleTip();
            this.loadData();

        },

        /*
         * Initialize a Geoserver-based map with a WMS base layer.
         */
        _instantiateGeoserverMap: function() {

            // Set OL global attributes.
            OpenLayers.IMAGE_RELOAD_ATTEMTPS = 3;
            OpenLayers.Util.onImageLoadErrorColor = 'transparent';
            OpenLayers.ImgPath = 'http://js.mapbox.com/theme/dark/';

            var tiled;
            var pureCoverage = true;

            // Pink tile avoidance.
            OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;

            // Make OL compute scale according to WMS spec.
            OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;

            // Set tile image format.
            var format = 'image/png';
            if (pureCoverage) {
                format = 'image/png8';
            }

            // Build the default bounds array.
            var boundsArray = Neatline.map.boundingBox.split(',');
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
                  new OpenLayers.Control.MousePosition(),
                  new OpenLayers.Control.Navigation(),
                  new OpenLayers.Control.ScaleLine(),
                  new OpenLayers.Control.LayerSwitcher()
                ],
                maxResolution: 'auto',
                projection: Neatline.map.epsg[0],
                units: 'm'
            };

            // Instantiate the map.
            this.map = new OpenLayers.Map('map', options);

            // // Construct the base layers.
            // var layers = this._getBaseLayers();

            // // Push the base layers onto the map, set default.
            // this.map.addLayers(layers);
            // this._setDefaultLayer();

            // Build the WMS layer.
            this.baseLayer = new OpenLayers.Layer.WMS(
                Neatline.name,
                Neatline.map.wmsAddress,
                {
                    LAYERS: Neatline.map.layers,
                    STYLES: '',
                    format: format,
                    tiled: !pureCoverage,
                    tilesOrigin: this.map.maxExtent.left + ',' + this.map.maxExtent.bottom
                },
                {
                    buffer: 0,
                    displayOutsideMaxExtent: true,
                    isBaseLayer: true
                    // transparent: 'true'
                }
            );

            // Push the base layer onto the map.
            this.map.addLayers([this.baseLayer]);

            // If there is a default bounding box set for the exhibit, construct
            // a second Bounds object to use as the starting zoom target.
            if (Neatline.default_map_bounds !== null) {
                var boundsArray = Neatline.default_map_bounds.split(',');
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
         * Initialize a map with real-geography base-layer.
         */
        _instantiateRealGeographyMap: function() {

            // Set OL global attributes.
            OpenLayers.IMAGE_RELOAD_ATTEMTPS = 3;
            OpenLayers.Util.onImageLoadErrorColor = 'transparent';
            OpenLayers.ImgPath = 'http://js.mapbox.com/theme/dark/';

            var tiled;
            var pureCoverage = true;

            // Pink tile avoidance.
            OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;

            // Make OL compute scale according to WMS spec.
            OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;

            // Set tile image format.
            var format = 'image/png';
            if (pureCoverage) {
                format = 'image/png8';
            }

            // Build the default bounds array.
            var bounds = new OpenLayers.Bounds(
                -8344149.6594826,
                4855703.4254752,
                -8119424.7963554,
                5104888.1376502
            );

            // Starting options.
            var options = {
                controls: [
                  new OpenLayers.Control.PanZoomBar(),
                  new OpenLayers.Control.MousePosition(),
                  new OpenLayers.Control.Navigation(),
                  new OpenLayers.Control.ScaleLine(),
                  new OpenLayers.Control.LayerSwitcher()
                ],
                maxResolution: 'auto',
                units: 'm'
            };

            // Instantiate the map.
            this.map = new OpenLayers.Map('map', options);

            // Construct the base layers.
            var layers = this._getBaseLayers();

            // Push the base layers onto the map, set default.
            this.map.addLayers(layers);
            this._setDefaultLayer();

            // Google.v3 uses EPSG:900913 as projection, so we have to
            // transform our coordinates
            this.map.setCenter(new OpenLayers.LonLat(10.2, 48.9).transform(
                new OpenLayers.Projection("EPSG:4326"),
                this.map.getProjectionObject()
            ), 5);

            // If there is a default bounding box set for the exhibit, construct
            // a second Bounds object to use as the starting zoom target.
            if (Neatline.default_map_bounds !== null) {
                var boundsArray = Neatline.default_map_bounds.split(',');
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
         * Initialize an image-based map.
         */
        _instantiateImageMap: function() {

            // Set OL global attributes.
            OpenLayers.IMAGE_RELOAD_ATTEMTPS = 3;
            OpenLayers.Util.onImageLoadErrorColor = 'transparent';
            OpenLayers.ImgPath = 'http://js.mapbox.com/theme/dark/';
            OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;

            // Starting options.
            var options = {
                controls: [
                  new OpenLayers.Control.PanZoomBar(),
                  new OpenLayers.Control.MousePosition(),
                  new OpenLayers.Control.Navigation()
                ],
                maxResolution: 'auto'
            };

            // Instantiate the map.
            this.map = new OpenLayers.Map('map', options);

            // Build the bounds and size objects.
            var bounds = new OpenLayers.Bounds(0, 0, Neatline.image.width, Neatline.image.height);
            var size = new OpenLayers.Size(Neatline.image.width, Neatline.image.height);

            // Build the baselayer.
            this.baseLayer = new OpenLayers.Layer.Image(
                Neatline.image.name,
                Neatline.image.path,
                bounds,
                size,
                options
            );

            // Push the base layer onto the map.
            this.map.addLayers([this.baseLayer]);

            // If there is a default bounding box set for the exhibit, construct
            // a second Bounds object to use as the starting zoom target.
            if (Neatline.default_map_bounds !== null) {
                var boundsArray = Neatline.default_map_bounds.split(',');
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
         * Initialize the editing manager widget.
         */
        _instantiateEditor: function() {

            var self = this;

            // Instantiate the geometry editor.
            this.element.editgeometry({

                // On update.
                'update': function(event, obj) {

                    // Default to reshape.
                    self.modifyFeatures.mode =
                        OpenLayers.Control.ModifyFeature.RESHAPE;

                    // Rotation.
                    if (obj.rotate) {
                        self.modifyFeatures.mode |=
                            OpenLayers.Control.ModifyFeature.ROTATE;
                    }

                    // Resize.
                    if (obj.scale) {
                        self.modifyFeatures.mode |=
                            OpenLayers.Control.ModifyFeature.RESIZE;
                    }

                    // Drag.
                    if (obj.drag) {
                        self.modifyFeatures.mode |=
                            OpenLayers.Control.ModifyFeature.DRAG;
                    }

                    // If rotate or drag, pop off reshape.
                    if (obj.drag || obj.rotate) {
                        self.modifyFeatures.mode &=
                            -OpenLayers.Control.ModifyFeature.RESHAPE;
                    }

                    var feature = self.modifyFeatures.feature;

                    // If there is a selected feature, unselect and
                    // reselect it to apply the new configuration.
                    if (feature !== null) {
                        self.modifyFeatures.unselectFeature(feature);
                        self.modifyFeatures.selectFeature(feature);
                    }

                },

                'delete': function() {

                    if (self.modifyFeatures.feature) {

                        var feature = self.modifyFeatures.feature;
                        self.modifyFeatures.unselectFeature(feature);
                        self._currentEditLayer.destroyFeatures([feature]);

                    }

                }

            });

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

            // Empty out the layers database.
            this._currentVectorLayers = [];

            // Abort the request if it is running.
            if (this.requestData !== null) {
                this.requestData.abort();
            }

            // Hit the json server.
            this.requestData = $.ajax({

                url: Neatline.dataSources.map,
                dataType: 'json',

                success: function(data) {

                    // Build the new layers and add default click controls.
                    self._buildVectorLayers(data);
                    self._addClickControls();

                    // If a layer was being edited before the save,
                    // make that layer the active edit layer again.
                    if (self._currentEditItem !== null) {
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

            $.each(data, function(i, item) {

                // Get float values for opacities.
                item.vector_opacity = item.vector_opacity / 100;
                item.stroke_opacity = item.stroke_opacity / 100;

                // Construct the style.
                var style = self._getStyleMap(
                    item.vector_color,
                    item.vector_opacity,
                    item.stroke_color,
                    item.stroke_opacity,
                    item.stroke_width,
                    item.point_radius);

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

                // Add the database record.
                self._db.insert({
                    itemid: item.item_id,
                    layerid: vectorLayer.id,
                    recordid: item.id,
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

            // Highlight controller.
            this.highlightControl = new OpenLayers.Control.SelectFeature(this._currentVectorLayers, {

                hover: true,
                highlightOnly: true,
                renderIntent: 'temporary',

                eventListeners: {

                    featurehighlighted: function(e) {
                        var record = self._db({ layerid: e.feature.layer.id }).first();
                        self._showTitleTip(record);
                    },

                    featureunhighlighted: function(e) {
                        self._hideTitleTip();
                    }

                }

            });

            // Click controller.
            this.clickControl = new OpenLayers.Control.SelectFeature(this._currentVectorLayers, {

                clickout: true,

                // When the feature is selected.
                onSelect: function(feature) {

                    // Get the record for the layer.
                    var record = self._db({ layerid: feature.layer.id }).first();
                    self._clickedFeature = feature;

                    // Trigger out to the deployment code.
                    self._trigger('featureclick', {}, {
                        'recordid': record.recordid
                    });

                    if (!_.isUndefined(self.modifyFeatures)) {
                        self.modifyFeatures.selectFeature(feature);
                    }

                },

                // When the feature is unselected.
                onUnselect: function(feature) {

                    if (!_.isUndefined(self.modifyFeatures)) {
                        self.modifyFeatures.unselectFeature(feature);
                    }

                },

                // Listen for mouseleave.
                callbacks: {
                    out: function() {
                        self._hideTitleTip();
                    }
                }

            });

            this.highlightControl.handlers.feature.stopDown = false;
            this.clickControl.handlers.feature.stopDown = false;

            // Add and activate the highlight control.
            this.map.addControl(this.highlightControl);
            this.highlightControl.activate();

            // Add and activate the click control.
            this.map.addControl(this.clickControl);
            this.clickControl.activate();

        },

        /*
         * Remove all edit/select controls.
         */
        _removeControls: function() {

            if (!_.isUndefined(this.modifyFeatures)) {
                this.map.removeControl(this.modifyFeatures);
                this.modifyFeatures.destroy();
                delete this.modifyFeatures;
            }

            if (!_.isUndefined(this.editToolbar)) {
                this.map.removeControl(this.editToolbar);
                this.editToolbar.destroy();
                delete this.editToolbar;
            }

            if (!_.isUndefined(this.clickControl)) {
                this.map.removeControl(this.clickControl);
                this.clickControl.destroy();
                delete this.clickControl;
            }

            if (!_.isUndefined(this.highlightControl)) {
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

            // Try to get record and item id's.
            var recordid = item.attr('recordid');
            var itemid = item.attr('itemid');

            // If there is a record id, get the layer.
            if (recordid !== '') {
                this.record = this._db({ recordid: parseInt(recordid, 10) }).first();
                this._currentEditLayer = this.record.layer;
            }

            // If there is an item id, try to find a layer.
            else if (itemid !== '') {
                this.record = this._db({ itemid: parseInt(itemid, 10) }).first();
                this._currentEditLayer = this.record.layer;
            }

            // Store the current edit item so that the layer can be reactivatee as
            // the current layer after save.
            this._currentEditItem = item;

            // If the item does not have an existing vector layer, create a new one.
            if (!this._currentEditLayer) {

                var itemName = item.find('span.item-title-text').text();
                var newLayer = new OpenLayers.Layer.Vector(itemName);

                // Push the edit layer onto the non-base layers stack, add to map.
                this._currentEditLayer = newLayer;
                this._currentVectorLayers.push(this._currentEditLayer);
                this.map.addLayer(this._currentEditLayer);
                this._currentEditLayer.setMap(this.map);

                // Set default style.
                this.setDefaultStyle();

                // Add the database record.
                self._db.insert({
                    itemid: itemid,
                    layerid: newLayer.id,
                    recordid: recordid,
                    data: item,
                    layer: newLayer
                });

            }

            // Create the controls and toolbar.
            var panelControls = this._buildPanelControls();

            // Instantiate the modify feature control.
            this.modifyFeatures = new OpenLayers.Control.ModifyFeature(
                this._currentEditLayer, {
                    standalone: true,
                    onModification: function() {
                        self._trigger('featureadded');
                    }
                }
            );

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

            // Show the edit control markup.
            if (!immediate) { this._fadeUpEditControls(); }
            else { this._popUpEditControls(); }

            // If necessary, reselect a clicked feature.
            $.each(this._currentEditLayer.features, function(i, feature) {
                if (feature === self._clickedFeature) {
                    self.modifyFeatures.selectFeature(self._clickedFeature);
                    return;
                }
            });

        },

        /*
         * Remove editing functionality, return to default mode.
         */
        endEditWithoutSave: function(immediate) {

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

            if (this._currentEditLayer.features.length === 0) {

                // Pop off the layer, remove from database, null the tracker..
                this.map.removeLayer(this._currentEditLayer);
                this._currentVectorLayers.remove(this._currentEditLayer);
                this._db({ layerid: this._currentEditLayer.id }).remove();
                this._currentEditLayer = null;

            }

            // Clear the item tracker, re-add the click controls.
            this._currentEditItem = null;
            this.record = null;
            this._addClickControls();


        },

        /*
         * Get the WKT representation of the current layer.
         */
        getWktForSave: function() {

            var wkts = [];

            this.modifyFeatures.unselectFeature(this._clickedFeature);

            // Push the wkt's onto the array.
            $.each(this._currentEditLayer.features, function(i, feature) {

                // Cast the feature to wkt.
                var wkt = feature.geometry.toString();

                // ** A hack to prevent phantom empty points from getting
                // saved in the wkt strings. It is not clear why these artifacts
                // are getting generated and committed, but they cause erratic
                // bound calculation and zooming bugs. This needs a real fix.
                if (!_.include(['POINT(NaN NaN)', 'POINT()'], wkt)) {
                    wkts.push(wkt);
                }

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

            // Get the record out of the database.
            var record = this._db({ recordid: parseInt(id, 10) }).first();

            // If the record exists and there is a map feature.
            if (record &&
                record.layer.features.length > 0 &&
                record.data.wkt !== 'POINT()') {

                // If there is item-specific data.
                if (record.data.bounds !== null && record.data.zoom !== null) {
                    this.map.zoomToExtent(new OpenLayers.Bounds.fromString(record.data.bounds));
                    this.map.zoomTo(record.data.zoom);
                }

                // Otherwise, just fit the vectors in the viewport.
                else {
                    this.map.zoomToExtent(record.layer.getDataExtent());
                }

            }

        },

        /*
         * Construct a StyleMap object with a given color.
         */
        _getStyleMap: function(
            fillColor,
            fillOpacity,
            strokeColor,
            strokeOpacity,
            strokeWidth,
            pointRadius,
            highlightColor) {

            // Capture fill color.
            var fillColor = (!_.isUndefined(fillColor)) ? fillColor :
                this.options.styles.vector_color;

            // Capture fill opacity.
            var fillOpacity = (!_.isUndefined(fillOpacity)) ? fillOpacity :
                this.options.styles.vector_opacity;

            // Capture stroke color.
            var strokeColor = (!_.isUndefined(strokeColor)) ? strokeColor :
                this.options.styles.stroke_color;

            // Capture highlight color.
            var highlightColor = (!_.isUndefined(highlightColor)) ? highlightColor :
                Neatline.highlightColor;

            // Capture stroke opacity.
            var strokeOpacity = (!_.isUndefined(strokeOpacity)) ? strokeOpacity :
                this.options.styles.stroke_opacity;

            // Capture stroke width.
            var strokeWidth = (!_.isUndefined(strokeWidth)) ? strokeWidth :
                this.options.styles.stroke_width;

            // Capture point radius.
            var pointRadius = (!_.isUndefined(pointRadius)) ? pointRadius :
                this.options.styles.point_radius;

            // Construct and return the StyleMaps.
            return new OpenLayers.StyleMap({
                'default': new OpenLayers.Style({
                    fillColor: fillColor,
                    fillOpacity: fillOpacity,
                    strokeColor: strokeColor,
                    strokeOpacity: strokeOpacity,
                    pointRadius: pointRadius,
                    strokeWidth: strokeWidth
                }),
                'select': new OpenLayers.Style({
                    fillColor: fillColor,
                    fillOpacity: fillOpacity,
                    strokeColor: strokeColor,
                    strokeOpacity: strokeOpacity,
                    pointRadius: pointRadius,
                    strokeWidth: strokeWidth
                }),
                'temporary': new OpenLayers.Style({
                    fillColor: highlightColor,
                    fillOpacity: fillOpacity,
                    strokeColor: highlightColor,
                    strokeOpacity: strokeOpacity,
                    pointRadius: pointRadius,
                    strokeWidth: strokeWidth
                })
            });

        },

        /*
         * Construct the base layer objects, set default.
         */
        _getBaseLayers: function() {

            // Google physical.
            this.gphy = new OpenLayers.Layer.Google(
                "Google Physical",
                {type: google.maps.MapTypeId.TERRAIN}
            );

            // Google streets.
            this.gmap = new OpenLayers.Layer.Google(
                "Google Streets",
                {numZoomLevels: 20}
            );

            // Google hybrid.
            this.ghyb = new OpenLayers.Layer.Google(
                "Google Hybrid",
                {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20}
            );

            // Google sattelite.
            this.gsat = new OpenLayers.Layer.Google(
                "Google Satellite",
                {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
            );

            // OpenStreetMap.
            this.osm = new OpenLayers.Layer.OSM();

            return [this.gphy, this.gmap, this.ghyb, this.gsat, this.osm];

        },

        /*
         * Set the default base layer.
         */
        _setDefaultLayer: function() {

            // Set default.
            switch (Neatline.baseLayer.name) {

                case 'Google Physical':
                    this.map.setBaseLayer(this.ghpy);
                break;

                case 'Google Streets':
                    this.map.setBaseLayer(this.gmap);
                break;

                case 'Google Hybrid':
                    this.map.setBaseLayer(this.ghyb);
                break;

                case 'Google Satellite':
                    this.map.setBaseLayer(this.gsat);
                break;

                case 'OpenStreetMap':
                    this.map.setBaseLayer(this.osm);
                break;

            }

        },


        /*
         * =================
         * Style change handlers.
         * =================
         */


        /*
         * Update the feature color for the current editing layer.
         */
        setCurrentRecordStyle: function(style, value) {

            var self = this;

            // If there is no extant data record, abort.
            if (_.isUndefined(this.record.data)) {
                return;
            }

            // Update the record tracker object.
            this.record.data[style] = value;

            // Rebuild the style map.
            this._currentEditLayer.styleMap = this._getStyleMap(
                this.record.data.vector_color,
                this.record.data.vector_opacity,
                this.record.data.stroke_color,
                this.record.data.stroke_opacity,
                this.record.data.stroke_width,
                this.record.data.point_radius,
                this.record.data.highlight_color);

            // Rerender the layer to manifest the change.
            this._currentEditLayer.redraw();

            // redraw() (above) is _not_ working. This is a hack to
            // trigger a rerender on the features.
            $.each(this._currentEditLayer.features, function(i, feature) {
                self.highlightControl.unhighlight(feature);
            });

        },

        /*
         * Set default style.
         */
        setDefaultStyle: function(style, value) {

            var self = this;

            // Walk the current edit layers.
            this._db().each(function(record, id) {

                // Only push the change if the native style is null.
                if (_.isNull(record.data._native_styles[style])) {

                    // Update the record tracker object.
                    record.data[style] = value;

                    // Rebuild the style map.
                    record.layer.styleMap = self._getStyleMap(
                        record.data.vector_color,
                        record.data.vector_opacity,
                        record.data.stroke_color,
                        record.data.stroke_opacity,
                        record.data.stroke_width,
                        record.data.point_radius,
                        record.data.highlight_color);

                    // Rerender the layer to manifest the change.
                    // record.layer.redraw();

                    // redraw() (above) is _not_ working. This is a hack to
                    // trigger a rerender on the features.
                    $.each(record.layer.features, function(i, feature) {
                        self.highlightControl.unhighlight(feature);
                    });

                }

            });

        },

        /*
         * Render a highlight on an item's vectors.
         */
        highlightVectors: function(recordid) {

            var self = this;

            // Get the item record.
            var record = this._db({
                recordid: parseInt(recordid, 10)
            }).first();

            // If there is no extant data record, abort.
            if (!record || _.isUndefined(record.data)) {
                return;
            }

            // Rebuild the style map.
            record.layer.styleMap = self._getStyleMap(
                record.data.highlight_color,
                record.data.vector_opacity,
                record.data.highlight_color,
                record.data.stroke_opacity,
                record.data.stroke_width,
                record.data.point_radius,
                record.data.highlight_color);

            // Rerender the layer to manifest the change.
            // record.layer.redraw();

            // redraw() (above) is _not_ working. This is a hack to
            // trigger a rerender on the features.
            $.each(record.layer.features, function(i, feature) {
                self.highlightControl.unhighlight(feature);
            });

            // Show the title tip.
            this._showTitleTip(record);

        },

        /*
         * Remove a highlight on an item's vectors.
         */
        unhighlightVectors: function(recordid) {

            var self = this;

            // Get the item record.
            var record = this._db({ recordid: parseInt(recordid, 10) }).first();

            // If there is no extant data record, abort.
            if (_.isUndefined(record.data)) {
                return;
            }

            // Rebuild the style map.
            record.layer.styleMap = self._getStyleMap(
                record.data.vector_color,
                record.data.vector_opacity,
                record.data.stroke_color,
                record.data.stroke_opacity,
                record.data.stroke_width,
                record.data.point_radius,
                record.data.highlight_color);

            // Rerender the layer to manifest the change.
            // record.layer.redraw();

            // redraw() (above) is _not_ working. This is a hack to
            // trigger a rerender on the features.
            $.each(record.layer.features, function(i, feature) {
                self.highlightControl.unhighlight(feature);
            });

            // Hide the title tip.
            this._hideTitleTip();

        },


        /*
         * =================
         * Asset constructors.
         * =================
         */


        /*
         * Build the panel control handler object.
         */
        _buildPanelControls: function() {

            var self = this;

            // Create the controls and toolbar.
            return [

                // Panning.
                new OpenLayers.Control.Navigation(),

                // Draw lines.
                new OpenLayers.Control.DrawFeature(
                    this._currentEditLayer,
                    OpenLayers.Handler.Path, {
                        displayClass: 'olControlDrawFeaturePath',
                        featureAdded: function() {
                            self._trigger('featureadded');
                            self.clickControl.setLayer(self._currentEditLayer);
                        }
                }),

                // Draw points.
                new OpenLayers.Control.DrawFeature(
                    this._currentEditLayer,
                    OpenLayers.Handler.Point, {
                        displayClass: 'olControlDrawFeaturePoint',
                        featureAdded: function() {
                            self._trigger('featureadded');
                            self.clickControl.setLayer(self._currentEditLayer);
                        }
                }),

                // Draw polygons.
                new OpenLayers.Control.DrawFeature(
                    this._currentEditLayer,
                    OpenLayers.Handler.Polygon, {
                        displayClass: 'olControlDrawFeaturePolygon',
                        featureAdded: function() {
                            self._trigger('featureadded');
                            self.clickControl.setLayer(self._currentEditLayer);
                        }
                })

            ];

        },


        /*
         * =================
         * DOM touches.
         * =================
         */


        /*
         * Fade up the geometry add and edit buttons.
         */
        _fadeUpEditControls: function() {

            // Insert the edit geometry button.
            this.element.editgeometry('showButtons', false);

            // Fade up the toolbar.
            $('.' + this.options.markup.toolbar_class).animate({
                'opacity': 1
            }, this.options.animation.fade_duration);

        },

        /*
         * Pop up the geometry add and edit buttons.
         */
        _popUpEditControls: function() {
            $('.' + this.options.markup.toolbar_class).css('opacity', 1);
        },

        /*
         * Build title tooltip.
         */
        _constructTitleTip: function(record) {

            // Construct the tip.
            this.titleTip = $('<div class="title-tip"></div>');
            this.element.append(this.titleTip);

        },

        /*
         * Render title tooltip.
         */
        _showTitleTip: function(record) {

            // Populate title.
            this.titleTip.text(
                $('<span></span>').html(record.data.title).text()
            );

            // Show.
            this.titleTip.css('display', 'block');

        },

        /*
         * Remove title tooltip.
         */
        _hideTitleTip: function() {
            this.titleTip.css('display', 'none');
        }

    });

})(jQuery);
