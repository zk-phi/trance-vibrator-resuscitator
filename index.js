const source = new AudioSource();
const devs = [];

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

const valueEl = document.getElementById("value");
async function initDevice (device) {
  await source.initialize(device, "source", 800, 600, {
    onUpdate: (value, statusString) => {
      valueEl.innerHTML = "|".repeat(value[0] * 128) + " " + Math.floor(value[0] * 255);
      devs.forEach(dev => dev.send(value[0], 0));
    }
  });
  const el = document.getElementById("audioDevice");
  el.innerHTML = `${device ? device.label : '音声キャプチャ'} に接続済み`;
}

async function connectVib () {
  const dev = new TranceVibrator();
  await dev.connect();
  devs.push(dev);
}
