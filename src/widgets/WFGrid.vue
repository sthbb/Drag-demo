<template>
  <v-layer ref="grid-layer" :config="{ visible: true }">
    <v-line
      :key="`l_h_${index}`"
      v-for="(line, index) in grid.horizontalLines"
      :config="line"
    >
    </v-line>
    <v-line
      :key="`l_v_${index}`"
      v-for="(line, index) in grid.verticalLines"
      :config="line"
    >
    </v-line>

    <v-line
      :key="`r_h_${index}`"
      v-for="(rule, index) in grid.horizontalRule"
      :config="rule"
    >
    </v-line>
    <v-line
      :key="`r_v_${index}`"
      v-for="(rule, index) in grid.verticalRule"
      :config="rule"
    >
    </v-line>
  </v-layer>
</template>
<script>
const LINE_COLOR = "#DCDFE6";
const LINE_WIDTH = 1;

export const horizontalLines = () => {
  let arr = [];
  const step = 20;
  const maxLength = 5000;
  const lineCount = 500;

  for (let i = 0; i < lineCount; i++) {
    arr.push({
      points: [0, step * i, maxLength, step * i],
      stroke: LINE_COLOR,
      strokeWidth: LINE_WIDTH,
    });
  }
  return arr;
};

export const verticalLines = () => {
  let arr = [];
  const step = 20;
  const maxLength = 5000;
  const lineCount = 500;

  for (let i = 0; i < lineCount; i++) {
    arr.push({
      points: [step * i, 0, step * i, maxLength],
      stroke: LINE_COLOR,
      strokeWidth: LINE_WIDTH,
    });
  }
  return arr;
};

const RULE_COLOR = "#888888";
const RULE_WIDTH = 1;

export const horizontalRule = () => {
  let arr = [];
  const step = 20;

  const minLength = 5;
  const maxLength = 10;

  const lineCount = 500;

  for (let i = 0; i < lineCount; i++) {
    arr.push({
      points: [0, step * i, i % 5 == 0 ? maxLength : minLength, step * i],
      stroke: RULE_COLOR,
      strokeWidth: RULE_WIDTH,
    });
  }
  return arr;
};

export const verticalRule = () => {
  let arr = [];
  const step = 20;

  const minLength = 5;
  const maxLength = 10;

  const lineCount = 500;

  for (let i = 0; i < lineCount; i++) {
    arr.push({
      points: [step * i, 0, step * i, i % 5 == 0 ? maxLength : minLength],
      stroke: RULE_COLOR,
      strokeWidth: RULE_WIDTH,
    });
  }
  return arr;
};

export default {
  name: "WFGrid",
  mounted() {
    console.log("wfgrid");
  },
  data() {
    return {
      grid: {
        horizontalLines: horizontalLines(),
        verticalLines: verticalLines(),
        horizontalRule: horizontalRule(),
        verticalRule: verticalRule(),
      },
    };
  },
};
</script>
