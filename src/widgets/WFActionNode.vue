<template>
  <wf-node
    :imageSrc="require('@/assets/workflow/action-blue.svg')"
    :config="config"
    :isConnecting="isConnecting"
    :isOut="isOut"
    :errorList="errorList"
    @wfnodeclick="handleWFNodeClick"
    @transformend="handleTransformEnd"
    @dragmove="handleDragMove"
    @dragend="handleDragEnd"
    @wfnodemouseup="handleWFNodeMouseUp"
    @endpointdown="handleEndPointMouseDown"
    @wfnodecode="handleWFNodeCode"
    @wfnodesetting="handleWFNodeSetting"
    @wfnodeedit="handleWFNodeEdit"
    @wfnodedelete="handleWFNodeDelete"
  />
</template>
<script>
import { WFWidgetMixin } from "@/mixins";

export default {
  name: "WFActionNode",
  mixins: [WFWidgetMixin],
  props: {
    config: {
      type: Object,
    },
    isConnecting: {
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
};
</script>
