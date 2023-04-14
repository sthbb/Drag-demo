<template>
  <v-group
    :config="{
      x: config.x,
      y: config.y,
      width: getWidth(),
      height: getHeight(),
    }"
  >
    <wf-endpoint
      :key="getWFEndPointId(config.ioType, config.id, endpoint.id)"
      v-for="(endpoint, edindex) of config.endpoints"
      @mouseenter="handleEndPointMouseEnter($event, endpoint)"
      @mouseleave="handleEndPointMouseLeave($event, endpoint)"
      @mousedown="handleEndPointMouseDown($event, endpoint)"
      @mouseup="handleEndPointMouseUp($event, endpoint)"
      :config="{
        id: getWFEndPointId(config.ioType, config.id, endpoint.id),
        x: getEndPointX(edindex),
        y: getEndPointY(),
        fill: endpoint.color,
      }"
    />
  </v-group>
</template>
<script>
import { EndPointUtil } from "@/utils";
import WFEndPoint from "./WFEndPoint.vue";

export default {
  name: "WFGroupEndPointList",
  components: {
    "wf-endpoint": WFEndPoint,
  },
  props: {
    config: {
      type: Object,
    },
  },
  methods: {
    handleEndPointMouseEnter(event, endpoint) {
      this.$emit("endpointenter", { event, endpoint });
    },

    handleEndPointMouseLeave(event, endpoint) {
      this.$emit("endpointleave", { event, endpoint });
    },

    handleEndPointMouseDown(event, endpoint) {
      this.$emit("endpointdown", { event, endpoint });
    },

    handleEndPointMouseUp(event, endpoint) {
      this.$emit("endpointup", { event, endpoint });
    },

    getWFEndPointId(ioType, wfNodeId, wfEndPointId) {
      return EndPointUtil.getWFEndPointId(ioType, wfNodeId, wfEndPointId);
    },

    getWidth() {
      return EndPointUtil.getWidth(this.config.endpoints);
    },

    getHeight() {
      return EndPointUtil.getHeight();
    },

    getEndPointX(index) {
      return EndPointUtil.getEndPointX(index);
    },

    getEndPointY() {
      return EndPointUtil.getEndPointY();
    },
  },
};
</script>
