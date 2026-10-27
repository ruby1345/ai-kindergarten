/* ============================================================
   scene-9.js — 动画观影：5 集连续播放，结束后不弹问题
   ============================================================ */
(function (global) {
  "use strict";
  var App = global.App;

  var EPS = [
    "videos/xiaochuang-intro.mp4",
    "videos/bear-story.mp4",
    "videos/ai-helping.mp4",
    "videos/xiaochuang-adventure-1.mp4",
    "videos/xiaochuang-adventure-2.mp4"
  ];
  var EPS_NAMES = ["自我介绍", "小熊的烦恼", "听指令帮忙", "新伙伴", "飞向彩虹"];
  var v9 = App.$("#s9-video"), mask9 = App.$("#s9-mask"), play9 = App.$("#s9-play"),
      prog9 = App.$("#s9-progress"), chap9 = App.$("#s9-chapter"), eps9 = App.$("#s9-eps"),
      next9 = App.$("#s9-next");
  var vIdx = 0;

  function setEps9() {
    eps9.innerHTML = "";
    for (var i = 0; i < EPS.length; i++) {
      var d = document.createElement("button");
      d.className = "ep-dot" + (i === vIdx ? " is-cur" : "");
      d.setAttribute("role", "tab");
      d.addEventListener("click", (function (k) {
        return function () { v9.pause(); load9(k); v9.play().catch(function () {}); };
      })(i));
      eps9.appendChild(d);
    }
  }

  function load9(i) {
    vIdx = i;
    v9.src = EPS[i];
    chap9.textContent = "第 " + (i + 1) + " 集 · " + EPS_NAMES[i];
    chap9.classList.remove("is-hidden");
    prog9.style.width = "0%";
    setEps9();
  }

  function resetWatch() {
    v9.pause();
    load9(0);
    mask9.classList.remove("is-hidden");
    next9.classList.add("is-hidden");
  }

  v9.addEventListener("timeupdate", function () {
    if (v9.duration) prog9.style.width = (v9.currentTime / v9.duration * 100) + "%";
  });

  // 每集结束：暂停画面，显示「看下一集」按钮，由教师讲解后手动点击进入下一集
  v9.addEventListener("ended", function () {
    if (vIdx + 1 < EPS.length) {
      next9.textContent = "▶ 看下一集：" + EPS_NAMES[vIdx + 1];
      next9.classList.remove("is-hidden");
      App.Sound.ding();
    } else {
      next9.textContent = "▶ 动画看完啦，继续上课";
      next9.classList.remove("is-hidden");
      App.Sound.reward();
    }
  });

  // 手动进入下一集
  next9 && App.onTap(next9, function () {
    if (vIdx + 1 < EPS.length) {
      next9.classList.add("is-hidden");
      load9(vIdx + 1);
      v9.play().catch(function () {});
    } else {
      next9.classList.add("is-hidden");
      App.toast("动画看完啦！点击下方『下一环节』去回答问题吧～");
    }
  });

  play9 && App.onTap(play9, function () {
    v9.muted = false;
    v9.play().catch(function () {});
    mask9.classList.add("is-hidden");
    next9.classList.add("is-hidden");
  });

  function show() { resetWatch(); }
  function replay() { show(); }

  App.Scenes[9] = { show: show, replay: replay };

})(window);
