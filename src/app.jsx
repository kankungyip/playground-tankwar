import { locales as blocksLocales, makeMainMenu, codeTab } from '@blockcode/workspace-blocks/app';

/* components */
import BlocksEditor from './components/blocks-editor/blocks-editor';
import Sidebar from './components/sidebar/sidebar';

/* assets */
import defaultProject from './lib/default-project';

/* languages */
import locales from './l10n';

export default function TankwarBlocksWorkspace({ addLocaleData, openProject, useDefaultProject }) {
  addLocaleData(blocksLocales);
  addLocaleData(locales);

  const createProject = () => {
    openProject(Object.assign(defaultProject));
  };
  if (useDefaultProject) {
    createProject();
  }

  const saveProject = (data) => {
    const canvas = document.querySelector('#blockcode-blocks-player');
    return { thumb: canvas.toDataURL() };
  };

  return {
    mainMenu: makeMainMenu({
      createProject,
      openProject,
      saveProject,
    }).slice(0, 2),

    tabs: [
      {
        ...codeTab,
        Content: BlocksEditor,
      },
    ],

    sidebars: [
      {
        expand: 'right',
        Content: Sidebar,
      },
    ],

    pane: false,

    tutorials: false,

    canEditProjectName: true,
  };
}
