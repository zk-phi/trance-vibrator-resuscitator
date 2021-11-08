const source = new AudioSource();

/* vo をあえて避けるなら -90 と 5000- くらいでいいかも */

async function enumerateDevices () {
  const devices = await AudioSource.getDevices();
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
  await source.initWithDisplayMedia("source", 800, 600);
  document.getElementById("audioDevice").innerHTML = `音声キャプチャに接続済み`;
}

async function initDevice (device) {
  await source.initWithDevice(device, "source", 800, 600);
  document.getElementById("audioDevice").innerHTML = `${device.label} に接続済み`;
}

/* ---- */

const valueEl = document.getElementById("value");
function renderLevel () {
  const value = source.getValue();
  valueEl.innerHTML = "|".repeat(value * 128) + " " + Math.floor(value * 255);
  requestAnimationFrame(renderLevel);
}

let devs = [];

async function connectVib () {
  const dev = new TranceVibrator();
  await dev.connect();
  devs.push(dev);
  renderLevel();
  sendVib();
}

function sendVib () {
  devs.forEach(dev => dev.send(source.getValue(), 0));
  setTimeout(sendVib, 60);
}
