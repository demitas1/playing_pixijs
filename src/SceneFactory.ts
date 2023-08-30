import * as PIXI from 'pixijs';
import { SceneBuilder } from './IScene';
import { createScene1 } from './Scene1';
import { createScene2 } from './Scene2';


// factory to create derived game stages
export function SceneFactory (name: string) : SceneBuilder {
  switch (name) {
  case 'scene1':
    return createScene1;
  case 'scene2':
    return createScene2;
  default:
    ;
    // throw exception
  }
};
