/* Polar Ar Condicionado Automotivo: comportamento compartilhado entre as páginas. */
(function () {
  "use strict";

  var WHATSAPP = "5519971567104";

  /* ---------- menu no celular ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("menu");
  var header = document.querySelector(".site-header");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Fechar" : "Menu";
      if (header) menu.style.setProperty("--menu-top", header.offsetHeight + "px");
      menu.classList.toggle("is-open", open);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Menu";
        toggle.focus();
      }
    });
  }

  /* ---------- horário de funcionamento (fuso de São Paulo) ---------- */
  // minutos desde 00:00; domingo = 0
  var HOURS = {
    0: null,
    1: [450, 1080], 2: [450, 1080], 3: [450, 1080], 4: [450, 1080], 5: [450, 1080],
    6: [480, 720]
  };
  var DAY_NAMES = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

  function fmt(min) {
    var h = Math.floor(min / 60), m = min % 60;
    return h + "h" + (m ? String(m).padStart(2, "0") : "");
  }

  function nowInSaoPaulo() {
    try {
      var parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Sao_Paulo",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
      }).formatToParts(new Date());
      var map = {};
      parts.forEach(function (p) { map[p.type] = p.value; });
      var day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(map.weekday);
      return { day: day, min: parseInt(map.hour, 10) * 60 + parseInt(map.minute, 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
    }
  }

  function status(now) {
    var today = HOURS[now.day];
    if (today && now.min >= today[0] && now.min < today[1]) {
      return { open: true, text: "Aberto agora. Fecha às " + fmt(today[1]) + "." };
    }
    if (today && now.min < today[0]) {
      return { open: false, text: "Fechado agora. Abre hoje às " + fmt(today[0]) + "." };
    }
    for (var i = 1; i <= 7; i++) {
      var d = (now.day + i) % 7;
      if (HOURS[d]) {
        var when = i === 1 ? "amanhã" : DAY_NAMES[d];
        return { open: false, text: "Fechado agora. Abre " + when + " às " + fmt(HOURS[d][0]) + "." };
      }
    }
    return { open: false, text: "Fechado agora." };
  }

  var now = nowInSaoPaulo();
  var st = status(now);
  document.querySelectorAll("[data-open-status]").forEach(function (node) {
    node.textContent = st.text;
    node.setAttribute("data-state", st.open ? "open" : "closed");
    node.hidden = false;
  });
  document.querySelectorAll("[data-day]").forEach(function (row) {
    var days = row.getAttribute("data-day").split(",").map(Number);
    if (days.indexOf(now.day) !== -1) row.classList.add("is-today");
  });

  /* ---------- ano no rodapé ---------- */
  document.querySelectorAll("[data-year]").forEach(function (n) {
    n.textContent = String(new Date().getFullYear());
  });

  /* ---------- mapa: só carrega o Google Maps quando a pessoa pede ---------- */
  document.querySelectorAll("[data-load-map]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var box = btn.closest(".map");
      if (!box) return;
      var frame = document.createElement("iframe");
      frame.src = btn.getAttribute("data-load-map");
      frame.title = "Mapa: Polar Ar Condicionado Automotivo, Rua dos Indaiás, 1371, Indaiatuba";
      frame.loading = "lazy";
      frame.referrerPolicy = "no-referrer-when-downgrade";
      box.innerHTML = "";
      box.appendChild(frame);
      frame.focus();
    });
  });

  /* ---------- formulário que monta a mensagem do WhatsApp ---------- */
  var form = document.getElementById("orcamento");
  if (form) {
    var out = document.getElementById("mensagem-preview");
    var send = document.getElementById("enviar-whatsapp");

    var compose = function () {
      var nome = form.elements.nome.value.trim();
      var carro = form.elements.carro.value.trim();
      var problema = form.elements.problema.value;
      var detalhes = form.elements.detalhes.value.trim();
      var lines = ["Olá, Polar!" + (nome ? " Meu nome é " + nome + "." : "")];
      if (carro) lines.push("Carro: " + carro + ".");
      if (problema) lines.push("O que está acontecendo: " + problema + ".");
      if (detalhes) lines.push(detalhes);
      lines.push("Gostaria de um orçamento.");
      return lines.join("\n");
    };

    var update = function () {
      var msg = compose();
      if (out) out.textContent = msg;
      if (send) send.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);
    };

    form.addEventListener("input", update);
    form.addEventListener("change", update);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      update();
      if (send) send.click();
    });
    update();
  }
})();
