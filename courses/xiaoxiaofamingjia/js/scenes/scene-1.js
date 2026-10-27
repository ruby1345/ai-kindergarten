/* ============================================================
   scene-1.js — 开场热身三步走：
   ① 小创自我介绍 ② 介绍今日内容 ③ 热身小游戏
   ============================================================ */
(function (global) {
  "use strict";
  var App = global.App;

  var STEPS = ["s1-step1", "s1-step2", "s1-step3"];
  var picked = false;

  function setStep(n) {
    STEPS.forEach(function (id, i) {
      App.$("#" + id).classList.toggle("is-hidden", i !== n - 1);
      var dot = App.$all("#s1-steps .step-dot")[i];
      if (dot) dot.classList.toggle("is-cur", i === n - 1);
    });
  }

  // 第一步 → 第二步：认识小创
  App.onTap(App.$("#s1-go1"), function () {
    App.Sound.ding();
    if (App.Speak) App.Speak.say("你好，我是机器人小创");
    setStep(2);
  });

  // 第二步 → 第三步：知道今天学什么
  App.onTap(App.$("#s1-go2"), function () {
    App.Sound.ding();
    setStep(3);
  });

  // 第三步：热身小游戏——点愿望机器
  App.$all("#s1-wishes .wish-pick-btn").forEach(function (b) {
    App.onTap(b, function () {
      if (picked) return;
      picked = true;
      App.Sound.reward();
      App.burstConfetti(App.$("#scene-1"), 30);
      App.$("#s1-praise").classList.remove("is-hidden");
      App.$all("#s1-wishes .wish-pick-btn").forEach(function (x) { x.classList.add("is-dim"); });
      b.classList.add("is-picked");
    });
  });

  function show() {
    picked = false;
    App.$("#s1-praise").classList.add("is-hidden");
    App.$all("#s1-wishes .wish-pick-btn").forEach(function (x) { x.classList.remove("is-dim", "is-picked"); });
    setStep(1);
  }

  App.Scenes[1] = { show: show, replay: show };
})(window);
