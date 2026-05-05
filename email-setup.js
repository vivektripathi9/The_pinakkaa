// Shared email handling for contact, newsletter, and CTA forms.
(function () {
    function getConfig() {
        return window.SITE_EMAIL_CONFIG || {};
    }

    function isConfigured() {
        const cfg = getConfig();
        return (
            cfg.provider === 'emailjs' &&
            cfg.publicKey &&
            cfg.serviceId &&
            cfg.templateId &&
            !String(cfg.publicKey).includes('YOUR_') &&
            !String(cfg.serviceId).includes('YOUR_') &&
            !String(cfg.templateId).includes('YOUR_')
        );
    }

    async function sendWithEmailJS(payload) {
        const cfg = getConfig();
        if (!window.emailjs) {
            throw new Error('EmailJS SDK not loaded');
        }
        const publicKey = String(cfg.publicKey || '').trim();
        const serviceId = String(cfg.serviceId || '').trim();
        const templateId = String(cfg.templateId || '').trim();
        window.emailjs.init(publicKey);

        function normalizeRecipient(value) {
            const text = String(value || '').trim();
            const match = text.match(/mailto:([^)\s]+)/i);
            if (match && match[1]) return match[1].trim();
            return text.replace(/^\[|\]$/g, '');
        }

        const recipients = Array.isArray(cfg.recipients)
            ? cfg.recipients.map(normalizeRecipient).filter(Boolean)
            : [];
        const templateParams = {
            ...payload,
            to_email: recipients.join(','),
            recipient_emails: recipients.join(', '),
            reply_to: payload.email || '',
            subject: payload.subject || payload.formType || 'Website enquiry'
        };

        // Debug log to verify config is loaded in browser.
        console.log(window.SITE_EMAIL_CONFIG);

        await window.emailjs.send(
            serviceId,
            templateId,
            templateParams
        );
    }

    async function sendEmail(payload) {
        const cfg = getConfig();
        if (cfg.provider !== 'emailjs' || !isConfigured()) {
            throw new Error('Email is not configured. Update email-config.js');
        }
        await sendWithEmailJS(payload);
    }

    function setButtonLoading(button, isLoading, loadingText) {
        if (!button) return;
        if (isLoading) {
            button.dataset.originalText = button.textContent || '';
            button.disabled = true;
            button.textContent = loadingText;
        } else {
            button.disabled = false;
            if (button.dataset.originalText) {
                button.textContent = button.dataset.originalText;
            }
        }
    }

    function wireContactForms() {
        const forms = document.querySelectorAll('.contact-form, #contactForm');
        forms.forEach(function (form) {
            if (form.dataset.emailWired === 'true') return;
            form.dataset.emailWired = 'true';

            form.addEventListener('submit', async function (e) {
                e.preventDefault();

                const submitBtn = form.querySelector('button[type="submit"]');
                setButtonLoading(submitBtn, true, 'Sending...');

                const formData = new FormData(form);
                const payload = {
                    formType: 'Contact Form',
                    name: (formData.get('name') || '').toString().trim(),
                    email: (formData.get('email') || '').toString().trim(),
                    phone: (formData.get('phone') || '').toString().trim(),
                    subject: (formData.get('subject') || '').toString().trim() || 'Website Contact',
                    message: (formData.get('message') || '').toString().trim()
                };

                try {
                    await sendEmail(payload);
                    alert('Thanks! Your message has been sent.');
                    form.reset();
                } catch (err) {
                    alert('Unable to send right now. Please try again.');
                    console.error(err);
                } finally {
                    setButtonLoading(submitBtn, false);
                }
            });
        });
    }

    function wireNewsletterForm() {
        const forms = document.querySelectorAll('.about-newsletter-form');
        forms.forEach(function (form) {
            if (form.dataset.emailWired === 'true') return;
            form.dataset.emailWired = 'true';

            form.addEventListener('submit', async function (e) {
                e.preventDefault();

                const submitBtn = form.querySelector('button[type="submit"]');
                setButtonLoading(submitBtn, true, 'Sending...');

                const input = form.querySelector('input[type="email"]');
                const email = input ? input.value.trim() : '';
                if (!email) {
                    alert('Please enter an email address.');
                    setButtonLoading(submitBtn, false);
                    return;
                }

                try {
                    await sendEmail({
                        formType: 'Newsletter',
                        email: email,
                        subject: 'Newsletter signup',
                        message: 'New newsletter signup from website'
                    });
                    alert('You are subscribed successfully.');
                    form.reset();
                } catch (err) {
                    alert('Unable to send right now. Please try again.');
                    console.error(err);
                } finally {
                    setButtonLoading(submitBtn, false);
                }
            });
        });
    }

    function wireSignupForms() {
        const forms = document.querySelectorAll('.signup-form, #signupForm, form[data-emailjs="signup"]');
        forms.forEach(function (form) {
            if (form.dataset.emailWired === 'true') return;
            form.dataset.emailWired = 'true';

            form.addEventListener('submit', async function (e) {
                e.preventDefault();

                const submitBtn = form.querySelector('button[type="submit"]');
                setButtonLoading(submitBtn, true, 'Sending...');

                const formData = new FormData(form);
                const name = (formData.get('name') || '').toString().trim();
                const email = (formData.get('email') || '').toString().trim();
                const phone = (formData.get('phone') || '').toString().trim();
                const subject = (formData.get('subject') || '').toString().trim();

                if (!name || !email || !phone || !subject) {
                    alert('Please fill in name, phone number, email, and subject.');
                    setButtonLoading(submitBtn, false);
                    return;
                }

                try {
                    await sendEmail({
                        formType: 'Signup Form',
                        name: name,
                        email: email,
                        phone: phone,
                        subject: subject,
                        message:
                            'New signup (Get Started)\nSubject: ' +
                            subject +
                            '\nPhone: ' +
                            phone
                    });
                    alert('Signup submitted successfully.');
                    form.dispatchEvent(new CustomEvent('pinakkaa-signup-success', { bubbles: true }));
                    form.reset();
                } catch (err) {
                    alert('Unable to send right now. Please try again.');
                    console.error(err);
                } finally {
                    setButtonLoading(submitBtn, false);
                }
            });
        });
    }

    function wireCtaForms() {
        const ctaBlocks = document.querySelectorAll('.cta-form');
        ctaBlocks.forEach(function (block) {
            if (block.dataset.emailWired === 'true') return;
            block.dataset.emailWired = 'true';

            const emailInput = block.querySelector('input[type="email"], .email-input');
            const submitBtn = block.querySelector('button[type="submit"], .send-button');
            if (!emailInput || !submitBtn) return;

            const submitFn = async function () {
                const email = emailInput.value.trim();
                if (!email) {
                    alert('Please enter an email address.');
                    return;
                }
                setButtonLoading(submitBtn, true, 'Sending...');
                try {
                    await sendEmail({
                        formType: 'CTA Form',
                        email: email,
                        subject: 'CTA enquiry',
                        message: 'User submitted CTA email'
                    });
                    alert('Thanks! We will contact you soon.');
                    emailInput.value = '';
                } catch (err) {
                    alert('Unable to send right now. Please try again.');
                    console.error(err);
                } finally {
                    setButtonLoading(submitBtn, false);
                }
            };

            if (block.tagName.toLowerCase() === 'form') {
                block.addEventListener('submit', function (e) {
                    e.preventDefault();
                    submitFn();
                });
            } else {
                submitBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    submitFn();
                });
                emailInput.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        submitFn();
                    }
                });
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        wireContactForms();
        wireNewsletterForm();
        wireSignupForms();
        wireCtaForms();
    });
})();

