<template>
  <div class="wf-main">
    <el-tabs v-model="currentTab" type="card" @tab-remove="handleRemoveTab">
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.id"
        :name="tab.name"
        :label="tab.title"
        :closable="tab.closable"
      >
        <span slot="label">
          <span>
            <span>{{ tab.title }}</span>
            <span>({{ tab.wfschemaoncechanged ? "已修改" : "未修改" }})</span>
          </span>
          <i
            v-if="tab.saveable"
            class="el-icon-news"
            @click="handleCustomWFSchemaSave($event, tab)"
          ></i>
        </span>

        <wf-designer
          :ref="`designer_${tab.id}`"
          :designertype="tab.designertype"
          :designing="designing"
          @wfschemaoncechanged="() => (tab.wfschemaoncechanged = true)"
          @customwfschemadrill="handleCustomWFSchemaDrill"
          @beforeclearall="handleBeforeClearAll(tab)"
          @beforeuploadjson="handleBeforeUploadJSON"
          @light="handleLight"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import WFDesigner from "@/components/WFDesigner.vue";
import { cloneDeep, RandomColor } from "@/utils";

export default {
  name: "WFMain",
  components: {
    "wf-designer": WFDesigner,
  },
  mounted() {
    const entryDesigner = this.getEntryDesigner();

    entryDesigner.watchWFSchemaOnceChanged();
  },
  data() {
    return {
      currentTab: "entry",
      tabs: [
        {
          id: "entry",
          name: "entry",
          title: "入口",
          designertype: "entry",
          closable: false,
          saveable: false,
          wfschemaoncechanged: false,
        },
      ],
    };
  },

  methods: {
    handleLight() {
      this.setWFNodeLight("start", "red");
      this.setCustomWFNodeLight(
        "95a860545cb349898f94f9994149f2a0",
        "blue",
        "1948815ccdf54a188cfce90ef541c751",
        "red"
      );
      window.setTimeout(() => {
        this.clearAllWFNodeLight();
      }, 5000);
    },

    clearAllWFNodeLight() {
      for (const tab of this.tabs) {
        this.getDesigner(tab.id).clearAllWFNodeLight();
      }
    },

    setWFNodeLight(wfNodeId, lightColor) {
      const entry = this.getEntryDesigner();
      entry.setWFNodeLight(wfNodeId, lightColor);
    },

    setCustomWFNodeLight(
      customWFNodeId,
      customLightColor,
      wfNodeId,
      lightColor
    ) {
      for (const tab of this.tabs) {
        const designer = this.getDesigner(tab.id);
        if (tab.id === "entry") {
          designer.setCustomWFNodeLight(
            customWFNodeId,
            customLightColor,
            wfNodeId,
            lightColor
          );
        } else {
          designer.setWFNodeLight(wfNodeId, lightColor);
        }
      }
    },

    getEntryDesigner() {
      return this.$refs["designer_entry"][0];
    },

    getDesigner(id) {
      return this.$refs[`designer_${id}`][0];
    },

    addTab(wfNode) {
      this.tabs.push({
        id: wfNode.wfNodeId,
        name: wfNode.wfNodeId,
        title: wfNode.wfNodeId,
        designertype: "custom",
        closable: true,
        saveable: true,
        wfschemaoncechanged: false,
        identificationcolor: RandomColor.random(),
      });

      this.$nextTick(() => {
        const entryDesigner = this.getEntryDesigner();
        const curretDesigner = this.getDesigner(wfNode.wfNodeId);
        const customWFNode = cloneDeep(
          entryDesigner.getWFNodeByWFNodeId(wfNode.wfNodeId)
        );

        if (customWFNode?.customWFSchema?.stageConfig) {
          customWFNode.customWFSchema.wfPath = [
            ...entryDesigner.getWFSchema().wfPath,
            wfNode.wfNodeId,
          ];
          curretDesigner.setWFSchema(
            customWFNode.customWFSchema,
            customWFNode.endpoints
          );
        }

        curretDesigner.watchWFSchemaOnceChanged();
      });
    },

    exist(wfNode) {
      return this.tabs.some((t) => t.id === wfNode.wfNodeId);
    },

    activeTab(wfNode) {
      this.currentTab = wfNode.wfNodeId;
    },

    activeLast() {
      this.currentTab = this.tabs[this.tabs.length - 1].id;
    },

    activeEntry() {
      this.currentTab = "entry";
    },

    checkoutTab(wfNode) {
      if (!this.exist(wfNode)) {
        this.addTab(wfNode);
      }

      this.activeTab(wfNode);
    },

    removeTab(id) {
      this.tabs = this.tabs.filter((t) => t.id !== id);
    },

    getTab(id) {
      return this.tabs.find((t) => t.id === id);
    },

    saveCustomWFSchema(wfNodeId) {
      const entryDesigner = this.getEntryDesigner();
      const curretDesigner = this.getDesigner(wfNodeId);
      const currentCustomWFSchema = curretDesigner.getWFSchema();
      const customWFNode = entryDesigner.getWFNodeByWFNodeId(wfNodeId);

      if (!this.validateCustomWFNode(customWFNode, currentCustomWFSchema)) {
        return false;
      }

      customWFNode.customWFSchema = cloneDeep(currentCustomWFSchema);

      this.$nextTick(() => {
        entryDesigner.syncWFNodeListAndWFConnectorList();
      });

      return true;
    },

    validateCustomWFNode(customWFNode, currentCustomWFSchema) {
      for (const endpoint of customWFNode.endpoints) {
        if (
          !currentCustomWFSchema.wfNodeList.find(
            (n) => n.id === endpoint.innerNodeId
          )
        ) {
          this.$message.warning(
            "外部条件必须有对应的出节点保存失败,请检查外部出节点条件"
          );
          return false;
        }
      }
      return true;
    },

    handleCustomWFSchemaDrill(event) {
      this.checkoutTab({ wfNodeId: event.wfNodeId });
    },

    handleCustomWFSchemaSave(event, tab) {
      console.log(event, "handleCustomWFSchemaSave");

      if (this.saveCustomWFSchema(tab.id)) {
        this.$message.success("自定义节点已保存");

        this.removeTab(tab.id);

        window.setTimeout(() => {
          this.activeEntry();
        }, 0);
      }
    },

    handleRemoveTab(event) {
      const id = event;
      const tab = this.getTab(id);
      if (tab?.wfschemaoncechanged) {
        this.$confirm("已被修改过,是否保存修改后的配置?", "提示", {
          confirmButtonText: "保存",
          cancelButtonText: "不保存",
          distinguishCancelAndClose: true,
          type: "warning",
        })
          .then(() => {
            this.handleCustomWFSchemaSave({}, tab);
          })
          .catch((action) => {
            if (action === "cancel") {
              this.removeTab(id);

              this.activeLast();
            }
          });
      } else {
        this.removeTab(id);

        this.activeLast();
      }
    },

    removeAllCustomTabs() {
      this.tabs
        .filter((t) => t.id !== "entry")
        .map((t) => t.id)
        .forEach((id) => {
          this.removeTab(id);
        });
    },

    handleBeforeUploadJSON() {
      this.removeAllCustomTabs();
    },

    handleBeforeClearAll(tab) {
      if (tab.id === "entry") {
        this.removeAllCustomTabs();
      }
    },
  },

  computed: {
    designing() {
      return this.tabs.filter((t) => t.id !== "entry");
    },
  },
};
</script>
<style lang="scss" scoped>
$--color-text-placeholder: #c0c4cc;
$--color-white: #ffffff;

.wf-main {
  min-width: 1200px;
}

.wf-main ::v-deep .el-tabs__item {
  .el-icon-news {
    border-radius: 50%;
    text-align: center;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    margin-left: 5px;
    &:before {
      transform: scale(0.9);
      display: inline-block;
    }

    &:hover {
      background-color: $--color-text-placeholder;
      color: $--color-white;
    }

    position: relative;
    font-size: 12px;
    width: 0;
    height: 14px;
    vertical-align: middle;
    line-height: 15px;
    overflow: hidden;
    top: -1px;
    right: -2px;
    transform-origin: 100% 50%;
  }

  &:hover,
  &.is-active {
    .el-icon-news {
      width: 14px;
    }
  }
}
</style>
