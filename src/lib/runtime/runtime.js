import { sleepMs, MathUtils } from '@blockcode/utils';
import { Runtime } from '@blockcode/blocks';
import { TankUtils } from './tank-utils';

export class TankRuntime extends Runtime {
  constructor(stage, onWatchHealth) {
    super(stage, false);

    // 监视血量
    this._onWatchHealth = onWatchHealth;

    // 操作工具
    this._tankUtils = new TankUtils(this);

    // 坦克
    this._tanks = new Proxy(stage, {
      get(_, prop) {
        return stage.findOne(`#${prop}`);
      },
    });
  }

  get tanks() {
    return this._tanks;
  }

  get tankUtils() {
    return this._tankUtils;
  }

  get watchHealth() {
    return this._onWatchHealth;
  }

  stop() {
    // 清空所有跑弹和烟雾
    this.boardLayer.destroyChildren();
    super.stop();
  }

  drives(signal) {
    this.tankUtils.drive(this.tanks.player, signal);
    this.tankUtils.drive(this.tanks.red, signal);
    this.tankUtils.drive(this.tanks.yellow, signal);
    this.tankUtils.drive(this.tanks.green, signal);
  }
}
