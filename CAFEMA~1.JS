document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  var forms = document.querySelectorAll(".contact-form");
  forms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector("button[type=submit]");
      var original = btn.textContent;
      btn.textContent = "ส่งข้อความเรียบร้อยแล้ว ✓";
      form.reset();
      setTimeout(function () {
        btn.textContent = original;
      }, 3000);
    });
  });

  /* ---- ambient lofi music toggle ---- */
  var musicBtn = document.querySelector(".music-toggle");
  if (musicBtn) {
    var ctx = null;
    var isPlaying = false;
    var scheduleTimer = null;
    var notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
    var step = 0;

    function playNote(freq, time, dur, gainVal, type) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = type || "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(gainVal, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + dur + 0.05);
    }

    function scheduleLoop() {
      var now = ctx.currentTime;
      playNote(110, now, 1.6, 0.09, "sine");
      if (step % 2 === 0) {
        var n = notes[Math.floor(Math.random() * notes.length)];
        playNote(n, now + 0.2, 1.1, 0.05, "triangle");
      }
      step++;
      scheduleTimer = setTimeout(scheduleLoop, 1600);
    }

    musicBtn.addEventListener("click", function () {
      if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (!isPlaying) {
        if (ctx.state === "suspended") ctx.resume();
        step = 0;
        scheduleLoop();
        isPlaying = true;
        musicBtn.classList.add("playing");
        musicBtn.setAttribute("aria-label", "ปิดเสียงเพลง");
        musicBtn.textContent = "♪";
      } else {
        clearTimeout(scheduleTimer);
        isPlaying = false;
        musicBtn.classList.remove("playing");
        musicBtn.setAttribute("aria-label", "เปิดเสียงเพลง");
        musicBtn.textContent = "♫";
      }
    });
  }
});
