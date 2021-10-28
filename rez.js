let player;
let devices = [];

/* --- youtube player */

/* load youtube js api */
!(function () {
  const script = document.createElement('script');
  script.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(script);
})();

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
      },
    },
  });
}

/* --- devices */

async function connectTrv (balance) {
  const trv = new TranceVibrator();
  await trv.connect();
  if (balance) trv.setBalance(balance);
  devices.push(trv);
  document.getElementById("deviceCount").innerHTML = devices.length;
}

async function connectJoyCon (balance) {
  const joyCon = new JoyCon();
  await joyCon.connect();
  if (balance) joyCon.setBalance(balance);
  devices.push(joyCon);
  document.getElementById("deviceCount").innerHTML = devices.length;
}

function enableVib () {
  const vib = new BuiltinVibrator();
  vib.connect();
  devices.push(vib);
  document.getElementById("deviceCount").innerHTML = devices.length;
  document.getElementById("vibStatus").innerHTML = "ENABLED";
}

/* --- songs */

function withBPM (bpm, arr) {
  return (time) => arr[Math.floor(time * bpm * 4 / 60)] || 0;
}

const track1a = withBPM(140, [
  /* kick: 1.00 0.50 */
  /* 1                    2                       3                       4                   */
  0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00,
  0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00,
  0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00,
  0.75, 0.50, 0.75, 0.50, 0.75, 0.50, 0.75, 0.50, 0.75, 0.50, 0.75, 0.50, 0.75, 0.50, 0.75, 0.50,
  1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00,
  1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00,
  1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00,
  1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.50,
  1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00,
  1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00,
  1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00,
  1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.50, 1.00, 0.50, 1.00, 0.50, 1.00, 0.50, 1.00, 0.50,
  1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00,
]);

const track1b = withBPM(140, [
  /* synth: 0.50 0.75 1.00 */
  /* 1                    2                       3                       4                   */
  0.50, 0.75, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.50, 0.75, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00,
  0.50, 0.75, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.50, 0.75, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00,
  0.50, 0.75, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.50, 0.75, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00,
  0.50, 0.75, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.50, 0.75, 1.00, 0.50, 1.00, 0.50, 1.00, 0.50,
  0.75, 1.00, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.50, 0.75, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00,
  0.50, 0.75, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.50, 0.75, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00,
  0.50, 0.75, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.50, 0.75, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00,
  0.50, 0.75, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.50, 0.75, 1.00, 0.00, 0.00, 0.00, 1.00, 0.00,
  0.50, 0.75, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.50, 0.75, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00,
  0.50, 0.75, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.50, 0.75, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00,
  0.50, 0.75, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.50, 0.75, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00,
  0.50, 0.75, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.50, 0.75, 1.00, 0.50, 1.00, 0.50, 1.00, 0.50,
  0.75, 1.00, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.50, 0.75, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00,
]);

const track2a = withBPM(142, [
  /* base kick pattern: 1.00 0.50 */
  /* 1                    2                       3                       4                   */
  1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00,
  1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00,
  1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00,
  1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00,
  1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00,
  1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00,
  1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00,
  1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00,
  1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00,
  1.00, 0.50, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00,
]);

const track2b = withBPM(142, [
  /* 1                    2                       3                       4                   */
  1.00, 0.50, 0.25, 1.00, 0.50, 0.00, 0.25, 0.25, 0.00, 0.00, 0.25, 0.25, 0.00, 0.00, 0.25, 0.25,
  1.00, 0.50, 0.25, 1.00, 0.50, 0.00, 0.25, 0.25, 0.00, 0.00, 0.25, 0.25, 0.00, 0.00, 0.25, 0.25,
  1.00, 0.50, 0.25, 1.00, 0.50, 0.00, 0.25, 0.25, 0.00, 0.00, 0.25, 0.25, 0.00, 0.00, 0.25, 0.25,
  1.00, 0.50, 0.25, 1.00, 0.50, 0.00, 0.25, 0.25, 0.00, 0.00, 0.25, 0.25, 0.00, 0.00, 0.25, 0.25,
  1.00, 0.50, 0.25, 1.00, 0.50, 0.00, 0.25, 0.25, 0.00, 0.00, 0.25, 0.25, 0.00, 0.00, 0.25, 0.25,
  1.00, 0.50, 0.25, 1.00, 0.50, 0.00, 0.25, 0.25, 0.00, 0.00, 0.25, 0.25, 0.00, 0.00, 0.25, 0.25,
  1.00, 0.50, 0.25, 1.00, 0.50, 0.00, 0.25, 0.25, 0.00, 0.00, 0.25, 0.25, 0.00, 0.00, 0.25, 0.25,
  1.00, 0.50, 0.25, 1.00, 0.50, 0.00, 0.25, 0.25, 0.00, 0.00, 0.25, 0.25, 0.00, 0.00, 0.25, 0.25,
  1.00, 0.50, 0.25, 1.00, 0.50, 0.00, 0.25, 0.25, 0.00, 0.00, 0.25, 0.25, 0.00, 0.00, 0.25, 0.25,
  1.00, 0.50, 0.25, 1.00, 0.50, 0.00, 0.25, 0.25,
]);

