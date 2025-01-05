import { addLocalesMessages } from '@blockcode/core';

import en from './en.yaml';
import zhHans from './zh-hans.yaml';
import zhHant from './zh-hant.yaml';

// 将本地化信息添加到全局
addLocalesMessages({
  en,
  'zh-Hans': zhHans, // 简体中文
  'zh-Hant': zhHant, // 繁体中文
});
