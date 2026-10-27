/* ============================================================
   scene-3.js — 认识AI：触摸点选指令卡片，小创执行 + 奖励
   ============================================================ */
(function (global) {
  "use strict";
  var App = global.App;

  var robotWrap = App.$("#scene-3 .robot-wrap--md");
  var sparkle = App.$("#s3-sparkle");
  var praise = App.$("#s3-praise");
  var lineEl = App.$("#s3-line");
  var cardsEl = App.$("#s3-cards");
  var detectiveEl = App.$("#s3-detective");
  var busy = false;
  var doneCmds = [];

  function show() {
    lineEl.textContent = "小创，请帮我：点一点下面的卡片吧！";
    doneCmds = [];
    App.$all("#s3-cards .cmd-card").forEach(function (c) { c.classList.remove("is-picked"); });
    cardsEl.classList.remove("is-faded");
    detectiveEl.classList.add("is-hidden");
    sparkle.classList.remove("is-show");
  }

  function showDetective() {
    cardsEl.classList.add("is-faded");
    detectiveEl.classList.remove("is-hidden");
    lineEl.textContent = "你真棒！来做个小侦探挑战吧！";
    App.Sound.ding();
  }

  function trigger(card) {
    if (busy) return;
    busy = true;
    var cmd = card.getAttribute("data-cmd");

    App.$all("#s3-cards .cmd-card").forEach(function (c) { c.classList.remove("is-picked"); });
    card.classList.add("is-picked");
    lineEl.textContent = "小创，请帮我" + cmd + "！";

    // 小创执行 + 特效
    robotWrap.classList.remove("is-bounce");
    void robotWrap.offsetWidth;
    robotWrap.classList.add("is-bounce");
    sparkle.classList.remove("is-show");
    void sparkle.offsetWidth;
    sparkle.classList.add("is-show");
    praise.classList.remove("is-show");
    void praise.offsetWidth;
    praise.classList.add("is-show");

    App.Sound.reward();
    App.burstConfetti(App.$("#scene-3"), 26);

    if (doneCmds.indexOf(cmd) === -1) doneCmds.push(cmd);
    if (doneCmds.length >= 4) {
      setTimeout(function () {
        card.classList.remove("is-picked");
        busy = false;
        showDetective();
      }, 1600);
      return;
    }

    setTimeout(function () {
      card.classList.remove("is-picked");
      busy = false;
    }, 2000);
  }

  App.$all("#s3-cards .cmd-card").forEach(function (card) {
    App.onTap(card, function () {
      App.Sound.babble();
      trigger(card);
    });
  });

  // AI 小侦探挑战：谁会听指令帮忙？
  App.$all("#s3-detective .detective-opt").forEach(function (opt) {
    App.onTap(opt, function () {
      if (opt.getAttribute("data-ok") === "1") {
        App.Sound.reward();
        App.burstConfetti(App.$("#scene-3"), 44);
        detectiveEl.classList.add("is-hidden");
        lineEl.textContent = "答对啦！会听指令帮忙的就是——AI！";
      } else {
        App.Sound.hint();
        App.toast("再想一想：谁会眨眼睛、听指令做事呀？");
      }
    });
  });

  App.Scenes[3] = { show: show, replay: show };

})(window);
