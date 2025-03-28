import { EventEmitter } from 'node:events';
import { sleep, MathUtils, Konva, KonvaUtils } from '@blockcode/utils';

import bulletImage from './media/bullet.png';
import boomImage from './media/boom.png';

const SPEED_RATIO = 2;
const SECOND_PER_DEGREE = 5 / 360;
const BULLET_COOLDOWN = 1000;
const MIN_BULLET_DISTANCE = 50;
const MAX_BULLET_DISTANCE = 200;
const BULLET_SKIP_DISTANCE = 20; // 让炮弹离开车身
const BULLET_SPEED = 200;
const MIN_SCAN_WIDTH = 2;
const MAX_SCAN_WIDTH = 30;
const MAX_SCAN_DISTANCE = 400;
// const SCAN_AREA = (MIN_SCAN_WIDTH / 360) * Math.PI * MAX_SCAN_DISTANCE ** 2;

// 雷达扫描面积一定，扫描宽度越宽距离越短
// const getScanDistance = (n) => Math.sqrt(SCAN_AREA / ((n / 360) * Math.PI));

export class TankUtils extends EventEmitter {
  constructor(runtime) {
    super();
    this._runtime = runtime;
    this._speedRatio = SPEED_RATIO * runtime.fps;
    this._bulletSpeed = BULLET_SPEED / runtime.fps;

    // 炮弹资源
    this._bulletImage = new Image();
    this._bulletImage.src = bulletImage;

    // 烟雾资源
    this._boomImage = new Image();
    this._boomImage.src = boomImage;
  }

  get runtime() {
    return this._runtime;
  }

  get running() {
    return this.runtime.running;
  }

  get stage() {
    return this.runtime.stage;
  }

  get backdropLayer() {
    return this.runtime.backdropLayer;
  }

  get paintLayer() {
    return this.runtime.paintLayer;
  }

  get spritesLayer() {
    return this.runtime.spritesLayer;
  }

  get boardLayer() {
    return this.runtime.boardLayer;
  }

  get tanks() {
    return this.runtime.tanks;
  }

  // 寻找最接近的边缘
  _findNearestEdge(target) {
    const clientRect = target.getClientRect();
    const width = this.stage.width();
    const height = this.stage.height();

    const leftDist = clientRect.x;
    const topDist = clientRect.y;
    const rightDist = width - (clientRect.x + clientRect.width);
    const bottomDist = height - (clientRect.y + clientRect.height);

    let nearestEdge;
    let minDist = Infinity;
    if (leftDist < minDist) {
      minDist = leftDist;
      nearestEdge = 'left';
    }
    if (topDist < minDist) {
      minDist = topDist;
      nearestEdge = 'top';
    }
    if (rightDist < minDist) {
      minDist = rightDist;
      nearestEdge = 'right';
    }
    if (bottomDist < minDist) {
      minDist = bottomDist;
      nearestEdge = 'bottom';
    }
    if (minDist > 0) return;
    return nearestEdge;
  }

  // 启动坦克
  drive(tankUnit, signal) {
    if (!this.running) return;
    if (!tankUnit.visible()) return;

    const tank = tankUnit.getAttr('tank');
    const turret = tankUnit.getAttr('turret');

    // 损毁的坦克
    if (tankUnit.getAttr('health') <= 0) {
      tankUnit.getAttr('broken').visible(true);
      tank.visible(false);
      turret.visible(false);
      return;
    }

    // 对齐炮台和车身
    if (!tankUnit.getAttr('cooldown') && !turret.getAttr('tween') && tank.rotation() !== turret.rotation()) {
      this._turn(turret, signal, tank.rotation());
    }

    // TODO: 冒烟的坦克

    // 碰到边缘停止
    const nearestEdge = this._findNearestEdge(tank);
    if (nearestEdge) {
      tankUnit.setAttr('speed', 0);
    }

    // 碰到坦克停止
    this.spritesLayer.children.some((enemyUnit) => {
      if (enemyUnit === tankUnit || !enemyUnit.visible()) return;
      if (KonvaUtils.checkConvexHullsCollision(tankUnit, enemyUnit)) {
        tankUnit.setAttr('speed', 0);
      }
    });

    // 根据速度调整坦克前进/停止/后退
    const speedValue = tankUnit.getAttr('speed');
    if (!speedValue) return;

    const rotation = tankUnit.getAttr('tank').rotation();
    const radian = MathUtils.degToRad(rotation - 90);
    const dx = -speedValue * Math.cos(radian);
    const dy = -speedValue * Math.sin(radian);

    tankUnit.position({
      x: tankUnit.x() + dx,
      y: tankUnit.y() + dy,
    });
  }

