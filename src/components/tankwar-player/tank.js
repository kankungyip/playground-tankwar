import { paperCore } from '@blockcode/blocks-player';
import loadImage from '../../lib/load-image';

import imageTank1 from './tanks/tank_1.png';
import imageTurret1 from './tanks/turret_1.png';
import imageTank2 from './tanks/tank_2.png';
import imageTurret2 from './tanks/turret_2.png';
import imageTank3 from './tanks/tank_3.png';
import imageTurret3 from './tanks/turret_3.png';
import imageTank4 from './tanks/tank_4.png';
import imageTurret4 from './tanks/turret_4.png';
import imageBroken from './tanks/broken.png';
import imageBullet from './tanks/bullet.png';
import imageBoom1 from './tanks/boom1.png';
import imageBoom2 from './tanks/boom2.png';
import imageBoom3 from './tanks/boom3.png';

const SPEED_RATIO = 20;
const DEFAULT_SCAN_WIDTH = 4;
const MAX_SCAN_WIDTH = 40;
const MAX_SCAN_DISTANCE = 500;
const MIN_ATTACK_DISTANCE = 70;
const MAX_ATTACK_DISTANCE = 400;
const BULLET_STEP = 10;
const BULLET_SKIP_DISTANCE = 50;
const TURN_ROUND_MS = 1000;

const calcDistance = (p1, p2) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

const number = (n) => (isNaN(n) ? 0 : +n);
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

const degToRad = (deg) => (deg * Math.PI) / 180;
const calcDegrees = (deg) => parseInt(((deg % 360) + 360) % 360);
const equalDegrees = (deg1, deg2) => calcDegrees(deg1) === calcDegrees(deg2);

export default class Tank {
  static PLACE = {
    LEFT: {
      get position() {
        return new paperCore.Point(paperCore.view.center.x - 300, paperCore.view.center.y);
      },
      rotation: 90,
    },
    RIGHT: {
      get position() {
        return new paperCore.Point(paperCore.view.center.x + 300, paperCore.view.center.y);
      },
      rotation: -90,
    },
    LEFT_TOP: {
      get position() {
        return new paperCore.Point(paperCore.view.center.x - 300, paperCore.view.center.y - 300);
      },
      rotation: 135,
    },
    RIGHT_TOP: {
      get position() {
        return new paperCore.Point(paperCore.view.center.x + 300, paperCore.view.center.y - 300);
      },
      rotation: -135,
    },
    LEFT_BOTTOM: {
      get position() {
        return new paperCore.Point(paperCore.view.center.x - 300, paperCore.view.center.y + 300);
      },
      rotation: 45,
    },
    RIGHT_BOTTOM: {
      get position() {
        return new paperCore.Point(paperCore.view.center.x + 300, paperCore.view.center.y + 300);
      },
      rotation: -45,
    },
  };

  static STYLE = {
    PLAYER: {
      tank: imageTank1,
      turret: imageTurret1,
    },
    ENEMY_A: {
      tank: imageTank2,
      turret: imageTurret2,
    },
    ENEMY_B: {
      tank: imageTank3,
      turret: imageTurret3,
    },
    ENEMY_C: {
      tank: imageTank4,
      turret: imageTurret4,
    },
  };

  constructor(name, style = Tank.STYLE.PLAYER, place = Tank.PLACE.LEFT) {
    const scaling = 0.2;
    this.raster = new paperCore.Raster({
      name,
      scaling,
      source: style.tank,
      position: place.position,
      rotation: place.rotation,
      visible: style === Tank.STYLE.PLAYER,
    });
    this.turretRaster = new paperCore.Raster({
      scaling,
      source: style.turret,
      position: place.position,
      rotation: place.rotation,
      visible: style === Tank.STYLE.PLAYER,
    });
    this.raster.util = this;
    this.turretRaster.owner = this;

    this._hidden = true;
    this._lastScanDistance = 0;
    this._imageCache = {};
    this._timers = [];

    this.reset();
  }

