/*
 * Include dependencies.
 */

var a = 'v2/apps/neatline/';
var v = 'v2/vendor/';

load(

  // jQuery, Underscore, d3.
  v+'jquery/jquery.js',
  v+'underscore/underscore.js',
  v+'d3/d3.js'

).then(

  // Backbone.
  v+'backbone/backbone.js'

).then(

  // Marionette and Socket.io.
  v+'backbone/marionette.js'

).then(

  // Backbone modules.
  v+'backbone/backbone-localstorage.js'

).then(

  // Application.
  a+'app.js'

).then(

  // Collections.

  // Views.

  // Controllers.

).thenRun(function() {

  // Run.
  $(function() {
    Neatline.start();
  });

});
