import { useLocalesContext, useAppContext, useProjectContext, translate, setAppState } from '@blockcode/core';
import { classNames } from '@blockcode/utils';

import { Text, Button, Label, BufferedInput, ToggleButtons } from '@blockcode/core';
import styles from './stage-info.module.css';

// import tankBlueIcon from './icons/icon-tank-blue.png';
import tankRedIcon from './icons/icon-tank-red.png';
import tankYellowIcon from './icons/icon-tank-yellow.png';
import tankGreenIcon from './icons/icon-tank-green.png';
import { useCallback, useMemo } from 'preact/hooks';

const enemiesIcons = [tankRedIcon, tankYellowIcon, tankGreenIcon];

export function StageInfo() {
  const { translator } = useLocalesContext();

  const { appState } = useAppContext();

  const { file, setFile } = useProjectContext();

  const handleChangeName = useCallback((value) => {
    setFile({ name: value });
  }, []);

  const handleChangeEnemies = useCallback((enemies) => {
    setAppState({
      enemies,
    });
  }, []);

  const wrapChangeEnemyAI = useCallback(
    (id) => (ai) => {
      setAppState({
        tanks: appState.value.tanks.map((tank) => (id === tank.id ? { ...tank, ai } : tank)),
      });
    },
    [],
  );

  return (
    <div className={styles.stageInfoWrapper}>
      <div className={classNames(styles.row, styles.rowPrimary)}>
        <Label text={translate('tankwar.stageInfo.player', 'Player')}>
          <BufferedInput
            disabled={appState.value?.running}
            className={styles.nameInput}
            placeholder={translate('tankwar.stageInfo.nickname', 'Nickname')}
            onSubmit={handleChangeName}
            value={file.value.name}
          />
        </Label>
        <Label
          secondary
          className={styles.health}
          text={translate('tankwar.stageInfo.health', 'Health')}
        >
          <div
            className={classNames(styles.healthProgress, {
              [styles.small]: appState.value?.stageSize !== 'large',
            })}
            style={`--percent:${appState.value?.running ? appState.value?.tanks?.[0]?.health : 100}`}
          />
        </Label>
      </div>

      <div className={styles.row}>
        <Label
          secondary
          text={translate('tankwar.stageInfo.enemies', 'Enemies')}
        >
          <ToggleButtons
            disabled={appState.value?.running}
            items={[
              { value: 0, title: '0' },
              { value: 1, title: '1' },
              { value: 3, title: '3' },
            ]}
            value={appState.value?.enemies ?? 1}
            onChange={handleChangeEnemies}
          />
        </Label>

        {appState.value?.enemies > 0 && (
          <Label secondary>
            <ToggleButtons
              disabled={appState.value?.running}
              items={[
                { value: 'local', title: translate('tankwar.stageInfo.mode.local', 'Local AI', translator) },
                {
                  value: 'remote',
                  title: translate('tankwar.stageInfo.mode.remote', 'Remote Players', translator),
                  disabled: true,
                },
              ]}
              value={'local'}
            />
          </Label>
        )}
      </div>

      {appState.value?.tanks?.slice?.(1, appState.value?.enemies + 1)?.map?.((tank, index) => (
        <div
          className={styles.row}
          key={index}
        >
          <Label secondary>
            <img
              className={styles.tankImage}
              src={enemiesIcons[index]}
              alt={tank.name}
              title={tank.name}
            />
          </Label>
          <Label secondary>
            <div
              className={classNames(styles.healthProgress, {
                [styles.small]: appState.value?.stageSize !== 'large',
              })}
              style={`--percent:${appState.value?.running ? tank.health : 100}`}
            />
          </Label>
          <Label
            secondary
            text={translate('tankwar.stageInfo.ai', 'AI')}
          >
            <ToggleButtons
              disabled={appState.value?.running}
              items={[
                { value: 'simple', title: translate('tankwar.stageInfo.ai.simple', 'Simple', translator) },
                { value: 'medium', title: translate('tankwar.stageInfo.ai.medium', 'Medium', translator) },
                { value: 'senior', title: translate('tankwar.stageInfo.ai.senior', 'Senior', translator) },
              ]}
              value={tank.ai ?? 'simple'}
              onChange={wrapChangeEnemyAI(tank.id)}
            />
          </Label>
        </div>
      ))}
    </div>
  );
}
