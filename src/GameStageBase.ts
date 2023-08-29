import * as PIXI from 'pixijs';


export interface GameStageBase {
  init: () => Promise<void>;
  start: () => Promise<void>;
  update: () => void;
  onResize: () => void;
  dispose: () => void;
}

export type StageCreator =
  (stage: PIXI.Container, screen: PIXI.Rectangle) => GameStageBase;
