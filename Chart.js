class Chart {
  constructor (options) {
    this.el = document.createElement("canvas");
    this.el.width = options.width;
    this.el.height = options.height;
    this.max = options.max;
    this.min = options.min;
    this.ctx = this.el.getContext("2d");
    this.ctx.strokeStyle = options.strokeStyle ?? "rgb(0, 0, 0)";
    this.ctx.lineWidth = options.lineWidth ?? 1;
  }
  render (data, ...markers) {
    if (data.length > 1) {
      const min = this.min ?? Math.min(...data);
      const max = this.max ?? Math.max(...data);
      const map = (value) => this.el.height * (1 - (value - min) / (max - min));
      const unit = this.el.width / (data.length - 1);
      this.ctx.clearRect(0, 0, this.el.width, this.el.height);
      this.ctx.beginPath();
      this.ctx.moveTo(0, map(data[0]));
      for (let i = 1; i < data.length; i++) {
        this.ctx.lineTo(unit * i, map(data[i]));
      }
      this.ctx.stroke();
      for (let i = 0; i < markers.length; i++) {
        const y = map(markers[i]);
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.el.width, y);
        this.ctx.stroke();
      }
    }
  }
}
