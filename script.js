// ==========================================================================
//   ASSETRA – Interactive JavaScript Engine (Terminal, Canvas Charts & FX)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Floating Particle Canvas Background
  // ==========================================
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.speedY = (Math.random() - 0.5) * 0.25 - 0.05;
        this.opacity = Math.random() * 0.5 + 0.1;
        // Color distribution: 60% Cyan, 40% Neon Green
        this.color = Math.random() < 0.6 ? '#00e5ff' : '#b5ff2d';
        this.life = 0;
        this.maxLife = Math.random() * 400 + 200;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life++;
        if (this.life > this.maxLife || this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
          this.reset();
          this.y = canvas.height + 10;
        }
        const lifeRatio = this.life / this.maxLife;
        this.currentOpacity = this.opacity * Math.sin(lifeRatio * Math.PI);
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.currentOpacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const initParticles = (count = 80) => {
      particles = [];
      for (let i = 0; i < count; i++) {
        const p = new Particle();
        p.life = Math.random() * p.maxLife;
        particles.push(p);
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Connect nodes
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.save();
            ctx.globalAlpha = 0.04 * (1 - dist / 120);
            ctx.strokeStyle = particles[i].color === '#00e5ff' ? '#00e5ff' : '#b5ff2d';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
      particles.forEach(p => { p.update(); p.draw(); });
      animFrame = requestAnimationFrame(animateParticles);
    };

    initParticles();
    animateParticles();
  }


  // ==========================================
  // 2. Mouse Glow, Tilt & Scroll Progress
  // ==========================================
  
  // Custom cursor glow trace
  const glowEl = document.createElement('div');
  glowEl.id = 'cursorGlow';
  document.body.appendChild(glowEl);

  let cursorTimeout;
  document.addEventListener('mousemove', (e) => {
    glowEl.style.left = e.clientX + 'px';
    glowEl.style.top = e.clientY + 'px';
    glowEl.style.opacity = '1';
    clearTimeout(cursorTimeout);
    cursorTimeout = setTimeout(() => { glowEl.style.opacity = '0'; }, 1500);
  });

  // Tilt Card Effect (Asset & Agent Cards)
  document.querySelectorAll('.feat-big-card, .doc-card, .rm-card, .visual-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // Scroll Progress and Sticky Navbar
  const progressBar = document.getElementById('scrollProgress');
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    // Scroll progress indicator
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      const scrolled = (window.scrollY / docHeight) * 100;
      if (progressBar) progressBar.style.width = scrolled + '%';
    }

    // Navbar scroll effect
    if (navbar) {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    updateActiveNavLink();
  });

  // Dynamic active link highlighting on scroll
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let currentSection = '';
    const offset = 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - offset;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }


  // ==========================================
  // 3. Hamburger Menu & Copy Widgets
  // ==========================================
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  if (hamburger && navLinksEl) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinksEl.classList.toggle('open');
    });

    // Close mobile nav when clicking a link
    navLinksEl.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinksEl.classList.remove('open');
      });
    });
  }

  // Copy command script
  const copyBtn = document.getElementById('copyBtn');
  const installCmd = document.getElementById('installCmd');

  if (copyBtn && installCmd) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(installCmd.textContent.trim()).then(() => {
        const textEl = copyBtn.querySelector('.copy-text');
        textEl.textContent = 'Copied!';
        copyBtn.style.borderColor = 'var(--accent-cyan)';
        copyBtn.style.color = 'var(--accent-cyan)';
        
        setTimeout(() => {
          textEl.textContent = 'Copy';
          copyBtn.style.borderColor = '';
          copyBtn.style.color = '';
        }, 2000);
      });
    });
  }


  // ==========================================
  // 4. Interactive Terminal Console CLI
  // ==========================================
  const terminalScreen = document.getElementById('terminalScreen');
  const terminalForm = document.getElementById('terminalForm');
  const terminalInput = document.getElementById('terminalInput');
  const terminalChips = document.getElementById('terminalChips');

  // Simulated asset database for query outputs
  const assetDb = {
    'AST-01': {
      name: 'London Commercial Office Fund',
      category: 'Real Estate',
      ticker: 'LCOF-RWA',
      verifiedBy: 'AVE-ValuerAgent-04, CoTo-Tokenizer-01',
      legalDocument: 'UK-Deed-Reg-78904A',
      underwrittenValuation: '$12,450,000',
      activeLtv: '65%',
      riskCategory: 'LOW',
      currentApy: '7.80%',
      healthIndex: '98.4%',
      liquidityPool: 'Uniswap v3 AST-01/USDC (Robinhood L2)'
    },
    'AST-02': {
      name: 'US Treasury Bills Index Fund',
      category: 'Fixed Income / Government Debt',
      ticker: 'UST-BILL',
      verifiedBy: 'AVE-SovereignFeed-02, ARO-RiskOracle-09',
      legalDocument: 'US-Treasury-Custody-4422B',
      underwrittenValuation: '$45,210,000',
      activeLtv: '90%',
      riskCategory: 'MINIMAL',
      currentApy: '5.45%',
      healthIndex: '99.9%',
      liquidityPool: 'Curve AST-02/USDT'
    },
    'AST-03': {
      name: 'Rare Fine Art Portfolio',
      category: 'Luxury Commodity / Alternative Assets',
      ticker: 'ART-VAULT',
      verifiedBy: 'AVE-ConsensusPrice-07, ARO-VolOracle-03',
      legalDocument: 'CH-ArtTrust-SwissVault-091',
      underwrittenValuation: '$7,500,000',
      activeLtv: '40%',
      riskCategory: 'MEDIUM',
      currentApy: '14.12%',
      healthIndex: '87.2%',
      liquidityPool: 'Assetra Fractional Pool AST-03/USDC'
    },
    'AST-04': {
      name: 'Solar Energy Grid Pool',
      category: 'Regenerative Finance (ReFi)',
      ticker: 'SOLAR-GRID',
      verifiedBy: 'AVE-IoT-SensorFeed-04, CoTo-Tokenizer-03',
      legalDocument: 'SG-SolarLease-Compliance-889',
      underwrittenValuation: '$9,820,000',
      activeLtv: '55%',
      riskCategory: 'LOW',
      currentApy: '10.50%',
      healthIndex: '92.6%',
      liquidityPool: 'Balancer AST-04/USDC Multi-Pool'
    }
  };

  const addTerminalLine = (text, className = '') => {
    const line = document.createElement('div');
    line.className = `terminal-output-line monospace ${className}`;
    line.innerHTML = text;
    terminalScreen.appendChild(line);
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
  };

  const processCommand = (cmdText) => {
    const cleanCmd = cmdText.trim().toLowerCase();
    
    // Echo user input
    addTerminalLine(`<span class="text-gray">guest@assetra:~$</span> ${cmdText}`);

    if (cleanCmd === '') {
      return;
    }

    if (cleanCmd === 'clear') {
      terminalScreen.innerHTML = '';
      return;
    }

    if (cleanCmd === 'help') {
      const helpOutput = `
<span class="text-gold">Assetra Node CLI CLI-Helper v1.0.4. Available commands:</span>
  - <span class="text-cyan">help</span>: Displays list of commands and system guidance.
  - <span class="text-cyan">assetra list</span>: Returns underwritten active RWAs on-chain.
  - <span class="text-cyan">assetra scan &lt;asset-id&gt;</span>: Runs valuation audit scans on an asset (e.g. <span class="text-gray">assetra scan AST-01</span>).
  - <span class="text-cyan">assetra agents</span>: Displays current fleet load, drift parameters, and active nodes.
  - <span class="text-cyan">assetra mint --asset &lt;asset-id&gt;</span>: Triggers tokenization audit & mints fractional tokens.
  - <span class="text-cyan">clear</span>: Clears terminal history.
      `;
      addTerminalLine(helpOutput);
      return;
    }

    if (cleanCmd === 'assetra list') {
      addTerminalLine('Scanning blockchain registry and pulling underwritten assets...', 'text-gray');
      
      setTimeout(() => {
        let output = `<span class="text-gold">Assetra Registered Real World Assets (RWAs):</span>\n`;
        output += `ID        Ticker       Valuation     APY     Risk Level  AI Health\n`;
        output += `--------------------------------------------------------------\n`;
        Object.keys(assetDb).forEach(id => {
          const a = assetDb[id];
          const idSpacing = id.padEnd(10);
          const tickSpacing = a.ticker.padEnd(13);
          const valSpacing = a.underwrittenValuation.padEnd(14);
          const apySpacing = a.currentApy.padEnd(8);
          const rskSpacing = a.riskCategory.padEnd(12);
          output += `${idSpacing}${tickSpacing}${valSpacing}${apySpacing}${rskSpacing}${a.healthIndex}\n`;
        });
        output += `\nUse '<span class="text-cyan">assetra scan [ID]</span>' to perform audit scans.`;
        addTerminalLine(output);
      }, 400);
      return;
    }

    if (cleanCmd.startsWith('assetra scan')) {
      const parts = cmdText.split(/\s+/);
      const assetId = parts[2] ? parts[2].toUpperCase() : null;

      if (!assetId || !assetDb[assetId]) {
        addTerminalLine(`Error: Asset ID required or invalid. Try '<span class="text-cyan">assetra scan AST-01</span>'`, 'text-red');
        return;
      }

      addTerminalLine(`[+] Contacting Valuation Consensus Engine (AVE)...`, 'text-gray');
      addTerminalLine(`[+] Pulling public deeds and legal files for ${assetId}...`, 'text-gray');
      
      setTimeout(() => {
        const a = assetDb[assetId];
        let report = `
<span class="text-gold">AUDIT SCAN REPORT FOR ${assetId}</span>
------------------------------------------------------
Asset Title     : ${a.name}
Asset Category  : ${a.category}
Token Symbol    : ${a.ticker}
Registry Deed   : ${a.legalDocument}
Valuation (AVE) : <span class="text-gold">${a.underwrittenValuation}</span>
LTV Max Threshold: ${a.activeLtv}
Risk Score      : <span class="text-cyan">${a.riskCategory} RISK</span>
AI Health Index : <span class="text-gradient-cyan" style="-webkit-background-clip:unset;-webkit-text-fill-color:unset;color:#00e5ff">${a.healthIndex} Confidence</span>
Active Agents   : ${a.verifiedBy}
Liquidity Pool  : ${a.liquidityPool}
------------------------------------------------------
Underwriting Status: <span class="text-emerald">ACTIVE & VERIFIED</span>
        `;
        addTerminalLine(report);
      }, 500);
      return;
    }

    if (cleanCmd === 'assetra agents') {
      addTerminalLine('Interrogating Cognitive Underwriting Nodes...', 'text-gray');
      setTimeout(() => {
        const agentStatus = `
<span class="text-gold">Assetra Autonomous Agent Fleet Metrics:</span>
----------------------------------------------------------------------
Node Name         Type                      Operational Load  Drift Code
----------------------------------------------------------------------
AVE-Valuer-04     Valuation Consensus       42.8% Capacity    0.00% (Steady)
ARO-Risk-09       Autonomous Risk Oracle    18.1% Capacity    0.01% (Safe)
CoTo-Tokenizer-01 Legal Tokenizer           12.4% Capacity    0.00% (Compliant)
ALO-Optimizer-02  Liquidity Router          55.9% Capacity    0.03% (Optimized)
----------------------------------------------------------------------
Consensus State : <span class="text-emerald">OPERATIONAL (ACTIVE PARTICIPATION: 4 NODES)</span>
        `;
        addTerminalLine(agentStatus);
      }, 300);
      return;
    }

    if (cleanCmd.startsWith('assetra mint')) {
      const parts = cmdText.split(/\s+/);
      // Look for asset ID: either parsed index after --asset or simply third argument
      let assetId = '';
      const flagIdx = parts.indexOf('--asset');
      if (flagIdx !== -1 && parts[flagIdx + 1]) {
        assetId = parts[flagIdx + 1].toUpperCase();
      } else if (parts[2]) {
        assetId = parts[2].toUpperCase();
      }

      if (!assetId || !assetDb[assetId]) {
        addTerminalLine(`Error: Specify valid asset ID. Usage: '<span class="text-cyan">assetra mint --asset AST-01</span>'`, 'text-red');
        return;
      }

      const a = assetDb[assetId];
      addTerminalLine(`[!] Initiating tokenization sequence for ${assetId}...`, 'text-gold');
      
      // Multi-step simulated mint logs
      let step = 0;
      const logs = [
        `[1/4] Legal Tokenizer Agent (CoTo) validating compliance with SEC Rule 506(c)...`,
        `[2/4] Uploading asset ledger metadata to IPFS network...`,
        `[3/4] Fetching value consensus proof from AVE nodes... (Consensus value: ${a.underwrittenValuation})`,
        `[4/4] Invoking AssetraFactoryContract.mintFractional("${assetId}", LTV:${a.activeLtv}) on-chain...`,
        `<span class="text-emerald">SUCCESS: Mint Completed! Created 10,000 fractional ${a.ticker} tokens.</span>`,
        `Transaction Hash: <span class="text-cyan">0x7a83d92fb9c049d520ce4e0192e2b3491f0923ce81b0a72491a90c0ef491901f</span>`
      ];

      const runMintLog = () => {
        if (step < logs.length) {
          const logClass = step === 4 ? 'text-emerald' : (step === 5 ? 'text-cyan' : 'text-gray');
          addTerminalLine(logs[step], logClass);
          step++;
          setTimeout(runMintLog, 500);
        }
      };
      
      setTimeout(runMintLog, 400);
      return;
    }

    // Default error line
    addTerminalLine(`Command not found: '${cmdText}'. Type '<span class="text-cyan">help</span>' to list available commands.`, 'text-red');
  };

  if (terminalForm && terminalInput) {
    terminalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputVal = terminalInput.value;
      processCommand(inputVal);
      terminalInput.value = '';
    });
  }

  // Pre-wire Terminal Chips
  if (terminalChips) {
    terminalChips.addEventListener('click', (e) => {
      const chipBtn = e.target.closest('.chip-cmd');
      if (chipBtn) {
        const cmd = chipBtn.getAttribute('data-cmd');
        if (terminalInput) {
          terminalInput.value = cmd;
          terminalForm.dispatchEvent(new Event('submit'));
        }
      }
    });
  }

  // Link RWA Showcase Card buttons to Terminal CLI
  document.querySelectorAll('.card-action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cmd = btn.getAttribute('data-target-cmd');
      const termSec = document.getElementById('terminal-section');
      if (termSec) {
        const offsetTop = termSec.offsetTop - 70;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        
        // Wait for smooth scroll to finish, then execute
        setTimeout(() => {
          if (terminalInput) {
            terminalInput.value = cmd;
            terminalForm.dispatchEvent(new Event('submit'));
          }
        }, 800);
      }
    });
  });


  // ==========================================
  // 5. Google Fonts / Docs Tab Navigation
  // ==========================================
  const docNavItems = document.querySelectorAll('.doc-nav-item');
  const docCards = document.querySelectorAll('.doc-card');

  if (docNavItems && docCards) {
    docNavItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetTab = item.getAttribute('data-tab');
        
        docNavItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        docCards.forEach(card => {
          card.classList.remove('active');
          if (card.id === `tabContent-${targetTab}`) {
            card.classList.add('active');
          }
        });
      });
    });
  }


  // ==========================================
  // 6. Statistics Counter Animation
  // ==========================================
  const counterTVU = document.getElementById('counterTVU');
  const counterSpeed = document.getElementById('counterSpeed');
  const counterSavings = document.getElementById('counterSavings');

  function animateCounter(el, start, end, duration, formatFn) {
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const currentVal = start + (end - start) * eased;
      el.textContent = formatFn(currentVal);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }

  // Set up intersection observer to trigger counters when scrolling into view
  const counterSection = document.getElementById('analytics');
  let countersAnimated = false;

  if (counterSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          
          if (counterTVU) {
            animateCounter(counterTVU, 0, 75080000, 2000, (v) => '$' + Math.floor(v).toLocaleString());
          }
          if (counterSpeed) {
            animateCounter(counterSpeed, 0, 99.85, 1800, (v) => v.toFixed(2) + '%');
          }
          if (counterSavings) {
            animateCounter(counterSavings, 0, 1489200, 2200, (v) => '$' + Math.floor(v).toLocaleString());
          }
        }
      });
    }, { threshold: 0.2 });
    observer.observe(counterSection);
  }


  // ==========================================
  // 7. Simulated Canvas Chart Renderers
  // ==========================================
  
  // Hero Mini Chart
  const miniChartCanvas = document.getElementById('miniHeroChart');
  if (miniChartCanvas) {
    const ctx = miniChartCanvas.getContext('2d');
    
    // Draw static neon-cyan/gold upward curve representing RWA valuation Index
    const drawMiniChart = () => {
      ctx.clearRect(0,0, miniChartCanvas.width, miniChartCanvas.height);
      const w = miniChartCanvas.width;
      const h = miniChartCanvas.height;
      
      // Draw grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < w; i += w / 5) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, h);
        ctx.stroke();
      }
      for (let j = 0; j < h; j += h / 4) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(w, j);
        ctx.stroke();
      }

      // Draw Gradient Line
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, '#00e5ff');
      grad.addColorStop(1, '#b5ff2d');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(0, 229, 255, 0.4)';
      
      ctx.beginPath();
      // Plot smooth Bezier curve
      ctx.moveTo(10, h - 30);
      ctx.bezierCurveTo(w * 0.3, h - 40, w * 0.6, h * 0.5, w - 10, 20);
      ctx.stroke();
      
      // Remove shadow for fill
      ctx.shadowBlur = 0;
      
      // Draw gradient under area
      const areaGrad = ctx.createLinearGradient(0, 0, 0, h);
      areaGrad.addColorStop(0, 'rgba(0, 229, 255, 0.15)');
      areaGrad.addColorStop(1, 'rgba(0, 229, 255, 0)');
      ctx.fillStyle = areaGrad;
      
      ctx.beginPath();
      ctx.moveTo(10, h - 30);
      ctx.bezierCurveTo(w * 0.3, h - 40, w * 0.6, h * 0.5, w - 10, 20);
      ctx.lineTo(w - 10, h);
      ctx.lineTo(10, h);
      ctx.closePath();
      ctx.fill();

      // Plot point circles at key milestones
      ctx.fillStyle = '#b5ff2d';
      ctx.beginPath();
      ctx.arc(w - 10, 20, 5, 0, Math.PI * 2);
      ctx.fill();
    };
    
    drawMiniChart();
    window.addEventListener('resize', drawMiniChart);
  }

  // Analytics Main Chart
  const mainChartCanvas = document.getElementById('analyticsMainChart');
  if (mainChartCanvas) {
    const ctx = mainChartCanvas.getContext('2d');
    
    // Fit canvas width on parent wrapper
    const resizeMainChart = () => {
      const parent = mainChartCanvas.parentElement;
      mainChartCanvas.width = parent.clientWidth;
      mainChartCanvas.height = parent.clientHeight || 280;
      drawMainChart();
    };
    
    const drawMainChart = () => {
      const w = mainChartCanvas.width;
      const h = mainChartCanvas.height;
      ctx.clearRect(0,0, w, h);
      
      // Grid parameters
      const cols = 7;
      const rows = 5;
      
      // Draw grid
      ctx.strokeStyle = 'rgba(255,255,255,0.02)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= cols; i++) {
        const x = (w / cols) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h - 20);
        ctx.stroke();
      }
      for (let j = 0; j <= rows; j++) {
        const y = ((h - 20) / rows) * j;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // X-Axis Labels (Months)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
      ctx.fillStyle = 'var(--text-muted)';
      ctx.font = '10px var(--font-mono)';
      ctx.textAlign = 'center';
      for (let i = 0; i < months.length; i++) {
        const x = (w / (months.length - 1)) * i;
        ctx.fillText(months[i], x, h - 5);
      }

      // TVL curve coordinates (relative)
      const tvlPoints = [0.2, 0.28, 0.35, 0.52, 0.58, 0.78, 0.9];
      // Transaction curve coordinates (relative)
      const txPoints = [0.1, 0.22, 0.45, 0.38, 0.65, 0.7, 0.95];

      const drawCurve = (points, strokeColor, shadowCol, isArea) => {
        ctx.save();
        ctx.beginPath();
        const startX = 0;
        const startY = (h - 20) * (1 - points[0]);
        ctx.moveTo(startX, startY);

        for (let i = 1; i < points.length; i++) {
          const x = (w / (points.length - 1)) * i;
          const y = (h - 20) * (1 - points[i]);
          
          // Bezier control coordinates
          const prevX = (w / (points.length - 1)) * (i - 1);
          const prevY = (h - 20) * (1 - points[i - 1]);
          const cpX1 = prevX + (x - prevX) / 2;
          const cpY1 = prevY;
          const cpX2 = prevX + (x - prevX) / 2;
          const cpY2 = y;
          ctx.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, x, y);
        }

        if (isArea) {
          ctx.lineTo(w, h - 20);
          ctx.lineTo(0, h - 20);
          ctx.closePath();
          
          const areaGrad = ctx.createLinearGradient(0, 0, 0, h);
          areaGrad.addColorStop(0, shadowCol);
          areaGrad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = areaGrad;
          ctx.fill();
        } else {
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 3;
          ctx.shadowBlur = 10;
          ctx.shadowColor = strokeColor;
          ctx.stroke();
        }
        ctx.restore();
      };

      // Draw Neon Green curve (TVL) area and stroke
      drawCurve(tvlPoints, '#b5ff2d', 'rgba(181, 255, 45, 0.08)', true);
      drawCurve(tvlPoints, '#b5ff2d', 'rgba(181, 255, 45, 0.4)', false);

      // Draw Cyan curve (Transactions) area and stroke
      drawCurve(txPoints, '#00e5ff', 'rgba(0, 229, 255, 0.06)', true);
      drawCurve(txPoints, '#00e5ff', 'rgba(0, 229, 255, 0.4)', false);
    };

    window.addEventListener('resize', resizeMainChart);
    // Initialize chart size
    setTimeout(resizeMainChart, 200);
  }

  // ==========================================
  // 8. Logo Hover Glitch & Logger Console
  // ==========================================
  const logoText = document.querySelector('.logo-text');
  if (logoText) {
    const glitchStyle = document.createElement('style');
    glitchStyle.textContent = `
      @keyframes logo-glitch {
        0% { transform: none; opacity: 1; text-shadow: none; }
        15% { transform: skewX(-10deg) scaleY(0.95); opacity: 0.9; text-shadow: -2px 0 var(--accent-cyan), 2px 0 var(--accent-gold); }
        30% { transform: skewX(8deg) scaleX(1.05); opacity: 0.85; text-shadow: 2px 0 var(--accent-cyan), -2px 0 var(--accent-gold); }
        45% { transform: none; opacity: 1; text-shadow: none; }
        100% { transform: none; opacity: 1; }
      }
      .logo-text-glitch { animation: logo-glitch 0.5s ease; }
    `;
    document.head.appendChild(glitchStyle);

    logoText.parentElement.addEventListener('mouseenter', () => {
      logoText.classList.add('logo-text-glitch');
      setTimeout(() => logoText.classList.remove('logo-text-glitch'), 500);
    });
  }



  console.log('%c🤖 ASSETRA PROTOCOL', 'color: #b5ff2d; font-size: 18px; font-weight: bold; font-family: monospace;');
  console.log('%cAI-Autonomous Underwritten Real World Assets (RWA)', 'color: #00e5ff; font-size: 12px; font-family: monospace;');
});
