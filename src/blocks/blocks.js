import getMotionBlocks from './motion';
import getEventBlocks from './events';
import getSensingBlocks from './sensing';

export { TankEmulatorGenerator } from './generator';

export function buildBlocks() {
  const motionBlocks = getMotionBlocks();

  const eventBlocks = getEventBlocks();

  const sensingBlocks = getSensingBlocks();

  return [motionBlocks, eventBlocks, sensingBlocks];
}
