class DebugAudio {
  static enabled = false;

  constructor () {
    if (!window.AudioContext) {
      alert("WebAudio unsupported on your browser");
      throw "Error";
    }
    this.balance = [[0, 1], [1, 0]];
    this.connected = false;
  }

  connect () {
    if (DebugAudio.enabled) {
      alert("Audio feedback is already enabled.");
      throw "Error";
    }
    const ctx = new AudioContext();
    const oscL = new OscillatorNode(ctx, {
      type: "square",
    });
    const oscR = new OscillatorNode(ctx, {
      type: "square",
    });
    const panL = new StereoPannerNode(ctx, {
      pan: -1,
    });
    const panR = new StereoPannerNode(ctx, {
      pan: 1,
    });
    const gainL = new GainNode(ctx, {
      gain: 0,
    });
    const gainR = new GainNode(ctx, {
      gain: 0,
    });
    oscL.connect(panL).connect(gainL).connect(ctx.destination);
    oscR.connect(panR).connect(gainR).connect(ctx.destination);
    oscL.start();
    oscR.start();
    this.osc = [oscL, oscR];
    this.gain = [gainL, gainR];
    DebugAudio.enabled = true;
    this.send(1.0, 1.0);
    setTimeout(() => this.send(0, 0), 250);
  }

  setBalance (value) {
    this.balance = [value, value];
  }

  send (value1, value2) {
    if (this.osc) {
      const valueL = Math.min(1, this.balance[1][0] * value1 + this.balance[1][1] * value2);
      const valueR = Math.min(1, this.balance[0][0] * value1 + this.balance[0][1] * value2);
      this.gain[0].gain.value = valueL * 0.3;
      this.osc[0].frequency.value = 100 + (100 * valueL * 0.15);
      this.gain[1].gain.value = valueR * 0.3;
      this.osc[1].frequency.value = 200 + (200 * valueR * 0.15);
    }
  }
}
