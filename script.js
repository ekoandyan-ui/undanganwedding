/* ============================================
   WEDDING INVITATION — ENHANCED EDITION
   With Advanced Animations & Interactions
   ============================================ */

// ============ PRELOADER ============
window.addEventListener("load", function () {
  setTimeout(function () {
    const preloader = document.querySelector(".preloader");
    if (preloader) {
      preloader.classList.add("fade-out");
    }
  }, 1500);
});

// ============ CLEAR INVITATION STATE ON PAGE LOAD ============
// This ensures cover is always shown first when page is loaded/refreshed
window.addEventListener("pageshow", function (event) {
  // Clear any saved state that would bypass the cover
  localStorage.removeItem("invitationOpened");

  // Reset to cover view
  const cover = document.getElementById("cover");
  const main = document.getElementById("mainContent");

  if (cover && main) {
    cover.style.display = "flex";
    cover.style.opacity = "1";
    cover.style.transform = "scale(1)";
    main.style.display = "none";
  }

  // Reset music player state
  if (audioEl) {
    audioEl.pause();
    setPlayingState(false);
  }
});

// ============ INIT AOS ============
AOS.init({
  duration: 900,
  once: false,
  offset: 80,
  easing: "ease-out-cubic",
  mirror: true,
});

// ============ SWIPER INIT ============
const gallerySwiper = new Swiper(".gallery-swiper", {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
  },
  effect: "coverflow",
  coverflowEffect: {
    rotate: 30,
    slideShadows: false,
  },
});

// ============ PARTICLES ============
(function createParticles() {
  const container = document.getElementById("particles");
  if (!container) return;
  const count = window.innerWidth < 600 ? 20 : 40;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = Math.random() * 6 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 20 + 15}s;
      animation-delay: ${Math.random() * 15}s;
      opacity: ${Math.random() * 0.3 + 0.1};
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
  const count = window.innerWidth < 600 ? 15 : 25;
  for (let i = 0; i < count; i++) {
    const petal = document.createElement("div");
    petal.className = "petal";
    petal.style.cssText = `
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 15 + 12}s;
      animation-delay: ${Math.random() * 15}s;
      width: ${Math.random() * 12 + 8}px;
      height: ${Math.random() * 14 + 10}px;
      transform: rotate(${Math.random() * 360}deg);
    `;
    container.appendChild(petal);
  }
})();

// ============ GET GUEST NAME FROM URL PATH ============
function getGuestNameFromPath() {
  // Get the current path
  let path = window.location.pathname;

  // Remove leading and trailing slashes
  path = path.replace(/^\/|\/$/g, "");

  // If path is not empty and not the root, use it as guest name
  if (path && path !== "" && path !== "index.html") {
    // Decode URI component and replace hyphens/underscores with spaces
    let guestName = decodeURIComponent(path);
    guestName = guestName.replace(/[-_]/g, " ");

    // Capitalize each word
    guestName = guestName.replace(/\b\w/g, (l) => l.toUpperCase());

    return guestName;
  }

  // Fallback to query parameter if exists (for backward compatibility)
  const urlParams = new URLSearchParams(window.location.search);
  const guest = urlParams.get("to");
  if (guest) {
    return decodeURIComponent(guest);
  }

  return null;
}

// ============ OPEN INVITATION ============
function openInvitation() {
  const cover = document.getElementById("cover");
  const main = document.getElementById("mainContent");

  cover.style.transition = "opacity 0.8s ease, transform 0.8s ease";
  cover.style.opacity = "0";
  cover.style.transform = "scale(1.05)";

  setTimeout(() => {
    cover.style.display = "none";
    main.style.display = "block";
    main.style.opacity = "0";
    main.style.transition = "opacity 0.8s ease";
    setTimeout(() => {
      main.style.opacity = "1";
      // Trigger AOS refresh
      AOS.refresh();
    }, 50);
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Auto-start music
    tryPlayMusic();
  }, 700);
}

