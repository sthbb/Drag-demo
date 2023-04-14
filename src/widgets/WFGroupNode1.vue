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
    @mouseup="handleWFNodeMouseUp"
  >
    <!--顶部终结点列表-->
    <wf-group-endpoint-list
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
    />

    <!--中部按钮-->
    <wf-rect-button
      :config="{
        x: (NODE_WIDTH - BUTTON_WIDTH) / 2,
        y: ENDPOINT_HEIGHT + VERTICAL_PADDING,
        imageSrc: imageSrc,
        caption: config.caption,
        description: config.label,
      }"
      :drillable="true"
      :drilling="isDesigning"
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
import { WFGroupEndPointList } from "./WFEndPointList";
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
    isDesigning: {
      type: Boolean,
    },
    allowBeDirected: {
      type: Boolean,
      default: () => true,
    },
  },

  components: {
    "wf-rect-button": WFRectButton,
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

    handleWFNodeMouseUp(event) {
      if ((this.IN_END_POINTS?.length ?? 0) === 1) {
        const wfEndPointId = this.IN_END_POINTS?.[0]?.id;
        if (!wfEndPointId) {
          this.$message.warning("终结点Id不正确");
          return;
        }

        this.handleEndPointMouseUp(event, this.config.id, wfEndPointId);
      }
    },

    handleEndPointMouseUp(evt, wfNodeId, wfEndPointId) {
      if (this.isDesigning) {
        this.$message.warning("当前流程图编辑中");
        return;
      }

      if (this.allowBeDirected) {
        this.$emit("wfendpointmouseup", { evt, wfNodeId, wfEndPointId });
      }
    },

    handleClick(evt, wfNodeId) {
      this.$emit("wfnodeclick", { evt, wfNodeId });
    },

    handleDrillClick(evt) {
      this.$emit("customwfschemaedit", { evt, wfNodeId: this.config.id });

      evt.cancelBubble = true;
    },

    handleEditWFNode() {
      console.log("编辑某个节点");
    },

    handleDeleteWFNode(evt) {
      this.$emit("wfnodedelete", { evt, wfNodeId: this.config.id });

      evt.cancelBubble = true;
    },
  },

  computed: {
    NODE_OFFSET() {
      return {
        x: this.NODE_WIDTH / 2,
        y: this.NODE_HEIGHT / 2,
      };
    },

    IN_ENDPOINTLIST_WIDTH() {
      return EndPointUtil.getWidth(this.IN_END_POINTS);
    },

    OUT_ENDPOINTLIST_WIDTH() {
      return EndPointUtil.getWidth(this.OUT_END_POINTS);
    },

    BUTTON_WIDTH() {
      return BUTTON_WIDTH;
    },

    BUTTON_HEIGHT() {
      return BUTTON_HEIGHT;
    },

    NODE_WIDTH() {
      return NodeUtil.getNodeWidth([
        this.IN_ENDPOINTLIST_WIDTH,
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

    IN_END_POINTS() {
      return [
        ...(
          this.config?.customWFSchema?.wfNodeList?.filter?.(
            (n) => n.wType === "wf-in-node"
          ) ?? []
        ).map((n) => {
          return { ...n, color: n.color ?? "#409EFF" };
        }),
      ];
    },

    OUT_END_POINTS() {
      return [
        ...(
          this.config?.customWFSchema?.wfNodeList?.filter?.(
            (n) => n.wType === "wf-out-node"
          ) ?? []
        ).map((n) => {
          return { ...n, color: n.color ?? "red" };
        }),
      ];
    },
  },
};
</script>
