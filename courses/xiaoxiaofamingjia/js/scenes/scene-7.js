/* ============================================================
   scene-7.js — 总结再见：关键词轮播 + 歌谣逐行高亮 + 彩带
   ============================================================ */
(function (global) {
  "use strict";
  var App = global.App;

  var kwIds = ["s7-kw1", "s7-kw2", "s7-kw3", "s7-kw4"];
  var lyrEls = App.$all("#s7-lyric .lyr");
  var kwTimer = null, lyrTimer = null;
  var kwIdx = 0, lyrIdx = 0;

  function start() {
    stop();
    // 关键词轮播（仅视觉动画，不自动发声）
    kwTimer = setInterval(function () {
      kwIdx = (kwIdx + 1) % kwIds.length;
      setKw(kwIdx);
    }, 1800);
    // 歌谣逐行（仅视觉高亮，不自动发声）
    lyrTimer = setInterval(function () {
      lyrIdx = (lyrIdx + 1) % lyrEls.length;
      setLyr(lyrIdx);
    }, 2200);
  }

  function stop() {
    clearInterval(kwTimer);
    clearInterval(lyrTimer);
    kwTimer = lyrTimer = null;
  }

  function setKw(i) {
    kwIds.forEach(function (id, idx) {
      App.$("#" + id).classList.toggle("is-active", idx === i);
    });
  }
  function setLyr(i) {
    lyrEls.forEach(function (el, idx) {
      el.classList.toggle("is-active", idx === i);
    });
  }

  function show() {
    kwIdx = 0; lyrIdx = 0;
    setKw(0); setLyr(0);
    start();
  }
  function replay() { show(); }

  // 触摸撒彩带
  document.addEventListener("pointerup", function (e) {
    if (e.target.closest(".cc-topbar, .cc-controls, .cc-teacherbar, .prog-dot, .btn")) return;
    var scene = document.querySelector("#scene-7");
    if (scene && scene.classList.contains("is-active")) {
      App.Sound.cheer();
      App.burstConfetti(App.$("#s7-confetti"), 30);
    }
  });

  App.Scenes[7] = { show: show, replay: replay };

})(window);
