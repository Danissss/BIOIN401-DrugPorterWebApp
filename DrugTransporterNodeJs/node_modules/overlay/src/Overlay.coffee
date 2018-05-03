$ = window.jQuery || require 'jquery'
Q = require 'q'
EventEmitter = require('events').EventEmitter

class Overlay extends EventEmitter


	@ID: '__dk-overlay'


	visible: false

	color: 'black'

	opacity: 0.8

	zIndex: 1000

	duration: 'fast'

	scrollable: false

	el: null


	show: (options = {}) ->
		deferred = Q.defer()

		if typeof options.color == 'undefined' then options.color = @color
		if typeof options.opacity == 'undefined' then options.opacity = @opacity
		if typeof options.zIndex == 'undefined' then options.zIndex = @zIndex
		if typeof options.duration == 'undefined' then options.duration = @duration
		if typeof options.scrollable == 'undefined' then options.scrollable = @scrollable

		if @visible == false
			@emit 'show', @

			if options.scrollable == false
				$('body').css('overflow', 'hidden')

			if @el == null
				if $('#' + Overlay.ID).length > 0
					return Q.reject(new Error 'There is already some element with id ' + Overlay.ID + '.')

				@el = $('<div>',
					id: Overlay.ID
					css:
						display: 'none'
						position: 'fixed'
						left: 0
						top: 0
						width: $(window).width()
						height: $(window).height()
					click: (e) => @hide()
				).appendTo($('body'))

			$(window).on('resize.overlay', (e) => @onResize() )

			@el.css(
				backgroundColor: options.color
				opacity: options.opacity
				zIndex: options.zIndex
			)

			@el.fadeIn(options.duration, =>
				@visible = true
				@emit 'shown', @
				deferred.resolve(@)
			)
		else
			return Q.reject(new Error 'Overlay is already visible')

		return deferred.promise


	onResize: ->
		if @visible == true
			@el.css(
				width: $(window).width()
				height: $(window).height()
			)


	hide: ->
		deferred = Q.defer()

		if @visible == true
			@emit 'hide', @
			@el.fadeOut(@duration, =>
				@visible = false
				@emit 'hidden', @
				deferred.resolve(@)
			)

			$(window).off('resize.overlay')

			if @scrollable == false
				$('body').css('overflow', 'visible')
		else
			deferred.reject(new Error 'Overlay is not visible')

		return deferred.promise


module.exports = new Overlay