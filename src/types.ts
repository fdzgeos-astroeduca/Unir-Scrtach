export type ScratchCategory =
  | 'movement'
  | 'looks'
  | 'sound'
  | 'events'
  | 'control'
  | 'sensing'
  | 'operators'
  | 'variables';

export type BlockShape = 'stack' | 'hat' | 'c-block' | 'cap' | 'reporter' | 'boolean';

export interface ScratchBlock {
  id: string;
  category: ScratchCategory;
  text: string;
  shape: BlockShape;
  inputs?: Array<{
    type: 'number' | 'text' | 'dropdown' | 'boolean';
    value: string;
  }>;
  definition: string;
  exampleTitle: string;
  exampleExplanation: string;
  exampleProject: string;
  exampleTip: string;
}

export interface MatchState {
  matchedIds: string[]; // List of block IDs matched successfully in current page
  attempts: number;
  correctCount: number;
  incorrectCount: number;
  selectedBlockId: string | null;
  selectedDefId: string | null;
  shakeBlockId: string | null;
  shakeDefId: string | null;
  activeExampleBlock: ScratchBlock | null;
}
