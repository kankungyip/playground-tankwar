import { useState } from 'preact/hooks';
import { useEditor } from '@blockcode/core';
import { BlocksPlayer, paperCore } from '@blockcode/blocks-player';
import { javascriptGenerator } from '../../generators/javascript';

import backgroundImage from './tanks/background.png';
import Tank from './tank';
import Runtime from './runtime';
import generate from './generate';
import * as AIs from './ai';

export function TankwarPlayer({ playing, enemies, enemiesAI, onRequestStop, onChangeHealth }) {
  const [canvas, setCanvas] = useState(null);
  const [currentRuntime, setCurrentRuntime] = useState(false);
  const { fileList } = useEditor();
  const player = fileList[0];

  if (canvas) {
    const tanks = paperCore.project.activeLayer.children;

    if (playing) {
      if (!currentRuntime) {
        // start
        const ai = [];
        if (enemies > 0) {
          ai.push(AIs[enemiesAI.red]('red', Date.now().toString(36)));
        }
        if (enemies > 1) {
          ai.push(AIs[enemiesAI.yellow]('yellow', Date.now().toString(36)));
        }
        if (enemies > 2) {
          ai.push(AIs[enemiesAI.green]('green', Date.now().toString(36)));
        }

        const runtime = new Runtime(onRequestStop);
        runtime.launch(generate(player.script, ai));
        runtime.on('frame', () => {
          onChangeHealth({
            player: tanks.player.util.health,
            red: tanks.red.util.health,
            yellow: tanks.yellow.util.health,
            green: tanks.green.util.health,
          });
        });
        const workspace = ScratchBlocks.getMainWorkspace();
        if (workspace) {
          workspace.addChangeListener(onRequestStop);
        }
        setCurrentRuntime(runtime);
      }
    } else {
      if (currentRuntime) {
        // stop
        const workspace = ScratchBlocks.getMainWorkspace();
        if (workspace) {
          workspace.removeChangeListener(onRequestStop);
        }
        currentRuntime.stop().then(() => {
          onChangeHealth({
            player: 100,
            red: 100,
            yellow: 100,
            green: 100,
          });
          paperCore.project.activeLayer.children.forEach((item) => {
            if (item.name === 'background') return;
            if (item.util instanceof Tank || item.owner instanceof Tank) return;
            item.remove();
          });
          setCurrentRuntime(false);
        });
      } else {
        tanks.player.util.place = Tank.PLACE.LEFT_TOP;
        if (enemies > 0) {
          tanks.red.util.place = Tank.PLACE.RIGHT_BOTTOM;
        } else {
          tanks.red.util.hidden = true;
        }
        if (enemies > 2) {
          tanks.yellow.util.place = Tank.PLACE.RIGHT_TOP;
          tanks.green.util.place = Tank.PLACE.LEFT_BOTTOM;
        } else {
          tanks.yellow.util.hidden = true;
          tanks.green.util.hidden = true;
        }
        paperCore.project.activeLayer.children.forEach((item) => {
          if (item.name === 'background') return;
          if (item.util instanceof Tank || item.owner instanceof Tank) return;
          item.remove();
        });
      }
    }
  }

  const handleSetup = (canvas) => {
    setCanvas(canvas);
    paperCore.view.zoom = 0.5;
    new paperCore.Raster({
      name: 'background',
      source: backgroundImage,
      position: paperCore.view.center,
    });
    new Tank('player', Tank.STYLE.PLAYER, Tank.PLACE.LEFT);
    new Tank('red', Tank.STYLE.ENEMY_A, Tank.PLACE.RIGHT);
    new Tank('yellow', Tank.STYLE.ENEMY_B, Tank.PLACE.RIGHT_BOTTOM);
    new Tank('green', Tank.STYLE.ENEMY_C, Tank.PLACE.LEFT_BOTTOM);
  };

  return (
    <BlocksPlayer
      width={`480px`}
      height={`480px`}
      javascriptGenerator={javascriptGenerator}
      onSetup={handleSetup}
    />
  );
}
