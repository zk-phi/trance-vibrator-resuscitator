let player;
let devices = [];
let currentValue = [0, 0];

/* --- youtube player */

/* load youtube js api */
!(function () {
  const script = document.createElement('script');
  script.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(script);
})();

const timeEl = document.getElementById("time");
function monitorPlayerStatus () {
  switch (player.getPlayerState()) {
    case 1:
      const time = player.getCurrentTime();
      currentValue = RezInfiniteOSTPattern(time);
      timeEl.innerHTML = time;
      document.body.style.setProperty("--vib1", currentValue[0]);
      document.body.style.setProperty("--vib2", currentValue[1]);
      break;
    default:
      currentValue = [0, 0];
      timeEl.innerHTML = "(paused)";
      document.body.style.setProperty("--vib1", 0);
      document.body.style.setProperty("--vib2", 0);
  }
  requestAnimationFrame(monitorPlayerStatus);
}

/* this function is called automatically when the iframe_api is ready */
function onYouTubeIframeAPIReady () {
  player = new YT.Player("player", {
    videoId: "N_ATbQLVQjE",
    playerVars: {
      loop: 1,
      autoplay: 1,
      playsinline: 1,
      enablejsapi: 1,
    },
    events: {
      onReady: function () {
        document.getElementById("videoStatus").innerHTML = "LOADED";
        player.setVolume(0);
        player.setLoop(true);
        player.seekTo(6);
        player.playVideo();
        monitorPlayerStatus();
      },
    },
  });
}

/* --- entrypoint */

function unmute () {
  if (!player) {
    alert("Video is not loaded. Please refresh this page if it does not load.");
    return;
  }
  player.unMute();
  player.setVolume(100);
  document.getElementById("unmute").remove();
}

function play () {
  if (!player) {
    alert("Video is not loaded. Please refresh this page if it does not load.");
    return;
  }
  player.seekTo(0);
  player.unMute();
  player.setVolume(100);
  setInterval(() => devices.forEach(dev => dev.send(currentValue[0], currentValue[1])), 30);
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
