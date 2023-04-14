export const WFWidgetMixin = {
  methods: {
    handleTransformEnd(...p) {
      this.$emit("transformend", ...p);
    },

    handleDragMove(...p) {
      this.$emit("dragmove", ...p);
    },

    handleDragEnd(...p) {
      this.$emit("dragend", ...p);
    },

    handleWFNodeClick(p) {
      const { evt, wfNodeId } = p;
      this.$emit("wfnodeclick", { evt, wfNodeId });
    },

    handleWFNodeMouseUp(p) {
      const { isConnecting } = this;
      if (!isConnecting) return;

      const { evt, wfNodeId, wfEndPointId } = p;
      this.$emit("finish-connect", {
        evt,
        wfNodeId,
        wfEndPointId,
        triggerType: "WFNode",
      });
    },

    handleWFEndPointMouseUp(p) {
      const { isConnecting } = this;
      if (!isConnecting) return;

      const { evt, wfNodeId, wfEndPointId } = p;
      this.$emit("finish-connect", {
        evt,
        wfNodeId,
        wfEndPointId,
        triggerType: "WFEndPoint",
      });
    },

    handleEndPointMouseDown(p) {
      const { evt, wfNodeId, wfEndPointId, _async } = p;

      this.$emit("start-connect", {
        evt,
        wfNodeId,
        wfEndPointId,
        _async,
      });
    },

    handleWFNodeCode(...p) {
      this.$emit("wfnodecode", ...p);
    },

    handleWFNodeSetting(...p) {
      this.$emit("wfnodesetting", ...p);
    },

    handleWFNodeEdit(...p) {
      this.$emit("wfnodeedit", ...p);
    },

    handleWFNodeDelete(p) {
      const { evt, wfNodeId } = p;
      this.$emit("wfnodedelete", { evt, wfNodeId });
    },
  },
};
