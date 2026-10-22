/**
 * Service links must always point at service-detail.html, which is a real file.
 * Pretty paths below are public aliases. Each one also has a folder with
 * index.html so the page still opens when the host does not rewrite URLs.
 */
(function () {
    'use strict';

    var SERVICE_ID_TO_SEO_PATH = {
        'website-designing': '/website-designing-agency-in-bangalore',
        'seo-digital-marketing': '/seo-company-in-bangalore',
        'online-reputation-management': '/orm-services-in-bangalore',
        'social-media-optimization': '/social-media-optimization-services-bangalore',
        'search-engine-marketing': '/search-engine-marketing-agency-bangalore',
        'social-media-marketing': '/social-media-marketing-agency-bangalore',
        'branding-rebranding': '/branding-rebranding-agency-bangalore',
        'display-advertising': '/display-advertising-agency-bangalore',
        'ecommerce-solutions': '/ecommerce-marketing-agency-bangalore',
        'pr-marketing-services': '/pr-and-marketing-agency-bangalore',
        'software-development': '/software-development-services-bangalore',
        'api-integration': '/api-integration-services-bangalore',
        'email-marketing': '/email-marketing-services-bangalore',
        'sms-marketing': '/sms-marketing-services-bangalore',
        'whatsapp-marketing': '/whatsapp-marketing-services-bangalore',
        'shopify-website-development': '/shopify-website-development-services-bangalore'
    };

    var SEO_PATH_TO_SERVICE_ID = {};
    Object.keys(SERVICE_ID_TO_SEO_PATH).forEach(function (id) {
        var path = SERVICE_ID_TO_SEO_PATH[id];
        var seg = path.replace(/^\/+|\/+$/g, '').split('/').pop();
        SEO_PATH_TO_SERVICE_ID[seg] = id;
    });

    window.SEO_PATH_TO_SERVICE_ID = SEO_PATH_TO_SERVICE_ID;

    function serviceIdFromValue(value) {
        var raw = String(value || '').trim();
        if (!raw) return '';
        if (raw.charAt(0) === '/' || raw.indexOf('http') === 0) {
            var path = raw.split('?')[0].replace(/\/+$/, '');
            var seg = path.split('/').pop();
            return SEO_PATH_TO_SERVICE_ID[seg] || '';
        }
        return SERVICE_ID_TO_SEO_PATH[raw] ? raw : '';
    }

    // Clickable links. Never return a pretty path; those are not files.
    window.serviceDetailHref = function (serviceId) {
        var id = serviceIdFromValue(serviceId);
        if (!id) return 'services.html';
        return 'service-detail.html?service=' + encodeURIComponent(id);
    };

    window.serviceCanonicalPath = function (serviceId) {
        var id = serviceIdFromValue(serviceId);
        return SERVICE_ID_TO_SEO_PATH[id] || '/services.html';
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
