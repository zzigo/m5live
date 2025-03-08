<template>
  <div class="ace-editor-container" ref="editorContainer">
    <div class="editor" ref="editor"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineEmits, defineExpose } from 'vue'
import ace from 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/mode-text'
import 'ace-builds/src-noconflict/theme-monokai'

// Define a custom mode for MUSIC V syntax
const defineMusicVMode = () => {
  ace.define('ace/mode/musicv', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text', 'ace/mode/musicv_highlight_rules'], function(require, exports, module) {
    const oop = require("ace/lib/oop");
    const TextMode = require("ace/mode/text").Mode;
    const MusicVHighlightRules = require("ace/mode/musicv_highlight_rules").MusicVHighlightRules;
    
    const Mode = function() {
      this.HighlightRules = MusicVHighlightRules;
    };
    oop.inherits(Mode, TextMode);
    
    // Override the getNextLineIndent method if needed
    
    // This is the key part - define the comment start string
    (function() {
      this.lineCommentStart = "COM ";
      this.blockComment = null;
      
      // Override the toggleCommentLines method to always use "COM " for new comments
      this.toggleCommentLines = function(state, session, startRow, endRow) {
        const commentRegex = /^(?:\s*)(?:COM |COMMENT |COMMENT: )/;
        
        let uncomment = true;
        for (let i = startRow; i <= endRow; i++) {
          if (!commentRegex.test(session.getLine(i))) {
            uncomment = false;
            break;
          }
        }

        if (uncomment) {
          // Remove comments
          for (let i = startRow; i <= endRow; i++) {
            let line = session.getLine(i);
            let m = line.match(commentRegex);
            if (m) {
              let start = m.index;
              let end = m[0].length;
              session.replace(new ace.Range(i, start, i, end), "");
            }
          }
        } else {
          // Add comments - always use "COM " for new comments
          session.indentRows(startRow, endRow, "COM ");
        }
      };
    }).call(Mode.prototype);
    
    exports.Mode = Mode;
  });
  
  ace.define('ace/mode/musicv_highlight_rules', ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text_highlight_rules'], function(require, exports, module) {
    const oop = require("ace/lib/oop");
    const TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;
    
    const MusicVHighlightRules = function() {
      this.$rules = {
        "start": [
          {
            token: "comment",
            regex: "^\\s*(?:COM|COMMENT|COMMENT:)\\s.*$"
          },
          {
            token: "keyword.gen",
            regex: "\\b(GEN)\\b"
          },
          {
            token: "keyword",
            regex: "\\b(INS|OSC|OUT|END|NOT|TER)\\b"
          },
          {
            token: "constant.numeric",
            regex: "\\b[0-9]+(?:\\.[0-9]+)?\\b"
          }
        ]
      };
      this.normalizeRules();
    };
    
    oop.inherits(MusicVHighlightRules, TextHighlightRules);
    exports.MusicVHighlightRules = MusicVHighlightRules;
  });
};

const props = defineProps({
  mode: {
    type: String,
    default: 'editor' // 'editor' or 'terminal'
  }
})

const emit = defineEmits(['evaluate', 'keydown'])

const editor = ref(null)
const editorContainer = ref(null)
const aceEditor = ref(null)
const resizeObserver = ref(null)

onMounted(() => {
  // Preload the font with correct attributes
  const fontPreload = document.createElement('link');
  fontPreload.rel = 'preload';
  fontPreload.href = '/fonts/Glass_TTY_VT220.ttf';
  fontPreload.as = 'font';
  fontPreload.type = 'font/ttf';
  fontPreload.crossOrigin = 'anonymous';
  document.head.appendChild(fontPreload);

  // Add a style element to ensure the font is loaded and used
  const fontFaceStyle = document.createElement('style');
  fontFaceStyle.textContent = `
    @font-face {
      font-family: 'Glass TTY VT220';
      src: url('/fonts/Glass_TTY_VT220.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
      font-display: swap; /* Use swap instead of block to prevent white page */
    }
  `;
  document.head.appendChild(fontFaceStyle);

  // Initialize our custom MUSIC V mode
  defineMusicVMode();
  
  // Small delay to ensure font is loaded before initializing editor
  setTimeout(() => {
    initializeEditor();
    
    // Set up resize observer to handle container size changes
    resizeObserver.value = new ResizeObserver(() => {
      if (aceEditor.value) {
        aceEditor.value.resize();
      }
    });
    
    if (editorContainer.value) {
      resizeObserver.value.observe(editorContainer.value);
    }
  }, 100);
})

onUnmounted(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect()
  }
  
  if (aceEditor.value) {
    aceEditor.value.destroy()
  }
})

