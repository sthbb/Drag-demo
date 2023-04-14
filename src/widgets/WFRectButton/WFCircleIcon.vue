<template>
  <v-group
    :config="{
      x: config.x,
      y: config.y,
      width: 40,
      height: 40,
      offset: {
        x: 20,
        y: 20,
      },
    }"
  >
    <!--圆圈-->
    <v-circle
      :config="{
        x: 20,
        y: 20,
        radius: 20,
        fill: '#EEECF3',
        strokeWidth: 1,
        stroke: '#0000001F',
      }"
    />
    <!---节点图片-->
    <wf-image
      :config="{
        width: 22,
        height: 22,
        offset: {
          x: 11,
          y: 11,
        },
        x: 20,
        y: 20,
        src: config.imageSrc,
      }"
    />
  </v-group>
</template>
<script>
export default {
  name: "WFCircle",
  props: {
    config: {
      type: Object,
    },
  },
};
</script>
