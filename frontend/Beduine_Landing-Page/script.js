document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const onScroll = () => header && header.classList.toggle('is-sticky', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  menuToggle?.addEventListener('click', () => {
    navMenu?.classList.toggle('active');
    menuToggle.classList.toggle('open');
  });
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('active');
      menuToggle?.classList.remove('open');
    });
  });

  document.querySelectorAll('[data-plan]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const plan = btn.getAttribute('data-plan');
      if (plan) sessionStorage.setItem('pendingPlanName', plan);
    });
  });

  const revealItems = document.querySelectorAll('.plan-card, .about-card, .steps-flow, .location-card, .support-card, .faq-card, .team-card, .bento-card');
  revealItems.forEach((el) => el.classList.add('reveal-ready'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealItems.forEach((el) => observer.observe(el));
});
