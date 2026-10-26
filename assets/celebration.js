/* Local projection decoration only. Never writes or republishes election data. */
window.createStageCelebration=function(root){
 const layer=document.createElement('div');layer.className='op-celebration-layer';layer.setAttribute('aria-hidden','true');
 for(const side of ['left','right']){const beam=document.createElement('i');beam.className='op-celebration-beam '+side;layer.append(beam);}
 const stars=document.createElement('div');stars.className='op-celebration-stars';
 for(let i=0;i<24;i++){const star=document.createElement('i');star.style.cssText=`left:${i%2?92+(i%5):2+(i%5)}%;top:${8+(i*17)%80}%;animation-delay:${(i%7)*.2}s`;stars.append(star);}layer.append(stars);
 const canvas=document.createElement('canvas');layer.append(canvas);root.append(layer);
 let active=null,frame=0,start=0,last=0,particles=[],ctx=null,width=0,height=0,bursts=0;
 const key=(round,result)=>JSON.stringify([round,result?.turnout,result?.ranked,result?.winners,result?.tie]);
 const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 function resetAnimation(){cancelAnimationFrame(frame);frame=0;particles=[];bursts=0;if(ctx)ctx.clearRect(0,0,width,height);root.classList.remove('op-celebration-moving');}
 function stop(){resetAnimation();active=null;root.classList.remove('op-celebrating','op-celebration-bch','op-celebration-bithu');const heading=root.querySelector('.op-result-heading h2');if(heading?.dataset.originalTitle){heading.textContent=heading.dataset.originalTitle;delete heading.dataset.originalTitle;}for(const row of root.querySelectorAll('.op-result-elected'))row.classList.remove('op-result-elected');}
 function decorate(result){
  root.classList.add('op-celebrating','op-celebration-'+active.round);
  const heading=root.querySelector('.op-result-heading h2');if(heading){heading.dataset.originalTitle??=heading.textContent;heading.textContent=active.round==='bch'?'CHÚC MỪNG BAN CHẤP HÀNH NHIỆM KỲ MỚI':'CHÚC MỪNG BÍ THƯ ĐOÀN TRƯỜNG';}
  const winners=new Set(result.winners||[]);for(const [i,row] of [...root.querySelectorAll('.op-result-row')].entries())row.classList.toggle('op-result-elected',winners.has(result.ranked[i]?.id));
 }
 function sync(round,result,mode){if(active&&(mode!=='results'||active.key!==key(round,result)))stop();if(active)decorate(result);}
 function burst(x,y,color){for(let i=0;i<24;i++){const angle=Math.PI*2*i/24,speed=45+Math.random()*75;particles.push({kind:'spark',x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:0,max:1.4+Math.random()*.5,color,size:1.4});}}
 function draw(now){
  if(!active)return;frame=requestAnimationFrame(draw);if(now-last<32)return;const dt=Math.min(.05,(now-(last||now))/1000);last=now;const elapsed=(now-start)/1000;
  if(elapsed>=5){resetAnimation();return;}
  ctx.clearRect(0,0,width,height);
  if(elapsed>=bursts*.65&&bursts<6){const spots=[[.09,.16],[.9,.19],[.06,.58],[.94,.6],[.23,.08],[.77,.08]],spot=spots[bursts];burst(width*spot[0],height*spot[1],bursts%2?'#ffd56a':'#5ddcff');bursts++;}
  for(const p of particles){p.life+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=(p.kind==='paper'?10:24)*dt;ctx.globalAlpha=Math.max(0,1-p.life/p.max);ctx.fillStyle=p.color;
   if(p.kind==='paper'){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.life*2+p.spin);ctx.fillRect(-2,-4,4,8);ctx.restore();}else{ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();}
  }particles=particles.filter(p=>p.life<p.max);ctx.globalAlpha=1;
 }
 function play(round,result){
  if(!result?.winners?.length)return false;
  if(!confirm('Ban tổ chức đã xác nhận kết quả '+(round==='bch'?'Ban Chấp hành':'Bí thư')+' và đồng ý trình chiếu lời chúc mừng?'))return false;
  stop();active={round,key:key(round,result)};decorate(result);
  if(reduced()||document.hidden)return true;
  root.classList.add('op-celebration-moving');
  if(round==='bch'){frame=requestAnimationFrame(function finish(t){if(!active)return;if(!start)start=t;if(t-start>=5000){resetAnimation();start=0;}else frame=requestAnimationFrame(finish);});start=0;return true;}
  try{ctx=canvas.getContext('2d');}catch{ctx=null;}if(!ctx)return true;
  width=root.clientWidth||innerWidth;height=root.clientHeight||innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  const colors=['#ffd56a','#5ddcff','#ffffff'];for(let i=0;i<(width<768?36:64);i++){const left=i%2===0;particles.push({kind:'paper',x:width*(left?Math.random()*.13:.87+Math.random()*.13),y:-Math.random()*height*.5,vx:(left?1:-1)*(8+Math.random()*18),vy:60+Math.random()*55,life:0,max:5,color:colors[i%3],spin:Math.random()*Math.PI});}
  start=performance.now();last=0;frame=requestAnimationFrame(draw);return true;
 }
 const pause=()=>{if(document.hidden)resetAnimation();};document.addEventListener('visibilitychange',pause);window.addEventListener('pagehide',stop);window.addEventListener('resize',resetAnimation);
 return {play,sync,stop};
};
