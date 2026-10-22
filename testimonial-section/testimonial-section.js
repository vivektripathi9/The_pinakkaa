// Testimonial Carousel Auto-Rotation Script

document.addEventListener('DOMContentLoaded', function() {
    const testimonials = document.querySelectorAll('.testimonial-block');
    const indicators = document.querySelectorAll('.indicator');
    let currentIndex = 0;
    let autoRotateInterval;
    const rotationInterval = 5000; // 5 seconds

    // Function to show a specific testimonial
    function showTestimonial(index) {
        // Remove active class from all testimonials and indicators
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });

        // Add active class to current testimonial and indicator
        if (testimonials[index]) {
            testimonials[index].classList.add('active');
        }
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
    }

    // Function to go to next testimonial
    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }

    // Function to go to specific testimonial
    function goToTestimonial(index) {
        currentIndex = index;
        showTestimonial(currentIndex);
        // Reset auto-rotation timer
        resetAutoRotate();
    }

    // Function to start auto-rotation
    function startAutoRotate() {
        autoRotateInterval = setInterval(nextTestimonial, rotationInterval);
    }

    // Function to reset auto-rotation timer
    function resetAutoRotate() {
        clearInterval(autoRotateInterval);
        startAutoRotate();
    }

    // Add click event listeners to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToTestimonial(index);
        });
    });

    // Pause auto-rotation on hover for devices that actually hover.
    const carousel = document.querySelector('.testimonials-carousel');
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (carousel && canHover) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoRotateInterval);
        });

        carousel.addEventListener('mouseleave', () => {
            startAutoRotate();
        });
    }

    // Swipe between quotes on touch screens.
    if (carousel) {
        let startX = 0;
        let startY = 0;

        carousel.addEventListener('touchstart', (event) => {
            const touch = event.changedTouches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            clearInterval(autoRotateInterval);
        }, { passive: true });

        carousel.addEventListener('touchend', (event) => {
            const touch = event.changedTouches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;

            if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX < 0) {
                    nextTestimonial();
                } else {
                    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
                    showTestimonial(currentIndex);
                }
            }
            resetAutoRotate();
        }, { passive: true });
    }

    // Initialize: Show first testimonial and start auto-rotation
    showTestimonial(0);
    startAutoRotate();

    // Pause auto-rotation when tab is not visible
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            clearInterval(autoRotateInterval);
        } else {
            startAutoRotate();
        }
    });
});
