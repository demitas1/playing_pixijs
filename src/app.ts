import * as PIXI from 'pixijs';
import { GameStageBase } from './GameStageBase';
import { GameStage } from './GameStage';


// create Application and append it to document
const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
});
document.body.style.margin = '0px';
document.body.appendChild(app.view as HTMLCanvasElement);


// create game stage and start
const stage: GameStageBase = new GameStage(app);
stage.init().then(async () => {
  await stage.start();
  app.ticker.add(() => {
    stage.update();
  });
});
