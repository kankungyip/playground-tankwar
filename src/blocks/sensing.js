import { ScratchBlocks } from '@blockcode/blocks';

ScratchBlocks.Blocks['sensing_scanwidth'] = {
  init() {
    this.jsonInit({
      message0: ScratchBlocks.Msg.SENSING_SCANWIDTH,
      args0: [
        {
          type: 'input_value',
          name: 'WIDTH',
        },
      ],
      category: ScratchBlocks.Categories.sensing,
      extensions: ['colours_sensing', 'shape_statement'],
    });
  },
};

ScratchBlocks.Blocks['sensing_scan'] = {
  init() {
    this.jsonInit({
      message0: ScratchBlocks.Msg.SENSING_SCAN,
      args0: [
        {
          type: 'input_value',
          name: 'DIRECTION',
        },
      ],
      category: ScratchBlocks.Categories.sensing,
      extensions: ['colours_sensing', 'output_boolean'],
    });
  },
};

ScratchBlocks.Blocks['sensing_scandistance'] = {
  init() {
    this.jsonInit({
      message0: ScratchBlocks.Msg.SENSING_DISTANCE,
      args0: [
        {
          type: 'input_value',
          name: 'DIRECTION',
        },
      ],
      category: ScratchBlocks.Categories.sensing,
      extensions: ['colours_sensing', 'output_number'],
    });
  },
};

ScratchBlocks.Blocks['sensing_health'] = {
  init() {
    this.jsonInit({
      message0: ScratchBlocks.Msg.SENSING_HEALTH,
      category: ScratchBlocks.Categories.sensing,
      checkboxInFlyout: true,
      extensions: ['colours_sensing', 'output_number'],
    });
  },
};
