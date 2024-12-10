class Clock {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.radius = Math.min(this.width, this.height) / 3;
    this.running = true;

    this.pendulumLength = this.radius * 1.2;
    this.pendulumAngle = 0;
    this.pendulumSpeed = 0.05;
  }

  drawClockFace() {
    // Draw clock circle
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = "white";
    this.ctx.fill();
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Draw railroad track
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, this.radius - 10, 0, 2 * Math.PI);
    this.ctx.stroke();

    // Draw minute markers and numbers
    for (let i = 0; i < 60; i++) {
      const angle = (i * Math.PI) / 30;
      const isHourMark = i % 5 === 0;
      const innerRadius = this.radius - (isHourMark ? 30 : 20);
      const outerRadius = this.radius - 10;

      // Draw tick marks
      this.ctx.beginPath();
      this.ctx.moveTo(
        this.centerX + Math.sin(angle) * innerRadius,
        this.centerY - Math.cos(angle) * innerRadius,
      );
      this.ctx.lineTo(
        this.centerX + Math.sin(angle) * outerRadius,
        this.centerY - Math.cos(angle) * outerRadius,
      );
      this.ctx.lineWidth = isHourMark ? 3 : 1;
      this.ctx.stroke();

      // Draw numbers
      if (isHourMark) {
        const numberRadius = this.radius - 45;
        const hourNum = i / 5 === 0 ? 12 : i / 5;
        this.ctx.font = "bold 20px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        const textX = this.centerX + Math.sin(angle) * numberRadius;
        const textY = this.centerY - Math.cos(angle) * numberRadius;
        this.ctx.fillText(hourNum.toString(), textX, textY);
      }
    }

    // Draw logo
    this.ctx.font = "italic bold 24px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.textAlign = "center";
    this.ctx.fillText("isTrav", this.centerX, this.centerY - this.radius * 0.3);
  }

  drawPendulum() {
    // Update pendulum angle
    this.pendulumAngle =
      (Math.sin(Date.now() * this.pendulumSpeed) * Math.PI) / 6;

    // Draw pendulum
    const pendulumX =
      this.centerX + Math.sin(this.pendulumAngle) * this.pendulumLength;
    const pendulumY = this.centerY + this.radius * 1.2;

    this.ctx.beginPath();
    this.ctx.moveTo(this.centerX, this.centerY + this.radius * 0.5);
    this.ctx.lineTo(pendulumX, pendulumY);
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = "black";
    this.ctx.stroke();

    // Draw pendulum bob
    this.ctx.beginPath();
    this.ctx.arc(pendulumX, pendulumY, 20, 0, 2 * Math.PI);
    this.ctx.fillStyle = "gold";
    this.ctx.fill();
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  drawHands() {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();

    // Hour hand
    const hourAngle = ((hours + minutes / 60) * Math.PI) / 6;
    this.drawHand(hourAngle, this.radius * 0.5, 6, "black");

    // Minute hand
    const minuteAngle = ((minutes + seconds / 60) * Math.PI) / 30;
    this.drawHand(minuteAngle, this.radius * 0.7, 4, "black");

    // Second hand
    const secondAngle = ((seconds + milliseconds / 1000) * Math.PI) / 30;
    this.drawHand(secondAngle, this.radius * 0.85, 2, "red");

    // Center dot
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, 5, 0, 2 * Math.PI);
    this.ctx.fillStyle = "black";
    this.ctx.fill();
  }

  drawHand(angle, length, width, color) {
    this.ctx.beginPath();
    this.ctx.lineWidth = width;
    this.ctx.strokeStyle = color;
    this.ctx.moveTo(this.centerX, this.centerY);
    this.ctx.lineTo(
      this.centerX + Math.sin(angle) * length,
      this.centerY - Math.cos(angle) * length,
    );
    this.ctx.stroke();
  }

  update() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawClockFace();
    this.drawPendulum();
    this.drawHands();
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

// Create and start the clock
const clock = new Clock("clockCanvas");
clock.start();
