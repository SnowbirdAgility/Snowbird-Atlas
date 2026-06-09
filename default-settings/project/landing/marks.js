/* Snowbird Atlas — mark renderer. Injects SVG marks into [data-mark] nodes. */
(function(){
  let uid = 0;

  // Full simplified mark: globe (gray meridians) + orbital ring + upswept wing
  function fullMark(o){
    o = o || {};
    const id = 'm'+(uid++);
    const globe = o.globe || '#9CA3AF';
    const globeOp = o.globeOp != null ? o.globeOp : 0.85;
    const ring = o.ring || '#1E3A5F';
    const wing = o.wing || ('url(#g'+id+')');
    const g1 = o.g1 || '#0B1F3A', g2 = o.g2 || '#1E3A5F', g3 = o.g3 || '#22D3EE';
    return `<svg viewBox="0 0 120 120" width="${o.size||120}" height="${o.size||120}" class="mk" role="img" aria-label="Snowbird Atlas mark" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g${id}" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stop-color="${g1}"/><stop offset=".55" stop-color="${g2}"/><stop offset="1" stop-color="${g3}"/>
        </linearGradient>
        <clipPath id="c${id}"><circle cx="58" cy="66" r="30"/></clipPath>
      </defs>
      <g stroke="${globe}" stroke-width="1.5" fill="none" opacity="${globeOp}">
        <circle cx="58" cy="66" r="30"/>
        <g clip-path="url(#c${id})">
          <ellipse cx="58" cy="66" rx="12" ry="30"/><ellipse cx="58" cy="66" rx="24" ry="30"/>
          <line x1="28" y1="66" x2="88" y2="66"/>
          <ellipse cx="58" cy="66" rx="30" ry="11"/><ellipse cx="58" cy="66" rx="30" ry="22"/>
        </g>
      </g>
      <g transform="rotate(-24 60 60)"><ellipse cx="60" cy="58" rx="46" ry="16" fill="none" stroke="${ring}" stroke-width="5"/></g>
      <g fill="${wing}">
        <path d="M40 74 C 52 54 70 38 96 26 C 90 44 78 60 58 74 C 52 75 45 75 40 74 Z"/>
        <path d="M40 80 C 50 67 64 59 86 53 C 78 65 65 75 51 81 C 47 81 43 81 40 80 Z"/>
      </g>
    </svg>`;
  }

  // App icon / favicon: rounded square + just the wing (legible at tiny sizes)
  function appIcon(o){
    o = o || {};
    const id = 'a'+(uid++);
    const sz = o.size || 120;
    const bg = o.bg || '#0B1F3A';
    const wing = o.wing || ('url(#wg'+id+')');
    const radius = o.radius != null ? o.radius : 26;
    return `<svg viewBox="0 0 120 120" width="${sz}" height="${sz}" class="mk" role="img" aria-label="Snowbird Atlas app icon" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="wg${id}" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#22D3EE"/></linearGradient></defs>
      ${o.noBg?'':`<rect width="120" height="120" rx="${radius}" fill="${bg}"/>`}
      <g fill="${wing}" transform="translate(2 6) scale(1.02)">
        <path d="M30 72 C 44 50 64 32 96 20 C 88 42 74 60 50 76 C 43 77 35 77 30 72 Z"/>
        <path d="M30 80 C 42 64 60 54 88 48 C 78 62 62 74 44 82 C 39 82 34 82 30 80 Z"/>
      </g>
    </svg>`;
  }

  // Typeset wordmark
  function wordmark(o){
    o = o || {};
    const stack = o.stack;
    const ink = o.ink || 'navy-ink';
    const size = o.size || 28;
    const tag = o.tagline ? `<div class="tagline-lockup">${o.tagline}</div>` : '';
    const wm = `<div class="wm ${ink}" style="font-size:${size}px">
        <span class="top">SNOWBIRD</span>
        <span class="atlas">ATLAS</span>
      </div>`;
    const markSize = o.markSize || (stack ? size*2.4 : size*1.9);
    const mark = o.noMark ? '' : (o.appMark ? appIcon({size:markSize, radius: markSize*0.22}) : fullMark({size:markSize, globe:o.globe, ring:o.ring, wing:o.wing, g1:o.g1,g2:o.g2,g3:o.g3, globeOp:o.globeOp}));
    return `<div class="lockup ${stack?'stack':''}">${mark}<div>${wm}${tag}</div></div>`;
  }

  window.SnowMark = { fullMark, appIcon, wordmark };

  function render(){
    document.querySelectorAll('[data-mark]').forEach(el=>{
      const kind = el.getAttribute('data-mark');
      let opts = {};
      try{ const j = el.getAttribute('data-opts'); if(j) opts = JSON.parse(j); }catch(e){}
      if(kind==='full') el.innerHTML = fullMark(opts);
      else if(kind==='app') el.innerHTML = appIcon(opts);
      else if(kind==='wordmark') el.innerHTML = wordmark(opts);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render);
  else render();
})();
