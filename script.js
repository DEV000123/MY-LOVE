/* ── CURSOR ── */
const cur=document.getElementById('cur'),dot=document.getElementById('dot');
let mx=0,my=0,cx=0,cy=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  dot.style.left=mx-2.5+'px';dot.style.top=my-2.5+'px';
});
setInterval(()=>{
  cx+=(mx-cx)*.13;cy+=(my-cy)*.13;
  cur.style.left=cx-12+'px';cur.style.top=cy-12+'px';
},10);

/* ── CANVAS STARS + SHOOTING STARS ── */
const bgC=document.getElementById('bgCanvas');
const bgCtx=bgC.getContext('2d');
function resizeBG(){bgC.width=window.innerWidth;bgC.height=window.innerHeight}
resizeBG();window.addEventListener('resize',resizeBG);

const stars=[];
for(let i=0;i<200;i++){
  stars.push({
    x:Math.random()*bgC.width,y:Math.random()*bgC.height,
    r:Math.random()*1.5+.3,
    a:Math.random(),da:Math.random()*.02-.01,
    c:Math.random()<.3?'#a78bfa':Math.random()<.5?'#ff80b5':'#ffffff'
  });
}
const shoots=[];
function addShoot(){
  if(shoots.length<4&&Math.random()<.015){
    shoots.push({x:Math.random()*bgC.width*.5+100,y:Math.random()*bgC.height*.3,
      vx:4+Math.random()*4,vy:2+Math.random()*2,life:1,maxLife:50+Math.random()*50});
  }
}
function animBG(){
  bgCtx.clearRect(0,0,bgC.width,bgC.height);
  stars.forEach(s=>{
    s.a+=s.da;
    if(s.a<0||s.a>1)s.da*=-1;
    bgCtx.beginPath();
    bgCtx.arc(s.x,s.y,s.r,0,Math.PI*2);
    bgCtx.fillStyle=s.c;
    bgCtx.globalAlpha=s.a;
    bgCtx.fill();
  });
  addShoot();
  for(let i=shoots.length-1;i>=0;i--){
    const sh=shoots[i];
    const prog=sh.life/sh.maxLife;
    bgCtx.globalAlpha=Math.sin(prog*Math.PI)*.8;
    bgCtx.strokeStyle='#ffd700';
    bgCtx.lineWidth=1.5;
    bgCtx.beginPath();
    bgCtx.moveTo(sh.x,sh.y);
    bgCtx.lineTo(sh.x-sh.vx*12,sh.y-sh.vy*12);
    bgCtx.stroke();
    sh.x+=sh.vx;sh.y+=sh.vy;sh.life++;
    if(sh.life>=sh.maxLife)shoots.splice(i,1);
  }
  bgCtx.globalAlpha=1;
  requestAnimationFrame(animBG);
}
animBG();

/* ── PETALS ── */
const petalEmojis=['🌸','🌺','🌷','💮','🌼','✿'];
const petalContainer=document.getElementById('petals');
for(let i=0;i<18;i++){
  const p=document.createElement('div');
  p.className='petal';
  p.textContent=petalEmojis[Math.floor(Math.random()*petalEmojis.length)];
  const dur=12+Math.random()*15;
  p.style.cssText=`
    left:${Math.random()*100}%;
    --dur:${dur}s;
    animation-duration:${dur}s;
    animation-delay:${Math.random()*dur}s;
    font-size:${.7+Math.random()*.8}rem;
  `;
  petalContainer.appendChild(p);
}

/* ── SCROLL REVEAL ── */
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting)e.target.classList.add('visible');
  });
},{threshold:.12});
document.querySelectorAll('.s-card,.r-card').forEach(el=>io.observe(el));

