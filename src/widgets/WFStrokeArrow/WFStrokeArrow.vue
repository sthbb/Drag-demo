<template>
  <!--加粗的箭头线-->
  <v-group>
    <!-- <v-arrow
      :config="{
        ...config,
        id: 'arrow_' + config.id,
      }"
      v-bind="$attrs"
      v-on="$listeners"
    /> -->
    <!-- <v-arrow
      :config="{
        ...config,
        id: config.id,
        strokeWidth: 10,
        opacity: 0,
      }"
      v-bind="$attrs"
      v-on="$listeners"
    /> -->

    <v-arrow
      :config="{
        ...config,
        id: 'arrow_' + config.id,
        points: arrowPoints,
      }"
      v-bind="$attrs"
      v-on="$listeners"
    />

    <v-path
      :config="{
        ...config,
        id: 'path_' + config.id,
        fill: null,
        data: cornerPath,
      }"
      v-bind="$attrs"
      v-on="$listeners"
    />

    <v-path
      :config="{
        ...config,
        id: config.id,
        fill: null,
        strokeWidth: 10,
        opacity: 0,
        data: cornerPath,
      }"
      v-bind="$attrs"
      v-on="$listeners"
    />

    <!-- <v-circle
      :key="p.id"
      v-for="p in svgPathPoints"
      :config="{
        x: p.x,
        y: p.y,
        radius: 3,
        
        stroke: 'black',
      }"
    >
    </v-circle> -->
  </v-group>
</template>
<script>
import { newId } from "@/utils";
import { roundPathCorners } from "./corner/crounding";

const CORNER_RADIUS = 16;

export default {
  name: "WFStrokeArrow",
  props: {
    config: {
      type: Object,
    },
  },
  methods: {
    isCorner(pre, current, next) {
      if (pre.x === current.x && current.x === next.x) {
        return false;
      }
      if (pre.y === current.y && current.y === next.y) {
        return false;
      }
      return true;
    },
  },
  computed: {
    cornerPath() {
      const points = this.svgPathPoints;

      let originPath = "";
      for (let index = 0; index < points.length; index++) {
        const element = points[index];
        if (index === 0) {
          originPath += `M ${element.x} ${element.y}`;
        } else {
          originPath += ` L ${element.x} ${element.y}`;
        }
      }

      const cornerPath = roundPathCorners(originPath, this.CornerRadius, false);

      return cornerPath;
    },

    arrowPoints() {
      const last = this.distinctPoints[this.distinctPoints.length - 1];
      return [last.x, last.y - 1, last.x, last.y];
    },

    svgPathPoints() {
      const first = this.distinctPoints[0];
      const last = this.distinctPoints[this.distinctPoints.length - 1];
      return [first, ...this.cornerPoints, last];
    },

    cornerPoints() {
      const arr = [];
      const points = this.distinctPoints;
      for (let index = 1; index < points.length - 1; index++) {
        const pre = points[index - 1];
        const current = points[index];
        const next = points[index + 1];
        if (this.isCorner(pre, current, next)) {
          arr.push(current);
        }
      }
      return arr;
    },

    distinctPoints() {
      const arr = [];
      const points = this.linePoints;
      for (let index = 0; index < points.length; index++) {
        const element = points[index];
        if (
          arr.findIndex((e) => e.x === element.x && e.y === element.y) === -1
        ) {
          arr.push(element);
        }
      }
      return arr;
    },

    linePoints() {
      const arr = [];
      const points = this.config.points;
      let currentPoint = {
        id: newId(),
      };
      for (let index = 0; index < points.length; index++) {
        const element = points[index];
        if (index % 2 === 0) {
          currentPoint.x = element;
        } else {
          currentPoint.y = element;
          arr.push(currentPoint);
          currentPoint = {
            id: newId(),
          };
        }
      }
      return arr;
    },

    CornerRadius() {
      const points = this.svgPathPoints;

      if (points.length === 4) {
        const p1 = points[1];

        const p2 = points[2];

        const distance = Math.abs(p2.x - p1.x);

        if (CORNER_RADIUS > distance / 2) {
          return distance / 2;
        }
      }
      return CORNER_RADIUS;
    },
  },
};
</script>
