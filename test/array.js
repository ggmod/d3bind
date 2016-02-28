global.d3 = require('d3');
const d3bind = require('../build/d3bind');
const expect = require('chai').expect;


describe('Observable Array', () => {

    it('splice', () => {
        var a = new d3bind.ObservableArray([1,2,3,4,5]);
        var b = d3bind.ObservableArray.bindTo(a);

        var result = a.splice(2,1);
        expect(b.array).to.deep.equal([1,2,4,5]);
        expect(result).to.deep.equal([3]);

        result = a.splice(100,1);
        expect(b.array).to.deep.equal([1,2,4,5]);
        expect(result).to.deep.equal([]);

        result = a.splice(3,1);
        expect(b.array).to.deep.equal([1,2,4]);
        expect(result).to.deep.equal([5]);

        result = a.splice(-2,1);
        expect(b.array).to.deep.equal([1,4]);
        expect(result).to.deep.equal([2]);

        result = a.splice(1, 0, 6, 7, 8);
        expect(b.array).to.deep.equal([1,6,7,8,4]);
        expect(result).to.deep.equal([]);

        result = a.splice(-4, 2, 9, 10);
        expect(b.array).to.deep.equal([1,9,10,8,4]);
        expect(result).to.deep.equal([6,7]);

        result = a.splice(-2, 100, 13, 14);
        expect(b.array).to.deep.equal([1,9,10,13,14]);
        expect(result).to.deep.equal([8,4]);

        result = a.splice(3, 0); // do nothing
        expect(b.array).to.deep.equal([1,9,10,13,14]);
        expect(result).to.deep.equal([]);

        result = a.splice(3);
        expect(b.array).to.deep.equal([1,9,10]);
        expect(result).to.deep.equal([13,14]);

        result = a.splice(100); // do nothing
        expect(b.array).to.deep.equal([1,9,10]);
        expect(result).to.deep.equal([]);

        result = a.splice(-100);
        expect(b.array).to.deep.equal([]);
        expect(result).to.deep.equal([1,9,10]);

        result = a.splice(50, 10, 1, 2, 3);
        expect(b.array).to.deep.equal([1,2,3]);
        expect(result).to.deep.equal([]);
    });
});
