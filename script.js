/* ============================================================
   VARIÁVEIS GLOBAIS
============================================================ */

let nivelAtual = 0;
let dificuldade = "facil";

/* ============================================================
   NAVEGAÇÃO E MENU
============================================================ */

function iniciarNivel(n) {
    nivelAtual = n;

    document.getElementById("menu-inicial").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");

    document.getElementById("nivel1").classList.add("hidden");
    document.getElementById("nivel2").classList.add("hidden");

    if (n === 1) {
        document.getElementById("titulo-nivel").innerText = "Nível 1 — Criar Pizza";
        iniciarNivel1();
        document.getElementById("nivel1").classList.remove("hidden");
    }

    if (n === 2) {
        document.getElementById("titulo-nivel").innerText = "Nível 2 — Autómato Aleatório";
        iniciarNivel2();
        document.getElementById("nivel2").classList.remove("hidden");
    }
}

function voltarAoMenu() {
    document.getElementById("app").classList.add("hidden");
    document.getElementById("modal-dificuldade").classList.add("hidden");
    document.getElementById("menu-inicial").classList.remove("hidden");
}

function trocarDificuldade() {
    document.getElementById("modal-dificuldade").classList.remove("hidden");
}

function trocarNivel() {
    voltarAoMenu();
}

function sair() {
    alert("Obrigado por visitar a Pizzaria Computacional! 🍕");
    location.reload();
}

/* ============================================================
   MODAL DE DIFICULDADE
============================================================ */

function abrirSelecaoDificuldade() {
    document.getElementById("modal-dificuldade").classList.remove("hidden");
}

function escolherDificuldade(df) {
    dificuldade = df;
    document.getElementById("modal-dificuldade").classList.add("hidden");
    iniciarNivel(2);
}

/* ============================================================
   NÍVEL 1 — VARIÁVEIS + INGREDIENTES
============================================================ */

let estadoN1 = "S0";
let queijoUsado = false;
let pagamentoN1 = false;

/* Ingredientes válidos + ingredientes impossíveis */
const ingredientesN1_validos = [
    "massa", "molho", "queijo",
    "pimentos", "fiambre", "azeitonas",
    "cogumelos", "bacon", "milho",
    "cebola", "oregano", "ananas"
];

const ingredientesN1_impossiveis = [
    "chocolate", "gelado", "gomas", "rebuçados",
    "alface", "sushi", "esparguete", "melancia"
];

function iniciarNivel1() {
    estadoN1 = "S0";
    pagamentoN1 = false;
    queijoUsado = false;

    document.getElementById("log-n1").innerHTML = "";
    document.getElementById("toppings-n1").innerHTML = "";

    criarIngredientesN1();
    configurarDropN1();
}

/* Misturar ingredientes válidos + impossíveis */
function criarIngredientesN1() {

    const lista = document.getElementById("ingredientes-n1");
    lista.innerHTML = "";

    const todos = [...ingredientesN1_validos, ...ingredientesN1_impossiveis];

    todos.sort(() => Math.random() - 0.5);

    todos.forEach(ing => {
        const d = document.createElement("div");
        d.draggable = true;

        const img = document.createElement("img");
        const icon = obterIconeIngrediente(ing);
        if (icon) img.src = icon;
        else {
            // fallback visual simples
            img.src = obterIconeIngrediente("queijo");
        }

        const label = document.createElement("div");
        label.className = "label";
        label.textContent = ing;

        d.appendChild(img);
        d.appendChild(label);

        d.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text/plain", ing);
        });

        lista.appendChild(d);
    });
}

/* ============================================================
   NÍVEL 1 — DROPZONE
============================================================ */

function configurarDropN1() {
    const drop = document.getElementById("dropzone-n1");
    const svg = drop.querySelector("svg");

    drop.addEventListener("dragover", e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
        drop.classList.add("drag-over");
    });
    drop.addEventListener("dragleave", () => drop.classList.remove("drag-over"));

    drop.addEventListener("drop", e => {
        e.preventDefault();
        drop.classList.remove("drag-over");

        const tok = e.dataTransfer.getData("text/plain");
        let pos = obterPosicaoNoSVG(e, svg);
        pos = clampPosicaoPizza(pos, svg);

        validarFSM_N1(tok, pos);
    });
}

