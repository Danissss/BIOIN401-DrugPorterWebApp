Q = require 'q'
try $ = require 'jquery' catch err then $ = window.jQuery

module.exports = (el) ->
	deferred = Q.defer()

	images = el.find('img')
	counter = images.length

	if counter == 0
		deferred.resolve(el)
	else
		loaded = ->
			counter--
			if counter == 0 then deferred.resolve(el)

		images.each( (i, image) ->
			if (image.complete)
				loaded()
			else
				$(image).one('load', loaded)
		)

	return deferred.promise