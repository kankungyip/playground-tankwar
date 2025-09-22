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

  _updateThresholds() {
    const keys = this._thresholds.keys();
    for (const key of keys) {
      const [name, value] = key.split('>');
      let isGreater;
      if (name === 'TIMER') {
        isGreater = this.times > parseFloat(value);
      }
      if (name === 'DAMAGE') {
        const health = this.tanks.player.getAttr('health');
        isGreater = 100 - health > parseFloat(value);
      }
      if (typeof isGreater === 'boolean') {
        if (isGreater && !this._thresholds.get(key)) {
          this.run(`threshold:${key}`);
        }
        this._thresholds.set(key, isGreater);
      }
    }
    this.setMonitorValueById('sensing_health', this.tanks.player.getAttr('health'));
    this.setMonitorValueById('sensing_timer', this.times);
  }

  stop() {
    // 清空所有跑弹和烟雾
    this.querySelectorAll('.boom').forEach((dialog) => dialog.destroy());
    super.stop();
  }

  drives(signal) {
    this.tankUtils.drive(this.tanks.player, signal);
    this.tankUtils.drive(this.tanks.red, signal);
    this.tankUtils.drive(this.tanks.yellow, signal);
    this.tankUtils.drive(this.tanks.green, signal);
  }

  setMonitorValue(label, value) {
    if (label) {
      const monitor = label.getAttr('monitor');
      if (!value) {
        const target = this.querySelector(`#${monitor.groupId}`);
        if (target) {
          switch (monitor.id) {
            case 'motion_xposition':
              value = Math.round(target.x());
              break;
            case 'motion_yposition':
              value = Math.round(target.y());
              break;
            case 'motion_direction':
              value = Math.round(MathUtils.wrapClamp(-target.getAttr('tank').rotation(), -179, 180));
              break;
            default:
              value = 0;
              break;
          }
        }
      }
      super.setMonitorValue(label, value);
    }
  }
}
