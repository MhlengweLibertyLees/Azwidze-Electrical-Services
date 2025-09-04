(function(){
  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Reveal on scroll via IntersectionObserver
  const reveals = document.querySelectorAll('.reveal');
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px' }) : null;
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
    const step = Math.max(1, Math.floor(target / 120));
    let val = 0;
    const tick = () => {
      val += step;
      if (val >= target) { el.textContent = target; }
      else { el.textContent = val; requestAnimationFrame(tick); }
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
      const rect = heroImgWrap.getBoundingClientRect();
      const offset = Math.min(15, Math.max(-15, (window.innerHeight - rect.top) * 0.02));
      heroImgWrap.style.transform = `translateY(${offset}px)`;
    }, { passive:true });
  }

  // Form validation status
  const form = document.getElementById('quoteForm');
  const statusEl = document.querySelector('.form-status');
  function setStatus(msg, ok=true){
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.color = ok ? '#0DB14B' : '#B10D0D';
  }
  if (form) {
    form.addEventListener('submit', function(e){
      const required = ['name','email','phone','service','message'];
      let valid = true;
      required.forEach(id => {
        const el = form.querySelector('#'+id);
        if (!el || !el.value.trim()) valid = false;
      });
      if (!valid) {
        e.preventDefault();
        setStatus('Please fill in all required fields.', false);
      }
    });
  }
})();
