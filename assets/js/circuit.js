/*
 * Diagrama do circuito do ar-condicionado.
 * Desenha o SVG dentro de qualquer elemento com [data-circuit]: uma versão
 * horizontal (telas largas) e uma vertical (celular); o CSS mostra uma delas.
 * data-link-base define para onde cada peça aponta
 * (ex.: "servicos.html" na página inicial, "" na própria página de serviços).
 * Vermelho = lado de alta pressão, azul = lado de baixa (cores dos manômetros).
 */
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";

  var PARTS = {
    compressor: { n: 1, name: ["Compressor"], sub: "comprime o gás", anchor: "compressor" },
    condensador: { n: 2, name: ["Condensador"], sub: "tira o calor do gás", anchor: "condensador" },
    filtro: { n: 3, name: ["Filtro secador"], sub: "segura a umidade", anchor: "filtro-secador" },
    valvula: { n: 4, name: ["Válvula de", "expansão"], sub: "baixa a pressão", anchor: "valvula" },
    evaporador: { n: 5, name: ["Evaporador"], sub: "esfria o ar da cabine", anchor: "evaporador" }
  };
  var ORDER = ["compressor", "condensador", "filtro", "valvula", "evaporador"];

  /*
   * Duas geometrias. Cada peça tem posição do corpo e do rótulo.
   * hx = trocador de calor (condensador/evaporador): x, y, largura, altura, orientação.
   */
  var LAYOUTS = {
    wide: {
      cls: "circuit-wide",
      viewBox: "0 40 720 332",
      L: 120, R: 560, T: 110, B: 300,
      comp: { cx: 120, cy: 230 },
      cond: { x: 190, y: 88, w: 140, h: 44, dir: "h" },
      filt: { cx: 440, cy: 110 },
      valv: { cx: 560, cy: 205 },
      evap: { x: 350, y: 278, w: 140, h: 44, dir: "h" },
      labels: { compressor: [164, 228], condensador: [190, 162], filtro: [412, 162], valvula: [584, 196], evaporador: [350, 246] },
      heads: {
        hot: ["114,170 126,170 120,158", "508,104 508,116 520,110"],
        cold: ["554,254 566,254 560,266", "248,294 248,306 236,300"]
      },
      notes: { hot: [106, 114, "end"], cold: [106, 304, "end"] },
      heat: { arrows: [[228, 82, 228, 52], [260, 82, 260, 52], [292, 82, 292, 52]], text: [310, 66, 0] },
      chill: { arrows: [[388, 328, 388, 360], [420, 328, 420, 360], [452, 328, 452, 360]], text: [470, 352, 0] }
    },
    tall: {
      cls: "circuit-tall",
      viewBox: "0 62 360 432",
      L: 72, R: 288, T: 96, B: 452,
      comp: { cx: 72, cy: 410 },
      cond: { x: 50, y: 176, w: 44, h: 128, dir: "v" },
      filt: { cx: 180, cy: 96 },
      valv: { cx: 288, cy: 176 },
      evap: { x: 266, y: 276, w: 44, h: 128, dir: "v" },
      labels: { filtro: [114, 146], valvula: [114, 196], condensador: [114, 266], evaporador: [114, 334], compressor: [114, 404] },
      heads: {
        hot: ["66,146 78,146 72,134", "236,90 236,102 248,96"],
        cold: ["282,230 294,230 288,242", "186,446 186,458 174,452"]
      },
      notes: { hot: [72, 80, "start"], cold: [72, 478, "start"] },
      heat: { arrows: [[44, 210, 20, 210], [44, 240, 20, 240], [44, 270, 20, 270]], text: [10, 240, -90] },
      chill: { arrows: [[316, 310, 338, 310], [316, 340, 338, 340], [316, 370, 338, 370]], text: [352, 340, 90] }
    }
  };

  function el(name, attrs, parent) {
    var node = document.createElementNS(NS, name);
    for (var k in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, k)) node.setAttribute(k, attrs[k]);
    }
    if (parent) parent.appendChild(node);
    return node;
  }

  function text(parent, x, y, cls, str, anchor, rotate) {
    var t = el("text", { x: x, y: y, "class": cls }, parent);
    if (anchor) t.setAttribute("text-anchor", anchor);
    if (rotate) t.setAttribute("transform", "rotate(" + rotate + " " + x + " " + y + ")");
    t.textContent = str;
    return t;
  }

  // serpentina dentro de um trocador de calor
  function serpentine(b) {
    var pad = 8, step = 12, d, i, alt = false;
    if (b.dir === "h") {
      d = "M" + (b.x + pad) + "," + (b.y + pad);
      for (i = b.x + pad + step; i <= b.x + b.w - pad; i += step) {
        d += " L" + i + "," + (alt ? b.y + pad : b.y + b.h - pad);
        alt = !alt;
      }
    } else {
      d = "M" + (b.x + pad) + "," + (b.y + pad);
      for (i = b.y + pad + step; i <= b.y + b.h - pad; i += step) {
        d += " L" + (alt ? b.x + pad : b.x + b.w - pad) + "," + i;
        alt = !alt;
      }
    }
    return d;
  }

  // seta reta de (x0,y0) até (x1,y1), com ponta em (x1,y1)
  function arrow(g, a, lineCls, headCls) {
    var x0 = a[0], y0 = a[1], x1 = a[2], y1 = a[3];
    var dx = Math.sign(x1 - x0), dy = Math.sign(y1 - y0);
    el("line", { x1: x0, y1: y0, x2: x1 - dx * 6, y2: y1 - dy * 6, "class": "c-arrow " + lineCls }, g);
    var bx = x1 - dx * 8, by = y1 - dy * 8;
    var pts = dy !== 0
      ? (bx - 5) + "," + by + " " + (bx + 5) + "," + by + " " + x1 + "," + y1
      : bx + "," + (by - 5) + " " + bx + "," + (by + 5) + " " + x1 + "," + y1;
    el("polygon", { points: pts, "class": headCls }, g);
  }

  function drawBody(g, id, G) {
    if (id === "compressor") {
      var c = G.comp;
      el("circle", { cx: c.cx, cy: c.cy, r: 28, "class": "c-body" }, g);
      el("circle", { cx: c.cx, cy: c.cy, r: 10, "class": "c-detail" }, g);
      el("line", { x1: c.cx - 28, y1: c.cy, x2: c.cx - 10, y2: c.cy, "class": "c-detail" }, g);
      el("line", { x1: c.cx + 10, y1: c.cy, x2: c.cx + 28, y2: c.cy, "class": "c-detail" }, g);
    } else if (id === "condensador" || id === "evaporador") {
      var b = id === "condensador" ? G.cond : G.evap;
      el("rect", { x: b.x, y: b.y, width: b.w, height: b.h, "class": "c-body" }, g);
      el("path", { d: serpentine(b), "class": "c-detail" }, g);
    } else if (id === "filtro") {
      var f = G.filt;
      el("rect", { x: f.cx - 28, y: f.cy - 12, width: 56, height: 24, rx: 12, "class": "c-body" }, g);
      [-12, 0, 12].forEach(function (dx) {
        el("line", { x1: f.cx + dx, y1: f.cy - 7, x2: f.cx + dx, y2: f.cy + 7, "class": "c-detail" }, g);
      });
    } else if (id === "valvula") {
      var v = G.valv;
      el("polygon", { points: (v.cx - 15) + "," + (v.cy - 16) + " " + (v.cx + 15) + "," + (v.cy - 16) + " " + v.cx + "," + v.cy, "class": "c-body" }, g);
      el("polygon", { points: (v.cx - 15) + "," + (v.cy + 16) + " " + (v.cx + 15) + "," + (v.cy + 16) + " " + v.cx + "," + v.cy, "class": "c-body" }, g);
    }
  }

  function drawLabel(g, part, pos) {
    var x = pos[0], y = pos[1];
    el("rect", { x: x, y: y - 14, width: 18, height: 18, "class": "c-num-box" }, g);
    text(g, x + 9, y, "c-num", String(part.n), "middle");
    part.name.forEach(function (line, i) {
      text(g, x + 26, y + i * 17, "c-name", line);
    });
    text(g, x + 26, y + part.name.length * 17 + 2, "c-sub", part.sub);
  }

  function render(host, G, base) {
    var L = G.L, R = G.R, T = G.T, B = G.B;
    var titleId = "circuito-" + Math.random().toString(36).slice(2, 8);

    var svg = el("svg", { viewBox: G.viewBox, role: "group", "aria-labelledby": titleId, "class": G.cls });
    el("title", { id: titleId }, svg).textContent =
      "Circuito do ar-condicionado automotivo: compressor, condensador, filtro secador, válvula de expansão e evaporador.";

    // Tubulação: alta pressão (vermelho) e baixa pressão (azul)
    el("path", { d: "M" + L + "," + G.comp.cy + " V" + T + " H" + R + " V" + G.valv.cy, "class": "c-line c-hot" }, svg);
    el("path", { d: "M" + R + "," + G.valv.cy + " V" + B + " H" + L + " V" + G.comp.cy, "class": "c-line c-cold" }, svg);

    // Fluxo do gás, no sentido do circuito
    el("path", { d: "M" + L + "," + G.comp.cy + " V" + T + " H" + R + " V" + B + " H" + L + " Z", "class": "c-flow", "aria-hidden": "true" }, svg);

    var deco = el("g", { "aria-hidden": "true" }, svg);
    G.heads.hot.forEach(function (p) { el("polygon", { points: p, "class": "c-head-hot" }, deco); });
    G.heads.cold.forEach(function (p) { el("polygon", { points: p, "class": "c-head-cold" }, deco); });

    text(deco, G.notes.hot[0], G.notes.hot[1], "c-note c-note-hot", "Alta pressão", G.notes.hot[2]);
    text(deco, G.notes.cold[0], G.notes.cold[1], "c-note c-note-cold", "Baixa pressão", G.notes.cold[2]);

    // Calor saindo do condensador, ar frio saindo do evaporador
    G.heat.arrows.forEach(function (a) { arrow(deco, a, "c-arrow-hot", "c-head-hot"); });
    text(deco, G.heat.text[0], G.heat.text[1], "c-note c-note-hot", "calor para fora",
      G.heat.text[2] ? "middle" : null, G.heat.text[2]);
    G.chill.arrows.forEach(function (a) { arrow(deco, a, "c-arrow-cold", "c-head-cold"); });
    text(deco, G.chill.text[0], G.chill.text[1], "c-note c-note-cold", "ar frio para a cabine",
      G.chill.text[2] ? "middle" : null, G.chill.text[2]);

    // Peças: cada uma é um link para o serviço correspondente
    ORDER.forEach(function (id) {
      var part = PARTS[id];
      var a = el("a", {
        href: base + "#" + part.anchor,
        "class": "c-part",
        "data-part": id,
        "aria-label": part.n + ". " + part.name.join(" ") + ": " + part.sub + ". Ver serviço."
      }, svg);
      drawBody(a, id, G);
      drawLabel(a, part, G.labels[id]);
    });

    host.appendChild(svg);
  }

  function linkHighlights(scope) {
    function set(id, on) {
      scope.querySelectorAll('[data-part="' + id + '"]').forEach(function (n) {
        n.classList.toggle("is-active", on);
      });
    }
    scope.querySelectorAll("[data-part]").forEach(function (n) {
      var id = n.getAttribute("data-part");
      n.addEventListener("mouseenter", function () { set(id, true); });
      n.addEventListener("mouseleave", function () { set(id, false); });
      n.addEventListener("focus", function () { set(id, true); });
      n.addEventListener("blur", function () { set(id, false); });
    });
  }

  document.querySelectorAll("[data-circuit]").forEach(function (host) {
    var base = host.getAttribute("data-link-base") || "";
    render(host, LAYOUTS.wide, base);
    render(host, LAYOUTS.tall, base);
    linkHighlights(host.closest("[data-circuit-scope]") || host);
  });
})();
