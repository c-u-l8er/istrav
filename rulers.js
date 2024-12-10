class TimeRulers {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.running = true;
  }

  drawRuler(x, y, width, height, currentValue, maxValue, numberStep) {
    // Draw just the border and white fill
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.rect(x, y, width, height);
    this.ctx.fill();
    this.ctx.stroke();

    // Calculate offset based on current value
    const valueOffset = (currentValue / maxValue) * width;
    const centerOffset = width / 2;
    const scrollOffset = centerOffset - valueOffset;

    // Draw markings
    this.ctx.beginPath();
    for (let i = 0; i <= maxValue; i++) {
      const markX = x + scrollOffset + (i / maxValue) * width;

      if (markX >= x && markX <= x + width) {
        // Draw line for every number
        const isNumberMark = i % numberStep === 0;
        const markHeight = isNumberMark ? height / 2 : height / 3;

        this.ctx.moveTo(markX, y);
        this.ctx.lineTo(markX, y + markHeight);

        // Draw numbers only at intervals specified by numberStep
        if (isNumberMark) {
          const value = i === 0 ? maxValue : i;
          this.ctx.font = "12px Arial";
          this.ctx.fillStyle = "black";
          this.ctx.textAlign = "center";
          this.ctx.fillText(value.toString(), markX, y + height - 5);
        }
      }
    }
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    // Draw center indicator
    this.ctx.beginPath();
    this.ctx.moveTo(x + width / 2, y);
    this.ctx.lineTo(x + width / 2, y + height);
    this.ctx.strokeStyle = "red";
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  update() {
    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes();

    const rulerWidth = this.width - 40;
    const rulerHeight = 35;
    const x = 20;

    // Clear with transparent background
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw hour ruler
    this.drawRuler(x, 5, rulerWidth, rulerHeight, hours, 12, 1);

    // Draw minute ruler
    this.drawRuler(x, 5 + rulerHeight, rulerWidth, rulerHeight, minutes, 60, 5);
  }

  start() {
    const animate = () => {
      if (!this.running) return;
      this.update();
      requestAnimationFrame(animate);
    };
    animate();
  }

  stop() {
    this.running = false;
  }
}

// Create and start the rulers
const rulers = new TimeRulers("rulersCanvas");
rulers.start();
