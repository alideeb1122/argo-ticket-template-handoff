(function () {
  function getTemplatePath(mode, basePath) {
    var root = basePath || '.';
    var normalizedRoot = root.replace(/\/$/, '');
    if (mode === 'oneway') return normalizedRoot + '/ticket-template-a4-oneway.html';
    if (mode === 'multi') return normalizedRoot + '/ticket-template-a4.html';
    throw new Error('ArgoTicketEmbed: `mode` must be `oneway` or `multi`.');
  }

  function applyDataToFrame(frame, ticketPayload) {
    var win = frame && frame.contentWindow;
    if (!win || !win.ArgoTicketTemplate || typeof win.ArgoTicketTemplate.apply !== 'function') return;
    win.ArgoTicketTemplate.apply(ticketPayload || {});
  }

  function mount(options) {
    var opts = options || {};
    var mountNode = opts.mount;
    if (!mountNode) throw new Error('ArgoTicketEmbed.mount: `mount` is required.');
    var currentData = opts.data || {};

    var frame = document.createElement('iframe');
    frame.src = getTemplatePath(opts.mode, opts.basePath);
    frame.title = opts.title || 'Argo Ticket Template';
    frame.loading = 'lazy';
    frame.style.width = opts.width || '100%';
    frame.style.minHeight = opts.minHeight || '1400px';
    frame.style.border = opts.border || '0';

    frame.addEventListener('load', function () {
      applyDataToFrame(frame, currentData);
      if (typeof opts.onReady === 'function') {
        opts.onReady({
          frame: frame,
          apply: function (nextData) { applyDataToFrame(frame, nextData); }
        });
      }
    });

    mountNode.innerHTML = '';
    mountNode.appendChild(frame);

    return {
      frame: frame,
      apply: function (nextData) {
        currentData = nextData || {};
        applyDataToFrame(frame, currentData);
      },
      destroy: function () { frame.remove(); }
    };
  }

  window.ArgoTicketEmbed = {
    mount: mount,
    templatePath: getTemplatePath
  };
})();
