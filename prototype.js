'use strict';
(() => {
const data=window.PROTOTYPE_DATA;
const qaMode=new URLSearchParams(location.search).has('qa');if(qaMode)document.body.classList.add('qa');
const hiddenScreens=new Set(data.screens.filter(n=>/پشتیبانی آنلاین|پروفایل/.test(n.n)).map(n=>n.id));
const nodes=new Map(data.screens.filter(n=>!hiddenScreens.has(n.id)).map(n=>[n.id,n]));
const orderedScreens=window.LOAN_SCREEN_ORDER.map(id=>nodes.get(id));
const screen=document.querySelector('#screen'),viewport=document.querySelector('#viewport'),picker=document.querySelector('#screens'),backButton=document.querySelector('#back');
const images=new Map(),variants=new Map(),history=[],timers=new Set(),animations=new Set();
let current=data.start,epoch=0,zoomStep=null;
const zoomSteps=[.5,.65,.8,.9,1,1.1,1.25],screenNames=window.LOAN_SCREEN_NAMES||{};
const footerCropScreens=new Set(['5765:189755','5765:189825','5765:189904','5765:189974','5765:190639','5765:190817','5765:190940']);
const asset=path=>window.PROTOTYPE_ASSETS?.[path]||path;
const file=id=>'images/screens/'+id.replace(':','-')+'.png';
function fail(message){const e=document.querySelector('#error');e.textContent=message;e.style.display='block';}
function imageFor(id){if(!images.has(id)){const img=new Image();img.src=file(id);images.set(id,img);}return images.get(id);}
for(const n of orderedScreens){if(!n)continue;const opt=document.createElement('option');opt.value=n.id;opt.textContent=screenNames[n.id]||n.n;picker.append(opt);imageFor(n.id);}
const layerMap=new Map((data.layers||[]).map(s=>[s.id,s]));
function schedule(fn,ms){const timer=setTimeout(()=>{timers.delete(timer);fn();},ms);timers.add(timer);return timer;}
function clear(){epoch++;for(const t of timers)clearTimeout(t);timers.clear();for(const a of animations)a.cancel();animations.clear();}
function resize(){const n=nodes.get(current);const availableWidth=Math.max(1,innerWidth);const s=qaMode?1:Math.min(zoomStep===null?1:zoomSteps[zoomStep],availableWidth/n.w);const visibleHeight=n.h-(footerCropScreens.has(current)?16:0);viewport.style.width=(n.w*s)+'px';viewport.style.height=(visibleHeight*s)+'px';viewport.style.borderRadius=(30*s)+'px';screen.style.zoom=s;document.querySelector('#size').textContent=zoomStep===null&&s===1?'اندازه اصلی':Math.round(s*100)+'٪';document.querySelector('#smaller').disabled=zoomStep===0;document.querySelector('#larger').disabled=zoomStep===zoomSteps.length-1||s>=availableWidth/n.w;}
function addBox(el,xy){Object.assign(el.style,{left:xy[0]+'px',top:xy[1]+'px',width:xy[2]+'px',height:xy[3]+'px'});}
function easing(tr){return tr?.easing?.type==='LINEAR'?'linear':tr?.easing?.type==='EASE_IN'?'ease-in':tr?.easing?.type==='EASE_IN_AND_OUT'?'ease-in-out':'ease-out';}
function animate(el,k,options){if(!el.animate)return;const a=el.animate(k,options);animations.add(a);a.onfinish=()=>animations.delete(a);return a;}
function animateSupport(from,to,tr){
const a=layerMap.get(from),b=layerMap.get(to);if(!a||!b)return;
const cover=document.createElement('div');cover.className='morph';const clip=document.createElement('div');clip.className='clip';
const aRoot=a.children[0],bRoot=b.children[0];addBox(clip,[17,96,343,Math.max(aRoot.xy[3],bRoot.xy[3])]);cover.append(clip);
const duration=Math.round(tr.duration*1000),options={duration,easing:easing(tr),fill:'forwards'};
const old=aRoot.children,next=bRoot.children,matched=new Set();
function piece(c,start,end,opacity){const img=new Image();img.className='piece';img.src=asset('assets/layer-'+c.id.replace(':','-')+'.png');img.style.width=c.xy[2]+'px';img.style.height=c.xy[3]+'px';img.style.left='0';img.style.top='0';clip.append(img);animate(img,[{transform:'translate('+start[0]+'px,'+start[1]+'px)',opacity:opacity[0]},{transform:'translate('+end[0]+'px,'+end[1]+'px)',opacity:opacity[1]}],options);}
for(const c of old){const d=next.find(x=>x.n===c.n);const start=[c.xy[0]-17,c.xy[1]-96],end=d?[d.xy[0]-17,d.xy[1]-96]:start;
if(d){matched.add(d.id);const same=c.xy[2]===d.xy[2]&&c.xy[3]===d.xy[3];piece(c,start,end,same?[1,1]:[1,0]);if(!same)piece(d,start,end,[0,1]);}
else piece(c,start,end,[1,0]);}
for(const d of next)if(!matched.has(d.id)){const point=[d.xy[0]-17,d.xy[1]-96];piece(d,point,point,[0,1]);}
screen.append(cover);schedule(()=>cover.remove(),duration+20);
}
function favorite(h,a){
const key=current+':'+h.id,state=variants.get(key)||'selected';
if(state==='default')return;
variants.set(key,'default');const target=data.favorites.find(v=>v.id===a.to),initial=data.favorites.find(v=>v.name.includes('selected'));
const box=h.xy.map((x,i)=>i<2?x-8:x+16);const el=document.createElement('div');el.className='variant';el.style.background='#fff';addBox(el,box);el.innerHTML=target.svg;
const filled=document.createElement('div');filled.style.position='absolute';filled.style.inset='0';filled.style.background='#fff';filled.innerHTML=initial.svg;el.append(filled);screen.append(el);
animate(filled,[{opacity:1},{opacity:0}],{duration:Math.round(a.tr.duration*1000),easing:easing(a.tr),fill:'forwards'});
}
const dotStates=[
[[24,1],[24,0],[24,0]],[[14,1],[24,0],[24,0]],[[24,1],[24,0],[24,0]],[[24,0],[14,1],[24,0]],[[24,0],[24,1],[24,0]],[[24,0],[24,0],[14,1]],[[24,0],[24,0],[24,1]]
];
function dots(h){
const wrap=document.createElement('div');wrap.className='variant';addBox(wrap,h.xy);wrap.style.background='#fff';wrap.style.overflow='visible';
const circles=[];for(let i=0;i<3;i++){const d=document.createElement('span');Object.assign(d.style,{position:'absolute',left:([10,24,38][i]-4)/48*h.xy[2]+'px',width:8/48*h.xy[2]+'px',height:8/48*h.xy[3]+'px',borderRadius:'50%',top:dotStates[3][i][0]/48*h.xy[3]-4/48*h.xy[3]+'px',background:dotStates[3][i][1]?'#2d2d2d':'#d9d9d9'});wrap.append(d);circles.push(d);}screen.append(wrap);
let idx=3;const stamp=epoch;function step(){if(stamp!==epoch)return;const dest=(idx+1)%7,dur=idx===6?150:300;for(let i=0;i<3;i++){const to=dotStates[dest][i];const top=(to[0]-4)/48*h.xy[3]+'px',color=to[1]?'#2d2d2d':'#d9d9d9';animate(circles[i],[{top:circles[i].style.top,backgroundColor:circles[i].style.backgroundColor},{top,backgroundColor:color}],{duration:dur,easing:'ease-out',fill:'forwards'});circles[i].style.top=top;circles[i].style.backgroundColor=color;}idx=dest;schedule(step,dur+1);}schedule(step,1);
}
function action(h){
for(const a of h.a){if(a.type==='BACK'){goBack();return;}if(a.type==='URL'&&a.url){window.open(a.url,'_blank','noopener');return;}if(a.type!=='NODE')continue;if(a.to&&hiddenScreens.has(a.to))return;if(a.nav==='CHANGE_TO'){if(data.favorites.some(v=>v.id===a.to))favorite(h,a);return;}if(a.to&&nodes.has(a.to)){history.push({id:current,scroll:window.scrollY});const next=current===data.start&&a.to==='5765:188744'?'5765:188855':a.to;if(current===data.start)window.loanPlanIndex=0;render(next,{from:current,tr:a.tr});return;}if(a.to)throw Error('Unresolved destination '+a.to);}
}
function render(id,options={}){
const n=nodes.get(id);if(!n)throw Error('Unknown screen '+id);clear();current=id;screen.replaceChildren();screen.dataset.node=id;screen.style.width=n.w+'px';screen.style.height=n.h+'px';
const base=imageFor(id).cloneNode();base.className='base';base.alt='اسکرین '+n.n;base.width=n.w;base.height=n.h;base.draggable=false;base.onerror=()=>fail('بارگذاری تصویر انجام نشد؛ صفحه را دوباره باز کنید.');screen.append(base);
if(id===data.start&&window.renderLoanIntro){
  base.style.visibility='hidden';window.renderLoanIntro(screen);
  const first=screen.querySelector('.intro-card[data-loan-node="150:7044"]');
  if(first){
    first.style.background='url("images/intro-card-2x.png") center / 343px 490px no-repeat';
    const svg=first.querySelector('svg');
    const progressGroup=svg?.querySelector('[data-loan-node="150:7067"]')?.closest('foreignObject')?.parentElement?.parentElement?.parentElement;
    if(svg&&progressGroup){
      const animated=svg.cloneNode(false),defs=svg.querySelector('defs');
      animated.append(progressGroup.cloneNode(true));if(defs)animated.append(defs.cloneNode(true));
      animated.style.position='absolute';animated.style.inset='0';animated.style.pointerEvents='none';
      svg.style.display='none';first.append(animated);
    }
  }
}
const stamp=epoch;
for(const h of n.hs){
if(h.t?.type==='AFTER_TIMEOUT'){
const change=h.a.find(a=>a.nav==='CHANGE_TO');if(change?.to==='244:14324'){dots(h);continue;}
schedule(()=>{if(stamp===epoch)action(h);},h.t.timeout*1000);continue;}
if(h.t?.type!=='ON_CLICK'||!h.xy)continue;
if(h.a.some(a=>a.to&&hiddenScreens.has(a.to)))continue;
const button=document.createElement('button');button.className='hotspot';button.dataset.hotspot=h.id;button.type='button';button.setAttribute('aria-label',h.a.some(a=>a.type==='BACK')?'بازگشت':h.a.some(a=>a.to==='244:14342')?'پشتیبانی':h.a.some(a=>a.nav==='CHANGE_TO')?'حذف از علاقه‌مندی‌ها':'ادامهٔ پروتوتایپ');addBox(button,id===data.start&&h.id==="5765:190314"?[16,748,343,42]:h.xy);button.onclick=()=>action(h);screen.append(button);
if(h.a.some(a=>a.nav==='CHANGE_TO')&&variants.get(id+':'+h.id)==='default'){
const a=h.a[0],v=document.createElement('div');v.className='variant';v.style.background='#fff';addBox(v,h.xy.map((x,i)=>i<2?x-8:x+16));v.innerHTML=data.favorites.find(s=>s.id===a.to).svg;screen.append(v);}
}
if(window.applyLoanScreenOverrides)window.applyLoanScreenOverrides(id,screen);
if((id==='5765:188855'||id==='5765:188744')&&window.renderLoanPlan){window.renderLoanPlan(screen,index=>render(index===0?'5765:188855':'5765:188744'),()=>{history.push({id:current,scroll:window.scrollY});render('5765:192070');});}
picker.value=id;backButton.disabled=!history.length;const planTitle=(id==='5765:188855'||id==='5765:188744')?'۰۲ | انتخاب طرح و اقساط — '+window.loanPlans[window.loanPlanIndex].name:null;document.querySelector('#screen-title').textContent=planTitle||screenNames[id]||n.n;document.querySelector('#screen-counter').textContent='صفحه '+(orderedScreens.indexOf(n)+1).toLocaleString('fa-IR')+' از '+orderedScreens.length.toLocaleString('fa-IR');resize();window.scrollTo(0,options.scroll||0);
if(options.tr?.type==='SMART_ANIMATE')animateSupport(options.from,id,options.tr);
}
function goBack(){if(history.length){const prev=history.pop();render(prev.id,{scroll:prev.scroll});}}
document.querySelector('#restart').onclick=()=>{history.length=0;variants.clear();window.loanPlanIndex=0;render(data.start);};
backButton.onclick=goBack;picker.onchange=()=>{history.push({id:current,scroll:window.scrollY});if(picker.value==='5765:188855')window.loanPlanIndex=0;if(picker.value==='5765:188744')window.loanPlanIndex=1;render(picker.value);};
document.querySelector('#hint').onclick=e=>{const on=screen.classList.toggle('hint');e.currentTarget.setAttribute('aria-pressed',String(on));};
document.querySelector('#smaller').onclick=()=>{zoomStep=zoomStep===null?3:Math.max(0,zoomStep-1);resize();};
document.querySelector('#larger').onclick=()=>{zoomStep=zoomStep===null?5:Math.min(zoomSteps.length-1,zoomStep+1);resize();};
document.querySelector('#size').onclick=()=>{zoomStep=null;resize();};
addEventListener('resize',resize);addEventListener('keydown',e=>{if(e.key==='Escape')goBack();});
try{const requested=new URLSearchParams(location.search).get('screen');if(requested==='5765:188744')window.loanPlanIndex=1;render(nodes.has(requested)?requested:data.start);}catch(e){fail(e.message);throw e;}
})();
