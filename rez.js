let source = new YouTubeSource();
let started = false;
let devices = [];

/* --- youtube player */

const timeEl = document.getElementById("time");
source.initialize("N_ATbQLVQjE", "player", RezInfiniteOSTPattern, {
  onLoad: () => {
    document.getElementById("videoStatus").innerHTML = "LOADED";
    source.playMuted(6);
  },
  onUpdate: (value, statusString) => {
    timeEl.innerHTML = statusString;
    document.body.style.setProperty("--vib1", value[0]);
    document.body.style.setProperty("--vib2", value[1]);
    if (started) {
      devices.forEach(dev => dev.send(value[0], value[1]));
    }
  },
});

/* --- entrypoint */

function unmute () {
  if (!player) {
    alert("Video is not loaded. Please refresh this page if it does not load.");
    return;
  }
  source.unMute();
  document.getElementById("unmute").remove();
}

function play () {
  if (!player) {
    alert("Video is not loaded. Please refresh this page if it does not load.");
    return;
  }
  source.start();
  started = true;
  document.getElementById("setup").remove();
  document.getElementById("monitor").style.display = "block";
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
