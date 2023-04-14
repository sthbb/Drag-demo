function getPosition(start, end, angle) {
  var x1 = start.left;
  var y1 = start.top;
  var x2 = end.left;
  var y2 = end.top;
  var PI = Math.PI;

  var xAngle = Math.atan2(y2 - y1, x2 - x1);

  xAngle = (360 * xAngle) / (2 * PI);

  var L = Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1));

  var L2 = L / 2 / Math.cos((angle * 2 * PI) / 360);

  var val1 = {};

  var val2 = {};
  val1["left"] =
    x1 + Math.round(L2 * Math.cos(((xAngle + angle) * 2 * PI) / 360));
  val1["top"] =
    y1 + Math.round(L2 * Math.sin(((xAngle + angle) * 2 * PI) / 360));
  val2["left"] =
    x1 + Math.round(L2 * Math.cos(((xAngle - angle) * 2 * PI) / 360));
  val2["top"] =
    y1 + Math.round(L2 * Math.sin(((xAngle - angle) * 2 * PI) / 360));

  return [val1, val2];
}
