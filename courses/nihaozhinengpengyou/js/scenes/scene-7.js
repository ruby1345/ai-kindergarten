/* ============================================================
   scene-7.js — 总结再见：礼貌关键词轮播 + 歌谣 + 彩带
   关键词与歌谣触发时同步朗读（3-4 岁不识字也能听懂）
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
    setKw(0); setLyr(0);
    // 关键词轮播 + 同步朗读
    kwTimer = setInterval(function () {
      kwIdx = (kwIdx + 1) % kwIds.length;
      setKw(kwIdx);
      if (App.Speak) App.Speak.say(App.$("#" + kwIds[kwIdx]).textContent);
    }, 3200);
    // 歌谣逐行 + 同步朗读
    lyrTimer = setInterval(function () {
      lyrIdx = (lyrIdx + 1) % lyrEls.length;
      setLyr(lyrIdx);
      if (App.Speak) App.Speak.say(lyrEls[lyrIdx].textContent);
    }, 2600);
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
    if (App.Speak) App.Speak.say("说你好，请帮我，说谢谢，我就是礼貌小达人");
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