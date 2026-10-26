/* Local projection decoration only. Never writes or republishes election data. */
window.createStageCelebration=function(root){
 const layer=document.createElement('div');layer.className='op-celebration-layer';layer.setAttribute('aria-hidden','true');
 for(const side of ['left','right']){const beam=document.createElement('i');beam.className='op-celebration-beam '+side;layer.append(beam);}
 for(const side of ['left','right']){const ribbon=document.createElement('i');ribbon.className='op-celebration-ribbon '+side;layer.append(ribbon);}
 const stars=document.createElement('div');stars.className='op-celebration-stars';
 for(let i=0;i<68;i++){const star=document.createElement('i');star.style.cssText=`left:${i%2?92+(i%5):2+(i%5)}%;top:${8+(i*17)%80}%;animation-delay:${(i%7)*.2}s`;stars.append(star);}layer.append(stars);
 const canvas=document.createElement('canvas');layer.append(canvas);root.append(layer);
 let active=null,frame=0,start=0,last=0,particles=[],rockets=[],halos=[],ctx=null,width=0,height=0,bursts=0,papers=0;
 const key=(round,result)=>JSON.stringify([round,result?.turnout,result?.ranked,result?.winners,result?.tie]);
 const motionQuery=window.matchMedia?.('(prefers-reduced-motion: reduce)');
 const reduced=()=>!!motionQuery?.matches;
 function resetAnimation(){cancelAnimationFrame(frame);frame=0;particles=[];rockets=[];halos=[];bursts=0;papers=0;if(ctx)ctx.clearRect(0,0,width,height);root.classList.remove('op-celebration-moving');}
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
 // Adapted from the supplied reference: rising rockets, layered sparks, flash halos and tumbling ribbons.
 function burst(x,y,color){
  const count=width<768?44:76;
  for(let i=0;i<count;i++){const angle=Math.PI*2*i/count+(Math.random()-.5)*.04,speed=100+Math.random()*170;particles.push({kind:'spark',x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:0,max:2.1+Math.random()*1.2,color:i%3?color:'#fff3b0',size:1.4+Math.random()*1.2,trail:[],glitter:false});}
  for(let i=0;i<(width<768?10:24);i++){const angle=Math.random()*Math.PI*2,speed=25+Math.random()*75;particles.push({kind:'spark',x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:0,max:2.5+Math.random()*1.5,color:'#fff9db',size:1+Math.random(),trail:[],glitter:true});}
  halos.push({x,y,life:0,max:.65,color});halos=halos.slice(-5);
 }
 function launch(){
  const left=bursts%2===0,x=width*(left?.04+Math.random()*.06:.90+Math.random()*.06),destY=height*(.10+Math.random()*.2);
  rockets.push({x,y:height+8,destY,vx:(left?1:-1)*(8+Math.random()*20),vy:-(height/1.35),color:bursts%3?'#38bdf8':'#ffd56a',trail:[]});rockets=rockets.slice(-6);
 }
 function strokeTrail(points,color,alpha,size){if(points.length<2)return;ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=size;ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);for(let i=1;i<points.length;i++)ctx.lineTo(points[i].x,points[i].y);ctx.stroke();}
 function draw(now){
  if(!active)return;frame=requestAnimationFrame(draw);if(now-last<32)return;const dt=Math.min(.05,(now-(last||now))/1000);last=now;const elapsed=(now-start)/1000;
  ctx.clearRect(0,0,width,height);
  if(elapsed>=bursts*.72){launch();bursts++;}
  if(elapsed>=papers*.24){for(let i=0;i<2;i++)paper(false);papers++;}
  ctx.save();ctx.globalCompositeOperation='lighter';
  for(const r of rockets){r.trail.push({x:r.x,y:r.y});r.trail=r.trail.slice(-10);r.x+=r.vx*dt;r.y+=r.vy*dt;r.vy+=18*dt;ctx.shadowColor=r.color;ctx.shadowBlur=10;strokeTrail(r.trail,r.color,.8,2);ctx.globalAlpha=1;ctx.fillStyle='#fff7d3';ctx.beginPath();ctx.arc(r.x,r.y,2.7,0,Math.PI*2);ctx.fill();if(r.y<=r.destY){burst(r.x,r.y,r.color);r.done=true;}}
  rockets=rockets.filter(r=>!r.done);ctx.shadowBlur=0;
  for(const halo of halos){halo.life+=dt;const radius=12+halo.life*160;ctx.globalAlpha=Math.max(0,(1-halo.life/halo.max)*.24);const gradient=ctx.createRadialGradient(halo.x,halo.y,0,halo.x,halo.y,radius);gradient.addColorStop(0,halo.color);gradient.addColorStop(1,'transparent');ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(halo.x,halo.y,radius,0,Math.PI*2);ctx.fill();}halos=halos.filter(h=>h.life<h.max);ctx.restore();
  for(const p of particles){const px=p.x,py=p.y;p.life+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=(p.kind==='paper'?75:24)*dt;ctx.globalAlpha=Math.max(0,1-p.life/p.max);ctx.fillStyle=p.color;
   if(p.kind==='paper'){p.x+=Math.sin(p.life*3+p.spin)*dt*18;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.life*p.rotation+p.spin);ctx.scale(1,Math.cos(p.life*4+p.spin));ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();}else{p.vx*=Math.pow(p.glitter ? .45 : .68,dt);p.vy*=Math.pow(.8,dt);p.trail.push({x:px,y:py});p.trail=p.trail.slice(-5);const alpha=Math.max(0,1-p.life/p.max)*(p.glitter ? .6+.4*Math.sin(now*.018+p.life*3) : 1);ctx.save();ctx.globalCompositeOperation='lighter';ctx.shadowColor=p.color;ctx.shadowBlur=5;strokeTrail(p.trail,p.color,alpha*.7,p.size*.7);ctx.globalAlpha=alpha;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();ctx.restore();}
  }particles=particles.filter(p=>p.life<p.max&&p.y<height+40).slice(-(width<768?240:500));ctx.globalAlpha=1;
 }
 function paper(initial){const left=Math.random()<.5,colors=['#ffd56a','#5ddcff','#ffffff'];particles.push({kind:'paper',x:width*(left?Math.random()*.13:.87+Math.random()*.13),y:initial?height*(.3+Math.random()*.5):-10,vx:(left?1:-1)*(initial?45+Math.random()*90:5+Math.random()*12),vy:initial?-80-Math.random()*80:55+Math.random()*55,life:0,max:9,color:colors[Math.floor(Math.random()*3)],spin:Math.random()*Math.PI,rotation:(Math.random()-.5)*6,w:8+Math.random()*8,h:4+Math.random()*5});}
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
