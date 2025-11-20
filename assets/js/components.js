(function (global) {
  var $ = global.jQuery;

  if (!$) {
    function fallback(target, message) {
      var el = typeof target === 'string' ? global.document.querySelector(target) : target;
      if (!el) return;
      el.innerHTML = '<div class="alert alert-warning rounded-4">' + message + '</div>';
    }

    global.Components = {
      loadHeader: function () {
        fallback('#header', 'Header unavailable.');
        return Promise.resolve();
      },
      loadFooter: function () {
        fallback('#footer', 'Footer unavailable.');
        var y = global.document.getElementById('year');
        if (y) y.textContent = new Date().getFullYear();
        return Promise.resolve();
      },
      init: function () {
        this.loadHeader();
        this.loadFooter();
      }
    };
    return;
  }

  function loadHeader(target) {
    var $el = $(target);
    return new Promise(function (resolve, reject) {
      var segs = global.location.pathname.split('/').filter(Boolean);
      var ghPrefix = segs.length ? ('/' + segs[0] + '/components/header.html') : '/components/header.html';
      var candidates = ['../components/header.html', 'components/header.html', '/components/header.html', ghPrefix];
      var i = 0;
      (function tryNext() {
        var url = candidates[i++];
        $el.load(url, function (responseText, status, xhr) {
          if (status === 'error') {
            if (i < candidates.length) tryNext(); else reject(xhr);
          } else {
            var base = (global.location.hostname.endsWith('github.io') && segs.length>0) ? ('/' + segs[0]) : '';
            try {
              $el.find('a[href^="/"]').each(function(){ var $a=$(this), h=$a.attr('href')||''; if (base && h.indexOf(base+'/')!==0) $a.attr('href', base + h); });
              $el.find('img').each(function(){ var $i=$(this), s=$i.attr('src')||''; if (!s) return; var cleaned = s.replace(/`+$/,''); if (cleaned!==s){ s=cleaned; $i.attr('src', cleaned); } if (s.indexOf('/assets/')===0) { if (base && s.indexOf(base+'/')!==0) $i.attr('src', base + s); } else if (/^(\.\.|\.)\/assets\//.test(s)) { var fixed = s.replace(/^(\.\.|\.)\/assets\//, '/assets/'); $i.attr('src', base + fixed); } });
            } catch(e) {}
            resolve($el);
          }
        });
      })();
    });
  }

  function loadFooter(target) {
    var $el = $(target);
    return new Promise(function (resolve, reject) {
      var segs = global.location.pathname.split('/').filter(Boolean);
      var ghPrefix = segs.length ? ('/' + segs[0] + '/components/footer.html') : '/components/footer.html';
      var candidates = ['../components/footer.html', 'components/footer.html', '/components/footer.html', ghPrefix];
      var i = 0;
      (function tryNext() {
        var url = candidates[i++];
        $el.load(url, function (responseText, status, xhr) {
          if (status === 'error') {
            if (i < candidates.length) tryNext(); else reject(xhr);
          } else {
            var base = (global.location.hostname.endsWith('github.io') && segs.length>0) ? ('/' + segs[0]) : '';
            try {
              $el.find('a[href^="/"]').each(function(){ var $a=$(this), h=$a.attr('href')||''; if (base && h.indexOf(base+'/')!==0) $a.attr('href', base + h); });
              $el.find('img').each(function(){ var $i=$(this), s=$i.attr('src')||''; if (!s) return; var cleaned = s.replace(/`+$/,''); if (cleaned!==s){ s=cleaned; $i.attr('src', cleaned); } if (s.indexOf('/assets/')===0) { if (base && s.indexOf(base+'/')!==0) $i.attr('src', base + s); } else if (/^(\.\.|\.)\/assets\//.test(s)) { var fixed = s.replace(/^(\.\.|\.)\/assets\//, '/assets/'); $i.attr('src', base + fixed); } });
            } catch(e) {}
            var $year = $('#year');
            if ($year.length) $year.text(new Date().getFullYear());
            resolve($el);
          }
        });
      })();
    });
  }

  function initComponents() {
    var p = Promise.all([
      loadHeader('#header').catch(function () {
        $('#header').html('<div class="alert alert-warning rounded-4">Header failed to load.</div>');
      }),
      loadFooter('#footer').catch(function () {
        $('#footer').html('<div class="alert alert-warning rounded-4">Footer failed to load.</div>');
      })
    ]);
    p.then(function(){ if (!window.Accounts) { var s = document.createElement('script'); var segs = window.location.pathname.split('/').filter(Boolean), base = (window.location.hostname.endsWith('github.io') && segs.length>0) ? ('/' + segs[0]) : ''; s.src = base + '/assets/js/accounts.js'; s.async = true; document.body.appendChild(s); } });
    return p;
  }

  global.Components = {
    loadHeader: loadHeader,
    loadFooter: loadFooter,
    init: initComponents
  };
})(window);
;(function(){
  var modalId = 'authModal';
  function ensureModal(){
    if (document.getElementById(modalId)) return;
    var wrap = document.createElement('div');
    wrap.className = 'modal fade';
    wrap.id = modalId;
    wrap.setAttribute('tabindex','-1');
    wrap.innerHTML = '<div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">Account</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body" id="authModalBody"></div></div></div>';
    document.body.appendChild(wrap);
  }
  function openView(view){
    ensureModal();
    var body = document.getElementById('authModalBody');
    body.innerHTML = '';
    var segs = window.location.pathname.split('/').filter(Boolean);
    var base = (window.location.hostname.endsWith('github.io') && segs.length>0) ? ('/' + segs[0]) : '';
    var url = base + '/components/' + (view==='signup'?'signup':'login') + '.html';
    fetch(url).then(function(r){ return r.text(); }).then(function(html){ body.innerHTML = html; var modal = new bootstrap.Modal(document.getElementById(modalId)); modal.show(); });
  }
  document.addEventListener('click', function(e){
    var t = e.target.closest('[data-open]');
    if (!t) return;
    var v = t.getAttribute('data-open');
    if (v==='login' || v==='signup'){
      e.preventDefault();
      openView(v);
    }
  });
})();
