const H_PADDING = 80;
const H_SPAN = 50;
const V_PADDING = 80;
const V_SPAN = 90;

export class AutoLayoutUtil {
  grid = { rows: 0, columns: 0, width: 0, height: 0 };

  list = [];

  connectors = [];

  root = null;

  _drawer = null;

  constructor(list, connectors, drawer) {
    this.list = list;
    this.connectors = connectors;
    this._drawer = drawer;
  }

  findStart() {
    const startNode = this.list.find(
      (n) => n.wType === "wf-start-node" || (n?.isIn ?? false)
    );
    if (!startNode) {
      throw new Error("必须存在一个开始节点");
    }
    return startNode;
  }

  findNext(parentId, level, processedNodes = []) {
    const connectorList = this.connectors.filter(
      (c) => c.fromWFNode.wfNodeId === parentId
    );

    const childrenNodes = this.list.filter((n) =>
      connectorList.some((c) => c.toWFNode.wfNodeId === n.id)
    );

    for (const childNode of childrenNodes) {
      if (!processedNodes.includes(childNode)) {
        processedNodes.push(childNode);
        childNode.level = level;
        childNode.children = this.findNext(
          childNode.id,
          level + 1,
          processedNodes
        );
      }
    }

    return childrenNodes;
  }

  getNoLinedNodes() {
    return this.list.filter((n) => n.level === null || n.level === undefined);
  }

  getLinedNodes() {
    return this.list.filter((n) => n.level !== null && n.level !== undefined);
  }

  convert2LayoutTree() {
    const root = this.findStart();
    root.level = 0;

    root.children = this.findNext(root.id, 1, [root]);

    this.root = root;
  }

  syncWFNodeListAndWFConnectorList() {
    this._drawer.$nextTick(() => {
      this._drawer.syncWFNodeListAndWFConnectorList();
    });
  }

  visit(node, cb, processed = []) {
    if (processed.includes(node)) {
      return;
    }
    cb(node);
    processed.push(node);
    for (const child of node.children) {
      this.visit(child, cb, processed);
    }
  }

  markLIndex() {
    const levelMap = new Map();
    for (let index = 0; index < this.grid.rows; index++) {
      levelMap.set(index, 0);
    }
    this.visit(this.root, (node) => {
      let levelIndex = levelMap.get(node.level);
      node.lindex = levelIndex;
      levelIndex++;
      levelMap.set(node.level, levelIndex);
    });
  }

  markGridRowAndColumn() {
    this.grid.rows = Math.max(...this.getLinedNodes().map((n) => n.level)) + 1;

    for (let level = 0; level < this.grid.rows; level++) {
      const currentLevelCount = this.list.filter(
        (n) => n.level === level
      ).length;

      if (currentLevelCount > this.grid.columns) {
        this.grid.columns = currentLevelCount;
      }
    }
  }

  markGridSize() {
    const levelWidthMap = new Map();
    for (let index = 0; index < this.grid.rows; index++) {
      levelWidthMap.set(index, H_PADDING);
    }
    this.visit(this.root, (node) => {
      let levelWidth = levelWidthMap.get(node.level);
      levelWidth += node.rwidth + H_SPAN;
      levelWidthMap.set(node.level, levelWidth);
    });

    this.grid.width = Math.max(...levelWidthMap.values()) - H_SPAN + H_PADDING;
    this.grid.height =
      V_PADDING +
      this.root.rheight * this.grid.rows +
      V_SPAN * (this.grid.rows - 1) +
      V_PADDING;
  }

  markRSize() {
    const stage = this._drawer.getStage();
    for (const node of this.list) {
      const rnode = stage.findOne("#" + node.id);
      node.rwidth = rnode.width();
      node.rheight = rnode.height();
    }
  }

  doLayout() {
    const offsetHMap = new Map();
    for (let level = 0; level < this.grid.rows; level++) {
      offsetHMap.set(level, H_PADDING);
    }

    const linedNodes = this.getLinedNodes().sort(
      (n1, n2) => n1.lindex - n2.lindex
    );
    for (const lnode of linedNodes) {
      const hposition = offsetHMap.get(lnode.level);
      lnode.x = hposition + lnode.rwidth / 2;
      offsetHMap.set(lnode.level, hposition + lnode.rwidth + H_SPAN);

      lnode.y =
        V_PADDING + lnode.level * (V_SPAN + lnode.rheight) + lnode.rheight / 2;
    }
  }

  fitStageSize() {
    if (this._drawer.wfSchema.stageConfig.width < this.grid.width) {
      this._drawer.$emit("update:width", this.grid.width);
    }
    if (this._drawer.wfSchema.stageConfig.height < this.grid.height) {
      this._drawer.$emit("update:height", this.grid.height);
    }
  }

  layout() {
    this.convert2LayoutTree();

    this.markGridRowAndColumn();

    this.markRSize();

    this.markLIndex();

    this.markGridSize();

    this.doLayout();

    this.fitStageSize();

    this.syncWFNodeListAndWFConnectorList();

    this.clearAttach();
  }

  clearAttach() {
    for (const node of this.list) {
      delete node.level;
      delete node.lindex;
      delete node.rwidth;
      delete node.rheight;
      delete node.children;
    }
  }
}
