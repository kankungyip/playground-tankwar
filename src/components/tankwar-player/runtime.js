import { Runtime as BaseRuntime, paperCore } from '@blockcode/blocks-player';

export default class Runtime extends BaseRuntime {
  get player() {
    return paperCore.project.activeLayer.children.player;
  }

  get redTank() {
    return paperCore.project.activeLayer.children.red;
  }

  get yellowTank() {
    return paperCore.project.activeLayer.children.yellow;
  }

  get greenTank() {
    return paperCore.project.activeLayer.children.green;
  }

  start() {
    this.player.util.running = true;
    this.redTank.util.running = true;
    this.yellowTank.util.running = true;
    this.greenTank.util.running = true;
    super.start();
  }

  stop() {
    this.player.util.running = false;
    this.redTank.util.running = false;
    this.yellowTank.util.running = false;
    this.greenTank.util.running = false;
    return super.stop();
  }
}