  sleep(ms) {
    return new Promise((resolve) => this._timers.push(setTimeout(resolve, ms)));
  }

  reset() {
    this._speed = 0;
    this._currentSpeed = 0;
    this._health = 100;
    this._scanWidth = DEFAULT_SCAN_WIDTH;
    this._turretReady = null;

    if (this._scanShape) {
      this._scanShape.remove();
      this._scanShape = null;
    }
    if (this._bulletRaster) {
      this._bulletRaster.remove();
      this._bulletRaster = null;
    }
    if (this._boomRaster) {
      this._boomRaster.remove();
      this._boomRaster = null;
    }
    if (this._collideTester) {
      this._collideTester.remove();
      this._collideTester = null;
    }

    clearTimeout(this._turretReady);
    this._timers.forEach(clearTimeout);
    this._timers.length = 0;
  }

  bringToFront() {
    this.raster.bringToFront();
    this.turretRaster.bringToFront();
  }

  get running() {
    return this._running;
  }

  set running(value) {
    this.reset();
    this._running = value;

    if (value) {
      const width = this.raster.scaling.x * this.raster.width - 5;
      this._collideTester = new paperCore.Path.Rectangle({
        point: [this.raster.position.x - width / 2, this.raster.position.y - 5],
        size: [width, 10],
        applyMatrix: false,
      });
    }
  }

  get bullseye() {
    if (!this._bullseye) {
      this._bullseye = (Math.min(this.raster.width, this.raster.height) * this.raster.scaling.x) / 4;
    }
    return this._bullseye;
  }

  get enemies() {
    if (!this._enemies) {
      this._enemies = ['red', 'yellow', 'green', 'player']
        .filter((n) => n !== this.raster.name)
        .map((n) => paperCore.project.activeLayer.children[n]);
    }
    return this._enemies;
  }

  set place(place) {
    if (this.running) return;
    this.raster.position = this.turretRaster.position = place.position;
    this.raster.rotation = this.turretRaster.rotation = place.rotation;
    this.hidden = false;
  }

  get hidden() {
    return this._hidden;
  }

  set hidden(value) {
    this._hidden = value;
    this.raster.visible = this.turretRaster.visible = !value;
  }

  async _turn(target, direction) {
    if (!equalDegrees(target.rotation, direction)) {
      let degress = calcDegrees(direction) - calcDegrees(target.rotation);
      if (degress > 180) degress -= 360;
      if (degress < -180) degress += 360;
      await target.tween({ rotation: target.rotation + degress }, TURN_ROUND_MS * (Math.abs(degress) / 360));
    }
  }

