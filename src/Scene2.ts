import * as PIXI from 'pixijs';
import { IScene } from './IScene';


export class Scene2 implements IScene {
  _stage: PIXI.Container;
  _screen: PIXI.Rectangle;

  _root : PIXI.Container;
  _assets: Record<string, any>;
  _bunny: PIXI.Sprite;
  _tick: number;

  constructor(stage: PIXI.Container, screen: PIXI.Rectangle) {
    this._stage = stage;
    this._screen = screen;
  }

  async init(): Promise<void> {
    this._root = new PIXI.Container();
    this._tick = 0;

    // loading game assets
    PIXI.Assets.addBundle(
      'game-screen',
      {
        bunny: 'images/bunny.png',
      }
    );
    this._assets = await PIXI.Assets.loadBundle('game-screen');
  }

  async start() {
    console.log(this._assets);

    this._stage.addChild(this._root);

    const texture = this._assets.bunny;
    this._bunny = new PIXI.Sprite(texture);
    this._bunny.x = this._screen.width / 2;
    this._bunny.y = this._screen.height / 2;
    this._bunny.anchor.x = 0.5;
    this._bunny.anchor.y = 0.5;
    this._root.addChild(this._bunny);
  }

  onResize() {
    this._bunny.x = this._screen.width / 2;
    this._bunny.y = this._screen.height / 2;
  }

  update() {
    this._tick += 1;
    if (this._tick === 120) {
      const ev = new CustomEvent(
        'sceneEnd',
        {
          detail: '(end scene2)',
        }
      );
      window.dispatchEvent(ev);

      this._tick = 0;
    }
    this._bunny.rotation += 0.01;
    this._bunny.x += 0.1;
  }

  dispose() {
    this._stage.removeChild(this._root);
    this._root.destroy();
  }
}

export function createScene2(stage: PIXI.Container, screen: PIXI.Rectangle) {
  return new Scene2(stage, screen);
}
