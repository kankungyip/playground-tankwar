import { Konva, KonvaUtils } from '@blockcode/utils';

import tankBlueImage from './media/tank-blue.png';
import turretBlueImage from './media/turret-blue.png';
import tankRedImage from './media/tank-red.png';
import turretRedImage from './media/turret-red.png';
import tankYellowImage from './media/tank-yellow.png';
import turretYellowImage from './media/turret-yellow.png';
import tankGreenImage from './media/tank-green.png';
import turretGreenImage from './media/turret-green.png';
import brokenImage from './media/broken.png';

const createImage = (src) => {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(image);
  });
};

const tanksImages = {
  player: {
    tank: createImage(tankBlueImage),
    turret: createImage(turretBlueImage),
  },
  red: {
    tank: createImage(tankRedImage),
    turret: createImage(turretRedImage),
  },
  yellow: {
    tank: createImage(tankYellowImage),
    turret: createImage(turretYellowImage),
  },
  green: {
    tank: createImage(tankGreenImage),
    turret: createImage(turretGreenImage),
  },
  broken: createImage(brokenImage),
};

export function createTank(scaleX, scaleY, id, visible = false) {
  // 坦克单元：车身、炮台、雷达、损毁
  const tankUnit = new Konva.Group({
    id,
    visible,
  });
  // 图片资源
  const images = tanksImages[id];

  // 坦克车身
  const tank = new Konva.Image({
    tankUnit,
    name: 'tank',
    scaleX: scaleX,
    scaleY: scaleY,
  });
  images.tank.then((image) => {
    tank.setAttrs({
      image,
      offsetX: image.width / 2,
      offsetY: image.height / 2,
    });

    // 计算凸包
    KonvaUtils.computeConvexHulls(tankUnit, image);

    // 自定义更新凸包位置用到的属性
    tankUnit.onUpdateConvexHulls = () => ({
      x: tankUnit.x(),
      y: tankUnit.y(),
      offsetX: tank.offsetX(),
      offsetY: tank.offsetY(),
      scaleX: tank.scaleX(),
      scaleY: tank.scaleY(),
      rotation: tank.rotation(),
    });
  });
  tankUnit.add(tank);
  tankUnit.setAttr('tank', tank);

  // 雷达
  const radar = new Konva.Wedge({
    strokeWidth: 0,
    fillRadialGradientStartRadius: 0,
    fillRadialGradientColorStops: [0, 'rgba(255 0 0 / 0.5)', 1, 'rgba(255 0 0 / 0)'],
    visible: false,
  });
  tankUnit.add(radar);
  tankUnit.setAttr('radar', radar);

  // 坦克炮台
  const turret = new Konva.Image({
    tankUnit,
    name: 'turret',
    scaleX: scaleX,
    scaleY: scaleY,
  });
  images.turret.then((image) => {
    turret.setAttrs({
      image,
      offsetX: image.width / 2,
      offsetY: image.height / 2,
    });
  });
  tankUnit.add(turret);
  tankUnit.setAttr('turret', turret);

  // 损毁的坦克
  const broken = new Konva.Image({
    tankUnit,
    scaleX: scaleX,
    scaleY: scaleY,
    visible: false,
  });
  tanksImages.broken.then((image) => {
    broken.setAttrs({
      image,
      offsetX: image.width / 2,
      offsetY: image.height / 2,
    });
  });
  tankUnit.add(broken);
  tankUnit.setAttr('broken', broken);

  return tankUnit;
}
