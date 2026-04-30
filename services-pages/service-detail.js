// Service Detail Page Handler
document.addEventListener('DOMContentLoaded', function() {
    // Query (?service=) or clean SEO path (see seo-service-urls.js + .htaccess)
    const serviceId = typeof serviceIdFromUrl === 'function'
        ? serviceIdFromUrl()
        : new URLSearchParams(window.location.search).get('service');
    
    if (!serviceId) {
        // Redirect to services page if no service ID
        window.location.href = 'services.html';
        return;
    }
    
    // Check if servicesData is available
    if (typeof servicesData === 'undefined') {
        console.error('servicesData is not defined. Make sure services-pages.js is loaded before service-detail.js');
        return;
    }
    
    // Find service data
    const service = servicesData.find(s => s.id === serviceId);
    
    if (!service) {
        console.error('Service not found:', serviceId);
        // Redirect if service not found
        window.location.href = 'services.html';
        return;
    }
    
    console.log('Service found:', service.title);
    console.log('Features:', service.features);
    console.log('Benefits:', service.benefits);
    console.log('FAQs:', service.faqs);
    
    // SEO metadata for each service detail page
    const serviceSeoMeta = {
        'website-designing': {
            title: 'Website Design and Development company in Bangalore | Pinakkaa',
            description: 'Pinakkaa is a trusted website design and Development agency in Bangalore delivering creative, user-friendly websites that help businesses grow online. Let\'s build your digital success.'
        },
        'seo-digital-marketing': {
            title: 'Best SEO Agency in Bangalore | SEO Company in Bangalore - Pinakkaa',
            description: 'Pinakkaa is a Result oriented SEO company in Bangalore delivering real results. Improve SERP rankings, boost traffic, and grow your business with our expert team.'
        },
        'online-reputation-management': {
            title: 'ORM Services in Bangalore | Online Reputation Management Company - Pinakkaa',
            description: 'Protect your brand with Pinakkaa\'s Expert ORM services in Bangalore. We remove negative results, improve ratings, build trust, and help your business stand out with a strong online reputation.'
        },
        'social-media-optimization': {
            title: 'SMO Company in Bangalore | Social Media Optimization Agency - Pinakkaa',
            description: 'Pinakkaa is a trusted SMO company in Bangalore helping businesses increase reach, engagement, and leads through powerful social media strategies.'
        },
        'search-engine-marketing': {
            title: 'SEM Services in Bangalore | Search Engine Marketing Agency - Pinakkaa',
            description: 'Pinakkaa, a reliable search engine marketing company in Bangalore, offers performance-driven SEM services in Bangalore to generate leads, increase sales, and deliver strong ROI as a leading SEM agency.'
        },
        'social-media-marketing': {
            title: 'Social Media Marketing agency in Bangalore | SMM Company in Bangalore | Pinakkaa',
            description: 'As a trusted Social Media Marketing agency in Bangalore, Pinakkaa stands out as a reliable SMM company in Bangalore delivering measurable growth through effective social media campaigns.'
        },
        'branding-rebranding': {
            title: 'Branding Agency in Bangalore | Pinakkaa Brand Identity Creators',
            description: 'Why choose Pinakkaa? We go beyond visuals to build brands that stand out. Our branding and rebranding services in Bangalore focus on strategy, identity, and growth.'
        },
        'display-advertising': {
            title: 'Best display advertising agency in Bangalore | Pinakkaa',
            description: 'Pinakkaa offers display advertising services in Bangalore designed to reach the right audience, improve brand visibility, and generate higher engagement and measurable returns.'
        },
        'ecommerce-solutions': {
            title: 'E-Commerce Website Development Agency in Bangalore | Pinakkaa',
            description: 'Pinakkaa offers e-commerce website development Company in Bangalore, building scalable, user-friendly online stores with seamless design, secure systems, and performance-focused solutions.'
        },
        'pr-marketing-services': {
            title: 'Strategic PR and Marketing Solutions in Bangalore | Pinakkaa',
            description: 'Pinakkaa is a PR and marketing agency in Bangalore helping brands build credibility, gain media visibility, and connect with the right audience through targeted campaigns and storytelling.'
        },
        'software-development': {
            title: 'Software Development Company in Bangalore | Pinakkaa Tech Solutions',
            description: 'Get in touch with Pinakkaa, a custom software development company in Bangalore delivering tailored solutions for startups, SMEs, and enterprises, including applications, cloud, and system integration.'
        },
        'api-integration': {
            title: 'API Integration Services in Bangalore | Pinakkaa Seamless System Connectivity',
            description: 'Pinakkaa provides API integration services in Bangalore enabling smooth data flow between your apps, platforms, CRM, ERP and business systems for unified operations.'
        },
        'email-marketing': {
            title: 'Email Marketing Services in Bangalore | Top Email marketing company Bangalore',
            description: 'Pinakkaa Email Marketing Agency in Bangalore that offers result-driven email marketing services to achieve your goals. Hire the Best Email Marketing Company in Bangalore!'
        },
        'sms-marketing': {
            title: 'SMS Marketing Company in Bangalore | Pinakkaa High-Conversion SMS Campaigns',
            description: 'Pinakkaa , SMS Marketing agency in Bangalore creates high-impact SMS marketing campaigns for lead generation, customer retention and instant communication with measurable results.'
        },
        'whatsapp-marketing': {
            title: 'WhatsApp Marketing Agency in Bangalore | Pinakkaa Direct Customer Engagement',
            description: 'Pinakkaa offers WhatsApp marketing services in Bangalore to boost interaction, automate communication, deliver campaigns and increase conversion through personal outreach.'
        },
        'shopify-website-development': {
            title: 'Shopify Website Development Services in Bangalore | Pinakkaa',
            description: 'Pinakkaa offers Shopify website development services in Bangalore, creating scalable, user-friendly online stores designed to improve performance, conversions, and growth.'
        }
    };
    const seoMeta = serviceSeoMeta[service.id] || {};
    const pageTitle = seoMeta.title || `${service.title} in Bangalore | Pinakkaa`;
    const pageDescription = seoMeta.description || (service.shortDescription || service.fullDescription || '')
        .toString()
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 160);
    const canonicalPath = typeof serviceDetailHref === 'function'
        ? serviceDetailHref(service.id)
        : '/service-detail.html?service=' + encodeURIComponent(service.id);
    const canonicalUrl = new URL(canonicalPath, window.location.origin).toString();

    // Update page title
    document.title = pageTitle;

    const setHeadTag = (selector, createTag, attrs) => {
        let el = document.head.querySelector(selector);
        if (!el) {
            el = document.createElement(createTag);
            document.head.appendChild(el);
        }
        Object.keys(attrs).forEach((key) => {
            el.setAttribute(key, attrs[key]);
        });
    };

    setHeadTag('meta[name="description"]', 'meta', {
        name: 'description',
        content: pageDescription
    });
    setHeadTag('meta[name="robots"]', 'meta', {
        name: 'robots',
        content: 'index,follow'
    });
    setHeadTag('link[rel="canonical"]', 'link', {
        rel: 'canonical',
        href: canonicalUrl
    });
    setHeadTag('meta[property="og:title"]', 'meta', {
        property: 'og:title',
        content: pageTitle
    });
    setHeadTag('meta[property="og:description"]', 'meta', {
        property: 'og:description',
        content: pageDescription
    });
    setHeadTag('meta[property="og:url"]', 'meta', {
        property: 'og:url',
        content: canonicalUrl
    });
    setHeadTag('meta[property="og:type"]', 'meta', {
        property: 'og:type',
        content: 'website'
    });
    
    // Update hero section
    const serviceTitleText = document.getElementById('serviceTitleText');
    const serviceBreadcrumbName = document.getElementById('serviceBreadcrumbName');
    const serviceDetailSubtitle = document.getElementById('serviceDetailSubtitle');
    
    if (serviceTitleText) {
        serviceTitleText.textContent = service.title;
    }
    
    if (serviceBreadcrumbName) {
        serviceBreadcrumbName.textContent = service.title;
    }
    
    if (serviceDetailSubtitle) {
        serviceDetailSubtitle.textContent = service.shortDescription;
    }

    // Pinakkaa Advantage (dynamic per selected service)
    const advantageTitleEl = document.getElementById('pinakkaaAdvantageTitle');
    const advantageSubtitleEl = document.getElementById('pinakkaaAdvantageSubtitle');
    const advantageDesc1 = document.getElementById('pinakkaaAdvantageDesc1');
    const advantageDesc2 = document.getElementById('pinakkaaAdvantageDesc2');
    const advantageDesc3 = document.getElementById('pinakkaaAdvantageDesc3');
    const advantageDesc4 = document.getElementById('pinakkaaAdvantageDesc4');

    const truncate = (text, max = 150) => {
        const value = String(text || '').trim();
        if (!value) return '';
        return value.length > max ? value.slice(0, max - 3) + '...' : value;
    };

    const benefitPool = Array.isArray(service.benefits) ? service.benefits : [];
    const featurePool = Array.isArray(service.features) ? service.features : [];

    // Service-specific titles and micro-copy for Pinakkaa Advantage
    const advantagePresets = {
        'website-designing': {
            heading: 'The Pinakkaa Advantage in Website Design',
            items: [
                'Pixel-Perfect Brand Presence',
                'Experience-Led Journeys',
                'Conversion-Ready Layouts',
                'Analytics-Backed Iteration'
            ],
            descriptions: [
                'Standout layouts that feel on-brand, modern, and consistent across every screen.',
                'User journeys mapped to how people actually browse, not how wireframes look.',
                'Page structures guided to enquiry, signup, or checkout with minimal friction.',
                'Decisions driven by heatmaps, form analytics, and real behaviour data.'
            ]
        },
        'seo-digital-marketing': {
            heading: 'The Pinakkaa Advantage in SEO & Growth',
            items: [
                'Search Visibility that Compounds',
                'Content that Earns Clicks',
                'Funnels Built for Conversions',
                'Always-On Measurement'
            ],
            descriptions: [
                'Rankings built to last, not spike: technical, on-page, and authority working together.',
                'Stories written for humans first and algorithms second, so clicks stay and explore.',
                'Journeys tuned for demo, lead, or sale with clear paths from search term to action.',
                'Dashboards you can actually read, focused on traffic quality and revenue.'
            ]
        },
        'social-media-optimization': {
            heading: 'The Pinakkaa Advantage in Social Media',
            items: [
                'Thumb‑Stopping Creatives',
                'Communities, Not Just Followers',
                'Campaigns that Convert',
                'Real-Time Performance Insights'
            ],
            descriptions: [
                'Posts and stories that pause the scroll with clear, on-brand visual language.',
                'Comments and DMs turned into conversations that build real community.',
                'Always-on and burst campaigns tied directly to signups, leads, or sales.',
                'Live metrics instead of monthly surprises, so you can react in real time.'
            ]
        },
        'online-reputation-management': {
            heading: 'The Pinakkaa Advantage in Reputation',
            items: [
                'Proactive Brand Protection',
                'Human, On-Point Responses',
                'Trust that Converts',
                'Always-On Monitoring'
            ],
            descriptions: [
                'Issues spotted before they snowball through constant review and mention tracking.',
                'Replies that sound like your brand, not a script, even in tough situations.',
                'Reviews and testimonials shaped into proof and trust across key touchpoints.',
                '24/7 eyes on review sites and socials, with clear playbooks for action.'
            ]
        },
        'search-engine-marketing': {
            heading: 'The Pinakkaa Advantage in SEM',
            items: [
                'Precision Targeting',
                'Creative that Wins Auctions',
                'ROI-First Optimisation',
                'Transparent Reporting'
            ],
            descriptions: [
                'Ads shown only to real prospects using intent, audience lists, and geos that matter.',
                'Copy and creatives built to win more auctions without burning your budget.',
                'Every rupee mapped to outcomes like leads, pipeline, or revenue, not just clicks.',
                'Plain‑English performance breakdowns with clear keep/kill/scale decisions.'
            ]
        },
        'social-media-marketing': {
            heading: 'The Pinakkaa Advantage in Paid Social',
            items: [
                'Full-Funnel Ad Strategy',
                'Audience Intelligence',
                'Sales-Ready Campaigns',
                'Continuous Experimentation'
            ],
            descriptions: [
                'Cold, warm, and hot journeys aligned so each audience sees the right story.',
                'Segments built from real behaviour, not guesses, and synced across platforms.',
                'Offers and creatives written to move people from interest to actual revenue.',
                'Always-on creative and audience tests so performance improves month after month.'
            ]
        }
    };

    const preset = advantagePresets[service.id] || {
        heading: `The Pinakkaa Advantage in ${service.title}`,
        items: [
            'Better Brand Visibility',
            'Stronger Audience Engagement',
            'Higher Quality Conversions',
            'Decisions Backed by Data'
        ],
        descriptions: [
            'More of the right people seeing a clear, consistent message from your brand.',
            'Interactions that feel genuinely useful instead of just adding to the noise.',
            'Leads and customers that look like your ideal profile, not random clicks.',
            'Next steps guided by numbers you understand, not just vanity metrics.'
        ]
    };

    const itemTitleEls = document.querySelectorAll('.pinakkaa-advantage-item-title');
    const iconImgs = document.querySelectorAll('.pinakkaa-advantage-icon-img');

    const iconSets = {
        'website-designing': [
            'services-pages/icons/graphic_11183291.svg',
            'services-pages/icons/idea_11331946.svg',
            'services-pages/icons/view_14014506.svg',
            'services-pages/icons/eye_4367508.svg'
        ],
        'seo-digital-marketing': [
            'services-pages/icons/growth_12951171.svg',
            'services-pages/icons/business-strategy_7897981.svg',
            'services-pages/icons/objective_12209885.svg',
            'services-pages/icons/strategic-plan_7897776.svg'
        ],
        'social-media-optimization': [
            'services-pages/icons/speaker_17806860.png',
            'services-pages/icons/respect_12198286.svg',
            'services-pages/icons/handshake_8252396.svg',
            'services-pages/icons/gmail_17844661.svg'
        ],
        'online-reputation-management': [
            'services-pages/icons/eye_4367508.svg',
            'services-pages/icons/respect_12198286.svg',
            'services-pages/icons/handshake_8252396.svg',
            'services-pages/icons/objective_12209885.svg'
        ],
        'search-engine-marketing': [
            'services-pages/icons/profits_7895066.svg',
            'services-pages/icons/growth_12951171.svg',
            'services-pages/icons/business-strategy_7897981.svg',
            'services-pages/icons/strategic-plan_7897776.svg'
        ],
        'social-media-marketing': [
            'services-pages/icons/speaker_17806860.png',
            'services-pages/icons/growth_12951171.svg',
            'services-pages/icons/handshake_8252396.svg',
            'services-pages/icons/gmail_17844661.svg'
        ]
    };

    const fallbackIcons = [
        'services-pages/icons/handshake_8252396.svg',
        'services-pages/icons/growth_12951171.svg',
        'services-pages/icons/profits_7895066.svg',
        'services-pages/icons/business-strategy_7897981.svg'
    ];
    const iconSet = iconSets[service.id] || fallbackIcons;

    if (advantageTitleEl) {
        advantageTitleEl.textContent = preset.heading;
    }

    preset.items.forEach((label, index) => {
        if (itemTitleEls[index]) {
            itemTitleEls[index].textContent = label;
        }
    });

    iconSet.forEach((src, index) => {
        if (iconImgs[index]) {
            iconImgs[index].src = src;
            iconImgs[index].alt = preset.items[index] || 'Pinakkaa advantage';
        }
    });

    if (advantageSubtitleEl) {
        advantageSubtitleEl.textContent = `When you partner with Pinakkaa for ${service.title}, you don't just get a service, you get a growth partner.`;
    }

    const shortDescs = preset.descriptions || [];
    if (advantageDesc1) advantageDesc1.textContent = truncate(shortDescs[0] || '');
    if (advantageDesc2) advantageDesc2.textContent = truncate(shortDescs[1] || '');
    if (advantageDesc3) advantageDesc3.textContent = truncate(shortDescs[2] || '');
    if (advantageDesc4) advantageDesc4.textContent = truncate(shortDescs[3] || '');

    // Why Choose Pinakkaa for [Service]
    const whyChooseSection = document.getElementById('whyChooseService');
    const whyChooseNameEl = document.getElementById('whyChooseServiceName');
    const whyChooseSubtitleEl = document.getElementById('whyChooseSubtitle');
    const whyChooseGrid = document.getElementById('whyChooseGrid');

    const whyPresets = {
        'website-designing': {
            subtitle: 'Design, UX, and performance handled under one roof – from first wireframe to final launch.',
            items: [
                {
                    icon: 'services-pages/New_icons/lamp_9935981.svg',
                    title: 'Strategy Before Screens',
                    desc: 'We start with brand, users, and outcomes, then design pages that each have a clear job.'
                },
                {
                    icon: 'services-pages/New_icons/view_14014506.svg',
                    title: 'Pixel-Level Craft',
                    desc: 'Layouts, typography, and motion tuned to feel premium on desktop and mobile.'
                },
                {
                    icon: 'services-pages/New_icons/sand-clock_11286687.svg',
                    title: 'Fast, Stable Builds',
                    desc: 'Clean code and fast load times so your site feels sharp, not sluggish.'
                }
            ]
        },
        'seo-digital-marketing': {
            subtitle: 'Technical SEO, content, and authority rolled into one program focused on true business KPIs.',
            items: [
                {
                    icon: 'services-pages/New_icons/achievement_7871901.svg',
                    title: 'Proven Playbooks',
                    desc: 'Battle‑tested SEO frameworks adapted to your domain, not copy‑pasted checklists.'
                },
                {
                    icon: 'services-pages/New_icons/calendar_9642627.svg',
                    title: 'Compounding Gains',
                    desc: 'Roadmaps planned quarter by quarter so improvements stack instead of reset.'
                },
                {
                    icon: 'services-pages/New_icons/eye_4367508.svg',
                    title: 'Radical Transparency',
                    desc: 'Clear tracking and reporting so you always know what moved the needle and why.'
                }
            ]
        },
        'social-media-optimization': {
            subtitle: 'Content, cadence, and community management tuned to how your audience actually behaves.',
            items: [
                {
                    icon: 'services-pages/New_icons/speaker_17806860.png',
                    title: 'Distinct Brand Voice',
                    desc: 'Posts and stories that sound like you, not like a generic social media template.'
                },
                {
                    icon: 'services-pages/New_icons/heart_9548779.svg',
                    title: 'Community Focus',
                    desc: 'DMs and comments turned into real conversations that build loyalty over time.'
                },
                {
                    icon: 'services-pages/New_icons/gmail_17844661.svg',
                    title: 'Always-On Pipeline',
                    desc: 'A steady stream of ideas and assets so your profiles never go silent.'
                }
            ]
        },
        'online-reputation-management': {
            subtitle: 'Monitoring, response, and recovery plans that protect the trust you have already earned.',
            items: [
                {
                    icon: 'services-pages/New_icons/eye_4367508.svg',
                    title: 'Constant Monitoring',
                    desc: 'Mentions and reviews tracked so small issues are caught long before they explode.'
                },
                {
                    icon: 'services-pages/New_icons/respect_12198286.svg',
                    title: 'Human Responses',
                    desc: 'Reply frameworks that respect both your brand voice and the customer’s situation.'
                },
                {
                    icon: 'services-pages/New_icons/flower_17891894.svg',
                    title: 'Rebuild & Strengthen',
                    desc: 'Positive content and review strategies that gradually shift sentiment in your favour.'
                }
            ]
        },
        'search-engine-marketing': {
            subtitle: 'Hands-on campaign management built for profitable growth, not just higher spend.',
            items: [
                {
                    icon: 'services-pages/New_icons/achievement_7871901.svg',
                    title: 'Performance DNA',
                    desc: 'Bids, audiences, and creatives tuned from live data, not set‑and‑forget rules.'
                },
                {
                    icon: 'services-pages/New_icons/view_14014506.svg',
                    title: 'Goal-Linked KPIs',
                    desc: 'Every campaign wired to leads, pipeline, or revenue instead of surface‑level metrics.'
                },
                {
                    icon: 'services-pages/New_icons/sand-clock_11286687.svg',
                    title: 'Fast Test Cycles',
                    desc: 'New angles tested quickly so winning ideas get budget and weak ones are cut.'
                }
            ]
        },
        'social-media-marketing': {
            subtitle: 'Paid social designed as a full funnel – awareness, consideration, and conversion.',
            items: [
                {
                    icon: 'services-pages/New_icons/speaker_17806860.png',
                    title: 'Platform-Native Ads',
                    desc: 'Creative built for reels, stories, and feeds instead of one resized master file.'
                },
                {
                    icon: 'services-pages/New_icons/flower_18376638.svg',
                    title: 'Deep Audience Maps',
                    desc: 'Cold, warm, and hot segments mapped to messaging that matches intent.'
                },
                {
                    icon: 'services-pages/New_icons/gift_9428742.svg',
                    title: 'Offer Strategy',
                    desc: 'Hooks, bundles, and promos crafted to turn attention into trackable revenue.'
                }
            ]
        }
    };

    if (whyChooseSection && whyChooseGrid && whyChooseNameEl) {
        const config = whyPresets[service.id];
        whyChooseNameEl.textContent = `${service.title}?`;

        if (!config) {
            if (whyChooseSubtitleEl) {
                whyChooseSubtitleEl.textContent = 'You get a team that thinks about strategy, execution, and reporting as one connected system.';
            }
            whyChooseGrid.innerHTML = `
                <div class="why-choose-card">
                    <div class="why-choose-icon"><img src="services-pages/New_icons/lamp_9935981.svg" alt=""></div>
                    <h3 class="why-choose-card-title">Strategic Partner</h3>
                    <p class="why-choose-card-desc">We learn your model first, then pick the mix of channels and tactics that actually fits.</p>
                </div>
                <div class="why-choose-card">
                    <div class="why-choose-icon"><img src="services-pages/New_icons/achievement_7871901.svg" alt=""></div>
                    <h3 class="why-choose-card-title">Execution Obsessed</h3>
                    <p class="why-choose-card-desc">Clear plans, weekly movement, and campaigns that keep improving instead of stalling.</p>
                </div>
                <div class="why-choose-card">
                    <div class="why-choose-icon"><img src="services-pages/New_icons/calendar_9642627.svg" alt=""></div>
                    <h3 class="why-choose-card-title">Honest Reporting</h3>
                    <p class="why-choose-card-desc">Simple dashboards and next‑step recommendations you can act on immediately.</p>
                </div>
            `;
        } else {
            if (whyChooseSubtitleEl) {
                whyChooseSubtitleEl.textContent = config.subtitle;
            }
            whyChooseGrid.innerHTML = config.items.map(item => `
                <div class="why-choose-card">
                    <div class="why-choose-icon">
                        <img src="${item.icon}" alt="">
                    </div>
                    <h3 class="why-choose-card-title">${item.title}</h3>
                    <p class="why-choose-card-desc">${item.desc}</p>
                </div>
            `).join('');
        }
    }
    
    // Update service video/image
    const serviceVideoSrc = document.getElementById('serviceVideoSrc');
    const serviceImageSrc = document.getElementById('serviceImageSrc');
    const serviceBannerSlogan = document.getElementById('serviceBannerSlogan');
    
    if (serviceVideoSrc && serviceImageSrc) {
        if (service.video) {
            // Use video if available
            const source = serviceVideoSrc.querySelector('source');
            if (source) {
                source.src = service.video;
                serviceVideoSrc.load();
            }
            serviceVideoSrc.setAttribute('aria-label', service.title);
            serviceVideoSrc.style.display = 'block';
            serviceImageSrc.style.display = 'none';
        } else if (service.image) {
            // Fallback to image if no video
            serviceImageSrc.src = service.image;
            serviceImageSrc.alt = service.title;
            serviceImageSrc.style.display = 'block';
            serviceVideoSrc.style.display = 'none';
        }
    }
    
    // Update banner slogan
    if (serviceBannerSlogan && service.bannerSlogan) {
        serviceBannerSlogan.textContent = service.bannerSlogan;
        serviceBannerSlogan.style.display = 'block';
    } else if (serviceBannerSlogan) {
        serviceBannerSlogan.style.display = 'none';
    }
    
    // Update service description
    const serviceDetailDescription = document.getElementById('serviceDetailDescription');
    if (serviceDetailDescription) {
        serviceDetailDescription.innerHTML = `
            <p>${service.fullDescription}</p>
        `;
    }
    
    // Helper function to check if feature/benefit is object or string
    const isObject = (item) => typeof item === 'object' && item !== null && !Array.isArray(item) && item.hasOwnProperty('title');
    
    // Ensure minimum counts for sections
    const ensureMinimumItems = (arr, min, type) => {
        const list = Array.isArray(arr) ? arr.slice() : [];
        const makeItem = (i) => {
            if (type === 'feature') {
                const fallbackFeatures = [
                    { title: 'Advanced Targeting', description: 'Reach the right audience with precise filters, intent signals, and contextual placements.' },
                    { title: 'Custom Reporting', description: 'Track KPIs in clear dashboards with weekly/monthly insights your team can act on.' },
                    { title: 'A/B Testing Framework', description: 'Continuously test creatives, copy, and funnels to improve performance over time.' },
                    { title: 'Automation Workflows', description: 'Automate routine steps like tagging, routing, and alerts to save time.' },
                    { title: 'Cross-Channel Integration', description: 'Unify data and messaging across web, search, social, and email for consistency.' },
                    { title: 'Quality Assurance Review', description: 'Pre-launch and ongoing QA to maintain accuracy, speed, and reliability.' }
                ];
                return fallbackFeatures[(i - 1) % fallbackFeatures.length];
            }
            if (type === 'benefit') {
                const fallbackBenefits = [
                    { title: 'Lower Cost per Result', description: 'Reduce acquisition costs with better targeting, bids, and creative optimization.' },
                    { title: 'Higher Conversion Rate', description: 'Improve on-site journeys and ad relevance to lift conversions.' },
                    { title: 'Improved Lead Quality', description: 'Attract decision-makers and high-intent users more likely to buy.' },
                    { title: 'Faster Time to Value', description: 'Launch quickly with proven playbooks and iterate based on data.' },
                    { title: 'Scalable Growth', description: 'Build a foundation that supports higher budgets without performance drop.' },
                    { title: 'Actionable Insights', description: 'Get clear recommendations backed by analytics and real user behavior.' }
                ];
                return fallbackBenefits[(i - 1) % fallbackBenefits.length];
            }
            const fallbackFaqs = [
                { question: 'How long until I see meaningful results?', answer: 'Timelines vary by channel. Paid campaigns show movement in weeks; SEO takes 3–6 months for sustained gains.' },
                { question: 'What budget should I start with?', answer: 'We propose an INR-based test budget aligned to goals and industry CPC/CPM, then scale with performance.' },
                { question: 'Can you work with our in-house team?', answer: 'Yes. We collaborate with internal teams and share clear roadmaps, tasks, and reporting.' },
                { question: 'Do you provide detailed reporting?', answer: 'Absolutely. Expect transparent dashboards and executive summaries with next-step actions.' },
                { question: 'Will you sign NDAs and follow compliance?', answer: 'Yes. We adhere to brand, data, and legal guidelines and can sign NDAs on request.' },
                { question: 'What makes your approach different?', answer: 'Precision targeting, creative excellence, and iterative optimization focused on measurable outcomes.' },
                { question: 'Do you handle landing pages and creatives?', answer: 'We can support strategy, copy, design, and development as needed to improve performance.' },
                { question: 'How do we get started?', answer: 'We begin with discovery, align on goals, set metrics, and launch a pilot to validate assumptions.' }
            ];
            return fallbackFaqs[(i - 1) % fallbackFaqs.length];
        };
        for (let i = list.length + 1; i <= min; i++) list.push(makeItem(i));
        return list;
    };
    
    // Update features (show all, ensure at least 6)
    const serviceFeatures = document.getElementById('serviceFeatures');
    const normalizedFeatures = ensureMinimumItems(service.features, 6, 'feature');
    if (serviceFeatures && normalizedFeatures.length > 0) {
        const firstFeature = normalizedFeatures[0];
        const useGridLayout = isObject(firstFeature);
        
        const featuresHTML = normalizedFeatures.map((feature, index) => {
            if (isObject(feature)) {
                // Shorten description to max 100 characters
                const shortDesc = feature.description.length > 100 
                    ? feature.description.substring(0, 100) + '...' 
                    : feature.description;
                return `
                    <div class="feature-item card fade-in" style="animation-delay: ${index * 0.1}s">
                        <div class="feature-header">
                            <h4 class="feature-title">${feature.title}</h4>
                        </div>
                        <p class="feature-description">${shortDesc}</p>
                    </div>
                `;
            } else {
                return `<li class="fade-in" style="animation-delay: ${index * 0.1}s">${feature}</li>`;
            }
        }).join('');
        
        serviceFeatures.innerHTML = `
            <h3><span class="text-purple">Key</span> Features</h3>
            ${useGridLayout ? `<div class="features-hscroll hscroll">${featuresHTML}</div>` : `<ul>${featuresHTML}</ul>`}
        `;
        
        // Make sure it's visible
        serviceFeatures.style.display = 'block';
        serviceFeatures.style.opacity = '1';
    } else if (serviceFeatures) {
        serviceFeatures.innerHTML = '<p>Features information coming soon.</p>';
    }
    
    // Update benefits (show all, ensure at least 6)
    const serviceBenefits = document.getElementById('serviceBenefits');
    const normalizedBenefits = ensureMinimumItems(service.benefits, 6, 'benefit');
    if (serviceBenefits && normalizedBenefits.length > 0) {
        const firstBenefit = normalizedBenefits[0];
        const useGridLayout = isObject(firstBenefit);
        
        const benefitsHTML = normalizedBenefits.map((benefit, index) => {
            if (isObject(benefit)) {
                // Shorten description to max 100 characters
                const shortDesc = benefit.description.length > 100 
                    ? benefit.description.substring(0, 100) + '...' 
                    : benefit.description;
                return `
                    <div class="benefit-item card fade-in" style="animation-delay: ${index * 0.1}s">
                        <div class="benefit-header">
                            <h4 class="benefit-title">${benefit.title}</h4>
                        </div>
                        <p class="benefit-description">${shortDesc}</p>
                    </div>
                `;
            } else {
                return `<li class="fade-in" style="animation-delay: ${index * 0.1}s">${benefit}</li>`;
            }
        }).join('');
        
        serviceBenefits.innerHTML = `
            <h3><span class="text-purple">Key</span> Benefits</h3>
            ${useGridLayout ? `<div class="benefits-hscroll hscroll">${benefitsHTML}</div>` : `<ul>${benefitsHTML}</ul>`}
        `;
        
        // Make sure it's visible
        serviceBenefits.style.display = 'block';
        serviceBenefits.style.opacity = '1';
    } else if (serviceBenefits) {
        serviceBenefits.innerHTML = '<p>Benefits information coming soon.</p>';
    }
    
    // Update FAQ (show all, ensure at least 8)
    const serviceFAQ = document.getElementById('serviceFAQ');
    const normalizedFaqs = ensureMinimumItems(service.faqs, 8, 'faq');
    if (serviceFAQ && normalizedFaqs.length > 0) {
        // Expand short FAQ answers with clearer guidance
        const expandAnswer = (question, answer, serviceName) => {
            const base = String(answer || '').trim();
            if (base.length >= 220) return base;
            
            const q = String(question || '').toLowerCase();
            const extra = [];
            
            if (/(cost|price|pricing|budget|charge)/i.test(q)) {
                extra.push('We provide a phased estimate in INR that separates media spend from our service fees, with options for monthly retainers or project-based engagements.');
            }
            if (/(how long|result|when|timeline|timeframe|roi)/i.test(q)) {
                extra.push('For paid channels you will typically see directional results within 2–4 weeks; SEO and organic programs usually take 3–6 months to compound and show strong lift.');
            }
            if (/(report|tracking|analytics|measure|kpi|dashboard)/i.test(q)) {
                extra.push('You receive a simple dashboard plus a monthly summary highlighting KPIs, insights, and recommended next steps, so decisions are always data‑driven.');
            }
            if (/(industry|domain|sector|niche)/i.test(q)) {
                extra.push('Our approach is adaptable across industries; we start with discovery, map target personas, benchmark competitors, and tailor creatives and keywords accordingly.');
            }
            if (/(contract|lock|term|commitment|cancellation)/i.test(q)) {
                extra.push('Engagements are flexible. Most clients start with a 3‑month plan to validate impact, then extend based on performance and roadmap.');
            }
            if (/(team|in‑house|collaborate|work with us|handoff)/i.test(q)) {
                extra.push('We collaborate seamlessly with in‑house teams, sharing roadmaps, tasks, and clear ownership to avoid duplication and accelerate delivery.');
            }
            if (/(creative|asset|landing|page|copy|design)/i.test(q)) {
                extra.push('We can support copy, design, and landing pages. Where you have existing assets, we iterate through structured A/B tests to find winners faster.');
            }
            if (/(start|onboard|next step|how do i)/i.test(q)) {
                extra.push(`Getting started is simple: book a discovery call, align on goals and KPIs for ${serviceName}, approve the plan and INR budget, and we launch a pilot within days.`);
            }
            if (extra.length === 0) {
                extra.push('We follow a clear process: discovery, strategy, execution, and continuous optimization with transparent communication and measurable outcomes.');
            }
            
            const expanded = `${base} ${extra.join(' ')}`.trim();
            return expanded.length > 800 ? expanded.slice(0, 780) + '...' : expanded;
        };
        
        const expandedFaqs = normalizedFaqs.map(f => ({
            question: f.question,
            answer: expandAnswer(f.question, f.answer, service.title)
        }));
        
        serviceFAQ.innerHTML = `
            <h3><span class="text-purple">Frequently Asked</span> Questions</h3>
            <div class="faq-container">
                ${expandedFaqs.map((faq, index) => `
                    <div class="faq-item fade-in" style="animation-delay: ${index * 0.1}s">
                        <div class="faq-question">
                            <h4>${faq.question}</h4>
                            <span class="faq-icon">+</span>
                        </div>
                        <div class="faq-answer">
                            <p>${faq.answer}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Make sure it's visible
        serviceFAQ.style.display = 'block';
        serviceFAQ.style.opacity = '1';
        
        // Initialize FAQ accordion after a short delay to ensure DOM is ready
        setTimeout(() => {
            initializeFAQ();
        }, 100);
    } else if (serviceFAQ) {
        serviceFAQ.innerHTML = '<p>FAQ information coming soon.</p>';
    }
    
    // Update sidebar services list
    const sidebarServicesList = document.getElementById('sidebarServicesList');
    if (sidebarServicesList) {
        // Get other services (exclude current)
        const otherServices = servicesData.filter(s => s.id !== serviceId).slice(0, 5);
        
        sidebarServicesList.innerHTML = otherServices.map(s => 
            `<li><a href="${typeof serviceDetailHref === 'function' ? serviceDetailHref(s.id) : 'service-detail.html?service=' + encodeURIComponent(s.id)}">${s.title}</a></li>`
        ).join('');
    }
    
    // Load related services section
    loadRelatedServices(service);
    
    // Ensure content sections are visible
    const contentSections = document.querySelectorAll('.service-features, .service-benefits, .service-faq');
    contentSections.forEach(section => {
        section.style.display = 'block';
        section.style.opacity = '1';
        section.style.visibility = 'visible';
    });
    
    // Add fade-in animation with scroll observer
    const elements = document.querySelectorAll('.service-detail-main, .service-detail-sidebar');
    elements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.animationDelay = `${index * 0.2}s`;
        el.style.opacity = '1';
    });
    
    // Initialize scroll observer for animations (but don't hide content)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elements.forEach(el => observer.observe(el));
    
    // Add interactive features to features and benefits lists
    const listItems = document.querySelectorAll('.service-features li, .service-benefits li');
    listItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            item.style.transition = 'all 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 50);
        
        // Add click interaction
        item.addEventListener('click', function() {
            this.style.transform = 'translateX(10px) scale(1.05)';
            setTimeout(() => {
                this.style.transform = 'translateX(0) scale(1)';
            }, 200);
        });
    });
    
    // Add image zoom effect
    const serviceImage = document.getElementById('serviceImageSrc');
    if (serviceImage) {
        serviceImage.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.5s ease';
        });
        
        serviceImage.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    // Add sidebar card animations
    const sidebarCards = document.querySelectorAll('.service-sidebar-card');
    sidebarCards.forEach((card, index) => {
        card.classList.add('scale-in');
        card.style.animationDelay = `${index * 0.2}s`;
        observer.observe(card);
    });
    
    // Initialize scroll progress
    const addScrollProgress = () => {
        const progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) return;
        
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.pageYOffset / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    };
    
    addScrollProgress();
});

