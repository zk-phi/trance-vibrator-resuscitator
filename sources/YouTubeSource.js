/* load youtube js api */
!(function () {
  const script = document.createElement('script');
  script.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(script);
})();

function onYouTubeIframeAPIReady () {
  YouTubeSource.onAPIReady.forEach(fn => fn());
}

class YouTubeSource {
  static onAPIReady = []; /* thunks */

  constructor () {
    this.startTime = 0;
    this.player = null;
    this.timer = null;
    this.destroyed = false;
  }

  destroy () {
    this.destroyed = true;
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.player) {
      this.player.destroy();
    }
  }

  initialize (videoId, elementId, pattern, options = {}) {
    this.startTime = options.startTime || 0;
    const monitor = () => {
      if (options.onUpdate) {
        if (this.player.getPlayerState() === 1) {
          const time = this.player.getCurrentTime();
          options.onUpdate(pattern(time), `Playing (${String(time).substring(0, 6)}s)`);
        } else {
          options.onUpdate([0, 0], "(paused)");
        }
      }
    };
    const load = () => {
      if (this.destroyed) return;
      this.player = new YT.Player(elementId, {
        videoId: videoId,
        playerVars: {
          playsinline: 1,
          enablejsapi: 1,
        },
        events: {
          onReady: () => {
            this.timer = setInterval(monitor, 30);
            if (options.onLoad) {
              options.onLoad();
            }
          },
        },
      });
    };
    if (window.YT) {
      load();
    } else {
      YouTubeSource.onAPIReady.push(load);
    }
  }

  playMuted (startTime) {
    this.player.setVolume(0);
    this.player.seekTo(startTime || this.startTime);
    this.player.playVideo();
  }

  unMute () {
    this.player.unMute();
    this.player.setVolume(100);
  }

  start (startTime) {
    this.unMute();
    this.player.seekTo(startTime || this.startTime);
    this.player.playVideo();
  }
}
