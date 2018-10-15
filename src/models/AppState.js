import { observable, action } from "mobx";

const paramsets = [
  "Sierpinski Gasket",
  "Sierpinski Carpet",
  "Koch Curve",
  "Queen Anne's Lace",
  "Barnsley's Fern", 
  "Tree", 
  "Showflake",
  "One Arm Spiral",
  "Two Arm Spiral",
  "Four Arm Spiral 1",
  "Four Arm Spiral 2"  
];

const params = {
  "Sierpinski Gasket": {
    left: { xmin: 0, xmax: 1.0, ymin: 0, ymax: 1.0 },
    right: { xmin: 0, xmax: 1.0, ymin: 0, ymax: 1.0 },
    params: [
      { r: 0.5, s:0.5, th:0, e:0, f:0},
      { r: 0.5, s:0.5, th:0, e:0.5, f:0},
      { r: 0.5, s:0.5, th:0, e:0, f:0.5}
    ]
  },
  "Sierpinski Carpet": {
    left: { xmin: 0, xmax: 1.0, ymin: 0, ymax: 1.0 },
    right: { xmin: 0, xmax: 1.0, ymin: 0, ymax: 1.0 },
    params: [
      { r: 0.3333, s:0.3333, th:0, e:0, f:0},
      { r: 0.3333, s:0.3333, th:0, e:0.333, f:0},
      { r: 0.3333, s:0.3333, th:0, e:0.667, f:0},
      { r: 0.3333, s:0.3333, th:0, e:0, f:0.333},
      { r: 0.3333, s:0.3333, th:0, e:0.667, f:0.333},
      { r: 0.3333, s:0.3333, th:0, e:0, f:0.667},
      { r: 0.3333, s:0.3333, th:0, e:0.333, f:0.667},
      { r: 0.3333, s:0.3333, th:0, e:0.667, f:0.667}
    ]
  },
  "Koch Curve": {
    left: { xmin: 0, xmax: 1.0, ymin: 0, ymax: 1.0 },
    right: { xmin: 0, xmax: 1.0, ymin: 0, ymax: 1.0 },
    params: [
      { r: 0.3333, s:0.3333, th:0, e:0, f:0},
      { r: 0.3333, s:0.3333, th:60, e:0.333, f:0},
      { r: 0.3333, s:0.3333, th:-60, e:0.5, f:0.289},
      { r: 0.3333, s:0.3333, th:0, e:0.667, f:0}
    ]
  },
  "Queen Anne's Lace": {
    left: { xmin: 0, xmax: 1.0, ymin: 0, ymax: 1.0 },
    right: { xmin: -2.0, xmax: 2.0, ymin: -2.0, ymax: 2.0 },
    params: [
      { r: 0.27, s:0.27, th:0, e:1, f:0},
      { r: 0.27, s:0.27, th:0, e:0.707, f:0.707},
      { r: 0.27, s:0.27, th:0, e:0, f:1},
      { r: 0.27, s:0.27, th:0, e:-0.707, f:0.707},
      { r: 0.27, s:0.27, th:0, e:-1, f:0},
      { r: 0.27, s:0.27, th:0, e:-0.707, f:-0.707},
      { r: 0.27, s:0.27, th:0, e:0, f:-1},
      { r: 0.27, s:0.27, th:0, e:0.707, f:-0.707},
      { r: 0.5, s:0.5, th:22.5, e:0, f:0}
    ]
  },
  "Barnsley's Fern": { 
    left: { xmin: 0, xmax: 1.0, ymin: 0, ymax: 1.0 },
    right: { xmin: -5, xmax: 5, ymin: 0, ymax: 10 },
    params: [
      { r: 0.0, s:0.16, th:0, e:0, f:0},
      { r: 0.85, s:0.85, th:-2.5, e:0, f:1.6},
      { r: 0.3, s:0.34, th:49, e:0, f:1.6},
      { r: 0.3, s:0.37, th:-50, e:0, f:0.44}
    ]
  },
  "Tree": { 
    left: { xmin: 0, xmax: 1.0, ymin: 0, ymax: 1.0 },
    right: { xmin: -1.25, xmax: 1.25, ymin: -0.25, ymax: 2.25 },
    params: [
      { r: 0.05, s:0.6, th:0, e:0, f:0},
      { r: 0.05, s:-0.5, th:0, e:0, f:1},
      { r: 0.6, s:0.5, th:40, e:0, f:0.6},
      { r: 0.5, s:0.45, th:20, e:0, f:1.1},
      { r: 0.5, s:0.55, th:-30, e:0, f:1},
      { r: 0.55, s:0.4, th:-40, e:0, f:0.7}
    ]
  },
  "Showflake": {
    left: { xmin: 0, xmax: 1.0, ymin: 0, ymax: 1.0 },
    right: { xmin: -1, xmax: 1.0, ymin:-1, ymax: 1.0 },
    params: [
      { r: 0.6, s:0.6, th:0, e:0, f:0},
      { r: 0.4, s:0.2, th:0, e:0.6, f:0},
      { r: 1, s:1, th:60, e:0, f:0}
    ]
  },
  "One Arm Spiral": {
    left: { xmin: 0, xmax: 1.0, ymin: 0, ymax: 1.0 },
    right: { xmin: -1, xmax: 1.0, ymin: -1, ymax: 1.0 },
    params: [
      { r: 0.29, s:0.29, th:0, e:0.71, f:0.41},
      { r: 0.84, s:0.84, th:20, e:0, f:0}
    ]
  },
  "Two Arm Spiral": {
    left: { xmin: 0, xmax: 1.0, ymin: 0, ymax: 1.0 },
    right: { xmin: -1, xmax: 1.0, ymin: -1, ymax: 1.0 },
    params: [
      { r: 0.2, s:0.2, th:0, e:0.7, f:0},
      { r: 0.2, s:0.2, th:0, e:-0.7, f:0},
      { r: 0.85, s:0.85, th:20, e:0, f:0}
    ]
  },
  "Four Arm Spiral 1": {
    left: { xmin: 0, xmax: 1.0, ymin: 0, ymax: 1.0 },
    right: { xmin: -1, xmax: 1.0, ymin: -1, ymax: 1.0 },
    params: [
      { r: 0.2, s:0.2, th:0, e:0.7, f:0},
      { r: 0.2, s:0.2, th:0, e:-0.7, f:0},
      { r: 0.2, s:0.2, th:0, e:0, f:0.7},
      { r: 0.2, s:0.2, th:0, e:0, f:-0.7},
      { r: 0.85, s:0.85, th:20, e:0, f:0}
    ]
  },
  "Four Arm Spiral 2": {
    left: { xmin: 0, xmax: 1.0, ymin: 0, ymax: 1.0 },
    right: { xmin: -1, xmax: 1.0, ymin: -1, ymax: 1.0 },
    params: [
      { r: 0.1, s:0.1, th:0, e:0.75, f:0.75},
      { r: 0.1, s:0.1, th:0, e:-0.75, f:0.75},
      { r: 0.1, s:0.1, th:0, e:-0.75, f:-0.75},
      { r: 0.1, s:0.1, th:0, e:0.75, f:-0.75},
      { r: 0.95, s:0.96, th:10, e:0, f:0}
    ]
  }
};

