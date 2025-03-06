import { translate, themeColors } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks';

export default () => ({
  id: 'motion',
  name: '%{BKY_CATEGORY_MOTION}',
  themeColor: themeColors.blocks.motion.primary,
  inputColor: themeColors.blocks.motion.secondary,
  otherColor: themeColors.blocks.motion.tertiary,
  order: 0,
  blocks: [
    {
      // 攻击
      id: 'attack',
      text: translate('tankwar.blocks.motion_attack', 'fire in direction %1 at %2 steps'),
      inputs: {
        DIRECTION: {
          type: 'angle',
          defaultValue: 90,
        },
        DISTANCE: {
          type: 'number',
          defaultValue: 50,
        },
      },
      emu(block) {
        let code = '';
        if (this.STATEMENT_PREFIX) {
          code += this.injectId(this.STATEMENT_PREFIX, block);
        }
        const directionValue = this.valueToCode(block, 'DIRECTION', this.ORDER_NONE) || '0';
        const distanceValue = this.valueToCode(block, 'DISTANCE', this.ORDER_NONE) || '100';
        code += `await tankUtils.attack(target, signal, ${directionValue}, ${distanceValue});\n`;
        return code;
      },
    },
    {
      // 移动
      id: 'move',
      text: translate('tankwar.blocks.motion_move', 'forward in direction %1 at %2 % speed'),
      inputs: {
        DIRECTION: {
          type: 'angle',
          defaultValue: 90,
        },
        SPEED: {
          type: 'number',
          defaultValue: 100,
        },
      },
      emu(block) {
        let code = '';
        if (this.STATEMENT_PREFIX) {
          code += this.injectId(this.STATEMENT_PREFIX, block);
        }
        const directionValue = this.valueToCode(block, 'DIRECTION', this.ORDER_NONE) || '0';
        const speedValue = this.valueToCode(block, 'SPEED', this.ORDER_NONE) || '100';
        code += `await tankUtils.move(target, signal, ${directionValue}, ${speedValue});\n`;
        return code;
      },
    },
    '---',
    {
      // 右转
      id: 'turnright',
      text: ScratchBlocks.Msg.MOTION_TRUNRIGHT,
      inputs: {
        IMAGE: {
          type: 'image',
          src: './assets/blocks-media/rotate-right.svg',
        },
        DEGREES: {
          type: 'number',
          defaultValue: 15,
        },
      },
      emu(block) {
        let code = '';
        if (this.STATEMENT_PREFIX) {
          code += this.injectId(this.STATEMENT_PREFIX, block);
        }
        const degreesCode = this.valueToCode(block, 'DEGREES', this.ORDER_NONE) || 0;
        code += `await tankUtils.turnRight(target, signal, ${degreesCode});\n`;
        return code;
      },
    },
    {
      // 右转
      id: 'turnleft',
      text: ScratchBlocks.Msg.MOTION_TRUNLEFT,
      inputs: {
        IMAGE: {
          type: 'image',
          src: './assets/blocks-media/rotate-left.svg',
        },
        DEGREES: {
          type: 'number',
          defaultValue: 15,
        },
      },
      emu(block) {
        let code = '';
        if (this.STATEMENT_PREFIX) {
          code += this.injectId(this.STATEMENT_PREFIX, block);
        }
        const degreesCode = this.valueToCode(block, 'DEGREES', this.ORDER_NONE) || 0;
        code += `await tankUtils.turnLeft(target, signal, ${degreesCode});\n`;
        return code;
      },
    },
    {
      // 面向
      id: 'pointindirection',
      text: ScratchBlocks.Msg.MOTION_POINTINDIRECTION,
      inputs: {
        DIRECTION: {
          type: 'angle',
          defaultValue: 90,
        },
      },
      emu(block) {
        let code = '';
        if (this.STATEMENT_PREFIX) {
          code += this.injectId(this.STATEMENT_PREFIX, block);
        }
        const directionCode = this.valueToCode(block, 'DIRECTION', this.ORDER_NONE) || '0';
        code += `await tankUtils.setDirection(target, signal, ${directionCode});\n`;
        return code;
      },
    },
    '---',
    {
      // 设置速度
      id: 'setspeed',
      text: translate('tankwar.blocks.motion_setspeed', 'set speed to %1 %'),
      inputs: {
        SPEED: {
          type: 'number',
          defaultValue: 50,
        },
      },
      emu(block) {
        let code = '';
        if (this.STATEMENT_PREFIX) {
          code += this.injectId(this.STATEMENT_PREFIX, block);
        }
        const speedCode = this.valueToCode(block, 'SPEED', this.ORDER_NONE) || '0';
        code += `tankUtils.setSpeed(target, ${speedCode});\n`;
        return code;
      },
    },
    {
      // 停止
      id: 'stop',
      text: translate('tankwar.blocks.motion_stop', 'stop'),
      emu(block) {
        let code = '';
        if (this.STATEMENT_PREFIX) {
          code += this.injectId(this.STATEMENT_PREFIX, block);
        }
        code += `tankUtils.stop(target);\n`;
        return code;
      },
    },
    '---',
    {
      // 速度
      id: 'speed',
      text: translate('tankwar.blocks.motion_speed', 'speed'),
      output: 'number',
      emu(block) {
        return [`tankUtils.getSpeed(target)`, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      // x
      id: 'xposition',
      text: ScratchBlocks.Msg.MOTION_XPOSITION,
      output: 'number',
      emu(block) {
        return ['target.x()', this.ORDER_FUNCTION_CALL];
      },
    },
    {
      // y
      id: 'yposition',
      text: ScratchBlocks.Msg.MOTION_XPOSITION,
      output: 'number',
      emu(block) {
        return ['target.y()', this.ORDER_FUNCTION_CALL];
      },
    },
    {
      // 方向
      id: 'direction',
      text: ScratchBlocks.Msg.MOTION_DIRECTION,
      output: 'number',
      emu(block) {
        return ['tankUtils.getDirection(target)', this.ORDER_FUNCTION_CALL];
      },
    },
  ],
});