// ============ ON LOAD ============
window.onload = function () {
  // Always show cover first - no localStorage check
  const cover = document.getElementById("cover");
  const main = document.getElementById("mainContent");

  if (cover && main) {
    cover.style.display = "flex";
    cover.style.opacity = "1";
    cover.style.transform = "scale(1)";
    main.style.display = "none";
  }

  // Set guest name from URL path
  const guestName = getGuestNameFromPath();
  const guestNameElement = document.getElementById("guestName");

  if (guestName && guestNameElement) {
    guestNameElement.textContent = guestName;
  } else if (guestNameElement) {
    guestNameElement.textContent = "Bapak/Ibu/Sahabat";
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
  initScrollEffects();
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
    el.style.transform = "scale(1.2)";
    el.style.transition = "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)";
    el.textContent = newVal;
    setTimeout(() => {
      el.style.transform = "scale(1)";
    }, 200);
  }
}

// ============ MUSIC PLAYER ============
const playlist = [
  {
    title: "Sholawat Nabi — Ya Nabi Salam",
    src: "assets/music-islami.mp3",
    artist: "Qasidah Modern",
  },
  {
    title: "Sholawat — Tholaal Badru",
    src: "assets/music-islami.mp3",
    artist: "Nasyid Cinta",
  },
  {
    title: "Sholawat — Ya Robbi Bil Mustofa",
    src: "assets/music-islami.mp3",
    artist: "Hadroh Al-Banjari",
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
  audioEl.addEventListener("loadedmetadata", updateDuration);

  loadSong(currentSongIndex);

  document.getElementById("toggleMute").addEventListener("click", togglePlay);
  document.getElementById("playPauseBtn").addEventListener("click", togglePlay);
  document.getElementById("prevSong").addEventListener("click", prevSong);
  document.getElementById("nextSong").addEventListener("click", nextSong);

  // Volume control
  const volumeControl = document.getElementById("volumeControl");
  const volumeIcon = document.getElementById("volumeIcon");

  volumeControl.addEventListener("input", function (e) {
    audioEl.volume = e.target.value;
    updateVolumeIcon(e.target.value);
  });

  volumeIcon.addEventListener("click", function () {
    if (audioEl.volume > 0) {
      audioEl.muted = !audioEl.muted;
      volumeIcon.className = audioEl.muted
        ? "fas fa-volume-mute"
        : "fas fa-volume-up";
    }
  });
}

function updateVolumeIcon(volume) {
  const icon = document.getElementById("volumeIcon");
  if (volume == 0) {
    icon.className = "fas fa-volume-off";
  } else if (volume < 0.5) {
    icon.className = "fas fa-volume-down";
  } else {
    icon.className = "fas fa-volume-up";
  }
}

function loadSong(index) {
  const song = playlist[index];
  audioEl.src = song.src;
  document.getElementById("songTitle").textContent = song.title;
  document.querySelector(".music-artist").textContent = song.artist;
  document.getElementById("progressFill").style.width = "0%";
  document.getElementById("currentTime").textContent = "0:00";
}

function updateDuration() {
  const duration = formatTime(audioEl.duration);
  document.getElementById("duration").textContent = duration;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function tryPlayMusic() {
  if (!audioEl) return;
  audioEl
    .play()
    .then(() => {
      setPlayingState(true);
      startProgressUpdate();
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
    clearInterval(progressInterval);
  } else {
    audioEl
      .play()
      .then(() => {
        setPlayingState(true);
        startProgressUpdate();
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

function startProgressUpdate() {
  if (progressInterval) clearInterval(progressInterval);
  progressInterval = setInterval(() => {
    if (audioEl && isPlaying) {
      updateProgress();
    }
  }, 100);
}

function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % playlist.length;
  loadSong(currentSongIndex);
  if (isPlaying) {
    audioEl.play().catch(() => {});
    startProgressUpdate();
  }
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentSongIndex);
  if (isPlaying) {
    audioEl.play().catch(() => {});
    startProgressUpdate();
  }
}

function updateProgress() {
  if (!audioEl || !audioEl.duration) return;
  const pct = (audioEl.currentTime / audioEl.duration) * 100;
  const fill = document.getElementById("progressFill");
  const currentTime = document.getElementById("currentTime");
  if (fill) fill.style.width = pct + "%";
  if (currentTime) currentTime.textContent = formatTime(audioEl.currentTime);
}

// Auto-play after first user interaction with better handling
let userInteracted = false;
document.addEventListener(
  "click",
  function initPlayOnInteraction() {
    if (!userInteracted) {
      userInteracted = true;
      tryPlayMusic();
    }
  },
  { once: true },
);

// Also try on touch for mobile
document.addEventListener(
  "touchstart",
  function initPlayOnTouch() {
    if (!userInteracted) {
      userInteracted = true;
      tryPlayMusic();
    }
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

  // Add animation effect
  this.style.transform = "rotate(360deg)";
  setTimeout(() => {
    this.style.transform = "";
  }, 500);
});

// ============ SCROLL TO TOP ============
document.getElementById("scrollTop").addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Back to top button
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", function () {
  if (window.scrollY > 500) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

backToTop.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ============ SCROLL PROGRESS ============
function initScrollEffects() {
  const progressBar = document.getElementById("scrollProgress");

  window.addEventListener("scroll", function () {
    const winScroll = document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (progressBar) progressBar.style.width = scrolled + "%";
  });
}

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
    guests: guests || "1",
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

  // Add with animation
  card.style.opacity = "0";
  card.style.transform = "translateX(-30px)";
  container.insertBefore(card, container.firstChild);

  setTimeout(() => {
    card.style.transition = "all 0.5s ease";
    card.style.opacity = "1";
    card.style.transform = "translateX(0)";
  }, 50);
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

    // Parallax floating orbs
    const orbs = document.querySelectorAll(".orb");
    orbs.forEach((orb, index) => {
      const speed = 0.1 * (index + 1);
      orb.style.transform = `translate(${scrolled * speed}px, ${scrolled * speed * 0.5}px)`;
    });

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

// ============ COUNTDOWN BOX MOUSE MOVE EFFECT ============
document.querySelectorAll(".countdown-box").forEach((box) => {
  box.addEventListener("mousemove", (e) => {
    const rect = box.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    box.style.setProperty("--x", `${x}%`);
    box.style.setProperty("--y", `${y}%`);
  });
});

// ============ TOUCH IMPROVEMENTS ============
document.addEventListener(
  "touchmove",
  function (e) {
    if (e.touches.length > 1) return; // allow pinch-zoom
    const tag = e.target.tagName;
    if (tag !== "TEXTAREA" && tag !== "INPUT" && tag !== "SELECT") {
      // Allow normal scrolling
    }
  },
  { passive: true },
);

// ============ INTERSECTION OBSERVER FOR ANIMATIONS ============
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");

        // Animate countdown boxes when in view
        if (entry.target.classList.contains("countdown-grid")) {
          const boxes = entry.target.querySelectorAll(".countdown-box");
          boxes.forEach((box, index) => {
            setTimeout(() => {
              box.style.animation = "boxFloat 3s ease-in-out infinite";
            }, index * 200);
          });
        }
      }
    });
  },
  { threshold: 0.3 },
);

document
  .querySelectorAll(".section-header, .countdown-grid, .event-card, .gift-card")
  .forEach((el) => {
    observer.observe(el);
  });

// ============ LOADED ============
window.addEventListener("load", () => {
  document.body.classList.add("loaded");

  // Preload images
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    if (img.dataset.src) {
      img.src = img.dataset.src;
    }
  });
});

// ============ ERROR HANDLING ============
window.addEventListener("error", function (e) {
  console.log("Error:", e.message);
  // Silent fail for better UX
});

// ============ ADDITIONAL CLEANUP FOR PAGE REFRESH ============
// Handle back/forward cache
window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    // Page was restored from bfcache (back/forward cache)
    const cover = document.getElementById("cover");
    const main = document.getElementById("mainContent");

    if (cover && main) {
      cover.style.display = "flex";
      cover.style.opacity = "1";
      cover.style.transform = "scale(1)";
      main.style.display = "none";
    }

    // Reset music
    if (audioEl) {
      audioEl.pause();
      setPlayingState(false);
    }
  }
});