  // 面向方向速度
  move(tankUnit, signal, direction, speed) {
    if (!this.running) return;
    if (!tankUnit.visible()) return;
    if (tankUnit.getAttr('health') <= 0) return;
    this.setSpeed(tankUnit, speed);
    return this.setDirection(tankUnit, signal, direction);
  }

  // 车身/炮台转向
  // 每秒转动72度
  _turn(target, signal, rotation) {
    if (!this.running) return;
    if (!target.visible()) return;
    if (target.getAttr('tween')) return;

    let rotationValue = Math.abs(rotation - target.rotation());
    if (rotationValue > 180) {
      rotationValue = 360 - rotationValue;
      rotation = target.rotation() + rotationValue;
    }

    return new Promise((resolve, reject) => {
      // 中止动画
      const handleAbort = () => {
        const tween = target.getAttr('tween');
        if (tween) {
          target.setAttr('tween', null);
          tween.reset();
          tween.destroy();
        }

        signal.off('abort', handleAbort);
        reject();
      };
      signal.once('abort', handleAbort);

      const tween = new Konva.Tween({
        node: target,
        rotation,
        duration: SECOND_PER_DEGREE * Math.abs(rotation - target.rotation()),
        easing: Konva.Easings.Linear,
        onFinish: () => {
          const tween = target.getAttr('tween');
          if (tween) {
            target.setAttr('tween', null);
            tween.destroy();
          }

          signal.off('abort', handleAbort);
          resolve();
        },
      });
      target.setAttr('tween', tween);
      tween.play();
    });
  }

  // 设定方向
  setDirection(tankUnit, signal, direction) {
    if (!this.running) return;
    if (!tankUnit.visible()) return;
    if (tankUnit.getAttr('health') <= 0) return;
    const directionValue = -MathUtils.toNumber(direction);
    return this._turn(tankUnit.getAttr('tank'), signal, directionValue);
  }

  // 获得方向
  getDirection(tankUnit) {
    return MathUtils.wrapClamp(-tankUnit.getAttr('tank').rotation(), -179, 180);
  }

  // 右转
  turnRight(tankUnit, signal, angle) {
    if (!this.running) return;
    if (!tankUnit.visible()) return;
    if (tankUnit.getAttr('health') <= 0) return;
    const angleValue = MathUtils.toNumber(angle);
    const direction = -tankUnit.getAttr('tank').rotation() + angleValue;
    return this.setDirection(tankUnit, signal, direction);
  }

  // 左转
  turnLeft(tankUnit, signal, angle) {
    const angleValue = MathUtils.toNumber(angle);
    return this.turnRight(tankUnit, signal, -angleValue);
  }

  // 设定速度
  setSpeed(tankUnit, speed) {
    if (!this.running) return;
    if (!tankUnit.visible()) return;
    if (tankUnit.getAttr('health') <= 0) return;
    const speedValue = MathUtils.toNumber(speed) / this._speedRatio;
    tankUnit.setAttr('speed', speedValue);
  }

  // 速度
  getSpeed(tankUnit) {
    const speedValue = tankUnit.getAttr('speed');
    return Math.round(speedValue * this._speedRatio);
  }

  // 停止
  stop(tankUnit) {
    this.setSpeed(tankUnit, 0);
  }