// Load Related Services Section
function loadRelatedServices(currentService) {
    const relatedServicesSection = document.getElementById('relatedServicesSection');
    if (!relatedServicesSection) return;
    
    // Get other services with videos only (exclude current) and limit to 6
    const otherServices = servicesData
        .filter(s => s.id !== currentService.id && s.video)
        .slice(0, 6);
    
    if (otherServices.length === 0) {
        relatedServicesSection.style.display = 'none';
        return;
    }
    
    relatedServicesSection.innerHTML = `
        <h3 class="related-services-title">
            <span class="text-purple">Explore</span> Other Services
        </h3>
        <div class="related-services-grid">
            ${otherServices.map((service, index) => `
                <a href="${typeof serviceDetailHref === 'function' ? serviceDetailHref(service.id) : 'service-detail.html?service=' + encodeURIComponent(service.id)}" class="related-service-card fade-in" style="animation-delay: ${index * 0.1}s">
                    <div class="related-service-image">
                        ${service.video ? `
                            <video autoplay loop muted playsinline>
                                <source src="${service.video}" type="video/mp4">
                            </video>
                        ` : service.image ? `
                            <img src="${service.image}" alt="${service.title}">
                        ` : ''}
                    </div>
                    <div class="related-service-content">
                        <h4 class="related-service-name">${service.title}</h4>
                        <p class="related-service-description">${service.shortDescription}</p>
                        <span class="related-service-link">Learn More →</span>
                    </div>
                </a>
            `).join('')}
        </div>
        <div class="services-cta-actions" style="margin-top: 28px;">
            <a href="services.html" class="services-cta-button">Explore more services</a>
        </div>
    `;
    
    // Make sure it's visible
    relatedServicesSection.style.display = 'block';
    relatedServicesSection.style.opacity = '1';
}

// FAQ Accordion Functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');
        
        // Set initial state
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';
        item.classList.remove('active');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQs
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-icon');
                    otherAnswer.style.maxHeight = '0';
                    otherAnswer.style.opacity = '0';
                    otherIcon.textContent = '+';
                    otherIcon.style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current FAQ
            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = '0';
                answer.style.opacity = '0';
                icon.textContent = '+';
                icon.style.transform = 'rotate(0deg)';
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.opacity = '1';
                icon.textContent = '−';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}
