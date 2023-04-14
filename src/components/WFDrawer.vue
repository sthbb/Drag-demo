<template>
  <div
    class="wf-drawer"
    :style="`transform-origin:0 0;transform:scale(${scaleSize})`"
  >
    <div
      :class="{
        'wf-canvas-container': true,
        'wf-grid-ruler': true,
        'show-grid': grid,
      }"
      @dragover.stop.prevent
      @drop="handleDropWFToolItem"
    >
      <v-stage
        ref="stage"
        :config="{
          width: wfSchema.stageConfig.width,
          height: wfSchema.stageConfig.height,
        }"
        @mousedown="handleStageMouseDown"
        @mousemove="handleStageMove"
        @mouseup="handleStageMouseUp"
      >
        <v-layer ref="layer" :config="{ xClass: 'XLayer' }">
          <v-arrow
            :config="{
              points: [
                currentDraggingConnector.from.x,
                currentDraggingConnector.from.y,
                currentDraggingConnector.to.x,
                currentDraggingConnector.to.y,
              ],
              dash: currentDraggingConnector.dashed ? [10, 10] : null,
              visible: isConnecting,
              pointerLength: 5,
              pointerWidth: 5,
              fill: 'black',
              stroke: 'black',
              strokeWidth: 3,
            }"
          />

          <wf-arrow
            :selected="isSelected(connector.id)"
            v-for="connector in wfSchema.wfConnectorList"
            :key="connector.id"
            @wfconnectorclick="handleWFConnectorClick"
            @wfconnectordelete="handleWFConnectorDelete"
            :config="{ ...connector }"
            :wfSchema="wfSchema"
          />

          <component
            :is="item.wType"
            v-for="item in wfSchema.wfNodeList"
            :key="item.id"
            :config="item"
            :isOut="isOut(item)"
            :isConnecting="isConnecting"
            :isDesigning="isDesigning(item)"
            :errorList="errorList(item)"
            @start-connect="handleStartConnect"
            @finish-connect="handleFinishConnect"
            @dragmove="handleWFNodeDragMove"
            @dragend="handleWFNodeDragend"
            @wfnodeclick="handleWFNodeClick"
            @customwfschemadrill="handleCustomWFSchemaDrill"
            @wfnodecode="handleWFNodeCode"
            @wfnodesetting="handleWFNodeSetting"
            @wfnodeedit="handleWFNodeEdit"
            @wfnodedelete="handleWFNodeDelete"
          />

          <v-transformer
            :config="{
              resizeEnabled: false,
              rotateEnabled: false,
            }"
            ref="transformer"
          />
        </v-layer>
      </v-stage>
    </div>
  </div>
</template>

<script>
import "@/widgets/index";
import {
  newId,
  TOP_BE_DIRECTED,
  WFTOOLITEM_DATA_KEY,
  cloneDeep,
  PolyLineProcess,
  TimeTravel,
  throttle,
  AutoLayoutUtil,
} from "@/utils/index";

