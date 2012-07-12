/**
 * Editing functionality for map.
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


    $.widget('neatline.mapeditor', $.extend(
        {}, $.neatline.neatlinemap.prototype, {

        /*
         * Instantiate the editor.
         */
        _create: function() {

            // Construct the editing manager.
            this._instantiateEditor();
            this.toolbar = null;

            return $.neatline.neatlinemap.prototype._create.apply(
                this,
                arguments
            );

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
            this.panelControls = this._buildPanelControls();

            this.panelControls[0].events.register('activate', this, function(ev) {
                self.element.trigger('drawingmodeoff');
            });

            var i, pclen = this.panelControls.length;
            for (i=1; i<pclen; i++) {
                var pc = this.panelControls[i];
                pc.events.register('activate', this, function(ev) {
                    self.element.trigger('drawingmodeon');
                });
                pc.events.register('deactivate', this, function(ev) {
                    self.element.trigger('drawingmodeoff');
                });
            }

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
                defaultControl: this.panelControls[0],
                displayClass: 'olControlEditingToolbar'
            });

            // Add the controls.
            this.editToolbar.addControls(this.panelControls);

            // Show the toolbar, add and activate the other controls.
            this.map.addControl(this.editToolbar);
            this.map.addControl(this.modifyFeatures);
            this.modifyFeatures.activate();

            // Show the edit control markup.
            this.toolbar = $('.olControlEditingToolbar');
            this._popUpEditControls();
            this._positionToolbar();

            // If necessary, reselect a clicked feature.
            $.each(this._currentEditLayer.features, function(i, feature) {
                if (feature === self._clickedFeature) {
                    self.modifyFeatures.selectFeature(self._clickedFeature);
                }
            });

        },

        /*
         * Remove editing functionality, return to default mode.
         */
        endEditWithoutSave: function(immediate) {

            // Unselect a selected feature.
            if (!_.isUndefined(this.modifyFeatures)) {
                this.modifyFeatures.unselectFeature(this._clickedFeature);
            }

            // Remove controls.
            this.map.removeControl(this.modifyFeatures);
            this.map.removeControl(this.editToolbar);
            this.element.editgeometry('hideButtons');

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
            this.cancelSketch();

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
         * Cancel the current sketch.
         */
        cancelSketch: function() {
            _.each(this.panelControls.slice(1,4), function(control) {
                control.cancel();
            });
        },

        /*
         * Get the current extent of the viewport.
         */
        getExtentForSave: function() {
            return this.map.getExtent().toString();
        },

        /*
         * Get the current center of the viewport.
         */
        getCenterForSave: function() {
            return this.map.getCenter().toShortString();
        },

        /*
         * Get the current zoom of the viewport.
         */
        getZoomForSave: function() {
            return this.map.getZoom();
        },

        /*
         * Get the current base layer for save.
         */
        getBaseLayerForSave: function() {
            return this.map.baseLayer.name;
        },


        /*
         * ======================
         * Style change handlers.
         * ======================
         */


        /*
         * Update the feature color for the current editing layer.
         */
        setCurrentRecordStyle: function(style, value) {

            // console.log(value);

            var self = this;

            // If there is no extant data record, abort.
            if (_.isNull(this.record) || _.isUndefined(this.record.data)) {
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
                this.record.data.point_image,
                this.record.data.highlight_color,
                this.record.data.select_opacity,
                this.record.data.graphic_opacity
            );

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
                        record.data.point_image,
                        record.data.highlight_color,
                        record.data.select_opacity,
                        record.data.graphic_opacity
                    );

                    // Rerender the layer to manifest the change.
                    $.each(record.layer.features, function(i, feature) {
                        self.highlightControl.unhighlight(feature);
                    });

                }

            });

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
                            self._addClickControls();
                        }
                }),

                // Draw points.
                new OpenLayers.Control.DrawFeature(
                    this._currentEditLayer,
                    OpenLayers.Handler.Point, {
                        displayClass: 'olControlDrawFeaturePoint',
                        featureAdded: function() {
                            self._trigger('featureadded');
                            self._addClickControls();
                        }
                }),

                // Draw polygons.
                new OpenLayers.Control.DrawFeature(
                    this._currentEditLayer,
                    OpenLayers.Handler.Polygon, {
                        displayClass: 'olControlDrawFeaturePolygon',
                        featureAdded: function() {
                            self._trigger('featureadded');
                            self._addClickControls();
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
         * Pop up the geometry add and edit buttons.
         */
        _popUpEditControls: function() {

            // Insert the edit geometry button.
            this.element.editgeometry('showButtons', false);
            this.toolbar.css('opacity', 1);
        },

        /*
         * Position the geometry toolbar.
         */
        _positionToolbar: function() {

            if (_.isNull(this.toolbar)) { return; }

            // Container.
            this.toolbar.css({
                top: this.pos.top+17,
                left: this.pos.left+60
            });

        },

        /*
         * Re-render the map and reposition the edit controls.
         */
        refresh: function(pos) {

            this.pos = pos;

            // Rerender map.
            this.map.updateSize();
            this.positionControls(
                pos.top,
                pos.left,
                pos.width,
                pos.height
            );

            // Position the controls.
            this.element.editgeometry('positionControls',
                pos.top,
                pos.left,
                pos.width,
                pos.height
            );

        }

    }));

    $.neatline.neatlinemap.defaults = $.extend(
        {},$.neatline.neatlinemap.defaults);


})( jQuery );
