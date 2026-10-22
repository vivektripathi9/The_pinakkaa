// Hero section functionality
document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.video-background video');
    const logoContainer = document.querySelector('.hero-logo-container');
    if (!video) return;

    const prefersReducedMotion =
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = Boolean(navigator.connection && navigator.connection.saveData);
    if (prefersReducedMotion || saveData) {
        if (logoContainer) logoContainer.classList.add('is-visible');
        return;
    }

    // Chrome only allows autoplay when the muted property is set before play().
    // The HTML attribute alone is sometimes applied too late, which leaves the
    // native play button on screen.
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.controls = false;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const showLogo = () => {
        if (logoContainer) {
            logoContainer.classList.add('is-visible');
        }
    };

    const tryPlay = () => {
        video.muted = true;
        const pending = video.play();
        if (pending && typeof pending.then === 'function') {
            pending.then(showLogo).catch(function () {});
        }
    };

    if (video.readyState >= 2) {
        showLogo();
    } else {
        video.addEventListener('loadeddata', showLogo, { once: true });
        video.addEventListener('canplay', showLogo, { once: true });
    }

    tryPlay();
    video.addEventListener('loadeddata', tryPlay);
    video.addEventListener('canplay', tryPlay);

    // If another script pauses the hero while it is on screen, resume it.
    video.addEventListener('pause', function () {
        const rect = video.getBoundingClientRect();
        const onScreen = rect.bottom > 0 && rect.top < window.innerHeight && rect.height > 0;
        if (onScreen && !video.ended) {
            video.muted = true;
            const pending = video.play();
            if (pending && typeof pending.catch === 'function') pending.catch(function () {});
        }
    });
});
