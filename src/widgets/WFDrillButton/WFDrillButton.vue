<template>
  <v-text
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    :config="{
      ...$attrs.config,
      text: drilling ? '正在下钻' : '下钻进入',
      fill: hoverEdit ? 'red' : 'black',
    }"
  ></v-text>
</template>
<script>
export default {
  name: "WFEditButton",
  props: {
    drilling: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      hoverEdit: false,
    };
  },
  methods: {
    handleMouseEnter() {
      this.hoverEdit = true;
    },

    handleMouseLeave() {
      this.hoverEdit = false;
    },

    handleClick(...p) {
      this.$emit("click", ...p);
    },
  },
};
</script>