const track3a = withBPM(138, [
  /* base kick pattern: 1.00 */
  /* 1                    2                       3                       4                   */
  1.00, 0.00, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.00, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00,
  1.00, 0.00, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.00, 0.00, 1.00, 0.50, 0.50, 1.00, 0.00,
  1.00, 0.00, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.00, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00,
  1.00, 0.00, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.00, 0.00, 1.00, 0.50, 0.50, 1.00, 0.00,
  1.00, 0.00, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.00, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00,
  1.00, 0.00, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.00, 0.00, 1.00, 0.50, 0.50, 1.00, 0.00,
  1.00, 0.00, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.00, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00,
  1.00, 0.00, 0.00, 0.00, 1.00, 0.50, 0.00, 0.00, 1.00, 0.00, 0.00, 1.00, 0.50, 0.50, 1.00, 0.00,
]);

const track3b = withBPM(138, [
  /* 1                    2                       3                       4                   */
  0.75, 0.00, 0.00, 0.75, 0.00, 0.00, 0.75, 0.00, 0.40, 0.60, 0.80, 1.00, 0.60, 0.60, 0.60, 0.60,
  0.75, 0.00, 0.00, 0.75, 0.00, 0.00, 0.75, 0.00, 0.40, 0.60, 0.80, 1.00, 0.60, 0.60, 0.60, 0.60,
  0.75, 0.00, 0.00, 0.75, 0.00, 0.00, 0.75, 0.00, 0.40, 0.60, 0.80, 1.00, 0.60, 0.60, 0.60, 0.60,
  0.75, 0.00, 0.00, 0.75, 0.00, 0.00, 0.75, 0.00, 0.40, 0.60, 0.80, 1.00, 0.60, 0.60, 0.60, 0.60,
  0.75, 0.00, 0.00, 0.75, 0.00, 0.00, 0.75, 0.00, 0.40, 0.60, 0.80, 1.00, 0.60, 0.60, 0.60, 0.60,
  0.75, 0.00, 0.00, 0.75, 0.00, 0.00, 0.75, 0.00, 0.40, 0.60, 0.80, 1.00, 0.60, 0.60, 0.60, 0.60,
  0.75, 0.00, 0.00, 0.75, 0.00, 0.00, 0.75, 0.00, 0.40, 0.60, 0.80, 1.00, 0.60, 0.60, 0.60, 0.60,
  0.75, 0.00, 0.00, 0.75, 0.00, 0.00, 0.75, 0.00, 0.40, 0.60, 0.80, 1.00, 0.60, 0.60, 0.60, 0.60,
]);

const track4a = withBPM(140, [
  /* base kick pattern: 1.00 0.75 0.50 0.25 */
  /* 1                    2                       3                       4                   */
  1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 0.25,
  1.00, 0.50, 1.00, 0.50, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 0.25,
  1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 0.25,
  1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 0.25,
  1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 0.25,
  1.00, 0.50, 1.00, 0.50, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 0.25,
  1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 0.25,
  1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 0.25,
  1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 0.25,
  1.00, 0.50, 1.00, 0.50, 0.25, 0.00, 0.00, 0.00,
]);

