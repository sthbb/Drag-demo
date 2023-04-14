import { cloneDeep } from "@/utils";
/**
 *@class Parser
 @classdesc 将图形描述的图形结构json转换为ast结构
 */
export class Parser {
  _wfSchema = null;
  /**
   *parse graph 2 ast expression tree
   * @param {Object} graph
   * @returns {Object}
   */
  parse(graph) {
    const wfSchema = cloneDeep(graph);
    this._wfSchema = wfSchema;
    let result = [];

    const processConnectors = this.convertwfConnectorList();

    const startList = this.findStartList();

    for (const start of startList) {
      result.push(this.processStart(start));
      const nextList = this.findNext(start);
    }

    return result;
  }

  processStart(drawStart) {}

  findStartList() {
    const { wfNodeList } = this._wfSchema;
    return wfNodeList.filter((n) => n.wType === "wf-start-node");
  }

  findNext(wfNode) {
    const { wfConnectorList } = this._wfSchema;
    const connectors = wfConnectorList.filter(
      (c) => c.fromWFNode.wfNodeId === wfNode.id
    );
    let nextList = [];
    for (let c of connectors) {
      const next = this._wfSchema.wfNodeList.filter(
        (n) => n.id === c.toWFNode.wfNodeId
      );
      nextList.push(next);
    }
    return nextList;
  }
}
