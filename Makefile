all: \
	files/scripts.js \
	files/layout.css \
	files/highlighter.css \
	files/bootstrap.css

files/scripts.js: assets/vendor/jquery/jquery.js assets/vendor/sh/sh_main.min.js assets/vendor/sh/sh_javascript.js
	cat $^ > $@

files/layout.css: assets/css/base.css assets/css/custom.css
	cat $^ > $@

files/highlighter.css: assets/vendor/sh/highlighter.css
	cat $^ > $@

files/bootstrap.css: assets/vendor/bootstrap/css/bootstrap.min.css assets/vendor/bootstrap/css/bootstrap-responsive.min.css
	cat $^ > $@
