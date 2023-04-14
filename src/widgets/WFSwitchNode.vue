<template>
  <wf-node
    :imageSrc="require('@/assets/workflow/switch-blue.svg')"
    :config="config"
    :isConnecting="isConnecting"
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
  name: "WFSwitchNode",
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
