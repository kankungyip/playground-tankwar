import { ScratchBlocks } from '@blockcode/blocks';

ScratchBlocks.Blocks['motion_attack'] = {
  init() {
    this.jsonInit({
      message0: ScratchBlocks.Msg.MOTION_ATTACK,
      args0: [
        {
          type: 'input_value',
          name: 'DIRECTION',
        },
        {
          type: 'input_value',
          name: 'DISTANCE',
        },
      ],
      category: ScratchBlocks.Categories.motion,
      extensions: ['colours_motion', 'shape_statement'],
    });
  },
};

ScratchBlocks.Blocks['motion_move'] = {
  init() {
    this.jsonInit({
      message0: ScratchBlocks.Msg.MOTION_MOVE,
      args0: [
        {
          type: 'input_value',
          name: 'DIRECTION',
        },
        {
          type: 'input_value',
          name: 'SPEED',
        },
      ],
      category: ScratchBlocks.Categories.motion,
      extensions: ['colours_motion', 'shape_statement'],
    });
  },
};

ScratchBlocks.Blocks['motion_setspeed'] = {
  init() {
    this.jsonInit({
      message0: ScratchBlocks.Msg.MOTION_SETSPEED,
      args0: [
        {
          type: 'input_value',
          name: 'SPEED',
        },
      ],
      category: ScratchBlocks.Categories.motion,
      extensions: ['colours_motion', 'shape_statement'],
    });
  },
};

ScratchBlocks.Blocks['motion_stop'] = {
  init() {
    this.jsonInit({
      message0: ScratchBlocks.Msg.MOTION_STOP,
      category: ScratchBlocks.Categories.motion,
      extensions: ['colours_motion', 'shape_statement'],
    });
  },
};

ScratchBlocks.Blocks['motion_speed'] = {
  init() {
    this.jsonInit({
      message0: ScratchBlocks.Msg.MOTION_SPEED,
      category: ScratchBlocks.Categories.motion,
      checkboxInFlyout: true,
      extensions: ['colours_motion', 'output_number'],
    });
  },
};
