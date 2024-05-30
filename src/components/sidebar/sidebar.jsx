import { useState } from 'preact/hooks';

import Stage from '../stage/stage';
import StageInfo from '../stage-info/stage-info';

import styles from './sidebar.module.css';

export default function Sidebar() {
  const [playing, setPlaying] = useState(false);
  const [enemies, setEnemies] = useState(1);
  const [enemiesAI, setEnemiesAI] = useState({
    red: 'simple',
    yellow: 'medium',
    green: 'senior',
  });
  const [health, setHealth] = useState({
    player: 100,
    red: 100,
    yellow: 100,
    green: 100,
  });

  return (
    <div className={styles.sidebarWrapper}>
      <Stage
        className={styles.stageWrapper}
        playing={playing}
        enemies={enemies}
        enemiesAI={enemiesAI}
        onChangePlaying={setPlaying}
        onChangeHealth={setHealth}
      />
      <StageInfo
        playing={playing}
        enemies={enemies}
        enemiesAI={enemiesAI}
        health={health}
        onChangeEnemies={setEnemies}
        onChangeEnemyAI={(tank, ai) =>
          setEnemiesAI({
            ...enemiesAI,
            [tank]: ai,
          })
        }
      />
    </div>
  );
}