const track4b = withBPM(140, [
  /* base kick pattern: 1.00 0.75 0.50 0.25 */
  /* 1                    2                       3                       4                   */
  0.00, 1.00, 0.00, 1.00, 0.00, 0.75, 1.00, 0.00, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 1.00,
  0.00, 1.00, 0.00, 1.00, 0.00, 0.75, 1.00, 0.00, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 1.00,
  0.00, 1.00, 0.00, 1.00, 0.00, 0.75, 1.00, 0.00, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 1.00,
  0.00, 1.00, 0.00, 1.00, 0.00, 0.75, 1.00, 0.00, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 1.00,
  0.00, 1.00, 0.00, 1.00, 0.00, 0.75, 1.00, 0.00, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 1.00,
  0.00, 1.00, 0.00, 1.00, 0.00, 0.75, 1.00, 0.00, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 1.00,
  0.00, 1.00, 0.00, 1.00, 0.00, 0.75, 1.00, 0.00, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 1.00,
  0.00, 1.00, 0.00, 1.00, 0.00, 0.75, 1.00, 0.00, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 1.00,
  0.00, 1.00, 0.00, 1.00, 0.00, 0.75, 1.00, 0.00, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 1.00,
  0.00, 0.75, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 0.75, 0.50, 0.25, 0.00,
  0.00, 0.00, 1.00, 1.00, 0.75, 0.50, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 0.75, 0.50, 0.25, 0.00,
  0.00, 0.00, 1.00, 0.75, 0.50, 0.25, 1.00, 0.50, 1.00, 0.75, 0.50, 0.25, 1.00, 0.75, 0.50, 0.25,
]);

const track5a = withBPM(90, [
  /* 1                    2                       3                       4                   */
  1.00, 0.98, 0.96, 0.94, 0.92, 0.90, 0.88, 0.86, 0.84, 0.82, 0.80, 0.78, 0.76, 0.74, 0.72, 0.70,
  0.68, 0.66, 0.64, 0.62, 0.60, 0.58, 0.56, 0.54, 0.52, 0.50, 0.48, 0.46, 0.44, 0.42, 0.40, 0.38,
  0.36, 0.34, 0.32, 0.30, 0.28, 0.26, 0.24, 0.22, 0.20, 0.18, 0.16, 0.14, 0.12, 0.10, 0.08, 0.06,
  0.04, 0.02, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00,
  0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00,
  0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00,
  0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00,
  0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00,
  /* 1                    2                       3                       4                   */
  0.75, 0.25, 0.75, 0.25, 1.00, 0.75, 0.50, 0.25, 0.00, 0.00, 0.00, 0.50, 1.00, 0.75, 0.50, 0.25,
  0.75, 0.25, 0.75, 0.25, 1.00, 0.75, 0.50, 0.25, 0.00, 0.00, 0.00, 0.50, 1.00, 0.75, 0.50, 0.25,
  0.75, 0.25, 0.75, 0.25, 1.00, 0.75, 0.50, 0.25, 0.00, 0.00, 0.00, 0.50, 1.00, 0.75, 0.50, 0.25,
  0.75, 0.25, 0.75, 0.25, 1.00, 0.75, 0.50, 0.25, 0.00, 0.00, 0.00, 0.50, 1.00, 0.75, 0.50, 0.25,
  0.75, 0.25, 0.75, 0.25, 1.00, 0.75, 0.50, 0.25, 0.00, 0.00, 0.00, 0.50, 0.25, 0.00, 0.00, 0.00,
  0.75, 0.25, 0.75, 0.25, 1.00, 0.75, 0.50, 0.25, 0.00, 0.00, 0.00, 0.50, 1.00, 0.75, 0.50, 0.25,
  0.75, 0.25, 0.75, 0.25, 1.00, 0.75, 0.50, 0.25, 0.00, 0.00, 0.00, 0.50, 1.00, 0.75, 0.50, 0.25,
]);

