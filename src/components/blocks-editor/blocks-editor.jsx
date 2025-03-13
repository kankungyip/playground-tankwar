import { BlocksEditor } from '@blockcode/blocks';
import { buildBlocks, TankwarGenerator } from '../../blocks/blocks';

const emulator = new TankwarGenerator();

export function TankBlocksEditor() {
  return (
    <BlocksEditor
      enableMonitor
      disableExtensionButton
      emulator={emulator}
      onBuildinExtensions={buildBlocks}
    />
  );
}
