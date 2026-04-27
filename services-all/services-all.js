document.addEventListener('DOMContentLoaded', function () {
  const grid = document.getElementById('servicesAllGrid');
  if (!grid) return;

  // servicesData is declared in services-pages/services-pages.js
  if (!Array.isArray(window.servicesData)) return;

  const fragment = document.createDocumentFragment();

  window.servicesData.forEach((svc) => {
    const link = document.createElement('a');
    link.href =
      typeof serviceDetailHref === 'function'
        ? serviceDetailHref(svc.id)
        : `service-detail.html?service=${encodeURIComponent(svc.id)}`;
    link.className = 'services-all-card';

    const media = document.createElement('div');
    media.className = 'services-all-card-media';
    const img = document.createElement('img');
    img.src = svc.image || 'components/142846.jpg';
    img.alt = svc.title || 'Service';
    img.loading = 'lazy';
    img.decoding = 'async';
    media.appendChild(img);

    const body = document.createElement('div');
    body.className = 'services-all-card-body';
    const title = document.createElement('h3');
    title.className = 'services-all-card-title section-title';
    title.textContent = svc.title || 'Service';
    const desc = document.createElement('p');
    desc.className = 'services-all-card-desc section-para';
    desc.textContent = svc.shortDescription || 'Learn more about this service.';
    body.appendChild(title);
    body.appendChild(desc);

    link.appendChild(media);
    link.appendChild(body);
    fragment.appendChild(link);
  });

  grid.appendChild(fragment);
});