  _hit(tankUnit, bullet) {
    if (!this.running) return;
    if (!tankUnit.visible()) return;

    // 不打自己坦克
    if (tankUnit === bullet.getAttr('tankUnit')) return;

    const tank = tankUnit.getAttr('tank');
    const pos1 = tankUnit.position();
    const pos2 = bullet.position();
    const distance = MathUtils.distanceTo(pos1, pos2);
    const tankSize = Math.min(tank.width(), tank.height()) * tank.scaleX();

    // 直接命中 -10
    if (distance < tankSize / 2) {
      const health = tankUnit.getAttr('health') - 10;
      tankUnit.setAttr('health', health);
      return;
    }

    // 间接命中 -5
    if (distance < tankSize / 1.414215) {
      const health = tankUnit.getAttr('health') - 5;
      tankUnit.setAttr('health', health);
      return;
    }
  }

  // 炮弹爆炸
  _boom(bullet) {
    if (!this.running) return;

    // 载入爆炸动画
    const boom = new Konva.Sprite({
      x: bullet.x(),
      y: bullet.y(),
      image: this._boomImage,
      scale: bullet.scale(),
      rotation: bullet.rotation(),
      offsetX: this._boomImage.width / 4 / 2,
      offsetY: this._boomImage.height / 2,
      animation: 'ready',
      animations: {
        // x, y, width, height (3 frames)
        boom: [80, 0, 80, 80, 160, 0, 80, 80, 240, 0, 80, 80],
        ready: [0, 0, 80, 80],
      },
      frameRate: 6,
      frameIndex: 0,
    });
    this.boardLayer.add(boom);

    // 爆炸动画
    boom.start();
    boom.animation('boom');
    boom.on('frameIndexChange.button', () => {
      if (boom.frameIndex() === 2) {
        setTimeout(() => {
          boom.off('.button');
          boom.destroy();
        }, 1000 / boom.frameRate());
      }
    });
    bullet.visible(false);

    // 检测碰撞
    this._hit(this.tanks.player, bullet);
    this._hit(this.tanks.red, bullet);
    this._hit(this.tanks.yellow, bullet);
    this._hit(this.tanks.green, bullet);

    bullet.destroy();

    this.runtime.watchHealth([
      this.tanks.player.getAttr('health'),
      this.tanks.red.getAttr('health'),
      this.tanks.yellow.getAttr('health'),
      this.tanks.green.getAttr('health'),
    ]);
  }

  // 开火
  attack(tankUnit, signal, direction, distance) {
    if (!this.running) return;
    if (!tankUnit.visible()) return;
    if (tankUnit.getAttr('health') <= 0) return;

    const tank = tankUnit.getAttr('tank');
    const turret = tankUnit.getAttr('turret');

    return new Promise(async (resolve, reject) => {
      // 中止开火
      const handleAbort = () => {
        handleAbort.stopped = true;

        // 销毁炮弹
        const bullet = turret.getAttr('bullet');
        const tween = bullet.getAttr('tween');
        if (tween) {
          tween.pause();
          tween.destroy();
          bullet.destroy();
        }

        signal.off('abort', handleAbort);
        reject();
      };
      signal.once('abort', handleAbort);

      // 加载跑弹
      const bullet = new Konva.Image({
        tankUnit,
        image: this._bulletImage,
        offsetX: this._bulletImage.width / 2,
        offsetY: this._bulletImage.height / 2,
        scale: tank.scale(),
        visible: false,
      });
      this.boardLayer.add(bullet);
      turret.setAttr('bullet', bullet);

      // 转动炮台
      // 中止之前的转动
      if (turret.getAttr('tween')) {
        const tween = turret.getAttr('tween');
        turret.setAttr('tween', null);
        tween.pause();
        tween.destroy();
      }
      const directionValue = -MathUtils.toNumber(direction);
      await this._turn(turret, signal, directionValue);

      if (handleAbort.stopped) return;

      // 炮弹冷却
      if (tankUnit.getAttr('cooldown')) {
        clearTimeout(tankUnit.getAttr('cooldown'));
      }
      tankUnit.setAttr(
        'cooldown',
        setTimeout(() => tankUnit.setAttr('cooldown', null), BULLET_COOLDOWN),
      );

      // 发射跑弹
      const radian = MathUtils.degToRad(directionValue - 90);

      // 跑弹离开炮台位置
      bullet.setAttrs({
        x: tankUnit.x() + -BULLET_SKIP_DISTANCE * Math.cos(radian),
        y: tankUnit.y() + -BULLET_SKIP_DISTANCE * Math.sin(radian),
        visible: true,
      });

      // 移动跑弹
      const distanceValue = MathUtils.clamp(MathUtils.toNumber(distance), MIN_BULLET_DISTANCE, MAX_BULLET_DISTANCE);
      const dx = -distanceValue * Math.cos(radian);
      const dy = -distanceValue * Math.sin(radian);
      const x = bullet.x() + dx;
      const y = bullet.y() + dy;
      const duration = distanceValue / this._bulletSpeed / this.runtime.fps;

      // 跑弹飞行缩放
      const start = Date.now();
      const scaling = this._bulletSpeed / distanceValue / 2;

      const tween = new Konva.Tween({
        x,
        y,
        duration,
        node: bullet,
        easing: Konva.Easings.EaseInOut,
        onUpdate: () => {
          let scale = bullet.scaleX() + scaling;
          if (Date.now() - start > (duration / 2) * 1000) {
            scale = bullet.scaleX() - scaling;
          }
          bullet.setAttrs({
            scaleX: scale,
            scaleY: scale,
          });
        },
        onFinish: () => {
          this._boom(bullet);
          const tween = bullet.getAttr('tween');
          bullet.setAttr('tween', null);
          tween.destroy();
        },
      });
      bullet.setAttr('tween', tween);
      tween.play();

      await sleep(1);
      signal.off('abort', handleAbort);
      resolve();
    });
  }

