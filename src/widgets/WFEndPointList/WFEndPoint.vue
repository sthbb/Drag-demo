<template>
  <v-circle
    :config="{
      ...$attrs.config,
      radius: getRadius(),
      strokeWidth: hover ? 1 : 0,
      stroke: 'yellow',
    }"
    @mouseenter="handleMouseEndPointEnter"
    @mouseleave="handleMouseEndPointLeave"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import { EndPointUtil } from "@/utils";
export default {
  name: "WFEndPoint",
  data() {
    return {
      hover: false,
    };
  },

  methods: {
    handleMouseEndPointEnter() {
      this.hover = true;
    },
    handleMouseEndPointLeave() {
      this.hover = false;
    },

    getRadius() {
      return EndPointUtil.getRadius();
    },
  },
};
</script>
