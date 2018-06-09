EMCC=emcc
EXPORTED_FUNCTIONS=emscripten-exported.json

depsdir=$(PWD)/../deps
libdir=$(depsdir)/lib
DEPS=$(libdir)/libgnutls.a $(libdir)/libnettle.a $(libdir)/libhogweed.a $(libdir)/libgmp.a $(libdir)/libtasn1.a
OBJECTS=io.bc dtls.bc versions.bc main.bc
CFLAGS = -I$(depsdir)/include -O3 -g4

%.bc: %.c
	$(EMCC) \
		$(CFLAGS) \
		$(DEPS) \
		$< -o $@

dtls.js: $(OBJECTS)
	$(EMCC) \
		$(CFLAGS) \
		-s WASM=1 \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s NO_FILESYSTEM=1 \
		-s EXPORTED_FUNCTIONS="@$(EXPORTED_FUNCTIONS)" \
		-s MODULARIZE=1 \
		-s BINARYEN_ASYNC_COMPILATION=0 \
		-s EXPORTED_RUNTIME_METHODS="[]" \
		-s NO_DYNAMIC_EXECUTION=1 \
		-s TEXTDECODER=0 \
		-s USE_PTHREADS=0 \
		-s ASSERTIONS=1 \
		$(DEPS) \
		$(OBJECTS) -o $@

all: dtls.js

clean:
	rm -f dtls.js dtls.wasm *.bc
