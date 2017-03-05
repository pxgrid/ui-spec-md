const expect     = require('chai').expect;
const sinon      = require('sinon');
const proxyquire = require('proxyquire');

const splitInput = require('../../lib/splitInput.js');
const File = require('vinyl');

describe('splitInput', () => {

	it('objectを返すこと', () => {

		var file = new File({
			path: 'test/hoge.html',
			contents: new Buffer('---\ntitle: test title\nscreen: test/screen.png\n---\n\n\ntest contents.')
		});

		var result = splitInput(file, 'root/dir');

		expect(result).to.be.an('object');

	});


	it('マークダウンヘッダー内のtitleを正しく返すこと', () => {

		var file = new File({
			path: 'test/hoge.html',
			contents: new Buffer('---\ntitle: test title\nscreen: test/screen.png\n---\n\n\ntest contents.')
		});

		var result = splitInput(file, 'root/dir');

		expect(result.title).to.equal('test title');

	});


	it('マークダウンヘッダー内のscreenを正しく返すこと', () => {

		var file = new File({
			path: 'test/hoge.html',
			contents: new Buffer('---\ntitle: test title\nscreen: test/screen.png\n---\n\n\ntest contents.')
		});

		var result = splitInput(file, 'root/dir');

		expect(result.screen).to.equal('test/screen.png');

	});


	it('マークダウンヘッダー以外をmdSouceとして返すこと', () => {

		var file = new File({
			path: 'test/hoge.html',
			contents: new Buffer('---\ntitle: test title\nscreen: test/screen.png\n---\n\n\ntest contents.')
		});

		var result = splitInput(file, 'root/dir');

		expect(result.mdSouce).to.equal('test contents.');

	});


	describe('マークダウンヘッダーがない場合', () => {

		var file = new File({
			path: 'test/hoge.html',
			contents: new Buffer('test contents.')
		});

		var result = splitInput(file, 'root/dir');


		it('titleは`\'\'`（空文字）を返すこと', () => {
			expect(result.title).to.equal('');
		});


		it('screenは`\'\'`（空文字）を返すこと', () => {
			expect(result.screen).to.equal('');
		});


		it('mdSouceはそのまますべての内容をstringで返すこと', () => {
			expect(result.mdSouce).to.eql(new String('test contents.'));
		});

	});


	it('他の返り値についてのテスト');

});

