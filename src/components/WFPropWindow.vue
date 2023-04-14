<template>
  <el-dialog
    class="dg"
    :visible="visible"
    @update:visible="(val) => $emit('update:visible', val)"
    :close-on-click-modal="false"
    :destroy-on-close="true"
  >
    <el-form :model="json" ref="jsonForm" label-width="100px" size="mini">
      <el-form-item
        prop="funcName"
        label="方法名"
        :rules="[{ required: true, message: '请输入方法名', trigger: 'blur' }]"
      >
        <el-input v-model="json.funcName"></el-input>
      </el-form-item>
      <el-form-item prop="isIn" label="入节点" v-if="designertype === 'custom'">
        <el-switch v-model="json.isIn" style="float: left"></el-switch>
      </el-form-item>
      <el-form-item label="条件列表">
        <el-button
          style="float: left"
          @click="addEndPoint"
          icon="el-icon-circle-plus-outline"
          type="primary"
        >
          新增条件
        </el-button>
      </el-form-item>

      <el-row
        :label="`条件${index + 1}`"
        :key="endpoint.key"
        v-for="(endpoint, index) in json.endpoints"
      >
        <el-col :span="1">
          <el-form-item
            :prop="'endpoints.' + index + '.color'"
            :show-message="false"
            :rules="{
              required: true,
              message: '颜色必填',
              trigger: 'blur',
            }"
          >
            <el-color-picker v-model="endpoint.color"> </el-color-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="json.wType === 'wf-custom-node'">
          <el-form-item
            :prop="'endpoints.' + index + '.innerNodeId'"
            :rules="{
              required: true,
              message: '内部节点不能为空',
              trigger: 'blur',
            }"
          >
            <el-select
              style="width: 200px"
              v-model="endpoint.innerNodeId"
              placeholder="请选择"
            >
              <!--自顶向下设置node的显示名称-->
              <el-option
                :label="getLabel(node)"
                :value="node.id"
                :key="`node_${node.id}`"
                v-for="node in json.customWFSchema.wfNodeList"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item
            :prop="'endpoints.' + index + '.condition'"
            :rules="{
              required: true,
              message: '条件不能为空',
              trigger: 'blur',
            }"
          >
            <el-input
              placeholder="请输入内容"
              v-model="endpoint.condition"
              class="input-with-select"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button
            size="mini"
            icon="el-icon-circle-close"
            @click.prevent="removeEndPoint(endpoint)"
          >
            删除
          </el-button>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-circle-check"
          @click="submitForm('jsonForm')"
        >
          提交
        </el-button>
        <el-button icon="el-icon-circle-close" @click="closeDialog">
          关闭
        </el-button>
      </el-form-item>
    </el-form>
    <!-- {{ value }} -->
  </el-dialog>
</template>
<script>
import { newId, RandomColor } from "@/utils";
export default {
  name: "WFPropWindow",
  props: {
    visible: {
      type: Boolean,
      default: () => false,
    },
    designertype: {
      type: String,
      default: () => "entry",
    },
  },
  data() {
    return {
      usedEndpoints: [],
      json: {
        wType: null,
        id: null,
        name: null,
        title: null,
        funcName: null,
        caption: null,
        label: null,
        x: 419,
        y: 213,
        imageWidth: 50,
        imageHeight: 50,
        draggable: true,
        lightColor: null,
        _async: false,
        varType: "var",
        isIn: false,
        isOut: false,
        remark: "",
        endpoints: [],
        varName: "result1",
      },
    };
  },
  methods: {
    closeDialog() {
      this.$emit("update:visible", false);
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("submit", this.json.isIn);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    removeEndPoint(item) {
      if (this.usedEndpoints.find((u) => u.id === item.id)) {
        this.$message.warning("请先删除所有连先后,再删除该条件");
        return;
      }
      const index = this.json.endpoints.findIndex((e) => e.id === item.id);
      if (index !== -1) {
        this.json.endpoints.splice(index, 1);
      }
    },

    addEndPoint() {
      this.json.endpoints.push({
        id: newId(),
        condition: "",
        color: RandomColor.random(),
      });
    },
    getLabel(node) {
      return (
        node.nodeAlias ??
        node.title ??
        node.caption ??
        node.label ??
        node.funcName
      );
    },
    setJSON(json, usedEndpoints) {
      this.json = json;
      this.usedEndpoints = usedEndpoints;
    },
    getJSON() {
      return this.json;
    },
  },
};
</script>
<style scoped>
.el-form-item.is-error .el-color-picker {
  border-style: solid;
  border-width: 1px;
  border-color: red;
}
.dg ::v-deep .el-dialog {
  min-width: 960px;
}
</style>
