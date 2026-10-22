// Lightweight performance helpers (static site)
// - Pause background videos when offscreen (saves CPU + battery)
// - Respect reduced-motion / data-saver where possible

(function () {
  // Lightweight image optimization pass:
  // - lazy-load offscreen images
  // - async decode to reduce main-thread jank
  const images = Array.from(document.querySelectorAll('img'));
  for (const img of images) {
    if (!img.hasAttribute('decoding')) img.decoding = 'async';
    if (!img.hasAttribute('loading')) {
      const rect = img.getBoundingClientRect();
      const nearViewport = rect.top < window.innerHeight * 1.2;
      img.loading = nearViewport ? 'eager' : 'lazy';
    }
  }

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Some browsers expose Data Saver via navigator.connection.saveData
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);

  const allowAutoplay = !(prefersReducedMotion || saveData);

  const prepare = (video) => {
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.controls = false;
    video.preload = 'auto';
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('autoplay', '');
  };

  const onScreen = (video) => {
    const rect = video.getBoundingClientRect();
    return rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
  };

  const startVideo = (video, force) => {
    if (!allowAutoplay) return;
    prepare(video);
    const rect = video.getBoundingClientRect();
    const visible = rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
    if (!force && !visible && rect.height > 0) return;
    const pending = video.play();
    if (pending && typeof pending.catch === 'function') pending.catch(() => {});
  };

  const watchVideo = (video) => {
    if (!video || video.dataset.autoplayReady === '1') return;
    video.dataset.autoplayReady = '1';
    prepare(video);

    if (!allowAutoplay) {
      video.autoplay = false;
      video.pause();
      return;
    }

    startVideo(video);
    video.addEventListener('loadeddata', () => startVideo(video));
    video.addEventListener('canplay', () => startVideo(video));

    let lastResume = 0;
    video.addEventListener('pause', () => {
      if (!onScreen(video)) return;
      const now = Date.now();
      if (now - lastResume < 500) return;
      lastResume = now;
      startVideo(video);
    });

    if (observer) observer.observe(video);
  };

  let observer = null;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target;
          if (entry.isIntersecting) {
            startVideo(video, true);
          } else if (!onScreen(video)) {
            video.pause();
          }
        }
      },
      { rootMargin: '200px 0px', threshold: 0.01 }
    );
  }

  const watchTree = (root) => {
    if (!root) return;
    if (root.nodeType === 1 && root.tagName === 'VIDEO') watchVideo(root);
    if (typeof root.querySelectorAll === 'function') {
      root.querySelectorAll('video').forEach(watchVideo);
    }
  };

  watchTree(document);

  if ('MutationObserver' in window) {
    const added = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach(watchTree);
      }
    });
    added.observe(document.documentElement, { childList: true, subtree: true });
  }

  let syncScheduled = false;
  const syncVisible = () => {
    document.querySelectorAll('video').forEach((video) => {
      if (onScreen(video)) startVideo(video, true);
    });
  };
  const scheduleSync = () => {
    if (syncScheduled) return;
    syncScheduled = true;
    requestAnimationFrame(() => {
      syncScheduled = false;
      syncVisible();
    });
  };
  window.addEventListener('scroll', scheduleSync, { passive: true });
  window.addEventListener('resize', scheduleSync);
  window.addEventListener('load', syncVisible);
})();

