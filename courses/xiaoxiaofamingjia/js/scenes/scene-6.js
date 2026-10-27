/* ============================================================
   scene-6.js — 分享展示：颁发发明勋章 + 掌声彩带 + 荣誉墙
   ============================================================ */
(function (global) {
  "use strict";
  var App = global.App;

  var counter = 0;

  function show() {
    hideMedal();
  }

  function hideMedal() {
    App.$("#s6-medal").classList.remove("is-show");
    App.$("#s6-rays").classList.remove("is-show");
    App.$("#s6-awardee").textContent = "";
  }

  function award() {
    counter++;
    var input = App.$("#s6-name");
    var name = (input.value || "").trim() || ("发明家 " + counter + " 号");

    hideMedal();
    void App.$("#s6-medal").offsetWidth;
    App.$("#s6-medal").classList.add("is-show");
    App.$("#s6-rays").classList.add("is-show");
    App.$("#s6-awardee").textContent = name;

    App.Sound.clap(4);
    App.Sound.reward();
    App.burstConfetti(App.$("#scene-6"), 50);

    var wall = App.$("#s6-wall");
    var chip = document.createElement("span");
    chip.className = "honor-name";
    chip.textContent = name;
    wall.appendChild(chip);

    input.value = "";
  }

  App.onTap(App.$("#s6-award"), award);
  // 回车快速颁奖
  App.$("#s6-name").addEventListener("keydown", function (e) {
    if (e.key === "Enter") award();
  });

  App.Scenes[6] = { show: show, replay: award };

})(window);
