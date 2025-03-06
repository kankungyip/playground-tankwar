import { useEffect } from 'preact/hooks';
import { translate, setAppState } from '@blockcode/core';
import { Stage } from '../stage/stage';
import { StageInfo } from '../stage-info/stage-info';
import styles from './sidedock.module.css';

export function Sidedock() {
  useEffect(() => {
    setAppState({
      enemies: 1,
      tanks: [
        {
          id: 'player',
          name: translate('tankwar.stageInfo.player', 'Player'),
          health: 100,
        },
        {
          id: 'red',
          name: translate('tankwar.stageInfo.enemy.red', 'Red'),
          health: 100,
          ai: 'simple',
        },
        {
          id: 'yellow',
          name: translate('tankwar.stageInfo.enemy.yellow', 'Yellow'),
          health: 100,
          ai: 'simple',
        },
        {
          id: 'green',
          name: translate('tankwar.stageInfo.enemy.green', 'Green'),
          health: 100,
          ai: 'simple',
        },
      ],
    });
  }, []);

  return (
    <div className={styles.sidebarWrapper}>
      <Stage className={styles.stageWrapper} />

      <StageInfo />
    </div>
  );
}
