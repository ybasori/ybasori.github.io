// Portfolio interactions — uses jQuery
$(function () {
  // Mark current nav link as active
  var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (path === '' || path === '/') path = 'index.html';
  $('.nav a, .mobile-nav a').each(function () {
    var href = $(this).attr('href').toLowerCase();
    if (href === path) $(this).addClass('active');
  });

  // Scroll-reveal using IntersectionObserver
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    $('.reveal').each(function () { io.observe(this); });
  } else {
    $('.reveal').addClass('visible');
  }

  // Footer year
  $('#year').text(new Date().getFullYear());
});
