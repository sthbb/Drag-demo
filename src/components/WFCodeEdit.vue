<template>
  <codemirror
    :value="code"
    @input="(val) => $emit('update:code', val)"
    :options="cmOption"
  />
</template>

<script>
import { codemirror } from "vue-codemirror";

import "codemirror/lib/codemirror.css";
import "codemirror/keymap/sublime";

import "codemirror/theme/base16-dark.css";

import "codemirror/mode/vue/vue.js";

import "codemirror/addon/selection/active-line.js";

import "codemirror/addon/selection/mark-selection.js";
import "codemirror/addon/search/searchcursor.js";

import "codemirror/addon/scroll/annotatescrollbar.js";
import "codemirror/addon/search/matchesonscrollbar.js";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/match-highlighter.js";

import "codemirror/mode/clike/clike.js";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/comment/comment.js";
import "codemirror/addon/dialog/dialog.js";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/search.js";
import "codemirror/keymap/sublime.js";

import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/comment-fold.js";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/indent-fold.js";
import "codemirror/addon/fold/markdown-fold.js";
import "codemirror/addon/fold/xml-fold.js";

import "codemirror/addon/display/autorefresh.js";

import "codemirror/mode/xml/xml.js";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/clike/clike.js";

export default {
  name: "WFCodeEdit",
  components: {
    codemirror,
  },
  props: {
    code: {
      type: String,
      default: () => "",
    },
    mode: {
      type: String,
      default: () => "text/javascript",
    },
  },
  data() {
    return {
      cmOption: {
        size: {},
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        foldGutter: true,
        styleSelectedText: true,
        mode: this.mode,
        keyMap: "sublime",
        matchBrackets: true,
        showCursorWhenSelecting: true,
        theme: "base16-dark",
        extraKeys: { Ctrl: "autocomplete" },
        readOnly: true,
        autoRefresh: { delay: 250 },
        hintOptions: {
          completeSingle: false,
        },
      },
    };
  },
  watch: {
    mode: {
      immediate: true,
      handler(val) {
        if (val) {
          this.cmOption.mode = val;
        }
      },
    },
  },
};
</script>
<style lang="scss">
.CodeMirror {
  text-align: left !important;
  border: 1px solid #eee;
  height: auto;
}
</style>
