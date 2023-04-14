<template>
  <v-text
    :config="{
      x: config.x,
      y: config.y,
      text: config.text,
      fontSize: 16,
      fontFamily: 'Helvetica Neue',
      fill: '#444D56',
      fontStyle: 'bold',
    }"
  ></v-text>
</template>

<script>
export default {
  name: "WFCaption",
  props: {
    config: {
      type: Object,
    },
  },
};
</script>
