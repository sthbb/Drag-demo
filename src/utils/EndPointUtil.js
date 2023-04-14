/**
 *EndPointUtil
 */
export class EndPointUtil {
  static ioType = {
    in: "in",
    out: "out",
  };

  static ENDPOINT_DISTANCE = 100;

  static ENDPOINT_RADIUS = 5;

  static ENDPOINT_DIAMETER = EndPointUtil.ENDPOINT_RADIUS * 2;

  static TOP_BE_DIRECTED = "TOP_BE_DIRECTED";

  static getWidth(p) {
    let count = null;
    if (Array.isArray(p)) {
      count = p?.length ?? 0;
    } else {
      count = p;
    }

    if (count === 0) {
      return 0;
    }

    return (
      EndPointUtil.ENDPOINT_DIAMETER +
      EndPointUtil.ENDPOINT_DISTANCE * (count - 1)
    );
  }

  static getDiameter() {
    return EndPointUtil.ENDPOINT_DIAMETER;
  }

  static getHeight() {
    return EndPointUtil.ENDPOINT_DIAMETER;
  }

  static getEndPointX(index) {
    return (
      EndPointUtil.ENDPOINT_DISTANCE * index + EndPointUtil.ENDPOINT_RADIUS
    );
  }

  static getEndPointY() {
    return EndPointUtil.ENDPOINT_RADIUS;
  }

  static getRadius() {
    return EndPointUtil.ENDPOINT_RADIUS;
  }

  static getWFEndPointId = (ioType, wfNodeId, wfEndPointId) => {
    return `ed_${ioType}_${wfNodeId}_${wfEndPointId}`;
  };
}
