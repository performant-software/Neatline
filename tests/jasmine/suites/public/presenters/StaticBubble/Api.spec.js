
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Static bubble presenter API integration tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Static Bubble API Integration', function() {


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


  describe('show', function() {

    beforeEach(function() {
      Neatline.execute('PRESENTER:show', model1);
    });

    it('should populate the title and body', function() {
      expect(_t.vw.BUBBLE.$('.title')).toHaveText('title1');
      expect(_t.vw.BUBBLE.$('.body')).toHaveText('body1');
    });

  });


  describe('hide', function() {

    beforeEach(function() {
      Neatline.execute('PRESENTER:show', model1);
      Neatline.execute('PRESENTER:hide', model1);
    });

    it('should empty the bubble', function() {
      expect(_t.vw.BUBBLE.$el).toBeEmpty();
    });

    it('should remove `bound` class', function() {
      expect(_t.vw.BUBBLE.$el).not.toHaveClass('bound');
    });

  });


  describe('select', function() {

    beforeEach(function() {
      Neatline.execute('PRESENTER:select', model1);
    });

    it('should add `bound` and `selected` classes', function() {
      expect(_t.vw.BUBBLE.$el).toHaveClass('bound');
      expect(_t.vw.BUBBLE.$el).toHaveClass('selected');
    });

    it('should not respond to `hide` events', function() {
      Neatline.execute('PRESENTER:hide', model1);
      expect(_t.vw.BUBBLE.$el).not.toBeEmpty();
    });

    it('should not respond to `show` events', function() {
      Neatline.execute('PRESENTER:show', model2);
      expect(_t.vw.BUBBLE.$('.title')).toHaveText('title1');
      expect(_t.vw.BUBBLE.$('.body')).toHaveText('body1');
    });

    it('should respond to `select` events', function() {
      Neatline.execute('PRESENTER:select', model2);
      expect(_t.vw.BUBBLE.$('.title')).toHaveText('title2');
      expect(_t.vw.BUBBLE.$('.body')).toHaveText('body2');
    });

  });


  describe('unselect', function() {

    beforeEach(function() {
      Neatline.execute('PRESENTER:select', model1);
      Neatline.execute('PRESENTER:unselect', model1);
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

    beforeEach(function() {
      Neatline.execute('PRESENTER:select', model1);
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

    beforeEach(function() {
      Neatline.vent.trigger('PRESENTER:deactivate');
    });

    it('should not respond to `show` events', function() {
      Neatline.execute('PRESENTER:show', model1);
      expect(_t.vw.BUBBLE.$el).toBeEmpty();
    });

    it('should not respond to `select` events', function() {
      Neatline.execute('PRESENTER:select', model1);
      expect(_t.vw.BUBBLE.$el).toBeEmpty();
    });

  });


  describe('activate', function() {

    beforeEach(function() {
      Neatline.vent.trigger('PRESENTER:deactivate');
      Neatline.vent.trigger('PRESENTER:activate');
    });

    afterEach(function() {
      expect(_t.vw.BUBBLE.$('.title')).toHaveText('title1');
      expect(_t.vw.BUBBLE.$('.body')).toHaveText('body1');
    });

    it('should start responding to `show` events', function() {
      Neatline.execute('PRESENTER:show', model1);
    });

    it('should start responding to `select` events', function() {
      Neatline.execute('PRESENTER:select', model1);
    });

  });


});
