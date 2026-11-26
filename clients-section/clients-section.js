(function () {
  const FILES = [
    "AURA.png",
    "Aashrayaa Eco City.webp",
    "Abhee Developers.png",
    "Alcove Properties.svg",
    "Ambika Developers.png",
    "artuzu.webp",
    "Atha Constructions.png",
    "Blockone Family Office.png",
    "Broadwings.png",
    "Carpediem.webp",
    "Casatrance.webp",
    "Cedar String.png",
    "Clarion Hotel.png",
    "Creamy Fabrics.png",
    "Cushman & Wakefield.svg",
    "DAMAC.png",
    "Danube Properties.svg",
    "Elaris (Object 1).svg",
    "GO Digital.jpg",
    "GRASA.jpg",
    "Giggili.png",
    "Gnome.svg",
    "Gravity Homes.webp",
    "HPR Infra.png",
    "IRA By the Banks.png",
    "ITC.webp",
    "Jade Infra.svg",
    "Jankal Group.png",
    "Kannasu.png",
    "Kharva Restobar.jpg",
    "Lakme Salon.png",
    "Little Dimples by Tisha.png",
    "LondonBrow Company.png",
    "MB Realty.jpg",
    "Mandate Co.svg",
    "MW Solution.png",
    "Mathura Developers.png",
    "Meznah Ayurveda.png",
    "My Space Realty.png",
    "Namma Haven.jpg",
    "Nandi Skyline.png",
    "Natraj Chole Bhature.png",
    "Needs3 168.png",
    "Niva Earthscape.png",
    "PD Design.png",
    "PGR Buildtech.webp",
    "Pratham Motors.webp",
    "RK Celesta.webp",
    "ROKA Cafe.jpg",
    "Realty Door.svg",
    "SB Urbanspace.png",
    "SLN Infra.webp",
    "SMOOR.png",
    "Samantha Jagan.png",
    "Scent Salon.jpg",
    "Shutter Shop.jpg",
    "Stories.webp",
    "Stratus.png",
    "Syslatech.svg",
    "Teknix Elevators.png",
    "Logo-TAE(Black).png",
    "The Bier Library.png",
    "The Buzz House.png",
    "The Naturalness.png",
    "Titan.svg",
    "Trendy Tech.png",
    "Trifecta.png",
    "Triguna Country Homes.png",
    "Try Bello.png",
    "Tula Properties.png",
    "UMI.png",
    "Umaria Safari Camp.png",
    "VBHC.svg",
    "Vaishnodevi Group.png",
    "Venus Auto Services.png",
    "Vibha Reality.jpeg",
    "Vrishabha Interiors.svg",
    "White Stag.svg",
    "Zed the Baker.png"
  ];

  // True black / dark-ink logos only — white plate. Light logos must NOT use a
  // white plate or they disappear; those get a thin border instead.
  const FORCE_LIGHT_BG = {
    "Atha Constructions.png": true,
    "Blockone Family Office.png": true,
    "Casatrance.webp": true,
    "Clarion Hotel.png": true,
    "DAMAC.png": true,
    "GO Digital.jpg": true,
    "Gravity Homes.webp": true,
    "Mathura Developers.png": true,
    "My Space Realty.png": true,
    "Needs3 168.png": true,
    "Niva Earthscape.png": true,
    "Teknix Elevators.png": true,
    "The Naturalness.png": true,
    "Venus Auto Services.png": true,
    "Zed the Baker.png": true
  };

  // Light / colorful / gold logos — thin border only, never a white plate.
  const NEVER_LIGHT_BG = {
    "Abhee Developers.png": true,
    "Ambika Developers.png": true,
    "artuzu.webp": true,
    "Broadwings.png": true,
    "Carpediem.webp": true,
    "Gnome.svg": true,
    "IRA By the Banks.png": true,
    "Jankal Group.png": true,
    "Logo-TAE(Black).png": true,
    "MW Solution.png": true,
    "Namma Haven.jpg": true,
    "Natraj Chole Bhature.png": true,
    "PD Design.png": true,
    "PGR Buildtech.webp": true,
    "Pratham Motors.webp": true,
    "Samantha Jagan.png": true,
    "Scent Salon.jpg": true,
    "Stories.webp": true,
    "Stratus.png": true,
    "Trifecta.png": true,
    "Vibha Reality.jpeg": true,
    "White Stag.svg": true
  };

  const darkCache = Object.create(null);

  const NAME_OVERRIDES = {
    "Logo-TAE(Black).png": "The Ahaa Edit",
    "artuzu.webp": "Artuz",
    "Vibha Reality.jpeg": "Vibha Reality"
  };

  function brandName(file) {
    if (NAME_OVERRIDES[file]) return NAME_OVERRIDES[file];
    return file
      .replace(/\.[^.]+$/, "")
      .replace(/\s*\(Object\s*\d+\)\s*/i, "")
      .replace(/\s*\(\d+\)\s*/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function logoSrc(file) {
    return "logos/" + encodeURIComponent(file).replace(/%2F/gi, "/");
  }

  function isMostlyDark(img) {
    try {
      const canvas = document.createElement("canvas");
      const max = 96;
      const nw = img.naturalWidth || max;
      const nh = img.naturalHeight || max;
      const scale = Math.min(1, max / Math.max(nw, nh));
      const w = Math.max(1, Math.round(nw * scale));
      const h = Math.max(1, Math.round(nh * scale));
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return false;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      let sum = 0;
      let count = 0;
      let bright = 0;
      let dark = 0;
      let chroma = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 40) continue;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        sum += lum;
        count += 1;
        if (lum > 170) bright += 1;
        if (lum < 55) dark += 1;
        if (Math.max(r, g, b) - Math.min(r, g, b) > 40) chroma += 1;
      }
      if (!count) return false;
      const avg = sum / count;
      const brightRatio = bright / count;
      const darkRatio = dark / count;
      const chromaRatio = chroma / count;
      // Light / white / gold marks vanish on a white plate — border only.
      if (brightRatio > 0.08) return false;
      if (chromaRatio > 0.18) return false;
      // Only plate real dark ink that disappears on the dark section.
      return darkRatio > 0.45 && avg < 90;
    } catch (err) {
      return false;
    }
  }

  function applyLightBg(item) {
    item.classList.add("clients-item--on-light");
  }

  function markIfDark(item, file, img) {
    if (NEVER_LIGHT_BG[file]) {
      darkCache[file] = false;
      return;
    }
    if (FORCE_LIGHT_BG[file]) {
      applyLightBg(item);
      darkCache[file] = true;
      return;
    }
    if (Object.prototype.hasOwnProperty.call(darkCache, file)) {
      if (darkCache[file]) applyLightBg(item);
      return;
    }
    const dark = isMostlyDark(img);
    darkCache[file] = dark;
    if (dark) applyLightBg(item);
  }

  function buildSet(isClone) {
    const set = document.createElement("div");
    set.className = "clients-set";
    set.setAttribute("aria-hidden", isClone ? "true" : "false");

    const frag = document.createDocumentFragment();
    FILES.forEach(function (file) {
      const name = brandName(file);
      const item = document.createElement("div");
      item.className = "clients-item";
      item.dataset.logoFile = file;

      const img = document.createElement("img");
      img.src = logoSrc(file);
      img.alt = isClone ? "" : name;
      img.decoding = "async";
      // Lazy-load helps phones; the duplicate strip can stay fully lazy.
      img.loading = "lazy";
      img.draggable = false;

      const onReady = function () {
        if (!img.naturalWidth) {
          item.remove();
          return;
        }
        markIfDark(item, file, img);
      };
      const onError = function () {
        item.remove();
      };
      if (img.complete && img.naturalWidth) onReady();
      else {
        img.addEventListener("load", onReady, { once: true });
        img.addEventListener("error", onError, { once: true });
      }

      item.appendChild(img);
      frag.appendChild(item);
    });

    set.appendChild(frag);
    return set;
  }

  function bindMobileMotion(section, track) {
    if (!section || !track) return;

    // Pause the strip while it is off-screen to save battery on phones.
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            section.classList.toggle("is-offscreen", !entry.isIntersecting);
          });
        },
        { rootMargin: "80px 0px", threshold: 0.01 }
      );
      io.observe(section);
    }

    // Touch: tap pauses / resumes so users can inspect a logo.
    var tapStartX = 0;
    var tapStartY = 0;
    section.addEventListener(
      "touchstart",
      function (event) {
        if (!event.touches || !event.touches[0]) return;
        tapStartX = event.touches[0].clientX;
        tapStartY = event.touches[0].clientY;
      },
      { passive: true }
    );
    section.addEventListener(
      "touchend",
      function (event) {
        if (!event.changedTouches || !event.changedTouches[0]) return;
        var dx = Math.abs(event.changedTouches[0].clientX - tapStartX);
        var dy = Math.abs(event.changedTouches[0].clientY - tapStartY);
        if (dx > 12 || dy > 12) return;
        section.classList.toggle("is-paused");
      },
      { passive: true }
    );
  }

  function init() {
    const section = document.querySelector(".clients-section");
    const track = document.querySelector(".clients-track");
    if (!track) return;

    const first = buildSet(false);
    const second = buildSet(true);

    track.appendChild(first);
    track.appendChild(second);
    bindMobileMotion(section, track);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
