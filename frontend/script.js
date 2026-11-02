
"use strict";

// ==========================================
// 1. DATOS INICIALES
// ==========================================

const nodes = ["A", "B", "C", "D"];

const edges = [
    ["A", "B", 4],
    ["A", "C", 2],
    ["C", "D", 1],
    ["D", "B", 3]
];

let result = null;
let steps = [];
let currentStep = -1;
let timer = null;


// ==========================================
// 2. REFERENCIAS HTML
// ==========================================

const $ = (id) => document.getElementById(id);

const cyContainer = $("cy");


// ==========================================
// 3. INICIALIZAR CYTOSCAPE
// ==========================================

const cy = cytoscape({
    container: cyContainer,

    elements: [],

    style: [
        {
            selector: "node",
            style: {
                "background-color": "#64748b",
                "label": "data(id)",
                "color": "#ffffff",
                "text-valign": "center",
                "text-halign": "center",
                "font-size": "16px",
                "font-weight": "bold",
                "width": 48,
                "height": 48,
                "border-width": 2,
                "border-color": "#94a3b8"
            }
        },
        {
            selector: "edge",
            style: {
                "width": 2,
                "line-color": "#64748b",
                "target-arrow-color": "#64748b",
                "target-arrow-shape": "triangle",
                "curve-style": "bezier",
                "label": "data(weight)",
                "color": "#cbd5e1",
                "font-size": "13px",
                "text-background-color": "#0b1425",
                "text-background-opacity": 1,
                "text-background-padding": "4px"
            }
        },
        {
            selector: ".current",
            style: {
                "background-color": "#eab308",
                "border-color": "#fef08a",
                "border-width": 4
            }
        },
        {
            selector: ".visited",
            style: {
                "background-color": "#2563eb",
                "border-color": "#60a5fa"
            }
        },
        {
            selector: ".optimal",
            style: {
                "background-color": "#16a34a",
                "border-color": "#86efac",
                "border-width": 4
            }
        },
        {
            selector: ".active-edge",
            style: {
                "line-color": "#facc15",
                "target-arrow-color": "#facc15",
                "width": 5
            }
        },
        {
            selector: ".optimal-edge",
            style: {
                "line-color": "#22c55e",
                "target-arrow-color": "#22c55e",
                "width": 5
            }
        }
    ],

    layout: {
        name: "cose",
        animate: true,
        padding: 40
    }
});


// ==========================================
// 4. DIBUJAR EL GRAFO
// ==========================================

function drawGraph() {

    cy.elements().remove();

    nodes.forEach((node) => {

        cy.add({
            group: "nodes",
            data: {
                id: node
            }
        });

    });

    edges.forEach((edge, index) => {

        const [from, to, weight] = edge;

        cy.add({
            group: "edges",
            data: {
                id: `edge-${index}`,
                source: from,
                target: to,
                weight: weight
            }
        });

    });

    updateEdgeDirection();

    cy.layout({
        name: "cose",
        animate: true,
        padding: 40
    }).run();

    updateSelectors();
    updateGraphCount();
}


function updateEdgeDirection() {

    const directed = $("directed").value === "true";

    cy.edges().style({
        "target-arrow-shape": directed ? "triangle" : "none"
    });

}


// ==========================================
// 5. ACTUALIZAR SELECTORES
// ==========================================

function updateSelectors() {

    const source = $("source");
    const target = $("target");

    const oldSource = source.value;
    const oldTarget = target.value;

    source.innerHTML = "";
    target.innerHTML = "";

    nodes.forEach((node) => {

        source.add(new Option(node, node));
        target.add(new Option(node, node));

    });

    if (nodes.includes(oldSource)) {
        source.value = oldSource;
    }

    if (nodes.includes(oldTarget)) {
        target.value = oldTarget;
    }

}


function updateGraphCount() {

    $("graphCount").textContent =
        `${nodes.length} nodos · ${edges.length} aristas`;

}


// ==========================================
// 6. NOTIFICACIONES
// ==========================================

function notify(message) {

    const box = $("notification");

    box.textContent = message;
    box.style.display = "block";

    setTimeout(() => {
        box.style.display = "none";
    }, 2500);

}


// ==========================================
// 7. DETENER REPRODUCCIÓN
// ==========================================

function stopPlayback() {

    if (timer !== null) {
        clearInterval(timer);
        timer = null;
    }

    $("playPause").textContent = "▶ Reproducir";

}


// ==========================================
// 8. INVALIDAR RESULTADOS
// ==========================================

