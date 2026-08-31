import app from 'flarum/common/app';

function forumAttribute(name) {
  if (app.forum && typeof app.forum.attribute === 'function') {
    return app.forum.attribute(name);
  }
  var resources = (app.data && app.data.resources) || [];
  var forumRecord = resources.find(function (r) { return r && r.type === 'forums'; });
  return forumRecord && forumRecord.attributes && forumRecord.attributes[name];
}

var snowCounts = { light: 25, medium: 50, heavy: 75 };

function applyMagicColors(colors) {
  var map = {
    progressBar: '--timeofmagic-accent-bar',
    backToTop: '--timeofmagic-accent-top',
    scrollbar: '--timeofmagic-accent-scrollbar',
    clickSpark: '--timeofmagic-accent-spark',
  };

  Object.keys(map).forEach(function (key) {
    if (colors[key]) {
      document.documentElement.style.setProperty(map[key], colors[key]);
    }
  });
}

function createClickSpark() {
  document.addEventListener('click', function (e) {
    var spark = document.createElement('div');
    spark.className = 'timeofmagic-spark';
    spark.style.left = e.clientX + 'px';
    spark.style.top = e.clientY + 'px';
    document.body.appendChild(spark);

    setTimeout(function () {
      if (spark.parentNode) {
        spark.parentNode.removeChild(spark);
      }
    }, 700);
  });
}

function createSnowflakes(count) {
  var container = document.createElement('div');
  container.id = 'timeofmagic-snow';
  container.setAttribute('aria-hidden', 'true');

  var flakes = ['❅', '❅', '❆', '❄', '❅', '❆', '❄', '❅', '❆', '❄', '❅', '❆', '❄', '❅', '❆', '❄', '❅', '❆', '❄', '❄'];

  for (var i = 0; i < count; i++) {
    var flake = document.createElement('div');
    flake.className = 'timeofmagic-snowflake';
    flake.textContent = flakes[i % flakes.length];
    flake.style.left = (Math.random() * 100) + '%';
    flake.style.animationDelay = (Math.random() * 8) + 's, ' + (Math.random() * 4) + 's';
    flake.style.animationDuration = (8 + Math.random() * 4) + 's, ' + (2 + Math.random() * 2) + 's';
    flake.style.opacity = 0.4 + Math.random() * 0.6;
    flake.style.fontSize = (0.7 + Math.random() * 0.6) + 'em';
    container.appendChild(flake);
  }

  document.body.appendChild(container);
}

app.initializers.add('stezkoy-time-of-magic', function () {
  var progressBarEnabled = !!forumAttribute('timeOfMagicProgressBar');
  var backToTopEnabled = !!forumAttribute('timeOfMagicBackToTop');
  var snowEnabled = !!forumAttribute('timeOfMagicSnow');
  var scrollbarEnabled = !!forumAttribute('timeOfMagicScrollbar');
  var swapLayoutEnabled = !!forumAttribute('timeOfMagicSwapLayout');
  var bgPattern = forumAttribute('timeOfMagicBackground') || '';
  var clickSparkEnabled = !!forumAttribute('timeOfMagicClickSpark');

  applyMagicColors({
    progressBar: forumAttribute('timeOfMagicProgressBarColor'),
    backToTop: forumAttribute('timeOfMagicBackToTopColor'),
    scrollbar: forumAttribute('timeOfMagicScrollbarColor'),
    clickSpark: forumAttribute('timeOfMagicClickSparkColor'),
  });

  if (scrollbarEnabled) {
    document.documentElement.classList.add('timeofmagic-custom-scrollbar');
  }

  if (swapLayoutEnabled) {
    document.documentElement.classList.add('timeofmagic-swap-layout');
  }

  if (bgPattern) {
    document.body.classList.add('timeofmagic-bg-' + bgPattern);
  }

  if (progressBarEnabled) {
    var bar = document.createElement('div');
    bar.id = 'scroll-progress-bar';
    document.body.appendChild(bar);

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var scrollTop = document.documentElement.scrollTop;
          var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          bar.style.width = scrollHeight > 0 ? (scrollTop / scrollHeight * 100) + '%' : '0%';
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  if (backToTopEnabled) {
    var rounded = !!forumAttribute('timeOfMagicBackToTopRounded');
    var iconClass = forumAttribute('timeOfMagicBackToTopIcon') || 'fa-solid fa-arrow-up';

    var btn = document.createElement('div');
    btn.id = 'back-to-top';
    btn.classList.add(rounded ? 'back-to-top--rounded' : 'back-to-top--circle');

    var iconEl = document.createElement('i');
    iconEl.className = iconClass;
    btn.appendChild(iconEl);

    document.body.appendChild(btn);

    var btnTicking = false;
    window.addEventListener('scroll', function () {
      if (!btnTicking) {
        requestAnimationFrame(function () {
          btn.classList.toggle('visible', window.scrollY > 300);
          btnTicking = false;
        });
        btnTicking = true;
      }
    });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (snowEnabled) {
    var density = forumAttribute('timeOfMagicSnowDensity') || 'medium';
    var count = snowCounts[density] || 10;
    createSnowflakes(count);
  }

  if (clickSparkEnabled) {
    createClickSpark();
  }
});
