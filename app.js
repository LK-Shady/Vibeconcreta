const IC='https://cdn.jsdelivr.net/npm/simple-icons@11.14.0/icons/';
const HOSTS={instagram:'instagram',github:'github','youtu':'youtube',whatsapp:'whatsapp','wa.me':'whatsapp','t.me':'telegram',telegram:'telegram','twitter.com':'x','x.com':'x',linkedin:'linkedin',tiktok:'tiktok',spotify:'spotify',twitch:'twitch',discord:'discord',facebook:'facebook',pinterest:'pinterest',behance:'behance',medium:'medium',substack:'substack',patreon:'patreon',shopee:'shopee'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safe=u=>{try{const x=new URL(u,location.href);return['http:','https:','mailto:','tel:'].includes(x.protocol)?x.href:'#'}catch{return'#'}};
const guess=u=>{u=String(u).toLowerCase();if(u.startsWith('mailto:'))return'gmail';for(const k in HOSTS)if(u.includes(k))return HOSTS[k];return''};
const ico=s=>s?`<span class="ico" style="--i:url(${IC}${esc(s)}.svg)"></span>`:'';
const ytId=u=>(String(u).match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/)||[])[1];
const on=l=>{const n=Date.now();return!((l.showFrom&&n<Date.parse(l.showFrom))||(l.hideAfter&&n>Date.parse(l.hideAfter)+864e5))};
function render(c,root,share=true){
  document.body.dataset.theme=c.theme||'retro';
  document.title=c.title||'Links';
  const L=(c.links||[]).filter(on);
  const cats=[...new Set(L.filter(l=>l.type==='card'&&l.category).map(l=>l.category))];
  const soc=(c.socials||[]).filter(s=>s.url).map(s=>`<a href="${esc(safe(s.url))}" target="_blank" rel="noopener" aria-label="${esc(s.type||s.url)}">${ico(s.type||guess(s.url))}</a>`).join('');
  const card=l=>`<a class="card" data-cat="${esc(l.category)}" href="${esc(safe(l.url))}" target="_blank" rel="noopener"><span class="im">${l.image?`<img loading="lazy" src="${esc(l.image)}" alt="">`:'<i>✦</i>'}</span><span class="t">${esc(l.title)}</span><span class="go">${esc(l.cta||'ver produto')} ↗</span></a>`;
  const item=l=>{
    if(l.type==='header')return`<h2 class="h"><span>${esc(l.title)}</span>${l.subtitle?`<small>${esc(l.subtitle)}</small>`:''}</h2>`;
    if(l.type==='youtube'&&ytId(l.url))return`<iframe class="yt" loading="lazy" title="${esc(l.title||'Vídeo')}" src="https://www.youtube-nocookie.com/embed/${ytId(l.url)}" allowfullscreen></iframe>`;
    const inner=`${ico(l.icon||guess(l.url))}<span>${esc(l.title||l.url)}</span>${l.badge?`<em class="bd">${esc(l.badge)}</em>`:''}`;
    return l.disabled?`<div class="b off" aria-disabled="true">${inner}</div>`:`<a class="b${l.highlight?' hl':''}" href="${esc(safe(l.url))}" target="_blank" rel="noopener">${inner}</a>`};
  let out='',g='',chips=false;
  const flush=()=>{if(!g)return;if(!chips&&cats.length){chips=true;out+=`<div class="chips"><button class="chip" aria-pressed="true" data-c="">todos</button>${cats.map(k=>`<button class="chip" aria-pressed="false" data-c="${esc(k)}">${esc(k)}</button>`).join('')}</div>`}out+=`<div class="grid">${g}</div>`;g=''};
  L.forEach(l=>{if(l.type==='card')g+=card(l);else{flush();out+=item(l)}});flush();
  root.innerHTML=`<main>${share?'<button class="sh" aria-label="Compartilhar">⤴</button>':''}${c.cover?`<div class="cover"><img src="${esc(c.cover)}" alt=""></div>`:c.avatar?`<img class="av" src="${esc(c.avatar)}" alt="">`:''}${c.kicker?`<p class="kick">✦ ${esc(c.kicker)} ✦</p>`:''}<h1>${esc(c.title)}</h1><p class="bio">${esc(c.bio)}</p><div class="soc">${soc}</div><div class="lk">${out}</div><footer>${esc(c.footer)}</footer></main>`;
  root.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{root.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',x===b));root.querySelectorAll('.card').forEach(k=>k.hidden=!!b.dataset.c&&k.dataset.cat!==b.dataset.c)});
  const b=root.querySelector('.sh');
  if(b)b.onclick=async()=>{try{if(navigator.share)await navigator.share({title:c.title,url:location.href});else{await navigator.clipboard.writeText(location.href);const t=document.createElement('div');t.className='toast';t.textContent='Link copiado';document.body.append(t);setTimeout(()=>t.remove(),1800)}}catch{}};
}
