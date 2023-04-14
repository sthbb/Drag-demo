<template>
  <div>
    <div class="wf-tools">
      <el-form :inline="true">
        <el-form-item label="宽度">
          <el-input-number
            v-model="innerWidth"
            :min="1"
            :step="1"
            @change="(val) => $emit('update:width', parseInt(val))"
            placeholder="宽度"
          >
          </el-input-number>
        </el-form-item>
        <el-form-item label="高度">
          <el-input-number
            v-model="innerHeight"
            :min="1"
            :step="1"
            @change="(val) => $emit('update:height', parseInt(val))"
            placeholder="高度"
          >
          </el-input-number>
        </el-form-item>
        <el-form-item label="缩放">
          <el-input-number
            v-model="innerZoom"
            :min="1"
            :step="1"
            @change="(val) => $emit('update:zoom', parseInt(val))"
          >
          </el-input-number>
        </el-form-item>
        <el-form-item>
          <el-tooltip class="item" effect="dark" content="网格" placement="top">
            <el-button
              circle
              :type="`${grid ? 'primary' : null}`"
              icon="el-icon-s-grid"
              @click="handleGrid"
            ></el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <el-tooltip class="item" effect="dark" content="清空" placement="top">
            <el-button
              circle
              icon="el-icon-delete"
              @click="handleClear"
            ></el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <el-tooltip class="item" effect="dark" content="撤销" placement="top">
            <el-button
              circle
              icon="el-icon-refresh-left"
              @click="handleUndo"
            ></el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <el-tooltip class="item" effect="dark" content="重做" placement="top">
            <el-button
              circle
              icon="el-icon-refresh-right"
              @click="handleRedo"
            ></el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item v-if="designertype === 'entry'">
          <el-tooltip
            class="item"
            effect="dark"
            content="下载JSON"
            placement="top"
          >
            <el-button
              circle
              icon="el-icon-download"
              @click="handleDownJSON"
            ></el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item v-if="designertype === 'entry'">
          <el-tooltip
            class="item"
            effect="dark"
            content="导入JSON"
            placement="top"
          >
            <el-button
              circle
              icon="el-icon-upload2"
              @click="handleImportJSON"
            ></el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <el-tooltip
            class="item"
            effect="dark"
            content="自动排列"
            placement="top"
          >
            <el-button
              circle
              icon="el-icon-files"
              @click="handleAutoLayout"
            ></el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <el-tooltip
            class="item"
            effect="dark"
            content="全屏/退出"
            placement="top"
          >
            <el-button
              circle
              icon="el-icon-full-screen"
              @click="handleFullScreen"
            ></el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item v-if="designertype === 'entry'">
          <el-tooltip
            class="item"
            effect="dark"
            content="预览代码"
            placement="top"
          >
            <el-button
              circle
              icon="el-icon-tickets"
              @click="handleCodePreview"
            ></el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item v-if="designertype === 'entry'">
          <el-tooltip
            class="item"
            effect="dark"
            content="预览JSON"
            placement="top"
          >
            <el-button
              circle
              icon="el-icon-s-order"
              @click="handleJSONPreview"
            ></el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item v-if="designertype === 'entry'">
          <el-tooltip
            class="item"
            effect="dark"
            content="反向生成"
            placement="top"
          >
            <el-button
              circle
              icon="el-icon-upload"
              @click="handleAutoLayout"
            ></el-button>
          </el-tooltip>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "WFBar",
  data() {
    return {
      innerWidth: this.width,
      innerHeight: this.height,
      innerZoom: this.zoom,
    };
  },
  props: {
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    zoom: {
      type: Number,
    },
    grid: {
      type: Boolean,
    },

    designertype: {
      type: String,
      default: () => "entry",
    },
  },

  methods: {
    handleCodePreview() {
      this.$emit("codepreview");
    },
    handleJSONPreview() {
      this.$emit("jsonpreview");
    },
    handleGrid() {
      this.$emit("grid");
    },
    handleClear() {
      this.$emit("clear");
    },
    handleUndo() {
      this.$emit("undo");
    },
    handleRedo() {
      this.$emit("redo");
    },
    handleDownJSON() {
      this.$emit("downjson");
    },
    handleImportJSON() {
      this.$emit("upjson");
    },
    handleAutoLayout() {
      this.$emit("autolayout");
    },
    handleFullScreen() {
      this.$emit("fullscreen");
    },
  },

  watch: {
    width: {
      handler(newVal, oldVal) {
        if (newVal !== null && newVal !== undefined) {
          this.innerWidth = newVal;
        }
      },
    },
    height: {
      handler(newVal, oldVal) {
        if (newVal !== null && newVal !== undefined) {
          this.innerHeight = newVal;
        }
      },
    },
    zoom: {
      handler(newVal, oldVal) {
        if (newVal !== null && newVal !== undefined) {
          this.innerZoom = newVal;
        }
      },
    },
  },
};
</script>
<style scoped>
/* .wf-tools {
  text-align: left;
} */
</style>