export default class AppState {
  @observable paramsets = paramsets;
  @observable left;   // coordinates on left
  @observable right;  // coordinates on right
  @observable params; // current parameters
  @observable name;   // name of parameter set
  @observable step;   // iteration step
  constructor() {
    let defaultset = params[paramsets[0]];
    this.left = defaultset.left;
    this.right = defaultset.right;
    this.params = defaultset.params;
    this.name = paramsets[0];
    this.step = 0;
  }
  @action setParams(key) {
    this.name = key;
    this.left = params[key].left;
    this.right = params[key].right;
    this.params = params[key].params;
    //this.step = 0;
  }
  @action forward() {
    this.step = this.step + 1;
  }
  @action back() {
    if (this.step > 0) {
      this.step = this.step - 1;
    }
  }
  @action clear() {
    this.step = 0;
  }
  @action set(p) {
    this.params = p;
  }
  @action zoomInLeft() {
    this.left.xmin += 0.25;
    this.left.xmax -= 0.25;
    this.left.ymin += 0.25;
    this.left.ymax -= 0.25;
  }
  @action zoomOutLeft() {
    this.left.xmin -= 0.25;
    this.left.xmax += 0.25;
    this.left.ymin -= 0.25;
    this.left.ymax += 0.25;
  }
  @action zoomInRight() {
    this.right.xmin += 0.25;
    this.right.xmax -= 0.25;
    this.right.ymin += 0.25;
    this.right.ymax -= 0.25;
  }
  @action zoomOutRight() {
    this.right.xmin -= 0.25;
    this.right.xmax += 0.25;
    this.right.ymin -= 0.25;
    this.right.ymax += 0.25;
  }
}
