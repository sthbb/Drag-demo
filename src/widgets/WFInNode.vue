<template>
  <wf-node
    :imageSrc="require('@/assets/workflow/in-gray.png')"
    :config="config"
    :isConnecting="isConnecting"
    :allowBeDirected="false"
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
  name: "WFInNode",
  mixins: [WFWidgetMixin],
  props: {
    config: {
      type: Object,
    },
    isConnecting: {
      type: Boolean,
    },
  },
};
</script>
