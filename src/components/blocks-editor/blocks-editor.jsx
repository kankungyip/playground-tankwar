import { useLocale } from '@blockcode/core';
import { codeTab } from '@blockcode/workspace-blocks/app';
import { javascriptGenerator } from '../../generators/javascript';

import makeToolboxXML from '../../lib/make-toolbox-xml';

const Editor = codeTab.Content;

export default function BlocksEditor() {
  const { getText } = useLocale();

  const messages = {
    MOTION_ATTACK: getText('tankwar.blocks.motion_attack', 'fire in direction %1 at %2 steps'),
    MOTION_MOVE: getText('tankwar.blocks.motion_move', 'forward in direction %1 at %2 % speed'),
    MOTION_SETSPEED: getText('tankwar.blocks.motion_setspeed', 'set speed to %1 %'),
    MOTION_STOP: getText('tankwar.blocks.motion_stop', 'stop'),
    MOTION_SPEED: getText('tankwar.blocks.motion_speed', 'speed'),
    SENSING_SCANWIDTH: getText('tankwar.blocks.sensing_scanwidth', 'set scan width to %1'),
    SENSING_SCAN: getText('tankwar.blocks.sensing_scan', 'scan for enemy in direction %1?'),
    SENSING_DISTANCE: getText('tankwar.blocks.sensing_distance', 'measure distance of enemy in direction %1'),
    SENSING_HEALTH: getText('tankwar.blocks.sensing_health', 'health'),
  };
  const toolbox = makeToolboxXML();

  return (
    <Editor
      disableGenerator
      disableExtension
      messages={messages}
      toolbox={toolbox}
      generators={[javascriptGenerator]}
    />
  );
}
