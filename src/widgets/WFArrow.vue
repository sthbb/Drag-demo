<template>
  <v-group
    :config="{ id: config.id }"
    @mouseenter="handleConnectorMouseEnter"
    @mouseleave="handleConnectorMouseLeave"
    @click="handleConnectorClick"
  >
    <!--删除按钮-->
    <wf-close-button
      @click="handleConnectorDeleteClick"
      :config="{
        x: config.fromWFNode.x + 5,
        y: config.fromWFNode.y + 10,
        size: 12,
      }"
    />

    <!--箭头说明Label-->
    <v-text
      :config="{
        width: textWidth,
        text: condition,
        x: config.fromWFNode.x + 5,
        y: config.fromWFNode.y + 25,
      }"
    ></v-text>

    <!--加粗的箭头线-->
    <wf-stroke-arrow
      :config="{
        ...config,
        id: config.id,
        stroke: mouseEnter ? 'orange' : strokeColor,
        dash: config.dashed ? [10, 10] : null,
      }"
    />
  </v-group>
</template>

<script>
import { WFStrokeArrow } from "./WFStrokeArrow";
import { EndPointUtil } from "@/utils";
export default {
  name: "WFArrow",
  components: {
    "wf-stroke-arrow": WFStrokeArrow,
  },
  props: {
    config: {
      type: Object,
    },
    selected: {
      type: Boolean,
      default: () => false,
    },
    wfSchema: {
      type: Object,
    },
  },
  data() {
    return {
      mouseEnter: false,
    };
  },
  computed: {
    condition() {
      const node = this.wfSchema?.wfNodeList?.find?.(
        (n) => n.id === this.config.fromWFNode.wfNodeId
      );
      const endpoint = node?.endpoints?.find?.(
        (e) => e.id === this.config.fromWFNode.wfEndPointId
      );
      return endpoint?.condition ?? "";
    },
    strokeColor() {
      return this.selected ? "blue" : "#0D99FF";
    },
    textWidth() {
      return (
        EndPointUtil.ENDPOINT_DISTANCE -
        EndPointUtil.ENDPOINT_DIAMETER -
        this.config.strokeWidth
      );
    },
  },
  methods: {
    handleConnectorDeleteClick(evt) {
      this.$emit("wfconnectordelete", { evt, connectorId: this.config.id });

      evt.cancelBubble = true;
    },

    handleConnectorClick(evt) {
      this.$emit("wfconnectorclick", { evt, connectorId: this.config.id });
    },

    handleConnectorMouseEnter(evt) {
      this.mouseEnter = true;
    },

    handleConnectorMouseLeave(evt) {
      this.mouseEnter = false;
    },
  },
};
</script>
