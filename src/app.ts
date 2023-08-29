import * as PIXI from 'pixijs';
import { GameStageBase, StageCreator } from './GameStageBase';
import { createStage1 } from './Stage1';
import { createStage2 } from './Stage2';


class GameApp extends PIXI.Application {
  _currentStage: GameStageBase = null;

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
        if (this._currentStage) {
          this._currentStage.onResize();
        }
      },
      false
    );

    // create initial game stage and start
    this.startStage(createStage1);

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
          this.startStage(createStage2);
        }
        else if (ev.detail === '(end scene2)') {
          this.startStage(createStage1);
        }
      },
      false
    );
  }

  // create and start GameStage
  // GameStage should have its root Container
  // then App adds GameStage's root to app.stage child
  startStage(createStage: StageCreator) {
    if (this._currentStage) {
      const oldStage = this._currentStage;
      this._currentStage = null;
      oldStage.dispose();
    }

    const newStage = createStage(this.stage, this.screen);
    newStage.init().then(async () => {
      await newStage.start();
      this._currentStage = newStage;
    });
  }

  update() {
    if (this._currentStage) {
      this._currentStage.update();
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
