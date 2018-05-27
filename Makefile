JS_SRC = app.jsx
SCSS_SRC = style.scss bar.scss const.scss list.scss

dist: dist/app.js dist/style.css

.PHONY: clean
clean:
	rm -vr dist/*.js dist/*.css

dist/app.js: $(addprefix src/,$(JS_SRC))
	./node_modules/.bin/babel --presets env,react --minified --no-comments --compact true -o $@ $^

dist/style.css: $(addprefix src/,$(SCSS_SRC))
	./node_modules/.bin/sass --no-source-map -I src/ -s compressed $< $@
