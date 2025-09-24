import { useCallback, useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { Konva } from '@blockcode/utils';
import { useAppContext, useProjectContext, setAppState } from '@blockcode/core';
import { Emulator } from '@blockcode/blocks';
import { TankRuntime } from '../../lib/runtime/runtime';
import { createTank } from '../../lib/runtime/create-tank';
import { simple } from '../../lib/runtime/simple-ai';
import { medium } from '../../lib/runtime/medium-ai';
import { senior } from '../../lib/runtime/senior-ai';

import backaroundImage from '../../lib/runtime/media/background.png';

const AIs = {
  simple,
  medium,
  senior,
};

const resetTank = (tankUnit, x, y, rotation) => {
  if (!tankUnit) return;
  tankUnit.setAttrs({
    x,
    y,
    health: 100,
    speed: 0,
    scanWidth: 4,
    cooldown: null,
  });

  tankUnit.getAttr('broken')?.setAttr('visible', false);
  tankUnit.getAttr('radar')?.setAttr('visible', false);

  const tank = tankUnit.getAttr('tank');
  const turret = tankUnit.getAttr('turret');

  if (tank) {
    tank.setAttrs({
      rotation,
      visible: true,
    });
    const tankTween = tank.getAttr('tween');
    if (tankTween) {
      tankTween.reset();
      tankTween.destroy();
      setTimeout(() => tank.setAttr('tween', null));
    }
  }

  if (turret) {
    turret.setAttrs({
      rotation,
      visible: true,
    });
    const turretTween = turret.getAttr('tween');
    if (turretTween) {
      turretTween.reset();
      turretTween.destroy();
      setTimeout(() => turret.setAttr('tween', null));
    }
  }

  return tankUnit;
};

export function TankEmulator() {
  const { appState } = useAppContext();

  const { meta, file } = useProjectContext();

  const runtime = useSignal(null);

  const resetTanks = useCallback(() => {
    if (!appState.value) return;
    if (!runtime.value?.tanks) return;

    resetTank(runtime.value.tanks.player, -180, 180, -135)?.setAttrs({
      name: file.value.name,
      zIndex: 3,
    });
    resetTank(runtime.value.tanks.red, 180, -180, 45)?.setAttr('visible', appState.value.enemies > 0);
    resetTank(runtime.value.tanks.yellow, 180, 180, 135)?.setAttr('visible', appState.value.enemies > 1);
    resetTank(runtime.value.tanks.green, -180, -180, -45)?.setAttr('visible', appState.value.enemies > 2);
    runtime.value.updateMonitors(meta.value.monitors);
  }, []);

  // 变量监视
  useEffect(async () => {
    runtime.value?.updateMonitors(meta.value.monitors);
  }, [meta.value]);

  // 运行模拟器
  useEffect(async () => {
    if (!runtime.value) return;

    // 启动
    if (appState.value?.running === true) {
      let code = '';
      code += 'const tankUtils = runtime.tankUtils;\n';
      // 玩家坦克
      code += `(target => {\n${file.value.script}})(runtime.tanks.player);\n\n`;
      // AI 坦克
      for (let i = 1; i <= appState.value.enemies; i++) {
        const enemy = appState.value.tanks[i];
        code += `(target => {\n${AIs[enemy.ai]}})(runtime.tanks.${enemy.id});\n\n`;
      }
      runtime.value.launch(`${code}runtime.start();`);
    } else if (appState.value?.running === false) {
      if (runtime.value.running) {
        runtime.value.stop();
        resetTanks();
      }
    }
  }, [appState.value?.running]);

  // 模拟器停战状态下更新坦克位置和数量
  useEffect(resetTanks, [runtime.value, appState.value?.enemies]);

  // 这是模拟器运行时
  const handleRuntime = useCallback((stage) => {
    const handleWatchHealth = (tanks) => {
      setAppState({
        tanks: tanks.map((health, index) => ({
          ...appState.value.tanks[index],
          health,
        })),
      });
    };

    runtime.value = new TankRuntime(stage, handleWatchHealth);

    const scaleX = 0.5;
    const scaleY = scaleX * stage.scaleY();

    // 创建背景
    Konva.Image.fromURL(backaroundImage, (image) => {
      image.setAttrs({
        x: 0,
        y: 0,
        offsetX: image.width() / 2,
        offsetY: image.height() / 2,
        scaleX: scaleX,
        scaleY: scaleY,
      });
      runtime.value.backdropLayer.add(image);
    });

    // 创建坦克
    runtime.value.spritesLayer.add(createTank(scaleX, scaleY, 'player', true));
    runtime.value.spritesLayer.add(createTank(scaleX, scaleY, 'red'));
    runtime.value.spritesLayer.add(createTank(scaleX, scaleY, 'yellow'));
    runtime.value.spritesLayer.add(createTank(scaleX, scaleY, 'green'));

    // 坦克根据设定的速度每帧前进
    const abortController = runtime.value.createAbortController();
    runtime.value.on('frame', () => runtime.value.drives(abortController.signal));

    return () => {
      runtime.value = null;
    };
  }, []);

  return (
    <Emulator
      zoom={appState.value?.stageSize !== 'large' ? 0.8 : 1}
      width={480}
      height={480}
      onRuntime={handleRuntime}
    />
  );
}
