import Vue from "vue";
import WFGrid from "./WFGrid";
import WFArrow from "./WFArrow";
import WFImage from "./WFImage";
import WFNode from "./WFNode";

import WFImageButton from "./WFImageButton";
import WFGroupNode from "./WFGroupNode";
import WFCustomNode from "./WFCustomNode";

import WFInNode from "./WFInNode";
import WFOutNode from "./WFOutNode";

import WFStartNode from "./WFStartNode";
import WFEndNode from "./WFEndNode";
import WFIfNode from "./WFIfNode";
import WFSwitchNode from "./WFSwitchNode";

import WFCodeNode from "./WFCodeNode";
import WFActionNode from "./WFActionNode";

import WFCloseButton from "./WFCloseButton";

Vue.component("wf-grid", WFGrid);
Vue.component("wf-arrow", WFArrow);
Vue.component("wf-image", WFImage);
Vue.component("wf-node", WFNode);

Vue.component("wf-image-button", WFImageButton);
Vue.component("wf-group-node", WFGroupNode);
Vue.component("wf-custom-node", WFCustomNode);

Vue.component("wf-in-node", WFInNode);
Vue.component("wf-out-node", WFOutNode);

Vue.component("wf-start-node", WFStartNode);
Vue.component("wf-end-node", WFEndNode);
Vue.component("wf-if-node", WFIfNode);
Vue.component("wf-switch-node", WFSwitchNode);
Vue.component("wf-event-switch-node", WFSwitchNode);

Vue.component("wf-code-node", WFCodeNode);
Vue.component("wf-action-node", WFActionNode);

Vue.component("wf-close-button", WFCloseButton);
