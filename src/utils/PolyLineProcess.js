import { EndPointUtil } from "./EndPointUtil";

export class PolyLineProcess {
  constructor(drawer) {
    this._drawer = drawer;
  }

  generateConnectPoints(fromWFNode, toWFNode) {
    const stage = this._drawer.getStage();

    const bottomWFEndPointId = EndPointUtil.getWFEndPointId(
      EndPointUtil.ioType.out,
      fromWFNode.wfNodeId,
      fromWFNode.wfEndPointId
    );

    const topWFEndPointId = EndPointUtil.getWFEndPointId(
      EndPointUtil.ioType.in,
      toWFNode.wfNodeId,
      toWFNode.wfEndPointId
    );

    const fromWFEndPoint = stage.findOne("#" + bottomWFEndPointId);

    const toWFEndPoint = stage.findOne("#" + topWFEndPointId);

    const fromPoint = {
      ...fromWFEndPoint.absolutePosition(),
    };

    const toPoint = {
      ...toWFEndPoint.absolutePosition(),
    };

    const fromYOffset = 50;

    const toYOffset = -50;

    const fromExtendedLinePoint = {
      x: fromPoint.x,
      y: fromPoint.y + fromYOffset,
    };

    const toExtendedLinePoint = {
      x: toPoint.x,
      y: toPoint.y + toYOffset,
    };

    const midwayPoints = this.computeMidwayPoints(
      fromExtendedLinePoint,
      toExtendedLinePoint,
      stage.findOne("#" + fromWFNode.wfNodeId).width(),
      stage.findOne("#" + fromWFNode.wfNodeId).height()
    );

    const fromLineSegment = [
      fromPoint.x,
      fromPoint.y,
      fromExtendedLinePoint.x,
      fromExtendedLinePoint.y,
    ];

    const toLineSegment = [
      toExtendedLinePoint.x,
      toExtendedLinePoint.y,
      toPoint.x,
      toPoint.y - 6,
    ];

    return {
      points: [...fromLineSegment, ...midwayPoints, ...toLineSegment],
    };
  }

  computeMidwayPoints = (f, t, w, h) => {
    console.log(f, "f");
    console.log(t, "t");
    let result = [];
    if (f.y <= t.y) {
      const y1 = (t.y - f.y) / 2 + f.y;
      result.push(f.x, y1, t.x, y1);
    } else {
      const offsetX = 50;
      const offsetY = 30;
      console.log(offsetY, h);

      if (t.x >= f.x) {
        const x1 = t.x + w / 2 + offsetX;
        const y1 = Math.max(f.y, t.y + h + 30 + offsetY);
        result.push(f.x, y1);
        result.push(x1, y1);
        result.push(x1, t.y);
      } else {
        const x1 = t.x - w / 2 - offsetX;
        const y1 = Math.max(f.y, t.y + h + 30 + offsetY);
        result.push(f.x, y1);
        result.push(x1, y1);
        result.push(x1, t.y);
      }
    }
    return result;
  };
}
