import * as PIXI from 'pixijs';
import { IScene } from './IScene';
import { SceneFactory } from './SceneFactory';


class GameApp extends PIXI.Application {

  _currentScene: IScene = null;

  constructor(options: Partial<PIXI.IApplicationOptions>) {
    super(options);
  }

  async init(): Promise<void> {
    // appned DOM elment for this application
    document.body.style.margin = '0px';
    document.body.appendChild(this.view as HTMLCanvasElement);

    // window resize
    window.addEventListener(
      'resize',
      () => {
        // resize the renderer
        this.renderer.resize(
          window.innerWidth,
          window.innerHeight
        );
        // resize the stage
        if (this._currentScene) {
          this._currentScene.onResize();
        }
      },
      false
    );

    // create initial game stage and start
    this.startScene('scene1');

    // enable update callback
    this.ticker.add(() => {
      this.update();
    });

    // custom event to change stages
    window.addEventListener(
      'sceneEnd',
      (ev: CustomEvent) => {
        // TODO: make better transition mechanism
        console.log(`custom event: ${ev.detail}`);

        if (ev.detail === '(end scene1)') {
          this.startScene('scene2');
        }
        else if (ev.detail === '(end scene2)') {
          this.startScene('scene1');
        }
      },
      false
    );
  }

  // create and start GameScene
  startScene(sceneName: string) {
    const sceneBuilder = SceneFactory(sceneName);
    if (! sceneBuilder) {
      // error
      return;
    }

    if (this._currentScene) {
      const oldScene = this._currentScene;
      this._currentScene = null;
      oldScene.dispose();
    }

    const newScene = sceneBuilder(this.stage, this.screen);
    newScene.init().then(async () => {
      await newScene.start();
      this._currentScene = newScene;
    });

  }

  update() {
    if (this._currentScene) {
      this._currentScene.update();
    }
  }
}


// main
// create Application and append it to document
const app = new GameApp({
  width: window.innerWidth,
  height: window.innerHeight,
});
app.init();
