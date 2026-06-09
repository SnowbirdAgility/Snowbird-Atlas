/* Snowbird Atlas — Atlas/Navigation interactions */
(function(){
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

  function setMenu(open){
    burger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open?'true':'false');
  }
  burger.addEventListener('click', ()=> setMenu(!mobileMenu.classList.contains('open')));
  mobileMenu.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> setMenu(false)));

  /* active section highlight */
  const links = [...document.querySelectorAll('.nav-links a')];
  const map = {}; links.forEach(l=>{const id=l.getAttribute('href').slice(1); if(id) map[id]=l;});
  const secObserver = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ links.forEach(l=>l.classList.remove('active')); const l=map[e.target.id]; if(l) l.classList.add('active'); }});
  }, {rootMargin:'-45% 0px -50% 0px', threshold:0});
  Object.keys(map).forEach(id=>{const el=document.getElementById(id); if(el) secObserver.observe(el);});

  /* reveal + route draw */
  const revObserver = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); revObserver.unobserve(e.target); }});
  }, {rootMargin:'0px 0px -8% 0px', threshold:0.08});
  document.querySelectorAll('.reveal').forEach(el=> revObserver.observe(el));

  const drawObserver = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); drawObserver.unobserve(e.target); }});
  }, {threshold:0.2});
  document.querySelectorAll('.draw').forEach(el=> drawObserver.observe(el));

  /* ===== modal ===== */
  const modal = document.getElementById('modal');
  const form = document.getElementById('contactForm');
  const success = document.getElementById('modalSuccess');
  const reasonSel = document.getElementById('f-reason');
  let lastFocus = null;

  function openModal(reason){
    lastFocus = document.activeElement;
    form.style.display=''; success.classList.remove('show');
    modal.classList.add('open');
    if(reason){ [...reasonSel.options].forEach(o=>{ if(o.text.toLowerCase().includes(reason.toLowerCase())) reasonSel.value=o.value; }); }
    setTimeout(()=>document.getElementById('f-name').focus(), 80);
    document.body.style.overflow='hidden';
  }
  function closeModal(){ modal.classList.remove('open'); document.body.style.overflow=''; if(lastFocus) lastFocus.focus(); }
  document.querySelectorAll('[data-open-modal]').forEach(b=> b.addEventListener('click', e=>{ e.preventDefault(); openModal(b.getAttribute('data-reason')); setMenu(false); }));
  document.getElementById('modalX').addEventListener('click', closeModal);
  document.getElementById('modalDone').addEventListener('click', closeModal);
  modal.addEventListener('click', e=>{ if(e.target===modal) closeModal(); });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape' && modal.classList.contains('open')) closeModal(); });

  function setErr(id,on){ document.getElementById(id).closest('.field').classList.toggle('err',on); }
  const emailRe=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const name=document.getElementById('f-name'), email=document.getElementById('f-email'), org=document.getElementById('f-org');
    let ok=true;
    if(!name.value.trim()){setErr('f-name',true);ok=false;}else setErr('f-name',false);
    if(!emailRe.test(email.value.trim())){setErr('f-email',true);ok=false;}else setErr('f-email',false);
    if(!org.value.trim()){setErr('f-org',true);ok=false;}else setErr('f-org',false);
    if(!ok){ form.querySelector('.field.err input').focus(); return; }
    form.style.display='none'; success.classList.add('show');
  });
  ['f-name','f-email','f-org'].forEach(id=> document.getElementById(id).addEventListener('input', ()=>setErr(id,false)));
})();
