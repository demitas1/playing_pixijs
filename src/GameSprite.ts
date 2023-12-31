import * as PIXI from 'pixijs';


export class GameSprite extends PIXI.AnimatedSprite {
  _animations : Record<string, Array<PIXI.Texture>>;

  constructor(autoupdate=true)
  {
    // NOTE:
    // 1st argument of AnimatedSprite() is
    // textures: PIXI.Texture[] | PIXI.FrameObject[],

    super([PIXI.Texture.EMPTY], autoupdate);
  }

  start(options: Record<string, any>={}) {}

  update(deltaTime: number): void
  {
    super.update(deltaTime);
  }

  // preset loaded animations from spritesheet
  addAnimations(animations: Record<string, Array<PIXI.Texture>>)
  {
    this._animations = animations;
  }

  // play preloaded animations
  playAnimation(label: string, restart: boolean=false)
  {
    if (! this._animations?.[label]) {
      return;
    }

    if (! restart) {
      if (this.textures === this._animations[label]) {
        // do nothing if same animation is already set
        return;
      }
    }
    this.textures = this._animations[label];
    this.play();
  }
}

