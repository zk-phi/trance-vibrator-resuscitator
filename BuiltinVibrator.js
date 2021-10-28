class BuiltinVibrator {
  static reserved = false;

  constructor () {
    if (!navigator.vibrate) {
      alert("Vibration API unsupported on your browser");
      throw "Error";
    }
    this.state = false;
    this.connected = false;
  }

  connect () {
    if (BuiltinVibrator.reserved) {
      alert("Built-in vibrator is already connected.");
      throw "Error";
    }
    BuiltinVibrator.reserved = true;
    this.connected = true;
    this.send(1.0, 1.0);
    setTimeout(() => this.send(0, 0), 250);
  }

  send (value) {
    const newState = value > 0.5 ? true : false;
    if (this.connected && this.state !== newState) {
      navigator.vibrate(newState ? 1000 : 0);
      this.state = newState;
    }
  }
}
