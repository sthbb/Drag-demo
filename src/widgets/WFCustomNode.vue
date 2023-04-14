<template>
  <wf-group-node
    :imageSrc="require('@/assets/workflow/group-gray.png')"
    :config="config"
    :isConnecting="isConnecting"
    :isDesigning="isDesigning"
    :isOut="isOut"
    :errorList="errorList"
    @wfnodeclick="handleWFNodeClick"
    @transformend="handleTransformEnd"
    @dragmove="handleDragMove"
    @dragend="handleDragEnd"
    @wfnodemouseup="handleWFNodeMouseUp"
    @endpointdown="handleEndPointMouseDown"
    @customwfschemadrill="handleCustomWFSchemaDrill"
    @wfnodesetting="handleWFNodeSetting"
    @wfnodeedit="handleWFNodeEdit"
    @wfnodedelete="handleWFNodeDelete"
  />
  <!-- @wfendpointmouseup="handleWFEndPointMouseUp" -->
</template>
<script>
import { WFWidgetMixin } from "@/mixins";

export default {
  name: "WFCustomNode",
  mixins: [WFWidgetMixin],
  props: {
    config: {
      type: Object,
    },
    isConnecting: {
      type: Boolean,
    },
    isDesigning: {
      type: Boolean,
    },
    isOut: {
      type: Boolean,
    },
    errorList: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handleCustomWFSchemaDrill(...p) {
      this.$emit("customwfschemadrill", ...p);
    },
  },
};
</script>
