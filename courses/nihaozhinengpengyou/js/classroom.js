/* ============================================================
   classroom.js — 互动课件主控（第二节 · 你好智能朋友）
   场景状态机 / hash 路由 / 进度条 / 教师辅助条 / 彩带工具
   ============================================================ */
(function (global) {
  "use strict";
  var App = global.App;

  /* ---------- 场景配置（与教案保持一致） ---------- */
  var SCENES = [
    { id: 1, title: "开场热身", goal: "稳定情绪、认识小创、建立课堂约定", script: "你好你好！点「你好」跟小创、小兔、小花问好，跟读口令：请帮我要有礼貌。" },
    { id: 2, title: "动画小剧场", goal: "看圆圆学礼貌：先问好、再请求、后道谢", script: "逐幕点「看下一幕」推进 4 幕小剧场，帮圆圆把话说得有礼貌。" },
    { id: 3, title: "认识礼貌指令", goal: "知道智能朋友会听礼貌指令，学说「你好/请帮我/谢谢」", script: "触摸点选礼貌指令卡，小创执行 + 星星奖励，每个词都会发音。" },
    { id: 4, title: "礼貌句游戏", goal: "用「你好，请帮我___，谢谢！」说完整礼貌句", script: "选词卡拼礼貌句 + 彩带奖励，循环 3-4 轮：口述→点词卡→整句发声。" },
    { id: 5, title: "礼貌灵感", goal: "想出想说给智能朋友的礼貌请求", script: "大屏百宝箱翻开灵感词，幼儿纸笔作画或口述，巡回引导。" },
    { id: 6, title: "分享展示", goal: "介绍自己的礼貌请求，获得成就感", script: "上台用礼貌句介绍 → 颁发礼貌勋章 → 掌声彩带 → 名字上墙。" },
    { id: 7, title: "总结再见", goal: "回顾礼貌关键词，情绪收尾", script: "跟读歌谣：说你好、请帮我、说谢谢！触摸屏幕撒彩带。" }
  ];
  var TOTAL = SCENES.length;
  var currentIdx = 0;

  var progressEl = App.$("#ccProgress");
  var stageEl = App.$("#ccStage");
  var teacherBar = App.$("#ccTeacher");
  var tbTitle = App.$("#tbTitle");
  var tbGoal = App.$("#tbGoal");
  var tbScript = App.$("#tbScript");
  var toastEl = App.$("#ccToast");

  App.Scenes = App.Scenes || {};

  /* ---------- 彩带工具 ---------- */
  function burstConfetti(container, count) {
    if (!container) return;
    var colors = ["#7ED6B6", "#FFD97A", "#FF9E80", "#A3D8F4", "#C9B8F0", "#FFC7D1"];
    var n = count || 40;
    for (var i = 0; i < n; i++) {
      var p = document.createElement("span");
      p.className = "confetti-piece";
      var size = 8 + Math.random() * 12;
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.left = (Math.random() * 100) + "%";
      p.style.background = colors[(Math.random() * colors.length) | 0];
      p.style.animationDuration = (2.2 + Math.random() * 1.8) + "s";
      p.style.animationDelay = (Math.random() * 0.9) + "s";
      p.style.borderRadius = Math.random() > 0.5 ? "50%" : "4px";
      container.appendChild(p);
      (function (el) {
        setTimeout(function () { el.remove(); }, 4800);
      })(p);
    }
  }
  App.burstConfetti = burstConfetti;

  /* ---------- 轻提示 ---------- */
  var toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.remove("is-show");
    void toastEl.offsetWidth;
    toastEl.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-show"); }, 2100);
  }
  App.toast = toast;

  /* ---------- 进度条 ---------- */
  function renderProgress() {
    progressEl.innerHTML = "";
    SCENES.forEach(function (s, i) {
      var b = document.createElement("button");
      b.className = "prog-dot";
      b.textContent = i + 1;
      b.title = "环节 " + (i + 1) + " · " + s.title;
      b.setAttribute("aria-label", "环节 " + s.id + " " + s.title);
      if (i < currentIdx) b.classList.add("is-done");
      if (i === currentIdx) b.classList.add("is-current");
      b.addEventListener("click", function () { goTo(i); });
      progressEl.appendChild(b);
    });
  }

  /* ---------- 教师辅助条 ---------- */
  function renderTeacher() {
    var s = SCENES[currentIdx];
    tbTitle.textContent = "环节 " + (currentIdx + 1) + " · " + s.title;
    tbGoal.textContent = "目标：" + s.goal;
    tbScript.textContent = "话术速记：" + s.script;
  }

  /* ---------- 场景切换 ---------- */
  function goTo(i) {
    if (i < 0 || i >= TOTAL) return;
    currentIdx = i;
    App.$all("video").forEach(function (v) { v.pause(); });
    var scenes = App.$all(".scene");
    scenes.forEach(function (sc, idx) {
      sc.classList.remove("is-active");
      if (idx === i) sc.classList.add("is-active");
    });
    renderProgress();
    renderTeacher();
    var s = SCENES[i];
    global.location.hash = "scene-" + s.id;
    if (App.Scenes[s.id] && App.Scenes[s.id].show) App.Scenes[s.id].show();
  }

  function next() { goTo(Math.min(currentIdx + 1, TOTAL - 1)); }
  function prev() { goTo(Math.max(currentIdx - 1, 0)); }
  function replay() {
    var s = SCENES[currentIdx];
    if (App.Scenes[s.id] && App.Scenes[s.id].replay) App.Scenes[s.id].replay();
    else if (App.Scenes[s.id] && App.Scenes[s.id].show) App.Scenes[s.id].show();
    App.Sound.ding();
  }

  /* ---------- 音效开关 ---------- */
  var soundBtn = App.$("#ccSound");
  soundBtn.addEventListener("click", function () {
    var on = !App.Sound.isEnabled();
    App.Sound.setEnabled(on);
    soundBtn.textContent = on ? "🔊" : "🔇";
    App.toast(on ? "音效与朗读已开启" : "音效已关闭");
    if (on) App.Sound.ding();
  });

  /* ---------- 事件绑定 ---------- */
  App.onTap(App.$("#ccNext"), next);
  App.onTap(App.$("#ccPrev"), prev);
  App.onTap(App.$("#ccReplay"), replay);

  var tbOpen = false;
  App.onTap(App.$("#teacherbarToggle"), function () {
    tbOpen = !tbOpen;
    App.$("#teacherbarBody").classList.toggle("is-open", tbOpen);
  });

  /* ---------- 初始化与 hash 路由 ---------- */
  function parseHash() {
    var m = global.location.hash.match(/scene-(\d+)/);
    if (m) {
      var id = parseInt(m[1], 10);
      for (var i = 0; i < TOTAL; i++) {
        if (SCENES[i].id === id) { goTo(i); return; }
      }
    }
    goTo(0);
  }
  global.addEventListener("hashchange", parseHash);
  parseHash();

})(window);