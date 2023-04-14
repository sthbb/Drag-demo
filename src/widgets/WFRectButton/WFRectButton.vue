<template>
  <!--图形分组-->
  <v-group
    :config="{
      width: BUTTON_WIDTH,
      height: BUTTON_HEIGHT,
      x: config.x,
      y: config.y,
    }"
    @mouseenter="handleMouseEndPointEnter"
    @mouseleave="handleMouseEndPointLeave"
  >
    <!--节点背景的方框-->
    <v-rect
      :config="{
        x: 0,
        y: 0,
        width: BUTTON_WIDTH,
        height: BUTTON_HEIGHT,
        stroke: '#EEECF3',
        strokeWidth: 2,
        cornerRadius: 8,
        fill: hover ? '#F2F2F2' : LIGHT_COLOR,
      }"
    />

    <!--圆形图标-->
    <wf-circle-icon :config="{ x: 40, y: 37, imageSrc: config.imageSrc }" />
    <!--文字标题-->
    <wf-caption :config="{ x: 76, y: 25, text: config.caption }" />
    <!--描述文字-->
    <wf-description :config="{ x: 76, y: 45, text: config.description }" />
    <!--是否可下钻按钮-->
    <wf-drill-button
      v-if="drillable"
      :drilling="drilling"
      :config="{ x: 160, y: 25 }"
      @click="handleDrill"
    />

    <!--进入按钮-->
    <wf-in-button v-if="config.isIn" :config="{ x: 140, y: 20 }" />
    <!--导出按钮-->
    <wf-out-button v-if="config.isOut" :config="{ x: 165, y: 20 }" />
    <!--编码按钮-->
    <wf-code-button
      v-if="
        config.wType === 'wf-action-node' || config.wType === 'wf-code-node'
      "
      :config="{ x: 190, y: 20 }"
      @click="handleCode"
    />
    <!--设置按钮-->
    <wf-setting-button :config="{ x: 215, y: 20 }" @click="handleSetting" />
    <!--编辑按钮-->
    <wf-edit-button :config="{ x: 240, y: 20 }" @click="handleEdit" />
    <!--删除按钮-->
    <wf-delete-button :config="{ x: 265, y: 20 }" @click="handleDelete" />
    <!--错误按钮-->
    <wf-error-button
      v-if="this.errorList.length > 0"
      :config="{ x: 5, y: 5, size: 16 }"
      @click="handleError"
    />
    <!-- <v-text
      :config="{
        x: 0,
        y: 0,
        text: config.validated,
        fontSize: 30,
        fontFamily: 'Calibri',
        fill: 'green',
      }"
    /> -->
  </v-group>
</template>
<script>
export const BUTTON_WIDTH = 296;

export const BUTTON_HEIGHT = 74;

const DEFAULT_RECT_BUTTON_BGCOLOR = "#ffffff";

import WFErrorButton from "./WFErrorButton";

import WFCircleIcon from "./WFCircleIcon";
import WFCaption from "./WFCaption";
import WFDescription from "./WFDescription";

import WFInButton from "./WFInButton";
import WFOutButton from "./WFOutButton";

import WFCodeButton from "./WFCodeButton";
import WFSettingButton from "./WFSettingButton";
import WFEditButton from "./WFEditButton";
import WFDeleteButton from "./WFDeleteButton";
import { WFDrillButton } from "../WFDrillButton";

export default {
  name: "WFRectButton",
  components: {
    "wf-error-button": WFErrorButton,

    "wf-circle-icon": WFCircleIcon,
    "wf-caption": WFCaption,
    "wf-description": WFDescription,

    "wf-in-button": WFInButton,
    "wf-out-button": WFOutButton,

    "wf-code-button": WFCodeButton,
    "wf-setting-button": WFSettingButton,
    "wf-edit-button": WFEditButton,
    "wf-delete-button": WFDeleteButton,
    "wf-drill-button": WFDrillButton,
  },
  props: {
    config: {
      type: Object,
    },
    drillable: {
      type: Boolean,
      default: () => false,
    },
    drilling: {
      type: Boolean,
      default: () => false,
    },
    errorList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      hover: false,
    };
  },

  methods: {
    handleMouseEndPointEnter() {
      this.hover = true;
    },
    handleMouseEndPointLeave() {
      this.hover = false;
    },
    handleDrill(...p) {
      this.$emit("drill", ...p);
    },
    handleCode(...p) {
      this.$emit("code", ...p);
    },
    handleSetting(...p) {
      if (this.drilling) {
        this.$message.warning("不可设置正在下钻的项目的参数");
        return;
      }
      this.$emit("setting", ...p);
    },
    handleEdit(...p) {
      if (this.drilling) {
        this.$message.warning("不可删除正在下钻的项目");
        return;
      }
      this.$emit("edit", ...p);
    },
    handleDelete(...p) {
      if (this.config.isOut) {
        this.$message.warning("请先删除外部的节点条件绑定,再删除该节点");
        return;
      }
      if (this.drilling) {
        this.$message.warning("不可编辑正在下钻的项目");
        return;
      }
      this.$emit("delete", ...p);
    },
    handleError() {
      this.$message.warning(this.errorList.join("\r\n"));
    },
  },
  computed: {
    BUTTON_WIDTH() {
      return BUTTON_WIDTH;
    },
    BUTTON_HEIGHT() {
      return BUTTON_HEIGHT;
    },

    LIGHT_COLOR() {
      return this.config.lightColor ?? DEFAULT_RECT_BUTTON_BGCOLOR;
    },
  },
};
</script>
