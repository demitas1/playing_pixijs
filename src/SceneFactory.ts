import * as PIXI from 'pixijs';
import { SceneBuilder } from './IScene';
import { createScene1 } from './Scene1';


// factory to create derived game stages
export function SceneFactory (name: string) : SceneBuilder {
  switch (name) {
  case 'scene1':
    return createScene1;
  default:
    ;
    // throw exception
  }
};
