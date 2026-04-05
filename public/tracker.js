/**
 * C.L.O.A.K.E.R - Behavioral & Fingerprint Tracker
 * Inject this file into the <head> of your Pre-Lander or Money Page.
 * Example: <script src="https://seu-dominio-aqui.com/tracker.js"></script>
 */

(function () {
    const config = {
      endpoint: '/api/analytics', // Rota interna para onde enviaremos os bips
      sampleRate: 1000, // Enviar telemetria a cada 1s
    }
  
    const sessionData = {
      campaignId: new URLSearchParams(window.location.search).get('utm_campaign') || 'UNKNOWN',
      fingerprint: null,
      mouseMovements: 0,
      clicks: 0,
      scrollDepth: 0,
      timeOnPage: 0,
      isBot: false,
      hardware: {}
    }
  
    // ----------------------------------------------------
    // Módulo: Fingerprint Biométrica (Canvas, WebGL, Fonts)
    // ----------------------------------------------------
    const generateFingerprint = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return 'NO_CANVAS';
        ctx.textBaseline = 'top';
        ctx.font = "14px 'Arial'";
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('Fingerprint Challenge', 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('Fingerprint Challenge', 4, 17);
        const dataURL = canvas.toDataURL();
  
        // Um hash simples (DJB2) do output do Canvas
        let hash = 5381;
        for (let i = 0; i < dataURL.length; i++) {
          hash = ((hash << 5) + hash) + dataURL.charCodeAt(i);
        }
        return hash.toString();
      } catch (e) {
        return 'CANVAS_FAIL';
      }
    }
  
    // Hardware Readings
    sessionData.hardware = {
      cores: navigator.hardwareConcurrency || 'unknown',
      memory: navigator.deviceMemory || 'unknown',
      platform: navigator.platform,
      langs: navigator.languages ? navigator.languages.join(',') : navigator.language,
      screen: `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`
    }
    sessionData.fingerprint = generateFingerprint();
  
    // ----------------------------------------------------
    // Módulo: Análise Comportamental (Behavioural)
    // ----------------------------------------------------
    document.addEventListener('mousemove', () => sessionData.mouseMovements++);
    document.addEventListener('click', () => sessionData.clicks++);
    document.addEventListener('scroll', () => {
      const depth = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (depth > sessionData.scrollDepth) {
        sessionData.scrollDepth = Math.round(depth);
      }
    });

    // Detect headless browsers ou sandboxes simples
    if (navigator.webdriver || !window.chrome) {
        sessionData.isBot = true;
    }
  
    // ----------------------------------------------------
    // Módulo: Engine de Telemetria
    // ----------------------------------------------------
    const startTime = Date.now();
  
    const sendTelemetry = () => {
      sessionData.timeOnPage = Math.floor((Date.now() - startTime) / 1000);
      
      const payload = { ...sessionData };
  
      // Usa sendBeacon para garantir entrega mesmo se o user fechar a aba
      if (navigator.sendBeacon) {
        // Envia para uma rota secundária local invisível.
        // O lojista deve ter certeza que a rota existe.
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon(config.endpoint, blob);
      }
    }
  
    // Manda snapshot na saída ou a cada 10s (para engajamento)
    window.addEventListener('beforeunload', sendTelemetry);
    setInterval(sendTelemetry, 10000);
  
    // Libera a engine no escopo global caso queiram disparar via botões
    window.CloakerTracker = { forceSync: sendTelemetry };
    
  })();
