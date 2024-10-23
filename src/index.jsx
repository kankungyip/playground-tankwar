import featureImage from './feature.png';
import { version } from '../package.json';

export default {
  version,
  sortIndex: 1001,
  image: featureImage,
  name: 'AI Tank War',
  description: 'Program your tank and go to battle!',
  collaborator: 'Yeqin Gong',
  blocksRequired: true,

  // l10n
  translations: {
    en: {
      name: 'AI Tank War',
      description: 'Program your tank and go to battle!',
      collaborator: 'Yeqin Gong',
    },
    'zh-Hans': {
      name: 'AI 坦克大战',
      description: '编程你的坦克，加入新的战斗！',
      collaborator: '龚业勤',
    },
  },
};
