overlay = require 'Overlay'
Q = require 'q'

Q.stopUnhandledRejectionTracking();

describe 'Overlay', ->

	afterEach( ->
		if overlay.visible == true
			overlay.hide()
			overlay.visible = false

		overlay.el = null
		$('#__dk-overlay').remove()
	)

	describe '#show()', ->

		it 'should create new element in page', (done) ->
			overlay.show().then( ->
				el = $('#__dk-overlay')

				expect(overlay.visible).to.be.true;
				expect(el.length).equal(1)
				expect(el.is(':visible')).to.be.true;
				done()
			).done()

		it 'should return an error if there is element with same id', (done) ->
			$('<div id="__dk-overlay">test</div>').appendTo('body')
			overlay.show().fail( (err) ->
				expect(err).to.be.instanceof(Error)
				done()
			).done()

		it 'should return an error if overlay is already opened', (done) ->
			overlay.show().then( ->
				overlay.show().fail( (err) ->
					expect(err).to.be.instanceof(Error)
					done()
				).done()
			).done()

	describe '#hide()', ->

		it 'should hide overlay', (done) ->
			overlay.show().then( ->
				overlay.hide().then( ->
					el = $('#__dk-overlay')

					expect(overlay.visible).to.be.false;
					expect(el.length).equal(1)
					expect(el.is(':visible')).to.be.false;
					done()
				).done()
			).done()

		it 'should return an error if overlay is not visible', (done) ->
			overlay.hide().fail( (err) ->
				expect(err).to.be.instanceof(Error)
				done()
			).done()