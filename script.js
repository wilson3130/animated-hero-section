/**
 * BIOGRAPHY PARIS — HAUTE PARFUMERIE SHOWCASE ENGINE
 * Real-Time Continuous 3D Physics Engine with Kinetic Inertia
 * Mechanical Gear Sound Synthesis (Web Audio API) & Mobile Haptics
 * Infinite Seamless Circular Buffer — Zero External Dependencies
 */

(function () {
  'use strict';

  // Configurable perfume data with direct product URLs
  const PERFUMES_DATA = [
    {
      id: 'asmara',
      name: 'Asmara',
      concentration: 'EXTRAIT DE PARFUM',
      price: '₹ 4,999',
      image: 'assets/asmara-tight.png',
      url: '/shop/asmara',
      glow: 'rgba(235, 175, 100, 0.45)'
    },
    {
      id: 'miami-blues',
      name: 'Miami Blues',
      concentration: 'EXTRAIT DE PARFUM',
      price: '₹ 4,499',
      image: 'assets/miami-blues-tight.png',
      url: '/shop/miami-blues',
      glow: 'rgba(140, 200, 220, 0.45)'
    },
    {
      id: 'the-diplomat',
      name: 'The Diplomat',
      concentration: 'EXTRAIT DE PARFUM',
      price: '₹ 4,999',
      image: 'assets/the-diplomat-tight.png',
      url: '/shop/the-diplomat',
      glow: 'rgba(215, 190, 140, 0.42)'
    },
    {
      id: 'the-gambler',
      name: 'The Gambler',
      concentration: 'EXTRAIT DE PARFUM',
      price: '₹ 4,499',
      image: 'assets/the-gambler-tight.png',
      url: '/shop/the-gambler',
      glow: 'rgba(220, 155, 130, 0.42)'
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

          card.innerHTML = `
            <a href="${item.url}" class="flacon-link" aria-label="Explore ${item.name}">
              <div class="flacon-figure">
                <div class="flacon-photo-wrap">
                  <img src="${item.image}" alt="${item.name} Flacon" class="flacon-img" loading="eager" />
                  <div class="flacon-floor-reflection">
                    <img src="${item.image}" alt="" aria-hidden="true" />
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
      this.cardWidth = isMobile ? 210 : 280;
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

      // Mobile dimensions & spacing remain strictly untouched
      const maxScale = isMobile ? 1.18 : 1.10;
      const minScale = isMobile ? 0.80 : 0.82;
      const maxRotY = isMobile ? 18 : 22;
      const maxZ = isMobile ? 38 : 50;
      const maxConv = isMobile ? 16 : 0;

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

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new BiographyInfiniteSlider());
  } else {
    new BiographyInfiniteSlider();
  }
})();
