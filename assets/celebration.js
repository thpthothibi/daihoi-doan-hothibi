/* Synthesized local celebration audio, unlocked only by the operator's click. */
window.createCelebrationAudio=function(){
 let ac=null,master=null,muted=false,clapTimer=null,blocked=false,scheduled=0;const nodes=new Set(),noiseCache=new Map();
 function ensure(){if(muted)return null;try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return null;if(!ac){ac=new Audio();master=ac.createGain();master.gain.value=.45;master.connect(ac.destination);}if(ac.state==='suspended'||ac.state==='interrupted')Promise.resolve(ac.resume()).catch(()=>{blocked=true;});return ac;}catch{blocked=true;return null;}}
 function cleanup(source,chain){nodes.delete(source);source.onended=null;for(const node of [source,...chain])try{node.disconnect();}catch{}}
 function track(source,...chain){scheduled++;nodes.add(source);source.onended=()=>cleanup(source,chain);source._celebrationCleanup=()=>cleanup(source,chain);return source;}
 function stop(){if(clapTimer!==null){clearInterval(clapTimer);clapTimer=null;}for(const source of [...nodes]){try{source.stop();}catch{}source._celebrationCleanup?.();}}
 function noise(duration){const key=String(duration);if(noiseCache.has(key))return noiseCache.get(key);const buffer=ac.createBuffer(1,Math.ceil(ac.sampleRate*duration),ac.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;noiseCache.set(key,buffer);return buffer;}
 function tone(frequency,end,duration,peak,delay=0){if(!ac||muted)return;const t=ac.currentTime+delay,osc=ac.createOscillator(),gain=ac.createGain();osc.type='triangle';osc.frequency.setValueAtTime(frequency,t);if(end)osc.frequency.exponentialRampToValueAtTime(end,t+duration*.85);gain.gain.setValueAtTime(.0001,t);gain.gain.linearRampToValueAtTime(peak,t+.015);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);osc.connect(gain);gain.connect(master);track(osc,gain);osc.start(t);osc.stop(t+duration+.02);}
 function noiseHit(duration,peak,frequency,delay=0){if(!ac||muted)return;const t=ac.currentTime+delay,source=ac.createBufferSource(),filter=ac.createBiquadFilter(),gain=ac.createGain();source.buffer=noise(duration);filter.type='bandpass';filter.frequency.setValueAtTime(frequency,t);filter.Q.setValueAtTime(1.6,t);gain.gain.setValueAtTime(.0001,t);gain.gain.linearRampToValueAtTime(peak,t+.006);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);source.connect(filter);filter.connect(gain);gain.connect(master);track(source,filter,gain);source.start(t);source.stop(t+duration+.01);}
 function start(round){stop();if(!ensure())return;try{const melody=round==='bithu'?[523.25,659.25,783.99,1046.5,987.77,1046.5,1318.51]:[392,523.25,659.25,783.99,1046.5];melody.forEach((f,i)=>{tone(f,0,1.1,.036,i*.19);tone(f/2,0,1.4,.016,i*.19);});[261.63,329.63,392].forEach(f=>tone(f,0,2.6,.018,.8));const started=performance.now();clapTimer=setInterval(()=>{const elapsed=performance.now()-started;if(elapsed>6500){clearInterval(clapTimer);clapTimer=null;return;}if(ac.state!=='running')return;const envelope=Math.min(1,elapsed/800,(6500-elapsed)/1400);try{for(let i=0;i<3;i++)noiseHit(.055,.055*Math.max(.1,envelope),1100+Math.random()*1100,Math.random()*.04);}catch{}},80);}catch{}}
 function launch(){if(!ac||muted||ac.state!=='running')return;try{tone(360+Math.random()*80,1250,.45,.025);}catch{}}
 function explode(){if(!ac||muted||ac.state!=='running')return;try{tone(150,32,.6,.10);noiseHit(.7,.07,500);for(let i=0;i<3;i++)noiseHit(.045,.035,2600+Math.random()*1000,.15+Math.random()*.35);}catch{}}
 function setMuted(value){muted=!!value;if(muted)stop();else ensure();return muted;}
 return {start,stop,launch,explode,setMuted,prime:ensure,status:()=>({muted,available:!!(window.AudioContext||window.webkitAudioContext),state:ac?.state||'idle',nodes:nodes.size,scheduled,blocked})};
};

