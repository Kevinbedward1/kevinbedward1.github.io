/* ============================================================
   KEVIN BEDWARD — QA PORTFOLIO
   Main JavaScript: Canvas BG, Typewriter, Theme, Reveal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ========== 1. Matrix / Data-Stream Canvas Background ========== */
  const canvas = document.getElementById('matrix-bg');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrameId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedY = Math.random() * 0.8 + 0.2;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
      this.fadeSpeed = Math.random() * 0.008 + 0.002;

      // Assign color type
      const rand = Math.random();
      if (rand < 0.55) {
        this.colorType = 'primary';
      } else if (rand < 0.8) {
        this.colorType = 'secondary';
      } else {
        this.colorType = 'tertiary';
      }
    }

    getColor() {
      const theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'light') {
        switch (this.colorType) {
          case 'primary': return `rgba(0, 119, 182, ${this.opacity})`;
          case 'secondary': return `rgba(108, 59, 170, ${this.opacity * 0.7})`;
          case 'tertiary': return `rgba(214, 51, 132, ${this.opacity * 0.5})`;
        }
      } else {
        switch (this.colorType) {
          case 'primary': return `rgba(0, 229, 255, ${this.opacity})`;
          case 'secondary': return `rgba(124, 77, 255, ${this.opacity * 0.7})`;
          case 'tertiary': return `rgba(244, 114, 182, ${this.opacity * 0.5})`;
        }
      }
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;

      // Fade in and out
      this.opacity += this.fadeDirection * this.fadeSpeed;
      if (this.opacity >= 0.6) { this.fadeDirection = -1; }
      if (this.opacity <= 0.05) { this.fadeDirection = 1; }

      // Reset if off screen
      if (this.y > canvas.height + 10) {
        this.y = -10;
        this.x = Math.random() * canvas.width;
      }
      if (this.x < -10 || this.x > canvas.width + 10) {
        this.x = Math.random() * canvas.width;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.getColor();
      ctx.fill();

      // Small glow for larger particles
      if (this.size > 1.5) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = this.getColor().replace(/[\d.]+\)$/, `${this.opacity * 0.15})`);
        ctx.fill();
      }
    }
  }

  // Data stream columns
  class DataColumn {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * -canvas.height;
      this.speed = Math.random() * 2 + 0.5;
      this.chars = [];
      this.charCount = Math.floor(Math.random() * 15) + 5;
      this.opacity = Math.random() * 0.12 + 0.03;

      for (let i = 0; i < this.charCount; i++) {
        this.chars.push(String.fromCharCode(Math.random() > 0.5 ? 
          Math.floor(Math.random() * 10) + 48 : // numbers
          Math.floor(Math.random() * 26) + 65    // letters
        ));
      }
    }

    update() {
      this.y += this.speed;
      if (this.y > canvas.height + 200) {
        this.y = Math.random() * -400 - 100;
        this.x = Math.random() * canvas.width;
      }
    }

    draw() {
      const theme = document.documentElement.getAttribute('data-theme');
      const baseColor = theme === 'light' ? '0, 119, 182' : '0, 229, 255';
      
      ctx.font = '10px JetBrains Mono, monospace';
      this.chars.forEach((char, i) => {
        const charOpacity = this.opacity * (1 - i / this.charCount);
        ctx.fillStyle = `rgba(${baseColor}, ${charOpacity})`;
        ctx.fillText(char, this.x, this.y + i * 14);
      });
    }
  }

  let dataColumns = [];

  function initParticles() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 200);
    particles = Array.from({ length: count }, () => new Particle());

    const colCount = Math.min(Math.floor(canvas.width / 80), 20);
    dataColumns = Array.from({ length: colCount }, () => new DataColumn());
  }
  initParticles();

  // Connection lines between nearby particles
  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const theme = document.documentElement.getAttribute('data-theme');
          const lineColor = theme === 'light' ? '0, 119, 182' : '0, 229, 255';
          const lineOpacity = (1 - dist / maxDist) * 0.06;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${lineColor}, ${lineOpacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw data columns
    dataColumns.forEach(col => {
      col.update();
      col.draw();
    });

    // Draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawConnections();
    animFrameId = requestAnimationFrame(animateCanvas);
  }
  animateCanvas();


  /* ========== 2. Typewriter Effect ========== */
  const typewriterEl = document.getElementById('typewriter');
  const titles = [
    'QA Tester',
    'Software Tester',
    'Defect Detective',
    'Test Case Designer',
    'Quality Advocate'
  ];
  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function typewrite() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      typewriterEl.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      typewriterEl.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 80;
    }

    if (!isDeleting && charIndex === currentTitle.length) {
      typeSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typeSpeed = 400;
    }

    setTimeout(typewrite, typeSpeed);
  }
  typewrite();


  /* ========== 3. Theme Toggle ========== */
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Load saved theme
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  });


  /* ========== 4. Scroll Reveal ========== */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger animations slightly
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  /* ========== 5. Navbar Scroll Effect ========== */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });


  /* ========== 6. Mobile Menu ========== */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksEl.classList.toggle('active');
  });

  // Close menu on link click
  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinksEl.classList.remove('active');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navLinksEl.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinksEl.classList.remove('active');
    }
  });


  /* ========== 7. Smooth scroll for anchor links ========== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
