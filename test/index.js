import RoutePath, {compare, compile} from '#path-match';
import {expect} from 'chai';

describe('@MomsFriendlyDevCo/path-match', ()=> {

	it('RegExp path compiling', ()=> {
		expect(RoutePath.compileRegExp('/').toString()).to.equal((new RegExp(/^\/$/, 'i')).toString());
		expect(RoutePath.compileRegExp('/foo').toString()).to.equal((new RegExp(/^\/foo\/?$/, 'i')).toString());
		expect(RoutePath.compileRegExp('/:id').toString()).to.equal((new RegExp(/^\/(?<id>.+?)\/?$/, 'i')).toString());
		expect(RoutePath.compileRegExp('/:foo/:bar/:baz').toString()).to.equal((new RegExp(/^\/(?<foo>.+?)\/(?<bar>.+?)\/(?<baz>.+?)\/?$/, 'i')).toString());
	});

	it('simple path comparison', ()=> {
		expect(compare('/', '/')).to.be.ok;
		expect(compare(['/'], '/')).to.be.ok;
		expect(compare('/foo', '/')).to.be.false;
		expect(compare(['/foo'], '/')).to.be.false;
		expect(compare('/', '/foo')).to.be.false;
		expect(compare(['/'], '/foo')).to.be.false;

		expect(compare('/:id', '/foo')).to.be.deep.equal({id: 'foo'});
		expect(compare('/:id', '/foo/')).to.be.deep.equal({id: 'foo'});
		expect(compare(['/:id'], '/foo')).to.be.deep.equal({id: 'foo'});

		expect(compare('/widgets/:wid?', '/widgets')).to.be.false;
		expect(compare('/widgets/:wid?', '/widgets/')).to.be.deep.equal({wid: undefined});
		expect(compare('/widgets/:wid?', '/widgets/123')).to.be.deep.equal({wid: '123'});

		expect(compare('/:fooId/:barId/:bazId', '/one/two/three')).to.be.deep.equal({fooId: 'one', barId: 'two', bazId: 'three'});

		expect(compare(/\/(?<id>.+)$/, '/bar')).to.be.deep.equal({id: 'bar'});
		expect(compare(['/blah', /\/(?<id>.+)$/], '/bar')).to.be.deep.equal({id: 'bar'});
	});

	it('precompiled path matching', ()=> {
		let v;

		v = compile('/');
		expect(v.toString()).to.be.equal('/');
		expect(v.isMatch('/')).to.be.ok;
		expect(v.isMatch('/foo')).to.be.false;

		v = compile(['/']);
		expect(v.toString()).to.be.equal('/');
		expect(v.isMatch('/')).to.be.ok;
		expect(v.isMatch('/foo')).to.be.false;

		v = compile(['/foo', '/bar', '/baz']);
		expect(v.toString()).to.be.equal('/foo OR /bar OR /baz');
		expect(v.isMatch('/bar')).to.be.ok;
		expect(v.isMatch('/bar/')).to.be.ok;

		v = compile('/:id');
		expect(v.toString()).to.be.equal('/:id');
		expect(v.isMatch('/foo')).to.be.deep.equal({id: 'foo'});
		expect(v.isMatch('/foo/')).to.be.deep.equal({id: 'foo'});

		v = compile(['/:id']);
		expect(v.toString()).to.be.equal('/:id');
		expect(v.isMatch('/foo')).to.be.deep.equal({id: 'foo'});

		v = compile(['/widgets/:wid?']);
		expect(v.toString()).to.be.equal('/widgets/:wid?');
		expect(v.isMatch('/widgets')).to.be.false;
		expect(v.isMatch('/widgets/')).to.be.deep.equal({wid: undefined});
		expect(v.isMatch('/widgets/123')).to.be.deep.equal({wid: '123'});

		v = compile(['/blah', /\/(?<id>.+)$/], '/bar');
		expect(v.toString()).to.be.equal('/blah OR [RE:/\\/(?<id>.+)$/]');
		expect(v.isMatch('/blah')).to.be.deep.equal({});
		expect(v.isMatch('/bar')).to.be.deep.equal({id: 'bar'});
	});

});