/* ============================================================
   NÍVEL 1 — FSM (massa obrigatória)
============================================================ */

function validarFSM_N1(tok, pos) {

    /* INGREDIENTE IMPOSSÍVEL */
    if (ingredientesN1_impossiveis.includes(tok)) {
        // Ainda desenha o ícone onde foi largado para manter feedback visual
        desenharToppingN1(tok, pos);
        return logN1(`❌ O ingrediente '${tok}' não pertence à receita da pizza!`);
    }

    /* FSM */
    switch (estadoN1) {

        case "S0":
            if (tok !== "massa") {
                return logN1("⛔ Tens de começar pela MASSA!");
            }
            estadoN1 = "S1";
            desenharToppingN1(tok, pos);
            logN1("✔ Massa adicionada!");
            break;

        case "S1":
            if (tok === "molho") {
                estadoN1 = "S1.5";
                desenharToppingN1(tok, pos);
                logN1("✔ Molho adicionado.");
            }
            else if (tok === "queijo") {
                estadoN1 = "S2";
                queijoUsado = true;
                desenharToppingN1(tok, pos);
                logN1("✔ Queijo adicionado.");
            }
            else {
                return logN1("⛔ Depois da massa, tens de colocar molho ou queijo.");
            }
            break;

        case "S1.5": // molho colocado, falta queijo
            if (tok === "queijo") {
                estadoN1 = "S2";
                queijoUsado = true;
                desenharToppingN1(tok, pos);
                logN1("✔ Queijo adicionado.");
            }
            else {
                return logN1("⛔ Falta adicionar o queijo.");
            }
            break;

        case "S2": // queijo já colocado
            if (tok === "pagar") {
                pagamentoN1 = true;
                estadoN1 = "S3";
                logN1("💰 Pagamento efetuado!");
            } else {
                desenharToppingN1(tok, pos);
                logN1(`🥗 ${tok} adicionado como topping.`);
            }
            break;

        case "S3":
            return logN1("⛔ Pizza já paga! Falta só finalizar.");
    }
}

function efetuarPagamentoN1() {
    validarFSM_N1("pagar");
}

function finalizarPizzaN1() {
    if (!pagamentoN1) {
        return logN1("⛔ Tens de pagar antes de finalizar!");
    }
    logN1("🎉 Pizza concluída com sucesso!");
    alert("🍕 Parabéns! Completaste a pizza!");
}

/* ============================================================
   NÍVEL 1 — DESENHO DOS TOPPINGS
============================================================ */

function desenharToppingN1(tok, pos) {
    const g = document.getElementById("toppings-n1");

    const icon = obterIconeIngrediente(tok);
    const size = 68;

    if (icon) {
        const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
        img.setAttribute("href", icon);
        img.setAttributeNS("http://www.w3.org/1999/xlink", "href", icon);
        const { x, y } = pos || { x: Math.random() * 300 + 40, y: Math.random() * 300 + 40 };
        img.setAttribute("x", x - size / 2);
        img.setAttribute("y", y - size / 2);
        img.setAttribute("width", size);
        img.setAttribute("height", size);
        img.setAttribute("preserveAspectRatio", "xMidYMid meet");
        img.style.pointerEvents = "none"; // allow future drags without interference
        g.appendChild(img);
        return;
    }

    // Fallback: pequeno círculo
    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("cx", Math.random() * 300 + 40);
    c.setAttribute("cy", Math.random() * 300 + 40);
    c.setAttribute("r", 12);
    c.setAttribute("fill", "#ffcc55");
    g.appendChild(c);
}

function logN1(msg) {
    const li = document.createElement("li");
    li.innerText = msg;
    document.getElementById("log-n1").appendChild(li);
}

