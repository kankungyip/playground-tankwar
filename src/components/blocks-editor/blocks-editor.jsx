import { translate } from '@blockcode/core';
import { BlocksEditor } from '@blockcode/blocks';
import { TankemuGenerator } from '../../generators/tankemu';
import { makeToolboxXML } from '../../lib/make-toolbox-xml';

const emulator = new TankemuGenerator();

export function TankBlocksEditor() {
  const messages = {
    MOTION_ATTACK: translate('tankwar.blocks.motion_attack', 'fire in direction %1 at %2 steps'),
    MOTION_MOVE: translate('tankwar.blocks.motion_move', 'forward in direction %1 at %2 % speed'),
    MOTION_SETSPEED: translate('tankwar.blocks.motion_setspeed', 'set speed to %1 %'),
    MOTION_STOP: translate('tankwar.blocks.motion_stop', 'stop'),
    MOTION_SPEED: translate('tankwar.blocks.motion_speed', 'speed'),
    SENSING_SCANWIDTH: translate('tankwar.blocks.sensing_scanwidth', 'set scan width to %1'),
    SENSING_SCAN: translate('tankwar.blocks.sensing_scan', 'scan for enemy in direction %1?'),
    SENSING_DISTANCE: translate('tankwar.blocks.sensing_distance', 'measure distance of enemy in direction %1'),
    SENSING_HEALTH: translate('tankwar.blocks.sensing_health', 'health'),
  };

  return (
    <BlocksEditor
      disableExtension
      messages={messages}
      emulator={emulator}
      onMakeToolboxXML={makeToolboxXML}
    />
  );
}
