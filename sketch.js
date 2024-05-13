const flock = [];

let alignSlider, cohesionSlider, separationSlider, imageSizeSlider;
let canvas; 

function setup() {
  canvas = createCanvas(1600, 800); 
  canvas.parent('canvas-container'); 
  alignSlider = createSlider(0, 2, 2, 0.1);
  cohesionSlider = createSlider(0, 2, 1, 0.1);
  separationSlider = createSlider(0, 2, 3, 0.1);
  imageSizeSlider = createSlider(0.05, 2, 0.2, 0.05);
  for (let i = 0; i < 200; i++) {
    flock.push(new Boid());
  }

  canvas.mousePressed(removeClickedBoid);
}

function draw() {
  background(0);
  for (let boid of flock) {
    boid.edges();
    boid.flock(flock);
    boid.update();
  }
}

function removeClickedBoid() {
  for (let i = flock.length - 1; i >= 0; i--) {
    if (dist(mouseX, mouseY, flock[i].position.x, flock[i].position.y) < 30) {
      flock.splice(i, 1);
      break;
    }
  }
}