/* ============================================================
   UTILITÁRIOS — ÍCONES E POSIÇÃO
============================================================ */

const ingredientIcons = {
    "massa": "assets/ingredients/massa.svg",
    "molho": "assets/ingredients/molho.svg",
    "queijo": "assets/ingredients/queijo.svg",
    "pimentos": "assets/ingredients/pimentos.svg",
    "fiambre": "assets/ingredients/fiambre.svg",
    "azeitonas": "assets/ingredients/azeitonas.svg",
    "cogumelos": "assets/ingredients/cogumelos.svg",
    "bacon": "assets/ingredients/bacon.svg",
    "milho": "assets/ingredients/milho.svg",
    "cebola": "assets/ingredients/cebola.svg",
    "oregano": "assets/ingredients/oregano.svg",
    "ananas": "assets/ingredients/ananas.svg",
    "chocolate": "assets/ingredients/chocolate.svg",
    "gelado": "assets/ingredients/gelado.svg",
    "gomas": "assets/ingredients/gomas.svg",
    "rebuçados": "assets/ingredients/rebuçados.svg",
    "alface": "assets/ingredients/alface.svg",
    "sushi": "assets/ingredients/sushi.svg",
    "esparguete": "assets/ingredients/esparguete.svg",
    "melancia": "assets/ingredients/melancia.svg"
};

function obterIconeIngrediente(nome) {
    return ingredientIcons[nome] || null;
}

function obterPosicaoNoSVG(evt, svgEl) {
    const pt = svgEl.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    const ctm = svgEl.getScreenCTM();
    if (!ctm) {
        const rect = svgEl.getBoundingClientRect();
        return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
    }
    const svgP = pt.matrixTransform(ctm.inverse());
    return { x: svgP.x, y: svgP.y };
}

function clampPosicaoPizza(pos, svgEl) {
    const circle = svgEl.querySelector("circle");
    if (!circle) return pos;
    const cx = parseFloat(circle.getAttribute("cx"));
    const cy = parseFloat(circle.getAttribute("cy"));
    const r = parseFloat(circle.getAttribute("r"));
    const pad = 18;
    let dx = pos.x - cx;
    let dy = pos.y - cy;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const maxR = Math.max(0, r - pad);
    if (dist > maxR) {
        const scale = maxR / dist;
        dx *= scale;
        dy *= scale;
    }
    return { x: cx + dx, y: cy + dy };
}

/* ============================================================
   NÍVEL 2 — AUTÓMATO CIRCULAR SVG
============================================================ */

let fsm = null;
let estadoAtual = null;

function iniciarNivel2() {
    document.getElementById("log-n2").innerHTML = "";
    document.getElementById("toppings-n2").innerHTML = "";
    document.getElementById("formal-text").innerHTML = "";
    document.getElementById("tabela-delta").innerHTML = "";

    document.getElementById("fsm-states").innerHTML = "";
    document.getElementById("fsm-trans").innerHTML = "";

    gerarFSM_N2();
}

/* ------------------------------------------------------------
   GERAR FSM DEPENDENDO DA DIFICULDADE
------------------------------------------------------------ */

