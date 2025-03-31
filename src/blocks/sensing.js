import { translate, themeColors } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks';

export default () => ({
  id: 'sensing',
  name: '%{BKY_CATEGORY_SENSING}',
  themeColor: themeColors.blocks.sensing.primary,
  inputColor: themeColors.blocks.sensing.secondary,
  otherColor: themeColors.blocks.sensing.tertiary,
  blocks: [
    {
      // 扫描距离
      id: 'scandistance',
      text: translate('tankwar.blocks.sensing_distance', 'measure distance of enemy in direction %1'),
      output: 'number',
      inputs: {
        DIRECTION: {
          type: 'angle',
          defaultValue: 90,
        },
      },
      emu(block) {
        const directionValue = this.valueToCode(block, 'DIRECTION', this.ORDER_NONE) || 90;
        const code = `(await tankUtils.scan(target, ${directionValue}))`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      // 扫描敌人
      id: 'scan',
      text: translate('tankwar.blocks.sensing_scan', 'scan for enemy in direction %1?'),
      output: 'boolean',
      inputs: {
        DIRECTION: {
          type: 'angle',
          defaultValue: 90,
        },
      },
      emu(block) {
        const directionValue = this.valueToCode(block, 'DIRECTION', this.ORDER_NONE) || 90;
        const code = `(await tankUtils.scan(target, ${directionValue}) !== Infinity)`;
        return [code, this.ORDER_EQUALITY];
      },
    },
    '---',
    {
      // 设置扫描宽度
      id: 'scanwidth',
      text: translate('tankwar.blocks.sensing_scanwidth', 'set scan width to %1'),
      inputs: {
        WIDTH: {
          type: 'number',
          defaultValue: 5,
        },
      },
      emu(block) {
        const widthValue = this.valueToCode(block, 'WIDTH', this.ORDER_NONE) || 5;
        const code = `target.setAttr('scanWidth', ${widthValue});\n`;
        return code;
      },
    },
    '---',
    {
      // 血量
      id: 'health',
      text: translate('tankwar.blocks.sensing_health', 'health'),
      output: 'number',
      emu(block) {
        return [`target.getAttr('health')`, this.ORDER_FUNCTION_CALL];
      },
    },
    '---',
    {
      // 计时器
      id: 'timer',
      text: ScratchBlocks.Msg.SENSING_TIMER,
      output: 'number',
      emu(block) {
        return ['runtime.times', this.ORDER_MEMBER];
      },
    },
    {
      // 重置计时器
      id: 'resettimer',
      text: ScratchBlocks.Msg.SENSING_RESETTIMER,
      emu(block) {
        const code = 'runtime.resetTimes()\n';
        return code;
      },
    },
  ],
});
