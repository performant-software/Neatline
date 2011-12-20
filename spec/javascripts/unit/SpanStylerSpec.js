/*
 * Unit tests for the CSS gradient constructor helper.
 */

describe('Span Styler', function() {

    var div;

    beforeEach(function() {
        div = $('<div></div>');
        div.spanstyler();
    });

    describe('_create', function() {

        it('should shell out null percentage trackers', function() {

            expect(div.spanstyler('getAttr', 'leftPercent')).toBeDefined();
            expect(div.spanstyler('getAttr', 'rightPercent')).toBeDefined();
            expect(div.spanstyler('getAttr', 'leftPercent')).toBeNull();
            expect(div.spanstyler('getAttr', 'rightPercent')).toBeNull();

        });

    });

    describe('constructCss', function() {

        describe('externally-specified percentages', function() {

            it('should construct gradients with percentages and hex of #ffffff format', function() {

                // Build the css and get out the value.
                div.spanstyler('constructCss', '#724e85', 35, 80);
                var css = div.spanstyler('getAttr', 'css');

                expect(css).toContain('background: #724e85;');

                expect(css).toContain('background: -moz-linear-gradient(left, ' +
                    'rgba(114, 78, 133, 0) 0%, ' +
                    'rgba(114, 78, 133, 1) 35%, ' +
                    'rgba(114, 78, 133, 1) 80%, ' +
                    'rgba(114, 78, 133, 0) 99%);');

                expect(css).toContain('background: -webkit-gradient(linear, left top, right top, ' +
                    'color-stop(0%,rgba(114, 78, 133, 0)), ' +
                    'color-stop(35%,rgba(114, 78, 133, 1)), ' +
                    'color-stop(80%,rgba(114, 78, 133, 1)), ' +
                    'color-stop(99%,rgba(114, 78, 133, 0)));');

                expect(css).toContain('background: -webkit-linear-gradient(left, ' +
                    'rgba(114, 78, 133, 0) 0%, ' +
                    'rgba(114, 78, 133, 1) 35%, ' +
                    'rgba(114, 78, 133, 1) 80%, ' +
                    'rgba(114, 78, 133, 0) 99%);');

                expect(css).toContain('background: -o-linear-gradient(left, ' +
                    'rgba(114, 78, 133, 0) 0%, ' +
                    'rgba(114, 78, 133, 1) 35%, ' +
                    'rgba(114, 78, 133, 1) 80%, ' +
                    'rgba(114, 78, 133, 0) 99%);');

                expect(css).toContain('background: -ms-linear-gradient(left, ' +
                    'rgba(114, 78, 133, 0) 0%, ' +
                    'rgba(114, 78, 133, 1) 35%, ' +
                    'rgba(114, 78, 133, 1) 80%, ' +
                    'rgba(114, 78, 133, 0) 99%);');

                expect(css).toContain('background: linear-gradient(left, ' +
                    'rgba(114, 78, 133, 0) 0%, ' +
                    'rgba(114, 78, 133, 1) 35%, ' +
                    'rgba(114, 78, 133, 1) 80%, ' +
                    'rgba(114, 78, 133, 0) 99%);');

            });

            it('should construct gradients with percentages and hex of ffffff format', function() {

                // Build the css and get out the value.
                div.spanstyler('constructCss', '724e85', 35, 80);
                var css = div.spanstyler('getAttr', 'css');

                expect(css).toContain('background: #724e85;');

                expect(css).toContain('background: -moz-linear-gradient(left, ' +
                    'rgba(114, 78, 133, 0) 0%, ' +
                    'rgba(114, 78, 133, 1) 35%, ' +
                    'rgba(114, 78, 133, 1) 80%, ' +
                    'rgba(114, 78, 133, 0) 99%);');

                expect(css).toContain('background: -webkit-gradient(linear, left top, right top, ' +
                    'color-stop(0%,rgba(114, 78, 133, 0)), ' +
                    'color-stop(35%,rgba(114, 78, 133, 1)), ' +
                    'color-stop(80%,rgba(114, 78, 133, 1)), ' +
                    'color-stop(99%,rgba(114, 78, 133, 0)));');

                expect(css).toContain('background: -webkit-linear-gradient(left, ' +
                    'rgba(114, 78, 133, 0) 0%, ' +
                    'rgba(114, 78, 133, 1) 35%, ' +
                    'rgba(114, 78, 133, 1) 80%, ' +
                    'rgba(114, 78, 133, 0) 99%);');

                expect(css).toContain('background: -o-linear-gradient(left, ' +
                    'rgba(114, 78, 133, 0) 0%, ' +
                    'rgba(114, 78, 133, 1) 35%, ' +
                    'rgba(114, 78, 133, 1) 80%, ' +
                    'rgba(114, 78, 133, 0) 99%);');

                expect(css).toContain('background: -ms-linear-gradient(left, ' +
                    'rgba(114, 78, 133, 0) 0%, ' +
                    'rgba(114, 78, 133, 1) 35%, ' +
                    'rgba(114, 78, 133, 1) 80%, ' +
                    'rgba(114, 78, 133, 0) 99%);');

                expect(css).toContain('background: linear-gradient(left, ' +
                    'rgba(114, 78, 133, 0) 0%, ' +
                    'rgba(114, 78, 133, 1) 35%, ' +
                    'rgba(114, 78, 133, 1) 80%, ' +
                    'rgba(114, 78, 133, 0) 99%);');

            });

        });

        describe('without externally-specified percentages', function() {

            it('should use previously set percentages, if present', function() {

                // Build the css with specific values, rebuild with null values.
                div.spanstyler('constructCss', '#724e85', 35, 80);
                div.spanstyler('constructCss', '#724e85');
                var css = div.spanstyler('getAttr', 'css');

                expect(css).toContain('background: #724e85;');

                expect(css).toContain('background: -moz-linear-gradient(left, ' +
                    'rgba(114, 78, 133, 0) 0%, ' +
                    'rgba(114, 78, 133, 1) 35%, ' +
                    'rgba(114, 78, 133, 1) 80%, ' +
                    'rgba(114, 78, 133, 0) 99%);');

                expect(css).toContain('background: -webkit-gradient(linear, left top, right top, ' +
                    'color-stop(0%,rgba(114, 78, 133, 0)), ' +
                    'color-stop(35%,rgba(114, 78, 133, 1)), ' +
                    'color-stop(80%,rgba(114, 78, 133, 1)), ' +
                    'color-stop(99%,rgba(114, 78, 133, 0)));');

                expect(css).toContain('background: -webkit-linear-gradient(left, ' +
                    'rgba(114, 78, 133, 0) 0%, ' +
                    'rgba(114, 78, 133, 1) 35%, ' +
                    'rgba(114, 78, 133, 1) 80%, ' +
                    'rgba(114, 78, 133, 0) 99%);');

                expect(css).toContain('background: -o-linear-gradient(left, ' +
                    'rgba(114, 78, 133, 0) 0%, ' +
                    'rgba(114, 78, 133, 1) 35%, ' +
                    'rgba(114, 78, 133, 1) 80%, ' +
                    'rgba(114, 78, 133, 0) 99%);');

                expect(css).toContain('background: -ms-linear-gradient(left, ' +
                    'rgba(114, 78, 133, 0) 0%, ' +
                    'rgba(114, 78, 133, 1) 35%, ' +
                    'rgba(114, 78, 133, 1) 80%, ' +
                    'rgba(114, 78, 133, 0) 99%);');

                expect(css).toContain('background: linear-gradient(left, ' +
                    'rgba(114, 78, 133, 0) 0%, ' +
                    'rgba(114, 78, 133, 1) 35%, ' +
                    'rgba(114, 78, 133, 1) 80%, ' +
                    'rgba(114, 78, 133, 0) 99%);');

            });

            it('should construct gradients 0/100 percentages if no externally defined values', function() {

                // Build the css and get out the value.
                div.spanstyler('constructCss', '724e85');
                var css = div.spanstyler('getAttr', 'css');

                expect(css).toContain('background: #724e85;');

                expect(css).toContain('background: -moz-linear-gradient(left, ' +
                    'rgba(114, 78, 133, 0) 0%, ' +
                    'rgba(114, 78, 133, 1) 0%, ' +
                    'rgba(114, 78, 133, 1) 99%, ' +
                    'rgba(114, 78, 133, 0) 99%);');

                expect(css).toContain('background: -webkit-gradient(linear, left top, right top, ' +
                    'color-stop(0%,rgba(114, 78, 133, 0)), ' +
                    'color-stop(0%,rgba(114, 78, 133, 1)), ' +
                    'color-stop(99%,rgba(114, 78, 133, 1)), ' +
                    'color-stop(99%,rgba(114, 78, 133, 0)));');

                expect(css).toContain('background: -webkit-linear-gradient(left, ' +
                    'rgba(114, 78, 133, 0) 0%, ' +
                    'rgba(114, 78, 133, 1) 0%, ' +
                    'rgba(114, 78, 133, 1) 99%, ' +
                    'rgba(114, 78, 133, 0) 99%);');

                expect(css).toContain('background: -o-linear-gradient(left, ' +
                    'rgba(114, 78, 133, 0) 0%, ' +
                    'rgba(114, 78, 133, 1) 0%, ' +
                    'rgba(114, 78, 133, 1) 99%, ' +
                    'rgba(114, 78, 133, 0) 99%);');

                expect(css).toContain('background: -ms-linear-gradient(left, ' +
                    'rgba(114, 78, 133, 0) 0%, ' +
                    'rgba(114, 78, 133, 1) 0%, ' +
                    'rgba(114, 78, 133, 1) 99%, ' +
                    'rgba(114, 78, 133, 0) 99%);');

                expect(css).toContain('background: linear-gradient(left, ' +
                    'rgba(114, 78, 133, 0) 0%, ' +
                    'rgba(114, 78, 133, 1) 0%, ' +
                    'rgba(114, 78, 133, 1) 99%, ' +
                    'rgba(114, 78, 133, 0) 99%);');

            });

        });

    });

    describe('applyCss', function() {

        it('should apply computed styles to the div', function() {

            // Build the css and get out the value.
            div.spanstyler('constructCss', '724e85');
            div.spanstyler('applyCss');
            var style = div.attr('style');

            expect(style).toContain('background: #724e85;');

            expect(style).toContain('background: -moz-linear-gradient(left, ' +
                'rgba(114, 78, 133, 0) 0%, ' +
                'rgba(114, 78, 133, 1) 0%, ' +
                'rgba(114, 78, 133, 1) 99%, ' +
                'rgba(114, 78, 133, 0) 99%);');

            expect(style).toContain('background: -webkit-gradient(linear, left top, right top, ' +
                'color-stop(0%,rgba(114, 78, 133, 0)), ' +
                'color-stop(0%,rgba(114, 78, 133, 1)), ' +
                'color-stop(99%,rgba(114, 78, 133, 1)), ' +
                'color-stop(99%,rgba(114, 78, 133, 0)));');

            expect(style).toContain('background: -webkit-linear-gradient(left, ' +
                'rgba(114, 78, 133, 0) 0%, ' +
                'rgba(114, 78, 133, 1) 0%, ' +
                'rgba(114, 78, 133, 1) 99%, ' +
                'rgba(114, 78, 133, 0) 99%);');

            expect(style).toContain('background: -o-linear-gradient(left, ' +
                'rgba(114, 78, 133, 0) 0%, ' +
                'rgba(114, 78, 133, 1) 0%, ' +
                'rgba(114, 78, 133, 1) 99%, ' +
                'rgba(114, 78, 133, 0) 99%);');

            expect(style).toContain('background: -ms-linear-gradient(left, ' +
                'rgba(114, 78, 133, 0) 0%, ' +
                'rgba(114, 78, 133, 1) 0%, ' +
                'rgba(114, 78, 133, 1) 99%, ' +
                'rgba(114, 78, 133, 0) 99%);');

            expect(style).toContain('background: linear-gradient(left, ' +
                'rgba(114, 78, 133, 0) 0%, ' +
                'rgba(114, 78, 133, 1) 0%, ' +
                'rgba(114, 78, 133, 1) 99%, ' +
                'rgba(114, 78, 133, 0) 99%);');

        });

        it('should retain existing styles and append new gradient styles', function() {

            // Set a non-gradient-related style on the div.
            div.attr('style', 'top: 10px;');

            // Build the css and get out the value.
            div.spanstyler('constructCss', '724e85');
            div.spanstyler('applyCss');
            var style = div.attr('style');

            expect(style).toContain('top: 10px;');
            expect(style).toContain('background: #724e85;');

            expect(style).toContain('background: -moz-linear-gradient(left, ' +
                'rgba(114, 78, 133, 0) 0%, ' +
                'rgba(114, 78, 133, 1) 0%, ' +
                'rgba(114, 78, 133, 1) 99%, ' +
                'rgba(114, 78, 133, 0) 99%);');

            expect(style).toContain('background: -webkit-gradient(linear, left top, right top, ' +
                'color-stop(0%,rgba(114, 78, 133, 0)), ' +
                'color-stop(0%,rgba(114, 78, 133, 1)), ' +
                'color-stop(99%,rgba(114, 78, 133, 1)), ' +
                'color-stop(99%,rgba(114, 78, 133, 0)));');

            expect(style).toContain('background: -webkit-linear-gradient(left, ' +
                'rgba(114, 78, 133, 0) 0%, ' +
                'rgba(114, 78, 133, 1) 0%, ' +
                'rgba(114, 78, 133, 1) 99%, ' +
                'rgba(114, 78, 133, 0) 99%);');

            expect(style).toContain('background: -o-linear-gradient(left, ' +
                'rgba(114, 78, 133, 0) 0%, ' +
                'rgba(114, 78, 133, 1) 0%, ' +
                'rgba(114, 78, 133, 1) 99%, ' +
                'rgba(114, 78, 133, 0) 99%);');

            expect(style).toContain('background: -ms-linear-gradient(left, ' +
                'rgba(114, 78, 133, 0) 0%, ' +
                'rgba(114, 78, 133, 1) 0%, ' +
                'rgba(114, 78, 133, 1) 99%, ' +
                'rgba(114, 78, 133, 0) 99%);');

            expect(style).toContain('background: linear-gradient(left, ' +
                'rgba(114, 78, 133, 0) 0%, ' +
                'rgba(114, 78, 133, 1) 0%, ' +
                'rgba(114, 78, 133, 1) 99%, ' +
                'rgba(114, 78, 133, 0) 99%);');

        });

    });

});