function gerarFSM_N2() {

    const numEstados =
        dificuldade === "facil" ? 4 :
        dificuldade === "medio" ? 6 : 8;

    const estados = Array.from({ length: numEstados }, (_, i) => "q" + i);
    const inicial = estados[0];
    const final = estados[estados.length - 1];

    const ingredientesBase = [
        "massa", "molho", "queijo", "pimentos", "fiambre",
        "azeitonas", "bacon", "cogumelos", "milho"
    ];

    const ingredientesDistratores = [
        "chocolate", "melancia", "gelado", "gomas", "sushi"
    ];

    const trans = {};

    estados.forEach(e => trans[e] = {});

    if (dificuldade === "facil") {

        for (let i = 0; i < estados.length - 1; i++) {
            const tok = ingredientesBase[Math.floor(Math.random() * ingredientesBase.length)];
            trans[estados[i]][tok] = estados[i + 1];
        }
    }

    if (dificuldade === "medio") {

        for (let i = 0; i < estados.length - 1; i++) {

            const tok1 = ingredientesBase[Math.floor(Math.random() * ingredientesBase.length)];
            trans[estados[i]][tok1] = estados[i + 1];

            if (i < estados.length - 2) {
                const tok2 = ingredientesBase[Math.floor(Math.random() * ingredientesBase.length)];
                trans[estados[i]][tok2] = estados[i + 2];
            }
        }
    }

    if (dificuldade === "dificil") {

        for (let i = 0; i < estados.length - 1; i++) {

            const tok1 = ingredientesBase[Math.floor(Math.random() * ingredientesBase.length)];
            trans[estados[i]][tok1] = estados[i + 1];

            if (i < estados.length - 2) {
                const tok2 = ingredientesBase[Math.floor(Math.random() * ingredientesBase.length)];
                trans[estados[i]][tok2] = estados[i + 2];
            }

            if (i > 0 && Math.random() > 0.5) {
                const tok3 = ingredientesBase[Math.floor(Math.random() * ingredientesBase.length)];
                trans[estados[i]][tok3] = estados[i - 1];
            }
        }
    }

    fsm = { estados, inicial, final, trans };
    estadoAtual = inicial;

    desenharFSM_N2();
    renderIngredientesN2(ingredientesBase, ingredientesDistratores);
}

/* ============================================================
   DESENHAR FSM CIRCULAR
============================================================ */

