class DebugAudio {
  static enabled = false;

  constructor () {
    if (!window.AudioContext) {
      alert("WebAudio unsupported on your browser");
      throw "Error";
    }
    this.connected = false;
  }

  connect () {
    if (DebugAudio.enabled) {
      alert("Audio feedback is already enabled.");
      throw "Error";
    }
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.value = 0;
    osc.connect(gain).connect(ctx.destination);
    osc.type = "square";
    osc.start();
    this.balance = [0.75, 0.50];
    this.osc = osc;
    this.gain = gain;
    this.connected = true;
    DebugAudio.enabled = true;
    this.send(1.0, 1.0);
    setTimeout(() => this.send(0, 0), 250);
  }

  setBalance (value) {
    this.balance = value;
  }

  send (value1, value2) {
    if (this.connected) {
      const value = Math.min(1, this.balance[0] * value1 + this.balance[1] * value2);
      this.gain.gain.value = value * 0.3;
      this.osc.frequency.value = 110 + (110 * value * 0.25);
    }
  }
}
