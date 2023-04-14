/**
 * 节点的工具类
 */
export class NodeUtil {
  static VERTICAL_PADDING = 7;

  static getNodeHeight(h) {
    let result = 0;
    for (let _h of h) {
      result += _h;
    }
    return result;
  }

  static getNodeWidth(w) {
    return Math.max(...w);
  }
}