export default {
  name: "WFDrawer",

  created() {
    this._timeTravel = new TimeTravel(this, Number.POSITIVE_INFINITY);

    this._polyLineProcess = new PolyLineProcess(this);
  },
  mounted() {
    this.recordCurrentStateSnapshot();
  },

  props: {
    grid: {
      type: Boolean,
      default: () => false,
    },
    width: {
      type: Number,
      default: () => 1024,
    },
    height: {
      type: Number,
      default: () => 768,
    },
    zoom: {
      type: Number,
      default: () => 100,
    },

    designing: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      outEndpoints: [],

      wfSchema: {
        stageConfig: {
          width: this.width,
          height: this.height,
          zoom: this.zoom,
        },

        wfPath: ["global"],

        wfNodeList: [],

        wfConnectorList: [],
      },

      isConnecting: false,

      currentDraggingConnector: {
        from: {
          x: 0,
          y: 0,
          wfNodeId: null,
          wfEndPointId: null,
        },

        dashed: null,

        midway: [],

        to: {
          x: 0,
          y: 0,
          wfNodeId: null,
          wfEndPointId: TOP_BE_DIRECTED,
        },
      },

      currentSelectedList: [],
    };
  },
  methods: {
    getStage() {
      return this.$refs.stage.getNode();
    },

    isSelected(id) {
      return this.currentSelectedList.find((s) => s.id === id) ? true : false;
    },

    updateWFElementSelected() {
      const arr = this.currentSelectedList
        .filter((s) => s.type === "wfNode")
        .map((s) => s.id);
      this.updateTransformer([...arr]);
    },

    handleWFConnectorClick(event) {
      console.log(event, "wfconnectorclick");
      const { connectorId } = event;
      const selected = { type: "wfConnector", id: connectorId };
      this.currentSelectedList = [selected];

      this.$emit("wfelementselected", cloneDeep(selected));

      this.updateWFElementSelected();
    },

    handleWFNodeClick(event) {
      console.log(event, "wfnodeclick");
      const { wfNodeId } = event;
      const selected = { type: "wfNode", id: wfNodeId };
      this.currentSelectedList = [selected];

      this.$emit("wfelementselected", cloneDeep(selected));

      this.updateWFElementSelected();
    },

    handleStageMouseDown(event) {
      if (event.target === this.getStage()) {
        this.currentSelectedList = [];
        this.$emit("wfelementallunselected");

        this.updateWFElementSelected();
      }
    },

    refreshTransformer() {
      const transformerNode = this.$refs.transformer.getNode();

      transformerNode.forceUpdate();
    },

    updateTransformer(arr) {
      const transformerNode = this.$refs.transformer.getNode();

      const stage = transformerNode.getStage();
      if (arr.length > 0) {
        const selectedNode = stage.findOne("#" + arr[0]);
        console.log(selectedNode, "selectedNode");

        if (selectedNode === transformerNode.node()) {
          return;
        }
        if (selectedNode) {
          transformerNode.nodes([selectedNode]);
        } else {
          transformerNode.nodes([]);
        }
      } else {
        transformerNode.nodes([]);
      }
    },

    handleDropWFToolItem(event) {
      const strToolItem = event.dataTransfer.getData(WFTOOLITEM_DATA_KEY);

      if (
        strToolItem === null ||
        strToolItem === undefined ||
        strToolItem.trim() === ""
      ) {
        return;
      }
      const wfToolItem = JSON.parse(strToolItem);
      const startType = "wf-start-node";
      const startId = "start";
      if (
        wfToolItem.wType === startType &&
        this.wfSchema.wfNodeList.filter((n) => n.wType === startType).length > 0
      ) {
        this.$message.warning("请勿添加多个开始节点");
        return;
      }
      const id = wfToolItem.wType === startType ? startId : newId();
      let node = {
        wType: wfToolItem.wType,
        id: id,
        name: id,
        title: wfToolItem.title,
        caption: wfToolItem.caption,
        label: wfToolItem.label,
        x: event.offsetX,
        y: event.offsetY,
        imageWidth: 50,
        imageHeight: 50,
        draggable: true,
        lightColor: null,
        ...wfToolItem.initialization,
      };
      if (node.wType === "wf-action-node" && !(node._async ?? false)) {
        node.varName = this.suggestNewVarName();
      }

      this.wfSchema.wfNodeList.push(node);

      this.recordCurrentStateSnapshot();
    },

    handleStartConnect(event) {
      const { evt, wfNodeId, wfEndPointId, _async } = event;
      const x = evt.evt.offsetX;
      const y = evt.evt.offsetY;
      this.currentDraggingConnector.from.wfNodeId = wfNodeId;
      this.currentDraggingConnector.from.wfEndPointId = wfEndPointId;

      this.currentDraggingConnector.from.x = x;
      this.currentDraggingConnector.from.y = y;

      this.currentDraggingConnector.to.x = x;
      this.currentDraggingConnector.to.y = y;

      this.currentDraggingConnector.dashed = _async ?? false;
      this.isConnecting = true;
    },

    handleStageMove(event) {
      if (this.isConnecting) {
        const x = event.evt.offsetX;
        const y = event.evt.offsetY;

        this.currentDraggingConnector.to.x = x;
        this.currentDraggingConnector.to.y = y;
      }
    },

    resetCurrentDraggingConnector() {
      this.isConnecting = false;

      this.currentDraggingConnector.from.wfNodeId = null;
      this.currentDraggingConnector.from.wfEndPointId = null;
      this.currentDraggingConnector.from.x = 0;
      this.currentDraggingConnector.from.y = 0;

      this.currentDraggingConnector.to.wfNodeId = null;
      this.currentDraggingConnector.to.wfEndPointId = TOP_BE_DIRECTED;
      this.currentDraggingConnector.to.x = 0;
      this.currentDraggingConnector.to.y = 0;

      this.currentDraggingConnector.dashed = null;
    },

    handleStageMouseUp(event) {
      console.log(event, "bubble event 2");

      this.resetCurrentDraggingConnector();
    },

    handleFinishConnect(event) {
      console.log(event, "bubble event 1");
      const { wfNodeId, wfEndPointId } = event;

      this.currentDraggingConnector.to.wfNodeId = wfNodeId;
      this.currentDraggingConnector.to.wfEndPointId = wfEndPointId;

      if (
        this.currentDraggingConnector.from.wfNodeId ===
        this.currentDraggingConnector.to.wfNodeId
      ) {
        return;
      }

      const fromWFNode = cloneDeep(this.currentDraggingConnector.from);
      const toWFNode = cloneDeep(this.currentDraggingConnector.to);

      const connectorInfo = this._polyLineProcess.generateConnectPoints(
        fromWFNode,
        toWFNode
      );

      const exsitConnector =
        this.wfSchema.wfConnectorList.filter(
          (c) =>
            c.fromWFNode.wfNodeId === fromWFNode.wfNodeId &&
            c.fromWFNode.wfEndPointId === fromWFNode.wfEndPointId &&
            c.toWFNode.wfNodeId === toWFNode.wfNodeId &&
            c.toWFNode.wfEndPointId === toWFNode.wfEndPointId
        ).length > 0;
      if (exsitConnector) {
        this.$message.warning("请勿重复连线");
        return;
      }

      const connectorId = newId();
      this.wfSchema.wfConnectorList.push({
        id: connectorId,
        name: connectorId,
        points: [...connectorInfo.points],
        fromWFNode: fromWFNode,
        toWFNode: toWFNode,
        pointerLength: 5,
        pointerWidth: 5,
        fill: "black",
        stroke: "black",
        dashed: this.currentDraggingConnector.dashed,

        strokeWidth: 3,
      });

      this.recordCurrentStateSnapshot();
    },

    handleWFNodeDragMove: throttle(function (event) {
      console.log(event, "event");

      this.syncWFNodeListAndWFConnectorList();
    }, 100),

    handleWFNodeDragend(event) {
      console.log(event, "event");

      const wfNode = this.wfSchema.wfNodeList.find(
        (n) => n.id === event.target.id()
      );
      wfNode.x = event.target.x();
      wfNode.y = event.target.y();

      this.syncWFNodeListAndWFConnectorList();

      this.recordCurrentStateSnapshot();
    },

    syncWFNodeListAndWFConnectorList() {
      for (const wfConnector of this.wfSchema.wfConnectorList) {
        const connectorInfo = this._polyLineProcess.generateConnectPoints(
          wfConnector.fromWFNode,
          wfConnector.toWFNode,
          this
        );
        wfConnector.points = [...connectorInfo.points];

        if (connectorInfo.points.length >= 2) {
          wfConnector.fromWFNode.x = connectorInfo.points[0];
          wfConnector.fromWFNode.y = connectorInfo.points[1];
        }

        if (connectorInfo.points.length >= 4) {
          wfConnector.toWFNode.x =
            connectorInfo.points[connectorInfo.points.length - 2];
          wfConnector.toWFNode.y =
            connectorInfo.points[connectorInfo.points.length - 1];
        }
      }
    },

    handleWFNodeDelete(event) {
      const { evt, wfNodeId } = event;

      this.$confirm("确认要删除当前节点和其周围的连线吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteWFNodeById(wfNodeId);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    handleWFConnectorDelete(event) {
      const { evt, connectorId } = event;
      this.$confirm("确认要删除当前连线吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteWFConnectorById(connectorId);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    handleCustomWFSchemaDrill(...p) {
      this.$emit("customwfschemadrill", ...p);
    },

    handleWFNodeCode(...p) {
      this.$emit("wfnodecode", ...p);
    },

    handleWFNodeSetting(...p) {
      this.$emit("wfnodesetting", ...p);
    },

    handleWFNodeEdit(...p) {
      this.$emit("wfnodeedit", ...p);
    },

    deleteWFConnectorById(id) {
      this.wfSchema.wfConnectorList = this.wfSchema.wfConnectorList.filter(
        (c) => c.id !== id
      );
    },

    deleteWFNodeById(wfNodeId) {
      this.wfSchema.wfNodeList = this.wfSchema.wfNodeList.filter(
        (n) => n.id !== wfNodeId
      );
      this.wfSchema.wfConnectorList = this.wfSchema.wfConnectorList.filter(
        (c) =>
          c.fromWFNode.wfNodeId !== wfNodeId && c.toWFNode.wfNodeId !== wfNodeId
      );

      this.recordCurrentStateSnapshot();
    },

    clear() {
      this.wfSchema.wfNodeList = [];
      this.wfSchema.wfConnectorList = [];

      this.resetTimeTravel();
    },

    clearAllisIn() {
      for (const n of this.wfSchema.wfNodeList) {
        if (n?.isIn) {
          n.isIn = false;
        }
      }
    },

    getUsedEndpoints(wfNodeId) {
      const wfNode = this.wfSchema.wfNodeList.find((n) => n.id === wfNodeId);
      const arr = [];
      for (const endpoint of wfNode.endpoints) {
        if (
          this.wfSchema.wfConnectorList.find(
            (c) =>
              c.fromWFNode.wfNodeId === wfNodeId &&
              c.fromWFNode.wfEndPointId === endpoint.id
          )
        ) {
          arr.push(endpoint);
        }
      }
      return cloneDeep(arr);
    },

    getWFSchema() {
      return cloneDeep(this.wfSchema);
    },

    setWFSchema(wfSchema, outEndpoints = []) {
      this.outEndpoints = cloneDeep(outEndpoints);

      this.wfSchema = cloneDeep(wfSchema);

      this.$emit("update:width", this.wfSchema.stageConfig.width);

      this.$emit("update:height", this.wfSchema.stageConfig.height);

      this.$emit("update:zoom", this.wfSchema.stageConfig.zoom);

      this.recordCurrentStateSnapshot();
    },

    getWFNodeByWFNodeId(wfNodeId, deep = false) {
      const model = this.wfSchema.wfNodeList.find((n) => n.id === wfNodeId);
      if (deep) {
        return cloneDeep(model);
      }
      return model;
    },

    setWFNodeByWFNodeId(json, wfNodeId) {
      const index = this.wfSchema.wfNodeList.findIndex(
        (n) => n.id === wfNodeId
      );
      if (index !== -1) {
        this.$set(this.wfSchema.wfNodeList, index, cloneDeep(json));
        this.$nextTick(() => {
          this.refreshTransformer();

          this.syncWFNodeListAndWFConnectorList();

          this.recordCurrentStateSnapshot();
        });
      }
    },

    setParamJSONByWFNodeId(paramJson, wfNodeId) {
      const wfNode = this.wfSchema.wfNodeList.find((n) => n.id === wfNodeId);

      if (wfNode) {
        this.$set(wfNode, "paramJson", cloneDeep(paramJson));
      }
    },

    resetTimeTravel() {
      this._timeTravel.resetTimeTravel();
    },

    recordCurrentStateSnapshot() {
      this._timeTravel.recordCurrentStateSnapshot();
    },

    undoRecord() {
      this._timeTravel.undoRecord();
    },

    redoRecord() {
      this._timeTravel.redoRecord();
    },

    watchWFSchemaOnceChanged() {
      const unwatch = this.$watch(
        "wfSchema",
        () => {
          this.$emit("wfschemaoncechanged", {});

          unwatch();
        },
        { deep: true }
      );
    },

    computeVarName(prefix, index, namedArr) {
      console.log(prefix, "prefix");
      console.log(index, "index");
      console.log(namedArr, "namedArr");

      const testName = `${prefix}${index}`;
      if (!namedArr.includes(testName)) {
        return testName;
      }
      return this.computeVarName(prefix, index + 1, namedArr);
    },

    suggestNewVarName() {
      const nodes = (this.wfSchema?.wfNodeList ?? []).filter(
        (node) => node.wType === "wf-action-node" && !(node?._async ?? false)
      );

      const count = nodes.length;

      const namedArr = nodes
        .map((node) => node.varName)
        .filter((varName) => (varName ?? "").trim() !== "");

      const index = count + 1;

      const prefix = "result";

      const name = this.computeVarName(prefix, index, namedArr);

      return name;
    },

    suggestVarNameFunc(currentName) {
      console.log(currentName, "currentName");
      const nodes = (this.wfSchema?.wfNodeList ?? []).filter(
        (node) => node.wType === "wf-action-node" && !(node?._async ?? false)
      );

      const count = nodes.length;

      const namedArr = nodes
        .map((node) => node.varName)
        .filter((varName) => (varName ?? "").trim() !== "");

      const index = count;

      const prefix = "result";

      const name = this.computeVarName(prefix, index, namedArr);

      return name;
    },

    checkNameRepeatFunc(inputName) {
      const nodes = (this.wfSchema?.wfNodeList ?? []).filter(
        (node) => node.wType === "wf-action-node" && !(node?._async ?? false)
      );

      const namedArr = nodes
        .map((node) => node.varName)
        .filter((varName) => (varName ?? "").trim() !== "");

      return namedArr.includes(inputName);
    },

    findTo(wfNodeId, wfEndPointId) {
      return this.wfSchema.wfConnectorList.filter(
        (c) =>
          c.toWFNode.wfNodeId === wfNodeId &&
          c.toWFNode.wfEndPointId === wfEndPointId
      );
    },

    findFrom(wfNodeId, wfEndPointId) {
      return this.wfSchema.wfConnectorList.filter(
        (c) =>
          c.fromWFNode.wfNodeId === wfNodeId &&
          c.fromWFNode.wfEndPointId === wfEndPointId
      );
    },

    clearAllWFNodeLight() {
      for (const wfNode of this.wfSchema.wfNodeList) {
        wfNode.lightColor = null;
        if (wfNode.wType === "wf-custom-node") {
          const subs = wfNode.customWFSchema.wfNodeList ?? [];
          for (const sub of subs) {
            sub.lightColor = null;
          }
        }
      }
    },

    setWFNodeLight(wfNodeId, lightColor) {
      const wfNode = this.getWFNodeByWFNodeId(wfNodeId);
      if (wfNode) {
        wfNode.lightColor = lightColor;
      }
    },

    setCustomWFNodeLight(
      customWFNodeId,
      customLightColor,
      wfNodeId,
      lightColor
    ) {
      const customWFNode = this.getWFNodeByWFNodeId(customWFNodeId);
      if (customWFNode) {
        customWFNode.lightColor = customLightColor;
        const WFNode = customWFNode.customWFSchema?.wfNodeList?.find?.(
          (n) => n.id === wfNodeId
        );
        if (WFNode) {
          WFNode.lightColor = lightColor;
        }
      }
    },

    setOutWFNodeList(customWfNodeId, innerWFNodeIdList) {
      console.log(customWfNodeId, "customWfNodeId");
      console.log(innerWFNodeIdList, "innerWFNodeIdList");
    },

    isDesigning(config) {
      const exist = this.designing.find((t) => t.id === config.id);
      return exist ? true : false;
    },

    isOut(item) {
      const endpoint = this.outEndpoints.find((o) => o.innerNodeId === item.id);
      return endpoint ? true : false;
    },

    errorList(wfNode) {
      console.log(wfNode);
      if (wfNode.wType === "wf-action-node") {
        if (!wfNode.paramJson) {
          return ["参数未设定"];
        }
      }
      if (wfNode.wType === "wf-custom-node") {
        if (!this.validateSchema(wfNode.customWFSchema)) {
          return ["自定义节点中存在不合法节点,请下钻检查"];
        }
      }

      return [];
    },

    validateSchema(wfSchema) {
      let result = true;
      for (const wfNode of wfSchema?.wfNodeList ?? []) {
        if (this.errorList(wfNode).length > 0) {
          result = false;
        }
      }
      return result;
    },

    validate() {
      return this.validateSchema(this.wfSchema);
    },

    autoLayout() {
      const autoLayout = new AutoLayoutUtil(
        this.wfSchema.wfNodeList,
        this.wfSchema.wfConnectorList,
        this
      );

      autoLayout.layout();
    },
  },
  computed: {
    scaleSize() {
      return this.wfSchema.stageConfig.zoom / 100;
    },
  },
  watch: {
    width: {
      immediate: true,

      handler(newVal, oldVal) {
        if (newVal !== null && newVal !== undefined) {
          this.wfSchema.stageConfig.width = newVal;
        }
      },
    },

    height: {
      immediate: true,

      handler(newVal, oldVal) {
        if (newVal !== null && newVal !== undefined) {
          this.wfSchema.stageConfig.height = newVal;
        }
      },
    },

    zoom: {
      immediate: true,

      handler(newVal, oldVal) {
        if (newVal !== null && newVal !== undefined) {
          this.wfSchema.stageConfig.zoom = newVal;
        }
      },
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./wf-grid-ruler.scss";

.wf-drawer {
  float: left;
  overflow: hidden;
  background-color: white;
  border: 1px solid black;
  box-shadow: 3px 5px 5px black;
}
</style>
