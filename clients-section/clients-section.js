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

  // Logos that are black / low-contrast on the dark section — always use a white plate.
  const FORCE_LIGHT_BG = {
    "Atha Constructions.png": true,
    "Blockone Family Office.png": true,
    "Clarion Hotel.png": true,
    "DAMAC.png": true,
    "GO Digital.jpg": true,
    "Gravity Homes.webp": true,
    "Jankal Group.png": true,
    "Mathura Developers.png": true,
    "My Space Realty.png": true,
    "Niva Earthscape.png": true,
    "Scent Salon.jpg": true,
    "Teknix Elevators.png": true,
    "The Naturalness.png": true,
    "Venus Auto Services.png": true
  };

  // Already light / readable on dark — never wrap with a white plate.
  const NEVER_LIGHT_BG = {
    "PD Design.png": true,
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

  function isMostlyDark(img, file) {
    try {
      const canvas = document.createElement("canvas");
      const max = 72;
      const nw = img.naturalWidth || max;
      const nh = img.naturalHeight || max;
      const scale = Math.min(1, max / Math.max(nw, nh));
      const w = Math.max(1, Math.round(nw * scale));
      const h = Math.max(1, Math.round(nh * scale));
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return /\.svg$/i.test(file);
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      let sum = 0;
      let count = 0;
      let bright = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 40) continue;
        const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        sum += lum;
        count += 1;
        if (lum > 200) bright += 1;
      }
      if (!count) return true;
      // White/light marks on a baked black canvas already read on a dark page.
      if (bright / count > 0.12) return false;
      return sum / count < 135;
    } catch (err) {
      // If we cannot sample an SVG, leave it alone instead of forcing a plate.
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
    const dark = isMostlyDark(img, file);
    darkCache[file] = dark;
    if (dark) applyLightBg(item);
  }

  function buildSet() {
    const set = document.createElement("div");
    set.className = "clients-set";
    set.setAttribute("aria-hidden", "false");

    const frag = document.createDocumentFragment();
    FILES.forEach(function (file) {
      const name = brandName(file);
      const item = document.createElement("div");
      item.className = "clients-item";
      item.dataset.logoFile = file;

      const img = document.createElement("img");
      img.src = logoSrc(file);
      img.alt = name;
      img.decoding = "async";
      img.loading = "eager";
      img.width = 200;
      img.height = 88;

      const onReady = function () {
        markIfDark(item, file, img);
      };
      if (img.complete && img.naturalWidth) onReady();
      else img.addEventListener("load", onReady, { once: true });

      item.appendChild(img);
      frag.appendChild(item);
    });

    set.appendChild(frag);
    return set;
  }

  function init() {
    const track = document.querySelector(".clients-track");
    if (!track) return;

    const first = buildSet();
    const second = buildSet();
    second.setAttribute("aria-hidden", "true");

    track.appendChild(first);
    track.appendChild(second);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