const track5b = withBPM(90, [
  /* 1                    2                       3                       4                   */
  0.80, 0.78, 0.76, 0.74, 0.72, 0.70, 0.68, 0.66, 0.64, 0.62, 0.60, 0.58, 0.56, 0.54, 0.52, 0.50,
  0.48, 0.46, 0.44, 0.42, 0.40, 0.38, 0.36, 0.34, 0.32, 0.30, 0.28, 0.26, 0.24, 0.22, 0.20, 0.18,
  0.80, 0.78, 0.76, 0.74, 0.72, 0.70, 0.68, 0.66, 0.64, 0.62, 0.60, 0.58, 0.56, 0.54, 0.52, 0.50,
  0.48, 0.46, 0.44, 0.42, 0.40, 0.38, 0.36, 0.34, 0.32, 0.30, 0.28, 0.26, 0.24, 0.22, 0.20, 0.18,
  0.80, 0.78, 0.76, 0.74, 0.72, 0.70, 0.68, 0.66, 0.64, 0.62, 0.60, 0.58, 0.56, 0.54, 0.52, 0.50,
  0.48, 0.46, 0.44, 0.42, 0.40, 0.38, 0.36, 0.34, 0.32, 0.30, 0.28, 0.26, 0.24, 0.22, 0.20, 0.18,
  0.80, 0.78, 0.76, 0.74, 0.72, 0.70, 0.68, 0.66, 0.64, 0.62, 0.60, 0.58, 0.56, 0.54, 0.52, 0.50,
  1.00, 0.50, 1.00, 0.50, 0.40, 0.60, 0.80, 1.00, 0.00, 0.75, 0.50, 0.25, 0.75, 0.50, 0.25, 0.00,
  /* 1                    2                       3                       4                   */
  1.00, 0.50, 1.00, 0.50, 0.00, 0.00, 0.00, 0.75, 0.50, 1.00, 0.00, 0.00, 0.00, 0.75, 0.25, 0.50,
  1.00, 0.50, 1.00, 0.50, 0.00, 0.00, 0.00, 0.75, 0.50, 1.00, 0.00, 0.00, 0.00, 0.75, 0.25, 0.50,
  1.00, 0.50, 1.00, 0.50, 0.00, 0.00, 0.00, 0.75, 0.50, 1.00, 0.00, 0.00, 0.00, 0.75, 0.25, 0.50,
  1.00, 0.50, 1.00, 0.50, 0.60, 0.80, 1.00, 0.80, 0.50, 1.00, 0.00, 0.00, 0.00, 0.75, 1.00, 1.00,
  1.00, 0.50, 1.00, 0.50, 0.00, 0.00, 0.00, 0.75, 0.50, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.50,
  1.00, 0.50, 1.00, 0.50, 0.00, 0.00, 0.00, 0.75, 0.50, 1.00, 0.00, 0.00, 0.00, 0.75, 0.25, 0.50,
  1.00, 0.50, 1.00, 0.50, 0.00, 0.00, 0.00, 0.75, 0.50, 1.00, 0.00, 0.00, 0.00, 0.75, 0.25, 0.50,
]);

const track6a = withBPM(133, [
  /* 1                    2                       3                       4                   */
  0.75, 0.50, 0.25, 0.00, 1.00, 0.75, 0.50, 0.25, 0.00, 0.00, 0.75, 0.50, 1.00, 0.75, 0.50, 0.25,
  0.00, 0.00, 0.75, 0.50, 1.00, 0.75, 0.50, 0.25, 0.00, 0.00, 0.75, 0.50, 1.00, 0.75, 0.50, 0.25,
  0.75, 0.50, 0.25, 0.00, 1.00, 0.75, 0.50, 0.25, 0.00, 0.00, 0.75, 0.50, 1.00, 0.75, 0.50, 0.25,
  0.00, 0.00, 0.75, 0.50, 1.00, 0.75, 0.50, 0.25, 0.00, 0.00, 0.75, 0.50, 1.00, 0.50, 1.00, 0.50,
  0.75, 0.50, 0.25, 0.00, 1.00, 0.75, 0.50, 0.25, 0.00, 0.00, 0.75, 0.50, 1.00, 0.75, 0.50, 0.25,
  0.00, 0.00, 0.75, 0.50, 1.00, 0.75, 0.50, 0.25, 0.00, 0.00, 0.75, 0.50, 1.00, 0.75, 0.50, 0.25,
  0.75, 0.50, 0.25, 0.00, 1.00, 0.75, 0.50, 0.25, 0.00, 0.00, 0.75, 0.50, 1.00, 0.75, 0.50, 0.25,
  0.75, 0.50, 1.00, 0.50, 1.00, 0.75, 0.50, 0.25, 0.75, 0.50, 0.75, 0.50, 1.00, 0.50, 1.00, 0.50,
]);

