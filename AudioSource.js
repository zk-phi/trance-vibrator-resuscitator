class AudioSource {
  static fftSize = 1024;

  static async getDevices () {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return await navigator.mediaDevices.enumerateDevices();
  }

  constructor () {
    this.value = 0;
    this.audioData = new Float32Array(AudioSource.fftSize);
    this.chart = null;
    this.source = null;
    this.timer = null;
  }

  destroy () {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.source) {
      this.source.mediaStream.getTracks().forEach(track => track.stop());
    }
  }

  async initWithStream (stream, elementId, width, height) {
    const ctx = new AudioContext();
    this.source = new MediaStreamAudioSourceNode(ctx, {
      mediaStream: stream,
    });
    const lpfNode = new BiquadFilterNode(ctx, {
      type: "lowpass",
      Q: 1,
      frequency: 90,
    });
    const gainNode = new GainNode(ctx, {
      gain: 3.5,
    });
    const analyzer = new AnalyserNode(ctx, {
      fftSize: AudioSource.fftSize,
    });
    const dest = new MediaStreamAudioDestinationNode(ctx);
    this.source.connect(lpfNode).connect(gainNode).connect(analyzer).connect(dest);

    this.chart = new Chart(elementId, { min: -1, max: 1, width, height });
    this.chart.initialize();

    const monitor = () => {
      analyzer.getFloatTimeDomainData(this.audioData);
      const max = Math.max(...this.audioData);
      const min = Math.min(...this.audioData);
      const newValue = (max - min) / 2;
      if (newValue > this.value) {
        this.value = newValue;
      } else {
        this.value = 0.9 * this.value + 0.1 * newValue;
      }
      this.chart.render(this.audioData, this.value, max !== min);
    };
    this.timer = setInterval(monitor, 30);
  }

  async initWithDevice (device, elementId, width, height) {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: device.deviceId },
      video: false,
    });
    await this.initWithStream(stream, elementId, width, height);
  }

  async initWithDisplayMedia (elementId, width, height) {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true, /* required to be true by the API spec */
      audio: true,
    });
    await this.initWithStream(stream, elementId, width, height);
  }

  getValue () {
    return this.value;
  }
}
