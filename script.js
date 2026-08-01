/* ==========================================================================
   SHRUTEE'S BIRTHDAY CELEBRATION - SCRIPT
   Interactive Engine & Web Audio Synthesizer (Autoplay & Mobile Optimized)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const isMobile = window.innerWidth <= 768;

  // --- 1. STARRY CANVAS ANIMATION (MOBILE OPTIMIZED) ---
  const canvas = document.getElementById('starsCanvas');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let fireworks = [];
  let width, height;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Star {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * (isMobile ? 1.5 : 2) + 0.5;
      this.alpha = Math.random();
      this.speed = Math.random() * 0.02 + 0.005;
    }
    update() {
      this.alpha += this.speed;
      if (this.alpha > 1 || this.alpha < 0) {
        this.speed = -this.speed;
      }
    }
    draw() {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(this.alpha)})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Firework Particle System
  class FireworkParticle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * (isMobile ? 4 : 6) + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 1;
      this.decay = Math.random() * 0.02 + 0.015;
      this.size = Math.random() * 3 + 2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.05; // gravity
      this.alpha -= this.decay;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function launchFireworks(x = width / 2, y = height / 3, count = (isMobile ? 50 : 80)) {
    const colors = ['#ff758c', '#ffd700', '#7b2cbf', '#ffb3c6', '#ffffff', '#4cc9f0'];
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      fireworks.push(new FireworkParticle(x, y, color));
    }
  }

  const starCount = isMobile ? 80 : 150;
  for (let i = 0; i < starCount; i++) {
    stars.push(new Star());
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach(star => {
      star.update();
      star.draw();
    });

    for (let i = fireworks.length - 1; i >= 0; i--) {
      fireworks[i].update();
      fireworks[i].draw();
      if (fireworks[i].alpha <= 0) {
        fireworks.splice(i, 1);
      }
    }

    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();


  // Helper for touch & click binding
  function addTapListener(element, callback) {
    if (!element) return;
    let touched = false;
    element.addEventListener('touchstart', (e) => {
      touched = true;
      callback(e);
    }, { passive: true });
    element.addEventListener('click', (e) => {
      if (!touched) callback(e);
      touched = false;
    });
  }


  // --- 2. ENHANCED MAGICAL MUSIC BOX SYNTHESIZER ---
  let audioCtx = null;
  let isPlaying = false;
  let currentNoteIndex = 0;
  let melodyTimeout = null;
  let delayNode = null;

  // Rich Polyphonic Music Box Song Sheet (Notes + Harmony Chords)
  const magicalMelody = [
    // Phrase 1
    { note: 261.63, chord: [130.81, 196.00], duration: 0.4 }, // C4 + C3/G3 bass
    { note: 261.63, duration: 0.3 },
    { note: 293.66, chord: [146.83, 220.00], duration: 0.6 }, // D4
    { note: 261.63, duration: 0.6 },
    { note: 349.23, chord: [174.61, 261.63], duration: 0.6 }, // F4
    { note: 329.63, chord: [164.81, 246.94], duration: 1.1 }, // E4

    // Phrase 2
    { note: 261.63, chord: [130.81, 196.00], duration: 0.4 },
    { note: 261.63, duration: 0.3 },
    { note: 293.66, chord: [146.83, 220.00], duration: 0.6 },
    { note: 261.63, duration: 0.6 },
    { note: 392.00, chord: [196.00, 293.66], duration: 0.6 }, // G4
    { note: 349.23, chord: [174.61, 261.63], duration: 1.1 }, // F4

    // Phrase 3
    { note: 261.63, chord: [130.81, 196.00], duration: 0.4 },
    { note: 261.63, duration: 0.3 },
    { note: 523.25, chord: [261.63, 392.00], duration: 0.6 }, // C5
    { note: 440.00, chord: [220.00, 329.63], duration: 0.6 }, // A4
    { note: 349.23, chord: [174.61, 261.63], duration: 0.6 }, // F4
    { note: 329.63, duration: 0.6 },
    { note: 293.66, chord: [146.83, 220.00], duration: 0.9 }, // D4

    // Phrase 4 (Grand Finale)
    { note: 466.16, chord: [233.08, 349.23], duration: 0.4 }, // Bb4
    { note: 466.16, duration: 0.3 },
    { note: 440.00, chord: [220.00, 329.63], duration: 0.6 }, // A4
    { note: 349.23, chord: [174.61, 261.63], duration: 0.6 }, // F4
    { note: 392.00, chord: [196.00, 293.66], duration: 0.6 }, // G4
    { note: 349.23, chord: [130.81, 174.61, 261.63], duration: 1.4 }  // F4 Chord Resolution
  ];

  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create Reverb / Echo Delay Node for shimmering ambient feel
      delayNode = audioCtx.createDelay();
      delayNode.delayTime.value = 0.25;
      
      const feedback = audioCtx.createGain();
      feedback.gain.value = 0.3; // 30% feedback

      delayNode.connect(feedback);
      feedback.connect(delayNode);
      delayNode.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playMusicBoxNote(freq, duration, isBass = false) {
    const ctx = getAudioContext();

    // Fundamental Sine / Bell Oscillator
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = isBass ? 'triangle' : 'sine';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(freq, ctx.currentTime);
    osc2.frequency.setValueAtTime(freq * 2, ctx.currentTime); // Octave overtone for shimmer

    const volume = isBass ? 0.08 : 0.14;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration + 0.5);

    osc1.connect(gain);
    osc2.connect(gain);

    gain.connect(ctx.destination);
    if (delayNode && !isBass) {
      gain.connect(delayNode); // Add shimmer echo to lead melody notes
    }

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + duration + 0.6);
    osc2.stop(ctx.currentTime + duration + 0.6);
  }

  function playTone(freq, duration) {
    playMusicBoxNote(freq, duration, false);
  }

  function playMelodyStep() {
    if (!isPlaying) return;
    const current = magicalMelody[currentNoteIndex];
    
    // Play Lead Melody Note
    playMusicBoxNote(current.note, current.duration, false);

    // Play Polyphonic Harmony Chord (if present)
    if (current.chord) {
      current.chord.forEach(bassFreq => {
        playMusicBoxNote(bassFreq, current.duration * 1.2, true);
      });
    }

    currentNoteIndex = (currentNoteIndex + 1) % magicalMelody.length;
    melodyTimeout = setTimeout(playMelodyStep, current.duration * 1000 + 120);
  }

  function startMusic() {
    if (isPlaying) return;
    isPlaying = true;
    currentNoteIndex = 0;
    const musicToggle = document.getElementById('musicToggle');
    if (musicToggle) {
      musicToggle.classList.add('playing');
      musicToggle.querySelector('.music-text').textContent = 'Pause Music 🎵';
    }
    playMelodyStep();
  }

  function stopMusic() {
    isPlaying = false;
    clearTimeout(melodyTimeout);
    const musicToggle = document.getElementById('musicToggle');
    if (musicToggle) {
      musicToggle.classList.remove('playing');
      musicToggle.querySelector('.music-text').textContent = 'Play Birthday Tune';
    }
  }

  const musicToggle = document.getElementById('musicToggle');
  addTapListener(musicToggle, () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  });

  // Autoplay Trigger: On first user interaction (touch, click, scroll) start music automatically!
  let hasAutoplayed = false;
  function handleFirstUserInteraction() {
    if (hasAutoplayed) return;
    hasAutoplayed = true;
    startMusic();
    window.removeEventListener('click', handleFirstUserInteraction);
    window.removeEventListener('touchstart', handleFirstUserInteraction);
    window.removeEventListener('scroll', handleFirstUserInteraction);
  }

  window.addEventListener('click', handleFirstUserInteraction, { once: true });
  window.addEventListener('touchstart', handleFirstUserInteraction, { once: true });
  window.addEventListener('scroll', handleFirstUserInteraction, { once: true });

  // Attempt instant autoplay
  try {
    startMusic();
  } catch(e) {}


  // --- 3. COUNTDOWN TIMER TO 2ND AUGUST 2026 ---
  function updateCountdown() {
    const targetDate = new Date('2026-08-02T00:00:00+05:30');
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      document.getElementById('cdHours').textContent = '00';
      document.getElementById('cdMins').textContent = '00';
      document.getElementById('cdSecs').textContent = '00';
      return;
    }

    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cdMins').textContent = String(mins).padStart(2, '0');
    document.getElementById('cdSecs').textContent = String(secs).padStart(2, '0');
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();


  // --- 4. INTERACTIVE SURPRISE GENERATOR ---
  const surprises = [
    {
      icon: '🎆',
      title: 'Fireworks Shower!',
      text: 'A burst of magical starry fireworks launched just to celebrate Shrutee on 2nd August 2026!'
    },
    {
      icon: '🎶',
      title: 'Birthday Melody Unlocked!',
      text: 'Playing a sweet birthday tune! Tap the music button anytime to pause/play!'
    },
    {
      icon: '🧁',
      title: 'Unlimited Birthday Treats!',
      text: 'You get a virtual lifetime supply of delicious cupcakes, golden sprinkles, and sweet smiles!'
    },
    {
      icon: '💌',
      title: 'Secret Compliment',
      text: '"Shrutee, your positivity and kindness have an incredible way of lighting up every single day!"'
    },
    {
      icon: '💫',
      title: 'Starry Wish 2026',
      text: 'May 2026 bring you endless health, joyful laughter, tremendous success, and pure magic!'
    },
    {
      icon: '🎁',
      title: 'Special VIP Badge',
      text: 'Congratulations! You hold the official title of the most awesome person of 2026!'
    },
    {
      icon: '✨',
      title: 'Future Memory Wish',
      text: 'Even though we haven\'t met in person yet, I look forward to the day we finally meet and celebrate!'
    },
    {
      icon: '👑',
      title: 'Royal Crown Ceremony',
      text: 'Crowning Shrutee as the absolute Birthday Queen of 2nd August 2026!'
    }
  ];

  let surpriseIndex = 0;
  const surpriseModal = document.getElementById('surpriseModal');
  const closeSurpriseBtn = document.getElementById('closeSurpriseBtn');
  const surpriseHeroBtn = document.getElementById('surpriseHeroBtn');
  const mainSurpriseBtn = document.getElementById('mainSurpriseBtn');
  const nextSurpriseBtn = document.getElementById('nextSurpriseBtn');
  const surpriseDisplay = document.getElementById('surpriseDisplay');

  function triggerSurprise() {
    const current = surprises[surpriseIndex % surprises.length];
    surpriseIndex++;

    launchFireworks(width / 2, height / 3, isMobile ? 60 : 100);
    playTone(523.25, 0.4);

    document.getElementById('surpriseModalIcon').textContent = current.icon;
    document.getElementById('surpriseModalTitle').textContent = current.title;
    document.getElementById('surpriseModalText').textContent = current.text;

    document.getElementById('surpriseIcon').textContent = current.icon;
    document.getElementById('surpriseText').textContent = current.text;
    if (surpriseDisplay) surpriseDisplay.classList.remove('hidden');

    if (surpriseModal) surpriseModal.classList.remove('hidden');
  }

  addTapListener(surpriseHeroBtn, triggerSurprise);
  addTapListener(mainSurpriseBtn, triggerSurprise);
  addTapListener(nextSurpriseBtn, triggerSurprise);
  addTapListener(closeSurpriseBtn, () => surpriseModal.classList.add('hidden'));


  // --- 5. SECRET LETTER UNBOXING & TYPEWRITER ---
  const openLetterBtn = document.getElementById('openLetterBtn');
  const closeLetterBtn = document.getElementById('closeLetterBtn');
  const bottomCloseLetterBtn = document.getElementById('bottomCloseLetterBtn');
  const letterModal = document.getElementById('letterModal');
  const waxSeal = document.getElementById('waxSeal');
  const envelope = document.getElementById('envelope');
  const letterTextElement = document.getElementById('letterText');

  function hideLetterModal() {
    if (letterModal) letterModal.classList.add('hidden');
  }

  addTapListener(openLetterBtn, () => {
    if (letterModal) letterModal.classList.remove('hidden');
  });

  addTapListener(closeLetterBtn, hideLetterModal);
  addTapListener(bottomCloseLetterBtn, hideLetterModal);

  // Backdrop click close
  if (letterModal) {
    letterModal.addEventListener('click', (e) => {
      if (e.target === letterModal) {
        hideLetterModal();
      }
    });
  }

  // Escape key close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideLetterModal();
      if (surpriseModal) surpriseModal.classList.add('hidden');
    }
  });

  const letterContent = 
`Dear Shrutee,

Happy Birthday! 🎂✨

On this special day, August 2, 2026, I wanted to create something truly special for you.

Even though we haven't met in real life yet, your presence, your warm conversations, and your wonderful energy have brought so much happiness into my life. Talking to you always brightens up the day!

I hope your 2026 birthday is filled with endless smiles, sweet treats, and pure joy. May this new year of your life bring you closer to all your dreams... and hopefully, the day we finally get to meet and celebrate in person!

Keep shining brightly like the star that you are.

Happy Birthday, Shrutee! 🎉💖

— With lots of love & warm wishes,
Your Varanasi friend, Nihal Kumar`;

  let isLetterOpened = false;

  addTapListener(waxSeal, () => {
    if (isLetterOpened) return;
    isLetterOpened = true;
    envelope.classList.add('open');
    playTone(440, 0.3);
    launchFireworks(width / 2, height / 2, isMobile ? 40 : 60);

    let i = 0;
    letterTextElement.textContent = '';
    const speed = isMobile ? 20 : 25;

    function typeWriter() {
      if (i < letterContent.length) {
        letterTextElement.textContent += letterContent.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      }
    }
    setTimeout(typeWriter, 500);
  });


  // --- 6. CANDLE BLOWING & CAKE INTERACTION ---
  const blowCandlesBtn = document.getElementById('blowCandlesBtn');
  const flames = [document.getElementById('flame1'), document.getElementById('flame2'), document.getElementById('flame3')];
  const celebrationBanner = document.getElementById('celebrationBanner');
  let candlesBlown = false;

  function blowOutCandles() {
    if (candlesBlown) return;
    candlesBlown = true;

    flames.forEach(flame => {
      if (flame) flame.classList.add('blown-out');
    });

    playTone(659.25, 0.5);
    launchFireworks(width / 2, height / 3, isMobile ? 60 : 120);
    launchFireworks(width / 4, height / 2, isMobile ? 40 : 80);

    if (celebrationBanner) celebrationBanner.classList.remove('hidden');
    if (blowCandlesBtn) blowCandlesBtn.textContent = '🎉 Wish Sent To The Stars!';
  }

  flames.forEach(flame => {
    addTapListener(flame, blowOutCandles);
  });
  addTapListener(blowCandlesBtn, blowOutCandles);


  // --- 7. COMPLIMENT GENERATOR ---
  const compliments = [
    '"Shrutee, your kindness has an effortless charm that brightens anyone\'s day!"',
    '"You possess a genuinely warm and positive vibe that is super contagious!"',
    '"Unapologetically awesome, thoughtful, and standard-setting in every way!"',
    '"Conversations with you are always a breath of fresh air!"',
    '"Here\'s to another year of great laughs, wonderful achievements, and magic!"'
  ];

  let compIndex = 0;
  const complimentText = document.getElementById('complimentText');
  const nextComplimentBtn = document.getElementById('nextComplimentBtn');

  if (nextComplimentBtn) {
    addTapListener(nextComplimentBtn, () => {
      compIndex = (compIndex + 1) % compliments.length;
      complimentText.style.opacity = 0;
      setTimeout(() => {
        complimentText.textContent = compliments[compIndex];
        complimentText.style.opacity = 1;
      }, 200);
    });
  }


  // --- 8. MAGIC WISH JAR ---
  const wishes = [
    '✨ Wish #1: May 2026 bring you endless happiness & peace of mind!',
    '🌟 Wish #2: May all your goals and ambitions manifest effortlessly!',
    '💖 Wish #3: May your smile never fade and your days be full of laughter!',
    '🥳 Wish #4: May you be surrounded by love, warmth, and great food always!',
    '💫 Wish #5: Looking forward to the day we finally meet and celebrate!'
  ];

  const magicJar = document.getElementById('magicJar');
  const wishNoteModal = document.getElementById('wishNoteModal');
  const wishNoteContent = document.getElementById('wishNoteContent');
  let wishIdx = 0;

  if (magicJar) {
    addTapListener(magicJar, () => {
      const selectedWish = wishes[wishIdx % wishes.length];
      wishIdx++;
      wishNoteContent.textContent = selectedWish;
      wishNoteModal.classList.remove('hidden');
      playTone(587.33, 0.3);
      launchFireworks(width / 2, height / 2, isMobile ? 30 : 40);
    });
  }


  // --- 9. POLAROID LIGHTBOX ---
  const polaroids = document.querySelectorAll('.polaroid-frame');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeLightbox = document.getElementById('closeLightbox');

  polaroids.forEach(frame => {
    addTapListener(frame, () => {
      const img = frame.querySelector('img');
      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightbox.classList.remove('hidden');
      }
    });
  });

  if (closeLightbox) {
    addTapListener(closeLightbox, () => {
      lightbox.classList.add('hidden');
    });
  }

});
