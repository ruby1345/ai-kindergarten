/* ============================================================
   scene-3.js — 认识礼貌指令「你好/请帮我…/谢谢」
   点卡即朗读该指令；每点一张小创鼓掌 + 星星
   ============================================================ */
(function (global) {
  "use strict";
  var App = global.App;

  var COUNT = 0;
  var MAX = 3;

  var cards = App.$all("#s3-cards .polite-card");
  var resultEl = App.$("#s3-result");
  var starEls = App.$all("#s3-stars .star");

  function renderStars() {
    starEls.forEach(function (s, i) {
      s.textContent = i < COUNT ? "★" : "☆";
      s.classList.toggle("is-got", i < COUNT);
    });
  }

  cards.forEach(function (b) {
    App.onTap(b, function () {
      var w = b.getAttribute("data-w") || b.textContent;
      if (App.Speak) App.Speak.say(w);
      App.Sound.pop();
      App.burstConfetti(App.$("#scene-3"), 12);
      var robot = App.$("#scene-3 .robot-wrap--sm");
      if (robot) {
        robot.classList.remove("is-bounce");
        void robot.offsetWidth;
        robot.classList.add("is-bounce");
      }
      // 每点一张＋一颗星，集满鼓励
      COUNT = Math.min(COUNT + 1, MAX);
      renderStars();
      if (COUNT >= MAX) {
        App.Sound.cheer();
        App.burstConfetti(App.$("#scene-3"), 40);
        resultEl.textContent = "你真有礼貌，小创都好喜欢！";
        if (App.Speak) App.Speak.say("你真有礼貌，小创都好喜欢！");
      }
    });
  });

  function show() {
    COUNT = 0;
    renderStars();
    resultEl.textContent = "";
  }
  function replay() { show(); }

  App.Scenes[3] = { show: show, replay: replay };
})(window);