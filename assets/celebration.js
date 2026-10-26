/* Local projection decoration only. Never writes or republishes election data. */
window.createStageCelebration=function(root){
 const layer=document.createElement('div');layer.className='op-celebration-layer';layer.setAttribute('aria-hidden','true');
 for(const side of ['left','right']){const beam=document.createElement('i');beam.className='op-celebration-beam '+side;layer.append(beam);}
 for(const side of ['left','right']){const ribbon=document.createElement('i');ribbon.className='op-celebration-ribbon '+side;layer.append(ribbon);}
 const stars=document.createElement('div');stars.className='op-celebration-stars';
 for(let i=0;i<68;i++){const star=document.createElement('i');star.style.cssText=`left:${i%2?92+(i%5):2+(i%5)}%;top:${8+(i*17)%80}%;animation-delay:${(i%7)*.2}s`;stars.append(star);}layer.append(stars);
 const canvas=document.createElement('canvas');layer.append(canvas);root.append(layer);
 let active=null,frame=0,start=0,last=0,particles=[],ctx=null,width=0,height=0,bursts=0,papers=0;
 const key=(round,result)=>JSON.stringify([round,result?.turnout,result?.ranked,result?.winners,result?.tie]);
 const motionQuery=window.matchMedia?.('(prefers-reduced-motion: reduce)');
 const reduced=()=>!!motionQuery?.matches;
 function resetAnimation(){cancelAnimationFrame(frame);frame=0;particles=[];bursts=0;papers=0;if(ctx)ctx.clearRect(0,0,width,height);root.classList.remove('op-celebration-moving');}
 function stop(){resetAnimation();root.querySelector('.op-celebration-banner')?.remove();active=null;root.classList.remove('op-celebrating','op-celebration-bch','op-celebration-bithu');const heading=root.querySelector('.op-result-heading h2');if(heading?.dataset.originalTitle){heading.textContent=heading.dataset.originalTitle;delete heading.dataset.originalTitle;}for(const row of root.querySelectorAll('.op-result-elected'))row.classList.remove('op-result-elected');}
 function decorate(result){
  root.classList.add('op-celebrating','op-celebration-'+active.round);
  let banner=root.querySelector('.op-celebration-banner');if(!banner){banner=document.createElement('div');banner.className='op-celebration-banner';banner.setAttribute('role','status');
   const wreath=()=>{const mark=document.createElementNS('http://www.w3.org/2000/svg','svg');mark.setAttribute('viewBox','0 0 44 90');mark.setAttribute('aria-hidden','true');let leaves='<path d="M39 86 Q2 48 30 4" fill="none" stroke="#e9c668" stroke-width="1.8"/>';for(let i=0;i<9;i++){const y=12+i*8,x=18-Math.sin(i/8*Math.PI)*10;leaves+=`<ellipse cx="${x}" cy="${y}" rx="4" ry="9" fill="#efcf78" transform="rotate(${-45+i*4} ${x} ${y})"/><ellipse cx="${x+11}" cy="${y+4}" rx="4" ry="8" fill="#ffe4a0" transform="rotate(35 ${x+11} ${y+4})"/>`;}mark.innerHTML=leaves;return mark;};
   const text=document.createElement('strong');text.textContent=active.round==='bch'?'CHÚC MỪNG BAN CHẤP HÀNH NHIỆM KỲ MỚI':'CHÚC MỪNG BÍ THƯ ĐOÀN TRƯỜNG';banner.append(wreath(),text,wreath());const card=root.querySelector('.op-result-card');card?.before(banner);
  }
  const winners=new Set(result.winners||[]);for(const [i,row] of [...root.querySelectorAll('.op-result-row')].entries())row.classList.toggle('op-result-elected',winners.has(result.ranked[i]?.id));
 }
 function sync(round,result,mode){if(active&&(mode!=='results'||active.key!==key(round,result)))stop();if(active)decorate(result);}
 function burst(x,y,color){for(let i=0;i<68;i++){const angle=Math.PI*2*i/68,speed=95+Math.random()*145;particles.push({kind:'spark',x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:0,max:2.2+Math.random()*.9,color,size:1.6});}}
 function draw(now){
  if(!active)return;frame=requestAnimationFrame(draw);if(now-last<32)return;const dt=Math.min(.05,(now-(last||now))/1000);last=now;const elapsed=(now-start)/1000;
  ctx.clearRect(0,0,width,height);
  if(elapsed>=bursts*.95){const spots=[[.09,.16],[.9,.19],[.06,.58],[.94,.6],[.23,.08],[.77,.08]],spot=spots[bursts%spots.length];burst(width*spot[0],height*spot[1],bursts%2?'#ffd56a':'#5ddcff');bursts++;}
  if(elapsed>=papers*.2){for(let i=0;i<2;i++)paper(false);papers++;}
  for(const p of particles){const px=p.x,py=p.y;p.life+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=(p.kind==='paper'?10:24)*dt;ctx.globalAlpha=Math.max(0,1-p.life/p.max);ctx.fillStyle=p.color;
   if(p.kind==='paper'){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.life*2+p.spin);ctx.fillRect(-2,-4,4,8);ctx.restore();}else{ctx.strokeStyle=p.color;ctx.lineWidth=1.3;ctx.shadowColor=p.color;ctx.shadowBlur=7;ctx.beginPath();ctx.moveTo(px-p.vx*.025,py-p.vy*.025);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
  }particles=particles.filter(p=>p.life<p.max).slice(-(width<768?220:420));ctx.globalAlpha=1;
 }
 function paper(initial){const left=Math.random()<.5,colors=['#ffd56a','#5ddcff','#ffffff'];particles.push({kind:'paper',x:width*(left?Math.random()*.13:.87+Math.random()*.13),y:initial?-Math.random()*height*.5:-10,vx:(left?1:-1)*(5+Math.random()*12),vy:55+Math.random()*55,life:0,max:9,color:colors[Math.floor(Math.random()*3)],spin:Math.random()*Math.PI});}
 function animate(){
  resetAnimation();if(!active)return;
  if(reduced()||document.hidden)return;
  root.classList.add('op-celebration-moving');
  if(active.round==='bch')return;
  try{ctx=canvas.getContext('2d');}catch{ctx=null;}if(!ctx)return;
  width=root.clientWidth||innerWidth;height=root.clientHeight||innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  for(let i=0;i<(width<768?28:48);i++)paper(true);
  start=performance.now();last=0;frame=requestAnimationFrame(draw);return;
 }
 function play(round,result){
  if(!result?.winners?.length)return false;
  // The operator explicitly requested one click, with no confirmation dialog.
  stop();active={round,key:key(round,result)};decorate(result);
  animate();return true;
 }
 const pause=()=>{if(document.hidden)resetAnimation();else if(active)animate();};document.addEventListener('visibilitychange',pause);window.addEventListener('pagehide',stop);window.addEventListener('resize',()=>{if(active)animate();});motionQuery?.addEventListener?.('change',()=>{if(active)animate();});
 return {play,sync,stop};
};
