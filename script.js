/* ============================================================
   VARIÁVEIS GLOBAIS
============================================================ */

let nivelAtual = 0;
let dificuldade = "facil";
let dificuldadeN1 = "facil";
let dificuldadeN3 = "facil";
let blinkingEnabled = false;

/* ============================================================
   NAVEGAÇÃO E MENU
============================================================ */

function iniciarNivel(n) {
    nivelAtual = n;

    document.getElementById("menu-inicial").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");

    document.getElementById("nivel1").classList.add("hidden");
    document.getElementById("nivel2").classList.add("hidden");
    document.getElementById("nivel3").classList.add("hidden");

    if (n === 1) {
        document.getElementById("titulo-nivel").innerText = "Nível 1 — Criar Pizza";
        document.getElementById("regex-box").style.display = "block";
        iniciarNivel1();
        document.getElementById("nivel1").classList.remove("hidden");
    }

    if (n === 2) {
        document.getElementById("titulo-nivel").innerText = "Nível 2 — Autómato Aleatório";
        iniciarNivel2();
        document.getElementById("nivel2").classList.remove("hidden");
    }

    if (n === 3) {
        document.getElementById("titulo-nivel").innerText = "Nível 3 — Criar Autómato";
        document.getElementById("regex-box").style.display = "none";
        dificuldadeN3 = "facil"; // default
        iniciarNivel3();
        document.getElementById("nivel3").classList.remove("hidden");
    }
}

function voltarAoMenu() {
    document.getElementById("app").classList.add("hidden");
    document.getElementById("modal-dificuldade").classList.add("hidden");
    document.getElementById("modal-troca-nivel").classList.add("hidden");
    document.getElementById("esquema").classList.add("hidden");
    document.getElementById("menu-inicial").classList.remove("hidden");
}

function trocarDificuldade() {
    if (nivelAtual === 1) {
        abrirSelecaoDificuldadeN1();
    } else if (nivelAtual === 3) {
        abrirSelecaoDificuldadeN3();
    } else {
        abrirSelecaoDificuldade();
    }
}

function trocarNivel() {
    document.getElementById("modal-troca-nivel").classList.remove("hidden");
}

function sair() {
    alert("Obrigado por visitar a Pizzaria Computacional! 🍕");
    location.reload();
}

function toggleBlinking() {
    blinkingEnabled = !blinkingEnabled;
    
    // Update button text
    const btn = document.querySelector("#toggle-blink-btn");
    if (btn) {
        btn.textContent = blinkingEnabled ? "🔔 Desativar Ajudas" : "🔕 Ativar Ajudas";
    }
    
    if (blinkingEnabled) {
        // Re-enable blinking
        if (nivelAtual === 1) {
            atualizarIngredientesDisponiveis();
        } else if (nivelAtual === 2) {
            atualizarIngredientesDisponiveisN2();
        }
    } else {
        // Remove all blinking
        document.querySelectorAll(".blinking").forEach(el => {
            el.classList.remove("blinking");
        });
        document.querySelectorAll(".fsm-arrow.active, .arrow-label.active").forEach(el => {
            el.classList.remove("active");
        });
    }
}

/* ============================================================
   MODAL DE DIFICULDADE
============================================================ */

function abrirSelecaoDificuldade() {
    nivelAtual = 2; // Set current level to 2
    document.getElementById("modal-dificuldade").classList.remove("hidden");
}

function escolherDificuldade(df) {
    dificuldade = df;
    document.getElementById("modal-dificuldade").classList.add("hidden");
    iniciarNivel(nivelAtual);
}

function abrirSelecaoDificuldadeN1() {
    document.getElementById("modal-dificuldade-n1").classList.remove("hidden");
}

function escolherDificuldadeN1(df) {
    dificuldadeN1 = df;
    document.getElementById("modal-dificuldade-n1").classList.add("hidden");
    iniciarNivel(1);
}

function abrirSelecaoDificuldadeN3() {
    document.getElementById("modal-dificuldade-n3").classList.remove("hidden");
}

function escolherDificuldadeN3(df) {
    dificuldadeN3 = df;
    document.getElementById("modal-dificuldade-n3").classList.add("hidden");
    iniciarNivel3();
    document.getElementById("nivel3").classList.remove("hidden");
}

function fecharModalDificuldadeN3() {
    document.getElementById("modal-dificuldade-n3").classList.add("hidden");
}

function fecharModalTrocaNivel() {
    document.getElementById("modal-troca-nivel").classList.add("hidden");
}

function selecionarNivel(n) {
    document.getElementById("modal-troca-nivel").classList.add("hidden");
    iniciarNivel(n);
}

/* ============================================================
   MODAL AJUDA
============================================================ */

function mostrarAjuda() {
    const modal = document.getElementById("modal-ajuda");
    const content = document.getElementById("conteudo-ajuda");
    content.innerHTML = getAjudaForNivel(nivelAtual);
    modal.classList.remove("hidden");
}

function fecharAjuda() {
    document.getElementById("modal-ajuda").classList.add("hidden");
}

function getAjudaForNivel(n) {
    if (n === 1) {
        return `
            <p><strong>Nível 1: Criar Pizza</strong></p>
            <ul>
                <li>Comece sempre pela massa.</li>
                <li>Adicione molho e queijo em seguida.</li>
                <li>Use toppings opcionais, mas evite ingredientes impossíveis.</li>
                <li>Finalize com pagamento para completar a pizza.</li>
                <li>Verifique o progresso e o log para orientação.</li>
            </ul>
        `;
    } else if (n === 2) {
        return `
            <p><strong>Nível 2: Autómato Aleatório</strong></p>
            <ul>
                <li>Observe o diagrama circular do autómato gerado.</li>
                <li>Cada estado é um círculo, transições são setas com ingredientes.</li>
                <li>Arraste apenas ingredientes válidos para avançar no autómato.</li>
                <li>O estado ativo pisca; siga as transições permitidas.</li>
                <li>Alcance o estado final para completar.</li>
            </ul>
        `;
    } else if (n === 3) {
        return `
            <p><strong>Nível 3: Criar Autómato</strong></p>
            <ul>
                <li>Leia a sequência de ingredientes fornecida.</li>
                <li>Defina um autómato finito determinístico que aceite exatamente essa sequência.</li>
                <li>Escolha o número de estados, estado inicial, estados finais e transições.</li>
                <li>Cada transição deve levar de um estado a outro com um ingrediente específico.</li>
                <li>O autómato deve aceitar a sequência e parar num estado final.</li>
                <li>Clique em "Validar Autómato" para verificar.</li>
            </ul>
        `;
    }
    return "Ajuda não disponível.";
}

/* ============================================================
   NÍVEL 1 — VARIÁVEIS + INGREDIENTES
============================================================ */

let estadoN1 = "S0";
let queijoUsado = false;
let pagamentoN1 = false;
let toppingsAdded = 0;
let sequence = [];

