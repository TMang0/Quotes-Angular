import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-leaf-component',
  standalone: true,
  templateUrl: './leaf-component.component.html',
  styleUrls: ['./leaf-component.component.css']
})
export class FallingLeavesComponent implements AfterViewInit {
  @ViewChild('fallingLeaves') fallingLeaves!: ElementRef;

  ngAfterViewInit(): void {
    const leafContainer = this.fallingLeaves.nativeElement;
    const leaves = new LeafScene(leafContainer);
    leaves.init();
    leaves.render();
  }
}


class LeafScene {
  viewport: HTMLElement;
  world: HTMLElement;
  leaves: any[] = [];
  options: any;
  width: number;
  height: number;
  timer = 0;

  constructor(el: HTMLElement) {
    this.viewport = el;
    this.world = document.createElement('div');
    this.options = {
      numLeaves: 20,
      wind: {
        magnitude: 1.2,
        maxSpeed: 21,
        duration: 300,
        start: 0,
        speed: 0,
      },
    };

    this.width = this.viewport.offsetWidth;
    this.height = this.viewport.offsetHeight;
  }

  private _resetLeaf(leaf: any): any {
    leaf.x = this.width * 2 - Math.random() * this.width * 1.75;
    leaf.y = -10;
    leaf.z = Math.random() * 200;

    if (leaf.x > this.width) {
      leaf.x = this.width + 10;
      leaf.y = Math.random() * this.height / 2;
    }

    if (this.timer === 0) {
      leaf.y = Math.random() * this.height;
    }

    leaf.rotation.speed = Math.random() * 10;
    const randomAxis = Math.random();

    if (randomAxis > 0.5) {
      leaf.rotation.axis = 'X';
    } else if (randomAxis > 0.25) {
      leaf.rotation.axis = 'Y';
      leaf.rotation.x = Math.random() * 180 + 90;
    } else {
      leaf.rotation.axis = 'Z';
      leaf.rotation.x = Math.random() * 360 - 180;
      leaf.rotation.speed = Math.random() * 3;
    }

    leaf.xSpeedVariation = Math.random() * 0.8 - 0.4;
    leaf.ySpeed = Math.random() + 1.5;

    return leaf;
  }

  private _updateLeaf(leaf: any): void {
    const leafWindSpeed = this.options.wind.speed(
      this.timer - this.options.wind.start,
      leaf.y
    );

    const xSpeed = leafWindSpeed + leaf.xSpeedVariation;
    leaf.x -= xSpeed;
    leaf.y += leaf.ySpeed;
    leaf.rotation.value += leaf.rotation.speed;

    const t = `translateX(${leaf.x}px) translateY(${leaf.y}px) translateZ(${leaf.z}px) rotate${leaf.rotation.axis}(${leaf.rotation.value}deg)`;
    if (leaf.rotation.axis !== 'X') {
      leaf.el.style.transform = `${t} rotateX(${leaf.rotation.x}deg)`;
    } else {
      leaf.el.style.transform = t;
    }

    if (leaf.x < -10 || leaf.y > this.height + 10) {
      this._resetLeaf(leaf);
    }
  }

  private _updateWind(): void {
    if (this.timer === 0 || this.timer > this.options.wind.start + this.options.wind.duration) {
      this.options.wind.magnitude = Math.random() * this.options.wind.maxSpeed;
      this.options.wind.duration =
        this.options.wind.magnitude * 50 + (Math.random() * 20 - 10);
      this.options.wind.start = this.timer;

      this.options.wind.speed = (t: number, y: number): number => {
        const a =
          (this.options.wind.magnitude / 2) *
          ((this.height - 2 * y) / (3 * this.height));
        return a * Math.sin((2 * Math.PI) / this.options.wind.duration * t) + a;
      };
    }
  }

  init(): void {
    for (let i = 0; i < this.options.numLeaves; i++) {
      const leaf = {
        el: document.createElement('div'),
        x: 0,
        y: 0,
        z: 0,
        rotation: { axis: 'X', value: 0, speed: 0, x: 0 },
        xSpeedVariation: 0,
        ySpeed: 0,
      };

      leaf.el.textContent = '🍃';
      leaf.el.style.position = 'absolute';
      leaf.el.style.fontSize = '24px';
      leaf.el.style.pointerEvents = 'none';

      this._resetLeaf(leaf);
      this.leaves.push(leaf);
      this.world.appendChild(leaf.el);
    }

    this.world.className = 'leaf-scene';
    this.viewport.appendChild(this.world);

    this.world.style.perspective = '400px';

    window.onresize = () => {
      this.width = this.viewport.offsetWidth;
      this.height = this.viewport.offsetHeight;
    };
  }

  render(): void {
    this._updateWind();

    for (const leaf of this.leaves) {
      this._updateLeaf(leaf);
    }

    this.timer++;
    requestAnimationFrame(this.render.bind(this));
  }
}
