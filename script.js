// Form Validation
function validateForm(form) {
  const inputs = form.querySelectorAll('input, select');
  let isValid = true;

  inputs.forEach(input => {
    const error = input.parentElement.querySelector('.form__error');
    error.textContent = '';

    if (!input.value.trim()) {
      error.textContent = 'This field is required';
      isValid = false;
    } else if (input.type === 'email' && !isValidEmail(input.value)) {
      error.textContent = 'Please enter a valid email';
      isValid = false;
    }
  });

  return isValid;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Toast Notification
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = toast.querySelector('.toast__message');
  toastMessage.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Form Submit Handler
document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm(form)) {
        showToast("We'll contact you soon!");
        form.reset();
      }
    });

    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        const error = input.parentElement.querySelector('.form__error');
        error.textContent = '';

        if (!input.value.trim()) {
          error.textContent = 'This field is required';
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
          error.textContent = 'Please enter a valid email';
        }
      });
    });
  });

  // Accordion
  const accordionHeaders = document.querySelectorAll('.accordion__header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const expanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', !expanded);
      
      const content = header.nextElementSibling;
      if (!expanded) {
        content.classList.add('open');
      } else {
        content.classList.remove('open');
      }
    });
  });

  // Scroll Reveal Animation
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        entry.target.style.transitionDelay = `${delay}s`;
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  // Observe all elements with data-delay
  document.querySelectorAll('[data-delay]').forEach(el => revealObserver.observe(el));

  // Observe sections that need reveal
  revealObserver.observe(document.querySelector('.stats'));
  revealObserver.observe(document.querySelector('.testimonials__carousel'));
  revealObserver.observe(document.querySelector('.elevate__content'));

  // Stats Counter Animation
  const statsSection = document.querySelector('.stats');
  const statNumbers = document.querySelectorAll('.stat__number');
  let countersAnimated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        statNumbers.forEach(stat => {
          const target = parseFloat(stat.parentElement.getAttribute('data-target'));
          animateCounter(stat, target);
        });
      }
    });
  }, { threshold: 0.5 });

  statsObserver.observe(statsSection);

  function animateCounter(element, target) {
    const duration = 2000;
    const start = performance.now();
    
    function updateCounter(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = progress * target;
      
      if (target % 1 !== 0) {
        element.textContent = value.toFixed(1);
      } else {
        element.textContent = Math.floor(value) + (target >= 100 ? '+' : '');
      }
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }
    
    requestAnimationFrame(updateCounter);
  }

  // Testimonials Carousel
  const carousel = document.getElementById('testimonials-carousel');
  const inner = carousel.querySelector('.testimonials__carousel-inner');
  const slides = carousel.querySelectorAll('.testimonial__slide');
  const dotsContainer = document.getElementById('carousel-dots');
  const prevBtn = carousel.querySelector('.carousel__nav--prev');
  const nextBtn = carousel.querySelector('.carousel__nav--next');

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('carousel__dot');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('data-slide', i);
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.carousel__dot');
  let currentSlide = 0;

  function showSlide(index) {
    inner.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function prevSlide() {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
  }

  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      showSlide(parseInt(dot.getAttribute('data-slide')));
    });
  });

  // Auto-advance
  let carouselTimer = setInterval(nextSlide, 5000);

  carousel.addEventListener('mouseenter', () => clearInterval(carouselTimer));
  carousel.addEventListener('mouseleave', () => {
    carouselTimer = setInterval(nextSlide, 5000);
  });

  // Show first slide initially
  showSlide(0);

  // Navbar scrolled state
  window.addEventListener('scroll', () => {
    document.getElementById('navbar')
      .classList.toggle('navbar--scrolled', window.scrollY > 20);
  });

  // Hamburger toggle
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
  }

  // Active nav link on scroll (IntersectionObserver)
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link');
  const sidebarItems = document.querySelectorAll('.sidebar__item[href]');
  
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        sidebarItems.forEach(i => i.classList.remove('active'));
        const active = document.querySelector(`.navbar__link[href="#${entry.target.id}"]`);
        const activeSide = document.querySelector(`.sidebar__item[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
        if (activeSide) activeSide.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  
  sections.forEach(s => navObserver.observe(s));

  // Back to top button
  const toTop = document.getElementById('toTop');
  if (toTop) {
    window.addEventListener('scroll', () => {
      toTop.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
});