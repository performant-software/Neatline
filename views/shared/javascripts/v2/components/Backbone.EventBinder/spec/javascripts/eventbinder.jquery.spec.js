describe("When binding to a jQuery object", function(){

  var binding, binder, element, handler;

  beforeEach(function(){
    handler = jasmine.createSpy().andCallFake(function(){
      console.log('clicked')
    });
    binder = new Backbone.EventBinder();
    element = $('<p></p>');
    binding = binder.bindTo(element, "click", handler);
  });

  it("should store binding with type 'jquery'", function(){
    expect(binding.type).toEqual('jquery');
  });

  it("should execute the handler upon simulated click", function(){
    element.click();
    expect(handler).toHaveBeenCalled();
  });

  it("should unbind handlers", function(){
    binder.unbindAll();
    element.click();
    expect(handler).not.toHaveBeenCalled();
  });

});

