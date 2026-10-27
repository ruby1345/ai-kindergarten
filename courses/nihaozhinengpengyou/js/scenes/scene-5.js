/* ============================================================
   scene-5.js — 聪明百宝箱（第二节）· 礼貌请求灵感墙
   翻开卡片即朗读灵感词，选定后贴上礼貌墙
   ============================================================ */
(function (global) {
  "use strict";
  var App = global.App;

  var CARDS = [
    { icon: "🧸", word: "拿球" },
    { icon: "🌸", word: "浇花" },
    { icon: "📖", word: "讲故事" },
    { icon: "🧹", word: "扫地" },
    { icon: "💡", word: "开灯" },
    { icon: "🎲", word: "陪我玩" }
  ];
  var lastIdea = "";

  function show() {
    var box = App.$("#s5-box");
    box.innerHTML = "";
    CARDS.forEach(function (idea) {
      var card = document.createElement("button");
      card.className = "treasure-card";
      card.setAttribute("aria-label", "翻开卡片，看看请智能朋友帮什么");
      card.setAttribute("data-speak", idea.word);
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
    if (App.Speak) App.Speak.say("你好，请帮我" + word + "，谢谢");
    App.burstConfetti(App.$("#scene-5"), 16);

    var ideaCard = App.$("#s5-idea");
    ideaCard.textContent = "请帮我" + word;
    ideaCard.classList.remove("is-show");
    void ideaCard.offsetWidth;
    ideaCard.classList.add("is-show");
  }

  // 贴上礼貌墙
  var wallEl = App.$("#s5-wall");
  App.onTap(App.$("#s5-save"), function () {
    var nameInput = App.$("#s5-name");
    var name = (nameInput.value || "小达人").trim();
    var chip = document.createElement("span");
    chip.className = "wall-chip speak";
    chip.setAttribute("data-speak", "你好，请帮我" + (lastIdea || "拿球") + "，谢谢");
    chip.textContent = "你好，请帮我" + (lastIdea || "拿球") + " · " + name;
    wallEl.appendChild(chip);
    nameInput.value = "";
    App.Sound.ding();
    App.burstConfetti(App.$("#scene-5"), 14);
    if (App.Speak) App.Speak.say("你好，请帮我" + (lastIdea || "拿球") + "，谢谢");
    App.toast("贴上啦！你的礼貌请求上墙啦！");
  });

  App.Scenes[5] = { show: show, replay: show };

})(window);