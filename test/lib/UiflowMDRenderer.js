const expect     = require('chai').expect;


const UiflowMDRenderer = require('../../lib/UiflowMDRenderer.js');


describe('UiflowMDRenderer', () => {


	describe('#heading', () => {

		const heading = UiflowMDRenderer.prototype.heading;

		it('引数にそったhn要素の文字列を返すこと', () => {

			const h = heading('dummy', 3);

			expect( h ).to.equal( '<h3 id="dummy">dummy</h3>' );

		});


		it('textから `/[\s"]/` を `-` に置換したid属性値を付与すること', () => {

			const h = heading('hoge"dummy"hoge hoge	hoge', 3);

			expect( h ).to.equal( '<h3 id="hoge-dummy-hoge-hoge-hoge">hoge"dummy"hoge hoge	hoge</h3>' );

		});

	});


	describe('#code', () => {

		it('todo');

	});

});
