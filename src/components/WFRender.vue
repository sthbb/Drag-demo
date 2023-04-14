<template>
  <div class="wf-designer">
    <!-- Debug 信息-->
    <!-- <div class="wf-debug">
      <div>{{ currentDraggingConnector }}</div>
      <div>{{ wfSchema.wfConnectorList }}</div>
      <div>{{ currentSelectedList }}</div>
      <div>{{ timeTravel }}</div>
    </div> -->

    <!--整个设计器的画布容器-->
    <div
      class="wf-canvas-container"
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
          <!--当前正在拖动的那个箭头连接线-->
          <v-arrow
            :config="{
              points: [
                currentDraggingConnector.from.x,
                currentDraggingConnector.from.y,
                currentDraggingConnector.to.x,
                currentDraggingConnector.to.y,
              ],
              visible: isConnecting,
              pointerLength: 5,
              pointerWidth: 5,
              fill: 'black',
              stroke: 'black',
              strokeWidth: 2,
            }"
          />
          <!--所有wfNode的元素集合 -->
          <component
            :is="item.wType"
            v-for="item in wfSchema.wfNodeList"
            :key="item.id"
            :config="{ ...item, draggable: false }"
            :isConnecting="isConnecting"
            @start-connect="handleStartConnect"
            @finish-connect="handleFinishConnect"
            @dragmove="handleWFNodeDragMove"
            @dragend="handleWFNodeDragend"
            @wfnodeclick="handleWFNodeClick"
          />
          <!--所有wfConnector箭头连接线的元素集合 -->
          <v-arrow
            v-for="connector in wfSchema.wfConnectorList"
            :key="connector.id"
            :config="{ ...connector }"
          />
          <!--图形变换和移动的组件konva实现-->
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
} from "@/utils/index";

const width = 1024;
const height = 768;

export default {
  name: "WFDesigner",

  created() {
    this._timeTravel = new TimeTravel(this);

    this._polyLineProcess = new PolyLineProcess(this);
  },
  mounted() {
    this.recordCurrentStateSnapshot();
  },
  props: {
    travelMaxStep: {
      type: Number,
      default: () => Number.POSITIVE_INFINITY,
    },
  },
  data() {
    return {
      wfSchema: {
        stageConfig: {
          width: width,
          height: height,
          zoom: 1,
        },

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

    handleWFNodeClick(event) {
      console.log(event, "wfnodeclick");
      const { wfNodeId } = event;
      this.currentSelectedList = [wfNodeId];

      this.$emit("wfnodeselected", wfNodeId);

      this.updateTransformer();
    },

    handleStageMouseDown(event) {
      if (event.target === this.getStage()) {
        this.currentSelectedList = [];

        this.updateTransformer();
      }
    },

    updateTransformer() {
      const transformerNode = this.$refs.transformer.getNode();

      const stage = transformerNode.getStage();
      if (this.currentSelectedList.length > 0) {
        const selectedNode = stage.findOne("#" + this.currentSelectedList[0]);
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
      const wfToolItem = JSON.parse(
        event.dataTransfer.getData(WFTOOLITEM_DATA_KEY)
      );
      const id = newId();
      this.wfSchema.wfNodeList.push({
        wType: wfToolItem.wType,
        id: id,
        name: id,
        x: event.offsetX,
        y: event.offsetY,
        imageWidth: 50,
        imageHeight: 50,
        draggable: true,
        ...wfToolItem.initialization,
      });

      this.recordCurrentStateSnapshot();
    },

    handleStartConnect(event) {
      const { evt, wfNodeId, wfEndPointId } = event;
      const x = evt.evt.offsetX;
      const y = evt.evt.offsetY;
      this.currentDraggingConnector.from.wfNodeId = wfNodeId;
      this.currentDraggingConnector.from.wfEndPointId = wfEndPointId;

      this.currentDraggingConnector.from.x = x;
      this.currentDraggingConnector.from.y = y;

      this.currentDraggingConnector.to.x = x;
      this.currentDraggingConnector.to.y = y;

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

        strokeWidth: 2,
      });

      this.recordCurrentStateSnapshot();
    },

    handleWFNodeDragMove(event) {
      console.log(event, "event");

      this.syncWFNodeListAndWFConnectorList();
    },

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
      }
    },

    clear() {
      this.wfSchema.wfNodeList = [];
      this.wfSchema.wfConnectorList = [];

      this.resetTimeTravel();
    },

    getWFSchema() {
      return cloneDeep(this.wfSchema);
    },

    setWFSchema(wfSchema) {
      this.wfSchema = cloneDeep(wfSchema);

      this.recordCurrentStateSnapshot();
    },

    getWFNodeByWFNodeId(wfNodeId) {
      return this.wfSchema.wfNodeList.find((n) => n.id === wfNodeId);
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
  },
};
</script>
<style scoped>
.wf-canvas-container {
  float: left;
  border: 1px solid black;
}
</style>
