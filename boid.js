let displayImage, img_zero, img_one, img_two, img_three;
let img, img_N, img_S, img_E, img_W, img_NE, img_NW, img_SE, img_SW;
let frameNum = 0;
let lastFrameTime = 0;
const frameInterval = 100;
let amIClose = false;

function preload() {
    displayImg = loadImage('Penguins/TenderBud/walk_S/0.png');
    img = [loadImage('Penguins/TenderBud/walk_S/0.png'), loadImage('Penguins/TenderBud/walk_S/1.png'), loadImage('Penguins/TenderBud/walk_S/2.png'), loadImage('Penguins/TenderBud/walk_S/3.png')];
    img_N = [loadImage('Penguins/TenderBud/walk_N/0.png'), loadImage('Penguins/TenderBud/walk_N/1.png'), loadImage('Penguins/TenderBud/walk_N/2.png'), loadImage('Penguins/TenderBud/walk_N/3.png')];
    img_S = [loadImage('Penguins/TenderBud/walk_S/0.png'), loadImage('Penguins/TenderBud/walk_S/1.png'), loadImage('Penguins/TenderBud/walk_S/2.png'), loadImage('Penguins/TenderBud/walk_S/3.png')];
    img_E = [loadImage('Penguins/TenderBud/walk_E/0.png'), loadImage('Penguins/TenderBud/walk_E/1.png'), loadImage('Penguins/TenderBud/walk_E/2.png'), loadImage('Penguins/TenderBud/walk_E/3.png')];
    img_W = [loadImage('Penguins/TenderBud/walk_W/0.png'), loadImage('Penguins/TenderBud/walk_W/1.png'), loadImage('Penguins/TenderBud/walk_W/2.png'), loadImage('Penguins/TenderBud/walk_W/3.png')];
	img_NE = [loadImage('Penguins/TenderBud/walk_NE/0.png'), loadImage('Penguins/TenderBud/walk_NE/1.png'), loadImage('Penguins/TenderBud/walk_NE/2.png'), loadImage('Penguins/TenderBud/walk_NE/3.png')];
	img_NW = [loadImage('Penguins/TenderBud/walk_NW/0.png'), loadImage('Penguins/TenderBud/walk_NW/1.png'), loadImage('Penguins/TenderBud/walk_NW/2.png'), loadImage('Penguins/TenderBud/walk_NW/3.png')];
	img_SE = [loadImage('Penguins/TenderBud/walk_SE/0.png'), loadImage('Penguins/TenderBud/walk_SE/1.png'), loadImage('Penguins/TenderBud/walk_SE/2.png'), loadImage('Penguins/TenderBud/walk_SE/3.png')];
	img_SW = [loadImage('Penguins/TenderBud/walk_SW/0.png'), loadImage('Penguins/TenderBud/walk_SW/1.png'), loadImage('Penguins/TenderBud/walk_SW/2.png'), loadImage('Penguins/TenderBud/walk_SW/3.png')];
}

class Boid {
    constructor() {
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 4));
        this.acceleration = createVector();
        this.maxForce = 0.2;
        this.maxSpeed = 5;
    }

    edges() {
        if (this.position.x > width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = width;
        }
        if (this.position.y > height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = height;
        }
    }

    align(boids) {
        let perceptionRadius = 25;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < perceptionRadius) {
                steering.add(other.velocity);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    separation(boids) {
        let perceptionRadius = 24;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < perceptionRadius) {
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(d * d);
                steering.add(diff);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    cohesion(boids) {
        let perceptionRadius = 50;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < perceptionRadius) {
                amIClose = true;
                steering.add(other.position);
                total++;
            }

        }
        if (total === 0) {
            amIClose = false;
        }
        if (total > 0) {
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    flock(boids) {
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);

        alignment.mult(alignSlider.value());
        cohesion.mult(cohesionSlider.value());
        separation.mult(separationSlider.value());

        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);

        let angle = this.velocity.heading() * (180 / PI);

        if (angle >= -22.5 && angle < 22.5) {
            img = img_E;
        } else if (angle >= 22.5 && angle < 67.5) {
            img = img_SE;
        } else if (angle >= 67.5 && angle < 112.5) {
            img = img_S;
        } else if (angle >= 112.5 && angle < 157.5) {
            img = img_SW;
        } else if ((angle >= 157.5) || (angle < -157.5)) {
            img = img_W;
        } else if (angle >= -157.5 && angle < -112.5) {
            img = img_NW;
        } else if (angle >= -112.5 && angle < -67.5) {
            img = img_N;
        } else if (angle >= -67.5 && angle < -22.5) {
            img = img_NE;
        }
        this.displayImage = img[frameNum];
        let imageSize = this.displayImage.width * imageSizeSlider.value();
        if (amIClose) {
            strokeWeight(40);
            stroke(255, 0, 0, 50);
            point(this.position.x + (imageSize / 2), this.position.y + (imageSize / 2));
        } else {
            strokeWeight(40);
            stroke(0, 0, 255, 50);
            point(this.position.x + (imageSize / 2), this.position.y + (imageSize / 2));
        }
        point(this.position.x + (imageSize / 2), this.position.y + (imageSize / 2));
        image(this.displayImage, this.position.x, this.position.y, imageSize, imageSize);
        if (millis() - lastFrameTime >= frameInterval) {
            frameNum++;
            if (frameNum > 3) {
                frameNum = 0;
            }
            lastFrameTime = millis();
        }
    }

    show() {}
}