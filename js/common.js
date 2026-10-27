/* ============================================================
   common.js — 触摸工具 + Web Audio 音效合成 + 通用辅助
   ============================================================ */
(function (global) {
  "use strict";

  /* ---------- 触摸工具 ---------- */
  // 统一 pointer 事件绑定：触摸与鼠标都响应，无 300ms 延迟
  function onTap(el, handler) {
    if (!el) return;
    var startX = 0, startY = 0, moved = false;
    el.addEventListener("pointerdown", function (e) {
      moved = false;
      startX = e.clientX;
      startY = e.clientY;
    });
    el.addEventListener("pointerup", function (e) {
      var dx = e.clientX - startX, dy = e.clientY - startY;
      if (!moved && Math.abs(dx) < 12 && Math.abs(dy) < 12) {
        handler(e);
      }
    });
    el.addEventListener("pointermove", function (e) {
      if (Math.abs(e.clientX - startX) > 12 || Math.abs(e.clientY - startY) > 12) moved = true;
    });
  }

  /* ---------- Web Audio 音效合成 ---------- */
  // 零外部资源：全部由振荡器/噪声合成
  var Sound = (function () {
    var ctx = null, enabled = true;
    var masters = {};

    function ensure() {
      if (!ctx) {
        var AC = global.AudioContext || global.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        masters.sfx = ctx.createGain();
        masters.sfx.gain.value = 0.5;
        masters.sfx.connect(ctx.destination);
      }
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    }

    function tone(freq, dur, when, type, vol) {
      if (!enabled) return;
      var c = ensure();
      if (!c) return;
      var t = c.currentTime + (when || 0);
      var o = c.createOscillator();
      var g = c.createGain();
      o.type = type || "sine";
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol || 0.25, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(masters.sfx);
      o.start(t); o.stop(t + dur + 0.05);
    }

    function noise(dur, when, filterFreq, vol) {
      if (!enabled) return;
      var c = ensure();
      if (!c) return;
      var t = c.currentTime + (when || 0);
      var len = Math.max(1, Math.floor(c.sampleRate * dur));
      var buf = c.createBuffer(1, len, c.sampleRate);
      var data = buf.getChannelData(0);
      for (var i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      var src = c.createBufferSource();
      src.buffer = buf;
      var f = c.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.value = filterFreq || 2000;
      var g = c.createGain();
      g.gain.setValueAtTime(vol || 0.2, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(f); f.connect(g); g.connect(masters.sfx);
      src.start(t);
    }

    return {
      // 叮咚：两音上行
      ding: function () { tone(660, 0.18, 0, "sine", 0.25); tone(880, 0.28, 0.10, "sine", 0.25); },
      // 泡泡破裂
      pop: function () { noise(0.12, 0, 2600, 0.3); tone(500, 0.10, 0, "triangle", 0.18); },
      // 掌声（多次短噪声）
      clap: function (times) {
        var n = times || 3;
        for (var i = 0; i < n; i++) noise(0.08, i * 0.09, 1800, 0.28);
      },
      // 奖励上滑音
      reward: function () {
        [523, 659, 784, 1046].forEach(function (f, i) { tone(f, 0.22, i * 0.11, "triangle", 0.26); });
      },
      // 彩带/欢庆
      cheer: function () {
        for (var i = 0; i < 8; i++) tone(520 + i * 60, 0.14, i * 0.06, "triangle", 0.2);
        noise(0.5, 0, 3500, 0.15);
      },
      // 温柔提示音
      hint: function () { tone(523, 0.16, 0, "sine", 0.18); tone(392, 0.2, 0.12, "sine", 0.18); },
      // 角色语音感（短促圆润嘟声，模拟说话）
      babble: function () {
        var base = 300;
        for (var i = 0; i < 4; i++) tone(base + Math.random() * 120, 0.09, i * 0.12, "sine", 0.1);
      },
      setEnabled: function (v) { enabled = v; },
      isEnabled: function () { return enabled; },
      unlock: function () { ensure(); } // 首次触摸时解锁音频
    };
  })();

  /* ---------- DOM 辅助 ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function showEl(el) { el && el.classList.remove("is-hidden"); }
  function hideEl(el) { el && el.classList.add("is-hidden"); }

  // 简单防抖
  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(null, args); }, wait || 200);
    };
  }

  /* ---------- TTS 中文朗读（3-4 岁识字前的关键辅助） ---------- */
  // 用浏览器内置 speechSynthesis 朗读中文文本，无需外部件。点文字选项即出声。
  var Speak = (function () {
    var enabled = true;      // 默认开启；跟随音效开关联动
    var zhVoiceReady = false;

    function pickVoice() {
      var vs = global.speechSynthesis && global.speechSynthesis.getVoices();
      if (!vs || !vs.length) return null;
      var fallback = null;
      for (var i = 0; i < vs.length; i++) {
        var lan = (vs[i].lang || "").toLowerCase();
        if (lan.indexOf("zh") === 0) {
          fallback = vs[i];
          if (/中国|China|tem-hui|ting-ting|普通话/.test(vs[i].name + " " + vs[i].voiceURI)) return vs[i];
        }
      }
      return fallback;
    }
    function pickZhVoice() { return pickVoice(); }

    // 去掉 emoji 与装饰符号，保留中文/数字/常用标点
    function toSpeakText(t) {
      var s = String(t == null ? "" : t);
      s = s.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "");             // 双字节 emoji
      s = s.replace(/[\u2600-\u27BF\u2B00-\u2BFF\uFE0F\u2300-\u23FF]/g, ""); // 单字节 emoji
      s = s.replace(/\s+/g, " ").trim();
      return s;
    }

    function say(text) {
      if (!enabled || !global.speechSynthesis) return;
      var s = toSpeakText(text);
      if (!s) return;
      var u = new SpeechSynthesisUtterance(s);
      u.lang = "zh-CN";
      u.rate = 0.82;          // 放慢，适合幼儿
      u.pitch = 1.12;         // 稍高，更像"小创"的声音
      u.volume = 1;
      var v = pickVoice();
      if (v) u.voice = v;
      global.speechSynthesis.cancel(); // 打断上一次
      global.speechSynthesis.speak(u);
    }
    function stop() { if (global.speechSynthesis) global.speechSynthesis.cancel(); }

    // voices 异步加载，语音列表就绪后重取一次
    function init() {
      if (!global.speechSynthesis) return;
      var ensure = function () { zhVoiceReady = true; };
      if (global.speechSynthesis.getVoices().length) ensure();
      global.speechSynthesis.addEventListener("voiceschanged", ensure, { once: false });
    }
    init();

    return {
      say: say,
      stop: stop,
      pickVoice: pickVoice,
      isEnabled: function () { return enabled; },
      setEnabled: function (v) { enabled = v; if (!v) stop(); }
    };
  })();

  // 音效开关与 TTS 联动：音效开启时朗读也可用
  var _soundSet = Sound.setEnabled;
  Sound.setEnabled = function (v) {
    _soundSet.call(Sound, v);
    Speak.setEnabled(v);
  };

  global.App = global.App || {};
  global.App.onTap = onTap;
  global.App.Sound = Sound;
  global.App.Speak = Speak;
  global.App.$ = $;
  global.App.$all = $all;
  global.App.showEl = showEl;
  global.App.hideEl = hideEl;
  global.App.debounce = debounce;

  // 首次任意触摸解锁音频（iOS/Android 需要用户手势）
  document.addEventListener("pointerdown", function () { Sound.unlock(); }, { once: false });

  // 全局：所有文字选项一碰即朗读——3-4 岁孩子不识字也能听懂词汇
  document.addEventListener("pointerup", function (e) {
    var el = e.target;
    if (!el || !el.closest) return;
    var opt = el.closest(".qa-opt, .word-card, .treasure-card, .wish-pick-btn, .kw-badge, .speak, .polite-card, .greet-card, .hello-card");
    if (!opt) return;
    // 优先读 data-speak / data-w，其次子元素 .tc-word，最后取可见文本
    var w = opt.getAttribute("data-speak") || opt.getAttribute("data-w");
    if (!w && opt.querySelector) {
      var tw = opt.querySelector(".tc-word, .pw-word, .hv-word, .pt-word");
      if (tw) w = tw.textContent;
    }
    if (!w) w = opt.textContent;
    if (w) App.Speak.say(w);
  });
})(window);
