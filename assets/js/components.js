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
    p.then(function(){ if (!window.Accounts) { var s = document.createElement('script'); s.src = '/assets/js/accounts.js'; s.async = true; document.body.appendChild(s); } });
    return p;
  }

  global.Components = {
    loadHeader: loadHeader,
    loadFooter: loadFooter,
    init: initComponents
  };
})(window);
