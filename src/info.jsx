import { addLocalesMessages, Text } from '@blockcode/core';
import { version } from '../package.json';
import featureImage from './feature.png';

// 添加仅扩展介绍信息的本地化信息
addLocalesMessages({
  en: {
    'tankwar.name': 'AI Tank War',
    'tankwar.description': 'Programming your tank and go battle!',
    'tankwar.collaborator': 'Yeqin Gong',
  },
  'zh-Hans': {
    'tankwar.name': 'AI 坦克大战',
    'tankwar.description': '用代码武装你的坦克，战斗吧！',
    'tankwar.collaborator': '龚业勤',
  },
  'zh-Hant': {
    'tankwar.name': 'AI 坦克大戰',
    'tankwar.description': '用代碼武裝你的坦克，戰鬥吧！',
    'tankwar.collaborator': '龔業勤',
  },
});

export default {
  version,
  sortIndex: 10001, // 1xxxx 个人作品组
  image: featureImage, // 主题图片
  name: (
    <Text
      id="tankwar.name"
      defaultMessage="AI Tank War"
    />
  ),
  description: (
    <Text
      id="tankwar.description"
      defaultMessage="Programming your tank and go battle!"
    />
  ),
  collaborator: (
    <Text
      id="tankwar.collaborator"
      defaultMessage="Yeqin Gong"
    />
  ),
  blocksRequired: true, // 积木编程，还有其他编程方式
};
