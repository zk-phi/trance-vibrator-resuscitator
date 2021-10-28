/* some codes are taken from https://github.com/aka256/joycon-webhid under the MIT License */

class JoyCon {
  static defaultRumbleData = [0x00, 0x01, 0x40, 0x40, 0x00, 0x01, 0x40, 0x40];

  static makeRumbleData (highFreq, highAmp, lowFreq, lowAmp) {
    /* taken from helper.ts::encodeHighFreq */
    const clampedHighFreq = Math.max(41, Math.min(1253, highFreq));
    const encodedHighFreq = (Math.round(Math.log2(clampedHighFreq / 10.0) * 32.0) - 0x60) * 4;

    /* taken from helper.ts::encodeLowFreq */
    const clampedLowFreq = Math.max(41, Math.min(1253, lowFreq))
    const encodedLowFreq = Math.round(Math.log2(clampedLowFreq / 10.0) * 32.0) - 0x40;

    /* taken from helper.ts::encodeHighAmpli */
    const encodedHighAmp = 2 * (
      0 < highAmp && highAmp < 0.012 ? (
        1
      ) : 0.012 <= highAmp && highAmp < 0.112 ? (
        Math.round(4 * Math.log2(highAmp * 110))
      ) : 0.112 <= highAmp && highAmp < 0.225 ? (
        Math.round(16 * Math.log2(highAmp * 17))
      ) : 0.225 <= highAmp && highAmp <= 1 ? (
        Math.round(32 * Math.log2(highAmp * 8.7))
      ) : (
        0
      )
    );

    /* taken from helper.ts::encodeLowAmpli */
    const encodedLowAmp = 64 + Math.floor((
      0 < lowAmp && lowAmp < 0.012 ? (
        1
      ) : 0.012 <= lowAmp && lowAmp < 0.112? (
        Math.round(4 * Math.log2(lowAmp * 110))
      ) : 0.112 <= lowAmp && lowAmp < 0.225 ? (
        Math.round(16 * Math.log2(lowAmp * 17))
      ) : 0.225 <= lowAmp && lowAmp <= 1 ? (
        Math.round(32 * Math.log2(lowAmp * 8.7))
      ) : (
        0
      )
    ) / 2);

    /* taken from event.ts::setRumble */
    const data = [];
    /* left */
    data.push(encodedHighFreq & 0xff);
    data.push(encodedHighAmp + ((encodedHighFreq >> 8) & 0xff));
    data.push(encodedLowFreq + ((encodedLowAmp >> 8) & 0xff));
    data.push(encodedLowAmp & 0xff);
    /* right */
    data.push(encodedHighFreq & 0xff);
    data.push(encodedHighAmp + ((encodedHighFreq >> 8) & 0xff));
    data.push(encodedLowFreq + ((encodedLowAmp >> 8) & 0xff));
    data.push(encodedLowAmp & 0xff);

    return data;
  }

  constructor () {
    if (!navigator.hid) {
      alert("WebHID unsupported on your browser");
      throw "Error";
    }
    this.packetId = 0;
    this.balance = [0.75, 0.50];
  }

  /* taken from event.ts::controlHID */
  async connect () {
    const devs = await navigator.hid.requestDevice({
      filters: [
        { vendorId: 0x057e },
      ],
    });
    if (devs[0].opened) {
      alert("The device is already in use.");
      throw "Error";
    }
    this.joyCon = devs[0];
    await this.joyCon.open();
    await this.sendReport(0x01, JoyCon.defaultRumbleData, 0x48, 0x01); /* Enable rumble */
    await this.send(0.5, 0.5);
    setTimeout(() => this.send(0, 0), 250);
  }

  setBalance (value) {
    this.balance = value;
  }

  async sendReport (reportId, rumbleData, subCommand = 0x00, ...args) {
    if (this.joyCon) {
      /* taken from output_report.ts::writeOutputReport */
      await this.joyCon.sendReport(
        reportId,
        Uint8Array.from([this.packetId++].concat(rumbleData).concat([subCommand]).concat(args))
      );
    }
  }

  async send (value1, value2) {
    const value = Math.min(1, this.balance[0] * value1 + this.balance[1] * value2);
    this.sendReport(0x10, JoyCon.makeRumbleData(160, value, 80, value));
  }
}
