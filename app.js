// ID do vídeo a partir do link fornecido
const VIDEO_ID = "bdTNQSpZ-M0"; // https://youtu.be/bdTNQSpZ-M0

let ytReady = false;
let player = null;

// API do YT chama essa global quando carrega
window.onYouTubeIframeAPIReady = () => {
  ytReady = true;
};

function ensurePlayer() {
  return new Promise((resolve) => {
    if (player) return resolve(player);
    const make = () => {
      if (!ytReady) return setTimeout(make, 50);
      player = new YT.Player("player", {
        height: "1",
        width: "1",
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1
        },
        events: {
          onReady: () => resolve(player),
          onError: () => resolve(null)
        }
      });
    };
    make();
  });
}

async function playFromStart() {
  const p = await ensurePlayer();
  if (!p || typeof p.playVideo !== "function") {
    alert("Não foi possível iniciar o player. Abra o link no YouTube se persistir.");
    window.open("https://youtu.be/" + VIDEO_ID, "_blank");
    return;
  }
  try {
    p.seekTo(0, true);
    p.unMute && p.unMute();
    p.setVolume && p.setVolume(100);
    const state = p.getPlayerState ? p.getPlayerState() : null;
    if (state !== 1) p.playVideo();
  } catch (e) {
    // iOS pode exigir nova interação se falhar
  }
}

// UI
const btn = document.getElementById("red");
["click","touchstart"].forEach(evt => {
  btn.addEventListener(evt, (e) => {
    e.preventDefault();
    playFromStart();
  }, {passive:false});
});

// PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js");
  });
}