  // 检查是否被扫描到物体/坦克
  _catch(target, radar) {
    if (!this.running) return;
    if (!target.visible()) return;

    // 不扫描自己
    const tankUnit = radar.getAttr('tankUnit');
    if (target === tankUnit) return;

    // TODO: 判断扫描到的是否是敌人

    // 计算扫描范围
    const angle1 = radar.rotation();
    const angle2 = angle1 + radar.angle();
    const angleStart = Math.min(angle1, angle2);
    const angleEnd = Math.max(angle1, angle2);

    const pos1 = tankUnit.position();
    const pos2 = target.position();
    const distance = MathUtils.distanceTo(pos1, pos2);
    const direction = MathUtils.directionTo(pos1, pos2);

    // 在扫描范围
    if (direction > angleStart && direction < angleEnd && distance < MAX_SCAN_DISTANCE) {
      return distance;
    }
  }

  // 雷达扫描
  async scan(tankUnit, direction) {
    if (!this.running) return;
    if (!tankUnit.visible()) return;
    if (tankUnit.getAttr('health') <= 0) return;

    const directionValue = -MathUtils.toNumber(direction) + 90;

    const scanWidth = MathUtils.clamp(tankUnit.getAttr('scanWidth'), MIN_SCAN_WIDTH, MAX_SCAN_WIDTH);
    // const scanDistance = getScanDistance(scanWidth); // 根据宽度算距离
    const scanDistance = MAX_SCAN_DISTANCE;

    const radar = tankUnit.getAttr('radar');
    radar.setAttrs({
      tankUnit,
      angle: scanWidth, // 扫描宽度
      radius: scanDistance, // 扫描距离
      rotation: directionValue - scanWidth / 2,
      fillRadialGradientEndRadius: scanDistance * 0.7,
      visible: true,
    });

    await sleep(SECOND_PER_DEGREE * scanWidth * 1.5);
    radar.visible(false);

    // 判断扫描到的敌人的距离
    const d1 = this._catch(this.tanks.player, radar) ?? Infinity;
    const d2 = this._catch(this.tanks.red, radar) ?? Infinity;
    const d3 = this._catch(this.tanks.yellow, radar) ?? Infinity;
    const d4 = this._catch(this.tanks.green, radar) ?? Infinity;

    return Math.min(d1, d2, d3, d4);
  }
}
