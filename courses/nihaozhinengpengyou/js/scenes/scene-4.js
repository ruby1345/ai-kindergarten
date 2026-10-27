/* ============================================================
   scene-4.js — 「请帮我…」礼貌句游戏（第二节）
   选词卡拼礼貌句「你好，请帮我___，谢谢！」+ 整句朗读
   ============================================================ */
(function (global) {
  "use strict";
  var App = global.App;

  var WORDS = [
    { w: "拿玩具", icon: "🧸" },
    { w: "浇花", icon: "🌸" },
    { w: "收拾积木", icon: "🧱" },
    { w: "扫地", icon: "🧹" },
    { w: "拿球", icon: "🏀" },
    { w: "开灯", icon: "💡" },
    { w: "讲故事", icon: "📖" },
    { w: "陪我玩", icon: "🎲" }
  ];

  var blankEl = App.$("#s4-blank");
  var roundsEl = App.$("#s4-rounds");
  var cardsEl = App.$("#s4-cards");
  var gradeEl = App.$("#s4-grade");
  var starEls = App.$all("#s4-stars .star");
  var round = 1;
  var starCount = 0;
  var locked = false;

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = (Math.random() * (i + 1)) | 0;
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function renderStars() {
    starEls.forEach(function (s, i) {
      s.textContent = i < starCount ? "★" : "☆";
      s.classList.toggle("is-got", i < starCount);
    });
  }

  function buildCards() {
    var pool = shuffle(WORDS.slice()).slice(0, 4);
    cardsEl.innerHTML = "";
    pool.forEach(function (item) {
      var b = document.createElement("button");
      b.className = "word-card speak";
      b.setAttribute("data-w", item.w);
      b.textContent = item.icon + " " + item.w;
      App.onTap(b, function () { pick(b, item.w); });
      cardsEl.appendChild(b);
    });
  }

  function pick(card, word) {
    if (locked) return;
    locked = true;
    blankEl.textContent = word;
    // 3-4 岁不识字：整句朗读完整礼貌句
    if (App.Speak) App.Speak.say("你好，请帮我" + word + "，谢谢！");
    App.$all("#s4-cards .word-card").forEach(function (c) {
      c.classList.toggle("is-picked", c === card);
    });
    var robot = App.$("#scene-4 .robot-wrap--sm");
    robot.classList.remove("is-bounce");
    void robot.offsetWidth;
    robot.classList.add("is-bounce");

    starCount++;
    renderStars();
    if (gradeEl) gradeEl.textContent = "真有礼貌！你好，请帮我" + word + "，谢谢！";
    if (starCount >= 3) {
      App.Sound.cheer();
      App.burstConfetti(App.$("#scene-4"), 60);
      App.toast("礼貌小达人！集满 3 颗星啦！");
    } else {
      App.Sound.cheer();
      App.burstConfetti(App.$("#scene-4"), 40);
    }
  }

  function show() {
    round = 1;
    starCount = 0;
    locked = false;
    blankEl.textContent = "____";
    roundsEl.textContent = "第 " + round + " 轮";
    if (gradeEl) gradeEl.textContent = "";
    renderStars();
    buildCards();
  }

  App.onTap(App.$("#s4-reset"), function () {
    round++;
    locked = false;
    blankEl.textContent = "____";
    roundsEl.textContent = "第 " + round + " 轮";
    if (gradeEl) gradeEl.textContent = "";
    buildCards();
    App.Sound.ding();
    App.toast("准备好，下一位礼貌小达人来啦！");
  });

  App.Scenes[4] = { show: show, replay: show };

})(window);