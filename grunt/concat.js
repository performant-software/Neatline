
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

var nVen = [ // Public vendor.
  '<%= paths.vendor.jquery %>',
  '<%= paths.vendor.jquery_ui %>',
  '<%= paths.vendor.lodash %>',
  '<%= paths.vendor.underscore_s %>',
  '<%= paths.vendor.backbone %>',
  '<%= paths.vendor.mutators %>',
  '<%= paths.vendor.schema %>',
  '<%= paths.vendor.marionette %>',
  '<%= paths.vendor.safesync %>',
  '<%= paths.vendor.openlayers %>',
  '<%= paths.vendor.openlayers_geo %>',
  '<%= paths.vendor.stamen %>',
  '<%= paths.vendor.rivets %>'
];

var nSrc = [ // Public application.
  '<%= paths.src.js.shared %>/*.js',
  '<%= paths.src.js.shared %>/shared/*.js',
  '<%= paths.src.js.shared %>/shared/exhibit/exhibit.model.js',
  '<%= paths.src.js.shared %>/shared/record/record.model.js',
  '<%= paths.src.js.shared %>/shared/record/record.collection.js',
  '<%= paths.src.js.shared %>/shared/widget/*.js',
  '<%= paths.src.js.shared %>/broker/*.js',
  '<%= paths.src.js.shared %>/map/**/*.js',
  '<%= paths.src.js.shared %>/presenter/*.js',
  '<%= paths.src.js.shared %>/presenter/StaticBubble/*.js'
];

var eVen = [ // Editor vendor.
  '<%= paths.vendor.routefilter %>',
  '<%= paths.vendor.svgtowkt %>',
  '<%= paths.vendor.draggable %>',
  '<%= paths.vendor.toastr %>',
  '<%= paths.vendor.spectrum %>',
  '<%= paths.vendor.bootstrap %>',
  '<%= paths.vendor.ace %>',
  '<%= paths.vendor.ace_theme %>',
  '<%= paths.vendor.ace_mode %>',
  '<%= paths.vendor.select2 %>',
  '<%= paths.vendor.uri %>'
];

var eSrc = [ // Editor application.
  '<%= paths.src.js.shared %>/editor/*.js',
  '<%= paths.src.js.shared %>/editor/exhibit/**/*.js',
  '<%= paths.src.js.shared %>/editor/record/**/*.js',
  '<%= paths.src.js.shared %>/editor/map/*.js'
];

module.exports = {

  add_form: {
    src: [
      '<%= paths.vendor.underscore_s %>',
      '<%= paths.vendor.chosen %>',
      '<%= paths.src.js.admin %>/exhibit-form.js',
      '<%= paths.src.js.admin %>/slug-autogen.js'
    ],
    dest: '<%= paths.dist.js.admin %>/add-form.js'
  },

  edit_form: {
    src: [
      '<%= paths.vendor.chosen %>',
      '<%= paths.src.js.admin %>/exhibit-form.js'
    ],
    dest: '<%= paths.dist.js.admin %>/edit-form.js'
  },

  neatline_public: {
    src: [].concat(nVen, nSrc),
    dest: '<%= paths.dist.js.shared %>/neatline-public.js'
  },

  neatline_editor: {
    src: [].concat(nVen, eVen, nSrc, eSrc),
    dest: '<%= paths.dist.js.shared %>/neatline-editor.js'
  },

  jasmine_vendor: {
    src: [
      '<%= paths.vendor.uri %>',
      '<%= paths.vendor.jasmine_jquery %>',
      '<%= paths.vendor.jasmine_async %>',
      '<%= paths.vendor.sinon %>',
      '<%= paths.jasmine %>/assertions/*.js',
      '<%= paths.jasmine %>/helpers/*.js'
    ],
    dest: '<%= paths.jasmine %>/dist/vendor.js'
  }

};
