import * as PIXI from 'pixijs';

// create Application and append its DOM to document
const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
});
document.body.appendChild(app.view as HTMLCanvasElement);

// load game assets and then create the stage
const url = 'images/bunny.png';
PIXI.Assets.load(url).then((texture) => {
  // create sprite
  const bunny = new PIXI.Sprite(texture);
  bunny.x = app.renderer.width / 2;
  bunny.y = app.renderer.height / 2;
  bunny.anchor.x = 0.5;
  bunny.anchor.y = 0.5;

  // Add the bunny to the scene we are building
  app.stage.addChild(bunny);

  // Listen for frame updates
  app.ticker.add(() => {
      // each frame we spin the bunny around a bit
      bunny.rotation += 0.01;
  });
});
