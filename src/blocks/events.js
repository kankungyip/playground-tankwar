import { translate, themeColors } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks';

export default () => ({
  id: 'event',
  name: '%{BKY_CATEGORY_EVENTS}',
  themeColor: themeColors.blocks.events.primary,
  inputColor: themeColors.blocks.events.secondary,
  otherColor: themeColors.blocks.events.tertiary,
  blocks: [
    {
      // 开始战斗
      // TODO: 替换小绿旗为战斗图标
      id: 'whenflagclicked',
      text: ScratchBlocks.Msg.EVENT_WHENFLAGCLICKED,
      hat: true,
      inputs: {
        FLAG: {
          type: 'image',
          src: './assets/blocks-media/green-flag.svg',
        },
      },
      emu() {
        return `runtime.when('start', ${this.HAT_CALLBACK});\n`;
      },
    },
    '---',
    {
      // 当计时器……
      id: 'whengreaterthan',
      text: ScratchBlocks.Msg.EVENT_WHENGREATERTHAN,
      hat: true,
      inputs: {
        WHENGREATERTHANMENU: {
          type: 'string',
          menu: [
            [ScratchBlocks.Msg.EVENT_WHENGREATERTHAN_TIMER, 'TIMER'],
            [translate('tankwar.blocks.event_damage', 'damage'), 'DAMAGE'],
          ],
        },
        VALUE: {
          type: 'number',
          defaultValue: 10,
        },
      },
      emu(block) {
        const nameValue = block.getFieldValue('WHENGREATERTHANMENU');
        const valueCode = this.valueToCode(block, 'VALUE', this.ORDER_NONE) || '10';
        return `runtime.whenGreaterThen('${nameValue}', ${valueCode}, ${this.HAT_CALLBACK});\n`;
      },
    },
  ],
});
