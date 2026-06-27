document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // STICKY HEADER
    // -------------------------------------------------------------
    const header = document.querySelector('.site-header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // -------------------------------------------------------------
    // MOBILE NAVIGATION MENU
    // -------------------------------------------------------------
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('open');
            
            // Toggle hamburger icon animation
            const spans = menuToggle.querySelectorAll('span');
            if (menuToggle.classList.contains('open')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when a link is clicked
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('open');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // -------------------------------------------------------------
    // SCROLL REVEAL ANIMATION
    // -------------------------------------------------------------
    const revealElements = document.querySelectorAll(
        '.feature-card, .plan-card, .step-node, .destination-card, .cta-text-content, .cta-action-area'
    );
    
    // Add CSS initial state classes programmatically to avoid issues if JS is disabled
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(25px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // -------------------------------------------------------------
    // MEMBERSHIP BUTTON ROUTING
    // -------------------------------------------------------------
    const planButtons = document.querySelectorAll('[data-plan]');

    planButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const plan = btn.getAttribute('data-plan');
            if (plan) {
                sessionStorage.setItem('pendingPlanName', plan);
            }
        });
    });
});
