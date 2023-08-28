import * as PIXI from 'pixijs';


class GameStage {
  _app: PIXI.Application;
  _texture: PIXI.Texture;
  _bunny: PIXI.Sprite;

  constructor(app: PIXI.Application) {
    this._app = app;
  }

  async init(): Promise<void> {
    this._texture = await PIXI.Assets.load('images/bunny.png');
  }

  start() {
    this._bunny = new PIXI.Sprite(this._texture);
    this._bunny.x = this._app.renderer.width / 2;
    this._bunny.y = this._app.renderer.height / 2;
    this._bunny.anchor.x = 0.5;
    this._bunny.anchor.y = 0.5;
    this._app.stage.addChild(this._bunny);

    this._app.ticker.add(() => {
      this.update();
    });
  }

  update() {
    this._bunny.rotation += 0.01;
  }
}


// create Application and append its DOM to document
// TODO: body style, set margin = 0px
const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
});
document.body.appendChild(app.view as HTMLCanvasElement);

const stage = new GameStage(app);
stage.init().then(() => {
  stage.start();
});
