import * as PIXI from 'pixijs';
import { IScene } from './IScene';

// TODO: make SceneBase class for basic operations

class Scene1 implements IScene {
  _stage : PIXI.Container;
  _screen : PIXI.Rectangle;

  _root : PIXI.Container;
  _assets : Record<string, any>;
  _tick : number;

  _bunny : PIXI.Sprite;
  _shape : PIXI.Graphics;
  _character : PIXI.AnimatedSprite;
  _spritesheet : Record<string, any>;

  constructor(stage: PIXI.Container, screen: PIXI.Rectangle) {
    this._stage = stage;
    this._screen = screen;
  }

  async init(): Promise<void> {
    this._root = new PIXI.Container();
    this._root.sortableChildren = true;  // enable zIndex
    this._tick = 0;

    // loading game assets (spritesheet)
    // TODO: confirm workflow to generate spritesheet json
    console.log('scene1: load start.');
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
    this._bunny.zIndex = 10;
    this._root.addChild(this._bunny);

    // 2. Graphics
    this._shape = new PIXI.Graphics();
    this._shape.beginFill(0x808080);
    this._shape.drawEllipse(
      this._screen.width / 2,
      this._screen.height / 2,
      100,
      50);
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
    // spritesheet
    const spritesheet = new PIXI.Spritesheet(
      this._assets.playerTexture,
      this._spritesheet as PIXI.ISpritesheetData);
    await spritesheet.parse();

    this._character = new PIXI.AnimatedSprite(
      spritesheet.animations.rest_down);
    this._root.addChild(this._character);
    this._character.animationSpeed = 0.1;
    this._character.play();
    this._character.anchor.x = 0.5;
    this._character.anchor.y = 0.5;
    this._character.x = 100;
    this._character.y = this._screen.height / 2;

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
    this._tick += 1;
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

    // 1. Sprite
    this._bunny.rotation += Math.PI / 360;
    this._bunny.x = this._screen.width / 2;
    this._bunny.y = this._screen.height / 2;
  }

  dispose() {
    this._stage.removeChild(this._root);
    this._root.destroy();
  }
}

export function createScene1(stage: PIXI.Container, screen: PIXI.Rectangle) {
  return new Scene1(stage, screen);
}
