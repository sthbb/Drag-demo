<template>
  <wf-image-button
    v-bind="$attrs"
    v-on="$listeners"
    :config="{
      ...config,
      x: config.x,
      y: config.y,
      width: config.size,
      height: config.size,
      src: require('@/assets/workflow/close-black.svg'),
      hoverSrc: require('@/assets/workflow/close-white.svg'),
      hoverFill: '#F56C6C',
    }"
  />
</template>
<script>
export default {
  name: "WFCloseButton",
  props: {
    config: {
      type: Object,
    },
  },
};
</script>
