/* ============================================================
   scene-2.js — 故事导入：动画小剧场《小熊的烦恼》4幕状态机
   ============================================================ */
(function (global) {
  "use strict";
  var App = global.App;

  var CAPTIONS = [
    "小熊的玩具滚到床底下啦！",
    "小熊弯下腰——可是够不着！",
    "小创登场：我来帮你！",
    "神奇的手臂伸出来——拿到啦！",
    "小创问：遇到困难，找谁帮忙呀？",
    "答对啦！请机器人小创帮忙，真聪明！"
  ];
  var panel = 0;
  var toyEl, bearBody, robotEl, sparkEl, captionEl, quizEl;

  function els() {
    toyEl = App.$("#s2-toy");
    bearBody = App.$("#s2-bear .bear-body");
    robotEl = App.$("#s2-robot");
    sparkEl = App.$("#s2-spark");
    captionEl = App.$("#s2-caption");
    quizEl = App.$("#s2-quiz");
  }

  function setToy(x) { toyEl.style.transform = "translate(" + x + "px,360px)"; }
  function setRobot(shown) {
    robotEl.style.opacity = shown ? "1" : "0";
    robotEl.style.transform = shown ? "translate(520px,300px) scale(1.6)" : "translate(620px,300px) scale(1.6)";
  }

  /* 复位到第 0 幕 */
  function reset() {
    panel = 0;
    setToy(420);
    bearBody.style.transform = "rotate(0deg)";
    setRobot(false);
    sparkEl.style.opacity = "0";
    quizEl.classList.add("is-hidden");
    render();
  }

  function render() {
    captionEl.textContent = CAPTIONS[panel];
    if (panel === 0) { setToy(420); bearBody.style.transform = "rotate(0deg)"; setRobot(false); sparkEl.style.opacity = "0"; }
    if (panel === 1) { setToy(650); bearBody.style.transform = "rotate(-14deg)"; }
    if (panel === 2) { setRobot(true); }
    if (panel === 3) { sparkEl.style.opacity = "1"; setToy(560); setRobot(true); bearBody.style.transform = "rotate(6deg)"; }
    if (panel === 4) { quizEl.classList.remove("is-hidden"); }
    if (panel === 5) { quizEl.classList.add("is-hidden"); App.burstConfetti(App.$("#scene-2"), 30); }
  }

  function show() { els(); reset(); }
  function next() {
    if (panel < 5) {
      panel++;
      render();
      App.Sound.ding();
      if (panel === 3 || panel === 5) App.Sound.reward();
    } else {
      App.toast("已经是最后一幕啦");
      App.Sound.hint();
    }
  }
  function prev() {
    if (panel > 0) {
      panel--;
      render();
      App.Sound.hint();
    } else {
      App.toast("这是第一幕，点重播再看一遍");
      App.Sound.hint();
    }
  }

  App.Scenes[2] = { show: show, replay: reset, next: next, prev: prev };
  App.onTap(App.$("#s2-next"), next);
  App.onTap(App.$("#s2-prev"), prev);
  App.onTap(App.$("#s2-replay"), function () { reset(); App.Sound.ding(); });

  // 猜一猜互动：第 5 幕问答
  App.$all("#s2-quiz .quiz-opt").forEach(function (opt) {
    App.onTap(opt, function () {
      if (opt.getAttribute("data-ok") === "1") {
        panel = 5;
        render();
        App.Sound.reward();
      } else {
        App.Sound.hint();
        App.toast("没关系，再想一想～谁最爱帮忙呀？");
      }
    });
  });

})(window);
