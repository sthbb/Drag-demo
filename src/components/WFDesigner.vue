<template>
  <div class="wf-editor" ref="wf-editor">
    <div class="top">
      <wf-bar
        :width.sync="width"
        :height.sync="height"
        :zoom.sync="zoom"
        :grid="grid"
        :designertype="designertype"
        @grid="handleGrid"
        @clear="handleClear"
        @undo="handleUndo"
        @redo="handleRedo"
        @downjson="handleDownJSON"
        @upjson="handleUpJSON"
        @autolayout="handleAutoLayout"
        @fullscreen="handleFullScreen"
        @codepreview="handleCodePreview"
        @jsonpreview="handleJSONPreview"
      />
    </div>
    <div class="container">
      <div class="left">
        <wf-tools :designertype="designertype" />
      </div>
      <div class="center">
        <wf-drawer
          :grid="grid"
          ref="wfDrawer"
          :width.sync="width"
          :height.sync="height"
          :zoom.sync="zoom"
          :designing="designing"
          @customwfschemadrill="handleCustomWFSchemaDrill"
          @wfnodecode="handleWFNodeCode"
          @wfnodesetting="handleWFNodeSetting"
          @wfnodeedit="handleWFNodeEdit"
          @wfelementselected="handleWFElementSelected"
          @wfelementallunselected="handleWFElementAllUnSelected"
          @wfschemaoncechanged="(val) => $emit('wfschemaoncechanged', val)"
        />
      </div>
      <!--属性框-->
      <div>
        <!--修改标题等的对话框-->
        <wf-prop-window
          ref="wf-prop-window"
          v-if="EditDialogVisiable"
          :visible.sync="EditDialogVisiable"
          :designertype="designertype"
          @submit="handleWFNodeSubmit"
        />
        <!--预览JSON-->
        <wf-json-preview
          ref="wf-json-preview"
          v-if="JSONPreviewDialogVisiable"
          :visible.sync="JSONPreviewDialogVisiable"
        />
        <!--预览代码-->
        <wf-code-preview
          ref="wf-code-preview"
          v-if="CodePreviewDialogVisiable"
          :visible.sync="CodePreviewDialogVisiable"
        />

        <!--params-json参数配置-->
        <wf-params-json-settings
          ref="wf-params-json-settings"
          v-if="ParamsJSONSettingsDialogVisiable"
          :visible.sync="ParamsJSONSettingsDialogVisiable"
          @saveparamjson="handleSaveParamJSON"
        />
      </div>
      <!-- <div class="right">
        <wf-prop-editor :editWFNode="editWFNode" />
      </div> -->
    </div>
  </div>
</template>

<script>
import WFDrawer from "@/components/WFDrawer.vue";
import WFRender from "@/components/WFRender.vue";
import WFBar from "@/components/WFBar.vue";
import WFTools from "@/components/WFTools.vue";
import WFPropWindow from "@/components/WFPropWindow.vue";
import WFJSONPreview from "@/components/WFJSONPreview.vue";
import WFCodePreview from "@/components/WFCodePreview.vue";

import WFParamsJSONSettings from "@/components/WFParamsJSONSettings.vue";

import { downloadJSON, upLoadJSON, toggleFullScreen } from "@/utils";
import api from "@/service/wfcode";

