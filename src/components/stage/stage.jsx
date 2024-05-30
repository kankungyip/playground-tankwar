import { classNames } from '@blockcode/ui';
import { TankwarPlayer } from '../tankwar-player/tankwar-player';
import Toolbar from './toolbar';
import styles from './stage.module.css';

export default function Stage({ playing, enemies, enemiesAI, onChangePlaying, onChangeHealth }) {
  const handlePlay = () => onChangePlaying(true);
  const handleStop = () => onChangePlaying(false);

  return (
    <div className={styles.stageWrapper}>
      <Toolbar
        playing={playing}
        onPlay={handlePlay}
        onStop={handleStop}
      />

      <div className={classNames(styles.stage)}>
        <TankwarPlayer
          playing={playing}
          enemies={enemies}
          enemiesAI={enemiesAI}
          onRequestStop={handleStop}
          onChangeHealth={onChangeHealth}
        />
      </div>
    </div>
  );
}
