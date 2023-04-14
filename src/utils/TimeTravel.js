import { cloneDeep } from "./common";

export class TimeTravel {
  _recordHistory = {
    operateStack: [],
    currentOperateCursor: -1,
  };
  constructor(designer, travelMaxStep) {
    this._travelMaxStep = travelMaxStep;
    this._designer = designer;
  }

  setTravelMaxStep(travelMaxStep) {
    this._travelMaxStep = travelMaxStep;
    this.limitMaxStep();
  }

  resetTimeTravelStack() {
    this._recordHistory.currentOperateCursor = -1;
    this._recordHistory.operateStack = [];
  }

  resetTimeTravel() {
    this.resetTimeTravelStack();

    this.recordCurrentStateSnapshot();
  }

  recordCurrentStateSnapshot() {
    this._recordHistory.operateStack.splice(
      this._recordHistory.currentOperateCursor + 1
    );
    this._recordHistory.operateStack.push(cloneDeep(this._designer.wfSchema));
    this._recordHistory.currentOperateCursor++;

    this.limitMaxStep();
  }

  limitMaxStep() {
    const maxStep = this._travelMaxStep;
    if (this._recordHistory.operateStack.length > maxStep) {
      this._recordHistory.operateStack.splice(
        0,
        this._recordHistory.operateStack.length - maxStep
      );

      this._recordHistory.currentOperateCursor = maxStep - 1;
    }
  }

  undoRecord() {
    this._recordHistory.currentOperateCursor--;
    if (this._recordHistory.currentOperateCursor <= -1) {
      this._recordHistory.currentOperateCursor++;

      this._designer.$message({
        message: "已撤销到最后一步",
        type: "warning",
      });
    } else {
      this._designer.wfSchema = cloneDeep(
        this._recordHistory.operateStack[
          this._recordHistory.currentOperateCursor
        ]
      );
    }
  }

  redoRecord() {
    this._recordHistory.currentOperateCursor++;
    if (
      this._recordHistory.currentOperateCursor >
      this._recordHistory.operateStack.length - 1
    ) {
      this._recordHistory.currentOperateCursor--;

      this._designer.$message({
        message: "已后重做到最后一步",
        type: "warning",
      });
    } else {
      this._designer.wfSchema = cloneDeep(
        this._recordHistory.operateStack[
          this._recordHistory.currentOperateCursor
        ]
      );
    }
  }
}
