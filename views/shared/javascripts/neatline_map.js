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

            this.editVectorLayer.addFeatures(new OpenLayers.Feature.Vector(new OpenLayers.Geometry.fromWKT("POLYGON((701101.8338315 4549723.0707275,701037.1305065 4549787.7740525,700778.3172065 4549787.7740525,700390.0972565 4549852.4773775,699807.7673315 4549981.8840275,698966.6241065 4550111.2906775,697931.3709065 4550305.4006525,697025.5243565 4550434.8073025,696313.7877815 4550499.5106275,695925.5678315 4550499.5106275,695796.1611815 4550499.5106275,695666.7545315 4550434.8073025,695666.7545315 4550370.1039775,695602.0512065 4550305.4006525,695537.3478815 4550175.9940025,695537.3478815 4550046.5873525,695537.3478815 4549981.8840275,695472.6445565 4549787.7740525,695472.6445565 4549593.6640775,695472.6445565 4549399.5541025,695407.9412315 4549334.8507775,695407.9412315 4549140.7408025,695407.9412315 4549076.0374775,695407.9412315 4548946.6308275,695472.6445565 4548817.2241775,695472.6445565 4548558.4108775,695537.3478815 4548299.5975775,695602.0512065 4548105.4876025,695666.7545315 4547846.6743025,695731.4578565 4547587.8610025,695925.5678315 4547264.3443775,696184.3811315 4547005.5310775,696766.7110565 4546423.2011525,697349.0409815 4545970.2778775,697931.3709065 4545517.3546025,698707.8108065 4545064.4313275,699484.2507065 4544740.9147025,700131.2839565 4544546.8047275,700454.8005815 4544482.1014025,700713.6138815 4544482.1014025,700843.0205315 4544482.1014025,700972.4271815 4544482.1014025,701360.6471315 4544740.9147025,701942.9770565 4545193.8379775,702460.6036565 4545582.0579275,702784.1202815 4545905.5745525,703042.9335815 4546164.3878525,703431.1535315 4546423.2011525,703625.2635065 4546746.7177775,703689.9668315 4546940.8277525,703689.9668315 4547005.5310775,701101.8338315 4549723.0707275))","POLYGON((699450.61615775 4547353.292565,707473.82845775 4550491.4038275,705306.26707025 4545638.6544525,701521.12255775 4545476.89614,699450.61615775 4547353.292565))")));

        },

        endEditWithoutSave: function() {

            this.map.removeControl(this.editingToolbar);
            this.map.removeLayer(this.editVectorLayer);

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