export default {
  name: "WFDesigner",
  components: {
    "wf-drawer": WFDrawer,

    "wf-render": WFRender,
    "wf-bar": WFBar,
    "wf-tools": WFTools,
    "wf-prop-window": WFPropWindow,
    "wf-json-preview": WFJSONPreview,
    "wf-code-preview": WFCodePreview,
    "wf-params-json-settings": WFParamsJSONSettings,
  },
  props: {
    designertype: {
      type: String,
      default: () => "entry",
    },

    designing: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      wfNodeId: null,

      grid: false,

      width: 1024,
      height: 768,
      zoom: 100,
      EditDialogVisiable: false,
      JSONPreviewDialogVisiable: false,
      CodePreviewDialogVisiable: false,
      ParamsJSONSettingsDialogVisiable: false,
    };
  },
  methods: {
    async handleCodePreview() {
      if (!this.$refs.wfDrawer.validate()) {
        this.$message.warning("验证失败,请检查警告标志,并根据提示做相应修改");
        return;
      }

      const loading = this.$loading();
      try {
        const json = this.getWFSchema();
        const csharp = await api.previewCSharpCode(JSON.stringify(json));
        this.CodePreviewDialogVisiable = true;
        this.$nextTick(async () => {
          this.$refs["wf-code-preview"].setCode(csharp);
        });
      } finally {
        loading.close();
      }
    },

    handleJSONPreview() {
      this.JSONPreviewDialogVisiable = true;
      this.$nextTick(() => {
        const json = this.getWFSchema();
        this.$refs["wf-json-preview"].setJSON(JSON.stringify(json));
      });
    },

    handleGrid() {
      if (this.grid) {
        this.grid = false;
      } else {
        this.grid = true;
      }
    },

    handleCustomWFSchemaDrill(...p) {
      this.$emit("customwfschemadrill", ...p);
    },

    handleClear() {
      const wfSchema = this.getWFSchema();
      if (
        wfSchema.wfNodeList.length === 0 &&
        wfSchema.wfConnectorList.length === 0
      ) {
        this.$message({
          message: "流程图已是空的",
          type: "warning",
        });
        return;
      }

      this.$confirm("确认要清空当前流程图吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$emit("beforeclearall");
          this.$refs.wfDrawer.clear();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    handleWFElementAllUnSelected() {
      this.wfNodeId = null;
    },

    handleWFNodeCode(event) {
      console.log(event, "event");
      this.$alert("弹出二开代码二开代码", "二开代码");
    },

    handleWFNodeSetting(event) {
      const { evt, wfNodeId } = event;
      const wfNode = this.$refs.wfDrawer.getWFNodeByWFNodeId(wfNodeId, true);
      if (wfNode.wType !== "wf-action-node") {
        return;
      }

      this.ParamsJSONSettingsDialogVisiable = true;

      console.log(wfNodeId, "wfNodeId");
      this.$nextTick(() => {
        const formData = wfNode?.paramJson ?? {};
        const paramJsonSchema = wfNode?.paramJsonSchema ?? { schema: {} };

        this.$refs["wf-params-json-settings"].setFormData(formData);
        this.$refs["wf-params-json-settings"].setParamJsonSchema(
          paramJsonSchema
        );
      });
    },

    handleSaveParamJSON(formData) {
      console.log(formData, "formData");
      this.$refs.wfDrawer.setParamJSONByWFNodeId(formData, this.wfNodeId);
      this.ParamsJSONSettingsDialogVisiable = false;
    },

    handleWFNodeEdit(event) {
      const { evt, wfNodeId } = event;

      this.EditDialogVisiable = true;
      this.$nextTick(() => {
        const wfNode = this.$refs.wfDrawer.getWFNodeByWFNodeId(wfNodeId, true);
        const usedEndpoints = this.$refs.wfDrawer.getUsedEndpoints(wfNodeId);
        this.$refs["wf-prop-window"].setJSON(wfNode, usedEndpoints);
      });
    },

    handleWFNodeSubmit(isIn) {
      if (isIn) {
        this.$refs.wfDrawer.clearAllisIn();
      }
      const json = this.$refs["wf-prop-window"].getJSON();
      this.$refs.wfDrawer.setWFNodeByWFNodeId(json, this.wfNodeId);
      this.EditDialogVisiable = false;
    },

    handleWFElementSelected(selected) {
      if (selected.type === "wfNode") {
        console.log(selected.id, "wfNodeId");
        this.wfNodeId = selected.id;
      }
    },

    handleDownJSON() {
      const wfSchema = this.getWFSchema();
      downloadJSON(wfSchema);
    },
    handleUpJSON() {
      upLoadJSON((wfSchema) => {
        if (
          wfSchema &&
          wfSchema.stageConfig &&
          wfSchema.wfNodeList &&
          wfSchema.wfConnectorList
        ) {
          this.$emit("beforeuploadjson");

          this.$refs.wfDrawer.setWFSchema(wfSchema);
        } else {
          this.$message({
            message: "JSON格式不正确请检查上传的文件",
            type: "warning",
          });
        }
      });
    },
    handleUndo() {
      this.$refs.wfDrawer.undoRecord();
    },
    handleRedo() {
      this.$refs.wfDrawer.redoRecord();
    },
    handleAutoLayout() {
      this.$refs.wfDrawer.autoLayout();
    },
    handleFullScreen() {
      toggleFullScreen(window.document.body);
    },

    getWFSchema() {
      return this.$refs.wfDrawer.getWFSchema();
    },

    setWFSchema(wfSchema, outEndpoints = []) {
      this.$refs.wfDrawer.setWFSchema(wfSchema, outEndpoints);
    },

    getWFNodeByWFNodeId(wfNodeId) {
      return this.$refs.wfDrawer.getWFNodeByWFNodeId(wfNodeId);
    },

    watchWFSchemaOnceChanged() {
      this.$refs.wfDrawer.watchWFSchemaOnceChanged();
    },

    syncWFNodeListAndWFConnectorList() {
      this.$refs.wfDrawer.syncWFNodeListAndWFConnectorList();
    },

    findTo(wfNodeId, wfEndPointId) {
      return this.$refs.wfDrawer.findTo(wfNodeId, wfEndPointId);
    },

    findFrom(wfNodeId, wfEndPointId) {
      return this.$refs.wfDrawer.findFrom(wfNodeId, wfEndPointId);
    },

    deleteWFNodeById(wfNodeId) {
      return this.$refs.wfDrawer.deleteWFNodeById(wfNodeId);
    },

    clearAllWFNodeLight() {
      this.$refs.wfDrawer.clearAllWFNodeLight();
    },

    setWFNodeLight(wfNodeId, lightColor) {
      this.$refs.wfDrawer.setWFNodeLight(wfNodeId, lightColor);
    },

    setCustomWFNodeLight(
      customWFNodeId,
      customLightColor,
      wfNodeId,
      lightColor
    ) {
      this.$refs.wfDrawer.setCustomWFNodeLight(
        customWFNodeId,
        customLightColor,
        wfNodeId,
        lightColor
      );
    },

    validate() {
      return this.$refs.wfDrawer.validate();
    },
  },
};
</script>
<style lang="scss" scoped>
.top {
  text-align: left;
}

$top-height: 140px;
$left-width: 150px;
$horizontal-right-width: 50px;
$designer-area-padding: 20px;

$min-width: 1024px;
$min-height: 768px;

.container {
  min-width: $min-width;
  min-height: $min-height;
}

.left {
  float: left;
  overflow: hidden;
  width: $left-width;
}

.right {
  float: right;
  overflow: hidden;
  width: $horizontal-right-width;
}

.center {
  float: left;
  overflow: auto;
  background-color: #7f7f7f;
  box-sizing: border-box;
  padding: $designer-area-padding;
  border-style: solid;
  border-width: 1px;
  border-color: black;
  width: calc(
    100vw - #{$left-width} - #{$horizontal-right-width} - 2 * #{$designer-area-padding}
  );
  height: calc(100vh - #{$top-height});

  min-width: $min-width - $left-width - $horizontal-right-width - 2 *
    $designer-area-padding;
  min-height: $min-height - $top-height;
}

.wf-editor:fullscreen {
  padding: 15px;
  background-color: rgba(255, 255, 255, 1);
}
</style>
