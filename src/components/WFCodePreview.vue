<template>
  <el-dialog
    :visible="visible"
    @update:visible="(val) => $emit('update:visible', val)"
    :close-on-click-modal="false"
    :destroy-on-close="true"
  >
    <div>
      <wf-code-edit :code.sync="code" mode="text/x-csharp" />
    </div>
  </el-dialog>
</template>
<script>
import WFCodeEdit from "@/components/WFCodeEdit";

export default {
  name: "WFCodePreview",
  components: {
    "wf-code-edit": WFCodeEdit,
  },
  props: {
    visible: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      code: "",
    };
  },
  methods: {
    setCode(code) {
      this.code = code;
    },
  },
};
</script>
