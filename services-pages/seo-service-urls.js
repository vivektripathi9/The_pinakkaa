/**
 * Canonical SEO paths ↔ service ids (must match .htaccess rules).
 * Local preview: use "npx serve" (see ../serve.json) or Apache; plain
 * "python -m http.server" has no URL rewriting — use npx serve or XAMPP.
 */
(function () {
    'use strict';

    var SERVICE_ID_TO_SEO_PATH = {
        'website-designing': '/website-designing-agency-in-bangalore',
        'seo-digital-marketing': '/seo-company-in-bangalore',
        'online-reputation-management': '/orm-services-in-bangalore',
        'social-media-optimization': '/social-media-optimization-services-bangalore',
        'search-engine-marketing': '/search-engine-marketing-agency-bangalore',
        'social-media-marketing': '/social-media-marketing-company-in-bangalore',
        'branding-rebranding': '/branding-rebranding-agency-bangalore',
        'display-advertising': '/display-advertising-agency-bangalore',
        'ecommerce-solutions': '/ecommerce-marketing-agency-bangalore',
        'pr-marketing-services': '/pr-and-marketing-agency-bangalore',
        'software-development': '/software-development-company-bangalore',
        'api-integration': '/api-integration-services-bangalore',
        'email-marketing': '/email-marketing-company-in-bangalore',
        'sms-marketing': '/sms-marketing-company-in-bangalore',
        'whatsapp-marketing': '/whatsapp-marketing-services-bangalore',
        'shopify-website-development': '/shopify-website-development-services-in-bangalore'
    };

    var SEO_PATH_TO_SERVICE_ID = {};
    Object.keys(SERVICE_ID_TO_SEO_PATH).forEach(function (id) {
        var path = SERVICE_ID_TO_SEO_PATH[id];
        var seg = path.replace(/^\/+|\/+$/g, '').split('/').pop();
        SEO_PATH_TO_SERVICE_ID[seg] = id;
    });

    window.SEO_PATH_TO_SERVICE_ID = SEO_PATH_TO_SERVICE_ID;

    window.serviceDetailHref = function (serviceId) {
        var p = SERVICE_ID_TO_SEO_PATH[serviceId];
        if (p) return p;
        return '/service-detail.html?service=' + encodeURIComponent(serviceId);
    };

    window.serviceIdFromUrl = function () {
        var params = new URLSearchParams(window.location.search);
        var fromQuery = params.get('service');
        if (fromQuery) return fromQuery;
        var path = window.location.pathname.replace(/\/$/, '');
        var last = path.split('/').pop() || '';
        return SEO_PATH_TO_SERVICE_ID[last] || null;
    };
})();
