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
    },
  ],
});