/* Ingredientes válidos + ingredientes impossíveis */
const ingredientesN1_validos = [
    "massa", "molho", "queijo",
    "pimentos", "fiambre", "azeitonas",
    "cogumelos", "bacon", "milho",
    "cebola", "oregano", "ananas",
    "alface", "sushi", "esparguete", "melancia"
];

const ingredientesN1_impossiveis = [
    "chocolate", "gelado", "gomas", "rebuçados",
    "alface", "sushi", "esparguete", "melancia"
];

function iniciarNivel1() {
    estadoN1 = "S0";
    pagamentoN1 = false;
    queijoUsado = false;
    toppingsAdded = 0;
    sequence = [];

    document.getElementById("log-n1").innerHTML = "";
    document.getElementById("toppings-n1").innerHTML = "";

    // Update regex display based on difficulty
    const regex = getRegexForDifficulty(dificuldadeN1);
    document.getElementById("regex-display").innerHTML = regex;

    criarIngredientesN1();
    configurarDropN1();
}

/* Misturar ingredientes válidos + impossíveis */
function criarIngredientesN1() {

    const lista = document.getElementById("ingredientes-n1");
    lista.innerHTML = "";

    const todos = [...ingredientesN1_validos, ...ingredientesN1_impossiveis];

    // Rule: prevent duplicates after normalization (case, acentos e separadores)
    const seen = new Set();
    const filtered = todos.filter(ing => {
        const key = normalizeIngredient(ing);
        if (!key) return false;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    filtered.sort(() => Math.random() - 0.5);

    filtered.forEach(ing => {
        const d = document.createElement("div");
        d.draggable = true;
        d.dataset.ingredient = normalizeIngredient(ing);

        const img = document.createElement("img");
        const canonical = normalizeIngredient(ing);
        const icon = obterIconeIngrediente(canonical);
        if (icon) img.src = icon;
        else img.src = obterIconeIngrediente("queijo");

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

    // Initialize blinking for the first available ingredient
    atualizarIngredientesDisponiveis();
}

/* ============================================================
   NÍVEL 1 — ATUALIZAR INGREDIENTES DISPONÍVEIS (com blinking)
============================================================ */

function getNextAvailableIngredients() {
    const available = [];

    switch (estadoN1) {
        case "S0":
            // Start: only "massa" is available
            available.push("massa");
            break;

        case "S1":
            // After massa: molho or queijo
            available.push("molho", "queijo");
            break;

        case "S1.5":
            // After molho: only queijo
            available.push("queijo");
            break;

        case "S2":
            // After queijo is placed
            if (dificuldadeN1 === "dificil") {
                // For difficult: pimentos or fiambre
                available.push("pimentos", "fiambre");
            } else if (dificuldadeN1 === "medio") {
                // For medium: valid toppings only (must have at least 1 before paying)
                available.push("pimentos", "fiambre", "azeitonas", "cogumelos", "bacon", 
                              "milho", "cebola", "oregano", "ananas");
            } else {
                // For easy: valid toppings
                available.push("pimentos", "fiambre", "azeitonas", "cogumelos", "bacon", 
                              "milho", "cebola", "oregano", "ananas");
            }
            break;

        case "S3":
            // After pimentos (difficult mode)
            if (dificuldadeN1 === "dificil") {
                available.push("bacon");
            }
            break;

        case "S4":
            // After fiambre (difficult mode)
            if (dificuldadeN1 === "dificil") {
                available.push("azeitonas");
            }
            break;

        case "S5":
            // After mandatory toppings: more valid toppings
            available.push("pimentos", "fiambre", "azeitonas", "cogumelos", "bacon", 
                          "milho", "cebola", "oregano", "ananas");
            break;

        case "S6":
            // Pizza already paid, nothing more to add
            break;
    }

    return available;
}

function atualizarIngredientesDisponiveis() {
    // Remove all blinking and available classes
    const ingredientDivs = document.querySelectorAll("#ingredientes-n1 div");
    ingredientDivs.forEach(div => {
        div.classList.remove("blinking", "available-ingredient");
    });

    // Only add blinking if enabled
    if (!blinkingEnabled) return;

    // Get next available ingredients
    const available = getNextAvailableIngredients();

    // Add blinking class to available ingredients
    ingredientDivs.forEach(div => {
        const ingName = div.dataset.ingredient;
        if (available.includes(ingName)) {
            div.classList.add("blinking");
        }
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

    const originalTok = tok;
    // normalizar token para comparações (evita Molho / molho / Molho/molho)
    tok = normalizeIngredient(tok);

    /* INGREDIENTE IMPOSSÍVEL */
    if (ingredientesN1_impossiveis_norm.includes(tok)) {
        // não desenhar o topping para ingredientes impossíveis
        return logN1(`❌ O ingrediente '${originalTok}' não pertence à receita da pizza!`);
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
            atualizarIngredientesDisponiveis();
            break;

        case "S1":
            if (tok === "molho") {
                estadoN1 = "S1.5";
                desenharToppingN1(tok, pos);
                logN1("✔ Molho adicionado.");
                atualizarIngredientesDisponiveis();
            }
            else if (tok === "queijo") {
                estadoN1 = "S2";
                queijoUsado = true;
                desenharToppingN1(tok, pos);
                logN1("✔ Queijo adicionado.");
                atualizarIngredientesDisponiveis();
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
                atualizarIngredientesDisponiveis();
            }
            else {
                return logN1("⛔ Falta adicionar o queijo.");
            }
            break;

        case "S2": // queijo já colocado
            if (dificuldadeN1 === "dificil") {
                if (tok === "pimentos") {
                    estadoN1 = "S3";
                    sequence.push("pimentos");
                    desenharToppingN1(tok, pos);
                    logN1(`🥗 ${tok} adicionado.`);
                    atualizarIngredientesDisponiveis();
                } else if (tok === "fiambre") {
                    estadoN1 = "S4";
                    sequence.push("fiambre");
                    desenharToppingN1(tok, pos);
                    logN1(`🥗 ${tok} adicionado.`);
                    atualizarIngredientesDisponiveis();
                } else {
                    return logN1("⛔ Para dificuldade difícil, tens de adicionar pimentos ou fiambre primeiro.");
                }
            } else if (tok === "pagar") {
                if (dificuldadeN1 === "medio" && toppingsAdded === 0) {
                    return logN1("⛔ Tens de adicionar pelo menos um topping antes de pagar!");
                }
                pagamentoN1 = true;
                estadoN1 = "S3";
                logN1("💰 Pagamento efetuado!");
                atualizarIngredientesDisponiveis();
            } else {
                toppingsAdded++;
                desenharToppingN1(tok, pos);
                logN1(`🥗 ${tok} adicionado como topping.`);
                atualizarIngredientesDisponiveis();
            }
            break;

        case "S3":
            if (dificuldadeN1 === "dificil") {
                if (tok === "bacon") {
                    estadoN1 = "S5";
                    sequence.push("bacon");
                    desenharToppingN1(tok, pos);
                    logN1(`🥗 ${tok} adicionado.`);
                    atualizarIngredientesDisponiveis();
                } else {
                    return logN1("⛔ Depois de pimentos, tens de adicionar bacon.");
                }
            } else {
                return logN1("⛔ Pizza já paga! Falta só finalizar.");
            }
            break;

        case "S4":
            if (dificuldadeN1 === "dificil" && tok === "azeitonas") {
                estadoN1 = "S5";
                sequence.push("azeitonas");
                desenharToppingN1(tok, pos);
                logN1(`🥗 ${tok} adicionado.`);
                atualizarIngredientesDisponiveis();
            } else {
                return logN1("⛔ Depois de fiambre, tens de adicionar azeitonas.");
            }
            break;

        case "S5":
            if (tok === "pagar") {
                pagamentoN1 = true;
                estadoN1 = "S6";
                logN1("💰 Pagamento efetuado!");
                atualizarIngredientesDisponiveis();
            } else {
                toppingsAdded++;
                desenharToppingN1(tok, pos);
                logN1(`🥗 ${tok} adicionado como topping.`);
                atualizarIngredientesDisponiveis();
            }
            break;

        case "S6":
            return logN1("⛔ Pizza já paga! Falta só finalizar.");
    }
}

function efetuarPagamentoN1() {
    validarFSM_N1("pagar");
    if (pagamentoN1) sequence.push("pagar");
}

function finalizarPizzaN1() {
    if (!pagamentoN1) {
        return logN1("⛔ Tens de pagar antes de finalizar!");
    }
    // validar contra a expressão regular para a dificuldade atual
    if (!validateFinalPizzaByRegex(dificuldadeN1, sequence)) {
        return logN1("⛔ A pizza não cumpre a expressão regular para a dificuldade atual. Verifica a ordem dos ingredientes e o pagamento.");
    }
    logN1("🎉 Pizza concluída com sucesso!");
    mostrarFormalizacao_N1();
    alert("🍕 Parabéns! Completaste a pizza!");
}

/* ============================================================
   NÍVEL 1 — FORMALIZAÇÃO E TABELA δ
============================================================ */

function mostrarFormalizacao_N1() {

    const text = document.getElementById("formal-text-n1");
    const table = document.getElementById("tabela-delta-n1");

    // Definir o autómato do nível 1
    const fsmN1 = {
        estados: ["S0", "S1", "S1.5", "S2", "S3"],
        inicial: "S0",
        final: "S3",
        trans: {
            "S0": {"massa": "S1"},
            "S1": {"molho": "S1.5", "queijo": "S2"},
            "S1.5": {"queijo": "S2"},
            "S2": {"pagar": "S3"},
            "S3": {}
        }
    };

    let str = "";

    str += "Q = { " + fsmN1.estados.join(", ") + " }\n";
    str += "q0 = " + fsmN1.inicial + "\n";
    str += "F = { " + fsmN1.final + " }\n";
    str += "\nExpressão Regular:\n";
    str += "Massa (molho queijo | queijo) (pimentos|fiambre|azeitonas|cogumelos|bacon|milho|cebola|oregano|ananas|alface|sushi|esparguete|melancia)* pagar\n";
    str += "\nδ:\n";

    for (const e in fsmN1.trans)
        for (const tok in fsmN1.trans[e])
            str += `(${e}, ${tok}) → ${fsmN1.trans[e][tok]}\n`;

    text.textContent = str;

    table.innerHTML = "";

    const header = document.createElement("tr");
    header.innerHTML = "<th>Estado</th><th>Token</th><th>Destino</th>";
    table.appendChild(header);

    for (const e in fsmN1.trans) {
        for (const tok in fsmN1.trans[e]) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${e}</td>
                <td>${tok}</td>
                <td>${fsmN1.trans[e][tok]}</td>
            `;
            table.appendChild(row);
        }
    }
}

/* ============================================================
   NÍVEL 1 — DESENHO DOS TOPPINGS
============================================================ */

function desenharToppingN1(tok, pos) {
    const g = document.getElementById("toppings-n1");

    // registrar token na sequência N1 (tok já deverá estar normalizado quando passado)
    try { if (typeof tok === 'string' && tok.length) sequence.push(tok); } catch(e) { /* ignore */ }

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

/* Normalizador de nomes de ingredientes
   - remove acentos
   - converte para lowercase
   - substitui separadores/pontuação por espaço
   - usa a primeira palavra como forma canónica (evita 'Molho/molho')
*/
function normalizeIngredient(name) {
    if (!name || typeof name !== 'string') return '';
    // remover diacríticos
    let n = name.normalize('NFD').replace(/\p{Diacritic}/gu, '');
    n = n.toLowerCase();
    // substituir quaisquer caracteres não alfanuméricos por espaço
    n = n.replace(/[^a-z0-9]+/g, ' ').trim();
    // usar a primeira palavra como canónica
    const parts = n.split(/\s+/);
    return parts[0] || '';
}

// Conjuntos normalizados para validação rápida
const ingredientesN1_validos_norm = ingredientesN1_validos.map(normalizeIngredient);
const ingredientesN1_impossiveis_norm = ingredientesN1_impossiveis.map(normalizeIngredient);

function getRegexForDifficulty(diff) {
    if (diff === "facil") {
        return "Massa (molho queijo | queijo) (pimentos|fiambre|azeitonas|cogumelos|bacon|milho|cebola|oregano|ananas|alface|sushi|esparguete|melancia)* pagar";
    }
    if (diff === "medio") {
        return "Massa (molho queijo | queijo) (pimentos|fiambre|azeitonas|cogumelos|bacon|milho|cebola|oregano|ananas|alface|sushi|esparguete|melancia)+ pagar";
    }
    if (diff === "dificil") {
        return "Massa molho queijo (pimentos bacon | fiambre azeitonas) (cogumelos|milho|cebola|oregano|ananas|alface|sushi|esparguete|melancia)* pagar";
    }
    return "";
}

// Valida a pizza final contra a expressão regular correspondente à dificuldade
function validateFinalPizzaByRegex(diff, seqArray) {
    const seq = (seqArray || []).join(' ').trim();
    if (!seq) return false;
    const toppings = 'pimentos|fiambre|azeitonas|cogumelos|bacon|milho|cebola|oregano|ananas|alface|sushi|esparguete|melancia';
    let pattern;
    if (diff === 'facil') {
        pattern = new RegExp('^massa (molho queijo|queijo)(?: (' + toppings + '))* pagar$');
    } else if (diff === 'medio') {
        pattern = new RegExp('^massa (molho queijo|queijo) (' + toppings + ')(?: (' + toppings + '))* pagar$');
    } else if (diff === 'dificil') {
        pattern = new RegExp('^massa molho queijo (pimentos bacon|fiambre azeitonas)(?: (' + toppings + '))* pagar$');
    } else {
        return false;
    }
    return pattern.test(seq);
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
   GERAR EXPRESSÃO REGULAR DO FSM
============================================================ */

function generateRegexFromFSM(fsm) {
    function findPaths(current, path, visited) {
        if (current === fsm.final) {
            paths.push(path.slice());
            return;
        }
        if (visited.has(current)) return;
        visited.add(current);
        for (let tok in fsm.trans[current]) {
            const next = fsm.trans[current][tok];
            path.push(tok);
            findPaths(next, path, visited);
            path.pop();
        }
        visited.delete(current);
    }

    let paths = [];
    findPaths(fsm.inicial, [], new Set());

    if (paths.length === 0) return "Sem caminho válido";

    function pathToRegex(p) {
        return p.join(' ');
    }

    if (paths.length === 1) {
        return pathToRegex(paths[0]);
    } else {
        return '(' + paths.map(pathToRegex).join(' | ') + ')';
    }
}

/* ============================================================
   NÍVEL 2 — AUTÓMATO CIRCULAR SVG
============================================================ */

let fsm = null;
let estadoAtual = null;

// Variáveis para zoom e pan do autómato
let zoomScale = 1;
let panOffset = { x: 0, y: 0 };

function iniciarNivel2() {
    document.getElementById("log-n2").innerHTML = "";
    document.getElementById("toppings-n2").innerHTML = "";
    document.getElementById("formal-text").innerHTML = "";
    document.getElementById("tabela-delta").innerHTML = "";

    document.getElementById("fsm-states").innerHTML = "";
    document.getElementById("fsm-trans").innerHTML = "";

    // Reset zoom and pan
    zoomScale = 1;
    panOffset = { x: 0, y: 0 };

    // Esconder expressão regular no nível 2
    document.getElementById("regex-box").style.display = "none";

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
        // For easy mode, use each ingredient only once - shuffle and pick sequentially
        const shuffledIngredients = [...ingredientesBase];
        shuffledIngredients.sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < estados.length - 1; i++) {
            const tok = shuffledIngredients[i % shuffledIngredients.length];
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
    fsm.regex = generateRegexFromFSM(fsm);
    estadoAtual = inicial;

    // Output generated automaton to console in hard mode
    if (dificuldade === "dificil") {
        console.log("Generated Automaton for Level 2 Hard:");
        console.log("States:", fsm.estados);
        console.log("Initial State:", fsm.inicial);
        console.log("Final State:", fsm.final);
        console.log("Transitions:");
        for (const state in fsm.trans) {
            for (const token in fsm.trans[state]) {
                console.log(`(${state}, ${token}) -> ${fsm.trans[state][token]}`);
            }
        }
        console.log("Regex:", fsm.regex);
    }

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

    const coords = {};

    // Function to redraw all transitions
    function redrawTransitions() {
        svgTrans.innerHTML = "";
        
        let transCount = 0;
        console.log("Starting redrawTransitions. fsm.trans keys:", Object.keys(fsm.trans));
        
        try {
            for (const e1 in fsm.trans) {
                for (const tok in fsm.trans[e1]) {
                    transCount++;
                    const e2 = fsm.trans[e1][tok];
                    
                    if (!coords[e1] || !coords[e2]) {
                        console.error(`Missing coords for ${e1} or ${e2}`, { e1Coords: coords[e1], e2Coords: coords[e2] });
                        continue;
                    }

                    const x1 = coords[e1].x;
                    const y1 = coords[e1].y;

                    const x2 = coords[e2].x;
                    const y2 = coords[e2].y;

                    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    p.setAttribute("d", `M ${x1} ${y1} L ${x2} ${y2}`);
                    p.classList.add("fsm-arrow");
                    p.dataset.from = e1;
                    p.dataset.to = e2;
                    p.dataset.label = tok;

                    svgTrans.appendChild(p);

                    // Calculate midpoint on the straight line
                    const midX = (x1 + x2) / 2;
                    const midY = (y1 + y2) / 2;

                    // Calculate angle of the line for text rotation
                    const dx = x2 - x1;
                    const dy = y2 - y1;
                    const length = Math.sqrt(dx * dx + dy * dy);
                    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
                    
                    // Prevent upside-down text by keeping angle between -90 and 90
                    if (angle > 90) {
                        angle -= 180;
                    } else if (angle < -90) {
                        angle += 180;
                    }
                    
                    // Offset perpendicular to line for label placement
                    let labelX = midX;
                    let labelY = midY;

                    if (length > 0) {
                        // Position label slightly offset perpendicular to the line
                        const offset = 25;
                        const perpX = -dy / length * offset;
                        const perpY = dx / length * offset;

                        labelX = midX + perpX;
                        labelY = midY + perpY;
                    }

                    const lbl = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    lbl.setAttribute("x", labelX);
                    lbl.setAttribute("y", labelY);
                    lbl.setAttribute("text-anchor", "middle");
                    lbl.setAttribute("dominant-baseline", "middle");
                    // Rotate text to align with the line
                    lbl.setAttribute("transform", `rotate(${angle} ${labelX} ${labelY})`);
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
        } catch (err) {
            console.error("Error in redrawTransitions:", err);
        }
        console.log(`Drew ${transCount} transitions`);
    }

    const numEstados = fsm.estados.length;
    const centerX = 600;
    const centerY = 300;
    // Raio maior para melhor visibilidade das labels em todas as dificuldades
    const radius = 320;

    fsm.estados.forEach((e, i) => {
        const angle = (i / numEstados) * 2 * Math.PI - Math.PI / 2; // Começar do topo
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        coords[e] = { x, y };

        const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("cx", x);
        c.setAttribute("cy", y);
        c.setAttribute("r", 50);
        c.classList.add("fsm-state");
        if (e === fsm.final) c.classList.add("final");
        if (e === estadoAtual) c.classList.add("active");
        c.dataset.state = e;

        svgStates.appendChild(c);

        const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
        t.setAttribute("x", x);
        t.setAttribute("y", y + 6);
        t.classList.add("state-label");
        t.textContent = e;
        t.dataset.state = e;

        svgStates.appendChild(t);
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
        d.dataset.ingredient = normalizeIngredient(tok);

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

    atualizarIngredientesDisponiveisN2();
    configurarDropN2();
}

/* ============================================================
   NÍVEL 2 — ATUALIZAR INGREDIENTES DISPONÍVEIS (com blinking)
============================================================ */

function getNextAvailableIngredientsN2() {
    const available = [];
    
    if (!fsm || !estadoAtual) return available;
    
    const trans = fsm.trans[estadoAtual];
    if (trans) {
        available.push(...Object.keys(trans));
    }
    
    return available;
}

function atualizarIngredientesDisponiveisN2() {
    const ingredientDivs = document.querySelectorAll("#ingredientes-n2 div");
    const availableIngredients = [];
    
    ingredientDivs.forEach(div => {
        div.classList.remove("blinking");
    });

    // Only add blinking if enabled
    if (!blinkingEnabled) {
        highlightAutomatoTransitions([]);
        return;
    }

    const available = getNextAvailableIngredientsN2();

    ingredientDivs.forEach(div => {
        const ingName = div.dataset.ingredient;
        if (available.includes(ingName)) {
            div.classList.add("blinking");
            availableIngredients.push(ingName);
        }
    });
    
    // Highlight corresponding arrows and labels in the automaton
    highlightAutomatoTransitions(availableIngredients);
}

function highlightAutomatoTransitions(ingredients) {
    // Remove all highlights first
    document.querySelectorAll(".fsm-arrow").forEach(arrow => {
        arrow.classList.remove("active");
    });
    
    document.querySelectorAll(".arrow-label").forEach(label => {
        label.classList.remove("active");
    });
    
    // Only highlight if blinking is enabled
    if (!blinkingEnabled) return;
    
    // Only highlight arrows and labels FROM the current state
    document.querySelectorAll(".fsm-arrow").forEach(arrow => {
        if (arrow.dataset.from === estadoAtual && ingredients.includes(arrow.dataset.label)) {
            arrow.classList.add("active");
        }
    });
    
    document.querySelectorAll(".arrow-label").forEach(label => {
        // Find the corresponding arrow
        const svg = label.ownerSVGElement;
        const arrows = svg.querySelectorAll(".fsm-arrow");
        let isFromCurrentState = false;
        
        for (let arrow of arrows) {
            if (arrow.dataset.from === estadoAtual && arrow.dataset.label === label.textContent) {
                isFromCurrentState = true;
                break;
            }
        }
        
        if (isFromCurrentState && ingredients.includes(label.textContent)) {
            label.classList.add("active");
        }
    });
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
    atualizarIngredientesDisponiveisN2();

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
        if (c.dataset.state === nova) {
            c.classList.add("active");
        }
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
    str += "\nExpressão Regular:\n";
    str += fsm.regex + "\n";
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

    desenharFSM_N2();
}

/* ============================================================
   REINICIAR
============================================================ */

function reiniciar() {
    iniciarNivel(nivelAtual);
}

/* ============================================================
   ESQUEMA DOS AUTÓMATOS
============================================================ */

function mostrarEsquema() {
    document.getElementById("menu-inicial").classList.add("hidden");
    document.getElementById("app").classList.add("hidden");
    document.getElementById("esquema").classList.remove("hidden");
    desenharEsquemas();
}

function desenharEsquemas() {
    desenharEsquemaFacil();
    desenharEsquemaMedio();
    desenharEsquemaDificil();
    renderIngredientesEsquema();
}

function desenharEsquemaFacil() {
    const g = document.getElementById("easy-fsm");
    g.innerHTML = "";

    const states = ["q0", "q1", "q2", "q3"];
    const positions = [50, 200, 350, 500];

    states.forEach((state, i) => {
        const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("cx", positions[i]);
        c.setAttribute("cy", 80);
        c.setAttribute("r", 30);
        c.classList.add("fsm-state");
        if (i === 3) c.classList.add("final");
        if (i === 0) c.classList.add("active");
        g.appendChild(c);

        const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
        t.setAttribute("x", positions[i]);
        t.setAttribute("y", 86);
        t.classList.add("state-label");
        t.textContent = state;
        g.appendChild(t);
    });

    // Arrows
    for (let i = 0; i < 3; i++) {
        const x1 = positions[i];
        const x2 = positions[i + 1];
        const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
        p.setAttribute("d", `M ${x1 + 30} 80 L ${x2 - 30} 80`);
        p.classList.add("fsm-arrow");
        g.appendChild(p);

        // Arrowhead
        const ah = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        ah.setAttribute("points", `${x2 - 30},80 ${x2 - 35},75 ${x2 - 35},85`);
        ah.setAttribute("fill", "#ffb974");
        g.appendChild(ah);

        const lbl = document.createElementNS("http://www.w3.org/2000/svg", "text");
        lbl.setAttribute("x", (x1 + x2) / 2);
        lbl.setAttribute("y", 50);
        lbl.setAttribute("text-anchor", "middle");
        lbl.classList.add("arrow-label");
        lbl.textContent = "ingrediente";
        g.appendChild(lbl);
    }
}

function desenharEsquemaMedio() {
    const g = document.getElementById("medium-fsm");
    g.innerHTML = "";

    const states = ["q0", "q1", "q2", "q3", "q4", "q5"];
    const positions = [50, 150, 250, 350, 450, 550];

    states.forEach((state, i) => {
        const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("cx", positions[i]);
        c.setAttribute("cy", 100);
        c.setAttribute("r", 25);
        c.classList.add("fsm-state");
        if (i === 5) c.classList.add("final");
        if (i === 0) c.classList.add("active");
        g.appendChild(c);

        const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
        t.setAttribute("x", positions[i]);
        t.setAttribute("y", 106);
        t.classList.add("state-label");
        t.textContent = state;
        g.appendChild(t);
    });

    // Main path
    for (let i = 0; i < 5; i++) {
        const x1 = positions[i];
        const x2 = positions[i + 1];
        const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
        p.setAttribute("d", `M ${x1 + 25} 100 L ${x2 - 25} 100`);
        p.classList.add("fsm-arrow");
        g.appendChild(p);

        const ah = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        ah.setAttribute("points", `${x2 - 25},100 ${x2 - 30},95 ${x2 - 30},105`);
        ah.setAttribute("fill", "#ffb974");
        g.appendChild(ah);

        const lbl = document.createElementNS("http://www.w3.org/2000/svg", "text");
        lbl.setAttribute("x", (x1 + x2) / 2);
        lbl.setAttribute("y", 80);
        lbl.setAttribute("text-anchor", "middle");
        lbl.classList.add("arrow-label");
        lbl.textContent = "ingr";
        g.appendChild(lbl);
    }

    // Branches to q2 from q0
    const p2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p2.setAttribute("d", `M 75 75 Q 100 50 250 75`);
    p2.classList.add("fsm-arrow");
    g.appendChild(p2);

    const ah2 = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    ah2.setAttribute("points", `250,75 255,70 255,80`);
    ah2.setAttribute("fill", "#ffb974");
    g.appendChild(ah2);

    const lbl2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    lbl2.setAttribute("x", 160);
    lbl2.setAttribute("y", 50);
    lbl2.setAttribute("text-anchor", "middle");
    lbl2.classList.add("arrow-label");
    lbl2.textContent = "ingr";
    g.appendChild(lbl2);

    // Similar for other branches
    const p3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p3.setAttribute("d", `M 175 125 Q 200 150 350 125`);
    p3.classList.add("fsm-arrow");
    g.appendChild(p3);

    const ah3 = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    ah3.setAttribute("points", `350,125 355,120 355,130`);
    ah3.setAttribute("fill", "#ffb974");
    g.appendChild(ah3);

    const lbl3 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    lbl3.setAttribute("x", 260);
    lbl3.setAttribute("y", 150);
    lbl3.setAttribute("text-anchor", "middle");
    lbl3.classList.add("arrow-label");
    lbl3.textContent = "ingr";
    g.appendChild(lbl3);
}

function desenharEsquemaDificil() {
    const g = document.getElementById("hard-fsm");
    g.innerHTML = "";

    const states = ["q0", "q1", "q2", "q3", "q4", "q5", "q6", "q7"];
    const positions = [50, 120, 190, 260, 330, 400, 470, 540];

    states.forEach((state, i) => {
        const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("cx", positions[i]);
        c.setAttribute("cy", 120);
        c.setAttribute("r", 20);
        c.classList.add("fsm-state");
        if (i === 7) c.classList.add("final");
        if (i === 0) c.classList.add("active");
        g.appendChild(c);

        const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
        t.setAttribute("x", positions[i]);
        t.setAttribute("y", 126);
        t.classList.add("state-label");
        t.textContent = state;
        g.appendChild(t);
    });

    // Main path
    for (let i = 0; i < 7; i++) {
        const x1 = positions[i];
        const x2 = positions[i + 1];
        const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
        p.setAttribute("d", `M ${x1 + 20} 120 L ${x2 - 20} 120`);
        p.classList.add("fsm-arrow");
        g.appendChild(p);

        const ah = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        ah.setAttribute("points", `${x2 - 20},120 ${x2 - 25},115 ${x2 - 25},125`);
        ah.setAttribute("fill", "#ffb974");
        g.appendChild(ah);

        const lbl = document.createElementNS("http://www.w3.org/2000/svg", "text");
        lbl.setAttribute("x", (x1 + x2) / 2);
        lbl.setAttribute("y", 100);
        lbl.setAttribute("text-anchor", "middle");
        lbl.classList.add("arrow-label");
        lbl.textContent = "ingr";
        g.appendChild(lbl);
    }

    // Branches and loops
    // Branch from q0 to q2
    const p1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p1.setAttribute("d", `M 70 100 Q 90 80 190 100`);
    p1.classList.add("fsm-arrow");
    g.appendChild(p1);

    const ah1 = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    ah1.setAttribute("points", `190,100 195,95 195,105`);
    ah1.setAttribute("fill", "#ffb974");
    g.appendChild(ah1);

    const lbl1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    lbl1.setAttribute("x", 130);
    lbl1.setAttribute("y", 80);
    lbl1.setAttribute("text-anchor", "middle");
    lbl1.classList.add("arrow-label");
    lbl1.textContent = "ingr";
    g.appendChild(lbl1);

    // Loop back from q1 to q0
    const loop = document.createElementNS("http://www.w3.org/2000/svg", "path");
    loop.setAttribute("d", `M 120 100 Q 120 70 70 100`);
    loop.classList.add("fsm-arrow");
    g.appendChild(loop);

    const ahloop = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    ahloop.setAttribute("points", `70,100 75,95 75,105`);
    ahloop.setAttribute("fill", "#ffb974");
    g.appendChild(ahloop);

    const lblloop = document.createElementNS("http://www.w3.org/2000/svg", "text");
    lblloop.setAttribute("x", 95);
    lblloop.setAttribute("y", 70);
    lblloop.setAttribute("text-anchor", "middle");
    lblloop.classList.add("arrow-label");
    lblloop.textContent = "ingr";
    g.appendChild(lblloop);

    // Add more branches as needed
    const p2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p2.setAttribute("d", `M 210 140 Q 230 160 330 140`);
    p2.classList.add("fsm-arrow");
    g.appendChild(p2);

    const ah2 = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    ah2.setAttribute("points", `330,140 335,135 335,145`);
    ah2.setAttribute("fill", "#ffb974");
    g.appendChild(ah2);

    const lbl2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    lbl2.setAttribute("x", 270);
    lbl2.setAttribute("y", 160);
    lbl2.setAttribute("text-anchor", "middle");
    lbl2.classList.add("arrow-label");
    lbl2.textContent = "ingr";
    g.appendChild(lbl2);
}

function renderIngredientesEsquema() {
    const lista = document.getElementById("ingredientes-esquema");
    lista.innerHTML = "";

    const todos = [
        "massa", "molho", "queijo", "pimentos", "fiambre",
        "azeitonas", "bacon", "cogumelos", "milho",
        "chocolate", "melancia", "gelado", "gomas", "sushi"
    ];

    todos.forEach(ing => {
        const d = document.createElement("div");

        const img = document.createElement("img");
        const icon = obterIconeIngrediente(ing);
        if (icon) img.src = icon; else img.src = obterIconeIngrediente("queijo");

        const label = document.createElement("div");
        label.className = "label";
        label.textContent = ing;

        d.appendChild(img);
        d.appendChild(label);

        lista.appendChild(d);
    });
}

/* ============================================================
   NÍVEL 3 — CRIAR AUTÓMATO
============================================================ */

let sequenciaN3 = [];
let estadosN3 = [];
let inicialN3 = "";
let finaisN3 = [];
let transicoesN3 = [];

function iniciarNivel3() {
    document.getElementById("log-n3").innerHTML = "";

    // Gerar sequência baseada na dificuldade
    gerarSequenciaN3();

    // Renderizar sequência visualmente
    renderizarSequenciaN3();

    // Limpar definições
    let numEstadosInicial = 4;
    if (dificuldadeN3 === "facil") numEstadosInicial = 3;
    else if (dificuldadeN3 === "medio") numEstadosInicial = 5;
    else numEstadosInicial = 6;

    document.getElementById("num-estados").value = numEstadosInicial;
    gerarEstados();
    document.getElementById("tbody-transicoes").innerHTML = "";
    transicoesN3 = [];
}

function gerarSequenciaN3() {
    const base = ["massa", "molho", "queijo", "pimentos", "fiambre", "azeitonas", "bacon", "cogumelos", "milho", "cebola", "oregano", "ananas", "pagar"];

    if (dificuldadeN3 === "facil") {
        // Sequências simples e lineares
        const patterns = [
            ["massa", "molho", "queijo", "pagar"],
            ["massa", "queijo", "pimentos", "pagar"],
            ["massa", "molho", "queijo", "fiambre", "pagar"]
        ];
        sequenciaN3 = patterns[Math.floor(Math.random() * patterns.length)];
    } else if (dificuldadeN3 === "medio") {
        // Sequências médias com alguma variedade
        let len = Math.floor(Math.random() * 2) + 4; // 4-5
        sequenciaN3 = [];
        for (let i = 0; i < len; i++) {
            sequenciaN3.push(base[Math.floor(Math.random() * base.length)]);
        }
        // Garantir que termina com pagar
        if (sequenciaN3[sequenciaN3.length - 1] !== "pagar") {
            sequenciaN3[sequenciaN3.length - 1] = "pagar";
        }
    } else { // dificil
        // Sequências longas e complexas
        let len = Math.floor(Math.random() * 3) + 6; // 6-8
        sequenciaN3 = [];
        for (let i = 0; i < len; i++) {
            sequenciaN3.push(base[Math.floor(Math.random() * base.length)]);
        }
        // Garantir que termina com pagar
        if (sequenciaN3[sequenciaN3.length - 1] !== "pagar") {
            sequenciaN3[sequenciaN3.length - 1] = "pagar";
        }
    }

    // Output solution to console
    console.log("=== SOLUÇÃO NÍVEL 3 ===");
    console.log("Sequência:", sequenciaN3.join(" → "));
    console.log("\nTransições necessárias:");
    sequenciaN3.forEach((ingredient, i) => {
        console.log(`  (q${i}, ${ingredient}) → q${i + 1}`);
    });
    console.log(`\nEstado inicial: q0`);
    console.log(`Estado final: q${sequenciaN3.length}`);
    console.log(`Número de estados necessários: ${sequenciaN3.length + 1}`);
    console.log("========================");
}

function gerarEstados() {
    const num = parseInt(document.getElementById("num-estados").value);
    estadosN3 = Array.from({ length: num }, (_, i) => "q" + i);

    // Atualizar select inicial
    const selInicial = document.getElementById("estado-inicial");
    selInicial.innerHTML = "";
    estadosN3.forEach(e => {
        const opt = document.createElement("option");
        opt.value = e;
        opt.textContent = e;
        selInicial.appendChild(opt);
    });
    if (estadosN3.length > 0) selInicial.value = estadosN3[0];

    // Atualizar checkboxes finais
    const divFinais = document.getElementById("estados-finais");
    divFinais.innerHTML = "";
    estadosN3.forEach(e => {
        const lbl = document.createElement("label");
        lbl.innerHTML = `<input type="checkbox" value="${e}"> ${e} `;
        divFinais.appendChild(lbl);
    });

    // Atualizar selects nas transições existentes
    atualizarSelectsTransicoes();

    // Adicionar event listeners para atualizar diagrama
    document.getElementById("estado-inicial").addEventListener("change", desenharAutomatoN3);
    document.getElementById("estados-finais").addEventListener("change", desenharAutomatoN3);

    // Atualizar diagrama visual
    desenharAutomatoN3();
}

function atualizarSelectsTransicoes() {
    const rows = document.querySelectorAll("#tbody-transicoes tr");
    rows.forEach(row => {
        const sels = row.querySelectorAll("select");
        sels.forEach(sel => {
            const val = sel.value;
            sel.innerHTML = "";
            estadosN3.forEach(e => {
                const opt = document.createElement("option");
                opt.value = e;
                opt.textContent = e;
                sel.appendChild(opt);
            });
            if (estadosN3.includes(val)) sel.value = val;
        });
    });
}

function adicionarTransicao() {
    const tbody = document.getElementById("tbody-transicoes");
    const row = document.createElement("tr");

    // De
    const tdDe = document.createElement("td");
    const selDe = document.createElement("select");
    estadosN3.forEach(e => {
        const opt = document.createElement("option");
        opt.value = e;
        opt.textContent = e;
        selDe.appendChild(opt);
    });
    tdDe.appendChild(selDe);
    row.appendChild(tdDe);

    // Token
    const tdTok = document.createElement("td");
    const selTok = document.createElement("select");
    
    // Get unique ingredients from sequence
    const uniqueIngredients = [...new Set(sequenciaN3)];
    uniqueIngredients.forEach(ing => {
        const opt = document.createElement("option");
        opt.value = ing;
        opt.textContent = ing;
        selTok.appendChild(opt);
    });
    
    tdTok.appendChild(selTok);
    row.appendChild(tdTok);

    // Para
    const tdPara = document.createElement("td");
    const selPara = document.createElement("select");
    estadosN3.forEach(e => {
        const opt = document.createElement("option");
        opt.value = e;
        opt.textContent = e;
        selPara.appendChild(opt);
    });
    tdPara.appendChild(selPara);
    row.appendChild(tdPara);

    // Ação
    const tdAcao = document.createElement("td");
    const btnRem = document.createElement("button");
    btnRem.textContent = "Remover";
    btnRem.onclick = () => { tbody.removeChild(row); desenharAutomatoN3(); };
    tdAcao.appendChild(btnRem);
    row.appendChild(tdAcao);

    tbody.appendChild(row);

    // Adicionar event listeners para atualizar diagrama quando selects mudam
    selDe.addEventListener("change", desenharAutomatoN3);
    selPara.addEventListener("change", desenharAutomatoN3);
    selTok.addEventListener("change", desenharAutomatoN3);

    // Atualizar diagrama
    desenharAutomatoN3();
}

function validarAutomatoN3() {
    document.getElementById("log-n3").innerHTML = "";

    // Coletar dados
    inicialN3 = document.getElementById("estado-inicial").value;
    finaisN3 = Array.from(document.querySelectorAll("#estados-finais input:checked")).map(cb => cb.value);

    transicoesN3 = [];
    const rows = document.querySelectorAll("#tbody-transicoes tr");
    rows.forEach(row => {
        const sels = row.querySelectorAll("select");
        if (sels.length >= 3) {
            const de = sels[0].value;
            const tok = sels[1].value;
            const para = sels[2].value;
            if (tok) {
                transicoesN3.push({ de, tok, para });
            }
        }
    });

    // Verificações básicas
    if (!inicialN3) {
        logN3("❌ Estado inicial não definido.");
        return;
    }
    if (finaisN3.length === 0) {
        logN3("❌ Nenhum estado final selecionado.");
        return;
    }
    if (transicoesN3.length === 0) {
        logN3("❌ Nenhuma transição definida.");
        return;
    }

    // Construir FSM
    const fsm = { estados: estadosN3, inicial: inicialN3, finais: finaisN3, trans: {} };
    estadosN3.forEach(e => fsm.trans[e] = {});
    transicoesN3.forEach(t => {
        if (fsm.trans[t.de][t.tok]) {
            logN3(`❌ Transição duplicada: (${t.de}, ${t.tok}) já existe.`);
            return;
        }
        fsm.trans[t.de][t.tok] = t.para;
    });

    // Simular na sequência
    let estadoAtual = inicialN3;
    let erro = false;
    for (let i = 0; i < sequenciaN3.length; i++) {
        const tok = sequenciaN3[i];
        const trans = fsm.trans[estadoAtual];
        if (!trans || !trans[tok]) {
            logN3(`❌ Falta transição: (${estadoAtual}, ${tok}) não definida.`);
            erro = true;
            break;
        }
        estadoAtual = trans[tok];
    }

    if (!erro && !finaisN3.includes(estadoAtual)) {
        logN3(`❌ Estado final incorreto: terminou em ${estadoAtual}, mas estados finais são ${finaisN3.join(", ")}.`);
        erro = true;
    }

    if (!erro) {
        logN3("🎉 Parabéns! Criaste o autómato correto!");
        alert("🍕 Parabéns! Criaste a tua pizza!");
    }
}

function renderizarSequenciaN3() {
    const container = document.getElementById("sequencia-n3");
    container.innerHTML = "";

    sequenciaN3.forEach((ing, index) => {
        const span = document.createElement("span");
        span.className = "ingredient-text";
        span.textContent = ing;
        container.appendChild(span);

        if (index < sequenciaN3.length - 1) {
            const arrow = document.createElement("span");
            arrow.className = "arrow";
            arrow.textContent = "→";
            container.appendChild(arrow);
        }
    });
}

function desenharAutomatoN3() {
    const svgStates = document.getElementById("fsm-states-n3");
    const svgTrans = document.getElementById("fsm-trans-n3");

    svgStates.innerHTML = "";
    svgTrans.innerHTML = "";

    if (estadosN3.length === 0) return;

    // Collect current transitions from table for live preview
    const currentTransitions = [];
    const rows = document.querySelectorAll("#tbody-transicoes tr");
    rows.forEach(row => {
        const sels = row.querySelectorAll("select");
        if (sels.length >= 3) {
            const de = sels[0].value;
            const tok = sels[1].value;
            const para = sels[2].value;
            if (tok) {
                currentTransitions.push({ de, tok, para });
            }
        }
    });

    const coords = {};

    // Posicionar estados em círculo para melhor visualização
    const centerX = 600;
    const centerY = 200;
    const radius = 150;

    estadosN3.forEach((e, i) => {
        const angle = (i / estadosN3.length) * 2 * Math.PI - Math.PI / 2; // Começar do topo
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        coords[e] = { x, y };

        // Grupo para cada estado
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.classList.add("state-group");

        // Círculo do estado
        const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("cx", x);
        c.setAttribute("cy", y);
        c.setAttribute("r", 45);
        c.classList.add("fsm-state");

        // Estado inicial - seta verde maior
        if (e === inicialN3) {
            c.classList.add("initial");
            const arrow = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            arrow.setAttribute("points", `${x - 70},${y} ${x - 55},${y - 8} ${x - 55},${y + 8}`);
            arrow.setAttribute("fill", "#00ff00");
            arrow.setAttribute("stroke", "#00aa00");
            arrow.setAttribute("stroke-width", "2");
            g.appendChild(arrow);
        }

        // Estado final - borda dupla mais grossa
        if (finaisN3.includes(e)) {
            c.classList.add("final");
            // Adicionar segunda borda para estados finais
            const outerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            outerCircle.setAttribute("cx", x);
            outerCircle.setAttribute("cy", y);
            outerCircle.setAttribute("r", 50);
            outerCircle.setAttribute("fill", "none");
            outerCircle.setAttribute("stroke", "#ff4444");
            outerCircle.setAttribute("stroke-width", "4");
            g.appendChild(outerCircle);
        }

        g.appendChild(c);

        // Label do estado
        const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
        t.setAttribute("x", x);
        t.setAttribute("y", y + 6);
        t.classList.add("state-label");
        t.textContent = e;
        g.appendChild(t);

        svgStates.appendChild(g);
    });

    // Desenhar transições com melhor visual
    currentTransitions.forEach((t, index) => {
        const x1 = coords[t.de].x;
        const y1 = coords[t.de].y;
        const x2 = coords[t.para].x;
        const y2 = coords[t.para].y;

        // Verificar se é uma transição para si mesmo (loop)
        if (t.de === t.para) {
            // Desenhar loop acima do estado
            const loopRadius = 25;
            const loopCenterX = x1;
            const loopCenterY = y1 - 60;

            const loop = document.createElementNS("http://www.w3.org/2000/svg", "path");
            loop.setAttribute("d", `M ${x1 + 35} ${y1} Q ${loopCenterX} ${loopCenterY} ${x1 - 35} ${y1}`);
            loop.setAttribute("fill", "none");
            loop.setAttribute("stroke", "#ffb974");
            loop.setAttribute("stroke-width", "3");
            loop.classList.add("fsm-arrow");
            svgTrans.appendChild(loop);

            // Ponta da seta para loop
            const arrow = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            arrow.setAttribute("points", `${x1 - 35},${y1} ${x1 - 25},${y1 + 5} ${x1 - 30},${y1 + 10}`);
            arrow.setAttribute("fill", "#ffb974");
            svgTrans.appendChild(arrow);

            // Label para loop
            const lbl = document.createElementNS("http://www.w3.org/2000/svg", "text");
            lbl.setAttribute("x", loopCenterX);
            lbl.setAttribute("y", loopCenterY - 15);
            lbl.setAttribute("text-anchor", "middle");
            lbl.classList.add("arrow-label");
            lbl.textContent = t.tok;
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
        } else {
            // Transição normal
            // Curvar a linha se for transição para trás ou para frente
            let controlY = y1 - 80; // Curva acima
            let midX = (x1 + x2) / 2;
            let midY = (y1 + y2) / 2;
            const spacing = 150; // Distance threshold for long transitions

            if (Math.abs(x2 - x1) > spacing) {
                // Transição longa, usar linha reta
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", x1 + 45);
                line.setAttribute("y1", y1);
                line.setAttribute("x2", x2 - 45);
                line.setAttribute("y2", y2);
                line.setAttribute("stroke", "#ffb974");
                line.setAttribute("stroke-width", "3");
                line.setAttribute("marker-end", "url(#arrowhead-n3)");
                svgTrans.appendChild(line);
            } else {
                // Transição curta, usar linha reta simples
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", x1 + 45);
                line.setAttribute("y1", y1);
                line.setAttribute("x2", x2 - 45);
                line.setAttribute("y2", y2);
                line.setAttribute("stroke", "#ffb974");
                line.setAttribute("stroke-width", "3");
                line.setAttribute("marker-end", "url(#arrowhead-n3)");
                svgTrans.appendChild(line);
            }

            // Label da transição
            const lbl = document.createElementNS("http://www.w3.org/2000/svg", "text");
            lbl.setAttribute("x", midX);
            lbl.setAttribute("y", midY - 60);
            lbl.setAttribute("text-anchor", "middle");
            lbl.classList.add("arrow-label");
            lbl.textContent = t.tok;
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
    });

    // Adicionar definições de marcadores de seta
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", "arrowhead-n3");
    marker.setAttribute("markerWidth", "10");
    marker.setAttribute("markerHeight", "7");
    marker.setAttribute("refX", "9");
    marker.setAttribute("refY", "3.5");
    marker.setAttribute("orient", "auto");

    const arrowPolygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    arrowPolygon.setAttribute("points", "0 0, 10 3.5, 0 7");
    arrowPolygon.setAttribute("fill", "#ffb974");
    marker.appendChild(arrowPolygon);
    defs.appendChild(marker);
    svgTrans.appendChild(defs);
}

function logN3(msg) {
    const li = document.createElement("li");
    li.innerText = msg;
    document.getElementById("log-n3").appendChild(li);
}
