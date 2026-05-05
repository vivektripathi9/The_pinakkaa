(function () {
    var modalOpenClass = 'signup-modal--open';
    var lastFocusEl = null;

    function getModal() {
        return document.getElementById('signupModal');
    }

    function isOpen(modal) {
        return modal && modal.classList.contains(modalOpenClass);
    }

    function openModal(modal) {
        if (!modal || isOpen(modal)) return;
        lastFocusEl = document.activeElement;
        modal.classList.add(modalOpenClass);
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        var firstInput = modal.querySelector('input[name="name"], input:not([type="hidden"])');
        window.requestAnimationFrame(function () {
            if (firstInput) firstInput.focus();
        });
    }

    function closeModal(modal) {
        if (!modal || !isOpen(modal)) return;
        modal.classList.remove(modalOpenClass);
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocusEl && typeof lastFocusEl.focus === 'function') {
            lastFocusEl.focus();
        }
        lastFocusEl = null;
    }

    function normalizeSignupPhoneInput(input) {
        if (!input) return;
        var digits = input.value.replace(/\D/g, '').slice(0, 10);
        input.value = digits;
    }

    function wireSignupPhoneField() {
        var phoneEl = document.getElementById('signupPhone');
        if (!phoneEl) return;
        function sync() {
            normalizeSignupPhoneInput(phoneEl);
        }
        phoneEl.addEventListener('input', sync);
        phoneEl.addEventListener('blur', sync);
        phoneEl.addEventListener('paste', function () {
            window.requestAnimationFrame(sync);
        });
    }

    function init() {
        var modal = getModal();
        if (!modal) return;

        wireSignupPhoneField();

        document.addEventListener('click', function (e) {
            var opener = e.target.closest('[data-signup-modal-open]');
            if (!opener) return;
            e.preventDefault();
            openModal(modal);
        });

        modal.addEventListener('click', function (e) {
            var closeTrigger = e.target.closest('[data-signup-modal-close]');
            if (closeTrigger && modal.contains(closeTrigger)) {
                e.preventDefault();
                closeModal(modal);
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key !== 'Escape' || !isOpen(modal)) return;
            closeModal(modal);
        });

        document.addEventListener('pinakkaa-signup-success', function (e) {
            if (!modal.contains(e.target)) return;
            closeModal(modal);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
