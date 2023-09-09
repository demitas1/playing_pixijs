import * as PIXI from 'pixijs';


export class GameSprite extends PIXI.AnimatedSprite {
  _animations : Record<string, Array<PIXI.Texture>>;
  _velocity : {x: number, y: number};

  constructor(autoupdate=true)
  {
    // NOTE:
    // 1st argument of AnimatedSprite() is
    // textures: PIXI.Texture[] | PIXI.FrameObject[],

    super([PIXI.Texture.EMPTY], autoupdate);

    this._velocity = {x: 0.0, y: 0.0};
  }

  // preset loaded animations from spritesheet
  addAnimations(animations: Record<string, Array<PIXI.Texture>>) {
    this._animations = animations;
  }

  // play preloaded animations
  playAnimation(label: string, restart: boolean=false) {
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

