/* ============================================================
   scene-5.js — 发明创作：灵感墙漂浮泡泡，触摸爆星光+提示词
   ============================================================ */
(function (global) {
  "use strict";
  var App = global.App;

  var CARDS = [
    { icon: "✈️", word: "会飞" },
    { icon: "🌟", word: "会发光" },
    { icon: "🍳", word: "会做饭" },
    { icon: "🧹", word: "会扫地" },
    { icon: "🌈", word: "会变彩虹" },
    { icon: "🎵", word: "会唱歌" },
    { icon: "📦", word: "会整理" },
    { icon: "🎲", word: "会陪我玩" }
  ];
  var lastIdea = "";

  function show() {
    var box = App.$("#s5-box");
    box.innerHTML = "";
    CARDS.forEach(function (idea) {
      var card = document.createElement("button");
      card.className = "treasure-card";
      card.setAttribute("aria-label", "翻开卡片，看看是什么发明");
      card.innerHTML =
        '<span class="tc-face tc-back" aria-hidden="true">🎁</span>' +
        '<span class="tc-face tc-front" aria-hidden="true"><span class="tc-icon">' + idea.icon +
        '</span><span class="tc-word">' + idea.word + '</span></span>';
      App.onTap(card, function () {
        openCard(card, idea.word);
      });
      box.appendChild(card);
    });
  }

  function openCard(card, word) {
    if (card.classList.contains("is-open")) return;
    card.classList.add("is-open");
    lastIdea = word;
    App.Sound.reward();
    App.burstConfetti(App.$("#scene-5"), 16);

    var ideaCard = App.$("#s5-idea");
    ideaCard.textContent = word;
    ideaCard.classList.remove("is-show");
    void ideaCard.offsetWidth;
    ideaCard.classList.add("is-show");
  }

  // 发明命名：贴上灵感墙
  var wallEl = App.$("#s5-wall");
  App.onTap(App.$("#s5-save"), function () {
    var nameInput = App.$("#s5-name");
    var name = (nameInput.value || "我的发明").trim();
    var chip = document.createElement("span");
    chip.className = "wall-chip";
    chip.textContent = (lastIdea || "会飞") + " · " + name;
    wallEl.appendChild(chip);
    nameInput.value = "";
    App.Sound.ding();
    App.burstConfetti(App.$("#scene-5"), 14);
    App.toast("贴上啦！你的发明上墙啦！");
  });

  App.Scenes[5] = { show: show, replay: show };

})(window);
