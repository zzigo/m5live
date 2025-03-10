<template>
  <div class="ace-editor-container" ref="editorContainer">
    <div class="editor" :class="{ 'editor': mode === 'editor', 'terminal': mode === 'terminal' }" ref="editorRef"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import ace from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/theme-monokai';

const props = defineProps({
  mode: { type: String, default: 'editor' },
  value: { type: String, default: '' }
});

const emit = defineEmits(['evaluate', 'evaluateTS', 'keydown', 'input']);

const editorRef = ref(null);
const editorContainer = ref(null);
const aceEditor = ref(null);
const resizeObserver = ref(null);

const defineMusicVMode = () => {
  ace.define('ace/mode/musicv', ['require', 'exports', 'ace/lib/oop', 'ace/mode/text', 'ace/mode/musicv_highlight_rules'], (require, exports) => {
    const oop = require('ace/lib/oop');
    const TextMode = require('ace/mode/text').Mode;
    const MusicVHighlightRules = require('ace/mode/musicv_highlight_rules').MusicVHighlightRules;

    const Mode = function () { this.HighlightRules = MusicVHighlightRules; };
    oop.inherits(Mode, TextMode);
    Mode.prototype.lineCommentStart = 'COM ';
    Mode.prototype.toggleCommentLines = function (state, session, startRow, endRow) {
      const commentRegex = /^(?:\s*)(?:COM |COMMENT |COMMENT: )/;
      let uncomment = true;
      for (let i = startRow; i <= endRow; i++) {
        if (!commentRegex.test(session.getLine(i))) { uncomment = false; break; }
      }
      if (uncomment) {
        for (let i = startRow; i <= endRow; i++) {
          const line = session.getLine(i);
          const m = line.match(commentRegex);
          if (m) session.replace(new ace.Range(i, m.index, i, m[0].length), '');
        }
      } else {
        session.indentRows(startRow, endRow, 'COM ');
      }
    };
    exports.Mode = Mode;
  });

  ace.define('ace/mode/musicv_highlight_rules', ['require', 'exports', 'ace/lib/oop', 'ace/mode/text_highlight_rules'], (require, exports) => {
    const oop = require('ace/lib/oop');
    const TextHighlightRules = require('ace/mode/text_highlight_rules').TextHighlightRules;

    const MusicVHighlightRules = function () {
      this.$rules = {
        start: [
          { token: 'comment', regex: '^\\s*(?:COM|COMMENT|COMMENT:)\\s.*$' },
          { token: 'keyword.gen', regex: '\\b(GEN)\\b' },
          { token: 'keyword', regex: '\\b(INS|OSC|OUT|END|NOT|TER)\\b' },
          { token: 'constant.numeric', regex: '\\b[0-9]+(?:\\.[0-9]+)?\\b' }
        ]
      };
      this.normalizeRules();
    };
    oop.inherits(MusicVHighlightRules, TextHighlightRules);
    exports.MusicVHighlightRules = MusicVHighlightRules;
  });
};

onMounted(() => {
  if (process.server) return;
  console.log('Mounting AceEditor, ref:', editorRef.value); // Debug
  if (!editorRef.value) {
    console.error('Editor ref not found');
    return;
  }

  defineMusicVMode();
  aceEditor.value = ace.edit(editorRef.value, {
    theme: 'ace/theme/monokai',
    mode: props.mode === 'editor' ? 'ace/mode/musicv' : 'ace/mode/text',
    fontSize: props.mode === 'terminal' ? 8 : 10,
    showPrintMargin: false,
    highlightActiveLine: props.mode === 'editor',
    readOnly: props.mode === 'terminal',
    showGutter: props.mode === 'editor',
    wrap: true,
    fontFamily: "'Web437_IBM_MDA', monospace",
    value: props.value
  });
  console.log('Ace Editor initialized:', aceEditor.value); // Debug

  if (props.mode === 'editor') {
    aceEditor.value.commands.addCommand({
      name: 'evaluateTS',
      bindKey: { win: 'Alt-Enter', mac: 'Alt-Enter' },
      exec: () => emit('evaluateTS', aceEditor.value.getValue())
    });
    aceEditor.value.commands.addCommand({
      name: 'evaluateBinary',
      bindKey: { win: 'Ctrl-Enter', mac: 'Ctrl-Enter' },
      exec: () => emit('evaluate', aceEditor.value.getValue())
    });
    aceEditor.value.commands.removeCommand('gotoline');
    aceEditor.value.commands.bindKey('ctrl-p', null);
    
    // Disable Alt+Shift+Arrow Left/Right shortcuts to prevent conflicts with code navigation
    aceEditor.value.commands.bindKey('Alt-Shift-Left', null);
    aceEditor.value.commands.bindKey('Alt-Shift-Right', null);
    
    aceEditor.value.container.addEventListener('keydown', (e) => emit('keydown', e));
  }

  aceEditor.value.on('change', () => emit('input', aceEditor.value.getValue()));

  resizeObserver.value = new ResizeObserver(() => aceEditor.value?.resize());
  if (editorContainer.value) resizeObserver.value.observe(editorContainer.value);
});

onUnmounted(() => {
  if (process.server) return;
  if (resizeObserver.value) resizeObserver.value.disconnect();
  if (aceEditor.value) aceEditor.value.destroy();
});

defineExpose({
  addToEditor: (text) => !process.server && aceEditor.value?.setValue(text, -1),
  addTerminalOutput: (text) => {
    if (!process.server && props.mode === 'terminal' && aceEditor.value) {
      const current = aceEditor.value.getValue();
      aceEditor.value.setValue(current ? `${current}\n${text}` : text);
      aceEditor.value.navigateFileEnd();
    }
  },
  aceEditor: () => (!process.server ? aceEditor.value : null),
  resize: () => !process.server && aceEditor.value?.resize(),
  clearEditor: () => !process.server && aceEditor.value?.setValue(''),
  clearTerminal: () => !process.server && props.mode === 'terminal' && aceEditor.value?.setValue('')
});
</script>

<style scoped>
.ace-editor-container {
  margin: 0;
  padding: 0;

  width: 100%;
  height: 100%;
  background: transparent;
}

.editor {
  width: 100%;
  height: 100%;
  background: transparent;
}

:deep(.ace_editor) {
  background: transparent !important;
  font-family: 'Web437_IBM_MDA','IBM Plex mono' monospace;
  font-size: 14px !important;
  color: #ffffff !important;
}

:deep(.ace_editor.editor) {
  font-size: 10px;
}

:deep(.ace_editor.terminal) {
  background: #000000 !important;
  font-size: 8px;
}

:deep(.ace_editor.terminal .ace_content),
:deep(.ace_editor.terminal .ace_line) {
  color: #ffb000 !important;
  line-height: 1.9;
  font-size: 9px !important;
}

:deep(.ace_editor .ace_gutter) {
  background: transparent;
  color: #555;
}

:deep(.ace_editor.terminal .ace_gutter) {
  display: none;
}
</style>