function invalidateSimulation() {

    stopPlayback();

    result = null;
    steps = [];
    currentStep = -1;

    $("shortestPath").textContent = "--";
    $("totalCost").textContent = "--";

    $("distanceTable").innerHTML =
        '<p class="muted">Ejecuta Dijkstra para ver los resultados.</p>';

    $("stepInfo").textContent =
        "Grafo modificado. Ejecuta nuevamente el algoritmo.";

    $("progressBar").style.width = "0%";

    cy.elements().removeClass(
        "current visited optimal active-edge optimal-edge"
    );

}


// ==========================================
// 9. AGREGAR NODOS
// ==========================================

$("addNode").addEventListener("click", () => {

    const name = $("nodeName").value.trim();

    if (!name) {
        notify("Escribe un nombre para el nodo.");
        return;
    }

    if (nodes.includes(name)) {
        notify("Ese nodo ya existe.");
        return;
    }

    nodes.push(name);

    $("nodeName").value = "";

    invalidateSimulation();
    drawGraph();

    notify("Nodo agregado correctamente.");

});


// ==========================================
// 10. AGREGAR ARISTAS
// ==========================================

$("addEdge").addEventListener("click", () => {

    const from = $("edgeFrom").value.trim();
    const to = $("edgeTo").value.trim();

    const weightInput = $("edgeWeight");
    const weight = Number(weightInput.value);

    if (!nodes.includes(from) || !nodes.includes(to)) {
        notify("Los nodos deben existir.");
        return;
    }

    if (from === to) {
        notify("No se permiten conexiones de un nodo consigo mismo.");
        return;
    }

    if (
        weightInput.value.trim() === "" ||
        !Number.isFinite(weight) ||
        weight < 0
    ) {
        notify("Introduce un peso válido y no negativo.");
        return;
    }

    edges.push([from, to, weight]);

    $("edgeFrom").value = "";
    $("edgeTo").value = "";
    weightInput.value = "";

    invalidateSimulation();
    drawGraph();

    notify("Conexión agregada correctamente.");

});


// ==========================================
// 11. CAMBIAR TIPO DE GRAFO
// ==========================================

$("directed").addEventListener("change", () => {

    invalidateSimulation();
    updateEdgeDirection();

});


// ==========================================
// 12. LIMPIAR GRAFO
// ==========================================

$("clearGraph").addEventListener("click", () => {

    stopPlayback();

    nodes.length = 0;
    edges.length = 0;

    invalidateSimulation();
    drawGraph();

    notify("Grafo limpiado.");

});


// ==========================================
// 13. EJECUTAR DIJKSTRA
// ==========================================

$("runAlgorithm").addEventListener("click", async () => {

    stopPlayback();

    if (nodes.length === 0) {
        notify("Primero agrega nodos.");
        return;
    }

    const source = $("source").value;
    const target = $("target").value;

    if (!source || !target) {
        notify("Selecciona origen y destino.");
        return;
    }

    const payload = {
        nodes: [...nodes],
        edges: edges.map(edge => [...edge]),
        source: source,
        target: target,
        directed: $("directed").value === "true"
    };

    const button = $("runAlgorithm");

    button.disabled = true;
    button.textContent = "Calculando...";

    try {

        const response = await fetch("/api/dijkstra", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Error del servidor.");
        }

        if (!Array.isArray(data.pasos)) {
            throw new Error("El backend no devolvió los pasos.");
        }

        result = data;
        steps = data.pasos;

        currentStep = -1;

        showResults(data);
        resetVisualization();

        notify("¡Dijkstra ejecutado correctamente!");

    } catch (error) {

        console.error(error);
        notify(error.message);

    } finally {

        button.disabled = false;
        button.textContent = "▶ Ejecutar Dijkstra";

    }

});


// ==========================================
// 14. MOSTRAR RESULTADOS
// ==========================================

