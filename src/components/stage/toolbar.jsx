import { useCallback } from 'preact/hooks';
import { classNames } from '@blockcode/utils';
import { useAppContext, translate, setAppState, ToggleButtons } from '@blockcode/core';
import styles from './toolbar.module.css';

import greenFlagIcon from './icons/icon-green-flag.svg';
import stopAllIcon from './icons/icon-stop-all.svg';
import smallStageIcon from './icons/icon-small-stage.svg';
import largeStageIcon from './icons/icon-large-stage.svg';

export function Toolbar() {
  const { appState } = useAppContext();

  const handleFight = useCallback(() => {
    let tanks = appState.value?.tanks?.map?.((tank) => ({ ...tank, health: 100 }));
    setAppState({
      tanks,
      running: !!tanks,
    });
  }, []);

  const handleStop = useCallback(() => {
    setAppState('running', false);
  }, []);

  const handleChangeStageSize = useCallback((stageSize) => {
    setAppState('stageSize', stageSize);
  }, []);

  return (
    <div className={styles.toolbarWrapper}>
      <div className={styles.toolbarButtonsGroup}>
        <img
          className={classNames(styles.greenFlag, {
            [styles.actived]: appState.value?.running,
          })}
          src={greenFlagIcon}
          title={translate('tankwar.player.greenFlag', 'Fight')}
          onClick={handleFight}
        />
        <img
          className={classNames(styles.stopAll, {
            [styles.actived]: appState.value?.running,
          })}
          src={stopAllIcon}
          title={translate('tankwar.player.stopAll', 'Stop')}
          onClick={handleStop}
        />
      </div>
      <div className={styles.toolbarButtonsGroup}>
        <ToggleButtons
          items={[
            {
              icon: smallStageIcon,
              title: translate('tankwar.stage.small', 'Switch to small stage'),
              value: 'small',
            },
            {
              icon: largeStageIcon,
              title: translate('tankwar.stage.large', 'Switch to large stage'),
              value: 'large',
            },
          ]}
          value={appState.value?.stageSize ?? 'small'}
          onChange={handleChangeStageSize}
        />
      </div>
    </div>
  );
}
