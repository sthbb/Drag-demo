<template>
  <v-text
    :config="{
      x: config.x,
      y: config.y,
      text: config.text,
      fontSize: 12,
      fontFamily: 'Inter',
      fill: '#444D56',
    }"
  ></v-text>
</template>

<script>
export default {
  name: "WFDescription",
  props: {
    config: {
      type: Object,
    },
  },
};
</script>
