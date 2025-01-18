import { EventEmitter } from 'node:events';
import { sleep, MathUtils } from '@blockcode/utils';
import { Konva } from '@blockcode/blocks';

import bulletImage from './media/bullet.png';
import boomImage from './media/boom.png';

const SPEED_RATIO = 2;
const SECOND_PER_DEGREE = 5 / 360;
const BULLET_COOLDOWN = 1000;
const MIN_BULLET_DISTANCE = 70;
const MAX_BULLET_DISTANCE = 300;
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
    this._maxX = runtime.backdropLayer.canvas.width / 2;
    this._maxY = runtime.backdropLayer.canvas.height / 2;
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

  // 启动坦克
  drive(tankUnit, signal) {
    tankUnit.setAttr('currentSpeed', 0);

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

    // 根据速度调整坦克前进/停止/后退
    const speedValue = tankUnit.getAttr('speed');
    if (!speedValue) return;

    const rotation = tankUnit.getAttr('tank').rotation();
    const radian = MathUtils.degToRad(rotation - 90);
    const dx = -speedValue * Math.cos(radian);
    const dy = -speedValue * Math.sin(radian);

    // TODO: 碰到边缘停止
    let newX = tankUnit.x() + dx;
    let newY = tankUnit.y() + dy;
    if (newX > this._maxX || newX < -this._maxX) {
      newX = -1 * Math.sign(newX) * this._maxX;
    }
    if (newY > this._maxY || newY < -this._maxY) {
      newY = -1 * Math.sign(newY) * this._maxY;
    }

    // TODO: 碰到坦克停止

    this.spritesLayer.children.forEach((group) => {
      if (!group.visible() || group === tankUnit) {
        return;
      }
      const a = {
        centerX: group.x(),
        centerY: group.y(),
        width: group.getAttr('tank').getAttr('offsetX'),
        height: group.getAttr('tank').getAttr('offsetY'),
        angle: group.getAttr('tank').getAttr('rotation'),
      };
      const b = {
        centerX: tankUnit.x(),
        centerY: tankUnit.y(),
        width: tankUnit.getAttr('tank').getAttr('offsetX'),
        height: tankUnit.getAttr('tank').getAttr('offsetY'),
        angle: tankUnit.getAttr('tank').getAttr('rotation'),
      };
      if (this._detectCollision(a, b)) {
        tankUnit.setAttr('speed', 0);
      }
    });

    tankUnit.setAttrs({
      x: newX,
      y: newY,
      currentSpeed: speedValue * this._speedRatio,
    });
  }

  _haveIntersection(r1, r2) {
    return !(
      r2.centerX > r1.centerX + r1.width ||
      r2.centerX + r2.width < r1.centerX ||
      r2.centerY > r1.centerY + r1.height ||
      r2.centerY + r2.height < r1.centerY
    );
  }

  _detectCollision(rect1, rect2) {
    /**
     * 碰撞检测函数，检测两个旋转矩形是否碰撞
     *
     * rect1, rect2 格式:
     * {
     *   centerX: 矩形中心点X坐标,
     *   centerY: 矩形中心点Y坐标,
     *   width: 矩形宽度,
     *   height: 矩形高度,
     *   angle: 矩形旋转角度（以弧度为单位）
     * }
     */

    // 获取矩形的顶点
    function getVertices(centerX, centerY, width, height, angle) {
      const hw = width / 2;
      const hh = height / 2;

      // 矩形顶点相对于中心点的坐标
      const vertices = [
        { x: -hw, y: -hh },
        { x: hw, y: -hh },
        { x: hw, y: hh },
        { x: -hw, y: hh },
      ];

      // 旋转并平移顶点
      return vertices.map((vertex) => {
        const rotatedX = vertex.x * Math.cos(angle) - vertex.y * Math.sin(angle);
        const rotatedY = vertex.x * Math.sin(angle) + vertex.y * Math.cos(angle);
        return {
          x: rotatedX + centerX,
          y: rotatedY + centerY,
        };
      });
    }

    // 获取向量
    function getVector(p1, p2) {
      return { x: p2.x - p1.x, y: p2.y - p1.y };
    }

    // 获取向量的法向量
    function getPerpendicular(vector) {
      return { x: -vector.y, y: vector.x };
    }

    // 计算顶点在轴上的投影
    function project(vertices, axis) {
      const dots = vertices.map((v) => v.x * axis.x + v.y * axis.y);
      return { min: Math.min(...dots), max: Math.max(...dots) };
    }

    // 判断两个投影是否重叠
    function isOverlapping(proj1, proj2) {
      return !(proj1.max < proj2.min || proj2.max < proj1.min);
    }

    // 获取两个矩形的顶点
    const vertices1 = getVertices(rect1.centerX, rect1.centerY, rect1.width, rect1.height, rect1.angle);
    const vertices2 = getVertices(rect2.centerX, rect2.centerY, rect2.width, rect2.height, rect2.angle);

    // 获取两个矩形的边向量
    const edges = [
      ...vertices1.map((v, i) => getVector(v, vertices1[(i + 1) % vertices1.length])),
      ...vertices2.map((v, i) => getVector(v, vertices2[(i + 1) % vertices2.length])),
    ];

    // 遍历所有分离轴
    for (const edge of edges) {
      const axis = getPerpendicular(edge); // 分离轴
      const proj1 = project(vertices1, axis);
      const proj2 = project(vertices2, axis);

      if (!isOverlapping(proj1, proj2)) {
        return false; // 找到分离轴，矩形无碰撞
      }
    }

    return true; // 所有分离轴的投影重叠，矩形发生碰撞
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
        if (target.getAttr('tween')) {
          const tween = target.getAttr('tween');
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
          target.setAttr('tween', null);
          tween.destroy();

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
    const direction = this.getDirection(tankUnit) + angleValue;
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
