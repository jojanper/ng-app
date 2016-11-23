#*************************************************************************
#  Makefile - Makefile for Draal application.
#
#  Author(s): Juha Ojanpera
#  Copyright (c) 2014 Juha Ojanpera
#*************************************************************************

JS_LIB := app_bundle
TARGET := ../dist/scripts/$(JS_LIB).js
TARGET_MINIFIED := ../dist/scripts/$(JS_LIB).js
SRC_FILES := $(shell find ../app -type f -name "*.js")
BUILD_OPTIONS := build.js
RJS := /usr/local/bin/r.js

libs: framework media
libs-dev: framework-dev media-dev

dev: libs-dev prepare build
all: libs prepare minify

bowerinstall:
	@echo "::" Installing Draal apps via bower ...
	cd .. && bower install

install: bowerinstall all release

install-dev: bowerinstall dev release

prepare:
	cd .. && \
	rm -Rf components/media && \
	rm -Rf components/framework && \
        bower --allow-root install

release:
	-mkdir -p ../../apps/templates
	-mkdir -p ../../apps/scripts
	-mkdir -p ../../apps/css

	-cp ../build/apps.html ../../apps
	-cp ../dist/scripts/*.js ../../apps/scripts
	-cp ../components/requirejs/require.js ../../apps/scripts
	-uglifyjs ../../apps/scripts/require.js -o ../components/requirejs/require.js

media:
	cd ../../media/build && make install

media-dev:
	cd ../../media/build && make install-dev

framework:
	cd ../../framework/build && make install

framework-dev:
	cd ../../framework/build && make install-dev

build: $(TARGET)

installclean:
	@echo "::" cleaning environment ...
	cd ../../media/build && make clean
	cd ../../framework/build && make clean
	-rm -Rf $(TARGET) $(TARGET_MINIFIED) ../dist ../../apps

clean:
	@echo "::" cleaning ...
	-rm -f $(TARGET) $(TARGET_MINIFIED)

minify: $(RJS) $(SRC_FILES)
	@echo "::" compiling $@ ...
	$(RJS) -o $(BUILD_OPTIONS) out=$(TARGET_MINIFIED) optimize=uglify

$(TARGET): $(RJS) $(SRC_FILES)
	@echo "::" compiling $@ ...
	$(RJS) -o $(BUILD_OPTIONS) out=$(TARGET)
