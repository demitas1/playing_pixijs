import * as PIXI from 'pixijs';


export interface GameStageBase {
  init: () => Promise<void>;
  start: () => Promise<void>;
  update: () => void;
}
