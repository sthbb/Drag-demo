<template>
  <el-dialog
    :visible="visible"
    @update:visible="(val) => $emit('update:visible', val)"
    :close-on-click-modal="false"
    :destroy-on-close="true"
  >
    <div slot="title" class="dialog-header">参数设定</div>
    <div></div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="() => $emit('update:visible', false)">取 消</el-button>
      <el-button type="primary" @click="handleSaveParamJSON">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { cloneDeep } from "@/utils";

export default {
  name: "WFParamsJSONSettings",

  props: {
    visible: {
      type: Boolean,
      default: () => false,
    },
  },
  methods: {
    setFormData(formData) {
      this.formData = cloneDeep(formData);
    },
    setParamJsonSchema(paramJsonSchema) {
      this.paramJsonSchema = cloneDeep(paramJsonSchema);
    },
    async handleSaveParamJSON() {
      try {
        await this.$refs.vjsf.validate();
        this.$emit("saveparamjson", cloneDeep(this.formData));
      } catch (err) {
        console.log(err, "validate error");
      }
    },
  },
  data() {
    return {
      formData: {},
      paramJsonSchema: {
        schema: {},
      },
    };
  },
};
</script>
<style scoped>
.dialog-header {
  text-align: left;
}
</style>
