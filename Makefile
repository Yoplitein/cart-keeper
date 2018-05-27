JS_SRC = app.jsx
SCSS_SRC = style.scss bar.scss const.scss list.scss

dist: dist/app.js dist/style.css

dist/app.js: $(JS_SRC)
	./node_modules/.bin/babel --presets env,react --minified --no-comments --compact true -o $@ $^

dist/style.css: $(SCSS_SRC)
	./node_modules/.bin/sass --no-source-map -I . -s compressed $< $@
