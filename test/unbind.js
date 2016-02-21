global.d3 = require('d3');  // TODO there must be a better way to do this...
const d3bind = require('../build/d3bind');
const expect = require('chai').expect;
const jsdom = require("jsdom");

describe('Unbind mechanism', () => {

    describe('Scales', () => {

        function createExampleScale() {
            var domain = new d3bind.ObservableValue([120, 30]);

            var scale = d3bind.scale.linear().bindDomain(domain);

            expect(domain._subscribers.length).to.equal(1);

            expect(scale.domain()).to.deep.equal([120, 30]);
            domain.set([123, 20]);
            expect(scale.domain()).to.deep.equal([123, 20]);

            return { scale, domain };
        }

        it('overriding a setter', () => {
            var { scale, domain } = createExampleScale();

            var domain2 = new d3bind.ObservableValue([10, 11]);
            scale.bindDomain(domain2);

            expect(domain._subscribers.length).to.equal(0);
            expect(domain2._subscribers.length).to.equal(1);

            expect(scale.domain()).to.deep.equal([10, 11]);
            domain2.set([12, 13]);
            expect(scale.domain()).to.deep.equal([12, 13]);
        });

        it('unbinding a setter', () => {
            var { scale, domain } = createExampleScale();

            scale.unbindDomain();

            expect(domain._subscribers.length).to.equal(0);

            domain.set([14, 15]);
            expect(scale.domain()).to.deep.equal([123, 20]);
        });

        it('unbinding everything', () => {
            var { scale, domain } = createExampleScale();

            scale.unbind();

            expect(domain._subscribers.length).to.equal(0);

            domain.set([40, 41]);
            expect(scale.domain()).to.deep.equal([123, 20]);
        });

        it('multiple bindings', () => {
            var rangeX = new d3bind.ObservableValue(33);
            var rangeY = new d3bind.ObservableValue(34);

            var scale = d3bind.scale.sqrt().bindRange([rangeX, rangeY], (x, y) => [x, y]);

            expect(rangeX._subscribers.length).to.equal(1);
            expect(rangeY._subscribers.length).to.equal(1);

            expect(scale.range()).to.deep.equal([33, 34]);
            rangeX.set(41);
            rangeY.set(42);
            expect(scale.range()).to.deep.equal([41, 42]);

            scale.unbindRange();

            expect(rangeX._subscribers.length).to.equal(0);
            expect(rangeY._subscribers.length).to.equal(0);

            expect(scale.range()).to.deep.equal([41, 42]);
            rangeX.set(50);
            rangeY.set(55);
            expect(scale.range()).to.deep.equal([41, 42]);
        });
    });

    describe('Selectors', () => {

        function createExampleSelector() {
            var text = new d3bind.ObservableValue('abc');

            var div = jsdom.jsdom('<div></div>').querySelector('div');
            var selector = d3bind.select(div).bindText(text);

            expect(text._subscribers.length).to.equal(1);

            expect(selector.text()).to.deep.equal('abc');
            text.set('efg');
            expect(selector.text()).to.deep.equal('efg');

            return { selector, text };
        }

        it('overriding a setter', () => {
            var { selector, text } = createExampleSelector();

            var text2 = new d3bind.ObservableValue('hij');
            selector.bindText(text2);

            expect(text._subscribers.length).to.equal(0);
            expect(text2._subscribers.length).to.equal(1);

            expect(selector.text()).to.deep.equal('hij');
            text2.set('klm');
            expect(selector.text()).to.deep.equal('klm');
        });

        it('unbinding a setter', () => {
            var { selector, text } = createExampleSelector();

            selector.unbindText();

            expect(text._subscribers.length).to.equal(0);

            text.set('aaa');
            expect(selector.text()).to.deep.equal('efg');
        });

        it('unbinding everything', () => {
            var { selector, text } = createExampleSelector();

            selector.unbind();

            expect(text._subscribers.length).to.equal(0);

            text.set('bbb');
            expect(selector.text()).to.deep.equal('efg');
        });

        it('multiple bindings', () => {
            var text1 = new d3bind.ObservableValue('ccc');
            var text2 = new d3bind.ObservableValue('ddd');

            var div = jsdom.jsdom('<div></div>').querySelector('div');
            var selector = d3bind.select(div).bindText([text1, text2], (text1, text2) => text1 + text2);

            expect(text1._subscribers.length).to.equal(1);
            expect(text2._subscribers.length).to.equal(1);

            expect(selector.text()).to.deep.equal('cccddd');
            text1.set('eee');
            text2.set('fff');
            expect(selector.text()).to.deep.equal('eeefff');

            selector.unbindText();

            expect(text1._subscribers.length).to.equal(0);
            expect(text2._subscribers.length).to.equal(0);

            expect(selector.text()).to.deep.equal('eeefff');
            text1.set('ggg');
            text2.set('hhh');
            expect(selector.text()).to.deep.equal('eeefff');
        });

        it('two different attributes', () => {
            var width = new d3bind.ObservableValue(100);
            var height = new d3bind.ObservableValue(200);

            var svg = jsdom.jsdom('<svg></svg>').querySelector('svg');
            var selector = d3bind.select(svg).bindAttr('width', width).bindAttr('height', height);

            expect(selector.attr('width')).to.equal('100');
            expect(selector.attr('height')).to.equal('200');

            selector.unbindAttr('height');
            width.set(110);
            height.set(210);

            expect(selector.attr('width')).to.equal('110');
            expect(selector.attr('height')).to.equal('200');

            var width2 = new d3bind.ObservableValue(300);
            var height2 = new d3bind.ObservableValue(400);

            selector.bindAttr('width', width2).bindAttr('height', height2);

            expect(width._subscribers.length).to.equal(0);
            expect(height._subscribers.length).to.equal(0);

            width.set(120);
            height.set(220);

            expect(selector.attr('width')).to.equal('300');
            expect(selector.attr('height')).to.equal('400');

            selector.unbind();

            width2.set(310);
            height2.set(410);

            expect(selector.attr('width')).to.equal('300');
            expect(selector.attr('height')).to.equal('400');
        });

        it('removing DOM element', () => {

            var text = new d3bind.ObservableValue('aaa');
            var id = new d3bind.ObservableValue('bbb');

            var div = jsdom.jsdom('<div></div>').querySelector('div');
            var selector = d3bind.select(div).bindAttr('id', id);
            selector.append('div').bindText(text);

            expect(text._subscribers.length).to.equal(1);
            expect(id._subscribers.length).to.equal(1);

            selector.remove();

            expect(text._subscribers.length).to.equal(0);
            expect(id._subscribers.length).to.equal(0);
        });

        it('bind repeat', () => {
            var array = new d3bind.ObservableArray.of(['cc', 'aa', 'bb']);

            var div = jsdom.jsdom('<div></div>').querySelector('div');
            var selector = d3bind.select(div).bindRepeat(array, function(d, $i) {
                this.append('div').bindText($i, i => d + i);
            });

            array.insert(1, 'dd');
            array.remove('cc');

            expect(div.childElementCount).to.equal(3);
            expect(div.children[0].textContent).to.equal('dd0');
            expect(div.children[1].textContent).to.equal('aa1');
            expect(div.children[2].textContent).to.equal('bb2');

            selector.unbindRepeat();

            array.remove('bb');
            array.insert(2, 'ee');

            expect(div.childElementCount).to.equal(3);
            expect(div.children[0].textContent).to.equal('dd0');
            expect(div.children[1].textContent).to.equal('aa1');
            expect(div.children[2].textContent).to.equal('bb2');
        });
    });

    // TODO couldn't test bindInput two-way unbinding, because dispatchEvent didn't work
});
