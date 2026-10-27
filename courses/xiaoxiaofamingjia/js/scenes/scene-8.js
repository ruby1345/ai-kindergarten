/* ============================================================
   scene-8.js — 提问互动：围绕 5 集动画的问答轮播
   每题：选项 + 自由想象；5 题答完彩带庆祝
   ============================================================ */
(function (global) {
  "use strict";
  var App = global.App;

  var QUESTIONS = [
    { tag: "第 1 集 · 自我介绍", q: "小创最爱做什么呢？", opts: ["帮小朋友的忙", "睡觉觉", "吃零食"], open: "你想让小创帮你做什么呀？" },
    { tag: "第 2 集 · 小熊的烦恼", q: "小熊的玩具放在哪里，它够不着呀？", opts: ["柜子顶上", "床底下", "桌子上面"], open: "谁会来帮小熊呢？" },
    { tag: "第 3 集 · 听指令帮忙", q: "视频里小创帮小朋友做了哪些事？", opts: ["拿玩具和浇花", "看电视", "吃冰淇淋"], open: "你还想教小创什么新本领？" },
    { tag: "第 4 集 · 新伙伴", q: "小创在森林里遇到了哪位新朋友？", opts: ["🐰 小兔子", "🦊 小狐狸", "🐢 小乌龟"], open: "小兔想和小创玩什么？" },
    { tag: "第 5 集 · 飞向彩虹", q: "小创和小兔子一起飞过了哪里呀？", opts: ["🌈 彩虹桥", "🏔️ 大山", "🌊 大海"], open: "彩虹桥那边藏着什么惊喜？" }
  ];

  var qi = 0, picked = false;

  var countEl = App.$("#s8-count"), barEl = App.$("#s8-bar"),
      tagEl = App.$("#s8-tag"), qEl = App.$("#s8-q"),
      optsEl = App.$("#s8-opts"), openinEl = App.$("#s8-openin"),
      cardEl = App.$("#s8-card"), doneEl = App.$("#s8-done");

  function render() {
    var it = QUESTIONS[qi];
    countEl.textContent = "第 " + (qi + 1) + " / 5 题";
    barEl.style.width = ((qi + 1) / 5 * 100) + "%";
    tagEl.textContent = "🎬 " + it.tag;
    qEl.textContent = it.q;
    openinEl.placeholder = it.open;
    optsEl.innerHTML = "";
    it.opts.forEach(function (o, i) {
      var b = document.createElement("button");
      b.className = "qa-opt";
      b.textContent = o;
      b.addEventListener("click", function () { pick(i, b); });
      optsEl.appendChild(b);
    });
  }

  function pick(i, btn) {
    if (picked) return;
    picked = true;
    App.Sound.reward();
    App.burstConfetti(App.$("#scene-8 .scene-inner"), 18);
    var btns = optsEl.children;
    for (var k = 0; k < btns.length; k++) btns[k].classList.add("is-dim");
    btn.classList.add("is-picked");
    setTimeout(next, 900);
  }

  function next() {
    picked = false;
    qi++;
    if (qi >= QUESTIONS.length) { finish(); return; }
    render();
  }

  function finish() {
    App.Sound.cheer();
    App.burstConfetti(App.$("#scene-8 .scene-inner"), 60);
    cardEl.classList.add("is-hidden");
    doneEl.classList.remove("is-hidden");
    countEl.textContent = "第 5 / 5 题";
    barEl.style.width = "100%";
  }

  // 自由想象提交
  document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "s8-openbtn") {
      var v = openinEl.value.trim();
      if (!v) { App.toast("先写一句话吧～"); return; }
      openinEl.value = "";
      App.Sound.clap(2);
      App.toast("🌟 " + v + "，真棒的想法！");
      if (!picked) { picked = true; setTimeout(next, 600); }
    }
  });

  function show() {
    qi = 0; picked = false;
    cardEl.classList.remove("is-hidden");
    doneEl.classList.add("is-hidden");
    render();
  }
  function replay() { show(); }

  App.Scenes[8] = { show: show, replay: replay };

})(window);
