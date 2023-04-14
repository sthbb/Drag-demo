<template>
  <wf-node
    :imageSrc="require('@/assets/workflow/start-blue.svg')"
    :config="config"
    :isConnecting="isConnecting"
    :allowBeDirected="false"
    :errorList="errorList"
    @wfnodeclick="handleWFNodeClick"
    @transformend="handleTransformEnd"
    @dragmove="handleDragMove"
    @dragend="handleDragEnd"
    @wfnodemouseup="handleWFNodeMouseUp"
    @endpointdown="handleEndPointMouseDown"
    @wfnodesetting="handleWFNodeSetting"
    @wfnodeedit="handleWFNodeEdit"
    @wfnodedelete="handleWFNodeDelete"
  />
</template>
<script>
import { WFWidgetMixin } from "@/mixins";

export default {
  name: "WFStartNode",
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
