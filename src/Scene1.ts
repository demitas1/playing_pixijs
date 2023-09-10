import * as PIXI from 'pixijs';
import { IScene } from './IScene';
import { KeyState, InputState } from './InputState';
import { GameSprite } from './GameSprite';


// TODO: make SceneBase class for basic operations

class Scene1 implements IScene {
  _stage : PIXI.Container;
  _screen : PIXI.Rectangle;

  _root : PIXI.Container;
  _assets : Record<string, any>;
  _tick : number;

  _inputState : InputState;

  _bunny : PIXI.Sprite;
  _shape : PIXI.Graphics;
  _character : GameSprite;
  _spritesheet : Record<string, any>;

  constructor(stage: PIXI.Container, screen: PIXI.Rectangle) {
    this._stage = stage;
    this._screen = screen;
  }

  async init(): Promise<void> {
    this._root = new PIXI.Container();
    this._root.sortableChildren = true;  // enable zIndex
    this._tick = 0;

    console.log('scene1: load start.');

    // loading game assets (spritesheet)
    // TODO: confirm workflow to generate spritesheet json
    const urlSprite = 'animation/anime_frame.json';
    this._spritesheet = await (await fetch(urlSprite)).json();
    console.log(this._spritesheet);
    // TODO: resolve path from urlSprite
    const spriteTexture = 'animation/' + this._spritesheet.meta.image;

    // loading game assets
    PIXI.Assets.addBundle(
      'game-screen',
      {
        bunny: 'images/bunny.png',
        font1: 'fonts/Orbitron-VariableFont_wght.woff',
        playerTexture: spriteTexture,
      }
    );
    this._assets = await PIXI.Assets.loadBundle('game-screen');

    console.log('scene1: load complete.');
  }

  async start() {
    console.log('scene1: start.');

    this._stage.addChild(this._root);

    // explore pixiJS display objects
    // 1. Sprite
    const texture = this._assets.bunny;
    this._bunny = new PIXI.Sprite(texture);
    this._bunny.x = this._screen.width / 2;
    this._bunny.y = this._screen.height / 2;
    this._bunny.anchor.x = 0.5;
    this._bunny.anchor.y = 0.5;
    this._bunny.zIndex = 0;
    this._root.addChild(this._bunny);

    // 2. Graphics
    this._shape = new PIXI.Graphics();
    this._shape.beginFill(0x808080);
    this._shape.drawEllipse(
      this._screen.width / 2,
      this._screen.height / 2,
      100,
      50);
    this._shape.zIndex = 10;
    this._root.addChild(this._shape);

    // 3. Text
    const text1 = new PIXI.Text(
      'TrueType: Orbitron',
      new PIXI.TextStyle({
        fontFamily: 'Orbitron',
        fill: ['#cccccc'],
        fontSize: 30,
        fontWeight: '800',
      }));
    this._root.addChild(text1);

    // 6. AnimatedSprite
    // TODO: new class to manage multiple animation
    //
    //   this._assets.playerTexture : sprite texture
    //   this._spritesheet : json to define animation
    //
    const spritesheet = new PIXI.Spritesheet(
      this._assets.playerTexture,
      this._spritesheet as PIXI.ISpritesheetData);
    await spritesheet.parse();

    for (const k in spritesheet.animations) {
      console.log(`animation ${k}`);
    }

    // create character sprite
    this._character = new GameSprite();
    this._character.addAnimations(spritesheet.animations);

    this._character.animationSpeed = 0.1;
    this._character.play();
    this._character.anchor.x = 0.5;
    this._character.anchor.y = 0.5;
    this._character.x = 100;
    this._character.y = this._screen.height / 2;
    this._shape.zIndex = -10;
    this._root.addChild(this._character);

    // TODO:
    // 4. BitmapText
    // 5. Tilemap / Tileset
  }

  onResize() {
    // 2. Graphics
    this._shape.beginFill(0x000000);
    this._shape.drawRect(
      0, 0, this._screen.width, this._screen.height);
    this._shape.beginFill(0x808080);
    this._shape.drawEllipse(
      this._screen.width / 2,
      this._screen.height / 2,
      100,
      50);
  }

  update() {
    this._tick++;
    if (this._tick === 60) {
      const ev = new CustomEvent(
        'sceneEnd',
        {
          detail: '(end scene1)',
        }
      );
      //window.dispatchEvent(ev);

      this._tick = 0;
    }

    if (! this._inputState) {
      console.log('input state is not ready.');
      return;
    }

    // 1. Sprite
    this._bunny.rotation += Math.PI / 360;
    this._bunny.x = this._screen.width / 2;
    this._bunny.y = this._screen.height / 2;

    let x_dir = 0;
    let y_dir = 0;
    if (this._inputState.getKeyState('a') == KeyState.Down) {
      x_dir = -1;
    } else if (this._inputState.getKeyState('d') == KeyState.Down) {
      x_dir = 1;
    }
    if (this._inputState.getKeyState('w') == KeyState.Down) {
      y_dir = -1;
    } else if (this._inputState.getKeyState('s') == KeyState.Down) {
      y_dir = 1;
    }

    // TODO: diagonal move
    if (x_dir < 0) {
      this._character.x -= 1;
      this._character._velocity.x = -1.0;
      this._character._velocity.y = 0.0;
      this._character.playAnimation("run_left");
    } else if (x_dir > 0) {
      this._character.x += 1;
      this._character._velocity.x = 1.0;
      this._character._velocity.y = 0.0;
      this._character.playAnimation("run_right");
    } else if (y_dir < 0) {
      this._character.y -= 1;
      this._character._velocity.x = 0.0;
      this._character._velocity.y = -1.0;
      this._character.playAnimation("run_up");
    } else if (y_dir > 0) {
      this._character.y += 1;
      this._character._velocity.x = 0.0;
      this._character._velocity.y = 1.0;
      this._character.playAnimation("run_down");
    }

    // TODO: diagonal rest
    if (x_dir === 0 && y_dir === 0) {
      if (this._character._velocity.x < 0) {
        this._character.playAnimation("rest_left");
      } else if (this._character._velocity.x > 0) {
        this._character.playAnimation("rest_right");
      } else if (this._character._velocity.y < 0) {
        this._character.playAnimation("rest_up");
      } else {
        this._character.playAnimation("rest_down");
      }
    }
  }

  dispose() {
    this._stage.removeChild(this._root);
    this._root.destroy();
  }

  attachInputState(_is: InputState) {
    this._inputState  = _is;
  };
}

export function createScene1(stage: PIXI.Container, screen: PIXI.Rectangle) {
  return new Scene1(stage, screen);
}
