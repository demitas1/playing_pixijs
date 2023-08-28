import * as PIXI from 'pixijs';
import { GameStageBase } from './GameStageBase';


export class GameStage implements GameStageBase {
  _app: PIXI.Application;
  _assets: Record<string, any>;
  _bunny: PIXI.Sprite;

  constructor(app: PIXI.Application) {
    this._app = app;
  }

  async init(): Promise<void> {
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

    const texture = this._assets.bunny;
    this._bunny = new PIXI.Sprite(texture);
    this._bunny.x = this._app.renderer.width / 2;
    this._bunny.y = this._app.renderer.height / 2;
    this._bunny.anchor.x = 0.5;
    this._bunny.anchor.y = 0.5;
    this._app.stage.addChild(this._bunny);
  }

  update() {
    this._bunny.rotation += 0.01;
  }
}

