import * as PIXI from 'pixijs';


export class GameSprite extends PIXI.AnimatedSprite {
  constructor(
    textures: PIXI.Texture[] | PIXI.FrameObject[],
    autoupdate = true)
  {
    super(textures);
  }
}

