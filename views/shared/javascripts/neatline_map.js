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
                maxResolution: 64.70332499999859,
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

        edit: function(item) {

            // Get the name of the item for the layer listing.
            var itemName = item.find('span.item-title-text').text();

            // Create the new vector layer and the toolbar contro.
            this.editVectorLayer = new OpenLayers.Layer.Vector(itemName);
            this.editingToolbar = new OpenLayers.Control.EditingToolbar(this.editVectorLayer);

            // Add the layer and show the toolbar.
            this.map.addLayer(this.editVectorLayer);
            this.map.addControl(this.editingToolbar);

        },

        endEditWithoutSave: function() {

            this.map.removeControl(this.editingToolbar);
            this.map.removeLayer(this.editVectorLayer, this.baseLayer);

        },

        getWktForSave: function() {

            var wkts = {};

            // Push each of the wkt representations of the geometry
            // onto the array.
            $.each(this.editVectorLayer.features, function(i, feature) {
                wkts[i] = feature.geometry.toString();
            });

            return wkts;

        }

    });


})( jQuery );
