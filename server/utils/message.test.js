var expect = require('expect');

var { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        var from = 'john';
        var text = 'Some message';
        var message = generateMessage(from, text);

        expect(message.createAt).toBeA('number');
        expect(message).toInclude({
            from,
            text
        })
    })
})
describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        var from = 'john';
        var lat = '38';
        var lng = '-9';
        var url = 'https://www.google.com/maps/?q=38,-9'
        var message = generateLocationMessage(from, lat, lng);

        expect(message.createAt).toBeA('number');
        expect(message).toInclude({ from, url });
    })
})