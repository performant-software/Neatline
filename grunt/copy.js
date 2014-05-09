
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

module.exports = {

  bootstrap: {
    files: [{
      src: '<%= paths.copy.bootstrap %>/dist/fonts/*',
      dest: 'views/shared/css/fonts/',
      flatten: true,
      expand: true
    }]
  },

  openlayers: {
    files: [{
      src: '<%= paths.copy.openlayers %>/dark/*',
      dest: 'views/shared/images/dark',
      flatten: true,
      expand: true
    }]
  },

  chosen: {
    files: [{
      src: '<%= paths.copy.chosen %>/*.png',
      dest: '<%= paths.dist.css.admin %>',
      flatten: true,
      expand: true
    }]
  },

  jquery_ui: {
    files: [{
      src: '<%= paths.copy.jquery_ui %>/themes/smoothness/images/*',
      dest: '<%= paths.dist.css.shared %>/images',
      flatten: true,
      expand: true
    }]
  },

  select2: {
    files: [{
      src: [
        '<%= paths.copy.select2 %>/*.png',
        '<%= paths.copy.select2 %>/*.gif'
      ],
      dest: '<%= paths.dist.css.shared %>',
      flatten: true,
      expand: true
    }]
  },

  ckeditor: {
    files: [{
      cwd: '<%= paths.copy.ckeditor %>',
      src: '**',
      dest: '<%= paths.dist.js.shared %>/ckeditor/',
      expand: true
    }]
  }

};