  async attack(direction, distance) {
    if (!this.running) return;
    if (this._bulletRaster || this.death) return;

    direction = Math.round(number(direction));
    distance = number(distance) - BULLET_SKIP_DISTANCE;

    clearTimeout(this._turretReady);
    this._turretReady = null;
    await this._turn(this.turretRaster, direction);

    const degrees = calcDegrees(direction);
    const radian = degToRad(90 - degrees);

    if (!this._imageCache.buttet) {
      this._imageCache.buttet = await loadImage(imageBullet);
    }
    if (this._bulletRaster) {
      this._bulletRaster.remove();
      this._bulletRaster = null;
    }

    this._bulletRaster = new paperCore.Raster({
      image: this._imageCache.buttet,
      position: new paperCore.Point(
        this.raster.position.x + BULLET_SKIP_DISTANCE * Math.cos(radian),
        this.raster.position.y - BULLET_SKIP_DISTANCE * Math.sin(radian),
      ),
      rotation: this.raster.rotation,
      scaling: this.raster.scaling,
    });

    distance = clamp(distance, MIN_ATTACK_DISTANCE, MAX_ATTACK_DISTANCE);

    const half = distance / 2;
    const scaling = BULLET_STEP / distance / 2;

    let dx = BULLET_STEP * Math.cos(radian);
    let dy = BULLET_STEP * Math.sin(radian);
    while (distance > 0) {
      await this.sleep(15);
      if (distance < BULLET_STEP) {
        dx = distance * Math.cos(radian);
        dy = distance * Math.sin(radian);
      }
      distance -= BULLET_STEP;
      this._bulletRaster.position.x += dx;
      this._bulletRaster.position.y -= dy;
      this._bulletRaster.scaling.x += distance > half ? scaling : -scaling;
      this._bulletRaster.scaling.y = this._bulletRaster.scaling.x;
      if (this._bulletRaster.scaling.x < this.raster.scaling.x) {
        this._bulletRaster.scaling = this.raster.scaling;
      }
    }
    this._boom(this._bulletRaster.position);

    this._collide(this._bulletRaster, (enemy) => {
      if (calcDistance(enemy.position, this._bulletRaster.position) < enemy.util.bullseye) {
        enemy.util.hurt(10);
      } else {
        enemy.util.hurt(5);
      }
    });
    this._bulletRaster.remove();
    this._bulletRaster = null;
    this._turretReady = setTimeout(() => {
      this._turn(this.turretRaster, this.raster.rotation);
      this._turretReady = null;
    }, 1000);
  }

  async _boom(position) {
    if (!this.running) return;
    if (!this._imageCache.booms) {
      this._imageCache.booms = [await loadImage(imageBoom1), await loadImage(imageBoom2), await loadImage(imageBoom3)];
    }
    if (this._boomRaster) {
      this._boomRaster.remove();
      this._boomRaster = null;
    }
    this._boomRaster = new paperCore.Raster({
      image: this._imageCache.booms[0],
      position,
    });
    await this.sleep(30);
    this._boomRaster.image = this._imageCache.booms[1];
    await this.sleep(50);
    this._boomRaster.image = this._imageCache.booms[2];
    await this.sleep(90);
    this._boomRaster.remove();
    this._boomRaster = null;
  }

  _intersectsOrContains(tester, target) {
    return tester.intersects(target) || target.contains(tester.position);
  }

  _collide(tester, collidingCallback) {
    if (this.running && !this.death) {
      this.enemies.forEach((enemy) => {
        if (enemy.util.death || enemy.util.hidden) return;
        if (this._intersectsOrContains(tester, enemy)) collidingCallback(enemy);
      });
    }
  }

  async move(direction, speed) {
    if (!this.running) return;
    if (this.death) return;
    await this.setDirection(direction);
    this.speed = number(speed);
  }

  drive() {
    if (!this.running) return;
    if (this.speed === 0) return;
    if (this.hidden || this.death) return;

    let speed = this.speed;
    const radian = degToRad(90 - this.direction);

    const height = this.raster.scaling.y * this.raster.height;
    this._collideTester.rotation = this.raster.rotation;
    this._collideTester.position.x = this.raster.position.x + (height / 2 + 5) * Math.cos(radian);
    this._collideTester.position.y = this.raster.position.y - (height / 2 + 5) * Math.sin(radian);

    this.enemies.forEach((enemy) => {
      if (enemy.util.hidden) return;
      if (this._intersectsOrContains(this.raster, enemy) && this._intersectsOrContains(this._collideTester, enemy)) {
        speed = 0;
      }
    });
    this._currentSpeed = speed;

    speed /= SPEED_RATIO;
    this.raster.position.x += speed * Math.cos(radian);
    this.raster.position.y -= speed * Math.sin(radian);
    this.turretRaster.position = this.raster.position;
  }

  get x() {
    return this.raster.position.x - paperCore.view.center.x;
  }

  get y() {
    return paperCore.view.center.y - this.raster.position.y;
  }

  get currentSpeed() {
    return clamp(this._currentSpeed, -100, 100);
  }

