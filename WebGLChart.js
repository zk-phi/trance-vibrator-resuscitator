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

  useNewProgram (vertexShader, fragmentShader) {
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

  bindNewTexture (unit) {
    const texture = this.ctx.createTexture();
    this.bindTexture(texture, unit);
    this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_WRAP_S, this.ctx.CLAMP_TO_EDGE);
    this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_WRAP_T, this.ctx.CLAMP_TO_EDGE);
    this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MIN_FILTER, this.ctx.NEAREST);
    this.ctx.texParameteri(this.ctx.TEXTURE_2D, this.ctx.TEXTURE_MAG_FILTER, this.ctx.NEAREST);
    return texture;
  }

  bindTexture (texture, unit) {
    if (unit) {
      this.ctx.activeTexture(unit);
    }
    this.ctx.bindTexture(this.ctx.TEXTURE_2D, texture);
  }

  bindNewFrameBuffer () {
    const buf = this.ctx.createFramebuffer();
    this.ctx.bindFramebuffer(this.ctx.FRAMEBUFFER, buf);
    return buf;
  }

  bindNewRenderBuffer () {
    const buf = this.ctx.createRenderbuffer();
    this.ctx.bindRenderbuffer(this.ctx.RENDERBUFFER, buf);
    this.ctx.renderbufferStorage(
      this.ctx.RENDERBUFFER,
      this.ctx.DEPTH_COMPONENT16,
      this.el.width, this.el.height
    );
    return buf;
  }

  bindNewFrame () {
    const ret = {
      frame: this.bindNewFrameBuffer(),
      texture: this.bindNewTexture(),
    };
    this.ctx.texImage2D(
      this.ctx.TEXTURE_2D, 0, this.ctx.RGBA,
      this.el.width, this.el.height, 0,
      this.ctx.RGBA, this.ctx.UNSIGNED_BYTE, null,
    );
    this.ctx.framebufferTexture2D(
      this.ctx.FRAMEBUFFER,
      this.ctx.COLOR_ATTACHMENT0,
      this.ctx.TEXTURE_2D,
      ret.texture, 0,
    );
    return ret;
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

  setFloat (prog, attrName, value) {
    const loc = this.ctx.getUniformLocation(prog, attrName);
    this.ctx.uniform1f(loc, value);
  }

  setFloat2 (prog, attrName, value1, value2) {
    const loc = this.ctx.getUniformLocation(prog, attrName);
    this.ctx.uniform2f(loc, value1, value2);
  }

  async initialize () {
    this.initializeArrayBuffer();
    this.buffers = [this.bindNewFrame(), this.bindNewFrame()];
    this.audioTexture = this.bindNewTexture();
    const identityVs = await (await fetch("./identity.vs", { cache: "no-cache" })).text();
    const bufferFs = await (await fetch("./buffer.fs", { cache: "no-cache" })).text();
    const screenFs = await (await fetch("./screen.fs", { cache: "no-cache" })).text();
    this.bufferProg = this.useNewProgram(identityVs, bufferFs);
    this.setArrayBuffer(this.bufferProg, "pos");
    this.setInt(this.bufferProg, "audio", 0);
    this.setInt(this.bufferProg, "backbuffer", 1);
    this.setFloat2(this.bufferProg, "resolution", this.el.width, this.el.height);
    this.screenProg = this.useNewProgram(identityVs, screenFs);
    this.setArrayBuffer(this.bufferProg, "pos");
    this.setInt(this.screenProg, "texture", 0);
    this.setFloat2(this.screenProg, "resolution", this.el.width, this.el.height);
    this.initialized = true;
  }

  render (f32Arr, value) {
    if (this.initialized && f32Arr.length > 0) {
      const min = this.min ?? Math.min(...f32Arr);
      const max = this.max ?? Math.max(...f32Arr);
      const data = f32Arr.map(v => 1 - (v - min) / (max - min));
      /* render to buffer */
      this.ctx.useProgram(this.bufferProg);
      this.bindTexture(this.audioTexture, this.ctx.TEXTURE0);
      this.ctx.texImage2D(
        this.ctx.TEXTURE_2D, 0, this.ctx.R32F,
        data.length, 1, 0,
        this.ctx.RED, this.ctx.FLOAT, data,
      );
      this.bindTexture(this.buffers[0].texture, this.ctx.TEXTURE1);
      this.ctx.bindFramebuffer(this.ctx.FRAMEBUFFER, this.buffers[1].frame);
      this.ctx.drawArrays(this.ctx.TRIANGLE_STRIP, 0, 4);
      /* render to canvas */
      this.ctx.useProgram(this.screenProg);
      this.bindTexture(this.buffers[1].texture, this.ctx.TEXTURE0);
      this.setFloat(this.screenProg, "value", value);
      this.ctx.bindFramebuffer(this.ctx.FRAMEBUFFER, null);
      this.ctx.drawArrays(this.ctx.TRIANGLE_STRIP, 0, 4);
      /* swap buffers */
      const tmp = this.buffers[0];
      this.buffers[0] = this.buffers[1];
      this.buffers[1] = tmp;
    }
  }
}