/* Local projection decoration only. Never writes or republishes election data. */
window.createStageCelebration = function (root) {
  const layer = document.createElement('div');
  layer.className = 'op-celebration-layer';
  layer.setAttribute('aria-hidden', 'true');

  for (const side of ['left', 'right']) {
    const beam = document.createElement('i');
    beam.className = 'op-celebration-beam ' + side;
    layer.append(beam);
  }
  for (const side of ['left', 'right']) {
    const ribbon = document.createElement('i');
    ribbon.className = 'op-celebration-ribbon ' + side;
    layer.append(ribbon);
  }

  const stars = document.createElement('div');
  stars.className = 'op-celebration-stars';
  for (let i = 0; i < 68; i++) {
    const star = document.createElement('i');
    star.style.cssText = `left:${i % 2 ? 92 + (i % 5) : 2 + (i % 5)}%;top:${8 + ((i * 17) % 80)}%;animation-delay:${(i % 7) * 0.2}s`;
    stars.append(star);
  }
  layer.append(stars);

  const canvas = document.createElement('canvas');
  const foreground=document.createElement('div');foreground.className='op-celebration-foreground';foreground.setAttribute('aria-hidden','true');foreground.append(canvas);
  const scenery=document.createElement('div');scenery.className='op-cinematic-scenery';
  scenery.innerHTML='<div class="op-cinematic-curtain left"></div><div class="op-cinematic-curtain right"></div><div class="op-cinematic-floor"></div><div class="op-cinematic-orbit"></div>';
  layer.prepend(scenery);
  for(const side of ['left','right']){
    const silk=document.createElementNS('http://www.w3.org/2000/svg','svg');silk.classList.add('op-cinematic-silk',side);silk.setAttribute('viewBox','0 0 180 800');silk.setAttribute('preserveAspectRatio','none');
    silk.innerHTML='<defs><linearGradient id="op-silk-'+side+'" x1="0" x2="1"><stop stop-color="#a36b08"/><stop offset=".28" stop-color="#ffd13d"/><stop offset=".48" stop-color="#fff4c5"/><stop offset=".65" stop-color="#c49231"/><stop offset="1" stop-color="#f6d278"/></linearGradient><linearGradient id="op-blue-'+side+'"><stop stop-color="#06437b"/><stop offset=".5" stop-color="#20ddff"/><stop offset="1" stop-color="#0a6bb7"/></linearGradient></defs><path d="M-30 30 C160 120 -40 160 65 260 S165 360 45 440 S-15 610 160 770" fill="none" stroke="url(#op-silk-'+side+')" stroke-width="17"/><path d="M-35 60 C150 180 -55 240 72 340 S170 470 35 550 S35 700 170 800" fill="none" stroke="url(#op-blue-'+side+')" stroke-width="10"/>';
    layer.append(silk);
  }
  for(let side=0;side<2;side++)for(let k=0;k<2;k++){
    const bloom=document.createElementNS('http://www.w3.org/2000/svg','svg');bloom.setAttribute('viewBox','0 0 360 360');bloom.classList.add('op-cinematic-firework');bloom.classList.add(side?'right':'left');bloom.classList.add(k?'lower':'upper');bloom.style.setProperty('--burst-delay',(-side*1.7-k*1.1)+'s');
    let rays='';for(let i=0;i<56;i++){const a=i*Math.PI*2/56,r=112+(i*37%47),x=Math.cos(a),y=Math.sin(a),color=i%5?'#22d6ff':'#ffe477';rays+='<path d="M'+(180+x*34)+' '+(180+y*34)+' Q'+(180+x*r*.8)+' '+(180+y*r*.8)+' '+(180+x*r)+' '+(180+y*r+8)+'" fill="none" stroke="'+color+'" stroke-width="'+(i%3?1.6:2.5)+'" stroke-linecap="round"/><circle cx="'+(180+x*r)+'" cy="'+(180+y*r+8)+'" r="1.7" fill="#e5fbff"/>';}
    bloom.innerHTML='<g>'+rays+'<circle cx="180" cy="180" r="5" fill="#fff0bf"/></g>';layer.append(bloom);
  }
  for(let i=0;i<6;i++){const ray=document.createElement('i');ray.className='op-cinematic-ray';ray.style.setProperty('--ray',i);ray.style.left=(i<3?2+i*8:82+(i-3)*8)+'%';layer.append(ray);}
  root.append(layer,foreground);

  let active = null,
    frame = 0,
    start = 0,
    last = 0,
    particles = [],
    rockets = [],
    halos = [],
    bokehs = [],
    swirlStream = [],
    protectedRects = [],
    ctx = null,
    width = 0,
    height = 0,
    bursts = 0,
    papers = 0;

  const key = (round, result) =>
    JSON.stringify([round, result?.turnout, result?.ranked, result?.winners, result?.tie]);
  const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  let motionChoice=null;
  const motionEnabled=()=>motionChoice===null?!motionQuery?.matches:motionChoice;
  const reduced=()=>!motionEnabled();

  const sound=window.createCelebrationAudio();
  const stopAllSounds=()=>sound.stop();
  const playLaunchWhistle=()=>sound.launch();
  const playFireworkExplosionSound=()=>sound.explode();
  const playApplauseAndFanfare=()=>sound.start(active?.round);
  // =========================================================================
  // HỆ THỐNG ĐỒ HỌA PHÁO HOA, DẢI KIM TUYẾN XOÁY & ÁNH SÁNG (GIỐNG ẢNH THIẾT KẾ)
  // =========================================================================
  function initBokehAndSwirl() {
    bokehs = [];
    const bokehColors = ['rgba(255,213,106,0.18)', 'rgba(56,189,248,0.16)', 'rgba(245,158,11,0.12)', 'rgba(255,246,204,0.2)'];
    for (let i = 0; i < (width < 768 ? 8 : 16); i++) {
      bokehs.push({
        x: width * (i % 2 ? .90 + Math.random() * .10 : Math.random() * .10),
        side: i % 2,
        y: height * (0.2 + Math.random() * 0.65),
        r: 16 + Math.random() * 36,
        vx: (Math.random() - 0.5) * 14,
        vy: -6 - Math.random() * 12,
        phase: Math.random() * Math.PI * 2,
        color: bokehColors[i % bokehColors.length]
      });
    }

    // Dải hạt kim tuyến & ngôi sao xoáy lượn qua khung kết quả (Swirling Golden Stream)
    swirlStream = [];
    const count = width < 768 ? 36 : 72;
    for (let i = 0; i < count; i++) {
      swirlStream.push({
        t: i / count,
        speed: 0.16 + Math.random() * 0.12,
        offsetX: (Math.random() - 0.5) * 42,
        offsetY: (Math.random() - 0.5) * 34,
        size: 1.2 + Math.random() * 2.5,
        isStar: i % 11 === 0,
        starScale: 6 + Math.random() * 7,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function drawStar5(cx, cy, outerR, innerR, rot) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const a = rot + (i * Math.PI) / 5;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }

  function resetAnimation() {
    cancelAnimationFrame(frame);
    frame = 0;
    particles = [];
    rockets = [];
    halos = [];
    bokehs = [];
    swirlStream = [];
    bursts = 0;
    papers = 0;
    if (ctx) ctx.clearRect(0, 0, width, height);
    root.classList.remove('op-celebration-moving');
  }

  function stop() {
    resetAnimation();
    stopAllSounds();
    root.querySelector('.op-celebration-banner')?.remove();
    active = null;
    root.classList.remove('op-celebrating', 'op-celebration-bch', 'op-celebration-bithu');
    const heading = root.querySelector('.op-result-heading h2');
    if (heading?.dataset.originalTitle) {
      heading.textContent = heading.dataset.originalTitle;
      delete heading.dataset.originalTitle;
    }
    for(const row of root.querySelectorAll('.op-result-row')){row.hidden=false;row.classList.remove('op-result-elected');row.querySelector('.op-elected-badge')?.remove();const rank=row.querySelector('.op-result-rank');if(rank?.dataset.originalRank){rank.textContent=rank.dataset.originalRank;delete rank.dataset.originalRank;}}
    const grid=root.querySelector('.op-result-grid');if(grid?.dataset.originalRows){grid.style.gridTemplateRows=grid.dataset.originalRows;delete grid.dataset.originalRows;}
    root.querySelector('.op-celebration-subtitle')?.remove();
  }

  function decorate(result) {
    root.classList.add('op-celebrating', 'op-celebration-' + active.round);
    let banner = root.querySelector('.op-celebration-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.className = 'op-celebration-banner';
      banner.setAttribute('role', 'status');
      const wreath = () => {
        const mark = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        mark.setAttribute('viewBox', '0 0 44 90');
        mark.setAttribute('aria-hidden', 'true');
        let leaves = '<path d="M39 86 Q2 48 30 4" fill="none" stroke="#e9c668" stroke-width="1.8"/>';
        for (let i = 0; i < 9; i++) {
          const y = 12 + i * 8,
            x = 18 - Math.sin((i / 8) * Math.PI) * 10;
          leaves += `<ellipse cx="${x}" cy="${y}" rx="4" ry="9" fill="#efcf78" transform="rotate(${-45 + i * 4} ${x} ${y})"/><ellipse cx="${x + 11}" cy="${y + 4}" rx="4" ry="8" fill="#ffe4a0" transform="rotate(35 ${x + 11} ${y + 4})"/>`;
        }
        mark.innerHTML = leaves;
        return mark;
      };
      const text = document.createElement('strong');
      text.textContent =
        active.round === 'bch'
          ? 'CHÚC MỪNG BAN CHẤP HÀNH'
          : 'CHÚC MỪNG BÍ THƯ ĐOÀN TRƯỜNG';
      banner.append(wreath(), text, wreath());
      const card = root.querySelector('.op-result-card');
      card?.before(banner);
    }
    const winners = new Set(result.winners || []);
    let elected=0;
    for(const [i,row] of [...root.querySelectorAll('.op-result-row')].entries()){
      const yes=winners.has(result.ranked[i]?.id);row.classList.toggle('op-result-elected',yes);row.hidden=!yes;
      if(yes){elected++;const rank=row.querySelector('.op-result-rank');if(!rank.dataset.originalRank)rank.dataset.originalRank=rank.textContent;rank.textContent=String(elected).padStart(2,'0');
        if(!row.querySelector('.op-elected-badge')){const badge=document.createElement('span');badge.className='op-elected-badge';badge.textContent=active.round==='bch'?'TRÚNG CỬ':'CHÚC MỪNG TRÚNG CỬ';row.append(badge);}}
    }
    const grid=root.querySelector('.op-result-grid');if(grid){if(!grid.dataset.originalRows)grid.dataset.originalRows=grid.style.gridTemplateRows;grid.style.gridTemplateRows='repeat('+Math.ceil(elected/2)+', minmax(0, 1fr))';}
    if(!root.querySelector('.op-celebration-subtitle')){const sub=document.createElement('p');sub.className='op-celebration-subtitle';sub.textContent=active.round==='bch'?elected+' thành viên trúng cử':'VINH DỰ · TRÁCH NHIỆM · CỐNG HIẾN';root.querySelector('.op-celebration-banner')?.after(sub);}
  }

  function captureTextRects(){protectedRects=[...root.querySelectorAll('.op-result-name,.op-result-votes,.op-result-rank,.op-result-heading,.op-elected-badge,.op-celebration-subtitle,.op-celebration-banner,.op-stage-hero,.op-stage-toolbar,.op-stage-sync')].map(e=>e.getBoundingClientRect()).filter(r=>r.width>0&&r.height>0);}
  function sync(round, result, mode) {
    updateControls();
    if (active && (mode !== 'results' || active.key !== key(round, result))) stop();
    if (active) {decorate(result);captureTextRects();}
  }

  function burst(x, y, color) {
    playFireworkExplosionSound();
    const count = width < 768 ? 24 : 40;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.04,
        speed = 110 + Math.random() * 195;
      particles.push({
        kind: 'spark',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        max: 2.2 + Math.random() * 1.3,
        color: i % 3 ? color : '#fff5c0',
        size: 1.5 + Math.random() * 1.5,
        trail: [],
        glitter: false
      });
    }
    for (let i = 0; i < (width < 768 ? 8 : 14); i++) {
      const angle = Math.random() * Math.PI * 2,
        speed = 25 + Math.random() * 85;
      particles.push({
        kind: 'spark',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        max: 2.6 + Math.random() * 1.5,
        color: '#fff9db',
        size: 1.1 + Math.random() * 1.2,
        trail: [],
        glitter: true
      });
    }
    halos.push({ x, y, life: 0, max: 0.72, color });
    halos = halos.slice(-6);
  }

  function launch() {
    playLaunchWhistle();
    const left = bursts % 2 === 0;
    const x = width * (left ? 0.05 + Math.random() * 0.14 : 0.81 + Math.random() * 0.14);
    const destY = height * (0.14 + Math.random() * 0.28);
    const palette = ['#00cfff', '#268bff', '#67edff', '#00b7ff', '#ffd341'];
    rockets.push({
      x,
      y: height + 10,
      destY,
      vx: (left ? 1 : -1) * (10 + Math.random() * 24),
      vy: -(height / 1.28),
      color: palette[bursts % palette.length],
      trail: []
    });
    rockets = rockets.slice(-7);
  }

  function strokeTrail(points, color, alpha, size) {
    if (points.length < 2) return;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.stroke();
  }

  // Tọa độ đường cong Bezier xoáy lượn quanh khu vực bảng kết quả giống ảnh thiết kế
  function getSwirlPoint(t) {
    const p0 = { x: width * 0.16, y: height * 0.84 };
    const p1 = { x: width * 0.28, y: height * 0.56 };
    const p2 = { x: width * 0.88, y: height * 0.62 };
    const p3 = { x: width * 0.56, y: height * 0.88 };
    const u = 1 - t;
    const x =
      u * u * u * p0.x +
      3 * u * u * t * p1.x +
      3 * u * t * t * p2.x +
      t * t * t * p3.x;
    const y =
      u * u * u * p0.y +
      3 * u * u * t * p1.y +
      3 * u * t * t * p2.y +
      t * t * t * p3.y;
    return { x, y };
  }

  function draw(now) {
    if (!active) return;
    frame = requestAnimationFrame(draw);
    if (now - last < 40) return;
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    const elapsed = (now - start) / 1000;

    ctx.clearRect(0, 0, width, height);

    if (active.round==='bithu' && elapsed >= bursts * 1.4) {
      launch();
      bursts++;
    }
    if (active.round==='bithu' && elapsed >= papers * 0.28) {
      for (let i = 0; i < 2; i++) paper(false);
      papers++;
    }

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // 1. Vẽ đốm sáng Bokeh lung linh phía hậu cảnh
    for (const b of bokehs) {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (b.y < -b.r) b.y = height + b.r;
      const lo=b.side?width*.88:0,hi=b.side?width:width*.12;
      if(b.x<lo){b.x=lo;b.vx=Math.abs(b.vx);}
      if(b.x>hi){b.x=hi;b.vx=-Math.abs(b.vx);}
      const pulse = 0.65 + 0.35 * Math.sin(now * 0.0025 + b.phase);
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      grad.addColorStop(0, b.color);
      grad.addColorStop(0.7, b.color);
      grad.addColorStop(1, 'transparent');
      ctx.globalAlpha = pulse;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Vẽ dải hạt kim tuyến vàng & ngôi sao xoáy lượn qua khung kết quả (Swirling Golden Trail)
    for (const s of swirlStream) {
      s.t = (s.t + s.speed * dt) % 1;
      const base = getSwirlPoint(s.t);
      const wave = Math.sin(s.t * Math.PI * 4 + now * 0.004 + s.phase) * 14;
      const sx = base.x + s.offsetX + wave;
      const sy = base.y + s.offsetY + Math.cos(s.t * Math.PI * 3 + s.phase) * 10;
      const edgeFade = Math.sin(s.t * Math.PI);

      ctx.shadowColor = '#ffd56a';
      ctx.shadowBlur = 0;
      ctx.globalAlpha = Math.max(0, edgeFade * (0.55 + 0.45 * Math.sin(now * 0.01 + s.phase)));
      ctx.fillStyle = s.isStar ? '#fff6c2' : '#ffd56a';

      if (s.isStar) {
        drawStar5(sx, sy, s.starScale, s.starScale * 0.42, now * 0.002 + s.phase);
      } else {
        ctx.beginPath();
        ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Vẽ tên lửa pháo hoa bay lên
    for (const r of rockets) {
      r.trail.push({ x: r.x, y: r.y });
      r.trail = r.trail.slice(-12);
      r.x += r.vx * dt;
      r.y += r.vy * dt;
      r.vy += 18 * dt;
      ctx.shadowColor = r.color;
      ctx.shadowBlur = 0;
      strokeTrail(r.trail, r.color, 0.85, 2.2);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#fff9db';
      ctx.beginPath();
      ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
      ctx.fill();
      if (r.y <= r.destY) {
        burst(r.x, r.y, r.color);
        r.done = true;
      }
    }
    rockets = rockets.filter((r) => !r.done);
    ctx.shadowBlur = 0;

    // 4. Vẽ hào quang bùng nổ (Flash Halos)
    for (const halo of halos) {
      halo.life += dt;
      const radius = 16 + halo.life * 190;
      ctx.globalAlpha = Math.max(0, (1 - halo.life / halo.max) * 0.34);
      const gradient = ctx.createRadialGradient(halo.x, halo.y, 0, halo.x, halo.y, radius);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.25, halo.color);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(halo.x, halo.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    halos = halos.filter((h) => h.life < h.max);
    ctx.restore();

    // 5. Vẽ tia pháo hoa & ruy băng kim tuyến 3D
    for (const p of particles) {
      const px = p.x,
        py = p.y;
      p.life += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += (p.kind === 'paper' ? 72 : 26) * dt;
      ctx.globalAlpha = Math.max(0, 1 - p.life / p.max);
      ctx.fillStyle = p.color;

      if (p.kind === 'paper') {
        p.x += Math.sin(p.life * 3 + p.spin) * dt * 22;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.life * p.rotation + p.spin);
        ctx.scale(1, Math.cos(p.life * 4.5 + p.spin));
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      } else {
        p.vx *= Math.pow(p.glitter ? 0.45 : 0.68, dt);
        p.vy *= Math.pow(0.8, dt);
        p.trail.push({ x: px, y: py });
        p.trail = p.trail.slice(-6);
        const alpha =
          Math.max(0, 1 - p.life / p.max) *
          (p.glitter ? 0.6 + 0.4 * Math.sin(now * 0.018 + p.life * 3) : 1);
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 0;
        strokeTrail(p.trail, p.color, alpha * 0.78, p.size * 0.8);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    particles = particles
      .filter((p) => p.life < p.max && p.y < height + 40)
      .slice(-(width < 768 ? 140 : 220));
    ctx.globalAlpha = 1;
    ctx.save();ctx.shadowBlur=0;ctx.globalCompositeOperation='destination-out';ctx.fillStyle='#000';for(const r of protectedRects)ctx.fillRect(r.left-4,r.top-4,r.width+8,r.height+8);ctx.restore();
  }

  function paper(initial) {
    const left = Math.random() < 0.5;
    const colors = ['#ffd56a', '#38bdf8', '#fff3b0', '#ffffff', '#f59e0b'];
    particles.push({
      kind: 'paper',
      x: width * (left ? Math.random() * 0.18 : 0.82 + Math.random() * 0.18),
      y: initial ? height * (0.2 + Math.random() * 0.55) : -12,
      vx: (left ? 1 : -1) * (initial ? 50 + Math.random() * 95 : 8 + Math.random() * 18),
      vy: initial ? -85 - Math.random() * 85 : 55 + Math.random() * 60,
      life: 0,
      max: 9.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      spin: Math.random() * Math.PI,
      rotation: (Math.random() - 0.5) * 6.5,
      w: 9 + Math.random() * 10,
      h: 4 + Math.random() * 6
    });
  }

  function animate() {
    resetAnimation();
    root.classList.toggle('op-force-motion',motionChoice===true);
    updateControls();
    if (!active) return;
    if (reduced() || document.hidden) return;
    root.classList.add('op-celebration-moving');
    try {
      ctx = canvas.getContext('2d');
    } catch {
      ctx = null;
    }
    if (!ctx) return;

    width = innerWidth;
    height = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    captureTextRects();
    initBokehAndSwirl();
    if(active.round==='bithu')for (let i = 0; i < (width < 768 ? 24 : 40); i++) paper(true);

    // Nổ ngay 2 chùm pháo hoa đại đóa 2 bên giống hệt bố cục ảnh thiết kế
    if(active.round==='bithu'){burst(width * 0.08, height * 0.22, '#38bdf8');burst(width * 0.92, height * 0.22, '#60a5fa');}

    start = performance.now();
    last = 0;
    frame = requestAnimationFrame(draw);
  }

  const soundButton=document.createElement('button'),motionButton=document.createElement('button');
  for(const button of [soundButton,motionButton]){button.type='button';button.className='op-button op-celebration-control';}
  soundButton.id='op-stage-sound';motionButton.id='op-stage-motion';
  function updateControls(){const toolbar=root.querySelector('.op-stage-toolbar');if(toolbar&&soundButton.parentElement!==toolbar)toolbar.append(soundButton,motionButton);soundButton.textContent=sound.status().muted?'🔇 Âm thanh: Tắt':'🔊 Âm thanh: Bật';soundButton.setAttribute('aria-pressed',String(!sound.status().muted));motionButton.textContent=motionEnabled()?'Chuyển động: Bật':'Chuyển động: Tắt';motionButton.setAttribute('aria-pressed',String(motionEnabled()));motionButton.title=motionQuery?.matches?'Máy đang yêu cầu giảm chuyển động. Có thể chủ động bật cho cửa sổ trình chiếu.':'Bật/tắt chuyển động trên cửa sổ trình chiếu này.';}
  soundButton.onclick=()=>{sound.setMuted(!sound.status().muted);updateControls();};
  motionButton.onclick=()=>{motionChoice=!motionEnabled();root.classList.toggle('op-force-motion',motionChoice===true);if(active)animate();else updateControls();};
  updateControls();
  function play(round, result) {
    if (!result?.winners?.length) return false;
    sound.prime();
    stop();
    active = { round, key: key(round, result) };
    decorate(result);
    playApplauseAndFanfare();
    animate();
    return true;
  }

  const pause = () => {
    if (document.hidden) {resetAnimation();stopAllSounds();}
    else if (active) animate();
  };
  document.addEventListener('visibilitychange', pause);
  window.addEventListener('pagehide', stop);
  window.addEventListener('resize', () => {
    if (active) animate();
  });
  motionQuery?.addEventListener?.('change', () => {
    if (active) animate();
  });

  return { play, sync, stop, soundStatus:()=>sound.status(), motionEnabled };
};