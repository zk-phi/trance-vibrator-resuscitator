class BuiltinVibrator {
  static reserved = false;

  constructor () {
    if (!navigator.vibrate) {
      alert("Vibration API unsupported on your browser");
      throw "Error";
    }
    this.balance = [1.0, 0.0];
    this.vibrationState = false;
    this.connected = false;
  }

  connect () {
    if (BuiltinVibrator.reserved) {
      alert("Built-in vibrator is already enabled.");
      throw "Error";
    }
    BuiltinVibrator.reserved = true;
    this.connected = true;
    this.send(1.0, 1.0);
    setTimeout(() => this.send(0, 0), 250);
  }

  setBalance (value) {
    this.balance = value;
  }

  send (value1, value2) {
    const value = Math.min(1, this.balance[0] * value1 + this.balance[1] * value2);
    const newState = value > 0.5 ? true : false;
    if (this.connected && this.vibrationState !== newState) {
      navigator.vibrate(newState ? 1000 : 0);
      this.vibrationState = newState;
    }
  }
}
