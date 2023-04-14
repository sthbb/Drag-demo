<template>
  <!--所有图形节点的模板节点-->
  <!--整个节点的分组项-->

  <v-group
    ref="wfGroup"
    :config="{
      ...config,
      offset: NODE_OFFSET,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    }"
    @transformend="handleTransformEnd"
    @dragmove="handleDragMove"
    @dragend="handleDragEnd"
    @click="handleClick($event, config.id)"
    @mouseup="handleWFNodeMouseUp($event, config.id, TOP_BE_DIRECTED)"
  >
    <!-- @mouseup="handleWFNodeMouseUp" -->
    <!--顶部终结点列表-->
    <!-- <wf-group-endpoint-list
      :config="{
        x: (NODE_WIDTH - IN_ENDPOINTLIST_WIDTH) / 2,
        y: 0,
        id: config.id, 
        endpoints: IN_END_POINTS,
        ioType: 'in',
      }"
      @mouseenter="handleEndPointMouseEnter"
      @mouseleave="handleEndPointMouseLeave"
      @endpointup="
        handleEndPointMouseUp($event.event, config.id, $event.endpoint.id)
      "
    /> -->

    <!--节点顶部的天线-->
    <wf-endpoint
      v-if="allowBeDirected"
      :config="{
        id: getWFEndPointId('in', config.id, TOP_BE_DIRECTED),
        x: NODE_WIDTH / 2,
        y: getEndPointY(),
        fill: '#666',
        ioType: 'in',
      }"
    />

    <!--中部按钮-->
    <wf-rect-button
      :config="{
        x: (NODE_WIDTH - BUTTON_WIDTH) / 2,
        y: ENDPOINT_HEIGHT + VERTICAL_PADDING,
        wType: config.wType,
        imageSrc: imageSrc,
        caption: config.caption,
        description: config.label,
        isIn: config.isIn,
        isOut: isOut,
        lightColor: config.lightColor,
      }"
      :drillable="true"
      :drilling="isDesigning"
      :errorList="errorList"
      @setting="handleSettingWFNode"
      @edit="handleEditWFNode"
      @delete="handleDeleteWFNode"
      @drill="handleDrillClick"
    />

    <!--底部终结点列表-->
    <wf-group-endpoint-list
      :config="{
        x: (NODE_WIDTH - OUT_ENDPOINTLIST_WIDTH) / 2,
        y:
          ENDPOINT_HEIGHT + VERTICAL_PADDING + BUTTON_HEIGHT + VERTICAL_PADDING,
        id: config.id,
        endpoints: OUT_END_POINTS,
        ioType: 'out',
      }"
      @endpointenter="handleEndPointMouseEnter"
      @endpointleave="handleEndPointMouseLeave"
      @endpointdown="
        handleEndPointMouseDown($event.event, config.id, $event.endpoint.id)
      "
    />
  </v-group>
</template>
<script>
import WFRectButton, { BUTTON_WIDTH, BUTTON_HEIGHT } from "./WFRectButton";
import { WFEndPoint, WFGroupEndPointList } from "./WFEndPointList";
import { EndPointUtil } from "@/utils";
import { NodeUtil } from "@/utils";

export default {
  name: "WFGroupNode",
  props: {
    config: {
      type: Object,
    },
    imageSrc: {
      type: String,
      required: true,
    },
    isConnecting: {
      type: Boolean,
    },
    isOut: {
      type: Boolean,
    },
    isDesigning: {
      type: Boolean,
    },
    allowBeDirected: {
      type: Boolean,
      default: () => true,
    },
    errorList: {
      type: Array,
      default: () => [],
    },
  },

  components: {
    "wf-rect-button": WFRectButton,
    "wf-endpoint": WFEndPoint,
    "wf-group-endpoint-list": WFGroupEndPointList,
  },

  data() {
    return {};
  },

  methods: {
    handleTransformEnd(...p) {
      this.$emit("transformend", ...p);
    },

    handleDragMove(...p) {
      this.$emit("dragmove", ...p);
    },

    handleDragEnd(...p) {
      this.$emit("dragend", ...p);
    },

    handleEndPointMouseEnter(evt) {
      this.$refs.wfGroup.getNode().draggable(false);
    },

    handleEndPointMouseLeave(evt) {
      this.$refs.wfGroup.getNode().draggable(true);
    },

    handleEndPointMouseDown(evt, wfNodeId, wfEndPointId) {
      if (this.isDesigning) {
        this.$message.warning("当前流程图编辑中");
        return;
      }
      this.$emit("endpointdown", { evt, wfNodeId, wfEndPointId });
    },

    handleWFNodeMouseUp(evt, wfNodeId, wfEndPointId) {
      if (this.allowBeDirected) {
        this.$emit("wfnodemouseup", { evt, wfNodeId, wfEndPointId });
      }
    },

    handleClick(evt, wfNodeId) {
      this.$emit("wfnodeclick", { evt, wfNodeId });
    },

    handleSettingWFNode(evt) {
      this.$emit("wfnodesetting", { evt, wfNodeId: this.config.id });
    },

    handleEditWFNode(evt) {
      this.$emit("wfnodeedit", { evt, wfNodeId: this.config.id });
    },

    handleDeleteWFNode(evt) {
      this.$emit("wfnodedelete", { evt, wfNodeId: this.config.id });

      evt.cancelBubble = true;
    },

    handleDrillClick(evt) {
      this.$emit("customwfschemadrill", { evt, wfNodeId: this.config.id });

      evt.cancelBubble = true;
    },

    getWFEndPointId(ioType, wfNodeId, wfEndPointId) {
      return EndPointUtil.getWFEndPointId(ioType, wfNodeId, wfEndPointId);
    },

    getEndPointY() {
      return EndPointUtil.getEndPointY();
    },
  },

  computed: {
    TOP_BE_DIRECTED() {
      return EndPointUtil.TOP_BE_DIRECTED;
    },

    NODE_OFFSET() {
      return {
        x: this.NODE_WIDTH / 2,
        y: this.NODE_HEIGHT / 2,
      };
    },

    ENDPOINT_DIAMETER() {
      return EndPointUtil.getDiameter();
    },

    BUTTON_WIDTH() {
      return BUTTON_WIDTH;
    },

    BUTTON_HEIGHT() {
      return BUTTON_HEIGHT;
    },

    OUT_ENDPOINTLIST_WIDTH() {
      return EndPointUtil.getWidth(this.OUT_END_POINTS);
    },

    NODE_WIDTH() {
      return NodeUtil.getNodeWidth([
        this.ENDPOINT_DIAMETER,
        this.BUTTON_WIDTH,
        this.OUT_ENDPOINTLIST_WIDTH,
      ]);
    },

    ENDPOINT_HEIGHT() {
      return EndPointUtil.getHeight();
    },

    VERTICAL_PADDING() {
      return NodeUtil.VERTICAL_PADDING;
    },

    NODE_HEIGHT() {
      return NodeUtil.getNodeHeight([
        this.ENDPOINT_HEIGHT,
        this.VERTICAL_PADDING,
        this.BUTTON_HEIGHT,
        this.VERTICAL_PADDING,
        this.ENDPOINT_HEIGHT,
      ]);
    },

    OUT_END_POINTS() {
      return [
        ...(this.config?.endpoints ?? []).map((n) => {
          return { ...n, color: n.color ?? "red" };
        }),
      ];
    },
  },
};
</script>
