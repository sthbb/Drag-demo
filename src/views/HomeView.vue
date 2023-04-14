<template>
  <div class="home">
    <wf-main />
  </div>
</template>

<script>
import WFMain from "@/components/WFMain.vue";
export default {
  name: "HomeView",
  components: {
    "wf-main": WFMain,
  },
};
</script>
<style lang="scss" scoped></style>
