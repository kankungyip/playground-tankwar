import { classNames } from '@blockcode/utils';
import { useAppContext } from '@blockcode/core';
import { TankEmulator } from '../emulator/emulator';
import { Toolbar } from './toolbar';
import styles from './stage.module.css';

export function Stage() {
  const { appState } = useAppContext();
  return (
    <div className={styles.stageWrapper}>
      <Toolbar />

      <div
        className={classNames(styles.stage, {
          [styles.small]: appState.value?.stageSize !== 'large',
        })}
      >
        <TankEmulator />
      </div>
    </div>
  );
}
