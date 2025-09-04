(function(){
  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');
  const body = document.body;
  
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', String(open));
      body.classList.toggle('nav-open', open);
    });
  }

  // Close mobile nav when clicking on a link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('open')) {
        nav.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('nav-open');
      }
    });
  });

  // Year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Header scroll effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Scroll to top button
  const scrollTopBtn = document.querySelector('.scroll-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('active');
    } else {
      scrollTopBtn.classList.remove('active');
    }
  });
  
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Reveal on scroll via IntersectionObserver
  const reveals = document.querySelectorAll('.reveal');
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        io.unobserve(entry.target);
      }
    });
  }, { 
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  }) : null;
  
  if (io) reveals.forEach(el => io.observe(el));
  else { // Fallback
    const onScroll = () => {
      reveals.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight - 100) el.classList.add('active');
      });
    };
    document.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
  }

  // Count-up numbers when visible
  const counters = document.querySelectorAll('.count');
  const seen = new WeakSet();
  
  function runCounter(el){
    const target = +el.getAttribute('data-target');
    const duration = 2000; // 2 seconds
    const step = Math.max(1, Math.floor(target / (duration / 16))); // 60fps
    let val = 0;
    
    const tick = () => {
      val += step;
      if (val >= target) { 
        el.textContent = target; 
      } else { 
        el.textContent = val; 
        requestAnimationFrame(tick); 
      }
    };
    requestAnimationFrame(tick);
  }
  
  const counterObs = 'IntersectionObserver' in window ? new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting && !seen.has(e.target)){
        seen.add(e.target);
        runCounter(e.target);
      }
    });
  }, { threshold: 0.4 }) : null;
  
  if (counterObs) counters.forEach(c=>counterObs.observe(c));

  // Parallax hero image (subtle)
  const heroImgWrap = document.querySelector('.hero-image');
  if (heroImgWrap) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      heroImgWrap.style.transform = `translateY(${rate}px)`;
    }, { passive:true });
  }

  // Form validation status
  const form = document.getElementById('quoteForm');
  const statusEl = document.querySelector('.form-status');
  
  function setStatus(msg, ok=true){
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.background = ok ? 'rgba(13, 177, 75, 0.1)' : 'rgba(177, 13, 13, 0.1)';
    statusEl.style.color = ok ? '#0DB14B' : '#B10D0D';
    statusEl.style.padding = '0.75rem';
    statusEl.style.borderRadius = '0.5rem';
    
    // Clear status after 5 seconds
    setTimeout(() => {
      statusEl.textContent = '';
      statusEl.style.background = '';
      statusEl.style.padding = '0';
    }, 5000);
  }
  
  if (form) {
    form.addEventListener('submit', function(e){
      e.preventDefault();
      
      const required = ['name','email','phone','service','message'];
      let valid = true;
      
      required.forEach(id => {
        const el = form.querySelector('#'+id);
        if (!el || !el.value.trim()) {
          valid = false;
          el.style.borderColor = '#B10D0D';
        } else {
          el.style.borderColor = '#D1D5DB';
        }
      });
      
      if (!valid) {
        setStatus('Please fill in all required fields.', false);
        return;
      }
      
      // Simulate form submission
      setStatus('Sending your request...', true);
      
      // In a real implementation, you would send the form data to a server here
      setTimeout(() => {
        setStatus('Thank you! Your request has been sent. We will contact you shortly.', true);
        form.reset();
      }, 1500);
    });
  }

  // Input field effects
  const formInputs = document.querySelectorAll('input, textarea, select');
  formInputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
    });
  });

  // Service card hover effect enhancement
  const services = document.querySelectorAll('.service');
  services.forEach(service => {
    service.addEventListener('mouseenter', () => {
      service.style.transform = 'translateY(-8px)';
    });
    
    service.addEventListener('mouseleave', () => {
      service.style.transform = 'translateY(0)';
    });
  });

  // Initialize animations after page load
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero elements sequentially
    const heroElements = document.querySelectorAll('.hero-copy > *');
    heroElements.forEach((el, index) => {
      el.style.animationDelay = `${index * 0.2}s`;
    });
  });
})();
