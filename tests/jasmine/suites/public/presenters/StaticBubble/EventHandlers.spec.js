
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Static bubble event handler tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Static Bubble Event Handlers', function() {


  var el, model1, model2;


  beforeEach(function() {

    _t.loadNeatline();

    model1 = new Neatline.Shared.Record.Model({
      presenter: 'StaticBubble', title: 'title1', body: 'body1'
    });

    model2 = new Neatline.Shared.Record.Model({
      presenter: 'StaticBubble', title: 'title2', body: 'body2'
    });

  });


  describe('highlight', function() {

    // --------------------------------------------------------------------
    // When the presenter is highlighted, the bubble should populate the
    // title and body fields of the passed model.
    // --------------------------------------------------------------------

    beforeEach(function() {
      Neatline.vent.trigger('highlight', model1);
    });

    it('should populate the title and body', function() {
      expect(_t.vw.BUBBLE.$('.title')).toHaveText('title1');
      expect(_t.vw.BUBBLE.$('.body')).toHaveText('body1');
    });

  });


  describe('unhighlight', function() {

    // --------------------------------------------------------------------
    // When the presenter is unhighlighted, the bubble should be emptied
    // of content and the `bound` class should be removed.
    // --------------------------------------------------------------------

    beforeEach(function() {
      Neatline.vent.trigger('highlight', model1);
      Neatline.vent.trigger('unhighlight', model1);
    });

    it('should empty the bubble', function() {
      expect(_t.vw.BUBBLE.$el).toBeEmpty();
    });

    it('should remove `bound` class', function() {
      expect(_t.vw.BUBBLE.$el).not.toHaveClass('bound');
    });

  });


  describe('select', function() {

    // --------------------------------------------------------------------
    // When the presenter is selected, `bound` and `selected` classes
    // should be added to the bubble. While selected, the bubble should
    // not respond to `select` events for different records, but not to
    // `highlight` or `unhighlight` events.
    // --------------------------------------------------------------------

    beforeEach(function() {
      Neatline.vent.trigger('select', model1);
    });

    it('should add `bound` and `selected` classes', function() {
      expect(_t.vw.BUBBLE.$el).toHaveClass('bound');
      expect(_t.vw.BUBBLE.$el).toHaveClass('selected');
    });

    it('should not respond to `unhighlight` events', function() {
      Neatline.vent.trigger('unhighlight', model1);
      expect(_t.vw.BUBBLE.$el).not.toBeEmpty();
    });

    it('should not respond to `highlight` events', function() {
      Neatline.vent.trigger('highlight', model2);
      expect(_t.vw.BUBBLE.$('.title')).toHaveText('title1');
      expect(_t.vw.BUBBLE.$('.body')).toHaveText('body1');
    });

    it('should respond to `select` events', function() {
      Neatline.vent.trigger('select', model2);
      expect(_t.vw.BUBBLE.$('.title')).toHaveText('title2');
      expect(_t.vw.BUBBLE.$('.body')).toHaveText('body2');
    });

  });


  describe('unselect', function() {

    // --------------------------------------------------------------------
    // When the presenter is unselected, the bubble should be emptied of
    // content and the `bound` and `selected` classes should be removed.
    // --------------------------------------------------------------------

    beforeEach(function() {
      Neatline.vent.trigger('select', model1);
      Neatline.vent.trigger('unselect', model1);
    });

    it('should empty the bubble', function() {
      expect(_t.vw.BUBBLE.$el).toBeEmpty();
    });

    it('should remove `bound` and `selected` classes', function() {
      expect(_t.vw.BUBBLE.$el).not.toHaveClass('bound');
      expect(_t.vw.BUBBLE.$el).not.toHaveClass('selected');
    });

  });


  describe('close', function() {

    // --------------------------------------------------------------------
    // When the bubble is closed, it should be emptied of content and the
    // `bound` and `selected` classes should be removed.
    // --------------------------------------------------------------------

    beforeEach(function() {
      Neatline.vent.trigger('select', model1);
      _t.vw.BUBBLE.$('.close').trigger('click');
    });

    it('should empty the bubble', function() {
      expect(_t.vw.BUBBLE.$el).toBeEmpty();
    });

    it('should remove `bound` and `selected` classes', function() {
      expect(_t.vw.BUBBLE.$el).not.toHaveClass('bound');
      expect(_t.vw.BUBBLE.$el).not.toHaveClass('selected');
    });

  });


  describe('deactivate', function() {

    // --------------------------------------------------------------------
    // When the presenter is deactivated, the bubble should not respond to
    // `highlight` or `select` events.
    // --------------------------------------------------------------------

    beforeEach(function() {
      Neatline.vent.trigger('PRESENTER:deactivate');
    });

    it('should not respond to `highlight` events', function() {
      Neatline.vent.trigger('highlight', model1);
      expect(_t.vw.BUBBLE.$el).toBeEmpty();
    });

    it('should not respond to `select` events', function() {
      Neatline.vent.trigger('select', model1);
      expect(_t.vw.BUBBLE.$el).toBeEmpty();
    });

  });


  describe('activate', function() {

    // --------------------------------------------------------------------
    // When the presenter is activated after being deactivated, the bubble
    // should start responding to `highlight` and `select` events.
    // --------------------------------------------------------------------

    beforeEach(function() {
      Neatline.vent.trigger('PRESENTER:deactivate');
      Neatline.vent.trigger('PRESENTER:activate');
    });

    afterEach(function() {
      expect(_t.vw.BUBBLE.$('.title')).toHaveText('title1');
      expect(_t.vw.BUBBLE.$('.body')).toHaveText('body1');
    });

    it('should start responding to `highlight` events', function() {
      Neatline.vent.trigger('highlight', model1);
    });

    it('should start responding to `select` events', function() {
      Neatline.vent.trigger('select', model1);
    });

  });


});
