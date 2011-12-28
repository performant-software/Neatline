/*
 * Unit tests for Array extensions.
 */

describe('Utilities', function() {

    var array;

    describe('remove', function() {

        beforeEach(function() {
            array = [1,'2',3]
        });

        it('should not change the array when the passed value is absent', function() {
            array.remove(4);
            expect(array).toEqual([1,'2',3]);
            array.remove('4');
            expect(array).toEqual([1,'2',3]);
        });

        it('should remove the value when the value is present', function() {
            array.remove(1);
            expect(array).toEqual(['2',3]);
            array.remove('2');
            expect(array).toEqual([3]);
        });

    });

    describe('contains', function() {

        beforeEach(function() {
            array = [1,'2',3]
        });

        it('should return false when the value is absent', function() {
            expect(array.contains(4)).toBeFalsy();
            expect(array.contains('4')).toBeFalsy();
            expect(array.contains(2)).toBeFalsy();
            expect(array.contains('3')).toBeFalsy();
        });

        it('should return true when the value is present', function() {
            expect(array.contains(1)).toBeTruthy();
            expect(array.contains('2')).toBeTruthy();
        });

    });

});