  get speed() {
    return clamp(this._speed, -100, 100);
  }

  set speed(value) {
    if (!this.running) return;
    this._speed = clamp(value, -100, 100);
  }

  get speedVelocity() {
    const angle = calcDegrees(this.speed < 0 ? 180 + this.direction : this.direction);
    const radia = degToRad(90 - angle);
    const length = Math.abs(this.speed);
    return new paperCore.Point(length * Math.cos(radia), length * Math.sin(radia));
  }

  get direction() {
    let direction = this.raster.rotation % 360;
    if (direction > 180) direction -= 360;
    if (direction <= -180) direction += 360;
    return direction;
  }

  async setDirection(direction) {
    if (!this.running) return;
    direction = Math.round(number(direction));
    if (!this._turretReady) {
      this._turn(this.turretRaster, direction);
    }
    await this._turn(this.raster, direction);
  }

  turnRight(degrees) {
    let direction = this.raster.rotation; // % 360;
    direction += number(degrees);
    return this.setDirection(direction);
  }

  turnLeft(degrees) {
    return this.turnRight(-number(degrees));
  }

  hurt(value) {
    if (!this.running) return;
    this._health -= Math.abs(value);
    if (this.death) {
      this.raster.visible = this.turretRaster.visible = false;
      new paperCore.Raster({
        source: imageBroken,
        scaling: this.raster.scaling,
        position: this.raster.position,
        rotation: this.raster.rotation,
      }).insertAbove(paperCore.project.activeLayer.children['background']);
    }
  }

  get health() {
    if (this._health < 0) return 0;
    return this._health;
  }

  get death() {
    return this.health <= 0;
  }

  get scanWidth() {
    return this._scanWidth;
  }

  set scanWidth(width) {
    width = number(width);
    this._scanWidth = clamp(width, 1, MAX_SCAN_WIDTH);
  }

  async scan(direction) {
    if (!this.running) return Infinity;
    if (this._scanShape || this.death) return Infinity;

    direction = number(direction);
    if (!equalDegrees(this._lastScanDistance, direction)) {
      let degress = calcDegrees(direction) - calcDegrees(this._lastScanDistance);
      if (degress > 180) degress -= 360;
      if (degress < -180) degress += 360;
      await this.sleep(TURN_ROUND_MS * (Math.abs(degress) / 360));
      this._lastScanDistance = direction;
    }

    const radian1 = degToRad(90 - (direction - this.scanWidth / 2));
    const d1x = MAX_SCAN_DISTANCE * Math.cos(radian1);
    const d1y = MAX_SCAN_DISTANCE * Math.sin(radian1);
    const point1 = new paperCore.Point(this.raster.position.x + d1x, this.raster.position.y - d1y);

    const radian2 = degToRad(90 - (direction + this.scanWidth / 2));
    const d2x = MAX_SCAN_DISTANCE * Math.cos(radian2);
    const d2y = MAX_SCAN_DISTANCE * Math.sin(radian2);
    const point2 = new paperCore.Point(this.raster.position.x + d2x, this.raster.position.y - d2y);

    if (this._scanShape) {
      this._scanShape.remove();
      this._scanShape = null;
    }
    this._scanShape = new paperCore.Path({
      segments: [this.raster.position, point1, point2],
      closed: true,
      fillColor: {
        gradient: {
          stops: [
            ['rgb(255 0 0 0.4)', 0],
            ['rgb(255 0 0 0)', 0.7],
          ],
          radial: true,
        },
        origin: this.raster.position,
        destination: point1,
      },
    });
    await this.sleep(TURN_ROUND_MS * (this.scanWidth / 360));

    let result = Infinity;
    this._collide(this._scanShape, (enemy) => {
      const distance = calcDistance(this.raster.position, enemy.position);
      if (distance < result) result = distance;
    });
    this._scanShape.remove();
    this._scanShape = null;
    return result;
  }
}
