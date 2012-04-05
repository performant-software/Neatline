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
                            self.highlightControl.setLayer(self._currentEditLayer);
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
                            self.highlightControl.setLayer(self._currentEditLayer);
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
                            // self.clickControl.setLayer(self._currentEditLayer);
                            // self.highlightControl.setLayer(self._currentEditLayer);
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
        }

    }));

    $.neatline.neatlinemap.defaults = $.extend(
        {},$.neatline.neatlinemap.defaults);


})( jQuery );
