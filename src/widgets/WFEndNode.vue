<template>
  <wf-node
    :imageSrc="require('@/assets/workflow/end-blue.svg')"
    :config="config"
    :isConnecting="isConnecting"
    :errorList="errorList"
    @wfnodeclick="handleWFNodeClick"
    @wfnodedelete="handleWFNodeDelete"
    @transformend="handleTransformEnd"
    @dragmove="handleDragMove"
    @dragend="handleDragEnd"
    @wfnodemouseup="handleWFNodeMouseUp"
    @endpointdown="handleEndPointMouseDown"
  />
</template>
<script>
import { WFWidgetMixin } from "@/mixins";

export default {
  name: "WFEndNode",
  mixins: [WFWidgetMixin],
  props: {
    config: {
      type: Object,
    },
    isConnecting: {
      type: Boolean,
    },
    errorList: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
