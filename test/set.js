global.d3 = require('d3');
const d3bind = require('../build/d3bind');
const expect = require('chai').expect;


describe('Observable Set', () => {

    it('bind to primitive array', () => {
        var array = new d3bind.ObservableArray([34, 4, 12, 2, 12, 4, 4]);
        var set = d3bind.ObservableSet.bindTo(array);

        expect(set.size).to.equal(4);
        expect(set.has(34)).to.be.true;
        expect(set.has(12)).to.be.true;
        expect(set.has(2)).to.be.true;
        expect(set.has(4)).to.be.true;

        array.push(432);
        expect(set.size).to.equal(5);
        expect(set.has(432)).to.be.true;

        array.push(432);
        expect(set.size).to.equal(5);

        array.remove(12);
        expect(set.size).to.equal(5);
        expect(set.has(12)).to.be.true;

        array.remove(12);
        expect(set.size).to.equal(4);
        expect(set.has(12)).to.be.false;
    });

    it('bind to object array', () => {
        var array = new d3bind.ObservableArray([
            {name:'aa',value: 1},{name:'bb',value: 12},{name:'aa',value: 31},{name:'cc',value:3},{name:'cc',value: 11}]);
        var set = d3bind.ObservableSet.bindTo(array, item => item.name);

        expect(set.size).to.equal(3);
        expect(set.has('aa')).to.be.true;
        expect(set.has('bb')).to.be.true;
        expect(set.has('cc')).to.be.true;

        array.push({name: 'dd', value: 11});
        expect(set.size).to.equal(4);
        expect(set.has('dd')).to.be.true;

        array.push({name: 'dd', value: 12});
        expect(set.size).to.equal(4);

        array.splice(3, 1);
        expect(set.size).to.equal(4);
        expect(set.has('cc')).to.be.true;

        array.splice(3, 1);
        expect(set.size).to.equal(3);
        expect(set.has('cc')).to.be.false;
    });

    it('basic functions', () => {
        var set = new d3bind.ObservableSet();

        var log = [];
        set.subscribe({
            insert: item => log.push({ action:'insert', item: item }),
            remove: item => log.push({ action:'remove', item: item })
        });

        set.add('aa').add('bb').add('aa');

        expect(set.size).to.equal(2);
        expect(set.has('aa'));
        expect(set.has('bb'));

        expect(log.length).to.equal(2);
        expect(log[0]).to.deep.equal({ action: 'insert', item: 'aa'});
        expect(log[1]).to.deep.equal({ action: 'insert', item: 'bb'});

        set.forEach((value, value2, innerSet) => {
            expect(value).to.equal(value2);
            expect(innerSet instanceof d3bind.ObservableSet).to.be.true;
        });

        set.delete('aa');
        set.delete('aa');

        expect(set.size).to.equal(1);
        expect(set.has('bb'));

        expect(log.length).to.equal(3);
        expect(log[2]).to.deep.equal({ action: 'remove', item: 'aa'});

        set.add('cc');
        expect(set.size).to.equal(2);
        set.clear();
        expect(set.size).to.equal(0);
        expect(log[4].action).to.deep.equal('remove');
        expect(log[5].action).to.deep.equal('remove');
    });

    it('observable size', () => {
        var set = new d3bind.ObservableSet();
        var log = [];
        set.$size.subscribe(value => log.push(value));

        expect(set.$size.get()).to.equal(0);

        set.add('aa').add('bb').add('aa');

        expect(set.$size.get()).to.equal(2);
        expect(log.length).to.equal(2);
        expect(log[0]).to.equal(1);
        expect(log[1]).to.equal(2);

        set.delete('aa');
        set.delete('aa');

        expect(set.$size.get()).to.equal(1);
        expect(log.length).to.equal(3);
        expect(log[2]).to.equal(1);

        set.clear();

        expect(set.$size.get()).to.equal(0);
        expect(log.length).to.equal(4);
        expect(log[3]).to.equal(0);
    });

    it('observable has', () => {
        var set = new d3bind.ObservableSet();
        var log = [];
        var has = set.$has('aa');
        has.subscribe(value => log.push(value));

        expect(has.get()).to.equal(false);

        set.add('aa').add('bb').add('aa');

        expect(has.get()).to.equal(true);
        expect(log.length).to.equal(1);
        expect(log[0]).to.equal(true);

        set.delete('aa');
        set.delete('aa');

        expect(has.get()).to.equal(false);
        expect(log.length).to.equal(2);
        expect(log[1]).to.equal(false);

        set.add('aa');
        expect(has.get()).to.equal(true);
        set.clear();
        expect(has.get()).to.equal(false);

        expect(log.length).to.equal(4);
        expect(log[3]).to.equal(false);
    });
});
