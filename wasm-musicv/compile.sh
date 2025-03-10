#!/bin/bash

# Exit on error
set -e

# Create source directory if it doesn't exist
mkdir -p src

# Copy Fortran source files
echo "Copying Fortran source files..."
cp ../server/musicV/sources/pass1.f src/
cp ../server/musicV/sources/pass2.f src/
cp ../server/musicV/sources/pass3.f src/

# Create wrapper file to expose functions to JavaScript
echo "Creating wrapper file..."
cat > src/musicv_wrapper.c << 'EOF'
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <emscripten.h>

// Declare external functions from Fortran
extern void pass1_();
extern void pass2_();
extern void pass3_();

// File paths
const char* SCORE_FILE = "score";
const char* PASS1_OUTPUT = "pass1.data";
const char* PASS2_OUTPUT = "pass2.data";
const char* AUDIO_OUTPUT = "snd.raw";

// Write score to file
EMSCRIPTEN_KEEPALIVE
int write_score(const char* score_text) {
    FILE* f = fopen(SCORE_FILE, "w");
    if (!f) return 0;
    
    fputs(score_text, f);
    fclose(f);
    return 1;
}

// Run pass 1
EMSCRIPTEN_KEEPALIVE
int run_pass1() {
    pass1_();
    return 1;
}

// Run pass 2
EMSCRIPTEN_KEEPALIVE
int run_pass2() {
    pass2_();
    return 1;
}

// Run pass 3
EMSCRIPTEN_KEEPALIVE
int run_pass3() {
    pass3_();
    return 1;
}

// Get the size of the generated audio file
EMSCRIPTEN_KEEPALIVE
int get_audio_size() {
    FILE* f = fopen(AUDIO_OUTPUT, "rb");
    if (!f) return 0;
    
    fseek(f, 0, SEEK_END);
    int size = ftell(f);
    fclose(f);
    return size;
}

// Read the generated audio data
EMSCRIPTEN_KEEPALIVE
void read_audio_data(float* buffer, int size) {
    FILE* f = fopen(AUDIO_OUTPUT, "rb");
    if (!f) return;
    
    fread(buffer, sizeof(float), size / sizeof(float), f);
    fclose(f);
}

// Main entry point for testing
int main() {
    printf("MusicV WebAssembly Module\n");
    return 0;
}
EOF

# Check if f2c is installed
if command -v f2c &> /dev/null; then
    echo "Using f2c to convert Fortran to C..."
    
    # Convert Fortran to C
    f2c src/pass1.f -o src/pass1.c
    f2c src/pass2.f -o src/pass2.c
    f2c src/pass3.f -o src/pass3.c
    
    # Check if emcc (Emscripten compiler) is available
    if command -v emcc &> /dev/null; then
        echo "Compiling with Emscripten..."
        
        # Compile to WebAssembly
        emcc src/pass1.c src/pass2.c src/pass3.c src/musicv_wrapper.c -o musicv.js \
            -s WASM=1 \
            -s EXPORTED_FUNCTIONS='["_main", "_write_score", "_run_pass1", "_run_pass2", "_run_pass3", "_get_audio_size", "_read_audio_data"]' \
            -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' \
            -s ALLOW_MEMORY_GROWTH=1 \
            -s FORCE_FILESYSTEM=1
        
        echo "Compilation complete! Output files: musicv.js and musicv.wasm"
    else
        echo "Error: Emscripten compiler (emcc) not found. Please install and activate Emscripten SDK."
        exit 1
    fi
else
    echo "Error: f2c not found. Please install f2c to convert Fortran to C."
    echo "On macOS: brew install f2c"
    echo "On Ubuntu: apt-get install f2c"
    exit 1
fi 