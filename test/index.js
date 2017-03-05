const expect     = require('chai').expect;
const sinon      = require('sinon');
const proxyquire = require('proxyquire').noPreserveCache();

const File   = require( 'vinyl' )
const vfs = require('vinyl-fs');


describe('uiSpecMd', () => {

	const stubCopyTemplateAssets = sinon.stub();
	const stubTransform = sinon.stub();
	const stubStream = sinon.stub();
	const stubMarked = sinon.stub();
	const stubPush = sinon.stub();

	stubStream.Transform = function () { return stubTransform; };

	var stream = stubStream.Transform();
	stream.push = stubPush;
	

	const uiSpecMd = proxyquire('../index.js', {
		'./lib/copyTemplateAssets.js': stubCopyTemplateAssets,
		'stream': stubStream,
		'marked': stubMarked
	});


	uiSpecMd({
		srcRoot: __dirname + '/mock/'
	});


	it('Should be called once `copyTemplateAssets` with `Stream.Transform` instance.', () => {

		expect(stubCopyTemplateAssets.calledOnce).to.equal(true);
		expect(stubCopyTemplateAssets.calledWith(stream)).to.equal(true);

	});


	it('Should be defined `._transform()` to `stream`.', () => {

		expect(stream._transform).to.be.a('function');

	});


	describe('stream._transform', () => {

		it('引数fileの.isNullがtrueならmarkedを呼ばずに終了すること', () => {

			stream._transform(new File(), null, () => {});
			expect(stubMarked.called).to.equal(false);

		});


		it('拡張子が.mdでなければmarkedを呼ばずに終了すること', () => {

			stream._transform(new File({
				path: 'example.html',
				contents: new Buffer( '# hoge' )
			}), null, () => {});
			expect(stubMarked.called).to.equal(false);

		});


		// markedはmakePagesAndIndexData.jsで読み込んで呼ぶことになったから
		// index.js内のmarkedをstubMarkedにしてるけど変えないとならない
		it('正しくマークダウンファイルであればmarkedを呼ぶこと', () => {

			stream._transform(new File({
				path: 'example.md',
				contents: new Buffer( '# hoge' )
			}), null, () => {});
			expect(stubMarked.calledOnce).to.equal(true);

		});


		it('markedのcallback関数の中身もテストしたいから分けるとかしたら良さそう');

	});


	it('Should be defined `._flush()` to `stream`.', () => {

		expect(stream._flush).to.be.a('function');

	});

	it('_flash()内でmakeIndex読んでること？ファイルできてれば要らないかも？');
	it('copyTemplateAssets()にstream渡して呼んでること（ファイルできてれば要らない？');


	it('各種ファイルのストリームが出来たか的なテスト(なんて言えばいいの)', (done) => {

		var u = require('../index.js');
		var s = vfs.src(__dirname + '/mock/test.md');
		var r = s.pipe(u({ srcRoot: __dirname + '/mock/' }));
		var paths = [];

		r.on('data', (chunk) => {
			paths.push(chunk.path);
		});

		r.on('end', () => {

			expect(paths).to.eql([
				// ここから
				'_template/_template.css',
				'_template/_template.js',
				'_template/_template.woff',
				'_editor.html',
				'_editor/_editor.css',
				'_editor/_editor.js',
				// ここまでは、 ../lib/copyTemplateAssets.js で作ってる

				__dirname + '/mock/test.html',

				// これ以降の2つは ../lib/makeIndex.js で作ってる
				'index.html',
				'_menu.html'
			]);

			done();
		});

	});

});
