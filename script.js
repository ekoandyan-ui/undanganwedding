/* ============================================
   WEDDING INVITATION — script.js
   Enhanced with Music Player & Visual Effects
   ============================================ */

// ============ INIT AOS ============
AOS.init({ duration: 900, once: true, offset: 80, easing: "ease-out-cubic" });

// ============ PARTICLES ============
(function createParticles() {
  const container = document.getElementById("particles");
  if (!container) return;
  const count = window.innerWidth < 600 ? 15 : 30;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = Math.random() * 6 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 15 + 12}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: ${Math.random() * 0.3};
    `;
    container.appendChild(p);
  }
})();

// ============ PETALS ============
(function createPetals() {
  const container = document.getElementById("petals");
  if (!container) return;
  const colors = [
    "#f5e6ca",
    "#e8d5a3",
    "#d4c48c",
    "#c9a84c40",
    "#b8e6c8",
    "#a8d5b8",
  ];
  const count = window.innerWidth < 600 ? 10 : 20;
  for (let i = 0; i < count; i++) {
    const petal = document.createElement("div");
    petal.className = "petal";
    petal.style.cssText = `
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 12 + 10}s;
      animation-delay: ${Math.random() * 12}s;
      width: ${Math.random() * 10 + 7}px;
      height: ${Math.random() * 12 + 9}px;
      transform: rotate(${Math.random() * 360}deg);
    `;
    container.appendChild(petal);
  }
})();

// ============ OPEN INVITATION ============
function openInvitation() {
  const cover = document.getElementById("cover");
  const main = document.getElementById("mainContent");

  cover.style.transition = "opacity 0.8s ease, transform 0.8s ease";
  cover.style.opacity = "0";
  cover.style.transform = "scale(1.03)";

  setTimeout(() => {
    cover.style.display = "none";
    main.style.display = "block";
    main.style.opacity = "0";
    main.style.transition = "opacity 0.6s ease";
    setTimeout(() => {
      main.style.opacity = "1";
    }, 50);
    window.scrollTo({ top: 0, behavior: "smooth" });
    localStorage.setItem("invitationOpened", "true");
    // Auto-start music
    tryPlayMusic();
  }, 700);
}

// ============ ON LOAD ============
window.onload = function () {
  if (localStorage.getItem("invitationOpened") === "true") {
    document.getElementById("cover").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
  }

  // Set guest name from URL
  const urlParams = new URLSearchParams(window.location.search);
  const guest = urlParams.get("to");
  if (guest) {
    document.getElementById("guestName").textContent =
      decodeURIComponent(guest);
  }

  // Dark theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
    const icon = document.querySelector("#toggleTheme i");
    if (icon) icon.className = "fas fa-sun";
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
  loadWishes();
  initMusicPlayer();
};

// ============ COUNTDOWN ============
function updateCountdown() {
  const weddingDate = new Date("October 25, 2025 09:00:00").getTime();
  const now = new Date().getTime();
  const distance = weddingDate - now;

  const els = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
  };

  if (distance < 0) {
    Object.values(els).forEach((el) => {
      if (el) el.textContent = "00";
    });
    return;
  }

  const d = Math.floor(distance / (1000 * 60 * 60 * 24));
  const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((distance % (1000 * 60)) / 1000);

  const pad = (n) => String(n).padStart(2, "0");
  if (els.days) animateNumber(els.days, pad(d));
  if (els.hours) animateNumber(els.hours, pad(h));
  if (els.minutes) animateNumber(els.minutes, pad(m));
  if (els.seconds) animateNumber(els.seconds, pad(s));
}

function animateNumber(el, newVal) {
  if (el.textContent !== newVal) {
    el.style.transform = "scale(1.15)";
    el.style.transition = "transform 0.15s";
    el.textContent = newVal;
    setTimeout(() => {
      el.style.transform = "scale(1)";
    }, 150);
  }
}

// ============ MUSIC PLAYER ============
const playlist = [
  {
    title: "Sholawat Nabi — Ya Nabi Salam",
    // Placeholder MP3s — replace with your actual Islamic nasheeds
    src: "music-islami.mp3",
    fallback: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    title: "Sholawat — Tholaal Badru",
    src: "music-islami-2.mp3",
    fallback: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
];

let currentSongIndex = 0;
let isPlaying = false;
let audioEl = null;
let progressInterval = null;

function initMusicPlayer() {
  audioEl = new Audio();
  audioEl.loop = false;
  audioEl.volume = 0.6;

  audioEl.addEventListener("ended", nextSong);
  audioEl.addEventListener("timeupdate", updateProgress);
  audioEl.addEventListener("error", function () {
    // Try fallback source
    const fallback = playlist[currentSongIndex].fallback;
    if (audioEl.src !== fallback) {
      audioEl.src = fallback;
      if (isPlaying) audioEl.play().catch(() => {});
    }
  });

  loadSong(currentSongIndex);

  document.getElementById("toggleMute").addEventListener("click", togglePlay);
  document.getElementById("playPauseBtn").addEventListener("click", togglePlay);
  document.getElementById("prevSong").addEventListener("click", prevSong);
  document.getElementById("nextSong").addEventListener("click", nextSong);
}

function loadSong(index) {
  const song = playlist[index];
  audioEl.src = song.src;
  document.getElementById("songTitle").textContent = song.title;
  document.getElementById("progressFill").style.width = "0%";

  // Test if local file exists, else use fallback
  const tester = new Audio(song.src);
  tester.addEventListener("error", () => {
    audioEl.src = song.fallback;
  });
}

function tryPlayMusic() {
  if (!audioEl) return;
  audioEl
    .play()
    .then(() => {
      setPlayingState(true);
    })
    .catch(() => {
      setPlayingState(false);
    });
}

function togglePlay() {
  if (!audioEl) return;
  if (isPlaying) {
    audioEl.pause();
    setPlayingState(false);
  } else {
    audioEl
      .play()
      .then(() => {
        setPlayingState(true);
      })
      .catch(() => {
        showToast("Tap sekali lagi untuk memulai musik");
      });
  }
}

function setPlayingState(playing) {
  isPlaying = playing;
  const muteBtn = document.getElementById("toggleMute");
  const playBtn = document.getElementById("playPauseBtn");
  const musicBar = document.getElementById("musicBar");

  if (muteBtn)
    muteBtn.querySelector("i").className = playing
      ? "fas fa-music"
      : "fas fa-music-slash fas fa-volume-mute";
  if (muteBtn)
    muteBtn.querySelector("i").className = playing
      ? "fas fa-volume-up"
      : "fas fa-volume-mute";
  if (playBtn)
    playBtn.querySelector("i").className = playing
      ? "fas fa-pause"
      : "fas fa-play";
  if (musicBar) {
    if (playing) musicBar.classList.add("show");
    else musicBar.classList.remove("show");
  }
}

function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % playlist.length;
  loadSong(currentSongIndex);
  if (isPlaying) audioEl.play().catch(() => {});
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentSongIndex);
  if (isPlaying) audioEl.play().catch(() => {});
}

function updateProgress() {
  if (!audioEl || !audioEl.duration) return;
  const pct = (audioEl.currentTime / audioEl.duration) * 100;
  const fill = document.getElementById("progressFill");
  if (fill) fill.style.width = pct + "%";
}

// Auto-play after first user interaction
document.addEventListener(
  "click",
  function initPlayOnInteraction() {
    tryPlayMusic();
    document.removeEventListener("click", initPlayOnInteraction);
  },
  { once: true },
);

// ============ DARK THEME ============
document.getElementById("toggleTheme").addEventListener("click", function () {
  document.body.classList.toggle("dark-theme");
  const icon = this.querySelector("i");
  const isDark = document.body.classList.contains("dark-theme");
  icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// ============ COPY TO CLIPBOARD ============
function copyToClipboard(text, btn) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i>';
      btn.classList.add("copied");
      showToast("✓ Disalin ke clipboard");
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.classList.remove("copied");
      }, 2200);
    })
    .catch(() => {
      // Fallback for browsers without clipboard API
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        showToast("✓ Disalin ke clipboard");
      } catch (e) {
        showToast("Salin manual: " + text);
      }
      document.body.removeChild(ta);
    });
}

// ============ TOAST NOTIFICATION ============
function showToast(message, duration = 3000) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), duration);
}

// ============ RSVP FORM ============
document.getElementById("rsvpForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const attendance = document.getElementById("attendance").value;
  const guests = document.getElementById("guests").value;
  const message = document.getElementById("message").value.trim();

  if (!name || !attendance) {
    showToast("Mohon lengkapi nama dan konfirmasi kehadiran");
    return;
  }

  const rsvpData = {
    name,
    attendance,
    guests,
    message,
    timestamp: new Date().toISOString(),
  };

  let rsvps = [];
  try {
    rsvps = JSON.parse(localStorage.getItem("rsvps") || "[]");
  } catch (e) {}
  rsvps.push(rsvpData);
  localStorage.setItem("rsvps", JSON.stringify(rsvps));

  const msgEl = document.getElementById("rsvpMessage");
  const attendLabel =
    attendance === "hadir"
      ? "✅ Hadir"
      : attendance === "tidak_hadir"
        ? "❌ Tidak Hadir"
        : "🤔 Masih Ragu";
  msgEl.innerHTML = `<strong>Terima kasih, ${name}!</strong><br>Konfirmasi kehadiran: ${attendLabel}`;
  msgEl.style.color = "rgba(255,255,255,0.85)";
  msgEl.style.fontStyle = "italic";

  if (message) addWishToList(name, message);

  this.reset();
  showToast("✓ Konfirmasi berhasil dikirim!");

  setTimeout(() => {
    msgEl.innerHTML = "";
    msgEl.style.color = "";
  }, 5000);
});

// ============ WISHES ============
function addWishToList(name, message) {
  const container = document.getElementById("wishesContainer");
  if (!container) return;

  const card = document.createElement("div");
  card.className = "wish-card";
  card.innerHTML = `
    <div class="wish-name">${escapeHtml(name)}</div>
    <div class="wish-text">"${escapeHtml(message)}"</div>
    <div class="wish-date">${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>
  `;
  container.insertBefore(card, container.firstChild);
}

function loadWishes() {
  let rsvps = [];
  try {
    rsvps = JSON.parse(localStorage.getItem("rsvps") || "[]");
  } catch (e) {}
  rsvps
    .slice()
    .reverse()
    .forEach((r) => {
      if (r.message && r.message.trim()) addWishToList(r.name, r.message);
    });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ============ SHARE ============
function copyInvitationLink() {
  const link = window.location.href;
  navigator.clipboard
    .writeText(link)
    .then(() => {
      showToast("✓ Link undangan disalin!");
    })
    .catch(() => showToast("Link: " + link));
}

function shareToWhatsApp() {
  const text = `Assalamu'alaikum, kami mengundang Anda ke pernikahan kami 🌿✨\n\nSilakan buka undangan digital kami:\n${window.location.href}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
}

// ============ SCROLL EFFECTS ============
let lastScrollY = 0;
window.addEventListener(
  "scroll",
  () => {
    const scrolled = window.pageYOffset;

    // Parallax petals container
    const petals = document.querySelector(".petals-container");
    if (petals) petals.style.transform = `translateY(${scrolled * 0.15}px)`;

    // Hide music bar when scrolling up fast (optional UX)
    const diff = scrolled - lastScrollY;
    lastScrollY = scrolled;

    // Reveal music bar when scrolled past header
    const musicBar = document.getElementById("musicBar");
    if (musicBar && isPlaying) {
      if (scrolled > 200) musicBar.classList.add("show");
    }
  },
  { passive: true },
);

// ============ TOUCH IMPROVEMENTS ============
document.addEventListener(
  "touchmove",
  function (e) {
    if (e.touches.length > 1) return; // allow pinch-zoom
    const tag = e.target.tagName;
    if (tag !== "TEXTAREA" && tag !== "INPUT" && tag !== "SELECT") {
      // Allow normal scrolling, don't preventDefault
    }
  },
  { passive: true },
);

// ============ LOADED ============
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

