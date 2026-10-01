/**
 * WEDDING INVITATION INTERACTIVE SCRIPT
 * Abdelrahman & Zad - 29/10/2026
 * Hilton Pyramids Golf Hotel - Greenery Venue
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. STATE & DATA CONFIGURATION
  // =========================================================================
  const WEDDING_DATA = {
    groom: 'Abdelrahman',
    bride: 'Zad',
    dateStr: '2026-10-29T18:00:00', // 29 Oct 2026, 6:00 PM
    venue: 'Greenery',
    hotel: 'Hilton Pyramids Golf Hotel',
    location: 'Dreamland, 6th of October City, Giza, Egypt',
    photos: [
      { src: 'photos/couple-walk.jpg', caption: 'Walking Together Towards Forever' },
      { src: 'photos/couple-pose.jpg', caption: 'A Love to Cherish' },
      { src: 'photos/couple-artistic.jpg', caption: 'A Light in the Dark' },
      { src: 'photos/couple-smile.jpg', caption: 'Joyful Moments & Forever Smiles' }
    ]
  };

  let currentPhotoIndex = 0;
  let isMusicPlaying = false;
  let audioContext = null;


  // =========================================================================
  // 2. DOM REFERENCES
  // =========================================================================
  const coverScreen = document.getElementById('cover-screen');
  const collageScreen = document.getElementById('collage-screen');
  const envelopeWrap = document.getElementById('envelope-interactive');
  const btnOpenEnvelope = document.getElementById('btn-open-envelope');
  const waxSeal = document.getElementById('wax-seal');
  const btnBackCover = document.getElementById('btn-back-cover');

  // Navigation & Music
  const btnMusicToggle = document.getElementById('btn-music-toggle');
  const musicLabel = document.getElementById('music-label');
  const cdPlayerModule = document.getElementById('cd-player-module');
  const compactDisc = document.getElementById('compact-disc');
  const cdStatusText = document.getElementById('cd-status-text');
  const weddingAudio = document.getElementById('wedding-audio');
  const countdownText = document.getElementById('countdown-text');

  // Modals
  const modalRsvp = document.getElementById('modal-rsvp');
  const modalDetails = document.getElementById('modal-details');
  const modalStory = document.getElementById('modal-story');
  const modalCalendar = document.getElementById('modal-calendar');
  const lightboxOverlay = document.getElementById('lightbox-overlay');

  // Interactive Triggers
  const btnOpenDetails = document.getElementById('btn-open-details');
  const btnOpenRsvp = document.getElementById('btn-open-rsvp');
  const btnOpenStory = document.getElementById('btn-open-story');
  const btnAddCalendar = document.getElementById('btn-add-calendar');

  const footerBtnRsvp = document.getElementById('footer-btn-rsvp');
  const footerBtnDetails = document.getElementById('footer-btn-details');
  const footerBtnCalendar = document.getElementById('footer-btn-calendar');

  // RSVP Elements
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpSuccessView = document.getElementById('rsvp-success-view');
  const rsvpStatusBadge = document.getElementById('rsvp-status-badge');
  const btnRsvpDone = document.getElementById('btn-rsvp-done');
  const successGuestMsg = document.getElementById('success-guest-msg');

  // Lightbox Elements
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const btnLightboxClose = document.getElementById('btn-lightbox-close');
  const btnLightboxPrev = document.getElementById('btn-lightbox-prev');
  const btnLightboxNext = document.getElementById('btn-lightbox-next');

  // Calendar
  const btnCalGoogle = document.getElementById('btn-cal-google');
  const btnCalIcs = document.getElementById('btn-cal-ics');


  // =========================================================================
  // 3. ENVELOPE OPENING INTERACTION
  // =========================================================================
  function openInvitation() {
    if (envelopeWrap.classList.contains('opening')) return;

    envelopeWrap.classList.add('opening');

    // Subtle audio chime feedback
    playGentleChime();
    startMusic();

    // After flap flips open, smoothly reveal the full invitation
    setTimeout(() => {
      coverScreen.classList.remove('active');
      collageScreen.classList.add('active');

      // Scroll to top of collage
      const scrollWrap = document.querySelector('.collage-scroll-wrapper');
      if (scrollWrap) scrollWrap.scrollTop = 0;

    }, 950);
  }

  if (btnOpenEnvelope) btnOpenEnvelope.addEventListener('click', openInvitation);
  if (waxSeal) waxSeal.addEventListener('click', openInvitation);

  // Return to Envelope Cover
  if (btnBackCover) {
    btnBackCover.addEventListener('click', () => {
      collageScreen.classList.remove('active');
      coverScreen.classList.add('active');
      envelopeWrap.classList.remove('opening');
      if (window.location.hash === '#collage') {
        history.replaceState(null, null, ' ');
      }
    });
  }

  // Direct hash navigation for testing or direct links (#collage)
  if (window.location.hash === '#collage') {
    coverScreen.classList.remove('active');
    collageScreen.classList.add('active');
  }


  // =========================================================================
  // 4. ROMANTIC WEDDING MUSIC ENGINE (Web Audio API Synthesizer)
  // Self-contained polyphonic acoustic piano melody (Pachelbel's Canon)
  // =========================================================================
  function initAudioContext() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioCtx();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }

  // Play a single soft piano/bell note with smooth ADSR envelope
  function playNote(freq, time, duration = 1.2, gainValue = 0.12) {
    if (!audioContext) return;
    try {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      // Fundamental tone + subtle warm overtone
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      // ADSR Envelope
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(gainValue, time + 0.04);
      gain.gain.exponentialRampToValueAtTime(gainValue * 0.4, time + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start(time);
      osc.stop(time + duration);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  function playGentleChime() {
    initAudioContext();
    if (!audioContext) return;
    const now = audioContext.currentTime;
    playNote(587.33, now, 0.8, 0.15);       // D5
    playNote(739.99, now + 0.1, 0.8, 0.12); // F#5
    playNote(880.00, now + 0.2, 1.2, 0.15); // A5
  }

  function startMusic() {
    if (isMusicPlaying) return;

    const playback = weddingAudio.play();
    isMusicPlaying = true;
    btnMusicToggle.classList.add('playing');
    cdPlayerModule.classList.add('playing');
    compactDisc.classList.add('spinning');
    musicLabel.textContent = 'Mute';
    cdStatusText.textContent = 'Young & Beautiful';

    if (playback && typeof playback.catch === 'function') {
      playback.catch((error) => {
        stopMusic();
        console.warn('Wedding music could not start', error);
      });
    }
  }

  function stopMusic() {
    isMusicPlaying = false;
    btnMusicToggle.classList.remove('playing');
    cdPlayerModule.classList.remove('playing');
    compactDisc.classList.remove('spinning');
    musicLabel.textContent = 'Music';
    cdStatusText.textContent = 'Click to Play';

    weddingAudio.pause();
  }

  function toggleMusic() {
    if (isMusicPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  }

  if (btnMusicToggle) btnMusicToggle.addEventListener('click', toggleMusic);
  if (cdPlayerModule) cdPlayerModule.addEventListener('click', toggleMusic);


  // =========================================================================
  // 5. MODALS & POPUPS CONTROLLER
  // =========================================================================
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Bind close buttons on all modals
  document.querySelectorAll('.btn-modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-overlay');
      closeModal(modal);
    });
  });

  // Close modal when clicking on the dimmed backdrop
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m));
      closeLightbox();
    }
  });

  // Modal Open Triggers
  if (btnOpenDetails) btnOpenDetails.addEventListener('click', () => openModal(modalDetails));
  if (footerBtnDetails) footerBtnDetails.addEventListener('click', () => openModal(modalDetails));

  if (btnOpenRsvp) btnOpenRsvp.addEventListener('click', () => openModal(modalRsvp));
  if (footerBtnRsvp) footerBtnRsvp.addEventListener('click', () => openModal(modalRsvp));

  if (btnOpenStory) btnOpenStory.addEventListener('click', () => openModal(modalStory));

  if (btnAddCalendar) btnAddCalendar.addEventListener('click', () => openModal(modalCalendar));
  if (footerBtnCalendar) footerBtnCalendar.addEventListener('click', () => openModal(modalCalendar));


  // =========================================================================
  // 6. RSVP FORM SUBMISSION & LOCALSTORAGE
  // =========================================================================
  function checkExistingRsvp() {
    try {
      const saved = localStorage.getItem('wedding_rsvp_az');
      if (saved) {
        const data = JSON.parse(saved);
        if (rsvpStatusBadge) {
          rsvpStatusBadge.classList.remove('hidden');
          rsvpStatusBadge.innerHTML = `<strong>RSVP Recorded:</strong> ${data.guestName} (${data.attendance === 'attending' ? 'Attending with ' + data.guestCount + ' guests' : 'Regretfully Declines'})`;
        }
        if (document.getElementById('guest-name')) document.getElementById('guest-name').value = data.guestName || '';
        if (document.getElementById('guest-count')) document.getElementById('guest-count').value = data.guestCount || '2';
        if (document.getElementById('guest-message')) document.getElementById('guest-message').value = data.message || '';
      }
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }
  checkExistingRsvp();

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const guestName = document.getElementById('guest-name').value.trim();
      const attendance = document.querySelector('input[name="attendance"]:checked').value;
      const guestCount = document.getElementById('guest-count').value;
      const message = document.getElementById('guest-message').value.trim();

      const rsvpData = {
        guestName,
        attendance,
        guestCount: attendance === 'attending' ? guestCount : 0,
        message,
        timestamp: new Date().toISOString()
      };

      try {
        localStorage.setItem('wedding_rsvp_az', JSON.stringify(rsvpData));
      } catch (err) {
        console.warn('Failed to save to localStorage', err);
      }

      // Confetti Burst Celebration
      triggerConfetti();

      // Show Success View
      rsvpForm.classList.add('hidden');
      if (rsvpSuccessView) {
        rsvpSuccessView.classList.remove('hidden');
        if (successGuestMsg) {
          if (attendance === 'attending') {
            successGuestMsg.textContent = `Thank you, ${guestName}! We are overjoyed to celebrate our special day with you at Hilton Pyramids Golf Hotel!`;
          } else {
            successGuestMsg.textContent = `Thank you, ${guestName}. We will deeply miss you on our wedding day, but we feel your love and prayers!`;
          }
        }
      }
    });
  }

  if (btnRsvpDone) {
    btnRsvpDone.addEventListener('click', () => {
      closeModal(modalRsvp);
      // Reset form view for future edits
      setTimeout(() => {
        rsvpForm.classList.remove('hidden');
        rsvpSuccessView.classList.add('hidden');
        checkExistingRsvp();
      }, 400);
    });
  }


  // =========================================================================
  // 7. FULLSCREEN PHOTO LIGHTBOX
  // =========================================================================
  function openLightbox(index) {
    currentPhotoIndex = index;
    updateLightboxPhoto();
    lightboxOverlay.classList.add('active');
    lightboxOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxOverlay.classList.remove('active');
    lightboxOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateLightboxPhoto() {
    const photo = WEDDING_DATA.photos[currentPhotoIndex];
    if (!photo) return;
    lightboxImg.src = photo.src;
    lightboxCaption.textContent = photo.caption;
  }

  function showNextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % WEDDING_DATA.photos.length;
    updateLightboxPhoto();
  }

  function showPrevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + WEDDING_DATA.photos.length) % WEDDING_DATA.photos.length;
    updateLightboxPhoto();
  }

  if (btnLightboxClose) btnLightboxClose.addEventListener('click', closeLightbox);
  if (btnLightboxNext) btnLightboxNext.addEventListener('click', showNextPhoto);
  if (btnLightboxPrev) btnLightboxPrev.addEventListener('click', showPrevPhoto);

  lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightboxOverlay.classList.contains('active')) return;
    if (e.key === 'ArrowRight') showNextPhoto();
    if (e.key === 'ArrowLeft') showPrevPhoto();
  });

  // Attach photo opening on all photo elements
  document.querySelectorAll('[data-photo]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const photoSrc = el.getAttribute('data-photo');
      const idx = WEDDING_DATA.photos.findIndex(p => p.src === photoSrc);
      openLightbox(idx >= 0 ? idx : 0);
    });
  });


  // =========================================================================
  // 8. ADD TO CALENDAR (Google Calendar & .ICS file generation)
  // =========================================================================
  function setupCalendarLinks() {
    const title = encodeURIComponent('Wedding of Abdelrahman & Zad');
    const details = encodeURIComponent('Join us to celebrate the wedding of Abdelrahman and Zad at Greenery, Hilton Pyramids Golf Hotel.');
    const location = encodeURIComponent('Hilton Pyramids Golf Hotel, Dreamland, 6th of October City, Giza, Egypt');
    
    // October 29, 2026: 18:00 to 23:59 (Cairo Time UTC+2) -> UTC 16:00 to 22:00
    const startUTC = '20261029T160000Z';
    const endUTC = '20261029T220000Z';

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startUTC}/${endUTC}&details=${details}&location=${location}`;
    if (btnCalGoogle) btnCalGoogle.href = googleUrl;

    if (btnCalIcs) {
      btnCalIcs.addEventListener('click', () => {
        const icsContent = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//Abdelrahman & Zad//Wedding Invitation//EN',
          'CALSCALE:GREGORIAN',
          'METHOD:PUBLISH',
          'BEGIN:VEVENT',
          'UID:wedding-abdelrahman-zad-2026@hiltonpyramids',
          `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
          `DTSTART:${startUTC}`,
          `DTEND:${endUTC}`,
          'SUMMARY:Wedding of Abdelrahman & Zad',
          'DESCRIPTION:Celebrating the wedding of Abdelrahman & Zad at Greenery venue.',
          'LOCATION:Hilton Pyramids Golf Hotel, Dreamland, Giza, Egypt',
          'STATUS:CONFIRMED',
          'END:VEVENT',
          'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'Abdelrahman-and-Zad-Wedding.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  }
  setupCalendarLinks();


  // =========================================================================
  // 9. LIVE WEDDING COUNTDOWN TIMER
  // =========================================================================
  function updateCountdown() {
    const targetDate = new Date(WEDDING_DATA.dateStr).getTime();
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (countdownText) countdownText.textContent = 'Today is the Day! 💍';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (countdownText) {
      countdownText.textContent = `${days} Days to go`;
    }
  }
  updateCountdown();
  setInterval(updateCountdown, 60000);


  // =========================================================================
  // 10. LUXURY CONFETTI CELEBRATION (RSVP Success)
  // =========================================================================
  function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#721223', '#4a0a14', '#c5a059', '#e8d3a7', '#6c7755', '#faf7f2'];
    const particles = [];
    const count = 90;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: canvas.width * 0.5 + (Math.random() - 0.5) * 120,
        y: canvas.height * 0.45 + (Math.random() - 0.5) * 60,
        w: Math.random() * 8 + 4,
        h: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 1) * 9 - 4,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        gravity: 0.28,
        alpha: 1
      });
    }

    let animationId;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.alpha -= 0.007;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      });

      if (alive) {
        animationId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationId);
      }
    }

    render();
  }


  // =========================================================================
  // 11. AMBIENT FALLING ROSE PETALS GENERATOR
  // =========================================================================
  function initAmbientPetals() {
    const container = document.getElementById('petals-container');
    if (!container) return;

    const petalCount = 14;
    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement('div');
      petal.className = 'petal-particle';

      const left = Math.random() * 100;
      const size = Math.random() * 12 + 10;
      const duration = Math.random() * 10 + 12;
      const delay = Math.random() * 12;

      petal.style.left = `${left}%`;
      petal.style.width = `${size}px`;
      petal.style.height = `${size * 1.3}px`;
      petal.style.animationDuration = `${duration}s`;
      petal.style.animationDelay = `${delay}s`;

      container.appendChild(petal);
    }
  }
  initAmbientPetals();

  // Support direct hash shortcuts for deep linking (#rsvp, #details, #story, #collage)
  if (window.location.hash === '#rsvp') {
    coverScreen.classList.remove('active');
    collageScreen.classList.add('active');
    openModal(modalRsvp);
  } else if (window.location.hash === '#details') {
    coverScreen.classList.remove('active');
    collageScreen.classList.add('active');
    openModal(modalDetails);
  } else if (window.location.hash === '#story') {
    coverScreen.classList.remove('active');
    collageScreen.classList.add('active');
    openModal(modalStory);
  }

});
