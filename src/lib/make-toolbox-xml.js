import {
  ScratchBlocks,
  blockSeparator,
  categorySeparator,
  motionTheme,
  sensingTheme,
  operatorsTheme,
} from '@blockcode/blocks';

// 加载自定义/修改的积木块
import '../blocks/motion';
import '../blocks/sensing';

// 运动类需要展示的积木
const motion = () => `
  <category name="%{BKY_CATEGORY_MOTION}" id="motion" ${motionTheme}>
    <block type="motion_attack">
      <value name="DIRECTION">
        <shadow type="math_angle">
          <field name="NUM">90</field>
        </shadow>
      </value>
      <value name="DISTANCE">
        <shadow type="math_number">
          <field name="NUM">200</field>
        </shadow>
      </value>
    </block>
    <block type="motion_move">
      <value name="DIRECTION">
        <shadow type="math_angle">
          <field name="NUM">90</field>
        </shadow>
      </value>
      <value name="SPEED">
        <shadow type="math_number">
          <field name="NUM">100</field>
        </shadow>
      </value>
    </block>
    ${blockSeparator}
    <block type="motion_turnright">
      <value name="DEGREES">
        <shadow type="math_number">
          <field name="NUM">15</field>
        </shadow>
      </value>
    </block>
    <block type="motion_turnleft">
      <value name="DEGREES">
        <shadow type="math_number">
          <field name="NUM">15</field>
        </shadow>
      </value>
    </block>
    <block type="motion_pointindirection">
      <value name="DIRECTION">
        <shadow type="math_angle">
          <field name="NUM">90</field>
        </shadow>
      </value>
    </block>
    ${blockSeparator}
    <block type="motion_setspeed">
      <value name="SPEED">
        <shadow type="math_number">
          <field name="NUM">50</field>
        </shadow>
      </value>
    </block>
    <block type="motion_stop"/>
    ${blockSeparator}
    <block type="motion_speed"/>
    <block type="motion_xposition"/>
    <block type="motion_yposition"/>
    <block type="motion_direction"/>
    ${categorySeparator}
  </category>
`;

// 侦测类需要展示的积木
const sensing = () => `
  <category name="%{BKY_CATEGORY_SENSING}" id="sensing" ${sensingTheme}>
    <block type="sensing_scandistance">
      <value name="DIRECTION">
        <shadow type="math_angle">
          <field name="NUM">90</field>
        </shadow>
      </value>
    </block>
    <block type="sensing_scan">
      <value name="DIRECTION">
        <shadow type="math_angle">
          <field name="NUM">90</field>
        </shadow>
      </value>
    </block>
    ${blockSeparator}
    <block type="sensing_scanwidth">
      <value name="WIDTH">
        <shadow type="math_number">
          <field name="NUM">5</field>
        </shadow>
      </value>
    </block>
    ${blockSeparator}
    <block type="sensing_health"/>
    ${blockSeparator}
    <block id="timer" type="sensing_timer"/>
    <block type="sensing_resettimer"/>
    ${categorySeparator}
  </category>
`;

// 运算类需要展示的积木
const operators = () => `
  <category name="%{BKY_CATEGORY_OPERATORS}" id="operators" ${operatorsTheme}>
    <block type="operator_add">
      <value name="NUM1">
        <shadow type="math_number">
          <field name="NUM"/>
        </shadow>
      </value>
      <value name="NUM2">
        <shadow type="math_number">
          <field name="NUM"/>
        </shadow>
      </value>
    </block>
    <block type="operator_subtract">
      <value name="NUM1">
        <shadow type="math_number">
          <field name="NUM"/>
        </shadow>
      </value>
      <value name="NUM2">
        <shadow type="math_number">
          <field name="NUM"/>
        </shadow>
      </value>
    </block>
    <block type="operator_multiply">
      <value name="NUM1">
        <shadow type="math_number">
          <field name="NUM"/>
        </shadow>
      </value>
      <value name="NUM2">
        <shadow type="math_number">
          <field name="NUM"/>
        </shadow>
      </value>
    </block>
    <block type="operator_divide">
      <value name="NUM1">
        <shadow type="math_number">
          <field name="NUM"/>
        </shadow>
      </value>
      <value name="NUM2">
        <shadow type="math_number">
          <field name="NUM"/>
        </shadow>
      </value>
    </block>
    ${blockSeparator}
    <block type="operator_random">
      <value name="FROM">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
      <value name="TO">
        <shadow type="math_number">
          <field name="NUM">10</field>
        </shadow>
      </value>
    </block>
    ${blockSeparator}
    <block type="operator_gt">
      <value name="OPERAND1">
        <shadow type="text">
          <field name="TEXT"/>
        </shadow>
      </value>
      <value name="OPERAND2">
        <shadow type="text">
          <field name="TEXT">50</field>
        </shadow>
      </value>
    </block>
    <block type="operator_lt">
      <value name="OPERAND1">
        <shadow type="text">
          <field name="TEXT"/>
        </shadow>
      </value>
      <value name="OPERAND2">
        <shadow type="text">
          <field name="TEXT">50</field>
        </shadow>
      </value>
    </block>
    <block type="operator_equals">
      <value name="OPERAND1">
        <shadow type="text">
          <field name="TEXT"/>
        </shadow>
      </value>
      <value name="OPERAND2">
        <shadow type="text">
          <field name="TEXT">50</field>
        </shadow>
      </value>
    </block>
    ${blockSeparator}
    <block type="operator_and"/>
    <block type="operator_or"/>
    <block type="operator_not"/>
    ${blockSeparator}
    <block type="operator_mod">
      <value name="NUM1">
        <shadow type="math_number">
          <field name="NUM"/>
        </shadow>
      </value>
      <value name="NUM2">
        <shadow type="math_number">
          <field name="NUM"/>
        </shadow>
      </value>
    </block>
    <block type="operator_round">
      <value name="NUM">
        <shadow type="math_number">
          <field name="NUM"/>
        </shadow>
      </value>
    </block>
    ${blockSeparator}
    <block type="operator_mathop">
      <value name="NUM">
        <shadow type="math_number">
          <field name="NUM"/>
        </shadow>
      </value>
    </block>
    ${categorySeparator}
  </category>
`;

export function makeToolboxXML() {
  return [
    {
      id: 'motion', // 替换运动积木分类
      xml: motion(),
    },
    {
      id: 'sensing', // 替换侦测积木分类
      xml: sensing(),
    },
    {
      id: 'operators', // 替换运算积木分类
      xml: operators(),
    },
  ];
}
