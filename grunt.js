/*
 * Grunt file.
 */

module.exports = function(grunt) {

  grunt.initConfig({

    concat: {

      'public': {
        src: [],
        dest: ''
      },

      editor: {
        src: [],
        dest: ''
      }

    },

    min: {

      'public': {
        src: [],
        dest: ''
      },

      editor: {
        src: [],
        dest: ''
      }

    },

    watch: {
      'public': {
        files: ['<config:concat.public.src>'],
        tasks: ['concat:poem']
      },
      editor: {
        files: ['<config:concat.editor.src>'],
        tasks: ['concat:admin']
      }
    }

  });

};
