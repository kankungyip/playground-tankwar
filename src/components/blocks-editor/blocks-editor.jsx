import { BlocksEditor } from '@blockcode/blocks';
import { buildBlocks, TankEmulatorGenerator } from '../../blocks/blocks';

const emulator = new TankEmulatorGenerator();

export function TankBlocksEditor() {
  return (
    <BlocksEditor
      disableExtensionButton
      emulator={emulator}
      onBuildinExtensions={buildBlocks}
    />
  );
}
