<template>
  <wf-image
    :config="{
      width: 16,
      height: 16,
      x: config.x,
      y: config.y,
      src: require('@/assets/workflow/edit-blue.svg'),
    }"
    @click="handleClick"
  />
</template>
<script>
export default {
  name: "WFEditButton",
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