function showResults(data) {

    $("shortestPath").textContent =
        data.camino && data.camino.length > 0
            ? data.camino.join(" → ")
            : "No existe una ruta";

    $("totalCost").textContent =
        data.cost !== null && data.cost !== undefined
            ? data.cost
            : "∞";

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Nodo</th>
                    <th>Distancia mínima</th>
                </tr>
            </thead>
            <tbody>
    `;

    Object.entries(data.distancias).forEach(([node, distance]) => {

        html += `
            <tr>
                <td>${node}</td>
                <td>${distance !== null ? distance : "∞"}</td>
            </tr>
        `;

    });

    html += `
            </tbody>
        </table>
    `;

    $("distanceTable").innerHTML = html;

}


// ==========================================
// 15. REINICIAR VISUALIZACIÓN
// ==========================================

function resetVisualization() {

    stopPlayback();

    currentStep = -1;

    cy.elements().removeClass(
        "current visited optimal active-edge optimal-edge"
    );

    $("progressBar").style.width = "0%";

    $("stepInfo").textContent =
        "Listo para iniciar la simulación.";

}


// ==========================================
// 16. VISUALIZAR UN PASO
// ==========================================

function renderStep(index) {

    if (index < 0 || index >= steps.length) {
        return;
    }

    currentStep = index;

    const step = steps[index];

    cy.elements().removeClass(
        "current visited optimal active-edge optimal-edge"
    );

    // Marcar nodos visitados
    (step.visitados || []).forEach((node) => {

        const element = cy.getElementById(node);

        if (element.length) {
            element.addClass("visited");
        }

    });

    // Marcar nodo actual
    const currentNode = cy.getElementById(step.actual);

    if (currentNode.length) {
        currentNode.removeClass("visited");
        currentNode.addClass("current");
    }

    // Marcar arista que se está evaluando
    if (step.arista) {

        const [from, to, weight] = step.arista;

        const edge = cy.edges().filter((element) => {

            return (
                element.data("source") === from &&
                element.data("target") === to &&
                Number(element.data("weight")) === Number(weight)
            );

        }).first();

        if (edge.length) {
            edge.addClass("active-edge");
        }

    }

    // Actualizar barra de progreso
    const progress = ((index + 1) / steps.length) * 100;

    $("progressBar").style.width = `${progress}%`;

    // Descripción del paso
    let description = "";

    if (step.tipo === "vis") {

        description = `Visitando el nodo ${step.actual}`;

    } else if (step.tipo === "ex_arista") {

        description = `Evaluando arista ${step.arista.join(" → ")}`;

        if (step.actualizado) {
            description += ". Se actualizó la distancia.";
        } else {
            description += ". No se encontró una mejora.";
        }

    }

    $("stepInfo").textContent =
        `Paso ${index + 1} de ${steps.length}: ${description}`;

    // Terminar simulación
    if (index === steps.length - 1) {

        highlightOptimalPath();

        $("stepInfo").textContent +=
            " Simulación terminada.";

    }

}


// ==========================================
// 17. RESALTAR CAMINO ÓPTIMO
// ==========================================

function highlightOptimalPath() {

    if (!result || !result.camino || result.camino.length === 0) {
        return;
    }

    cy.elements().removeClass(
        "current visited active-edge"
    );

    result.camino.forEach((node) => {

        const element = cy.getElementById(node);

        if (element.length) {
            element.addClass("optimal");
        }

    });

    for (let i = 0; i < result.camino.length - 1; i++) {

        const from = result.camino[i];
        const to = result.camino[i + 1];

        const edge = cy.edges().filter((element) => {

            return (
                element.data("source") === from &&
                element.data("target") === to
            );

        });

        edge.addClass("optimal-edge");

    }

}


// ==========================================
// 18. BOTÓN SIGUIENTE
// ==========================================

$("nextStep").addEventListener("click", () => {

    stopPlayback();

    if (currentStep < steps.length - 1) {
        renderStep(currentStep + 1);
    }

});


// ==========================================
// 19. BOTÓN ANTERIOR
// ==========================================

$("prevStep").addEventListener("click", () => {

    stopPlayback();

    if (currentStep > 0) {
        renderStep(currentStep - 1);
    }

});


// ==========================================
// 20. BOTÓN REINICIAR
// ==========================================

$("resetSteps").addEventListener("click", () => {

    resetVisualization();

});


// ==========================================
// 21. REPRODUCIR / PAUSAR
// ==========================================

$("playPause").addEventListener("click", () => {

    if (steps.length === 0) {
        notify("Primero ejecuta Dijkstra.");
        return;
    }

    if (timer !== null) {
        stopPlayback();
        return;
    }

    if (currentStep >= steps.length - 1) {
        resetVisualization();
    }

    $("playPause").textContent = "⏸ Pausar";

    timer = setInterval(() => {

        if (currentStep < steps.length - 1) {

            renderStep(currentStep + 1);

        } else {

            stopPlayback();

        }

    }, 900);

});


// ==========================================
// 22. INICIALIZAR APLICACIÓN
// ==========================================

drawGraph();

console.log("PathFinder iniciado correctamente.");
