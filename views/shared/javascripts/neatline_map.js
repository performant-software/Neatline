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

            }

        },

        _create: function() {

            // Getters.
            this.params = Neatline;

            // Ignition.
            this._instantiateOpenLayers();

            // Trackers and buckets.
            this._isData = false;
            this._currentVectorLayers = [];

            // Load data.
            this.loadData();

        },

        _instantiateOpenLayers: function() {

            OpenLayers.IMAGE_RELOAD_ATTEMTPS = 3;
            OpenLayers.Util.onImageLoadErrorColor = "transparent";
            OpenLayers.ImgPath = 'http://js.mapbox.com/theme/dark/';

            var tiled;
            var pureCoverage = true;
            // pink tile avoidance
            OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
            // make OL compute scale according to WMS spec
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
                  new OpenLayers.Control.LayerSwitcher({'ascending': false}),
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
                });
            }

            // Hit the json server.
            $.ajax({

                url: this.params.dataSources.map,
                dataType: 'json',

                success: function(data) {
                    self._buildVectorLayers(data);
                    self._isData = true;
                }

            });

        },

        _buildVectorLayers: function(data) {

            var self = this;

            // Instantiate associations object.
            this.idToLayer = {};

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

                // Add to the layers array.
                self._currentVectorLayers.push(vectorLayer);

            });

        },

        edit: function(item) {

            // Get the id of the item and try to fetch the layer.
            var itemId = item.attr('recordid');
            this.currentEditLayer = this.idToLayer[itemId];
            this._newVectors = false;

            // If the item does not have an existing vector layer, create a new one.
            if (!this.currentEditLayer) {
                var itemName = item.find('span.item-title-text').text();
                this.currentEditLayer = new OpenLayers.Layer.Vector(itemName);
                this.map.addLayer(this.currentEditLayer);
                this._newVectors = true;
            }

            // Create the toolbar control.
            this.editingToolbar = new OpenLayers.Control.EditingToolbar(this.currentEditLayer);

            // Add the layer and show the toolbar.
            this.map.addControl(this.editingToolbar);

        },

        endEditWithoutSave: function() {

            // Remove controls.
            this.map.removeControl(this.editingToolbar);

            if (this._newVectors) {
                this.map.removeLayer(this.currentEditLayer);
            }

        },

        getWktForSave: function() {

            var wkts = {};

            // Push each of the wkt representations of the geometry
            // onto the array.
            $.each(this.currentEditLayer.features, function(i, feature) {
                wkts[i] = feature.geometry.toString();
            });

            return wkts;

        },

        zoomToItemVectors: function(id) {

            var layer = this.idToLayer[id];
            this.map.zoomToExtent(layer.getDataExtent());

        }

    });


})( jQuery );
