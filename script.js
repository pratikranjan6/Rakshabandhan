(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const totalPages = 5;
  let currentPage = 1;

  const CONFIG = {
    SISTER_NAME: "Lopu & Lozss",
    BROTHER_NAME: "Pratik",
    MUSIC_SRC: "",
    PHOTOS: [
      { src: "WhatsApp Image 2026-08-29 at 2.02.01 PM (1) copy.jpeg", caption: "The good old days 🥹", year: "" },
      { src: "WhatsApp Image 2026-08-29 at 2.02.01 PM.jpeg", caption: "One of my favourite memories ❤️", year: "" },
      { src: "WhatsApp Image 2026-08-29 at 2.17.40 PM.jpeg", caption: "Even our fights became memories.", year: "" },
      { src: "WhatsApp Image 2026-08-29 at 12.36.49 PM.jpeg", caption: "Growing up, side by side.", year: "" },
    ],
    MESSAGES: [
      "Thank you for always being there for me.",
      "Sorry for all the times I've annoyed you... although I probably won't stop. 😂",
      "No matter how much we fight, you'll always be one of my favourite people.(Specially for lozy😘)",
      "I'm genuinely lucky to have you as my sister. you dont know how much you both mean to me.",
      "Through every high and every low, remember that you’ll always have me by your side. You can count on me, no matter what. 🫶",
      "Some things are understood without ever being said. But today, I want to say what my heart has always known  I love you more than words could ever express. ❤️",
    ],
    SURPRISE_CONTENT: "Whatever you're imagining right now...\nit's even better than that. 😉\n\nCome find me for the real thing!",
    FINAL_MESSAGE:
`We may fight, argue, annoy each other, and sometimes drive each other completely crazy… 😂❤️

But no matter where life takes us, always remember that you’ll have a brother who is just one call away. Whenever you need me  whether it’s for something big, something small, or simply because you feel like talking , never hesitate to reach out. Never think that I’ll judge you or misunderstand you. You can always come to me, no matter what, because I’ll always be there for you. 🤝❤️

Thank you for being not just my sister, but also my best friend, my guide, my constant support, and one of the most precious people in my life. Having you as my sister is truly one of the greatest blessings I could ask for.

No matter how much we grow, how far we go, or how much life changes, you’ll always have your brother standing by your side. ❤️

 Happy Raksha Bandhan, Sis! 🫶🎀
Always remember  you’re never alone. Your brother is just one call away. ❤️
`,
  };

  $('#welcomeName').textContent = CONFIG.SISTER_NAME;
  $('#finalName').textContent = `Happy Raksha Bandhan, ${CONFIG.SISTER_NAME} ❤️`;
  $('#finalMessage').textContent = CONFIG.FINAL_MESSAGE;
  $('#signatureLine').textContent = `Always ${CONFIG.BROTHER_NAME.toLowerCase().startsWith('your') ? CONFIG.BROTHER_NAME.toLowerCase() : 'your ' + CONFIG.BROTHER_NAME.toLowerCase()} ❤️`;
  $('#surpriseContent').textContent = CONFIG.SURPRISE_CONTENT;

  const timeline = $('#timeline');
  const icons = ['🌸','🪷','🧵','✨','❤️','🪔','🌼','🎀','🌺','💫'];
  CONFIG.PHOTOS.forEach((p, i) => {
    const row = document.createElement('div');
    row.className = 'memory';
    row.innerHTML = `
      <div class="memory-dot">${icons[i % icons.length]}</div>
      <div class="memory-card" data-idx="${i}">
        <div class="photo-frame">
          ${ p.src
            ? `<img src="${p.src}" alt="${p.caption}">`
            : `<div class="photo-placeholder"><span class="icon">🖼️</span><span>Add PHOTO_${i+1} in CONFIG</span></div>` }
        </div>
        <div class="memory-caption">
          <p>${p.caption}</p>
          ${p.year ? `<span>${p.year}</span>` : ''}
        </div>
      </div>`;
    timeline.appendChild(row);
  });

  $$('.memory-card').forEach(card => {
    card.addEventListener('click', () => openLightbox(parseInt(card.dataset.idx, 10)));
  });

  function openLightbox(idx){
    const p = CONFIG.PHOTOS[idx];
    const frame = $('#lightboxFrame');
    frame.innerHTML = p.src
      ? `<img src="${p.src}" alt="${p.caption}">`
      : `<div class="photo-placeholder"><span class="icon">🖼️</span><span>Add PHOTO_${idx+1} in CONFIG</span></div>`;
    $('#lightboxCaption').textContent = p.caption;
    $('#lightboxYear').textContent = p.year || '';
    $('#lightbox').classList.add('active');
  }
  $('#lightboxClose').addEventListener('click', () => $('#lightbox').classList.remove('active'));
  $('#lightbox').addEventListener('click', (e) => { if(e.target.id === 'lightbox') $('#lightbox').classList.remove('active'); });

  const threadPath = $('#threadPath');
  const threadKnot = $('#threadKnot');
  const threadLabel = $('#threadLabel');
  const pathLen = threadPath.getTotalLength ? threadPath.getTotalLength() : 400;
  threadPath.style.strokeDasharray = pathLen;

  function updateThread(page){
    const pct = (page - 1) / (totalPages - 1);
    threadPath.style.strokeDashoffset = pathLen * (1 - pct);
    const pt = threadPath.getPointAtLength(pathLen * pct);
    threadKnot.setAttribute('cx', pt.x);
    threadKnot.setAttribute('cy', pt.y);
    threadLabel.textContent = page < 5 ? `Chapter ${page} of 5` : `The Thread Is Tied ✓`;
  }

  function goToPage(n){
    if(n === currentPage) return;
    const from = $('#page' + currentPage);
    const to = $('#page' + n);
    from.classList.add('leaving');
    setTimeout(() => {
      from.classList.remove('active', 'leaving');
      to.classList.add('active');
      currentPage = n;
      updateThread(n);
      spawnPetals(6);
      window.scrollTo({top:0, behavior:'smooth'});
    }, 380);
  }
  $$('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => goToPage(parseInt(btn.dataset.goto, 10)));
  });
  updateThread(1);

  let touchStartX = null;
  document.querySelector('.app').addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, {passive:true});
  document.querySelector('.app').addEventListener('touchend', e => {
    if(touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if(Math.abs(dx) > 60 && currentPage > 1 && currentPage < 5){
      if(dx < 0 && currentPage < totalPages) goToPage(currentPage + 1);
      if(dx > 0 && currentPage > 1) goToPage(currentPage - 1);
    }
    touchStartX = null;
  }, {passive:true});

  const envelope = $('#envelope');
  envelope.addEventListener('click', openEnvelope);
  $('#openEnvelopeBtn').addEventListener('click', openEnvelope);
  let envelopeOpened = false;
  function openEnvelope(){
    if(envelopeOpened) return;
    envelopeOpened = true;
    envelope.classList.add('open');
    spawnPetals(22);
    setTimeout(() => {
      $('#envelopeScene').classList.add('hidden');
      $('#welcomeScene').classList.remove('hidden');
    }, 1000);
  }
  $('#beginBtn').addEventListener('click', () => goToPage(2));

  const revealCard = $('#revealCard');
  const revealMsg = $('#revealMsg');
  const revealHint = $('#revealHint');
  const revealProgress = $('#revealProgress');
  const revealDone = $('#revealDone');
  let revealIdx = 0;
  revealCard.addEventListener('click', () => {
    if(revealIdx >= CONFIG.MESSAGES.length){
      return;
    }
    revealMsg.textContent = CONFIG.MESSAGES[revealIdx];
    revealHint.textContent = revealIdx < CONFIG.MESSAGES.length - 1 ? '(tap for the next one)' : '(tap to finish)';
    revealCard.classList.remove('flip'); void revealCard.offsetWidth; revealCard.classList.add('flip');
    revealIdx++;
    revealProgress.textContent = `${revealIdx} / ${CONFIG.MESSAGES.length}`;
    spawnPetals(4);
    if(revealIdx === CONFIG.MESSAGES.length){
      setTimeout(() => revealDone.classList.add('show'), 500);
    }
  });

  const giftBox = $('#giftBox');
  const surpriseCard = $('#surpriseCard');
  let giftOpened = false;
  function openGift(){
    if(giftOpened) return;
    giftOpened = true;
    giftBox.classList.add('shake');
    setTimeout(() => {
      giftBox.classList.remove('shake');
      giftBox.classList.add('open');
      spawnConfetti(36);
      setTimeout(() => surpriseCard.classList.add('show'), 400);
    }, 480);
  }
  giftBox.addEventListener('click', openGift);
  $('#openGiftBtn').addEventListener('click', openGift);

  $('#replayBtn').addEventListener('click', () => {
    envelopeOpened = false;
    envelope.classList.remove('open');
    $('#envelopeScene').classList.remove('hidden');
    $('#welcomeScene').classList.add('hidden');

    revealIdx = 0;
    revealMsg.textContent = 'Tap to reveal ❤️';
    revealHint.textContent = '(tap the card)';
    revealProgress.textContent = `0 / ${CONFIG.MESSAGES.length}`;
    revealDone.classList.remove('show');

    giftOpened = false;
    giftBox.classList.remove('open');
    surpriseCard.classList.remove('show');

    goToPage(1);
    spawnPetals(16);
  });

  const floaters = $('#floaters');
  const petalEmoji = ['🌸','🌺','✨','🪷'];
  function spawnPetals(count){
    for(let i=0;i<count;i++){
      const el = document.createElement('div');
      el.className = 'floater';
      el.textContent = petalEmoji[Math.floor(Math.random()*petalEmoji.length)];
      const size = 12 + Math.random()*14;
      const left = Math.random()*100;
      const duration = 4 + Math.random()*3;
      const drift = (Math.random()*80 - 40);
      el.style.cssText = `left:${left}vw; top:-30px; font-size:${size}px; opacity:${.5+Math.random()*.4};`;
      floaters.appendChild(el);
      el.animate([
        { transform:`translate(0,0) rotate(0deg)`, offset:0 },
        { transform:`translate(${drift}px, 60vh) rotate(180deg)`, offset:.6 },
        { transform:`translate(${drift*1.4}px, 105vh) rotate(360deg)`, offset:1 }
      ], { duration: duration*1000, easing:'ease-in' });
      setTimeout(() => el.remove(), duration*1000 + 100);
    }
  }
  const confettiColors = ['#E38334','#7A1F2B','#C79A34','#F0AFC0'];
  function spawnConfetti(count){
    for(let i=0;i<count;i++){
      const el = document.createElement('div');
      el.className = 'floater';
      const size = 6 + Math.random()*6;
      const color = confettiColors[Math.floor(Math.random()*confettiColors.length)];
      const left = 50 + (Math.random()*40 - 20);
      const top = 45 + (Math.random()*10 - 5);
      const dx = (Math.random()*200 - 100);
      const dy = -(80 + Math.random()*140);
      el.style.cssText = `left:${left}vw; top:${top}vh; width:${size}px; height:${size*1.6}px; background:${color}; border-radius:2px;`;
      floaters.appendChild(el);
      const anim = el.animate([
        { transform:'translate(0,0) rotate(0deg)', opacity:1, offset:0 },
        { transform:`translate(${dx*0.5}px, ${dy}px) rotate(${180+Math.random()*180}deg)`, opacity:1, offset:.4 },
        { transform:`translate(${dx}px, ${dy+320}px) rotate(${540+Math.random()*360}deg)`, opacity:0, offset:1 }
      ], { duration: 1600 + Math.random()*600, easing:'cubic-bezier(.22,.61,.36,1)' });
      anim.onfinish = () => el.remove();
    }
  }

  const musicBtn = $('#musicBtn');
  const bgMusic = $('#bgMusic');
  let musicReady = false, musicPlaying = false;
  if(CONFIG.MUSIC_SRC){
    bgMusic.src = CONFIG.MUSIC_SRC;
    musicReady = true;
  } else {
    musicBtn.style.opacity = '.45';
    musicBtn.title = 'Add MUSIC_SRC in CONFIG to enable music';
  }
  musicBtn.addEventListener('click', () => {
    if(!musicReady) return;
    if(musicPlaying){
      bgMusic.pause();
      musicBtn.textContent = '🔇';
    } else {
      bgMusic.volume = 0.35;
      bgMusic.play().catch(() => {});
      musicBtn.textContent = '🔊';
    }
    musicPlaying = !musicPlaying;
  });

  spawnPetals(8);
})();
