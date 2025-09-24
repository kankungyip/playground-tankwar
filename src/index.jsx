import './l10n';

import { html2canvas } from '@blockcode/utils';
import { ScratchBlocks, blocksTab, codeReviewTab } from '@blockcode/blocks';

import { CodeReview } from '@blockcode/blocks';
import { TankBlocksEditor } from './components/blocks-editor/blocks-editor';
import { Sidedock } from './components/sidedock/sidedock';

import { defaultProject } from './lib/default-project';

export default {
  onNew() {
    return defaultProject;
  },

  onSave(files) {
    return {
      files: files.map((file) => ({
        id: file.id,
        name: file.name,
        xml: file.xml,
      })),
    };
  },

  async onThumb() {
    const content = document.querySelector('.konvajs-content');
    const canvas = await html2canvas(content);
    return canvas?.toDataURL();
  },

  onUndo(e) {
    if (e instanceof MouseEvent) {
      const workspace = ScratchBlocks.getMainWorkspace();
      workspace?.undo(false);
    }
  },

  onRedo(e) {
    if (e instanceof MouseEvent) {
      const workspace = ScratchBlocks.getMainWorkspace();
      workspace?.undo(true);
    }
  },

  onEnableUndo() {
    const workspace = ScratchBlocks.getMainWorkspace();
    return workspace?.undoStack_ && workspace.undoStack_.length !== 0;
  },

  onEnableRedo() {
    const workspace = ScratchBlocks.getMainWorkspace();
    return workspace?.redoStack_ && workspace.redoStack_.length !== 0;
  },

  tabs: [
    {
      ...blocksTab,
      Content: TankBlocksEditor,
    },
  ].concat(
    DEBUG
      ? {
          ...codeReviewTab,
          Content: () => (
            <CodeReview
              readOnly
              keyName="script"
            />
          ),
        }
      : [],
  ),

  docks: [
    {
      expand: 'right',
      Content: Sidedock,
    },
  ],
};
