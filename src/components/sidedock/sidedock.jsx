import { useEffect } from 'preact/hooks';
import { useLocalesContext, translate, setAppState } from '@blockcode/core';
import { Stage } from '../stage/stage';
import { StageInfo } from '../stage-info/stage-info';
import styles from './sidedock.module.css';

export function Sidedock() {
  const { translator } = useLocalesContext();

  useEffect(() => {
    setAppState({
      enemies: 1,
      tanks: [
        {
          id: 'player',
          name: translate('tankwar.stageInfo.player', 'Player', translator),
          health: 100,
        },
        {
          id: 'red',
          name: translate('tankwar.stageInfo.enemy.red', 'Red', translator),
          health: 100,
          ai: 'simple',
        },
        {
          id: 'yellow',
          name: translate('tankwar.stageInfo.enemy.yellow', 'Yellow', translator),
          health: 100,
          ai: 'simple',
        },
        {
          id: 'green',
          name: translate('tankwar.stageInfo.enemy.green', 'Green', translator),
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
