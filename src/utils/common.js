import { v4 as uuid } from "uuid";
import _ from "lodash";

export const newId = () => {
  return uuid().replaceAll("-", "");
};

export const cloneDeep = (obj) => {
  return _.cloneDeep(obj);
};

export const toRadians = (degrees) => {
  const radians = degrees * (Math.PI / 180);
  return radians;
};

export const toDegrees = (radians) => {
  const degrees = radians * (180 / Math.PI);
  return degrees;
};

export const getAroundPosition = (anchor, angle = 0, radius = 50) => {
  const radians = toRadians(angle);
  const toX = anchor.x + radius * Math.cos(radians);
  const toY = anchor.y + radius * Math.sin(radians);
  return {
    x: toX,
    y: toY,
  };
};

export const TOP_BE_DIRECTED = "TOP_BE_DIRECTED";

export const WFTOOLITEM_DATA_KEY = "wfNodeData";

export const downloadJSON = (storageObj) => {
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(storageObj, null, 2));
  const dlAnchorElem = document.createElement("a");
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "workflow.json");
  dlAnchorElem.click();
};

export const upLoadJSON = function (callback) {
  function onChange(event) {
    const reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
  }
  function onReaderLoad(event) {
    const obj = JSON.parse(event.target.result);
    callback(obj);
  }
  const fileUploadElement = document.createElement("input");
  fileUploadElement.setAttribute("type", "file");
  fileUploadElement.setAttribute("accept", "application/json");
  fileUploadElement.addEventListener("change", onChange);
  fileUploadElement.click();
};

export const debounce = (func, wait) => {
  return _.debounce(func, wait, {
    leading: true,
    trailing: true,
  });
};

export const throttle = (func, wait) => {
  return _.throttle(func, wait, {
    leading: true,
    trailing: true,
  });
};

export const isFullScreen = () => {
  return (
    document.fullscreenElement !== null &&
    document.fullscreenElement !== undefined
  );
};

export const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozExitFullScreen) {
    document.mozExitFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
};

export const requestFullscreen = (element) => {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
};

export const toggleFullScreen = (element) => {
  if (isFullScreen()) {
    exitFullscreen();
  } else {
    requestFullscreen(element);
  }
};
