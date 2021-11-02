class Pad {
  constructor () {
    if (!navigator.getGamepads) {
      alert("GamePad API unsupported on your browser");
      throw "Error";
    }
    this.balance = [[1, 0], [0, 1]];
    this.pad = null;
  }

  static promptNumber (msg, min, max, initial) {
    const response = prompt(msg, `${initial}`);
    if (response == null) {
      return null;
    }
    const val = Math.floor(Number(response));
    if (min <= val && val <= max) {
      return val;
    }
    Pad.promptNumber("Input value was invalid.\n\n" + msg, min, max);
  }

  connect () {
    const padList = navigator.getGamepads();
    const pads = [];
    for (let i = 0; i < padList.length; i++) {
      if (padList[i] && padList[i].vibrationActuator.type === "dual-rumble") {
        pads.push(padList[i]);
      }
    }
    if (pads.length === 0) {
      alert(
        "No gamepads with vibration support detected.\n" +
        "Make sure that the pad is connected, then push any button and retry."
      );
      throw "Error";
    }
    const ix = Pad.promptNumber(
      "Select gamepad:\n\n" + pads.map((p, ix) => `${ix + 1}: ${p.id}`).join("\n"),
      1,
      pads.length,
      "1"
    );
    if (ix == null) {
      throw "Error"
    }
    this.pad = pads[ix - 1];
    this.send(0.5, 0.5);
    setTimeout(() => this.send(0, 0), 250);
  }

  setBalance (value) {
    this.balance = [value, value];
  }

  send (value1, value2) {
    if (this.pad) {
      const ha = Math.min(1, this.balance[0][0] * value1 + this.balance[0][1] * value2);
      const la = Math.min(1, this.balance[1][0] * value1 + this.balance[1][1] * value2);
      this.pad.vibrationActuator.playEffect("dual-rumble", {
        duration: 1000,
        weakMagnitude: ha,
        strongMagnitude: la,
      });
    }
  }
}
