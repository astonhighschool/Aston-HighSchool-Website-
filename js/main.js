// Main JavaScript for Aston High School Website

document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.querySelector('header');

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    // Updated selector to match HTML structure
    const navLinks = document.querySelector('.primary-navbar-wrapper');

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
            hamburger.classList.toggle('toggle');
            document.body.classList.toggle('menu-open');

            // Icon toggle 
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

    // -----------------------------------------------------------
    // Interactive Map Logic (Dynamic & Static Views)
    // -----------------------------------------------------------
    const mapWrapper = document.querySelector('.illustrations-wrapper');

    // Content Data for Hover Cards
    const hotspotContent = {
        // --- ACADEMICS ---
        'morning-assembly': {
            img: 'assets/images/Home/Assembly img.avif',
            title: 'Morning Assembly',
            lines: [
                'Our day begins with a meaningful morning assembly.',
                'It builds discipline, unity, and a sense of belonging.',
                'Students participate in prayers and national anthems.',
                'Promotes leadership and public speaking skills.',
                'A positive start to every school day.'
            ]
        },
        'smart-classroom': {
            img: 'assets/images/New images/Classroom img.jpg',
            title: 'Smart Classroom',
            lines: [
                'Our smart classrooms make learning interactive and engaging.',
                'Digital tools help students understand concepts visually.',
                'Lessons become more interesting and effective.',
                'Teachers use modern methods for better learning outcomes.',
                'It builds strong academic foundations.'
            ]
        },
        'science-computer-lab': {
            img: 'assets/images/New images/Scince Lab img.jpeg',
            title: 'Science & Computer Lab',
            lines: [
                'Our labs provide hands-on practical learning for science and technology.',
                'Students experiment, explore, and apply classroom concepts.',
                'Computer labs improve coding, research, and digital skills.',
                'Safety and discipline are strictly maintained.',
                'It builds curiosity and innovation.'
            ]
        },
        'computer-lab': {
            img: 'assets/images/New images/Computer lab img.avif',
            title: 'Computer Lab',
            lines: [
                'State-of-the-art computer systems for digital learning.',
                'High-speed internet for research and projects.',
                'Students learn programming and software skills.',
                'Dedicated space for technical workshops.',
                'Preparing students for the digital future.'
            ]
        },
        'library': {
            img: 'assets/images/Home/Libary img.avif',
            title: 'Library & Reading Room',
            lines: [
                'The library nurtures reading habits and independent learning.',
                'Students access books, references, and study materials.',
                'It promotes quiet focus and imagination.',
                'Reading builds knowledge and critical thinking.',
                'A peaceful space for academic growth.'
            ]
        },
        'music-cultural': {
            img: 'assets/images/New images/Musics.jpeg',
            title: 'Music & Cultural Activity',
            lines: [
                'Cultural programs encourage creativity and self-expression.',
                'Students learn music, dance, and performing arts.',
                'It boosts confidence and stage presence.',
                'Cultural activities promote teamwork and discipline.',
                'They shape well-rounded personalities.'
            ]
        },
        'indoor-sports': {
            img: 'assets/images/Home/Chess img.avif',
            title: 'Indoor Sports',
            lines: [
                'Chess and Carrom develop strategic thinking.',
                'Enhances concentration and mental agility.',
                'Students learn patience and foresight.',
                'Promotes healthy competition and focus.',
                'A great way to sharpen the mind.'
            ]
        },

        // --- OUTDOOR SPORTS ---
        'march-past': {
            img: 'assets/images/New images/Marchpass.JPG',
            title: 'March Past',
            lines: [
                'March past teaches discipline, coordination, and teamwork.',
                'Students develop physical fitness and leadership qualities.',
                'It builds respect, unity, and school pride.',
                'Training improves posture and confidence.',
                'A symbol of strength and order.'
            ]
        },
        'karate': {
            img: 'assets/images/New images/Karate img.avif',
            title: 'Karate',
            lines: [
                'Karate trains students in self-defense and discipline.',
                'It improves focus, balance, and physical fitness.',
                'Students learn respect and mental control.',
                'It builds courage and confidence.',
                'Strengthens body and mind.'
            ]
        },
        'swimming': {
            img: 'assets/images/New images/Swimming.png',
            title: 'Swimming',
            lines: [
                'Swimming improves stamina and overall fitness.',
                'Students learn water safety and survival skills.',
                'It strengthens muscles and coordination.',
                'Builds confidence in water activities.',
                'A fun and healthy sport.'
            ]
        },
        'horse-riding': {
            img: 'assets/images/Home/Horse riding img.avif',
            title: 'Horse Riding',
            lines: [
                'Horse riding develops balance and responsibility.',
                'Students learn patience and control.',
                'It builds confidence and coordination.',
                'Encourages discipline and bonding with animals.',
                'A unique skill-building sport.'
            ]
        },
        'archery-shooting': {
            img: 'assets/images/New images/Shotting img.JPG',
            title: 'Archery & Shooting',
            lines: [
                'Archery and shooting improve focus and accuracy.',
                'Students learn discipline and safety rules.',
                'It strengthens hand-eye coordination.',
                'Target practice builds patience and control.',
                'Develops determination and calmness.'
            ]
        },
        // Placeholders
        'mallakhamb': {
            img: 'assets/images/New images/Mallakhambv.JPG',
            title: 'Mallakhamb & Yoga',
            lines: [
                'Traditional Indian sport building strength and agility.',
                'Improves concentration and flexibility.',
                'Promotes physical and mental discipline.',
                'Connects students with heritage sports.',
                'Builds core strength and balance.'
            ]
        },
        'skating': {
            img: 'assets/images/New images/Skatting img.avif',
            title: 'Skating',
            lines: [
                'Skating improves balance, speed, and coordination.',
                'Enhances reflexes and physical endurance.',
                'A fun activity that builds confidence.',
                'Encourages healthy competition and focus.',
                'Strengthens leg muscles and core stability.'
            ]
        },
        'stick-fighting': {
            img: 'assets/images/New images/Martial art.JPG',
            title: 'Martial Arts (Silambam)',
            lines: [
                'Traditional stick fighting art form.',
                'Improves focus, reflexes, and self-defense skills.',
                'Teaches rhythm, discipline, and respect.',
                'Preserves cultural heritage and martial traditions.',
                'Builds physical stamina and mental alertness.'
            ]
        },

        // --- HOSTEL & FACILITIES ---
        'hostel-room': {
            img: 'assets/images/New images/Hostel room.JPG',
            title: 'Hostel Room',
            lines: [
                'Our hostel rooms provide a safe and comfortable living space.',
                'Students learn independence and responsibility.',
                'It supports disciplined daily routines.',
                'Rooms encourage study and rest balance.',
                'A home away from home.'
            ]
        },
        'canteen': {
            img: 'assets/images/New images/Canteen img.JPG',
            title: 'Canteen',
            lines: [
                'The canteen serves healthy and hygienic food.',
                'Students enjoy balanced meals daily.',
                'Cleanliness and nutrition are priorities.',
                'It supports physical and mental well-being.',
                'A space for refreshment and bonding.'
            ]
        }
    };

    if (mapWrapper) {

        // 1. Tooltip & Hover Logic
        // Enhanced for exclusive interaction: One active at a time
        mapWrapper.addEventListener('mouseover', (e) => {
            const hotspot = e.target.closest('.hotspot-area');
            if (!hotspot) return;

            // Prefer data-key for rich content, fallback to data-tooltip for simple text
            const key = hotspot.dataset.key;
            const simpleText = hotspot.dataset.tooltip;

            if (!key && !simpleText) return;

            const container = hotspot.closest('.illustration-container');
            const tooltip = container.querySelector('.illustration-tooltip');

            if (tooltip) {
                // EXCLUSIVE: Clear any other active hotspots or tooltips in this container immediately
                container.querySelectorAll('.hotspot-area.active').forEach(h => {
                    if (h !== hotspot) h.classList.remove('active');
                });

                hotspot.classList.add('active');

                // Generate Content
                if (key && hotspotContent[key]) {
                    const data = hotspotContent[key];
                    tooltip.innerHTML = `
                        <div class="tooltip-card">
                            <div class="tooltip-img-wrapper">
                                <img src="${data.img}" alt="${data.title}">
                            </div>
                            <div class="tooltip-content">
                                <h3>${data.title}</h3>
                                <ul>
                                    ${data.lines.map(line => `<li>${line}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    `;
                } else {
                    tooltip.textContent = simpleText; // Fallback
                }

                tooltip.classList.add('active');

                // Track mouse movement for this specific interaction
                const moveTooltip = (evt) => {
                    const rect = container.getBoundingClientRect();
                    let x = evt.clientX - rect.left + 20;
                    // FIXED: User requested card always starts from top to prevent cutoff
                    let y = 10;

                    // Boundary checks (Smart positioning for X only)
                    // If tooltip goes off right edge, flip to left of cursor
                    if (x + tooltip.offsetWidth > rect.width) {
                        x = evt.clientX - rect.left - tooltip.offsetWidth - 20;
                    }

                    // Clamp X to edges
                    if (x < 0) x = 10;

                    tooltip.style.left = `${x}px`;
                    tooltip.style.top = `${y}px`;
                };

                // Remove previous listeners to avoid stacking
                if (container._moveTooltipHandler) {
                    container.removeEventListener('mousemove', container._moveTooltipHandler);
                }
                container._moveTooltipHandler = moveTooltip;
                container.addEventListener('mousemove', moveTooltip);

                // Handle leaving THIS hotspot
                const onLeave = () => {
                    tooltip.classList.remove('active');
                    hotspot.classList.remove('active');
                    container.removeEventListener('mousemove', moveTooltip);
                    hotspot.removeEventListener('mouseleave', onLeave);
                    container._moveTooltipHandler = null;
                };

                hotspot.addEventListener('mouseleave', onLeave);
            }
        });

        // 2. View Switching Logic (School -> Academics/Sports -> Back)
        mapWrapper.addEventListener('click', (e) => {
            // Check for elements that trigger a view change
            const trigger = e.target.closest('[data-target-view]');
            if (!trigger) return;

            e.preventDefault();
            const targetId = trigger.dataset.targetView;
            const targetView = document.getElementById(targetId);
            const currentView = trigger.closest('.map-view');

            if (currentView && targetView) {
                // Fade out current
                currentView.classList.remove('active');

                // Wait for transition to finish before hiding/showing
                setTimeout(() => {
                    currentView.style.display = 'none';
                    targetView.style.display = 'block';

                    // Trigger reflow to enable transition
                    void targetView.offsetWidth;

                    targetView.classList.add('active');
                }, 400); // 400ms match CSS transition
            }
        });
    }
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
        img.src = 'assets/images/admissions/Addmission banner.jpeg';
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

    // Scroll Animation for New Section
    const revealElements = document.querySelectorAll('.reveal-text, .reveal-up');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                revealObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach((el) => revealObserver.observe(el));

    // WhatsApp Floating Button
    function initWhatsAppButton() {
        if (document.querySelector('.whatsapp-float')) return;

        const waLink = document.createElement('a');
        waLink.href = 'https://api.whatsapp.com/send?phone=919773737737&text=Hi';
        waLink.className = 'whatsapp-float';
        waLink.target = '_blank';
        waLink.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';

        document.body.appendChild(waLink);
    }

    initWhatsAppButton();
});