/* ── NO BUTTON RUNS AWAY ── */
const noBtn=document.getElementById('noBtn');
let noMoved=false;
function runAway(){
  noMoved=true;
  const vw=window.innerWidth-160,vh=window.innerHeight-60;
  noBtn.style.cssText=`
    position:fixed;z-index:500;
    transition:left .35s cubic-bezier(.25,.8,.25,1),top .35s cubic-bezier(.25,.8,.25,1);
    left:${Math.random()*vw}px;top:${Math.random()*vh}px;
    background:transparent;color:rgba(255,255,255,.3);
    border:1px solid rgba(255,255,255,.1);
    padding:18px 45px;border-radius:50px;
    font-size:1.15rem;font-family:'Noto Sans Devanagari',sans-serif;
    cursor:pointer;
  `;
}

/* ── YES ── */
function sayYes(){
  document.getElementById('success').classList.add('show');
  launchConfetti();
}
function closeSuccess(){
  document.getElementById('success').classList.remove('show');
}

/* ── CONFETTI ── */
const cC=document.getElementById('cCanvas');
const cCtx=cC.getContext('2d');
let confPieces=[],confRunning=false;
function launchConfetti(){
  cC.width=window.innerWidth;cC.height=window.innerHeight;
  confPieces=[];
  for(let i=0;i<250;i++){
    const colors=['#ff4d8f','#a78bfa','#ffd700','#ff80b5','#ddd6fe','#ffffff','#ffc2d9'];
    confPieces.push({
      x:Math.random()*cC.width,y:-20,
      w:8+Math.random()*10,h:4+Math.random()*5,
      color:colors[Math.floor(Math.random()*colors.length)],
      vx:(Math.random()-0.5)*6,vy:2+Math.random()*5,
      angle:Math.random()*360,spin:(Math.random()-0.5)*8,
      life:1
    });
  }
  if(!confRunning){confRunning=true;animConf();}
}
function animConf(){
  cCtx.clearRect(0,0,cC.width,cC.height);
  let alive=false;
  confPieces.forEach(p=>{
    if(p.y<cC.height){
      alive=true;
      cCtx.save();
      cCtx.translate(p.x,p.y);
      cCtx.rotate(p.angle*Math.PI/180);
      cCtx.fillStyle=p.color;
      cCtx.globalAlpha=Math.min(1,(cC.height-p.y)/200);
      cCtx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
      cCtx.restore();
      p.x+=p.vx;p.y+=p.vy;
      p.angle+=p.spin;p.vy+=.06;
    }
  });
  cCtx.globalAlpha=1;
  if(alive)requestAnimationFrame(animConf);
  else confRunning=false;
}

/* ── CURSOR HEART TRAIL ── */
let lastTrail=0;
document.addEventListener('mousemove',e=>{
  const now=Date.now();
  if(now-lastTrail<120)return;
  lastTrail=now;
  if(Math.random()<.4){
    const h=document.createElement('div');
    h.textContent=['💖','✨','🌸'][Math.floor(Math.random()*3)];
    h.style.cssText=`
      position:fixed;left:${e.clientX-8}px;top:${e.clientY-8}px;
      font-size:.8rem;pointer-events:none;z-index:9998;
      animation:cursorHeart .8s ease forwards;
    `;
    document.body.appendChild(h);
    setTimeout(()=>h.remove(),850);
  }
});
const trailStyle=document.createElement('style');
trailStyle.textContent=`
  @keyframes cursorHeart{
    0%{opacity:1;transform:translate(0,0) scale(1)}
    100%{opacity:0;transform:translate(${Math.random()*40-20}px,-50px) scale(.3)}
  }
`;
document.head.appendChild(trailStyle);

/* ── ORB MOUSE PARALLAX ── */
document.addEventListener('mousemove',e=>{
  const mx2=e.clientX/window.innerWidth-.5;
  const my2=e.clientY/window.innerHeight-.5;
  document.querySelectorAll('.hero-orb').forEach((o,i)=>{
    const d=(i+1)*18;
    o.style.transform=`translate(calc(-50% + ${mx2*d}px),calc(-50% + ${my2*d}px))`;
  });
});
