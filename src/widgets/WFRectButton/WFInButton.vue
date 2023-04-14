<template>
  <wf-image
    :config="{
      width: 16,
      height: 16,
      x: config.x,
      y: config.y,
      src: require('@/assets/workflow/in-gray.png'),
    }"
    @click="handleClick"
  />
</template>
<script>
export default {
  name: "WFInButton",
  props: {
    config: {
      type: Object,
    },
  },
  methods: {
    handleClick(...p) {
      this.$emit("click", ...p);
    },
  },
};
</script>
