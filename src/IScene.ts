import * as PIXI from 'pixijs';
import { InputState } from './InputState';


export interface IScene {
  init: () => Promise<void>;
  start: () => Promise<void>;
  update: () => void;
  onResize: () => void;
  dispose: () => void;

  attachInputState: (_is : InputState) => void;
}

// TODO: rename GameStage -> Scene
export type SceneBuilder =
  (stage: PIXI.Container, screen: PIXI.Rectangle) => IScene;