function desenharFSM_N2() {

    const svgStates = document.getElementById("fsm-states");
    const svgTrans = document.getElementById("fsm-trans");

    svgStates.innerHTML = "";
    svgTrans.innerHTML = "";

    const cx = 375, cy = 375, raio = 300;
    const coords = {};

    // Function to redraw all transitions
    function redrawTransitions() {
        svgTrans.innerHTML = "";
        
        for (const e1 in fsm.trans) {
            for (const tok in fsm.trans[e1]) {
                const e2 = fsm.trans[e1][tok];

                const x1 = coords[e1].x;
                const y1 = coords[e1].y;

                const x2 = coords[e2].x;
                const y2 = coords[e2].y;

                const controlX = (x1 + x2) / 2;
                const controlY = (y1 + y2) / 2 - 60;

                const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
                p.setAttribute("d", `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`);
                p.classList.add("fsm-arrow");
                p.dataset.from = e1;
                p.dataset.to = e2;

                svgTrans.appendChild(p);

                // Calculate actual midpoint on the quadratic Bezier curve (t=0.5)
                const midX = 0.25 * x1 + 0.5 * controlX + 0.25 * x2;
                const midY = 0.25 * y1 + 0.5 * controlY + 0.25 * y2;
                
                // Calculate proper tangent at t=0.5 for quadratic Bezier
                const tangentX = (controlX - x1) + (x2 - controlX);
                const tangentY = (controlY - y1) + (y2 - controlY);
                
                let angle = Math.atan2(tangentY, tangentX) * (180 / Math.PI);
                let flipped = false;
                
                if (angle > 90 || angle < -90) {
                    angle += 180;
                    flipped = true;
                }
                
                const offset = 15;
                const perpAngle = (angle + (flipped ? -90 : 90)) * (Math.PI / 180);
                const labelX = midX + offset * Math.cos(perpAngle);
                const labelY = midY + offset * Math.sin(perpAngle);

                const lbl = document.createElementNS("http://www.w3.org/2000/svg", "text");
                lbl.setAttribute("x", labelX);
                lbl.setAttribute("y", labelY);
                lbl.setAttribute("text-anchor", "middle");
                lbl.setAttribute("dominant-baseline", "middle");
                lbl.setAttribute("transform", `rotate(${angle}, ${labelX}, ${labelY})`);
                lbl.classList.add("arrow-label");
                lbl.textContent = tok;

                svgTrans.appendChild(lbl);
                const bbox = lbl.getBBox();
                
                const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                bg.setAttribute("x", bbox.x - 4);
                bg.setAttribute("y", bbox.y - 2);
                bg.setAttribute("width", bbox.width + 8);
                bg.setAttribute("height", bbox.height + 4);
                bg.setAttribute("rx", 4);
                bg.classList.add("arrow-label-bg");
                
                svgTrans.insertBefore(bg, lbl);
            }
        }
    }

    let draggedState = null;
    let dragOffset = { x: 0, y: 0 };

    fsm.estados.forEach((e, i) => {

        const ang = (2 * Math.PI * i) / fsm.estados.length;

        const x = cx + raio * Math.cos(ang);
        const y = cy + raio * Math.sin(ang);

        coords[e] = { x, y };

        const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("cx", x);
        c.setAttribute("cy", y);
        c.setAttribute("r", 50);
        c.classList.add("fsm-state");
        if (e === fsm.final) c.classList.add("final");
        if (e === estadoAtual) c.classList.add("active");
        c.style.cursor = "move";
        c.dataset.state = e;

        // Add drag functionality
        c.addEventListener("mousedown", (event) => {
            draggedState = e;
            const rect = svgStates.getBoundingClientRect();
            dragOffset.x = event.clientX - rect.left - coords[e].x;
            dragOffset.y = event.clientY - rect.top - coords[e].y;
            event.preventDefault();
        });

        svgStates.appendChild(c);

        const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
        t.setAttribute("x", x);
        t.setAttribute("y", y + 6);
        t.classList.add("state-label");
        t.textContent = e;
        t.style.pointerEvents = "none";
        t.dataset.state = e;

        svgStates.appendChild(t);
    });

    // Global mouse move and up handlers
    const svg = document.getElementById("fsm-svg");
    
    svg.addEventListener("mousemove", (event) => {
        if (!draggedState) return;
        
        const rect = svgStates.getBoundingClientRect();
        const newX = event.clientX - rect.left - dragOffset.x;
        const newY = event.clientY - rect.top - dragOffset.y;
        
        coords[draggedState].x = newX;
        coords[draggedState].y = newY;
        
        // Update circle position
        const circle = svgStates.querySelector(`circle[data-state="${draggedState}"]`);
        circle.setAttribute("cx", newX);
        circle.setAttribute("cy", newY);
        
        // Update text position
        const text = svgStates.querySelector(`text[data-state="${draggedState}"]`);
        text.setAttribute("x", newX);
        text.setAttribute("y", newY + 6);
        
        // Redraw transitions
        redrawTransitions();
    });
    
    svg.addEventListener("mouseup", () => {
        draggedState = null;
    });
    
    svg.addEventListener("mouseleave", () => {
        draggedState = null;
    });

    // Initial draw of transitions
    redrawTransitions();
}

/* ============================================================
   NÍVEL 2 — INGREDIENTES (valores reais + distratores)
============================================================ */

function renderIngredientesN2(base, distratores) {

    const lista = document.getElementById("ingredientes-n2");
    lista.innerHTML = "";

    const todos = [...base, ...distratores];
    todos.sort(() => Math.random() - 0.5);

    todos.forEach(tok => {

        const d = document.createElement("div");
        d.draggable = true;

        const img = document.createElement("img");
        const icon = obterIconeIngrediente(tok);
        if (icon) img.src = icon; else img.src = obterIconeIngrediente("queijo");

        const label = document.createElement("div");
        label.className = "label";
        label.textContent = tok;

        d.appendChild(img);
        d.appendChild(label);

        d.addEventListener("dragstart", e =>
            e.dataTransfer.setData("text/plain", tok)
        );

        lista.appendChild(d);
    });

    configurarDropN2();
}

/* ============================================================
   NÍVEL 2 — DROPZONE
============================================================ */

function configurarDropN2() {
    const drop = document.getElementById("dropzone-n2");
    const svg = drop.querySelector("svg");

    drop.addEventListener("dragover", e => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; drop.classList.add("drag-over"); });
    drop.addEventListener("dragleave", () => drop.classList.remove("drag-over"));
    drop.addEventListener("drop", e => {
        e.preventDefault();
        drop.classList.remove("drag-over");
        const tok = e.dataTransfer.getData("text/plain");
        let pos = obterPosicaoNoSVG(e, svg);
        pos = clampPosicaoPizza(pos, svg);
        validarFSM_N2(tok, pos);
    });
}

