/*
 * Unit tests for the Neatline positioning manager.
 */

describe('Positioner', function() {

    describe('_create', function() {

        var neatline;

        beforeEach(function() {

            // Get exhibit markup.
            loadFixtures('neatline-base-markup.html');

            // Get container and set dimensions.
            neatline = $('#neatline');
            neatline.css({
                'width': 100,
                'height': 100
            });

            // Roll up the positioner.
            neatline.positioner({
                markup: {
                    map:            '#map',
                    timeline:       '#timeline',
                    items:          '#items'
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

            expect(neatline.positioner('getAttr', 'map')).toBe('#map');
            expect(neatline.positioner('getAttr', 'timeline')).toBe('#timeline');
            expect(neatline.positioner('getAttr', 'items')).toBe('#items');

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

    describe('measure', function() {

        var neatline;

        beforeEach(function() {

            // Get exhibit markup.
            loadFixtures('neatline-base-markup.html');

            // Get container and set dimensions.
            neatline = $('#neatline');
            neatline.css({
                'width': 100,
                'height': 100
            });

            // Roll up the positioner.
            neatline.positioner({
                markup: {
                    map:            '#map',
                    timeline:       '#timeline',
                    items:          '#items'
                },
                constants: {
                    h_percent:      30,
                    v_percent:      60
                }
            });

        });

        it('should compute constants based on options at startup', function() {

            expect(neatline.positioner('getAttr', 'width')).toEqual(100);
            expect(neatline.positioner('getAttr', 'height')).toEqual(100);
            expect(neatline.positioner('getAttr', 'minorWidth')).toEqual(30);
            expect(neatline.positioner('getAttr', 'majorWidth')).toEqual(70);
            expect(neatline.positioner('getAttr', 'minorHeight')).toEqual(40);
            expect(neatline.positioner('getAttr', 'majorHeight')).toEqual(60);

        });

        it('should compute new constants correctly after a container resize', function() {

            // Change the size of the container.
            neatline.css({
                'width': 200,
                'height': 200
            });

            // Re-measure.
            neatline.positioner('measure');

            expect(neatline.positioner('getAttr', 'width')).toEqual(200);
            expect(neatline.positioner('getAttr', 'height')).toEqual(200);
            expect(neatline.positioner('getAttr', 'minorWidth')).toEqual(60);
            expect(neatline.positioner('getAttr', 'majorWidth')).toEqual(140);
            expect(neatline.positioner('getAttr', 'minorHeight')).toEqual(80);
            expect(neatline.positioner('getAttr', 'majorHeight')).toEqual(120);

        });

    });

    describe('compute', function() {

        var neatline;

        beforeEach(function() {

            // Get exhibit markup.
            loadFixtures('neatline-base-markup.html');

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
            });

        });

        describe('MAP and TIMELINE and ITEMS', function() {

            describe('MAP top, TIMELINE bottom', function() {

                it('CASE: ITEMS left, bottom, partial', function() {

                    var positions = neatline.positioner('compute',
                        true,
                        true,
                        true,
                        'map',
                        'bottom',
                        'left',
                        'partial'
                    );

                    expect(positions).toEqual({
                        map: {
                            height: 60,
                            width:  100,
                            top:    0,
                            left:   0
                        },
                        timeline: {
                            height: 40,
                            width:  70,
                            top:    60,
                            left:   30
                        },
                        items: {
                            height: 40,
                            width:  30,
                            top:    60,
                            left:   0
                        }
                    });

                });

                it('CASE: ITEMS left, top, partial', function() {

                    var positions = neatline.positioner('compute',
                        true,
                        true,
                        true,
                        'map',
                        'top',
                        'left',
                        'partial'
                    );

                    expect(positions).toEqual({
                        map: {
                            height: 60,
                            width:  70,
                            top:    0,
                            left:   30
                        },
                        timeline: {
                            height: 40,
                            width:  100,
                            top:    60,
                            left:   0
                        },
                        items: {
                            height: 60,
                            width:  30,
                            top:    0,
                            left:   0
                        }
                    });

                });

                it('CASE: ITEMS left, full; with v_pos TOP', function() {

                    var positions = neatline.positioner('compute',
                        true,
                        true,
                        true,
                        'map',
                        'top',
                        'left',
                        'full'
                    );

                    expect(positions).toEqual({
                        map: {
                            height: 60,
                            width:  70,
                            top:    0,
                            left:   30
                        },
                        timeline: {
                            height: 40,
                            width:  70,
                            top:    60,
                            left:   30
                        },
                        items: {
                            height: 100,
                            width:  30,
                            top:    0,
                            left:   0
                        }
                    });

                });

                it('CASE: ITEMS left, full; with v_pos BOTTOM', function() {

                    var positions = neatline.positioner('compute',
                        true,
                        true,
                        true,
                        'map',
                        'bottom',
                        'left',
                        'full'
                    );

                    expect(positions).toEqual({
                        map: {
                            height: 60,
                            width:  70,
                            top:    0,
                            left:   30
                        },
                        timeline: {
                            height: 40,
                            width:  70,
                            top:    60,
                            left:   30
                        },
                        items: {
                            height: 100,
                            width:  30,
                            top:    0,
                            left:   0
                        }
                    });

                });

                it('CASE: ITEMS right, bottom, partial', function() {

                    var positions = neatline.positioner('compute',
                        true,
                        true,
                        true,
                        'map',
                        'bottom',
                        'right',
                        'partial'
                    );

                    expect(positions).toEqual({
                        map: {
                            height: 60,
                            width:  100,
                            top:    0,
                            left:   0
                        },
                        timeline: {
                            height: 40,
                            width:  70,
                            top:    60,
                            left:   0
                        },
                        items: {
                            height: 40,
                            width:  30,
                            top:    60,
                            left:   70
                        }
                    });

                });

                it('CASE: ITEMS right, top, partial', function() {

                    var positions = neatline.positioner('compute',
                        true,
                        true,
                        true,
                        'map',
                        'top',
                        'right',
                        'partial'
                    );

                    expect(positions).toEqual({
                        map: {
                            height: 60,
                            width:  70,
                            top:    0,
                            left:   0
                        },
                        timeline: {
                            height: 40,
                            width:  100,
                            top:    60,
                            left:   0
                        },
                        items: {
                            height: 60,
                            width:  30,
                            top:    0,
                            left:   70
                        }
                    });

                });

                it('CASE: ITEMS right, full; with v_pos TOP', function() {

                    var positions = neatline.positioner('compute',
                        true,
                        true,
                        true,
                        'map',
                        'top',
                        'right',
                        'full'
                    );

                    expect(positions).toEqual({
                        map: {
                            height: 60,
                            width:  70,
                            top:    0,
                            left:   0
                        },
                        timeline: {
                            height: 40,
                            width:  70,
                            top:    60,
                            left:   0
                        },
                        items: {
                            height: 100,
                            width:  30,
                            top:    0,
                            left:   70
                        }
                    });

                });

                it('CASE: ITEMS right, full; with v_pos BOTTOM', function() {

                    var positions = neatline.positioner('compute',
                        true,
                        true,
                        true,
                        'map',
                        'bottom',
                        'right',
                        'full'
                    );

                    expect(positions).toEqual({
                        map: {
                            height: 60,
                            width:  70,
                            top:    0,
                            left:   0
                        },
                        timeline: {
                            height: 40,
                            width:  70,
                            top:    60,
                            left:   0
                        },
                        items: {
                            height: 100,
                            width:  30,
                            top:    0,
                            left:   70
                        }
                    });

                });

            });

            describe('MAP bottom, TIMELINE top', function() {

                it('CASE: ITEMS left, bottom, partial', function() {

                    var positions = neatline.positioner('compute',
                        true,
                        true,
                        true,
                        'timeline',
                        'bottom',
                        'left',
                        'partial'
                    );

                    expect(positions).toEqual({
                        map: {
                            height: 40,
                            width:  70,
                            top:    60,
                            left:   30
                        },
                        timeline: {
                            height: 60,
                            width:  100,
                            top:    0,
                            left:   0
                        },
                        items: {
                            height: 40,
                            width:  30,
                            top:    60,
                            left:   0
                        }
                    });

                });

                it('CASE: ITEMS left, top, partial', function() {

                    var positions = neatline.positioner('compute',
                        true,
                        true,
                        true,
                        'timeline',
                        'top',
                        'left',
                        'partial'
                    );

                    expect(positions).toEqual({
                        map: {
                            height: 40,
                            width:  100,
                            top:    60,
                            left:   0
                        },
                        timeline: {
                            height: 60,
                            width:  70,
                            top:    0,
                            left:   30
                        },
                        items: {
                            height: 60,
                            width:  30,
                            top:    0,
                            left:   0
                        }
                    });

                });

                it('CASE: ITEMS left, full; with v_pos TOP', function() {

                    var positions = neatline.positioner('compute',
                        true,
                        true,
                        true,
                        'timeline',
                        'top',
                        'left',
                        'full'
                    );

                    expect(positions).toEqual({
                        map: {
                            height: 40,
                            width:  70,
                            top:    60,
                            left:   30
                        },
                        timeline: {
                            height: 60,
                            width:  70,
                            top:    0,
                            left:   30
                        },
                        items: {
                            height: 100,
                            width:  30,
                            top:    0,
                            left:   0
                        }
                    });

                });

                it('CASE: ITEMS left, full; with v_pos BOTTOM', function() {

                    var positions = neatline.positioner('compute',
                        true,
                        true,
                        true,
                        'timeline',
                        'bottom',
                        'left',
                        'full'
                    );

                    expect(positions).toEqual({
                        map: {
                            height: 40,
                            width:  70,
                            top:    60,
                            left:   30
                        },
                        timeline: {
                            height: 60,
                            width:  70,
                            top:    0,
                            left:   30
                        },
                        items: {
                            height: 100,
                            width:  30,
                            top:    0,
                            left:   0
                        }
                    });

                });

                it('CASE: ITEMS right, bottom, partial', function() {

                    var positions = neatline.positioner('compute',
                        true,
                        true,
                        true,
                        'timeline',
                        'bottom',
                        'right',
                        'partial'
                    );

                    expect(positions).toEqual({
                        map: {
                            height: 40,
                            width:  70,
                            top:    60,
                            left:   0
                        },
                        timeline: {
                            height: 60,
                            width:  100,
                            top:    0,
                            left:   0
                        },
                        items: {
                            height: 40,
                            width:  30,
                            top:    60,
                            left:   70
                        }
                    });

                });

                it('CASE: ITEMS right, top, partial', function() {

                    var positions = neatline.positioner('compute',
                        true,
                        true,
                        true,
                        'timeline',
                        'top',
                        'right',
                        'partial'
                    );

                    expect(positions).toEqual({
                        map: {
                            height: 40,
                            width:  100,
                            top:    60,
                            left:   0
                        },
                        timeline: {
                            height: 60,
                            width:  70,
                            top:    0,
                            left:   0
                        },
                        items: {
                            height: 60,
                            width:  30,
                            top:    0,
                            left:   70
                        }
                    });

                });

                it('CASE: ITEMS right, full; with v_pos TOP', function() {

                    var positions = neatline.positioner('compute',
                        true,
                        true,
                        true,
                        'timeline',
                        'top',
                        'right',
                        'full'
                    );

                    expect(positions).toEqual({
                        map: {
                            height: 40,
                            width:  70,
                            top:    60,
                            left:   0
                        },
                        timeline: {
                            height: 60,
                            width:  70,
                            top:    0,
                            left:   0
                        },
                        items: {
                            height: 100,
                            width:  30,
                            top:    0,
                            left:   70
                        }
                    });

                });

                it('CASE: ITEMS right, full; with v_pos BOTTOM', function() {

                    var positions = neatline.positioner('compute',
                        true,
                        true,
                        true,
                        'timeline',
                        'bottom',
                        'right',
                        'full'
                    );

                    expect(positions).toEqual({
                        map: {
                            height: 40,
                            width:  70,
                            top:    60,
                            left:   0
                        },
                        timeline: {
                            height: 60,
                            width:  70,
                            top:    0,
                            left:   0
                        },
                        items: {
                            height: 100,
                            width:  30,
                            top:    0,
                            left:   70
                        }
                    });

                });

            });

        });

        describe('MAP and ITEMS', function() {

            it('CASE: MAP left, ITEMS right', function() {

                var positions = neatline.positioner('compute',
                    true,
                    false,
                    true,
                    'timeline', // inert.
                    'bottom', // inert.
                    'right',
                    'full' // inert
                );

                expect(positions).toEqual({
                    map: {
                        height: 100,
                        width:  70,
                        top:    0,
                        left:   0
                    },
                    timeline: {
                        height: null,
                        width:  null,
                        top:    null,
                        left:   null
                    },
                    items: {
                        height: 100,
                        width:  30,
                        top:    0,
                        left:   70
                    }
                });

            });

            it('CASE: MAP right, ITEMS left', function() {

                var positions = neatline.positioner('compute',
                    true,
                    false,
                    true,
                    'timeline', // inert.
                    'bottom', // inert.
                    'left',
                    'full' // inert
                );

                expect(positions).toEqual({
                    map: {
                        height: 100,
                        width:  70,
                        top:    0,
                        left:   30
                    },
                    timeline: {
                        height: null,
                        width:  null,
                        top:    null,
                        left:   null
                    },
                    items: {
                        height: 100,
                        width:  30,
                        top:    0,
                        left:   0
                    }
                });

            });

        });

        describe('TIMELINE and ITEMS', function() {

            it('CASE: TIMELINE left, ITEMS right', function() {

                var positions = neatline.positioner('compute',
                    false,
                    true,
                    true,
                    'timeline', // inert.
                    'bottom', // inert.
                    'right',
                    'full' // inert
                );

                expect(positions).toEqual({
                    map: {
                        height: null,
                        width:  null,
                        top:    null,
                        left:   null
                    },
                    timeline: {
                        height: 100,
                        width:  70,
                        top:    0,
                        left:   0
                    },
                    items: {
                        height: 100,
                        width:  30,
                        top:    0,
                        left:   70
                    }
                });

            });

            it('CASE: MAP right, ITEMS left', function() {

                var positions = neatline.positioner('compute',
                    false,
                    true,
                    true,
                    'timeline', // inert.
                    'bottom', // inert.
                    'left',
                    'full' // inert
                );

                expect(positions).toEqual({
                    map: {
                        height: null,
                        width:  null,
                        top:    null,
                        left:   null
                    },
                    timeline: {
                        height: 100,
                        width:  70,
                        top:    0,
                        left:   30
                    },
                    items: {
                        height: 100,
                        width:  30,
                        top:    0,
                        left:   0
                    }
                });

            });

        });

        describe('MAP and TIMELINE', function() {

            it('CASE: MAP top, TIMELINE bottom', function() {

                var positions = neatline.positioner('compute',
                    true,
                    true,
                    false,
                    'map',
                    'bottom', // inert.
                    'right', // inert.
                    'full' // inert
                );

                expect(positions).toEqual({
                    map: {
                        height: 60,
                        width:  100,
                        top:    0,
                        left:   0
                    },
                    timeline: {
                        height: 40,
                        width:  100,
                        top:    60,
                        left:   0
                    },
                    items: {
                        height: null,
                        width:  null,
                        top:    null,
                        left:   null
                    }
                });

            });

            it('CASE: MAP bottom, TIMELINE top', function() {

                var positions = neatline.positioner('compute',
                    true,
                    true,
                    false,
                    'timeline',
                    'bottom', // inert.
                    'right', // inert.
                    'full' // inert
                );

                expect(positions).toEqual({
                    map: {
                        height: 40,
                        width:  100,
                        top:    60,
                        left:   0
                    },
                    timeline: {
                        height: 60,
                        width:  100,
                        top:    0,
                        left:   0
                    },
                    items: {
                        height: null,
                        width:  null,
                        top:    null,
                        left:   null
                    }
                });

            });

        });

        describe('MAP', function() {

            it('CASE: MAP', function() {

                var positions = neatline.positioner('compute',
                    true,
                    false,
                    false,
                    'map', // insert.
                    'bottom', // inert.
                    'right', // inert.
                    'full' // inert
                );

                expect(positions).toEqual({
                    map: {
                        height: 100,
                        width:  100,
                        top:    0,
                        left:   0
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

        });

        describe('TIMELINE', function() {

            it('CASE: TIMELINE', function() {

                var positions = neatline.positioner('compute',
                    false,
                    true,
                    false,
                    'map', // insert.
                    'bottom', // inert.
                    'right', // inert.
                    'full' // inert
                );

                expect(positions).toEqual({
                    map: {
                        height: null,
                        width:  null,
                        top:    null,
                        left:   null
                    },
                    timeline: {
                        height: 100,
                        width:  100,
                        top:    0,
                        left:   0
                    },
                    items: {
                        height: null,
                        width:  null,
                        top:    null,
                        left:   null
                    }
                });

            });

        });

    });

    describe('apply', function() {

        var neatline;

        beforeEach(function() {

            // Get exhibit markup.
            loadFixtures('neatline-base-markup.html');

            // Get container and set dimensions.
            neatline = $('#neatline');
            neatline.css({
                'width': 100,
                'height': 100
            });

            // Roll up the positioner.
            neatline.positioner({
                markup: {
                    map:            '#map',
                    timeline:       '#timeline',
                    items:          '#items'
                },
                constants: {
                    h_percent:      30,
                    v_percent:      60
                },
            });

        });

        describe('existence manifesting', function() {

            describe('non-existence', function() {

                it('should render non-existence on the map', function() {

                    neatline.positioner('compute',
                        false,
                        true,
                        false,
                        'map',
                        'bottom',
                        'left',
                        'partial'
                    );

                    neatline.positioner('apply');

                    expect(neatline.positioner('getAttr', 'map')).not.toBeVisible();

                });

                it('should render non-existence on the timeline', function() {

                    neatline.positioner('compute',
                        true,
                        false,
                        false,
                        'map',
                        'bottom',
                        'left',
                        'partial'
                    );

                    neatline.positioner('apply');

                    expect(neatline.positioner('getAttr', 'timeline')).not.toBeVisible();

                });

                it('should render non-existence on the timeline', function() {

                    neatline.positioner('compute',
                        true,
                        false,
                        false,
                        'map',
                        'bottom',
                        'left',
                        'partial'
                    );

                    neatline.positioner('apply');

                    expect(neatline.positioner('getAttr', 'items')).not.toBeVisible();

                });

            });

            describe('existence', function() {

                it('should render existence on the map', function() {

                    neatline.positioner('compute',
                        true,
                        true,
                        true,
                        'map',
                        'bottom',
                        'left',
                        'partial'
                    );

                    neatline.positioner('apply');

                    expect(neatline.positioner('getAttr', 'map')).toBeVisible();

                });

                it('should render existence on the timeline', function() {

                    neatline.positioner('compute',
                        true,
                        true,
                        true,
                        'map',
                        'bottom',
                        'left',
                        'partial'
                    );

                    neatline.positioner('apply');

                    expect(neatline.positioner('getAttr', 'timeline')).toBeVisible();

                });

                it('should render existence on the timeline', function() {

                    neatline.positioner('compute',
                        true,
                        true,
                        true,
                        'map',
                        'bottom',
                        'left',
                        'partial'
                    );

                    neatline.positioner('apply');

                    expect(neatline.positioner('getAttr', 'items')).toBeVisible();

                });

            });

        });

        describe('parameter manifesting', function() {

            it('should render positioning styles on the map', function() {

                neatline.positioner('compute',
                    true,
                    true,
                    true,
                    'map',
                    'bottom',
                    'left',
                    'partial'
                );

                neatline.positioner('apply');
                var mapStyle = neatline.positioner('getAttr', 'map').attr('style');

                expect(mapStyle).toContain('height: 60px');
                expect(mapStyle).toContain('width: 100px');
                expect(mapStyle).toContain('top: 0px');
                expect(mapStyle).toContain('left: 0px');

            });

            it('should render positioning styles on the timeline', function() {

                neatline.positioner('compute',
                    true,
                    true,
                    true,
                    'map',
                    'bottom',
                    'left',
                    'partial'
                );

                neatline.positioner('apply');
                var timelineStyle = neatline.positioner('getAttr', 'timeline').attr('style');

                expect(timelineStyle).toContain('height: 40px');
                expect(timelineStyle).toContain('width: 70px');
                expect(timelineStyle).toContain('top: 60px');
                expect(timelineStyle).toContain('left: 30px');

            });

            it('should render positioning styles on the items', function() {

                neatline.positioner('compute',
                    true,
                    true,
                    true,
                    'map',
                    'bottom',
                    'left',
                    'partial'
                );

                neatline.positioner('apply');
                var itemsStyle = neatline.positioner('getAttr', 'items').attr('style');

                expect(itemsStyle).toContain('height: 40px');
                expect(itemsStyle).toContain('width: 30px');
                expect(itemsStyle).toContain('top: 60px');
                expect(itemsStyle).toContain('left: 0px');

            });

        });

    });

});