const track6b = withBPM(133, [
  /* 1                    2                       3                       4                   */
  1.00, 0.75, 0.50, 1.00, 0.75, 0.50, 1.00, 0.75, 0.50, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
  0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.50, 0.50, 0.50, 0.50, 0.50, 0.50, 0.50, 0.50, 0.50, 0.50,
  1.00, 0.75, 0.50, 1.00, 0.75, 0.50, 1.00, 0.75, 0.50, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
  0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.50, 0.50, 0.50, 0.50, 0.50, 0.50, 0.50, 0.50, 0.50, 0.50,
  1.00, 0.75, 0.50, 1.00, 0.75, 0.50, 1.00, 0.75, 0.50, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
  0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.50, 0.50, 0.50, 0.50, 0.50, 0.50, 0.50, 0.50, 0.50, 0.50,
  1.00, 0.75, 0.50, 1.00, 0.75, 0.50, 1.00, 0.75, 0.50, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
  0.50, 0.50, 0.50, 0.50, 0.50, 0.50, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75,
]);

const track7a = withBPM(122, [
  /* 1                    2                       3                       4                   */
  0.75, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.75, 0.00,
  0.00, 0.00, 0.75, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.75, 0.00, 0.00, 0.00, 0.75, 0.00,
  0.00, 0.00, 0.75, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.75, 0.00, 0.00, 0.00, 0.75, 0.00,
  0.00, 0.00, 0.75, 0.00, 0.00, 0.50, 0.75, 0.00, 0.00, 0.00, 0.75, 0.00, 0.50, 0.75, 0.50, 0.75,
  0.75, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.50,
  0.75, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.75, 0.00,
  0.75, 0.00, 0.00, 0.00, 0.50, 0.75, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.75, 0.00, 0.00, 0.00,
  0.00, 0.00, 0.75, 0.00, 0.00, 0.50, 0.75, 0.00, 0.00, 0.00, 0.75, 0.00, 0.50, 0.75, 0.50, 0.75,
  /* 1                    2                       3                       4                   */
  1.00, 0.75, 0.50, 0.25, 1.00, 0.00, 0.00, 0.00, 1.00, 0.00, 0.50, 0.00, 1.00, 0.00, 0.50, 0.00,
  1.00, 0.00, 0.50, 0.00, 1.00, 0.00, 0.00, 0.00, 1.00, 0.00, 0.00, 0.00, 1.00, 0.00, 0.50, 0.00,
  1.00, 0.00, 0.00, 0.00, 1.00, 0.75, 0.50, 0.25, 1.00, 0.00, 0.50, 0.00, 1.00, 0.75, 0.50, 0.25,
  1.00, 0.00, 0.00, 0.00, 1.00, 0.75, 0.50, 0.25, 1.00, 0.00, 0.00, 0.00, 1.00, 0.00, 0.00, 0.00,
  1.00, 0.00, 0.00, 0.00, 1.00, 0.00, 0.00, 0.00, 1.00, 0.00, 0.00, 0.00, 1.00, 0.00, 0.00, 0.00,
  1.00, 0.00, 0.50, 0.00, 1.00, 0.00, 0.00, 0.00,
]);

