import featureImage from './feature.png';
import { version } from '../package.json';

export default {
  version,
  sortIndex: 1001,
  image: featureImage,
  name: 'AI Tank War',
  description: 'Programming your tank and go battle!',
  collaborator: 'Yeqin Gong',
  blocksRequired: true,

  // l10n
  translations: {
    en: {
      name: 'AI Tank War',
      description: 'Programming your tank and go battle!',
      collaborator: 'Yeqin Gong',
    },
    'zh-Hans': {
      name: 'AI 坦克大战',
      description: '编程你的坦克，加入新战斗！',
      collaborator: '龚业勤',
    },
  },
};
