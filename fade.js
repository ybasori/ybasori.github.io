(() => {
  if (!('IntersectionObserver' in window)) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const parts = [...document.querySelectorAll('.header,.hero-top,.hero-copy,.hero-art,.hero-bottom,.section-head,.motion-toolbar,.motion-card,.motion-footer,.portfolio-download,.about-grid > div,.career,.education-grid > div,.contact-top,.contact h2,.contact-bottom,.contact .email,footer')];
  let observer;
  function configure() {
    if (observer) observer.disconnect();
    document.documentElement.classList.remove('fade-enabled');
    parts.forEach(part => part.classList.add('fade-part','is-visible'));
    if (preference.matches) return;
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('is-visible',entry.isIntersecting && entry.intersectionRatio > 0));
    }, {threshold:[0,.01],rootMargin:'-12px 0px -12px 0px'});
    parts.forEach(part => {
      const rect = part.getBoundingClientRect();
      part.classList.toggle('is-visible',rect.bottom>12 && rect.top<window.innerHeight-12 && rect.right>0 && rect.left<window.innerWidth);
      observer.observe(part);
    });
    document.documentElement.classList.add('fade-enabled');
  }
  preference.addEventListener('change',configure);
  configure();
})();
