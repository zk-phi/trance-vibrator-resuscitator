const FFT_SIZE = 1024;
const EXPONENT = 8;

/* vo をあえて避けるなら -90 と 5000- くらいでいいかも */

async function enumerateDevices () {
  await navigator.mediaDevices.getUserMedia({ audio: true });
  const devices = await navigator.mediaDevices.enumerateDevices();
  const container = document.getElementById("audioDevice");
  container.innerHTML = "";
  devices.forEach(device => {
    if (device.kind !== "audioinput") return;
    const button = document.createElement("button");
    button.onclick = initDevice.bind(null, device);
    button.innerHTML = `${device.label} に接続`;
    container.appendChild(button);
  });
}

async function initCapture () {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: true, /* required to be true by the API spec */
    audio: true,
  });
  await streamInit(stream);
  document.getElementById("audioDevice").innerHTML = `音声キャプチャに接続済み`;
}

async function initDevice (device) {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { deviceId: device.deviceId },
    video: false,
  });
  await streamInit(stream);
  document.getElementById("audioDevice").innerHTML = `${device.label} に接続済み`;
}

let analyserNode;
async function streamInit (stream) {
  const ctx = new AudioContext();
  const source = new MediaStreamAudioSourceNode(ctx, {
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
  analyserNode = new AnalyserNode(ctx, {
    fftSize: FFT_SIZE,
  });
  const dest = new MediaStreamAudioDestinationNode(ctx);
  source.connect(lpfNode).connect(gainNode).connect(analyserNode).connect(dest);
  monitorAudio();
  renderLevel();
  sendVib();
}

let value = 0;
const buf = new Float32Array(FFT_SIZE);
const chart = new Chart({
  width: 640,
  height: 320,
  min: -1,
  max: 1,
  fillStyle: "rgba(0, 0, 0)",
  strokeStyle: "orange",
  lineWidth: 4,
});
chart.initialize();
document.body.appendChild(chart.el);
function monitorAudio () {
  analyserNode.getFloatTimeDomainData(buf);
  const newValue = Math.min(1, (Math.max(...buf) - Math.min(...buf)) / 2);
  if (newValue > value) {
    value = newValue;
  } else {
    value = 0.9 * value + 0.1 * newValue;
  }
  chart.render(buf, value);
  setTimeout(monitorAudio, 30);
}

/* ---- */

const valueEl = document.getElementById("value");
function renderLevel () {
  valueEl.innerHTML = "|".repeat(value * 128) + " " + Math.floor(value * 255);
  requestAnimationFrame(renderLevel);
}

let devs = [];

async function connectVib () {
  const dev = new JoyCon();
  await dev.connect();
  devs.push(dev);
}

function sendVib () {
  devs.forEach(dev => dev.send(value, 0));
  setTimeout(sendVib, 60);
}
