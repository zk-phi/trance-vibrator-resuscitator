const FFT_SIZE = 256;
const EXPONENT = 4;
const FREQ_RANGE = [0, Math.floor(FFT_SIZE / 100)];

/* ui */

function updateTranceVibratorState () {
  document.getElementById("tranceVibrator").innerHTML = "Trance Vibrator に接続済み";
}

function listDevices (devices) {
  const container = document.getElementById("audioDevice");
  container.innerHTML = "";
  devices.forEach((device) => {
    if (device.kind !== "audioinput") return;
    const button = document.createElement("button");
    button.onclick = streamInit.bind(null, device);
    button.innerHTML = `${device.label} に接続`;
    container.appendChild(button);
  });
}

function updateStreamState (device) {
  document.getElementById("audioDevice").innerHTML = `${device.label} に接続済み`;
}

const valueEl = document.getElementById("vibratorValue");
function updateVibratorValue (value) {
  valueEl.innerHTML = value;
}

const spectrumEl = document.getElementById("spectrum");
function renderSpectrum (arr) {
  spectrumEl.innerHTML = arr.reduce((l, r) => l + "|".repeat(r * r / 255) + "\n", "");
}

function updateRunningState () {
  document.getElementById("run").style.display = "none";
  document.getElementById("status").style.display = "block";
}

/* trance vibrator */

let tranceVibrator;

async function tranceVibratorInit () {
  tranceVibrator = await navigator.usb.requestDevice({
    filters: [
      { vendorId: 0x0b49, productId: 0x064f }
    ]
  });
  await tranceVibrator.open();
  await tranceVibrator.selectConfiguration(1);
  await tranceVibrator.claimInterface(0);
  updateTranceVibratorState();
}

async function tranceVibratorSend (value) {
  if (!tranceVibrator) return;
  await tranceVibrator.controlTransferOut({
    requestType: "vendor",
    recipient: "interface",
    request: 1,
    value: value,
    index: 0,
  });
}

async function sendMax () {
  await tranceVibratorSend(255);
}

async function sendMin () {
  await tranceVibratorSend(0);
}

/* media stream */

let stream;

async function enumerateDevices () {
  await navigator.mediaDevices.getUserMedia({ audio: true })
  const devs = await navigator.mediaDevices.enumerateDevices();
  listDevices(devs);
}

async function streamInit (device) {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: { deviceId: device.deviceId },
    video: false,
  });
  updateStreamState(device);
}

/* entrypoint */

async function run () {
  if (!stream) return;

  const ctx = new AudioContext();
  const sourceNode = ctx.createMediaStreamSource(stream);

  const analyserNode = ctx.createAnalyser();
  analyserNode.fftSize = FFT_SIZE;

  const scriptProcessorNode = ctx.createScriptProcessor(FFT_SIZE, 1, 1);
  const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
  scriptProcessorNode.onaudioprocess = function (e) {
    analyserNode.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = FREQ_RANGE[0]; i < FREQ_RANGE[1]; i++) {
      sum += Math.pow(dataArray[i] / 255, 2);
    }
    const value = Math.round(Math.pow(sum / (FREQ_RANGE[1] - FREQ_RANGE[0]), EXPONENT) * 255);
    tranceVibratorSend(value);
    updateVibratorValue(value);
    renderSpectrum(dataArray);
  };

  sourceNode.connect(analyserNode);
  analyserNode.connect(scriptProcessorNode);
  scriptProcessorNode.connect(ctx.destination);
  updateRunningState();
}
