const pingCheck = {
  isRunning: false,
  timeout: null,

  async getPing() {
    const startTime = performance.now();
    try {
      const response = await fetch(window.location.href, {
        method: 'HEAD',
        cache: 'no-store',
      });
      const endTime = performance.now();
      return Math.round(endTime - startTime);
    } catch (err) {
      console.warn('Ping check failed:', err);
      return null;
    }
  },

  updateDisplay(ping) {
    if (!ping) return;

    const pingValueElement = document.getElementById('pingValue');
    const pingDotElement = document.getElementById('pingDot');

    if (!pingValueElement || !pingDotElement) return;

    pingValueElement.textContent = `Ping: ${ping} ms`;

    pingDotElement.className = 'dot ' + (ping < 50 ? 'good' : ping < 180 ? 'medium' : 'poor');
  },

  async check() {
    if (this.isRunning) return;
    this.isRunning = true;

    try {
      const ping = await this.getPing();
      if (document.visibilityState === 'visible') {
        this.updateDisplay(ping);
      }
    } finally {
      this.isRunning = false;
    }
  },

  start() {
    if (document.visibilityState === 'visible') {
      this.check();
    }

    this.timeout = setTimeout(() => {
      this.start();
    }, 1500);
  },

  stop() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  },
};

document.addEventListener(
  'visibilitychange',
  () => {
    if (document.visibilityState === 'visible') {
      pingCheck.start();
    } else {
      pingCheck.stop();
    }
  },
  { passive: true }
);

pingCheck.start();
