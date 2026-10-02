/* Polar Ar Condicionado Automotivo: comportamento compartilhado entre as páginas. */
(function () {
  "use strict";

  var WHATSAPP = "5519971567104";

  function waLink(msg) {
    return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);
  }

  // abre o WhatsApp numa aba nova a partir de um clique/envio da pessoa
  function openWhatsApp(msg) {
    var a = document.createElement("a");
    a.href = waLink(msg);
    a.target = "_blank";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  /* ---------- menu flutuante ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("menu");
  if (toggle && menu) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      menu.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (menu.classList.contains("is-open") && !e.target.closest(".nav-pill")) setOpen(false);
    });
  }

  var onScroll = function () { document.body.classList.toggle("is-scrolled", window.scrollY > 12); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

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
        timeZone: "America/Sao_Paulo", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
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
      return { open: true, text: "Aberto agora, fecha às " + fmt(today[1]) };
    }
    if (today && now.min < today[0]) {
      return { open: false, text: "Fechado, abre hoje às " + fmt(today[0]) };
    }
    for (var i = 1; i <= 7; i++) {
      var d = (now.day + i) % 7;
      if (HOURS[d]) {
        var when = i === 1 ? "amanhã" : DAY_NAMES[d];
        return { open: false, text: "Fechado, abre " + when + " às " + fmt(HOURS[d][0]) };
      }
    }
    return { open: false, text: "Fechado" };
  }

  var now = nowInSaoPaulo();
  var st = status(now);
  document.querySelectorAll("[data-open-status]").forEach(function (node) {
    var label = node.querySelector("[data-status-text]") || node;
    label.textContent = st.text;
    node.setAttribute("data-state", st.open ? "open" : "closed");
    node.hidden = false;
  });
  document.querySelectorAll("[data-day]").forEach(function (row) {
    var days = row.getAttribute("data-day").split(",").map(Number);
    if (days.indexOf(now.day) !== -1) row.classList.add("is-today");
  });

  document.querySelectorAll("[data-year]").forEach(function (n) {
    n.textContent = String(new Date().getFullYear());
  });

  /* ---------- barra de agendamento (página inicial) ---------- */
  var quick = document.getElementById("agenda-rapida");
  if (quick) {
    var tabs = document.querySelectorAll(".quick-tab");
    var motivo = tabs.length ? tabs[0].getAttribute("data-motivo") : "";
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.setAttribute("aria-pressed", String(t === tab)); });
        motivo = tab.getAttribute("data-motivo");
      });
    });

    var dia = quick.elements.dia;
    if (dia) {
      var t = new Date();
      dia.min = t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0");
    }

    quick.addEventListener("submit", function (e) {
      e.preventDefault();
      var nome = quick.elements.nome.value.trim();
      var carro = quick.elements.carro.value.trim();
      var periodo = quick.elements.periodo.value;
      var lines = ["Olá, Polar!" + (nome ? " Meu nome é " + nome + "." : "")];
      if (carro) lines.push("Carro: " + carro + ".");
      if (motivo) lines.push("Motivo: " + motivo + ".");
      if (dia && dia.value) {
        var parts = dia.value.split("-");
        var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        lines.push("Gostaria de agendar para " + DAY_NAMES[d.getDay()] + ", " + parts[2] + "/" + parts[1] + ", " + periodo + ".");
      } else {
        lines.push("Gostaria de agendar um horário " + periodo + ".");
      }
      openWhatsApp(lines.join("\n"));
    });
  }

  /* ---------- orçamento rápido no rodapé ---------- */
  document.querySelectorAll("[data-quote-form]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var carro = f.elements.carro.value.trim();
      openWhatsApp("Olá, Polar! Gostaria de um orçamento para o ar-condicionado" + (carro ? " do meu " + carro : " do meu carro") + ".");
    });
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

  /* ---------- formulário de contato: monta a mensagem do WhatsApp ---------- */
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
      if (send) send.href = waLink(msg);
    };

    form.addEventListener("input", update);
    form.addEventListener("change", update);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      update();
      openWhatsApp(compose());
    });
    update();
  }
})();
