<template>
  <v-group
    :config="{ ...$attrs.config }"
    @mouseover="handleMouseEndPointOver"
    @mouseout="handleMouseEndPointOut"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <v-rect
      :config="{
        x: 0,
        y: 0,
        width: $attrs.config.width,
        height: $attrs.config.height,
        fill: hover ? $attrs.config.hoverFill : null,
      }"
    >
    </v-rect>
    <wf-image
      :config="{
        x: 0,
        y: 0,
        width: $attrs.config.width,
        height: $attrs.config.height,
        src: hover ? $attrs.config.hoverSrc : $attrs.config.src,
      }"
    />
  </v-group>
</template>

<script>
export default {
  name: "WFImageButton",
  data() {
    return {
      hover: false,
    };
  },
  methods: {
    handleMouseEndPointOver() {
      this.hover = true;
    },
    handleMouseEndPointOut() {
      this.hover = false;
    },
  },
};
</script>
