// Main JavaScript for Aston High School Website

document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.querySelector('header');

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Create overlay if it doesn't exist
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.classList.add('nav-overlay');
        document.body.appendChild(overlay);
    }

    if (hamburger && navLinks) {
        function toggleMenu() {
            navLinks.classList.toggle('nav-active');
            overlay.classList.toggle('active');
            hamburger.classList.toggle('toggle'); // For animation if we add it
            document.body.classList.toggle('menu-open');

            // Icon toggle (Optional: Change bars to times)
            const icon = hamburger.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('nav-active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        }

        hamburger.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('nav-active')) {
                    toggleMenu();
                }
            });
        });
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            header.style.backgroundColor = 'white';
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }
    });

    // Simple Animation on Scroll (Optional)
    const cards = document.querySelectorAll('.card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
    // Enrichment Slider (Student Life Page)
    const track = document.querySelector('.enrichment-track');
    if (track) {
        // Infinite Loop: Clone first slide and append
        const firstSlide = track.firstElementChild;
        const clone = firstSlide.cloneNode(true);
        track.appendChild(clone);

        const slides = document.querySelectorAll('.enrichment-card');
        const nextBtn = document.getElementById('enrich-next');
        const prevBtn = document.getElementById('enrich-prev');

        let currentIndex = 0;
        const totalSlides = slides.length; // Includes clone
        const lastIndex = totalSlides - 1; // Index of the clone
        let slideInterval;

        function updateSlidePosition(withTransition = true) {
            if (withTransition) {
                track.style.transition = 'transform 0.5s ease-in-out';
            } else {
                track.style.transition = 'none';
            }
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        // Handle Loop Reset
        track.addEventListener('transitionend', () => {
            if (currentIndex === lastIndex) {
                // We reached the clone (visual first slide)
                // Instantly jump to real first slide
                track.style.transition = 'none';
                currentIndex = 0;
                track.style.transform = `translateX(0)`;
            }
        });

        function nextSlide() {
            if (currentIndex >= lastIndex) return; // Prevent double clicks during reset
            currentIndex++;
            updateSlidePosition(true);
        }

        function prevSlide() {
            if (currentIndex <= 0) {
                // Simple rewind for previous button
                currentIndex = lastIndex - 1;
            } else {
                currentIndex--;
            }
            updateSlidePosition(true);
        }

        function startAutoPlay() {
            stopAutoPlay();
            slideInterval = setInterval(nextSlide, 3000); // 3 seconds
        }

        function stopAutoPlay() {
            clearInterval(slideInterval);
        }

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => {
                stopAutoPlay();
                nextSlide();
                startAutoPlay();
            });

            prevBtn.addEventListener('click', () => {
                stopAutoPlay();
                prevSlide();
                startAutoPlay();
            });
        }

        // Start autoplay
        startAutoPlay();

        // Pause on hover
        const container = document.querySelector('.enrichment-slider-container');
        if (container) {
            container.addEventListener('mouseenter', stopAutoPlay);
            container.addEventListener('mouseleave', startAutoPlay);
        }
    }

    // ScrollSpy for About Page Sidebar
    const sidebarLinks = document.querySelectorAll('.page-sidebar ul li a');
    const sections = document.querySelectorAll('section[id]');

    if (sidebarLinks.length > 0 && sections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    sidebarLinks.forEach(link => link.classList.remove('active'));
                    const activeLink = document.querySelector(`.page-sidebar ul li a[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            if (faqItem.classList.contains('active')) {
                faqItem.classList.remove('active');
            } else {
                // If you want to close others, do it here. For now, multiple open allowed.
                faqItem.classList.add('active');
            }
        });
    });

    // 5-Second Admission Popup
    function initAdmissionsPopup() {
        // Check page eligibility (Home or Admissions only)
        const path = window.location.pathname;
        const page = path.split("/").pop();
        // Allow if empty (root), index.html, or admissions.html
        if (page !== "" && page !== "index.html" && page !== "admissions.html") {
            return;
        }

        // Check if popup already exists (prevent duplicates)
        if (document.querySelector('.popup-overlay')) return;

        // Create popup elements
        const popupOverlay = document.createElement('div');
        popupOverlay.className = 'popup-overlay';

        const popupContent = document.createElement('div');
        popupContent.className = 'popup-content';

        const closeBtn = document.createElement('div');
        closeBtn.className = 'popup-close';
        closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';

        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'popup-image-wrapper';

        const img = document.createElement('img');
        img.src = 'assets/images/admissions/Addmission banner.jpg';
        img.alt = 'Admissions Open';

        const separator = document.createElement('div');
        separator.className = 'popup-separator';

        const applyBtn = document.createElement('a');
        applyBtn.href = 'apply.html';
        applyBtn.className = 'popup-btn';
        applyBtn.textContent = 'Apply Now';

        // Assemble popup
        imageWrapper.appendChild(img);
        popupContent.appendChild(closeBtn);
        popupContent.appendChild(imageWrapper);
        popupContent.appendChild(separator);
        popupContent.appendChild(applyBtn);
        popupOverlay.appendChild(popupContent);
        document.body.appendChild(popupOverlay);

        // Show popup after 5 seconds
        setTimeout(() => {
            popupOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock scroll
        }, 5000);

        // Close functions
        function closePopup() {
            popupOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Unlock scroll

            // Optional: Remove from DOM after transition to keep it clean
            setTimeout(() => {
                // popupOverlay.remove(); // Uncomment if you want it gone-gone
            }, 500);
        }

        closeBtn.addEventListener('click', closePopup);

        // Close on background click
        popupOverlay.addEventListener('click', (e) => {
            if (e.target === popupOverlay) {
                closePopup();
            }
        });
    }

    // Initialize Popup
    initAdmissionsPopup();

    // Academic Highlights Marquee - Clone cards for seamless loop
    const marqueeTrack = document.querySelector('.highlights-marquee-track');
    if (marqueeTrack) {
        const cards = Array.from(marqueeTrack.children);
        // Clone all cards and append to create seamless loop
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            marqueeTrack.appendChild(clone);
        });
    }

    // Testimonial Slider
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    if (testimonialSlides.length > 0) {
        let currentTestimonial = 0;
        const totalTestimonials = testimonialSlides.length;

        function showNextTestimonial() {
            // Fade out current
            testimonialSlides[currentTestimonial].classList.remove('active');

            // Increment
            currentTestimonial = (currentTestimonial + 1) % totalTestimonials;

            // Fade in next
            testimonialSlides[currentTestimonial].classList.add('active');
        }

        // Change every 4.5 seconds
        setInterval(showNextTestimonial, 4500);
    }
});
