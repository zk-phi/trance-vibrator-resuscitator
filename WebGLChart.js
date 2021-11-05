class Chart {
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

  buildProgram (vertexShader, fragmentShader) {
    const program = this.ctx.createProgram();
    const vs = this.compileShader(this.ctx.VERTEX_SHADER, vertexShader);
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

  useTrivialVertices () {
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

  bindVertices (prog, attrName, vertices) {
    const loc = this.ctx.getAttribLocation(prog, attrName);
    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, vertices);
    this.ctx.enableVertexAttribArray(loc);
    this.ctx.vertexAttribPointer(loc, 2, this.ctx.FLOAT, false, 0, 0);
  }

  useTexture () {
    const texture = this.ctx.createTexture();
    this.ctx.bindTexture(this.ctx.TEXTURE_2D, texture);
    this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_WRAP_S, this.ctx.CLAMP_TO_EDGE);
    this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_WRAP_T, this.ctx.CLAMP_TO_EDGE);
    this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MIN_FILTER, this.ctx.NEAREST);
    this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MAG_FILTER, this.ctx.NEAREST);
    return texture;
  }

  async initialize () {
    const vs = await fetch("./vertex.glsl", { cache: "no-cache" });
    const fs = await fetch("./fragment.glsl", { cache: "no-cache" });
    const prog = this.buildProgram(await vs.text(), await fs.text());
    const vertices = this.useTrivialVertices();
    this.bindVertices(prog, "pos", vertices);
    const audioLoc = this.ctx.getUniformLocation(prog, "audio");
    this.ctx.uniform1i(audioLoc, 0);
    this.audioTexture = this.useTexture();
    const resolutionLoc = this.ctx.getUniformLocation(prog, "resolution");
    this.ctx.uniform2f(resolutionLoc, this.el.width, this.el.height)
    this.initialized = true;
  }

  render (f32Arr) {
    if (this.initialized && f32Arr.length > 0) {
      const min = this.min ?? Math.min(...f32Arr);
      const max = this.max ?? Math.max(...f32Arr);
      const data = f32Arr.map(v => 1 - (v - min) / (max - min));
      /* bind audio texture */
      this.ctx.activeTexture(this.ctx.TEXTURE0);
      this.ctx.bindTexture(this.ctx.TEXTURE_2D, this.audioTexture);
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
