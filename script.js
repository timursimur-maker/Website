const lightbox=document.getElementById('lightbox');
const lightboxImage=document.getElementById('lightboxImage');
const closeButton=document.getElementById('closeLightbox');
let items=[],current=-1,startX=0,startY=0,timer=null;
const touch=()=>matchMedia('(hover:none),(pointer:coarse)').matches;

function collect(){
  items=[...document.querySelectorAll('.hero-trigger,.work')].map(el=>{
    const img=el.querySelector('img');
    return {el,src:el.dataset.full||img?.getAttribute('src')||'',alt:img?.alt||''};
  }).filter(x=>x.src);
}
function controls(){
  if(!lightbox||touch())return;
  if(!document.getElementById('prevLightbox')){
    lightbox.insertAdjacentHTML('beforeend',
      '<button id="prevLightbox" class="lightbox-nav lightbox-prev" aria-label="Vorheriges Bild">‹</button><button id="nextLightbox" class="lightbox-nav lightbox-next" aria-label="Nächstes Bild">›</button>');
  }
}
function showControls(){
  if(!lightbox)return;
  lightbox.classList.add('controls-visible');
  clearTimeout(timer);
  if(!touch())timer=setTimeout(()=>lightbox.classList.remove('controls-visible'),2200);
}
function show(i){
  if(!items.length||!lightboxImage)return;
  current=(i+items.length)%items.length;
  lightboxImage.src=items[current].src;
  lightboxImage.alt=items[current].alt;
}
function open(i){
  if(!lightbox)return;
  show(i);
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  if(touch()) lightbox.classList.add('touch-lightbox');
  else showControls();
}
function close(){
  if(!lightbox)return;
  lightbox.classList.remove('open','controls-visible');
  lightbox.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
  if(lightboxImage)lightboxImage.src='';
  current=-1;
}
function next(){if(lightbox?.classList.contains('open')){show(current+1);showControls()}}
function prev(){if(lightbox?.classList.contains('open')){show(current-1);showControls()}}

controls();collect();
items.forEach((x,i)=>x.el.addEventListener('click',()=>open(i)));
closeButton?.addEventListener('click',e=>{e.stopPropagation();close()});
document.getElementById('nextLightbox')?.addEventListener('click',e=>{e.stopPropagation();next()});
document.getElementById('prevLightbox')?.addEventListener('click',e=>{e.stopPropagation();prev()});
lightbox?.addEventListener('click',e=>{if(e.target===lightbox)close()});
lightbox?.addEventListener('mousemove',()=>{if(!touch())showControls()});
lightbox?.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX;startY=e.changedTouches[0].clientY},{passive:true});
lightbox?.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-startX,dy=e.changedTouches[0].clientY-startY;
  if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){dx<0?next():prev()}
},{passive:true});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape')close();
  if(e.key==='ArrowRight')next();
  if(e.key==='ArrowLeft')prev();
});
