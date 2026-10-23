/**
 * BIOGRAPHY PARIS — HAUTE PARFUMERIE SHOWCASE ENGINE
 * Real-Time Continuous 3D Physics Engine with Kinetic Inertia
 * Mechanical Gear Sound Synthesis (Web Audio API) & Mobile Haptics
 * Infinite Seamless Circular Buffer — Zero External Dependencies
 */

(function () {
  'use strict';

  // Automatically determine base asset URL from the script source (handles GitHub CDN, jsDelivr, or local)
  const currentScript = document.currentScript;
  const SCRIPT_BASE_URL = currentScript && currentScript.src && currentScript.src.includes('/')
    ? currentScript.src.substring(0, currentScript.src.lastIndexOf('/') + 1)
    : '';

  function resolveAssetUrl(path) {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
      return path;
    }
    return SCRIPT_BASE_URL + path;
  }

  // Configurable perfume data with direct product URLs
  const PERFUMES_DATA = [
    {
      id: 'amiriyat',
      name: 'Amiriyat',
      concentration: 'EXTRAIT DE PARFUM',
      price: '₹698',
      image: 'assets/amiriyat-tight.webp',
      url: '/shop/amiriyat-32',
      glow: 'rgba(220, 176, 140, 0.45)'
    },
    {
      id: 'miami-blues',
      name: 'Miami Blues',
      concentration: 'EXTRAIT DE PARFUM',
      price: '₹698',
      image: 'assets/miami-blues-tight.webp',
      url: '/shop/miami-blues-21',
      glow: 'rgba(140, 200, 220, 0.45)'
    },
    {
      id: 'asmara',
      name: 'Asmara',
      concentration: 'EXTRAIT DE PARFUM',
      price: '₹698',
      image: 'assets/asmara-tight.webp',
      url: '/shop/asmara-33',
      glow: 'rgba(235, 175, 100, 0.45)'
    },
    {
      id: 'the-diplomat',
      name: 'The Diplomat',
      concentration: 'EXTRAIT DE PARFUM',
      price: '₹698',
      image: 'assets/the-diplomat-tight.webp',
      url: '/shop/the-diplomat-20',
      glow: 'rgba(215, 190, 140, 0.42)'
    },
    {
      id: 'the-gambler',
      name: 'The Gambler',
      concentration: 'EXTRAIT DE PARFUM',
      price: '₹698',
      image: 'assets/the-gambler-tight.webp',
      url: '/shop/the-gambler-22',
      glow: 'rgba(220, 155, 130, 0.42)'
    },
    {
      id: 'Vanilatté',
      name: 'Vanilatté',
      concentration: 'EXTRAIT DE PARFUM',
      price: '₹698',
      image: 'assets/vanilatte-tight.webp',
      url: '/shop/vanilatte-25',
      glow: 'rgba(128, 91, 66, 0.42)'
    }
  ];

  const NUM_REAL_ITEMS = PERFUMES_DATA.length; // 4
  const REPEAT_SETS = 3; // 3 sets: clones (0..3), real (4..7), clones (8..11)
  const TOTAL_CARDS = NUM_REAL_ITEMS * REPEAT_SETS; // 12
  const INITIAL_INDEX = NUM_REAL_ITEMS; // 4 (Asmara in middle set)

  /**
   * TACTILE MECHANICAL GEAR SOUND ENGINE
   * Synthesizes mechanical ratchet/gear teeth clicks using the Web Audio API.
   * Zero external audio files, zero network latency, zero CORS issues.
   */
  class TactileSoundEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.lastTickTime = 0;
      this.minIntervalMs = 40; // Prevents buzzing during high-speed flick
      this.initOnGesture();
    }

    initOnGesture() {
      const unlockHandler = () => {
        this.unlock();
        window.removeEventListener('pointerdown', unlockHandler);
        window.removeEventListener('touchstart', unlockHandler);
        window.removeEventListener('keydown', unlockHandler);
      };
      window.addEventListener('pointerdown', unlockHandler, { passive: true });
      window.addEventListener('touchstart', unlockHandler, { passive: true });
      window.addEventListener('keydown', unlockHandler, { passive: true });
    }

    init() {
      if (this.ctx) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      } catch (e) {
        // Web Audio unsupported or blocked
      }
    }

    unlock() {
      if (!this.ctx) this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }

    playGearTick(direction = 1, intensity = 1.0, isDetentLock = false) {
      if (this.isMuted) return;
      const nowMs = performance.now();
      if (!isDetentLock && nowMs - this.lastTickTime < this.minIntervalMs) return;
      this.lastTickTime = nowMs;

      this.unlock();
      if (!this.ctx || this.ctx.state !== 'running') return;

      try {
        const t = this.ctx.currentTime;
        const masterGain = this.ctx.createGain();
        const baseVolume = isDetentLock ? 0.12 : 0.08;
        const vol = Math.min(0.18, Math.max(0.04, baseVolume * intensity));
        masterGain.gain.setValueAtTime(vol, t);
        masterGain.connect(this.ctx.destination);

        // Micro-pitch jitter for organic tooth-to-tooth realism
        const jitter = 1 + (Math.random() - 0.5) * 0.08;
        const dirPitch = direction > 0 ? 1.04 : 0.96;
        const lockMultiplier = isDetentLock ? 0.82 : 1.0;
        const rootFreq = 1800 * jitter * dirPitch * lockMultiplier;

        // 1. Tooth Contact Ping (High metallic transient)
        const oscHigh = this.ctx.createOscillator();
        const gainHigh = this.ctx.createGain();
        oscHigh.type = 'triangle';
        oscHigh.frequency.setValueAtTime(rootFreq * 1.6, t);
        oscHigh.frequency.exponentialRampToValueAtTime(rootFreq * 0.35, t + 0.015);
        gainHigh.gain.setValueAtTime(0.75, t);
        gainHigh.gain.exponentialRampToValueAtTime(0.001, t + 0.015);
        oscHigh.connect(gainHigh);
        gainHigh.connect(masterGain);
        oscHigh.start(t);
        oscHigh.stop(t + 0.016);

        // 2. Chassis Detent Body Thud (Resonance in watch/camera dial)
        const oscBody = this.ctx.createOscillator();
        const gainBody = this.ctx.createGain();
        oscBody.type = 'sine';
        oscBody.frequency.setValueAtTime(rootFreq * 0.42, t);
        oscBody.frequency.exponentialRampToValueAtTime(rootFreq * 0.16, t + (isDetentLock ? 0.032 : 0.022));
        gainBody.gain.setValueAtTime(isDetentLock ? 0.95 : 0.8, t);
        gainBody.gain.exponentialRampToValueAtTime(0.001, t + (isDetentLock ? 0.032 : 0.022));
        oscBody.connect(gainBody);
        gainBody.connect(masterGain);
        oscBody.start(t);
        oscBody.stop(t + (isDetentLock ? 0.034 : 0.024));

        // 3. Metallic Friction Burst (Filtered micro-noise snap)
        this.playNoiseSnap(t, masterGain, rootFreq);
      } catch (e) {
        // Fail silently
      }
    }

    playNoiseSnap(t, destination, rootFreq) {
      if (!this.ctx) return;
      try {
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.008);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = rootFreq * 1.8;
        filter.Q.value = 3.0;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.008);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(destination);

        noise.start(t);
        noise.stop(t + 0.009);
      } catch (e) {}
    }
  }

  /**
   * BIOGRAPHY CONTINUOUS 3D PHYSICS SLIDER
   */
  class BiographyInfiniteSlider {
    constructor() {
      this.sliderSection = document.getElementById('biographyHeroSlider');
      this.stage = document.getElementById('carouselStage');
      this.track = document.getElementById('flaconsTrack');
      if (!this.sliderSection || !this.track) return;
      this.ambientSpotlight = document.getElementById('ambientSpotlight');

      // Tactile sound engine (always active)
      this.soundEngine = new TactileSoundEngine();

      // Navigation & Footer
      this.prevBtn = document.getElementById('prevBtn');
      this.nextBtn = document.getElementById('nextBtn');
      this.summaryLink = document.getElementById('summaryLink');
      this.summaryName = document.getElementById('summaryName');
      this.summaryMeta = document.getElementById('summaryMeta');
      this.paginationIndicators = document.getElementById('paginationIndicators');

      // Geometry & Dimensions
      this.stageWidth = 0;
      this.cardWidth = 280;
      this.centerOffset = 0;
      this.tickInterval = 75; // px distance per gear tooth

      // Position & Physics State
      this.currentIndex = INITIAL_INDEX;
      this.currentTranslate = 0;
      this.targetTranslate = 0;
      this.springVelocity = 0;
      this.currentTilt = 0;
      this.lastTickTranslate = 0;
      this.lastActiveProductIndex = -1;

      // Interaction State
      this.isDragging = false;
      this.isSpringAnimating = false;
      this.rafId = null;
      this.startX = 0;
      this.dragStartTranslate = 0;
      this.lastX = 0;
      this.lastTime = 0;
      this.dragVelocity = 0;
      this.hasMovedSignificantly = false;

      this.init();
    }

    init() {
      this.renderInfiniteCards();
      this.renderPagination();
      this.updateDimensions();
      this.attachEvents();

      // Initial placement
      this.currentIndex = INITIAL_INDEX;
      this.currentTranslate = this.getTranslateForIndex(INITIAL_INDEX);
      this.targetTranslate = this.currentTranslate;
      this.lastTickTranslate = this.currentTranslate;
      this.renderTransforms(this.currentTranslate, 0);
      this.updateActiveProduct(this.currentTranslate, false);
    }

    renderInfiniteCards() {
      this.track.innerHTML = '';
      for (let s = 0; s < REPEAT_SETS; s++) {
        PERFUMES_DATA.forEach((item, dataIdx) => {
          const globalIdx = (s * NUM_REAL_ITEMS) + dataIdx;
          const card = document.createElement('div');
          card.className = 'flacon-card';
          card.dataset.index = globalIdx;
          card.dataset.dataIndex = dataIdx;
          const imgUrl = resolveAssetUrl(item.image);

          card.innerHTML = `
            <a href="${item.url}" class="flacon-link" aria-label="Explore ${item.name}">
              <div class="flacon-figure">
                <div class="flacon-photo-wrap">
                  <img src="${imgUrl}" alt="${item.name} Flacon" class="flacon-img" loading="eager" />
                  <div class="flacon-floor-reflection">
                    <img src="${imgUrl}" alt="" aria-hidden="true" />
                  </div>
                </div>
                <div class="flacon-base-shadow"></div>
              </div>
            </a>
          `;

          // Card Click: if center bottle, navigates; if side bottle, snaps to it
          card.addEventListener('click', (e) => {
            if (this.hasMovedSignificantly) {
              e.preventDefault();
              return;
            }
            const activeIdx = Math.round((this.centerOffset - this.currentTranslate) / this.cardWidth);
            if (activeIdx !== globalIdx) {
              e.preventDefault();
              this.soundEngine.unlock();
              this.springToIndex(globalIdx, 0);
            }
          });

          this.track.appendChild(card);
        });
      }
    }

    renderPagination() {
      this.paginationIndicators.innerHTML = '';
      PERFUMES_DATA.forEach((_, idx) => {
        const pill = document.createElement('div');
        pill.className = `indicator-pill ${idx === 0 ? 'active' : ''}`;
        pill.addEventListener('click', () => {
          this.soundEngine.unlock();
          this.goToProduct(idx);
        });
        this.paginationIndicators.appendChild(pill);
      });
    }

    updateDimensions() {
      this.stageWidth = this.stage.clientWidth || window.innerWidth;
      const isMobile = window.innerWidth <= 768;
      this.cardWidth = isMobile ? 190 : 280;
      this.centerOffset = (this.stageWidth - this.cardWidth) / 2;
      this.tickInterval = this.cardWidth / 3.2; // fine gear teeth interval
    }

    getTranslateForIndex(index) {
      return this.centerOffset - (index * this.cardWidth);
    }

    attachEvents() {
      // Touch & Mouse Pointer Dragging
      this.stage.addEventListener('pointerdown', (e) => this.dragStart(e));
      window.addEventListener('pointermove', (e) => this.dragMove(e));
      window.addEventListener('pointerup', (e) => this.dragEnd(e));
      window.addEventListener('pointercancel', (e) => this.dragEnd(e));

      // Endlessly looping arrows
      this.prevBtn.addEventListener('click', () => {
        this.soundEngine.unlock();
        this.springToIndex(this.currentIndex - 1, 8);
      });

      this.nextBtn.addEventListener('click', () => {
        this.soundEngine.unlock();
        this.springToIndex(this.currentIndex + 1, -8);
      });

      // Keyboard arrow keys
      window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          this.soundEngine.unlock();
          this.springToIndex(this.currentIndex - 1, 8);
        } else if (e.key === 'ArrowRight') {
          this.soundEngine.unlock();
          this.springToIndex(this.currentIndex + 1, -8);
        } else if (e.key === 'Enter') {
          const realIdx = ((this.currentIndex % NUM_REAL_ITEMS) + NUM_REAL_ITEMS) % NUM_REAL_ITEMS;
          const activePerfume = PERFUMES_DATA[realIdx];
          if (activePerfume && activePerfume.url) {
            window.location.href = activePerfume.url;
          }
        }
      });

      // Window Resize
      window.addEventListener('resize', () => {
        this.updateDimensions();
        this.currentTranslate = this.getTranslateForIndex(this.currentIndex);
        this.targetTranslate = this.currentTranslate;
        this.renderTransforms(this.currentTranslate, 0);
      });
    }

    triggerHaptic(duration = 10) {
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate(duration);
        } catch (e) {}
      }
    }

    goToProduct(targetDataIdx) {
      const currentDataIdx = ((this.currentIndex % NUM_REAL_ITEMS) + NUM_REAL_ITEMS) % NUM_REAL_ITEMS;
      let diff = targetDataIdx - currentDataIdx;

      // Shortest circular wrap
      if (diff > NUM_REAL_ITEMS / 2) {
        diff -= NUM_REAL_ITEMS;
      } else if (diff < -NUM_REAL_ITEMS / 2) {
        diff += NUM_REAL_ITEMS;
      }

      this.springToIndex(this.currentIndex + diff, -diff * 6);
    }

    dragStart(e) {
      if (e.button !== undefined && e.button !== 0) return;

      this.soundEngine.unlock();
      this.stopSpring();

      this.isDragging = true;
      this.hasMovedSignificantly = false;
      this.startX = e.clientX;
      this.lastX = e.clientX;
      this.lastTime = performance.now();
      this.dragStartTranslate = this.currentTranslate;
      this.dragVelocity = 0;
      this.lastTickTranslate = this.currentTranslate;
    }

    dragMove(e) {
      if (!this.isDragging) return;
      const currentX = e.clientX;
      const deltaX = currentX - this.startX;

      if (Math.abs(deltaX) > 6) {
        this.hasMovedSignificantly = true;
      }

      const now = performance.now();
      const dt = Math.max(1, now - this.lastTime);
      const dx = currentX - this.lastX;
      this.dragVelocity = (dx / dt) * 16.67;
      this.lastX = currentX;
      this.lastTime = now;

      this.currentTranslate = this.dragStartTranslate + deltaX;

      // Dynamic tilt from velocity
      const targetTilt = Math.max(-4.5, Math.min(4.5, this.dragVelocity * 0.22));
      this.currentTilt += (targetTilt - this.currentTilt) * 0.35;

      // Check gear teeth ticks during drag
      const tickDist = this.currentTranslate - this.lastTickTranslate;
      if (Math.abs(tickDist) >= this.tickInterval) {
        const dir = tickDist > 0 ? 1 : -1;
        this.lastTickTranslate = this.currentTranslate;
        this.soundEngine.playGearTick(dir, Math.min(1.4, Math.abs(this.dragVelocity) / 8 + 0.5));
        this.triggerHaptic(6);
      }

      this.renderTransforms(this.currentTranslate, this.currentTilt);
      this.updateActiveProduct(this.currentTranslate, false);
    }

    dragEnd() {
      if (!this.isDragging) return;
      this.isDragging = false;

      // Inertial projection
      const projectedOffset = this.currentTranslate + (this.dragVelocity * 10);
      let targetIdx = Math.round((this.centerOffset - projectedOffset) / this.cardWidth);

      this.springToIndex(targetIdx, this.dragVelocity);
    }

    springToIndex(targetIndex, initialVelocity = 0) {
      this.stopSpring();
      this.currentIndex = targetIndex;
      this.targetTranslate = this.getTranslateForIndex(targetIndex);
      this.springVelocity = Math.max(-25, Math.min(25, initialVelocity * 0.85));
      this.isSpringAnimating = true;

      const springStiffness = 0.088;
      const springDamping = 0.80;

      const step = () => {
        if (!this.isSpringAnimating) return;

        const force = (this.targetTranslate - this.currentTranslate) * springStiffness;
        this.springVelocity = (this.springVelocity + force) * springDamping;
        this.currentTranslate += this.springVelocity;

        // Dynamic tilt springs back to zero
        this.currentTilt += (0 - this.currentTilt) * 0.16;

        // Gear tooth ticks during glide
        const tickDist = this.currentTranslate - this.lastTickTranslate;
        if (Math.abs(tickDist) >= this.tickInterval) {
          const dir = tickDist > 0 ? 1 : -1;
          this.lastTickTranslate = this.currentTranslate;
          this.soundEngine.playGearTick(dir, Math.min(1.4, Math.abs(this.springVelocity) / 8 + 0.45));
          this.triggerHaptic(6);
        }

        this.renderTransforms(this.currentTranslate, this.currentTilt);
        this.updateActiveProduct(this.currentTranslate, false);

        const distToTarget = Math.abs(this.targetTranslate - this.currentTranslate);
        const speed = Math.abs(this.springVelocity);

        if (distToTarget < 0.25 && speed < 0.15) {
          this.currentTranslate = this.targetTranslate;
          this.currentTilt = 0;
          this.springVelocity = 0;
          this.renderTransforms(this.currentTranslate, 0);
          this.updateActiveProduct(this.currentTranslate, true);
          this.normalizeBuffer();
          this.isSpringAnimating = false;
          return;
        }

        this.rafId = requestAnimationFrame(step);
      };

      this.rafId = requestAnimationFrame(step);
    }

    stopSpring() {
      this.isSpringAnimating = false;
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }

    normalizeBuffer() {
      const realIdx = ((this.currentIndex % NUM_REAL_ITEMS) + NUM_REAL_ITEMS) % NUM_REAL_ITEMS;
      if (this.currentIndex < NUM_REAL_ITEMS || this.currentIndex >= NUM_REAL_ITEMS * 2) {
        const normalizedIndex = NUM_REAL_ITEMS + realIdx;
        this.currentIndex = normalizedIndex;
        this.currentTranslate = this.getTranslateForIndex(normalizedIndex);
        this.targetTranslate = this.currentTranslate;
        this.lastTickTranslate = this.currentTranslate;
        this.renderTransforms(this.currentTranslate, 0);
      }
    }

    renderTransforms(currentTranslate, tilt) {
      this.track.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;

      const cards = this.track.querySelectorAll('.flacon-card');
      const stageCenter = this.stageWidth / 2;
      const isMobile = window.innerWidth <= 768;

      // Desktop parameters remain 100% untouched; Mobile calibrated for compact vertical layout
      const maxScale = isMobile ? 1.15 : 1.10;
      const minScale = isMobile ? 0.80 : 0.82;
      const maxRotY = isMobile ? 18 : 22;
      const maxZ = isMobile ? 32 : 50;
      const maxConv = isMobile ? 14 : 0;

      cards.forEach((card, idx) => {
        const cardCenter = currentTranslate + (idx * this.cardWidth) + (this.cardWidth / 2);
        const diff = (cardCenter - stageCenter) / this.cardWidth;
        const absDiff = Math.abs(diff);

        // Continuous mathematical interpolation
        const scale = minScale + (maxScale - minScale) * Math.exp(-0.85 * absDiff * absDiff);
        const rotY = -Math.sign(diff) * Math.min(maxRotY, Math.pow(absDiff, 0.85) * maxRotY);
        const z = -Math.min(maxZ, Math.pow(absDiff, 1.1) * (maxZ * 0.8));
        const convX = -Math.sign(diff) * Math.min(maxConv, Math.pow(absDiff, 0.9) * maxConv);
        const cardTilt = tilt * Math.max(0, 1 - absDiff * 0.45);
        const opacity = absDiff <= 0.8 ? 1.0 : Math.max(0.14, 1.0 - (absDiff - 0.8) * 0.55);
        const filter = absDiff <= 1.2 ? 'none' : `blur(${Math.min(2.5, (absDiff - 1.2) * 2)}px)`;
        const zIndex = Math.round(30 - Math.min(26, absDiff * 10));

        card.style.transform = `translate3d(${convX.toFixed(2)}px, 0, ${z.toFixed(2)}px) scale(${scale.toFixed(3)}) rotateY(${rotY.toFixed(2)}deg) rotateZ(${cardTilt.toFixed(2)}deg)`;
        card.style.opacity = opacity.toFixed(3);
        card.style.filter = filter;
        card.style.zIndex = zIndex;

        // Subtle floor reflection fade
        const reflection = card.querySelector('.flacon-floor-reflection');
        if (reflection) {
          const reflOpacity = Math.max(0.04, 0.16 - absDiff * 0.08);
          reflection.style.opacity = reflOpacity.toFixed(3);
        }

        // State classes
        card.classList.toggle('is-center', absDiff < 0.35);
        card.classList.toggle('is-left', diff <= -0.35 && diff > -1.5);
        card.classList.toggle('is-right', diff >= 0.35 && diff < 1.5);
        card.classList.toggle('is-far', absDiff >= 1.5);
      });
    }

    updateActiveProduct(currentTranslate, isSettled = false) {
      const rawIndex = Math.round((this.centerOffset - currentTranslate) / this.cardWidth);
      const realIdx = ((rawIndex % NUM_REAL_ITEMS) + NUM_REAL_ITEMS) % NUM_REAL_ITEMS;

      if (realIdx !== this.lastActiveProductIndex) {
        this.lastActiveProductIndex = realIdx;
        this.updateSummary(realIdx);
        this.updatePagination(realIdx);
        this.updateAmbientSpotlight(realIdx);

        if (isSettled) {
          this.soundEngine.playGearTick(1, 1.3, true);
          this.triggerHaptic(14);
        }
      }
    }

    updateSummary(realIdx) {
      const item = PERFUMES_DATA[realIdx];
      if (!item) return;
      this.summaryName.textContent = item.name;
      this.summaryMeta.textContent = `${item.concentration} — ${item.price}`;
      this.summaryLink.href = item.url;
    }

    updatePagination(realIdx) {
      const pills = this.paginationIndicators.querySelectorAll('.indicator-pill');
      pills.forEach((pill, idx) => {
        pill.classList.toggle('active', idx === realIdx);
      });
    }

    updateAmbientSpotlight(realIdx) {
      const item = PERFUMES_DATA[realIdx];
      if (item && item.glow) {
        this.ambientSpotlight.style.background = `radial-gradient(circle, ${item.glow} 0%, rgba(251, 249, 246, 0) 68%)`;
      }
    }
  }

  /**
   * BIOGRAPHY PARIS — SCROLL-DRIVEN EXPLODED FLACON ENGINE
   * Apple-Grade Canvas Scrollytelling with Real-Time Frame Interpolation
   * Multi-Milestone Component Callouts with Haptics & Gear Detent Ticks
   * Zero External Libraries — Auto-CDN Resolving
   */
  class ExplodedBottleScroller {
    constructor() {
      this.section = document.getElementById('biographyExplodedSection');
      this.stickyViewport = document.getElementById('explodedStickyViewport');
      this.canvas = document.getElementById('explodedCanvas');
      if (!this.section || !this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.totalFrames = 60;
      this.frames = new Array(this.totalFrames);
      this.loadedFramesCount = 0;
      this.isFirstFrameRendered = false;

      // Tactile sound engine
      this.soundEngine = new TactileSoundEngine();

      // DOM references
      this.callouts = [
        document.getElementById('calloutWoodenCap'),
        document.getElementById('calloutAtomizer'),
        document.getElementById('calloutFormula')
      ];

      this.mobileCard = document.getElementById('explodedMobileCard');
      this.mobileCardNum = document.getElementById('mobileCardNum');
      this.mobileCardBadge = document.getElementById('mobileCardBadge');
      this.mobileCardTitle = document.getElementById('mobileCardTitle');
      this.mobileCardDesc = document.getElementById('mobileCardDesc');

      this.scrollHint = document.getElementById('explodedScrollHint');
      this.progressFill = document.getElementById('explodedProgressFill');
      this.navButtons = document.querySelectorAll('.exploded-nav-btn');

      // Milestone specification data
      this.milestones = [
        {
          index: 0,
          targetProgress: 0.32,
          range: [0.12, 0.48],
          num: '01',
          badge: 'HIMALAYAN PINE',
          title: 'WOODEN CAP',
          desc: 'Each Individually hand-crafted from Himalayan pine wood.'
        },
        {
          index: 1,
          targetProgress: 0.62,
          range: [0.46, 0.76],
          num: '02',
          badge: 'AEROSOL ENGINEERING',
          title: 'PRESSURISED ATOMIZER',
          desc: 'Engineered for a finer, more consistent mist.'
        },
        {
          index: 2,
          targetProgress: 0.94,
          range: [0.74, 1.00],
          num: '03',
          badge: '33% OIL CONCENTRATION',
          title: 'LONGEST LASTING FORMULA',
          desc: '33% Oil Concentration.'
        }
      ];

      this.activeMilestoneIdx = -1;

      // Interpolation & animation state
      this.targetProgress = 0;
      this.currentProgress = 0;
      this.currentFrameIdx = 0;
      this.rafId = null;
      this.isTicking = false;

      this.init();
    }

    init() {
      this.updateDimensions();
      this.resizeCanvas();
      this.preloadFrames();
      this.attachEvents();
      this.calculateScrollProgress();
    }

    updateDimensions() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      const rect = this.section.getBoundingClientRect();
      this.sectionTop = rect.top + scrollY;
      this.sectionHeight = rect.height;
      this.viewportHeight = window.innerHeight;
      this.scrollDist = Math.max(1, this.sectionHeight - this.viewportHeight);
      this.isMobile = window.innerWidth <= 820;
    }

    preloadFrames() {
      const loadFrame = (idx) => {
        if (this.frames[idx]) return;
        const img = new Image();
        img.src = resolveAssetUrl(`assets/exploded/frame_${String(idx).padStart(3, '0')}.webp`);

        const onDecoded = () => {
          this.frames[idx] = img;
          this.loadedFramesCount++;
          if (idx === 0 && !this.isFirstFrameRendered) {
            this.drawFrame(0);
            this.isFirstFrameRendered = true;
          }
        };

        // Asynchronous off-main-thread image decoding to completely eliminate scroll hitching
        if ('decode' in img) {
          img.decode().then(onDecoded).catch(onDecoded);
        } else {
          img.onload = onDecoded;
        }
      };

      // 1. Immediate priority for Frame 0
      loadFrame(0);

      // 2. Pre-decode key milestone frames
      [59, 19, 37].forEach(idx => loadFrame(idx));

      // 3. Batched background loading via requestIdleCallback to keep CPU 100% free for smooth scrolling
      let nextIdx = 1;
      const loadBatch = () => {
        const batchSize = this.isMobile ? 5 : 10;
        let count = 0;
        while (nextIdx < this.totalFrames && count < batchSize) {
          if (!this.frames[nextIdx]) {
            loadFrame(nextIdx);
            count++;
          }
          nextIdx++;
        }
        if (nextIdx < this.totalFrames) {
          if ('requestIdleCallback' in window) {
            requestIdleCallback(loadBatch, { timeout: 150 });
          } else {
            setTimeout(loadBatch, 35);
          }
        }
      };
      loadBatch();
    }

    resizeCanvas() {
      this.updateDimensions();
      const rect = this.canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      // On mobile, cap DPR to 1.5 to eliminate GPU rasterization bottlenecks
      const dpr = this.isMobile
        ? Math.min(window.devicePixelRatio || 1, 1.5)
        : Math.min(window.devicePixelRatio || 1, 2);

      const newWidth = Math.round(rect.width * dpr);
      const newHeight = Math.round(rect.height * dpr);

      if (this.canvas.width !== newWidth || this.canvas.height !== newHeight) {
        this.canvas.width = newWidth;
        this.canvas.height = newHeight;
      }

      this.drawFrame(this.currentFrameIdx);
    }

    drawFrame(frameIdx) {
      if (!this.ctx || !this.canvas.width || !this.canvas.height) return;

      const img = this.getNearestLoadedFrame(frameIdx);
      if (!img) return;

      const cw = this.canvas.width;
      const ch = this.canvas.height;
      const srcW = img.naturalWidth || 720;
      const srcH = img.naturalHeight || 1280;

      // Portrait (Mobile): Cover fill — video & flacon fill 100% of the screen with zero borders
      // Landscape (Desktop): Fill 100% of screen height and blend studio gradient across widescreen
      const isPortrait = cw < ch;
      const scale = isPortrait
        ? Math.max(cw / srcW, ch / srcH)
        : (ch / srcH);

      const dw = srcW * scale;
      const dh = srcH * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;

      // Only draw background gradient on widescreen desktop where side gaps exist
      if (dx > 0 || dy > 0) {
        const bgGrad = this.ctx.createLinearGradient(0, 0, 0, ch);
        bgGrad.addColorStop(0, '#e9ebe8');
        bgGrad.addColorStop(0.15, '#e6e8e5');
        bgGrad.addColorStop(0.5, '#e5e5e5');
        bgGrad.addColorStop(0.8, '#e4e4e4');
        bgGrad.addColorStop(1, '#dfdfdf');
        this.ctx.fillStyle = bgGrad;
        this.ctx.fillRect(0, 0, cw, ch);
      }
      // On mobile, image covers entire canvas buffer so direct drawImage is zero-overhead

      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = this.isMobile ? 'medium' : 'high';
      this.ctx.drawImage(img, 0, 0, srcW, srcH, dx, dy, dw, dh);
    }

    getNearestLoadedFrame(targetIdx) {
      if (this.frames[targetIdx] && this.frames[targetIdx].complete) {
        return this.frames[targetIdx];
      }
      for (let offset = 1; offset < this.totalFrames; offset++) {
        const prev = targetIdx - offset;
        if (prev >= 0 && this.frames[prev] && this.frames[prev].complete) {
          return this.frames[prev];
        }
        const next = targetIdx + offset;
        if (next < this.totalFrames && this.frames[next] && this.frames[next].complete) {
          return this.frames[next];
        }
      }
      return null;
    }

    attachEvents() {
      // Scroll listener (zero forced reflow, passive for 60/120fps compositor smoothness)
      window.addEventListener('scroll', () => {
        this.calculateScrollProgress();
      }, { passive: true });

      // Resize listener
      window.addEventListener('resize', () => {
        this.resizeCanvas();
        this.calculateScrollProgress();
      }, { passive: true });

      // Nav dock buttons
      this.navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const targetProg = parseFloat(btn.getAttribute('data-progress'));
          if (isNaN(targetProg)) return;
          this.soundEngine.unlock();
          this.soundEngine.playGearTick(1, 1.3, true);
          this.scrollToProgress(targetProg);
        });
      });

      // Mobile swipe gesture support on dynamic card
      if (this.mobileCard) {
        let touchStartX = 0;
        let touchStartY = 0;
        this.mobileCard.addEventListener('touchstart', (e) => {
          if (e.touches && e.touches[0]) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
          }
        }, { passive: true });

        this.mobileCard.addEventListener('touchend', (e) => {
          if (!e.changedTouches || !e.changedTouches[0]) return;
          const deltaX = e.changedTouches[0].clientX - touchStartX;
          const deltaY = e.changedTouches[0].clientY - touchStartY;
          if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
            this.soundEngine.unlock();
            const currentIdx = Math.max(0, this.activeMilestoneIdx);
            if (deltaX < 0 && currentIdx < this.milestones.length - 1) {
              // Swipe left -> Next milestone
              this.scrollToProgress(this.milestones[currentIdx + 1].targetProgress);
            } else if (deltaX > 0 && currentIdx > 0) {
              // Swipe right -> Prev milestone
              this.scrollToProgress(this.milestones[currentIdx - 1].targetProgress);
            }
          }
        }, { passive: true });
      }
    }

    calculateScrollProgress() {
      // High-performance scroll tracking: zero layout reflows on main thread
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      const scrolled = scrollY - this.sectionTop;
      const progress = Math.min(Math.max(scrolled / this.scrollDist, 0), 1);
      this.targetProgress = progress;

      if (!this.isTicking) {
        this.isTicking = true;
        this.rafId = requestAnimationFrame(() => this.tick());
      }
    }

    scrollToProgress(prog) {
      const targetY = this.sectionTop + (prog * this.scrollDist);
      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });
    }

    tick() {
      const diff = this.targetProgress - this.currentProgress;

      // Responsive kinetic lerp: Snappy 0.34 tracking on mobile so bottle locks to thumb without lag; smooth 0.16 on desktop
      const lerpRate = this.isMobile ? 0.34 : 0.16;

      if (Math.abs(diff) > 0.0004) {
        this.currentProgress += diff * lerpRate;
      } else {
        this.currentProgress = this.targetProgress;
      }

      const frameIdx = Math.min(
        this.totalFrames - 1,
        Math.max(0, Math.round(this.currentProgress * (this.totalFrames - 1)))
      );

      if (frameIdx !== this.currentFrameIdx || !this.isFirstFrameRendered) {
        this.currentFrameIdx = frameIdx;
        this.drawFrame(this.currentFrameIdx);
      }

      this.updateUI(this.currentProgress);

      if (Math.abs(this.targetProgress - this.currentProgress) > 0.0004) {
        this.rafId = requestAnimationFrame(() => this.tick());
      } else {
        this.isTicking = false;
      }
    }

    updateUI(progress) {
      // 1. Progress Bar Fill via hardware-accelerated transform: scaleX (zero layout reflow)
      if (this.progressFill) {
        this.progressFill.style.transform = `scaleX(${progress})`;
      }

      // 2. Initial Scroll Invitation Hint
      if (this.scrollHint) {
        if (progress > 0.06) {
          if (!this.scrollHintHidden) {
            this.scrollHint.classList.add('hidden');
            this.scrollHintHidden = true;
          }
        } else {
          if (this.scrollHintHidden) {
            this.scrollHint.classList.remove('hidden');
            this.scrollHintHidden = false;
          }
        }
      }

      // 3. Determine active milestone
      let activeIdx = -1;
      if (progress >= 0.74) {
        activeIdx = 2; // Formula
      } else if (progress >= 0.46) {
        activeIdx = 1; // Atomizer
      } else if (progress >= 0.12) {
        activeIdx = 0; // Cap
      }

      // Trigger mechanical tick & haptic feedback on boundary change
      if (activeIdx !== this.activeMilestoneIdx) {
        if (activeIdx !== -1 && this.activeMilestoneIdx !== -1) {
          this.soundEngine.playGearTick(1, 1.25, true);
          if ('vibrate' in navigator) {
            try { navigator.vibrate(10); } catch (e) {}
          }
        }
        this.activeMilestoneIdx = activeIdx;
      }

      // 4. Update Desktop Callouts (only on desktop to eliminate mobile DOM overhead)
      if (!this.isMobile) {
        const isPeakExplosion = progress >= 0.85;
        this.callouts.forEach((callout, idx) => {
          if (!callout) return;
          if (isPeakExplosion) {
            callout.classList.add('active');
          } else {
            callout.classList.toggle('active', idx === activeIdx);
          }
        });
      }

      // 5. Update Mobile Dynamic Callout Card
      if (this.isMobile && this.mobileCard) {
        if (activeIdx >= 0) {
          const data = this.milestones[activeIdx];
          if (this.mobileCardTitle && this.mobileCardTitle.textContent !== data.title) {
            this.mobileCard.style.opacity = '0';
            this.mobileCard.style.transform = 'translateY(8px)';
            setTimeout(() => {
              this.mobileCardNum.textContent = data.num;
              this.mobileCardBadge.textContent = data.badge;
              this.mobileCardTitle.textContent = data.title;
              this.mobileCardDesc.textContent = data.desc;
              this.mobileCard.style.opacity = '1';
              this.mobileCard.style.transform = 'translateY(0)';
            }, 120);
          } else if (this.mobileCard.style.opacity !== '1') {
            this.mobileCard.style.opacity = '1';
            this.mobileCard.style.transform = 'translateY(0)';
          }
        } else {
          if (this.mobileCard.style.opacity !== '0') {
            this.mobileCard.style.opacity = '0';
            this.mobileCard.style.transform = 'translateY(12px)';
          }
        }
      }

      // 6. Update Milestone Navigation Pills
      const highlightedNavIdx = Math.max(0, activeIdx);
      if (highlightedNavIdx !== this.lastHighlightedNavIdx) {
        this.lastHighlightedNavIdx = highlightedNavIdx;
        this.navButtons.forEach((btn, idx) => {
          btn.classList.toggle('active', idx === highlightedNavIdx);
        });
      }
    }
  }

  // Initialize both components on DOM ready
  function initBiographyEngines() {
    new BiographyInfiniteSlider();
    new ExplodedBottleScroller();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBiographyEngines);
  } else {
    initBiographyEngines();
  }
})();
