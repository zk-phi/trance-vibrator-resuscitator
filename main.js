let source = new YouTubeSource();
let started = false;
let devices = [];

const timeEl = document.getElementById("time");
function onUpdate (value, statusString) {
  timeEl.innerHTML = statusString;
  document.body.style.setProperty("--vib1", value[0]);
  document.body.style.setProperty("--vib2", value[1]);
  if (started) {
    devices.forEach(dev => dev.send(value[0], value[1]));
  }
}

source.initialize("N_ATbQLVQjE", "player", RezInfiniteOSTPattern, {
  onLoad: () => {
    document.getElementById("videoStatus").innerHTML = "LOADED";
    source.playMuted(6);
  },
  onUpdate,
});

let sources = [];
async function enumerateSources () {
  sources = [null, ...await AudioSource.getDevices()];
  const select = document.createElement("select");
  select.id = "sourceSelect";
  sources.forEach((dev, ix) => {
    const option = document.createElement("option");
    option.value = ix;
    option.innerHTML = dev ? dev.label : "Capture from another tab (Chrome)";
    select.appendChild(option);
  });
  const button = document.createElement("button");
  button.onclick = initSource;
  button.innerHTML = "CAPTURE";
  const el = document.getElementById("sources");
  el.innerHTML = "";
  el.appendChild(select);
  el.appendChild(document.createTextNode(" "));
  el.appendChild(button);
}

async function initSource () {
  source.destroy();
  source = new AudioSource();
  const device = sources[document.getElementById("sourceSelect").value];
  const width = AudioSource.fftSize;
  const height = window.innerHeight / window.innerWidth * width;
  await source.initialize(device, "player", height, width, { onUpdate });
}

function unmute () {
  try {
    source.unMute();
    document.getElementById("unmute").remove();
  } catch {
    alert("Player not ready. Please refresh this page if it does not load.");
    return;
  }
}

function play () {
  try {
    source.start();
    started = true;
    document.getElementById("setup").remove();
    document.getElementById("monitor").style.display = "block";
  } catch {
    alert("Player not ready. Please refresh this page if it does not load.");
  }
}

async function connect () {
  const Class = {
    tranceVibrator: TranceVibrator,
    joyCon: JoyCon,
    pad: Pad,
    builtin: BuiltinVibrator,
    audio: DebugAudio,
  }[document.getElementById("device").value];
  const balance = {
    default: undefined,
    main: [1, 0],
    sub: [0, 1],
  }[document.getElementById("balance").value];
  const dev = new Class();
  await dev.connect();
  if (balance) dev.setBalance(balance);
  devices.push(dev);
  document.getElementById("deviceCount").innerHTML = devices.length;
}
