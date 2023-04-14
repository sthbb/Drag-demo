<template>
  <div class="wf-tools">
    <div
      :key="`wf_tools_${category.id}`"
      v-for="category in tools"
      class="wf-tools-category"
    >
      <template
        v-if="
          designertype === category.designertype ||
          category.designertype === 'all'
        "
      >
        <div>{{ category.title }}</div>
        <div>
          <div
            :key="`wf_tools_${category.id}_${tool.id}`"
            v-for="tool in category.children"
            @dragstart="handleDragStart($event, tool)"
          >
            <div><img width="60" height="60" :src="tool.icon" /></div>
            <div>
              <span>{{ tool.title }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { WFTOOLITEM_DATA_KEY } from "@/utils/index";

const customWFSchemaTemplate = {
  stageConfig: {
    width: 1024,
    height: 768,
    zoom: 100,
  },
  wfPath: ["global"],
  wfNodeList: [
    {
      wType: "wf-action-node",
      id: "572a64ebe87c47cda02f92c91cc1e2c0",
      name: "572a64ebe87c47cda02f92c91cc1e2c0",
      title: "condition test",
      caption: "Action",
      label: "S2F37_DisableAllEventReportSync",
      x: 355,
      y: 185,
      imageWidth: 50,
      imageHeight: 50,
      draggable: true,
      _async: false,
      varType: "var",
      isIn: true,
      isOut: false,
      remark: "",
      endpoints: [
        {
          id: "8d194a04028e4a90ab9f3fef85b614d6",
          condition: "a1",
          color: "red",
        },
        {
          id: "0f14b97f77564ad2bed8161d4eba8686",
          condition: "a2",
          color: "green",
        },
        {
          id: "09ff445e4a4347c9a89e4529ea187a4f",
          condition: "a3",
          color: "blue",
        },
      ],
      varName: "result1",
    },
    {
      wType: "wf-action-node",
      id: "b6f46b6337bd41aba1a179764b41031d",
      name: "b6f46b6337bd41aba1a179764b41031d",
      title: "condition test",
      caption: "Action",
      label: "S2F37_DisableAllEventReportSync",
      x: 332,
      y: 397,
      imageWidth: 50,
      imageHeight: 50,
      draggable: true,
      _async: false,
      varType: "var",
      isIn: false,
      isOut: false,
      remark: "",
      endpoints: [
        {
          id: "8d194a04028e4a90ab9f3fef85b614d6",
          condition: "a1",
          color: "red",
        },
        {
          id: "0f14b97f77564ad2bed8161d4eba8686",
          condition: "a2",
          color: "green",
        },
        {
          id: "09ff445e4a4347c9a89e4529ea187a4f",
          condition: "a3",
          color: "blue",
        },
      ],
      varName: "result2",
    },
    {
      wType: "wf-action-node",
      id: "1c39c0327e524a19b94e4f407d5c7a72",
      name: "1c39c0327e524a19b94e4f407d5c7a72",
      title: "condition test",
      caption: "Action",
      label: "S2F37_DisableAllEventReportSync",
      x: 368,
      y: 596,
      imageWidth: 50,
      imageHeight: 50,
      draggable: true,
      _async: false,
      varType: "var",
      isIn: false,
      isOut: false,
      remark: "",
      endpoints: [
        {
          id: "8d194a04028e4a90ab9f3fef85b614d6",
          condition: "a1",
          color: "red",
        },
        {
          id: "0f14b97f77564ad2bed8161d4eba8686",
          condition: "a2",
          color: "green",
        },
        {
          id: "09ff445e4a4347c9a89e4529ea187a4f",
          condition: "a3",
          color: "blue",
        },
      ],
      varName: "result3",
    },
  ],
  wfConnectorList: [
    {
      id: "9e712fbba2984168800561827ad3ec7d",
      name: "9e712fbba2984168800561827ad3ec7d",
      points: [355, 234, 355, 284, 355, 291, 332, 291, 332, 298, 332, 342],
      fromWFNode: {
        x: 355,
        y: 234,
        wfNodeId: "572a64ebe87c47cda02f92c91cc1e2c0",
        wfEndPointId: "0f14b97f77564ad2bed8161d4eba8686",
      },
      toWFNode: {
        x: 332,
        y: 342,
        wfNodeId: "b6f46b6337bd41aba1a179764b41031d",
        wfEndPointId: "TOP_BE_DIRECTED",
      },
      pointerLength: 5,
      pointerWidth: 5,
      fill: "black",
      stroke: "black",
      dashed: false,
      strokeWidth: 3,
    },
    {
      id: "9bce732201c243aca56922715b4e1286",
      name: "9bce732201c243aca56922715b4e1286",
      points: [332, 446, 332, 496, 332, 496.5, 368, 496.5, 368, 497, 368, 541],
      fromWFNode: {
        x: 330,
        y: 448,
        wfNodeId: "b6f46b6337bd41aba1a179764b41031d",
        wfEndPointId: "0f14b97f77564ad2bed8161d4eba8686",
      },
      toWFNode: {
        x: 392,
        y: 601,
        wfNodeId: "1c39c0327e524a19b94e4f407d5c7a72",
        wfEndPointId: "TOP_BE_DIRECTED",
      },
      pointerLength: 5,
      pointerWidth: 5,
      fill: "black",
      stroke: "black",
      dashed: false,
      strokeWidth: 3,
    },
  ],
};

export default {
  name: "WFTools",
  props: {
    designertype: {
      type: String,
      default: () => "entry",
    },
  },
  methods: {
    handleDragStart(evt, wfToolItem) {
      evt.dataTransfer.setData(WFTOOLITEM_DATA_KEY, JSON.stringify(wfToolItem));
      evt.dataTransfer.effectAllowed = "move";
      evt.dataTransfer.dropEffect = "move";
    },
  },
  data() {
    return {
      tools: [
        {
          id: "c_1",
          title: "Action Flow",
          designertype: "all",
          children: [
            {
              id: "t_3",
              title: "condition test",
              caption: "Action",
              label: "S2F37_DisableAllEventReportSync",
              icon: require("@/assets/workflow/action-gray.png"),
              wType: "wf-action-node",
              initialization: {
                paramJsonSchema: {
                  schema: {
                    type: "object",
                    required: [],
                    properties: {
                      object_1662086376579x0: {
                        title: "Object",
                        type: "object",
                        required: [],
                        properties: {
                          string_1662086377547x0: {
                            title: "输入框",
                            type: "string",
                            "ui:options": {
                              placeholder: "请输入",
                            },
                          },
                          string_1662086378998x0: {
                            title: "输入框",
                            type: "string",
                            "ui:options": {
                              placeholder: "请输入",
                            },
                          },
                        },
                        "ui:order": [
                          "string_1662086377547x0",
                          "string_1662086378998x0",
                        ],
                      },
                    },
                    "ui:order": ["object_1662086376579x0"],
                  },
                  uiSchema: {},
                  formFooter: {
                    show: false,
                  },
                  formProps: {
                    layoutColumn: 2,
                    labelWidth: "100px",
                    labelSuffix: "：",
                  },
                },
                funcName: "S2F37_DisableAllEventReportSync",
                _async: false,
                varType: "var",
                isIn: false,
                isOut: false,
                remark: "",
                endpoints: [
                  {
                    id: "8d194a04028e4a90ab9f3fef85b614d6",
                    condition: "a1",
                    color: "#ff0000",
                  },
                  {
                    id: "0f14b97f77564ad2bed8161d4eba8686",
                    condition: "a2",
                    color: "#00ff00",
                  },
                  {
                    id: "09ff445e4a4347c9a89e4529ea187a4f",
                    condition: "a3",
                    color: "#0000ff",
                  },
                ],
              },
            },
          ],
        },

        {
          id: "c_3",
          title: "Special Flow",
          designertype: "entry",
          children: [
            {
              id: "t_1",
              title: "Start",
              caption: "Start",
              label: "Start",
              icon: require("@/assets/workflow/start-gray.png"),
              wType: "wf-start-node",
              initialization: {
                funcName: "Start",
                remark: "",
                endpoints: [
                  {
                    id: "e2b50aabe36b4df287910e64d9740302",
                    condition: "s1",
                    color: "#ff0000",
                  },
                ],
              },
            },
            {
              id: "t_2",
              title: "End",
              caption: "End",
              label: "End",
              icon: require("@/assets/workflow/end-gray.png"),
              wType: "wf-end-node",
              initialization: {
                funcName: "End",
                remark: "",
                endpoints: [],
              },
            },
          ],
        },

        {
          id: "c_5",
          title: "Custom Flow",
          designertype: "entry",
          children: [
            {
              id: "t_1",
              title: "Custom1",
              caption: "Custom1",
              label: "Custom1",
              icon: require("@/assets/workflow/group-gray.png"),
              wType: "wf-custom-node",
              isCustom: true,
              initialization: {
                customWFSchema: { ...customWFSchemaTemplate },
                endpoints: [
                  {
                    id: "0bff88307df84b9c9b07cde2d9f8b3b4",
                    innerNodeId: "b6f46b6337bd41aba1a179764b41031d",
                    condition: "sfx6",
                    color: "red",
                  },
                ],
              },
            },
            {
              id: "t_2",
              title: "Custom2",
              caption: "Custom2",
              label: "Custom2",
              icon: require("@/assets/workflow/group-gray.png"),
              wType: "wf-custom-node",
              isCustom: true,
              initialization: {
                customWFSchema: {},
                endpoints: [],
              },
            },
          ],
        },
      ],
    };
  },
};
</script>
<style scoped>
/* .wf-tools {
  float: left;
  overflow: hidden;
} */
.wf-tools-category {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
