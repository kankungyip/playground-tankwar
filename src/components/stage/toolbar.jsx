import { useLocale } from '@blockcode/core';
import { classNames } from '@blockcode/ui';

import styles from './toolbar.module.css';
import iconGreenFlag from './icon-green-flag.svg';
import iconStopAll from './icon-stop-all.svg';

export default function Toolbar({ playing, onPlay, onStop }) {
  const { getText } = useLocale();

  return (
    <div className={styles.toolbarWrapper}>
      <div className={styles.toolbarButtonsGroup}>
        <img
          className={classNames(styles.greenFlag, {
            [styles.actived]: playing,
          })}
          src={iconGreenFlag}
          title={getText('tankwar.player.greenFlag', 'Go')}
          onClick={onPlay}
        />
        <img
          className={classNames(styles.stopAll, {
            [styles.actived]: playing,
          })}
          src={iconStopAll}
          title={getText('tankwar.player.stopAll', 'Stop')}
          onClick={onStop}
        />
      </div>
      {/* <div className={styles.toolbarButtonsGroup}>
        <Button
          className={classNames(styles.toolbarButton, styles.groupButtonFirst)}
          onClick={handleTurnLeft}
        >
          <img
            src={iconSmallStage}
            title={getText('popsicle.blocks.smallStage', 'Switch to small stage')}
          />
        </Button>
        <Button
          className={classNames(styles.toolbarButton, styles.groupButtonLast)}
          onClick={handleTurnRight}
        >
          <img
            src={iconLargeStage}
            title={getText('popsicle.blocks.largeStage', 'Switch to large stage')}
          />
        </Button>
      </div> */}
    </div>
  );
}
