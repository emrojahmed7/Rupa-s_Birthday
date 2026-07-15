/* =========================================================
   PREMIUM BIRTHDAY SURPRISE — script.js
   Complete rewrite — Production Quality
   =========================================================
   CONTENTS
   1.  Helpers & Config
   2.  Loading Screen
   3.  Navigation
   4.  Scroll Progress & Back to Top
   5.  Scroll Reveal
   6.  Atmosphere: Sparkles
   7.  Floating Hearts
   8.  Global Music Player
   9.  Secret Heart Modal
   10. Memories: Lightbox + Slideshow
   11. Reasons: Reveal Cards
   12. Wishes: Typewriter Effect
   13. Surprise Finale: Countdown, Confetti, Fireworks, Balloons
   ========================================================= */

(function () {
  'use strict';

  /* =========================
     1. HELPERS & CONFIG
     ========================= */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rand = (min, max) => Math.random() * (max - min) + min;
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  const CONFIG = {
    typewriterSpeed: 30,
    lightboxInterval: 3500,
    confettiCount: 150,
    fireworksBursts: 8,
    balloonCount: 12,
    sparkleCount: 30,
    heartInterval: 2200,
  };

  /* =========================
     2. LOADING SCREEN
     ========================= */
  window.addEventListener('load', () => {
    const loader = $('#loader');
    if (loader) {
      setTimeout(() => {
        loader.classList.add('is-hidden');
        loader.setAttribute('aria-hidden', 'true');
      }, 700);
    }
  });

  /* =========================
     3. NAVIGATION
     ========================= */
  const nav = $('#nav');
  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');

  if (navToggle && navLinks) {
    const toggleNav = () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    };

    navToggle.addEventListener('click', toggleNav);

    // Close on link click
    $$('a', navLinks).forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('is-open') && !nav.contains(e.target)) {
        navLinks.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* =========================
     4. SCROLL PROGRESS & BACK TO TOP
     ========================= */
  const progressBar = $('#progressBar');
  const toTop = $('#toTop');

  const updateScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const pct = height > 0 ? (scrollTop / height) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = pct + '%';
      progressBar.setAttribute('aria-valuenow', Math.round(pct));
    }

    if (nav) {
      nav.classList.toggle('is-scrolled', scrollTop > 20);
    }

    if (toTop) {
      toTop.classList.toggle('is-visible', scrollTop > 400);
    }
  };

  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });
  updateScroll();

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReduced ? 'auto' : 'smooth',
      });
    });
  }

  /* =========================
     5. SCROLL REVEAL
     ========================= */
  const revealEls = $$('.reveal');

  if (revealEls.length) {
    if (!prefersReduced && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target;
              const delay = parseInt(el.getAttribute('data-delay')) || 0;
              setTimeout(() => {
                el.classList.add('is-visible');
              }, delay);
              observer.unobserve(el);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      revealEls.forEach((el) => observer.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    }
  }

  /* =========================
     6. ATMOSPHERE: SPARKLES
     ========================= */
  function buildSparkles() {
    const container = $('#atmosphere');
    if (!container || prefersReduced) return;

    const count = window.innerWidth < 600 ? 15 : CONFIG.sparkleCount;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const spark = document.createElement('span');
      spark.className = 'spark';
      spark.style.left = rand(0, 100) + '%';
      spark.style.top = rand(0, 100) + '%';
      spark.style.width = rand(2, 5) + 'px';
      spark.style.height = spark.style.width;
      spark.style.animationDuration = rand(2, 5) + 's';
      spark.style.animationDelay = rand(0, 4) + 's';
      spark.style.boxShadow = `0 0 ${rand(4, 12)}px ${rand(2, 4)}px var(--accent-light)`;
      fragment.appendChild(spark);
    }

    container.appendChild(fragment);
  }

  buildSparkles();

  /* =========================
     7. FLOATING HEARTS
     ========================= */
  const heartsContainer = $('#floatingHearts');

  function createHeart() {
    if (!heartsContainer || prefersReduced) return;

    const heart = document.createElement('span');
    heart.className = 'f-heart';
    heart.textContent = ['❤', '💖', '💕', '✨', '🌸'][Math.floor(rand(0, 5))];
    heart.style.left = rand(2, 96) + '%';
    heart.style.fontSize = rand(14, 28) + 'px';
    heart.style.animationDuration = rand(8, 16) + 's';
    heart.style.animationDelay = '0s';

    heartsContainer.appendChild(heart);

    // Clean up after animation
    setTimeout(() => {
      if (heart.parentNode) heart.remove();
    }, 18000);
  }

  if (heartsContainer && !prefersReduced) {
    // Initial burst
    for (let i = 0; i < 4; i++) {
      setTimeout(createHeart, i * 300);
    }
    // Continuous
    setInterval(createHeart, CONFIG.heartInterval);
  }

  /* =========================
     8. GLOBAL MUSIC PLAYER
     ========================= */
  const audio = $('#bgMusic');
  const musicPlayer = $('#musicPlayer');
  const musicToggle = $('#musicToggle');
  const musicIcon = $('#musicIcon');
  const musicProgress = $('#musicProgress');
  const musicTooltip = $('#musicTooltip');
  const progressContainer = musicProgress ? musicProgress.parentElement : null;

  if (audio && musicToggle) {
    audio.volume = 0.35;

    // Load saved state
    const savedTime = localStorage.getItem('rupa-music-time');
    if (savedTime) {
      audio.currentTime = parseFloat(savedTime);
    }

    const updateUI = (isPlaying) => {
      if (musicPlayer) {
        musicPlayer.classList.toggle('is-playing', isPlaying);
      }
      if (musicIcon) {
        musicIcon.textContent = isPlaying ? '⏸' : '🎵';
      }
      if (musicToggle) {
        musicToggle.setAttribute(
          'aria-label',
          isPlaying ? 'Pause music' : 'Play music'
        );
      }
      if (musicTooltip) {
        musicTooltip.textContent = isPlaying ? 'Playing…' : 'Play music';
      }
    };

    const play = () => {
      audio
        .play()
        .then(() => {
          updateUI(true);
          localStorage.setItem('rupa-music', 'on');
        })
        .catch(() => {
          updateUI(false);
          localStorage.setItem('rupa-music', 'off');
        });
    };

    const pause = () => {
      localStorage.setItem('rupa-music-time', audio.currentTime);
      audio.pause();
      updateUI(false);
      localStorage.setItem('rupa-music', 'off');
    };

    const toggle = () => {
      if (audio.paused) {
        play();
      } else {
        pause();
      }
    };

    musicToggle.addEventListener('click', toggle);

    // Progress bar
    audio.addEventListener('timeupdate', () => {
      localStorage.setItem('rupa-music-time', audio.currentTime);
      if (musicProgress && audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        musicProgress.style.width = pct + '%';
        if (progressContainer) {
          progressContainer.setAttribute('aria-valuenow', Math.round(pct));
        }
      }
    });

    audio.addEventListener('ended', () => {
      localStorage.setItem('rupa-music-time', 0);
      updateUI(false);
      if (musicProgress) {
        musicProgress.style.width = '0%';
      }
    });

    // Click to seek
    if (progressContainer) {
      progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const pct = clamp((e.clientX - rect.left) / rect.width, 0, 1);
        if (audio.duration) {
          audio.currentTime = pct * audio.duration;
        }
      });
    }

    // Restore state
    if (localStorage.getItem('rupa-music') === 'on') {
      play();
    }
  }

  /* =========================
     9. SECRET HEART MODAL
     ========================= */
  const secretHeart = $('#secretHeart');
  const secretModal = $('#secretModal');
  const secretClose = $('#secretClose');

  if (secretHeart && secretModal) {
    const openSecret = () => {
      secretModal.classList.add('is-open');
      secretModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      const focusable = secretModal.querySelector('button, a, input');
      if (focusable) setTimeout(() => focusable.focus(), 100);
    };

    const closeSecret = () => {
      secretModal.classList.remove('is-open');
      secretModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (secretHeart) secretHeart.focus();
    };

    secretHeart.addEventListener('click', openSecret);

    if (secretClose) {
      secretClose.addEventListener('click', closeSecret);
    }

    // Click overlay to close
    secretModal.addEventListener('click', (e) => {
      if (e.target === secretModal || e.target.classList.contains('secret-modal__overlay')) {
        closeSecret();
      }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && secretModal.classList.contains('is-open')) {
        closeSecret();
      }
    });
  }

  /* =========================
     10. MEMORIES: LIGHTBOX + SLIDESHOW
     ========================= */
  const galleryItems = $$('.gallery__item');
  const lightbox = $('#lightbox');

  if (galleryItems.length && lightbox) {
    const lbImg = $('#lbImg');
    const lbCaption = $('#lbCaption');
    const lbCounter = $('#lbCounter');
    const lbLoader = $('#lbLoader');
    const lbClose = $('#lbClose');
    const lbPrev = $('#lbPrev');
    const lbNext = $('#lbNext');
    const lbPlay = $('#lbPlay');

    // Build slides data
    const slides = galleryItems.map((fig) => {
      const img = $('img', fig);
      const caption = fig.querySelector('figcaption');
      const note = fig.querySelector('.gallery__note');
      return {
        src: img ? img.getAttribute('src') : '',
        alt: img ? img.getAttribute('alt') || '' : '',
        caption: caption ? caption.textContent.trim() : '',
        note: note ? note.textContent.trim() : '',
      };
    });

    let current = 0;
    let slideTimer = null;

    const renderSlide = () => {
      const slide = slides[current];
      if (!slide) return;

      if (lbLoader) lbLoader.style.display = 'block';
      if (lbImg) {
        lbImg.style.opacity = '0';

        const img = new Image();
        img.onload = () => {
          if (lbLoader) lbLoader.style.display = 'none';
          if (lbImg) lbImg.style.opacity = '1';
        };
        img.onerror = () => {
          if (lbLoader) lbLoader.style.display = 'none';
          if (lbImg) lbImg.style.opacity = '1';
        };
        img.src = slide.src;

        lbImg.src = slide.src;
        lbImg.alt = slide.alt;
      }

      if (lbCaption) {
        const noteText = slide.note ? ` — ${slide.note}` : '';
        lbCaption.textContent = slide.caption + noteText;
      }

      if (lbCounter) {
        lbCounter.textContent = `${current + 1} / ${slides.length}`;
      }
    };

    const openLightbox = (index) => {
      current = index;
      renderSlide();
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (lbClose) lbClose.focus();
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      stopSlideshow();
    };

    const nextSlide = () => {
      current = (current + 1) % slides.length;
      renderSlide();
    };

    const prevSlide = () => {
      current = (current - 1 + slides.length) % slides.length;
      renderSlide();
    };

    const startSlideshow = () => {
      if (slideTimer) return;
      slideTimer = setInterval(nextSlide, CONFIG.lightboxInterval);
      if (lbPlay) lbPlay.innerHTML = '<span aria-hidden="true">❙❙</span> Pause';
    };

    const stopSlideshow = () => {
      clearInterval(slideTimer);
      slideTimer = null;
      if (lbPlay) lbPlay.innerHTML = '<span aria-hidden="true">▶</span> Slideshow';
    };

    // Attach click handlers to gallery items
    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => openLightbox(i));

      // Keyboard support
      item.setAttribute('tabindex', '0');
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(i);
        }
      });
    });

    // Lightbox controls
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbNext) lbNext.addEventListener('click', nextSlide);
    if (lbPrev) lbPrev.addEventListener('click', prevSlide);

    if (lbPlay) {
      lbPlay.addEventListener('click', () => {
        slideTimer ? stopSlideshow() : startSlideshow();
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextSlide();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevSlide();
    });

    // Touch swipe
    let touchStartX = 0;
    let touchStartY = 0;

    lightbox.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      },
      { passive: true }
    );

    lightbox.addEventListener(
      'touchend',
      (e) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = touchStartX - endX;
        const diffY = touchStartY - endY;

        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
          if (diffX > 0) nextSlide();
          else prevSlide();
        }
      },
      { passive: true }
    );

    // Click outside to close
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  /* =========================
     11. REASONS: REVEAL CARDS
     ========================= */
  const reasonCards = $$('.reason');
  const reasonCounter = $('#reasonCounter');
  const reasonsCelebration = $('#reasonsCelebration');

  if (reasonCards.length) {
    const updateCounter = () => {
      const open = $$('.reason.is-open').length;
      if (reasonCounter) {
        reasonCounter.textContent = `${open} / ${reasonCards.length} revealed`;
      }
      if (reasonsCelebration) {
        if (open === reasonCards.length) {
          reasonsCelebration.classList.add('is-visible');
          reasonsCelebration.setAttribute('aria-hidden', 'false');
        } else {
          reasonsCelebration.classList.remove('is-visible');
          reasonsCelebration.setAttribute('aria-hidden', 'true');
        }
      }
    };

    reasonCards.forEach((card) => {
      card.addEventListener('click', () => {
        const isOpen = card.classList.contains('is-open');

        // Close all others
        reasonCards.forEach((c) => {
          c.classList.remove('is-open');
          c.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          card.classList.add('is-open');
          card.setAttribute('aria-expanded', 'true');

          // Scroll into view if needed
          const rect = card.getBoundingClientRect();
          if (rect.bottom > window.innerHeight - 100) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }

        updateCounter();
      });

      // Keyboard support
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });

    updateCounter();
  }

  /* =========================
     12. WISHES: TYPEWRITER EFFECT
     ========================= */
  const typewriterEl = $('#typewriter');
  const typewriterCursor = $('#typewriterCursor');
  const typewriterSkip = $('#typewriterSkip');
  const typewriterProgress = $('#typewriterProgress');

  if (typewriterEl) {
    const letterText =
      "My dearest Rupa, on this special day I want you to know how genuinely and deeply you are valued. You carry a quiet warmth that makes ordinary moments feel meaningful and every space around you feel a little kinder. The way you understand people, and make them feel seen, is a rare and beautiful gift. As this new year begins, may it return to you all the joy, peace, and love you so freely give to others, and may every dream you hold close find its way to you. Thank you for simply being you. Happy Birthday, Rupa. Today, and always, you are truly appreciated.";

    if (prefersReduced) {
      typewriterEl.textContent = letterText;
      typewriterEl.classList.add('is-done');
      if (typewriterCursor) typewriterCursor.classList.add('is-hidden');
      if (typewriterSkip) typewriterSkip.classList.add('is-hidden');
      if (typewriterProgress) typewriterProgress.textContent = '100% ✓';
    } else {
      let charIndex = 0;
      let isSkipped = false;

      const typeChar = () => {
        if (isSkipped) return;

        if (charIndex <= letterText.length) {
          typewriterEl.textContent = letterText.slice(0, charIndex);

          if (typewriterProgress) {
            const pct = Math.round((charIndex / letterText.length) * 100);
            typewriterProgress.textContent = pct + '%';
          }

          charIndex++;
          setTimeout(typeChar, CONFIG.typewriterSpeed);
        } else {
          // Done
          typewriterEl.classList.add('is-done');
          if (typewriterCursor) typewriterCursor.classList.add('is-hidden');
          if (typewriterSkip) typewriterSkip.classList.add('is-hidden');
          if (typewriterProgress) typewriterProgress.textContent = '100% ✓';

          // Trigger celebration
          document.dispatchEvent(new CustomEvent('letterComplete'));
        }
      };

      const skipTyping = () => {
        isSkipped = true;
        typewriterEl.textContent = letterText;
        typewriterEl.classList.add('is-done');
        if (typewriterCursor) typewriterCursor.classList.add('is-hidden');
        if (typewriterSkip) typewriterSkip.classList.add('is-hidden');
        if (typewriterProgress) typewriterProgress.textContent = '100% ✓';

        document.dispatchEvent(new CustomEvent('letterComplete'));
      };

      if (typewriterSkip) {
        typewriterSkip.addEventListener('click', skipTyping);
      }

      // Start typing after a short delay
      setTimeout(typeChar, 600);
    }
  }

  /* =========================
     13. SURPRISE FINALE
     ========================= */
  const finaleStart = $('#finaleStart');
  const revealBtn = $('#revealBtn');
  const finaleCount = $('#finaleCount');
  const countNumber = $('#countNumber');
  const finaleReveal = $('#finaleReveal');
  const replayBtn = $('#replayBtn');
  const balloonsWrap = $('#balloons');
  const canvas = $('#fxCanvas');

  if (revealBtn && finaleReveal) {
    let ctx = null;
    let particles = [];
    let animationId = null;
    let isAnimating = false;
    let dpr = 1;

    // Canvas setup
    function setupCanvas() {
      if (!canvas) return;
      dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';

      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    }

    if (canvas) {
      ctx = canvas.getContext('2d');
      setupCanvas();
      window.addEventListener('resize', setupCanvas);
    }

    const COLORS = [
      '#d46a8a', '#e89ab0', '#c9a24b', '#8a7ad6',
      '#ffd36e', '#ffffff', '#ff6b6b', '#74b9ff',
      '#fdcb6e', '#fd79a8', '#a29bfe',
    ];

    // Particle system
    function addConfetti(count) {
      const num = prefersReduced ? Math.floor(count / 2) : count;
      const w = canvas ? canvas.width / dpr : window.innerWidth;
      const h = canvas ? canvas.height / dpr : window.innerHeight;

      for (let i = 0; i < num; i++) {
        particles.push({
          type: 'confetti',
          x: rand(0, w),
          y: rand(-h * 0.5, 0),
          w: rand(6, 14),
          h: rand(8, 18),
          color: COLORS[Math.floor(rand(0, COLORS.length))],
          vx: rand(-1.8, 1.8),
          vy: rand(2, 7),
          rot: rand(0, Math.PI * 2),
          vr: rand(-0.3, 0.3),
        });
      }
    }

    function addFirework(x, y) {
      const color = COLORS[Math.floor(rand(0, COLORS.length))];
      const count = prefersReduced ? 18 : 36;

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + rand(-0.08, 0.08);
        const speed = rand(2, 6);
        particles.push({
          type: 'spark',
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: color,
          life: 1,
          size: rand(2, 5),
        });
      }
    }

    function updateParticles() {
      const w = canvas ? canvas.width / dpr : window.innerWidth;
      const h = canvas ? canvas.height / dpr : window.innerHeight;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        if (p.type === 'confetti') {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.06;
          p.rot += p.vr;
          p.vx *= 0.995;

          if (p.y > h + 20) {
            particles.splice(i, 1);
          }
        } else {
          // spark
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.04;
          p.life -= 0.015;

          if (p.life <= 0) {
            particles.splice(i, 1);
          }
        }
      }
    }

    function drawParticles() {
      if (!ctx) return;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        if (p.type === 'confetti') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = 0.92;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        } else {
          // spark
          ctx.globalAlpha = Math.max(p.life, 0);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size || 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }
      });
    }

    function animate() {
      if (!ctx) return;
      updateParticles();
      drawParticles();
      animationId = requestAnimationFrame(animate);
    }

    function startFX() {
      if (prefersReduced || !ctx) return;
      if (isAnimating) return;
      isAnimating = true;

      const w = canvas ? canvas.width / dpr : window.innerWidth;
      const h = canvas ? canvas.height / dpr : window.innerHeight;

      particles = [];
      addConfetti(CONFIG.confettiCount);

      // Initial burst
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          addFirework(
            rand(w * 0.15, w * 0.85),
            rand(h * 0.15, h * 0.45)
          );
        }, i * 300);
      }

      animate();

      // Continue bursts
      let burstCount = 0;
      const burstInterval = setInterval(() => {
        if (burstCount >= CONFIG.fireworksBursts) {
          clearInterval(burstInterval);
          setTimeout(() => {
            isAnimating = false;
          }, 3000);
          return;
        }

        addFirework(
          rand(w * 0.15, w * 0.85),
          rand(h * 0.15, h * 0.5)
        );

        // Sometimes double burst
        if (Math.random() > 0.5) {
          setTimeout(() => {
            addFirework(
              rand(w * 0.15, w * 0.85),
              rand(h * 0.15, h * 0.5)
            );
          }, 200);
        }

        burstCount++;
      }, 900);
    }

    function stopFX() {
      cancelAnimationFrame(animationId);
      particles = [];
      isAnimating = false;
      if (ctx) {
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;
        ctx.clearRect(0, 0, w, h);
      }
    }

    // Balloons
    function launchBalloons() {
      if (!balloonsWrap || prefersReduced) return;
      balloonsWrap.innerHTML = '';

      const colors = [
        '#d46a8a', '#8a7ad6', '#c9a24b', '#e89ab0',
        '#ffd36e', '#ff6b6b', '#74b9ff', '#fd79a8',
      ];
      const count = prefersReduced ? Math.floor(CONFIG.balloonCount / 2) : CONFIG.balloonCount;

      for (let i = 0; i < count; i++) {
        const balloon = document.createElement('span');
        balloon.className = 'balloon';
        balloon.style.left = rand(2, 94) + '%';
        balloon.style.background = colors[i % colors.length];
        balloon.style.width = rand(36, 58) + 'px';
        balloon.style.height = rand(46, 72) + 'px';
        balloon.style.animationDuration = rand(7, 14) + 's';
        balloon.style.animationDelay = rand(0, 4) + 's';
        balloon.style.transform = 'rotate(' + rand(-10, 10) + 'deg)';
        balloonsWrap.appendChild(balloon);
      }
    }

    // Countdown
    function runCountdown(callback) {
      if (prefersReduced) {
        callback();
        return;
      }

      let count = 3;
      finaleCount.classList.add('is-active');
      finaleCount.setAttribute('aria-hidden', 'false');
      countNumber.textContent = count;

      const tick = setInterval(() => {
        count--;
        if (count <= 0) {
          clearInterval(tick);
          finaleCount.classList.remove('is-active');
          finaleCount.setAttribute('aria-hidden', 'true');
          callback();
        } else {
          countNumber.textContent = count;
          // Re-trigger animation
          countNumber.style.animation = 'none';
          void countNumber.offsetWidth;
          countNumber.style.animation = '';
        }
      }, 1000);
    }

    // Main reveal
    function playReveal() {
      if (finaleStart) {
        finaleStart.style.display = 'none';
        finaleStart.setAttribute('aria-hidden', 'true');
      }

      runCountdown(() => {
        if (finaleReveal) {
          finaleReveal.classList.add('is-active');
          finaleReveal.setAttribute('aria-hidden', 'false');
        }
        launchBalloons();
        startFX();

        // Extra heart spawn on reveal
        for (let i = 0; i < 10; i++) {
          setTimeout(createHeart, i * 200);
        }
      });
    }

    if (revealBtn) {
      revealBtn.addEventListener('click', playReveal);
    }

    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        stopFX();
        if (finaleReveal) {
          finaleReveal.classList.remove('is-active');
          finaleReveal.setAttribute('aria-hidden', 'true');
        }
        if (balloonsWrap) balloonsWrap.innerHTML = '';
        if (finaleStart) {
          finaleStart.style.display = '';
          finaleStart.setAttribute('aria-hidden', 'false');
        }

        // Reset and replay after a moment
        setTimeout(() => {
          playReveal();
        }, 400);
      });
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      stopFX();
    });
  }

  /* =========================
     LETTER COMPLETE CELEBRATION
     ========================= */
  document.addEventListener('letterComplete', () => {
    // Spawn extra hearts
    for (let i = 0; i < 12; i++) {
      setTimeout(createHeart, i * 250);
    }
  });

  /* =========================
     KEYBOARD SHORTCUTS (Global)
     ========================= */
  document.addEventListener('keydown', (e) => {
    // Alt + M to toggle music
    if (e.altKey && e.key === 'm') {
      e.preventDefault();
      if (musicToggle) musicToggle.click();
    }
  });

  console.log('✨ Happy Birthday, Rupa! 🎉');
  console.log('💖 Made with love, just for you.');

})();