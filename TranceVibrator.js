class TranceVibrator {
  constructor () {
    if (!navigator.usb) {
      alert("WebUSB unsupported on your browser");
      throw "Error";
    }
    this.balance = [1.00, 0.75];
  }

  async connect () {
    this.trv = await navigator.usb.requestDevice({
      filters: [
        { vendorId: 0x0b49, productId: 0x064f },
      ],
    });
    await this.trv.open();
    await this.trv.selectConfiguration(1);
    await this.trv.claimInterface(0);
    await this.send(0.5, 0.5);
    setTimeout(() => this.send(0, 0), 250);
  }

  setBalance (value) {
    this.balance = value;
  }

  async send (value1, value2) {
    if (this.trv) {
      const value = Math.min(1, this.balance[0] * value1 + this.balance[1] * value2);
      await this.trv.controlTransferOut({
        requestType: "vendor",
        recipient: "interface",
        request: 1,
        value: Math.round(value * 255),
        index: 0,
      });
    }
  }
}