/* ============================================================
   NÍVEL 2 — FSM RUNTIME
============================================================ */

function validarFSM_N2(tok, pos) {

    const trans = fsm.trans[estadoAtual];

    if (!trans || !(tok in trans)) {
        return logN2(`❌ '${tok}' não é permitido em ${estadoAtual}.`);
    }

    const anterior = estadoAtual;
    estadoAtual = trans[tok];

    logN2(`✔ '${tok}' aceito: ${anterior} → ${estadoAtual}`);

    atualizarEstadoAtual_N2(anterior, estadoAtual);

    if (estadoAtual === fsm.final) {
        logN2("🎉 Autómato concluído!");
        mostrarFormalizacao_N2();
    }

    // desenhar topping visual sempre que transição válida
    desenharToppingN2(tok, pos);
}

function atualizarEstadoAtual_N2(ant, nova) {

    document.querySelectorAll(".fsm-state").forEach(c => {
        c.classList.remove("active");
    });

    document.querySelectorAll(".fsm-state").forEach(c => {
        const label = c.nextSibling;
        if (label && label.textContent === nova)
            c.classList.add("active");
    });

    document.querySelectorAll(".fsm-arrow").forEach(p => {
        p.classList.remove("active");
        if (p.dataset.from === ant && p.dataset.to === nova)
            p.classList.add("active");
    });
}

function desenharToppingN2(tok, pos) {
    const g = document.getElementById("toppings-n2");

    const icon = obterIconeIngrediente(tok);
    const size = 44;

    if (icon) {
        const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
        img.setAttribute("href", icon);
        img.setAttributeNS("http://www.w3.org/1999/xlink", "href", icon);
        const { x, y } = pos || { x: Math.random() * 300 + 40, y: Math.random() * 300 + 40 };
        img.setAttribute("x", x - size / 2);
        img.setAttribute("y", y - size / 2);
        img.setAttribute("width", size);
        img.setAttribute("height", size);
        img.setAttribute("preserveAspectRatio", "xMidYMid meet");
        img.style.pointerEvents = "none";
        g.appendChild(img);
        return;
    }

    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("cx", Math.random() * 300 + 40);
    c.setAttribute("cy", Math.random() * 300 + 40);
    c.setAttribute("r", 10);
    c.setAttribute("fill", "#ffd966");
    g.appendChild(c);
}

function logN2(msg) {
    const li = document.createElement("li");
    li.innerText = msg;
    document.getElementById("log-n2").appendChild(li);
}

/* ============================================================
   NÍVEL 2 — FORMALIZAÇÃO E TABELA δ
============================================================ */

function mostrarFormalizacao_N2() {

    const text = document.getElementById("formal-text");
    const table = document.getElementById("tabela-delta");

    let str = "";

    str += "Q = { " + fsm.estados.join(", ") + " }\n";
    str += "q0 = " + fsm.inicial + "\n";
    str += "F = { " + fsm.final + " }\n";
    str += "\nδ:\n";

    for (const e in fsm.trans)
        for (const tok in fsm.trans[e])
            str += `(${e}, ${tok}) → ${fsm.trans[e][tok]}\n`;

    text.textContent = str;

    table.innerHTML = "";

    const header = document.createElement("tr");
    header.innerHTML = "<th>Estado</th><th>Token</th><th>Destino</th>";
    table.appendChild(header);

    for (const e in fsm.trans) {
        for (const tok in fsm.trans[e]) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${e}</td>
                <td>${tok}</td>
                <td>${fsm.trans[e][tok]}</td>
            `;
            table.appendChild(row);
        }
    }
}

/* ============================================================
   REINICIAR
============================================================ */

function reiniciar() {
    iniciarNivel(nivelAtual);
}