function initializeEditor() {
  if (!editor.value) return
  
  aceEditor.value = ace.edit(editor.value, {
    theme: 'ace/theme/monokai',
    mode: props.mode === 'editor' ? 'ace/mode/musicv' : 'ace/mode/text',
    fontSize: props.mode === 'terminal' ? 18 : 16, // Slightly larger font for terminal
    showPrintMargin: false,
    highlightActiveLine: props.mode === 'editor',
    readOnly: props.mode === 'terminal',
    showGutter: props.mode === 'editor',
    wrap: true,
    fontFamily: "'Glass TTY VT220', 'Courier New', 'Courier', monospace"
  })
  
  // Apply custom styling for terminal mode
  if (props.mode === 'terminal') {
    // Add terminal class to the editor element
    editor.value.classList.add('terminal');
    
    // Apply custom CSS to ensure the terminal styling is applied
    const customCSS = `
      .ace_editor.terminal .ace_content {
        background-color: #000000 !important;
        color: #ffb000 !important;
        font-family: 'Glass TTY VT220', 'Courier New', 'Courier', monospace !important;
        font-size: 18px !important;
      }
      .ace_editor.terminal .ace_cursor {
        background-color: #ffb000 !important;
        border-color: #ffb000 !important;
      }
      .ace_editor.terminal .ace_line {
        color: #ffb000 !important;
      }
    `;
    
    // Apply the custom CSS
    const styleElement = document.createElement('style');
    styleElement.textContent = customCSS;
    document.head.appendChild(styleElement);
  }
  
  // Add custom CSS for GEN keyword highlighting
  if (props.mode === 'editor') {
    const genHighlightCSS = `
      .ace_keyword.ace_gen {
        color: lime !important;
        font-weight: bold;
      }
    `;
    
    const genStyleElement = document.createElement('style');
    genStyleElement.textContent = genHighlightCSS;
    document.head.appendChild(genStyleElement);
    
    aceEditor.value.commands.addCommand({
      name: 'evaluate',
      bindKey: { win: 'Alt-Enter', mac: 'Alt-Enter' },
      exec: () => {
        emit('evaluate')
      }
    })
    
    // Disable the Ctrl+P command (go to line)
    aceEditor.value.commands.removeCommand('gotoline');
    
    // Also disable the Ctrl+P command by its key binding
    aceEditor.value.commands.bindKey("ctrl-p", null);
    
    aceEditor.value.container.addEventListener('keydown', (event) => {
      emit('keydown', event)
    })
  }
}

function addToEditor(text) {
  if (aceEditor.value) {
    aceEditor.value.setValue(text, -1) // -1 moves cursor to start
  }
}

function addTerminalOutput(text, type = 'info') {
  if (!aceEditor.value || props.mode !== 'terminal') return
  
  const currentValue = aceEditor.value.getValue()
  const newValue = currentValue ? currentValue + '\n' + text : text
  aceEditor.value.setValue(newValue)
  aceEditor.value.navigateFileEnd()
}

// Expose methods for parent components
defineExpose({
  addToEditor,
  addTerminalOutput,
  aceEditor: () => aceEditor.value,
  aceEditorInstance: () => aceEditor.value,
  terminalInstance: () => aceEditor.value,
  resize: () => {
    if (aceEditor.value) {
      aceEditor.value.resize();
    }
  }
});
</script>

<style>
/* Global styles for the terminal mode */
.ace_editor {
  font-family: 'Glass TTY VT220', 'Courier New', 'Courier', monospace !important;
}

.ace_editor.terminal {
  background-color: transparent !important;
}
.ace_editor.terminal .ace_content {
  background-color: transparent !important;
  color: #ffb000 !important;
  font-family: 'Glass TTY VT220', 'Courier New', 'Courier', monospace !important;
}
.ace_editor.terminal .ace_cursor {
  background-color: #ffb000 !important;
  border-color: #ffb000 !important;
}
.ace_editor.terminal .ace_line {
  color: #ffb000 !important;
}

/* Ensure the font is loaded globally */
@font-face {
  font-family: 'Glass TTY VT220';
  src: url('/fonts/Glass_TTY_VT220.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap; /* Change to swap to prevent white page while font is loading */
}
</style>

<style scoped>
.ace-editor-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 500px;
  background-color: transparent;
}

.editor {
  width: 100%;
  height: 100%;
  min-height: 250px;
  background-color: transparent;
}

:deep(.ace_editor) {
  font-family: 'Glass TTY VT220', 'Courier New', 'Courier', monospace;
  background-color: transparent !important;
  font-size: 16px !important;
}

:deep(.ace_editor .ace_line) {
  padding-left: 0 !important;
}

:deep(.terminal) {
  background-color: #000000 !important;
}

:deep(.terminal .ace_content) {
  background-color: #000000 !important;
  color: #ffb000 !important; /* Amber color for vintage terminal look */
  font-family: 'Glass TTY VT220', 'Courier New', 'Courier', monospace !important;
  font-size: 18px !important;
  line-height: 1.2 !important;
}

:deep(.terminal .ace_cursor) {
  background-color: #ffb000 !important;
  border-color: #ffb000 !important;
}

:deep(.terminal .ace_text-layer) {
  font-family: 'Glass TTY VT220', 'Courier New', 'Courier', monospace !important;
}

@font-face {
  font-family: 'Glass TTY VT220';
  src: url('/fonts/Glass_TTY_VT220.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
</style>