const track7b = withBPM(122, [
  /* 1                    2                       3                       4                   */
  0.00, 0.00, 0.00, 0.00, 0.50, 0.00, 0.50, 0.00, 0.75, 0.75, 0.00, 0.00, 0.50, 0.00, 0.00, 0.00,
  0.00, 0.00, 0.00, 0.00, 0.50, 0.00, 0.50, 0.00, 0.75, 0.75, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00,
  0.00, 0.00, 0.00, 0.00, 0.25, 0.50, 0.00, 0.00, 0.75, 0.75, 0.00, 0.00, 1.00, 1.00, 0.00, 0.00,
  1.00, 1.00, 0.00, 0.00, 0.50, 0.00, 0.50, 0.00, 0.75, 0.75, 1.00, 0.00, 0.00, 0.00, 0.00, 0.00,
  0.00, 0.00, 0.00, 0.00, 0.50, 0.00, 0.00, 0.00, 0.75, 0.75, 1.00, 1.00, 1.00, 1.00, 0.00, 0.00,
  0.00, 0.00, 0.00, 0.00, 0.50, 0.50, 0.75, 0.75, 0.50, 0.50, 0.75, 0.75, 0.00, 0.00, 0.00, 0.00,
  0.00, 0.50, 0.75, 0.00, 0.00, 0.00, 0.00, 0.00, 0.75, 0.75, 0.00, 0.00, 0.00, 0.50, 0.00, 0.00,
  1.00, 1.00, 0.00, 0.00, 0.50, 0.00, 0.50, 0.00, 0.75, 0.75, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00,
  /* 1                    2                       3                       4                   */
  0.00, 0.00, 0.00, 0.00, 0.25, 0.50, 0.00, 0.00, 0.75, 0.75, 0.00, 0.00, 0.00, 0.50, 0.00, 0.00,
  0.00, 0.00, 0.00, 0.00, 0.00, 0.50, 0.75, 0.00, 0.75, 0.75, 0.00, 0.50, 0.00, 0.50, 0.00, 0.00,
  0.00, 1.00, 1.00, 1.00, 0.25, 0.50, 0.25, 0.50, 0.75, 0.00, 0.75, 0.00, 0.00, 0.00, 0.00, 0.00,
  0.00, 0.00, 0.75, 0.00, 0.00, 0.00, 0.75, 0.00, 0.50, 0.00, 0.50, 0.00, 0.50, 0.00, 0.50, 0.00,
  0.00, 0.00, 0.50, 0.00, 0.00, 0.25, 0.50, 0.00, 0.75, 0.75, 0.00, 0.00, 0.00, 0.00, 0.50, 0.00,
  0.00, 0.00, 0.50, 0.00, 0.25, 0.00, 0.50, 0.00,
]);

const FADE_DURATION = 1;
function fade (beg, end, time) {
  return Math.max(
    0,
    Math.min(1, (time - beg) / FADE_DURATION + 1) * Math.min(1, (end - time) / FADE_DURATION + 1)
  );
}

function vibrationValue1 (time) {
  return Math.min(
    1.0,
    fade(  0.35,  21.90, time) * track1a(time -   0.35) +
    fade( 22.90,  37.95, time) * track2a(time -  22.40) +
    track3a(time -  38.45) +
    track4a(time -  52.35) +
    track5a(time -  73.90) +
    fade(114.05, 127.45, time) * track6a(time - 114.05) +
    track7a(time - 128.45)
  );
}

function vibrationValue2 (time) {
  return Math.min(
    1.0,
    fade(  0.35,  21.90, time) * track1b(time -   0.35) +
    fade( 22.90,  37.95, time) * track2b(time -  22.40) +
    track3b(time -  38.45) +
    track4b(time -  52.35) +
    track5b(time -  73.90) +
    fade(114.05, 127.45, time) * track6b(time - 114.05) +
    track7b(time - 128.45)
  );
}

/* --- entrypoint */

const timeEl = document.getElementById("time");
function monitorPlayerStatus () {
  switch (player.getPlayerState()) {
    case 1:
      const time = player.getCurrentTime();
      const value1 = vibrationValue1(time);
      const value2 = vibrationValue2(time);
      devices.forEach(dev => dev.send(value1, value2));
      timeEl.innerHTML = time;
      document.body.style.setProperty("--vib1", value1);
      document.body.style.setProperty("--vib2", value2);
      break;
    default:
      devices.forEach(dev => dev.send(0));
      timeEl.innerHTML = "(paused)";
      document.body.style.setProperty("--vib1", 0);
      document.body.style.setProperty("--vib2", 0);
  }
}

function play () {
  if (!player) {
    alert("Video is not loaded. Please reload this page if it does not load.");
    return;
  }
  player.seekTo(0);
  player.unMute();
  player.setVolume(100);
  setInterval(monitorPlayerStatus, 30);
  document.getElementById("setup").remove();
  document.getElementById("control").style.display = "block";
}
