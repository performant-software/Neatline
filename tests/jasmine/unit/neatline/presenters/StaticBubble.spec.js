
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Presenters | Static Bubble', function() {


  var el, model1, model2;


  beforeEach(function() {

    NL.loadNeatline();

    model1 = new Neatline.Shared.Record.Model({
      presenter: 'StaticBubble', title: 'title1', body: 'body1'
    });

    model2 = new Neatline.Shared.Record.Model({
      presenter: 'StaticBubble', title: 'title2', body: 'body2'
    });

  });


  describe('highlight', function() {

    beforeEach(function() {
      Neatline.vent.trigger('highlight', { model: model1 });
    });

    it('should populate the title and body', function() {
      expect(NL.vw.BUBBLE.$('.title')).toHaveText('title1');
      expect(NL.vw.BUBBLE.$('.body')).toHaveText('body1');
    });

  });


  describe('unhighlight', function() {

    beforeEach(function() {
      Neatline.vent.trigger('highlight', { model: model1 });
      Neatline.vent.trigger('unhighlight', { model: model1 });
    });

    it('should empty the bubble', function() {
      expect(NL.vw.BUBBLE.$el).toBeEmpty();
    });

    it('should remove `bound` class', function() {
      expect(NL.vw.BUBBLE.$el).not.toHaveClass('bound');
    });

  });


  describe('select', function() {

    beforeEach(function() {
      Neatline.vent.trigger('select', { model: model1 });
    });

    it('should add `bound` and `selected` classes', function() {
      expect(NL.vw.BUBBLE.$el).toHaveClass('bound');
      expect(NL.vw.BUBBLE.$el).toHaveClass('selected');
    });

    it('should not respond to `unhighlight` events', function() {
      Neatline.vent.trigger('unhighlight', { model: model1 });
      expect(NL.vw.BUBBLE.$el).not.toBeEmpty();
    });

    it('should not respond to `highlight` events', function() {
      Neatline.vent.trigger('highlight', { model: model2 });
      expect(NL.vw.BUBBLE.$('.title')).toHaveText('title1');
      expect(NL.vw.BUBBLE.$('.body')).toHaveText('body1');
    });

    it('should respond to `select` events', function() {
      Neatline.vent.trigger('select', { model: model2 });
      expect(NL.vw.BUBBLE.$('.title')).toHaveText('title2');
      expect(NL.vw.BUBBLE.$('.body')).toHaveText('body2');
    });

  });


  describe('unselect', function() {

    beforeEach(function() {
      Neatline.vent.trigger('select', { model: model1 });
      Neatline.vent.trigger('unselect', { model: model1 });
    });

    it('should empty the bubble', function() {
      expect(NL.vw.BUBBLE.$el).toBeEmpty();
    });

    it('should remove `bound` and `selected` classes', function() {
      expect(NL.vw.BUBBLE.$el).not.toHaveClass('bound');
      expect(NL.vw.BUBBLE.$el).not.toHaveClass('selected');
    });

  });


  describe('close', function() {

    var vent;

    beforeEach(function() {
      Neatline.vent.trigger('select', { model: model1 });
      vent = spyOn(Neatline.vent, 'trigger').andCallThrough();
      NL.vw.BUBBLE.$('.close').trigger('click');
    });

    it('should empty the bubble', function() {
      expect(NL.vw.BUBBLE.$el).toBeEmpty();
    });

    it('should remove `bound` and `selected` classes', function() {
      expect(NL.vw.BUBBLE.$el).not.toHaveClass('bound');
      expect(NL.vw.BUBBLE.$el).not.toHaveClass('selected');
    });

    it('should publish `unselect`', function() {
      expect(vent).toHaveBeenCalledWith('unselect', {
        source: 'PRESENTER:StaticBubble',
        model:  model1
      });
    });

  });


  describe('deactivate', function() {

    beforeEach(function() {
      Neatline.vent.trigger('deactivatePresenter');
    });

    it('should not respond to `highlight` events', function() {
      Neatline.vent.trigger('highlight', { model: model1 });
      expect(NL.vw.BUBBLE.$el).toBeEmpty();
    });

    it('should not respond to `select` events', function() {
      Neatline.vent.trigger('select', { model: model1 });
      expect(NL.vw.BUBBLE.$el).toBeEmpty();
    });

  });


  describe('activate', function() {

    beforeEach(function() {
      Neatline.vent.trigger('deactivatePresenter');
      Neatline.vent.trigger('activatePresenter');
    });

    afterEach(function() {
      expect(NL.vw.BUBBLE.$('.title')).toHaveText('title1');
      expect(NL.vw.BUBBLE.$('.body')).toHaveText('body1');
    });

    it('should start responding to `highlight` events', function() {
      Neatline.vent.trigger('highlight', { model: model1 });
    });

    it('should start responding to `select` events', function() {
      Neatline.vent.trigger('select', { model: model1 });
    });

  });


});
