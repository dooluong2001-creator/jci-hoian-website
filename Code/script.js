// Scroll animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// News tabs (only active on news.html)
const newsTabs = document.querySelectorAll('.news-tab');
if (newsTabs.length > 0) {
  newsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.news-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

// Smooth scroll for local anchor links (e.g. href="#about" on current page)
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href');
    if (targetId === '#' || targetId === '') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── HERO BACKGROUND PARALLAX MOTION ──
const hero = document.querySelector('.hero');
const parallaxBg = document.querySelector('.hero-bg-parallax');

if (hero && parallaxBg) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate displacement percentage (-0.5 to 0.5)
    const pctX = (x / rect.width) - 0.5;
    const pctY = (y / rect.height) - 0.5;
    
    // Move parallax wrapper opposite to mouse direction
    const moveX = pctX * -20;
    const moveY = pctY * -20;
    
    parallaxBg.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });
  
  // Smoothly reset position when cursor leaves
  hero.addEventListener('mouseleave', () => {
    parallaxBg.style.transform = 'translate(0px, 0px)';
  });
}

// ── FLOATING LANTERN PARTICLES ──
const canvas = document.getElementById('hero-particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  const maxParticles = 35;
  
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }
  
  // Run on start and attach to resize events
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  class LanternParticle {
    constructor() {
      this.reset(true);
    }
    
    reset(initY = false) {
      this.size = Math.random() * 5 + 2.5; // Radius of lantern core
      this.x = Math.random() * canvas.width;
      this.y = initY ? Math.random() * canvas.height : canvas.height + Math.random() * 60;
      this.speedY = -(Math.random() * 0.4 + 0.2); // Upward float speed
      this.swaySpeed = Math.random() * 0.015 + 0.008;
      this.swayRange = Math.random() * 2 + 0.5;
      this.swayOffset = Math.random() * Math.PI * 2;
      this.opacity = 0;
      this.maxOpacity = Math.random() * 0.7 + 0.25;
      this.fadeSpeed = Math.random() * 0.008 + 0.004;
      this.glowRadius = this.size * (Math.random() * 1.5 + 2);
    }
    
    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * this.swaySpeed + this.swayOffset) * (this.swayRange * 0.35);
      
      // Fade in when entering from bottom
      if (this.y > canvas.height - 120) {
        if (this.opacity < this.maxOpacity) {
          this.opacity += this.fadeSpeed;
        }
      }
      // Fade out before reaching top edge
      else if (this.y < 120) {
        this.opacity -= this.fadeSpeed;
      }
      
      // Recycle particle once out of bounds or fully transparent
      if (this.y < -50 || (this.opacity <= 0 && this.y < canvas.height - 120)) {
        this.reset(false);
      }
    }
    
    draw() {
      if (this.opacity <= 0) return;
      
      ctx.save();
      
      // 1. Soft glowing bokeh halo
      const glow = ctx.createRadialGradient(this.x, this.y, this.size * 0.2, this.x, this.y, this.glowRadius);
      glow.addColorStop(0, `rgba(232, 201, 122, ${this.opacity})`);
      glow.addColorStop(0.3, `rgba(201, 168, 76, ${this.opacity * 0.45})`);
      glow.addColorStop(1, 'rgba(201, 168, 76, 0)');
      
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.glowRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // 2. Shiny warm core representing candle flame inside lantern
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 245, 220, ${this.opacity * 0.9})`;
      ctx.shadowColor = '#FAF7F0';
      ctx.shadowBlur = 8;
      ctx.fill();
      
      ctx.restore();
    }
  }
  
  // Populate particles array
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new LanternParticle());
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    requestAnimationFrame(animate);
  }
  
  // Run loop
  animate();
}

// ── STATS NUMBERS COUNT-UP ANIMATION ──
function initStatsCounter() {
  const numberElements = document.querySelectorAll('.animate-number');
  
  numberElements.forEach(elem => {
    const target = parseInt(elem.getAttribute('data-target'), 10);
    if (isNaN(target)) return;
    
    let startTimestamp = null;
    const duration = 1600; // 1.6 seconds for premium pacing
    
    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing: easeOutQuad
      const easedProgress = progress * (2 - progress);
      
      const currentValue = Math.floor(easedProgress * target);
      elem.textContent = currentValue;
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        elem.textContent = target; // Ensure exact final value
      }
    }
    
    window.requestAnimationFrame(step);
  });
}

// Run counter on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStatsCounter);
} else {
  initStatsCounter();
}

// ── ROADMAP TIMELINE SCROLL EFFECT ──
function initTimelineProgress() {
  const timeline = document.querySelector('.roadmap-timeline');
  const progressLine = document.querySelector('.timeline-progress-line');
  const items = document.querySelectorAll('.timeline-item');
  
  if (!timeline || !progressLine) return;
  
  function updateProgress() {
    const rect = timeline.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Start filling when the top of the timeline is 75% down the viewport
    const startThreshold = viewportHeight * 0.75;
    // End filling when the bottom of the timeline is 35% down the viewport
    const endThreshold = viewportHeight * 0.35;
    
    const timelineTop = rect.top;
    const timelineHeight = rect.height;
    
    let progress = 0;
    if (timelineTop < startThreshold) {
      const scrollableDist = timelineHeight;
      const scrolledDist = startThreshold - timelineTop;
      progress = scrolledDist / scrollableDist;
      progress = Math.max(0, Math.min(1, progress));
    }
    
    progressLine.style.height = `${progress * 100}%`;
    
    // Activate timeline items based on scroll position
    items.forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      const activationPoint = viewportHeight * 0.75;
      
      if (itemRect.top < activationPoint) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
  
  // Attach event listeners
  window.addEventListener('scroll', updateProgress);
  window.addEventListener('resize', updateProgress);
  
  // Initial run
  updateProgress();
}

// Run timeline animation on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTimelineProgress);
} else {
  initTimelineProgress();
}

