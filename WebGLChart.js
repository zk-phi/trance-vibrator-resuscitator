class Chart {
  static IDENTITY_VS = `
    precision highp float;
    attribute vec2 pos;
    void main (void) {
      gl_Position = vec4(pos, 0.0, 1.0);
    }
  `;

  constructor (options) {
    this.el = document.createElement("canvas");
    this.el.width = options.width;
    this.el.height = options.height;
    this.max = options.max;
    this.min = options.min;
    this.ctx = this.el.getContext("webgl2", { preserveDrawingBuffer: true });
    this.ctx.getExtension("OES_standard_derivatives");
    this.ctx.initialized = false;
  }

  compileShader (kind, source) {
    const shader = this.ctx.createShader(kind);
    this.ctx.shaderSource(shader, source);
    this.ctx.compileShader(shader);
    if (!this.ctx.getShaderParameter(shader, this.ctx.COMPILE_STATUS)) {
      throw this.ctx.getShaderInfoLog(shader);
    }
    return shader;
  }

  useNewProgram (fragmentShader) {
    const program = this.ctx.createProgram();
    const vs = this.compileShader(this.ctx.VERTEX_SHADER, Chart.IDENTITY_VS);
    const fs = this.compileShader(this.ctx.FRAGMENT_SHADER, fragmentShader);
    this.ctx.attachShader(program, vs);
    this.ctx.attachShader(program, fs);
    this.ctx.linkProgram(program);
    if (!this.ctx.getProgramParameter(program, this.ctx.LINK_STATUS)) {
      throw this.ctx.getProgramInfoLog(program);
    }
    this.ctx.useProgram(program);
    return program;
  }

  bindNewTexture (unit) {
    const texture = this.ctx.createTexture();
    this.bindTexture(texture, unit);
    this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_WRAP_S, this.ctx.CLAMP_TO_EDGE);
    this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_WRAP_T, this.ctx.CLAMP_TO_EDGE);
    this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MIN_FILTER, this.ctx.NEAREST);
    this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MAG_FILTER, this.ctx.NEAREST);
    return texture;
  }

  initializeArrayBuffer () {
    const buf = this.ctx.createBuffer();
    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, buf);
    this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array([
      -1.0, 1.0,
      -1.0, -1.0,
      1.0, 1.0,
      1.0, -1.0,
    ]), this.ctx.STATIC_DRAW);
    return buf;
  }

  setArrayBuffer (prog, attrName) {
    const loc = this.ctx.getAttribLocation(prog, attrName);
    this.ctx.enableVertexAttribArray(loc);
    this.ctx.vertexAttribPointer(loc, 2, this.ctx.FLOAT, false, 0, 0);
  }

  setInt (prog, attrName, value) {
    const loc = this.ctx.getUniformLocation(prog, attrName);
    this.ctx.uniform1i(loc, value);
  }

  setFloat2 (prog, attrName, value1, value2) {
    const loc = this.ctx.getUniformLocation(prog, attrName);
    this.ctx.uniform2f(loc, value1, value2);
  }

  async initialize () {
    this.initializeArrayBuffer();
    const fs = await fetch("./fragment.glsl", { cache: "no-cache" });
    const prog = this.useNewProgram(await fs.text());
    this.setArrayBuffer(prog, "pos");
    this.setInt(prog, "audio", 0);
    this.setFloat2(prog, "resolution", this.el.width, this.el.height);
    this.bindNewTexture(this.ctx.TEXTURE0);
    this.initialized = true;
  }

  render (f32Arr) {
    if (this.initialized && f32Arr.length > 0) {
      const min = this.min ?? Math.min(...f32Arr);
      const max = this.max ?? Math.max(...f32Arr);
      const data = f32Arr.map(v => 1 - (v - min) / (max - min));
      /* bind audio texture */
      this.ctx.texImage2D(
        this.ctx.TEXTURE_2D, 0, this.ctx.R32F,
        data.length, 1, 0,
        this.ctx.RED, this.ctx.FLOAT, data,
      );
      this.ctx.drawArrays(this.ctx.TRIANGLE_STRIP, 0, 4);
      this.ctx.flush();
    }
  }
}