
ready = require 'Ready'

container = $('#test')

describe 'Ready', ->

	afterEach( ->
		container.html('')
		$('#tempTest').remove()
	)

	it 'should resolve element itself for empty container', (done) ->
		ready(container).then( (el) ->
			expect(el).to.be.equal(container)
			done()
		).done()

	it 'should resolve newly created container', (done) ->
		newEl = $('<div id="tempTest">test</div>').appendTo('body')
		ready(newEl).then( (el) ->
			expect(el).to.be.equal(newEl)
			done()
		).done()

	it 'should resolve element with images', (done) ->
		$('<img src="images/1.jpg">').appendTo(container)
		$('<img src="images/2.jpg">').appendTo(container)
		$('<img src="images/3.jpg">').appendTo(container)
		ready(container).then( (el) ->
			expect(el).to.be.equal(container)
			expect(container.find('img').length).to.be.equal(3)
			done()
		).done()

	it 'should resolve element with images from new container', (done) ->
		newEl = $('<div id="tempTest">test</div>').appendTo('body')
		$('<img src="images/1.jpg">').appendTo(newEl)
		$('<img src="images/2.jpg">').appendTo(newEl)
		$('<img src="images/3.jpg">').appendTo(newEl)
		ready(newEl).then( (el) ->
			expect(el).to.be.equal(newEl)
			expect(newEl.find('img').length).to.be.equal(3)
			done()
		).done()