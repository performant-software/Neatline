/*
 * Unit tests for the Neatline positioning manager.
 */

describe('Positioner', function() {

    describe('_create', function() {

        var neatline;

        beforeEach(function() {

            // Get exhibit markup.
            loadFixtures('neatline.html');

            // Get container and set dimensions.
            neatline = $('#neatline');
            neatline.css({
                'width': 100,
                'height': 100
            });

            // Roll up the positioner.
            neatline.positioner({
                markup: {
                    map:            '#test-map',
                    timeline:       '#test-timeline',
                    items:          '#test-items'
                },
                constants: {
                    h_percent:      30,
                    v_percent:      60
                },
                positions: {
                    is_map:         false,
                    is_timeline:    false,
                    is_items:       false,
                    top:            'map',
                    items_v_pos:    'bottom',
                    items_h_pos:    'right',
                    items_height:   'full'
                }
            });

        });

        it('should select the markup for the component blocks', function() {
            expect(neatline.positioner('getAttr', 'map')).toBe('#test-map');
            expect(neatline.positioner('getAttr', 'timeline')).toBe('#test-timeline');
            expect(neatline.positioner('getAttr', 'items')).toBe('#test-items');
        });

        it('should capture starting parameter defaults', function() {
            expect(neatline.positioner('getAttr', '_is_map')).toBeFalsy();
            expect(neatline.positioner('getAttr', '_is_timeline')).toBeFalsy();
            expect(neatline.positioner('getAttr', '_is_items')).toBeFalsy();
            expect(neatline.positioner('getAttr', '_top')).toEqual('map');
            expect(neatline.positioner('getAttr', '_items_v_pos')).toEqual('bottom');
            expect(neatline.positioner('getAttr', '_items_h_pos')).toEqual('right');
            expect(neatline.positioner('getAttr', '_items_height')).toEqual('full');
        });

        it('should shell out the positions object', function() {
            expect(neatline.positioner('getAttr', 'positions')).toEqual({
                map: {
                    height: null,
                    width:  null,
                    top:    null,
                    left:   null
                },
                timeline: {
                    height: null,
                    width:  null,
                    top:    null,
                    left:   null
                },
                items: {
                    height: null,
                    width:  null,
                    top:    null,
                    left:   null
                }
            });
        });

        it('should call the measure() method by default', function() {
            expect(neatline.positioner('getAttr', 'width')).toBeDefined();
            expect(neatline.positioner('getAttr', 'height')).toBeDefined();
            expect(neatline.positioner('getAttr', 'minorWidth')).toBeDefined();
            expect(neatline.positioner('getAttr', 'majorWidth')).toBeDefined();
            expect(neatline.positioner('getAttr', 'minorHeight')).toBeDefined();
            expect(neatline.positioner('getAttr', 'majorHeight')).toBeDefined();
        });

    });

});
