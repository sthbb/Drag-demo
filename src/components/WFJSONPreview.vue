<template>
  <el-dialog
    :visible="visible"
    @update:visible="(val) => $emit('update:visible', val)"
    :close-on-click-modal="false"
    :destroy-on-close="true"
  >
    <div>
      <wf-code-edit :code.sync="json" />
    </div>
  </el-dialog>
</template>
<script>
import WFCodeEdit from "@/components/WFCodeEdit";

export default {
  name: "WFJSONPreview",
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
      json: "",
    };
  },
  methods: {
    setJSON(json) {
      this.json = this.try2Format(json);
    },

    try2Format(json) {
      try {
        return JSON.stringify(JSON.parse(json), null, 2);
      } catch {
        return json;
      }
    },
  },
};
</script>
