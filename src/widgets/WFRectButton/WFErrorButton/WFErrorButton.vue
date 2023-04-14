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
      src: require('@/assets/workflow/error-orange.svg'),
      hoverSrc: require('@/assets/workflow/error-orange.svg'),
      hoverFill: '#DCDFE6',
    }"
  />
</template>
<script>
export default {
  name: "WFErrorButton",
  props: {
    config: {
      type: Object,
    },
  },
};
</script>
