#*************************************************************************
#  Makefile - Makefile for thumbnail library.
#
#  Author(s): Juha Ojanpera
#  Copyright (c) 2014 Juha Ojanpera
#*************************************************************************

JS_LIB := app_framework
TARGET := ../$(JS_LIB).js
TARGET_MINIFIED := ../$(JS_LIB).js
SRC_FILES := $(shell find ../lib -type f -name "*.js")
BUILD_OPTIONS := build.js
RJS := /usr/local/bin/r.js

dev: build
all: minify

build: $(TARGET)

install: bowerinstall all release
install-dev: bowerinstall dev release

bowerinstall:
	@echo "::" Installing framework via bower ...
	cd .. && bower install

release:
	-mkdir -p ../../apps/templates
	-mkdir -p ../../apps/scripts
	-cp -r ../*.js ../../apps/scripts

clean:
	@echo "::" cleaning ...
	-rm -f $(TARGET) $(TARGET_MINIFIED)

minify: $(RJS) $(SRC_FILES)
	@echo "::" compiling $@ ...
	$(RJS) -o $(BUILD_OPTIONS) out=$(TARGET_MINIFIED) optimize=uglify

$(TARGET): $(RJS) $(SRC_FILES)
	@echo "::" compiling $@ ...
	$(RJS) -o $(BUILD_OPTIONS) out=$(TARGET)
