import * as PIXI from 'pixijs';
import { IScene } from './IScene';
import { GameSprite } from './GameSprite';
import { InputState, KeyState } from './InputState';

import { CharPlayer } from './CharPlayer';


// TODO: make SceneBase class for basic operations

class Scene1 implements IScene {
  _stage : PIXI.Container;
  _screen : PIXI.Rectangle;

  _root : PIXI.Container;
  _assets : Record<string, any>;
  _tick : number;

  _bunny : PIXI.Sprite;
  _shape : PIXI.Graphics;
  _character : CharPlayer;
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
        tilesetLevel1: 'tilemap/level1_tileset.png',
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
    texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    //texture.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
    this._bunny = new PIXI.Sprite(texture);
    this._bunny.x = this._screen.width / 5;
    this._bunny.y = this._screen.height / 5;
    this._bunny.anchor.x = 0.5;
    this._bunny.anchor.y = 0.5;
    this._bunny.scale.x = 2.0;
    this._bunny.scale.y = 2.0;
    this._bunny.zIndex = 100;
    this._root.addChild(this._bunny);

    // 2. Graphics
    this._shape = new PIXI.Graphics();
    this._shape.beginFill(0x808080);
    this._shape.drawEllipse(
      this._screen.width / 5,
      this._screen.height / 5,
      100,
      50);
    this._shape.zIndex = 0;
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
    this._character = new CharPlayer();
    this._character.start({
      animations: spritesheet.animations,
    });

    this._character.play();
    this._root.addChild(this._character);

    // 5. Tilemap
    // TODO: make tilemap from json
    const baseTileImage = PIXI.BaseTexture.from('tilesetLevel1');
    baseTileImage.scaleMode = PIXI.SCALE_MODES.NEAREST;

    const tile001 = new PIXI.Texture(
      baseTileImage,
      new PIXI.Rectangle(16, 0, 16, 16));

    const sprite001 = new PIXI.Sprite(tile001);
    sprite001.x = 0;
    sprite001.y = 0;
    sprite001.anchor.x = 0.0;
    sprite001.anchor.y = 0.0;
    sprite001.scale.x = 2.0;
    sprite001.scale.y = 2.0;
    sprite001.zIndex = 0;

    const tile002 = new PIXI.Texture(
      baseTileImage,
      new PIXI.Rectangle(32, 0, 16, 16));

    const sprite002 = new PIXI.Sprite(tile002);
    sprite002.x = 32;
    sprite002.y = 0;
    sprite002.anchor.x = 0.0;
    sprite002.anchor.y = 0.0;
    sprite002.scale.x = 2.0;
    sprite002.scale.y = 2.0;
    sprite002.zIndex = 0;

    this._root.addChild(sprite001);
    this._root.addChild(sprite002);

    // TODO:
    // 4. BitmapText
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

    // 1. Sprite
    this._bunny.rotation += Math.PI / 360;
    this._bunny.x = this._screen.width / 5;
    this._bunny.y = this._screen.height / 5;
  }

  dispose() {
    this._stage.removeChild(this._root);
    this._root.destroy();
  }
}

export function createScene1(stage: PIXI.Container, screen: PIXI.Rectangle) {
  return new Scene1(stage, screen);
}
