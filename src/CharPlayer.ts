import * as PIXI from 'pixijs';
import { GameSprite } from './GameSprite';
import { InputState, KeyState } from './InputState';


export class CharPlayer extends GameSprite {
  _velocity : {
    x: number,
    y:number
  };

  constructor(autoupdate=true) {
    super(autoupdate);

    this._velocity = {x: 0.0, y: 0.0};
  }

  start(options: Record<string, any>) {
    this.addAnimations(options.animations);
    this.animationSpeed = 0.1;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.x = 100;
    this.y = 100;
    this.zIndex = 10;
  }

  update(deltaTime: number): void
  {
    super.update(deltaTime);

    let x_dir = 0;
    let y_dir = 0;
    if (InputState.getKeyState('a') == KeyState.Down) {
      x_dir = -1;
    } else if (InputState.getKeyState('d') == KeyState.Down) {
      x_dir = 1;
    }
    if (InputState.getKeyState('w') == KeyState.Down) {
      y_dir = -1;
    } else if (InputState.getKeyState('s') == KeyState.Down) {
      y_dir = 1;
    }

    // TODO: diagonal move
    if (x_dir < 0) {
      this.x -= 1;
      this._velocity.x = -1.0;
      this._velocity.y = 0.0;
      this.playAnimation("run_left");
    } else if (x_dir > 0) {
      this.x += 1;
      this._velocity.x = 1.0;
      this._velocity.y = 0.0;
      this.playAnimation("run_right");
    } else if (y_dir < 0) {
      this.y -= 1;
      this._velocity.x = 0.0;
      this._velocity.y = -1.0;
      this.playAnimation("run_up");
    } else if (y_dir > 0) {
      this.y += 1;
      this._velocity.x = 0.0;
      this._velocity.y = 1.0;
      this.playAnimation("run_down");
    }

    // TODO: diagonal rest
    if (x_dir === 0 && y_dir === 0) {
      if (this._velocity.x < 0) {
        this.playAnimation("rest_left");
      } else if (this._velocity.x > 0) {
        this.playAnimation("rest_right");
      } else if (this._velocity.y < 0) {
        this.playAnimation("rest_up");
      } else {
        this.playAnimation("rest_down");
      }
    }
  }
}
