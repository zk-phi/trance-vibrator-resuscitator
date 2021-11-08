class AudioSource {
  static fftSize = 1024;

  static async getDevices () {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    const devs = await navigator.mediaDevices.enumerateDevices();
    return devs.filter(dev => dev.kind === "audioinput");
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

  async initialize (device, elementId, width, height, options = {}) {
    let stream;
    if (device) {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: device.deviceId },
        video: false,
      });
    } else {
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: true, /* required to be true by the API spec */
        audio: true,
      });
    }

    const ctx = new AudioContext();
    this.source = new MediaStreamAudioSourceNode(ctx, {
      mediaStream: stream,
    });
    const lpfNode = new BiquadFilterNode(ctx, {
      type: options.filterType || "lowpass",
      Q: 1,
      frequency: options.filterFreq || 90,
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
      if (options.onUpdate) {
        options.onUpdate([this.value, this.value], "Capturing");
      }
      this.chart.render(this.audioData, this.value, max !== min);
    };
    this.timer = setInterval(monitor, 30);
  }

  unMute () {
  }

  start () {
  }
}
