import * as PIXI from 'pixijs';


export interface IScene {
  init: () => Promise<void>;
  start: () => Promise<void>;
  update: () => void;
  onResize: () => void;
  dispose: () => void;
}

// TODO: rename GameStage -> Scene
export type SceneBuilder =
  (stage: PIXI.Container, screen: PIXI.Rectangle) => IScene;
