var expect = require('expect');

var { isRealString } = require('./validation');

describe('isRealString', () => {
    it('should reject non string values', () => {
        var nonString = 2;
        var result = isRealString(nonString);

        expect(result).toBeA('boolean');
        expect(result).toBe(false);
    })

    it('should reject with only spaces', () => {
        var nonString = '            ';
        var result = isRealString(nonString);

        expect(result).toBeA('boolean');
        expect(result).toBe(false);
    })

    it('should accept string values', () => {
        var str = ' test';
        var result = isRealString(str);

        expect(result).toBeA('boolean');
        expect(result).toBe(true);
    })
})
