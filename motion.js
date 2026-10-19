(() => {
  const track = document.querySelector('#project-track');
  if (!track) return;
  const cards = [...track.querySelectorAll('.motion-card')];
  const region = document.querySelector('.motion-showcase');
  const play = document.querySelector('#motion-play');
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = media.matches, hover = false, focused = false, touching = false, visible = false, current = 0, timer = null, frame = null;
  document.querySelector('.motion-controls').hidden = false;
  function position(i) { return cards[i].getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft; }
  function paint() {
    const max = track.scrollWidth - track.clientWidth;
    current = cards.reduce((best, card, i) => Math.abs(Math.min(position(i),max)-track.scrollLeft) < Math.abs(Math.min(position(best),max)-track.scrollLeft) ? i : best, 0);
    document.querySelector('#motion-counter').textContent = `${String(current+1).padStart(2,'0')} / ${cards.length}`;
    document.querySelector('#motion-progress').style.width = `${(current+1)/cards.length*100}%`;
  }
  function schedule() {
    clearInterval(timer); timer = null;
    if (!paused && !hover && !focused && !touching && visible && !document.hidden && !media.matches) timer = setInterval(() => move(1,false),4500);
  }
  function move(delta, manual) {
    paint();
    const target = (current + delta + cards.length) % cards.length;
    track.scrollTo({left:Math.min(position(target),track.scrollWidth-track.clientWidth),behavior:media.matches?'instant':'smooth'});
    if(manual) { document.querySelector('#motion-announcement').textContent=`Proyek ${target+1}: ${cards[target].querySelector('h3').textContent}`; schedule(); }
  }
  function label() { play.textContent = paused ? '▶ Putar' : 'Ⅱ Jeda'; play.setAttribute('aria-label',paused?'Mulai pergerakan otomatis':'Jeda pergerakan otomatis'); }
  play.addEventListener('click',()=>{paused=!paused;label();schedule();});
  document.querySelector('#motion-prev').addEventListener('click',()=>move(-1,true));
  document.querySelector('#motion-next').addEventListener('click',()=>move(1,true));
  track.addEventListener('keydown',e=>{if(e.target===track && ['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();move(e.key==='ArrowLeft'?-1:1,true);}});
  region.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hover=true;schedule();}});
  region.addEventListener('pointerleave',()=>{hover=false;schedule();});
  region.addEventListener('focusin',()=>{focused=true;schedule();});
  region.addEventListener('focusout',()=>{setTimeout(()=>{focused=region.contains(document.activeElement);schedule();},0);});
  track.addEventListener('pointerdown',()=>{touching=true;schedule();});
  window.addEventListener('pointerup',()=>{touching=false;schedule();});
  window.addEventListener('pointercancel',()=>{touching=false;schedule();});
  track.addEventListener('scroll',()=>{if(frame)cancelAnimationFrame(frame);frame=requestAnimationFrame(paint);},{passive:true});
  document.addEventListener('visibilitychange',schedule);
  window.addEventListener('resize',()=>{paint();schedule();});
  media.addEventListener('change',()=>{paused=media.matches;label();schedule();});
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.15}).observe(track);

  } else { visible=true; }
  label();paint();schedule();
})();
