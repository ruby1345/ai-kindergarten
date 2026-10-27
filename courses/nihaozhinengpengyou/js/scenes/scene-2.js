/* ============================================================
   scene-2.js — 动画小剧场《圆圆学礼貌》4 幕（内联 SVG）
   幕1 圆圆想请小创帮忙但不说话
   幕2 小创提醒「要先说你好」
   幕3 圆圆说「你好，请帮我拿玩具」
   幕4 圆圆说「谢谢」——大家一起有礼貌
   ============================================================ */
(function (global) {
  "use strict";
  var App = global.App;

  var ACT_CODE = ['A', 'B', 'C', 'D'];
  var ACT_SAY = [
    "圆圆心想，我要请小创帮忙拿玩具，可是……我该怎么说呢？",
    "小创笑着说：你好呀！想请我帮忙？先跟我说「你好」，再告诉我你要做什么噢！",
    "圆圆大声说：你好，请帮我拿玩具！小创一下子就把玩具递给她啦！",
    "圆圆开心地说：谢谢小创！嗨，大家记住了吗？先问好、再请求、后道谢，真有礼貌！"
  ];
  var act = 0;

  var stage = App.$("#s2-stage");
  var dotsEl = App.$("#s2-dots");
  var nextEl = App.$("#s2-next");

  /* 4 幕 SVG：小创(左) + 圆圆(右)快乐对话 */
  function svgActs(k) {
    var robot = '<g transform="translate(28,70) scale(0.55)"><use href="../../svg/xiaochuang.svg#xc-happy"/></g>';
    var bunny = {
      head: '<circle cx="150" cy="78" r="46" fill="#FFD9EC"/><circle cx="150" cy="22" r="20" fill="#FFE3F1"/><circle cx="132" cy="60" r="7" fill="#6B4A3A"/><circle cx="168" cy="60" r="7" fill="#6B4A3A"/><path d="M134 92 Q150 104 166 92" stroke="#6B4A3A" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="120" cy="72" r="8" fill="#FFB6D0"/><circle cx="180" cy="72" r="8" fill="#FFB6D0"/>',
      body: '<rect x="124" y="124" width="52" height="50" rx="20" fill="#FFD9EC"/>'
    };
    var bubble = '';
    if (k === 0) bubble = '<circle cx="205" cy="52" r="14" fill="#fff" stroke="#CBE9DC" stroke-width="3"/><circle cx="218" cy="38" r="8" fill="#fff" stroke="#CBE9DC" stroke-width="3"/><rect x="222" y="10" width="96" height="54" rx="16" fill="#fff" stroke="#CBE9DC" stroke-width="3"><animate attributeName="transform" dur="1s" repeatCount="indefinite" type="translate" values="0 0;0 -6;0 0"/></rect><text x="270" y="42" text-anchor="middle" font-size="15" fill="#5A7A8C">🙃 想说 🥺</text>';
    if (k === 1) bubble = '<rect x="210" y="12" width="150" height="56" rx="16" fill="#fff" stroke="#7ED6B6" stroke-width="3"><animate attributeName="transform" dur="1s" repeatCount="indefinite" type="translate" values="0 0;0 -6;0 0"/></rect><text x="285" y="46" text-anchor="middle" font-size="15" fill="#1A3A5C">先把「你好」说出来 😊</text>';
    if (k === 2) bubble = '<rect x="200" y="12" width="170" height="56" rx="16" fill="#fff" stroke="#FFD97A" stroke-width="3"><animate attributeName="transform" dur="1.2s" repeatCount="indefinite" type="translate" values="0 0;0 -6;0 0"/></rect><text x="285" y="46" text-anchor="middle" font-size="15" fill="#C2542C">你好，请帮我拿玩具！👍</text>';
    if (k === 3) bubble = '<rect x="200" y="12" width="170" height="56" rx="16" fill="#fff" stroke="#FF9E80" stroke-width="3"><animate attributeName="transform" dur="1.2s" repeatCount="indefinite" type="translate" values="0 0;0 -6;0 0"/></rect><text x="285" y="46" text-anchor="middle" font-size="15" fill="#C2542C">谢谢小创！🎉</text>';
    var sparkle = k === 3 ? '<g><text x="150" y="20" font-size="20">✨</text><text x="70" y="30" font-size="20">🎉</text><text x="235" y="30" font-size="20">🎉</text></g>' : "";
    return '<svg viewBox="0 0 380 210" width="100%" height="100%" style="background:#FDF8F0;border-radius:18px">' +
      '<rect width="380" height="210" fill="#FDF8F0"/>' + sparkle +
      robot + '<g>' + bunny.head + bunny.body + '</g>' + bubble +
      '</svg>';
  }

  function render() {
    if (!dotsEl) return;
    dotsEl.innerHTML = "";
    for (var i = 0; i < 4; i++) {
      var d = document.createElement("span");
      d.className = "stage-dot" + (i === act ? " is-cur" : "");
      dotsEl.appendChild(d);
    }
    if (stage) stage.innerHTML = svgActs(act);
    nextEl.textContent = (act < 3) ? "▶ 看下一幕" : "▶ 圆圆学会了，我们继续";
    if (App.Speak) App.Speak.say(ACT_SAY[act]);
  }

  App.onTap(nextEl, function () {
    act++;
    if (act >= 4) {
      App.Sound.cheer();
      App.burstConfetti(App.$("#scene-2"), 40);
      App.$("#s2-next").textContent = "🎉 真有礼貌！进入下一环节";
      if (App.Speak) App.Speak.say("圆圆学会有礼貌啦，你真棒");
      act = 0;
      return;
    }
    App.Sound.ding();
    render();
  });

  function show() { act = 0; render(); }
  function replay() { show(); }

  App.Scenes[2] = { show: show, replay: replay };
})(window);