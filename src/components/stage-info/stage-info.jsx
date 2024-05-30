import { useLocale, useEditor } from '@blockcode/core';
import { classNames, Text, Button, Label, BufferedInput, ComingSoon } from '@blockcode/ui';

import styles from './stage-info.module.css';
import imageTank2 from './tank-2.png';
import imageTank3 from './tank-3.png';
import imageTank4 from './tank-4.png';

const tankImages = [imageTank2, imageTank3, imageTank4];

export default function StageInfo({ playing, enemies, enemiesAI, health, onChangeEnemies, onChangeEnemyAI }) {
  const { getText } = useLocale();
  const { fileList, modifyFile } = useEditor();

  const player = fileList[0];

  const handleChangeInfo = (key, value) => {
    modifyFile({ [key]: value });
  };

  return (
    <div className={styles.stageInfoWrapper}>
      <div className={classNames(styles.row, styles.rowPrimary)}>
        <Label text={getText('tankwar.stageInfo.player', 'Player')}>
          <BufferedInput
            disabled={playing}
            className={styles.nameInput}
            placeholder={getText('tankwar.stageInfo.nickname', 'Nickname')}
            onSubmit={(value) => handleChangeInfo('name', value)}
            value={player.name}
          />
        </Label>
        <Label
          secondary
          className={styles.health}
          text={getText('tankwar.stageInfo.health', 'Health')}
        >
          <div
            className={styles.healthProgress}
            style={`--percent:${health.player || 0}`}
          />
        </Label>
      </div>

      <div className={styles.row}>
        <Label
          secondary
          text={getText('tankwar.stageInfo.enemies', 'Enemies')}
        >
          <Button
            disabled={playing}
            className={classNames(styles.button, styles.groupButtonFirst, {
              [styles.groupButtonToggledOn]: enemies === 0,
            })}
            onClick={() => onChangeEnemies(0)}
          >
            <div className={styles.buttonText}>0</div>
          </Button>
          <Button
            disabled={playing}
            className={classNames(styles.button, styles.groupButton, {
              [styles.groupButtonToggledOn]: enemies === 1,
            })}
            onClick={() => onChangeEnemies(1)}
          >
            <div className={styles.buttonText}>1</div>
          </Button>
          <Button
            disabled={playing}
            className={classNames(styles.button, styles.groupButtonLast, {
              [styles.groupButtonToggledOn]: enemies === 3,
            })}
            onClick={() => onChangeEnemies(3)}
          >
            <div className={styles.buttonText}>3</div>
          </Button>
        </Label>

        {enemies > 0 && (
          <Label secondary>
            <Button
              disabled={playing}
              className={classNames(styles.button, styles.groupButtonFirst, {
                [styles.groupButtonToggledOn]: true,
              })}
            >
              <div className={styles.buttonText}>
                <Text
                  id="tankwar.stageInfo.mode.local"
                  defaultMessage="Local AI"
                />
              </div>
            </Button>
            <ComingSoon placement="bottom">
              <Button
                disabled={playing}
                className={classNames(styles.button, styles.groupButtonLast, {
                  [styles.groupButtonToggledOn]: false,
                })}
              >
                <div className={styles.buttonText}>
                  <Text
                    id="tankwar.stageInfo.mode.remote"
                    defaultMessage="Remote Players"
                  />
                </div>
              </Button>
            </ComingSoon>
          </Label>
        )}
      </div>

      {['red', 'yellow', 'green'].slice(0, enemies).map((tank, index) => (
        <div
          className={styles.row}
          key={index}
        >
          <Label secondary>
            <img
              className={styles.tankImage}
              src={tankImages[index]}
              alt={getText(`tankwar.stageInfo.enemy.${tank}`, tank.replace(tank[0], tank[0].toUpperCase()))}
              title={getText(`tankwar.stageInfo.enemy.${tank}`, tank.replace(tank[0], tank[0].toUpperCase()))}
            />
          </Label>
          <Label secondary>
            <div
              className={styles.healthProgress}
              style={`--percent:${health[tank] || 0}`}
            />
          </Label>
          <Label
            secondary
            text={getText('tankwar.stageInfo.ai', 'AI')}
          >
            <Button
              disabled={playing}
              className={classNames(styles.button, styles.groupButtonFirst, {
                [styles.groupButtonToggledOn]: enemiesAI[tank] === 'simple',
              })}
              onClick={() => onChangeEnemyAI(tank, 'simple')}
            >
              <div className={styles.buttonText}>
                <Text
                  id="tankwar.stageInfo.ai.simple"
                  defaultMessage="Simple"
                />
              </div>
            </Button>
            <Button
              disabled={playing}
              className={classNames(styles.button, styles.groupButton, {
                [styles.groupButtonToggledOn]: enemiesAI[tank] === 'medium',
              })}
              onClick={() => onChangeEnemyAI(tank, 'medium')}
            >
              <div className={styles.buttonText}>
                <Text
                  id="tankwar.stageInfo.ai.medium"
                  defaultMessage="Medium"
                />
              </div>
            </Button>
            <Button
              disabled={playing}
              className={classNames(styles.button, styles.groupButtonLast, {
                [styles.groupButtonToggledOn]: enemiesAI[tank] === 'senior',
              })}
              onClick={() => onChangeEnemyAI(tank, 'senior')}
            >
              <div className={styles.buttonText}>
                <Text
                  id="tankwar.stageInfo.ai.senior"
                  defaultMessage="Senior"
                />
              </div>
            </Button>
          </Label>
        </div>
      ))}
    </div>
  );
}
