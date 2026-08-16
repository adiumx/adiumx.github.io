let tablero = new Array(9).fill("");
let juegoActivo = true;
const celdas = document.querySelectorAll(".celda");
console.log(celdas);

const combinaciones = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Función para verificar si hay un ganador
function verificarGanador(jugador) {
    for (let combinacion of combinaciones) {
        if (
            tablero[combinacion[0]] === jugador &&
            tablero[combinacion[1]] === jugador &&
            tablero[combinacion[2]] === jugador
        ) {
            return true;
        }
    }
    return false;
}

// Función para verificar si hay empate
function verificarEmpate() {
    return tablero.every(celda => celda !== "");
}

const boton = document.getElementById("reiniciar");
boton.addEventListener("click", function() {
    tablero.fill("");
    juegoActivo = true;
    celdas.forEach(celda => {
        celda.classList.remove("x");
        celda.classList.remove("o");
    });
});
celdas.forEach(celda => {
    celda.addEventListener("click", () => {
        // Verificar si el juego aún está activo
        if (!juegoActivo) {
            return;
        }

        console.log(celda.dataset.index);
        const indice = celda.dataset.index;
        
        if (tablero[indice] !== "") {
            return;
        }
        
        tablero[indice] = "X";
        celda.classList.add("x");
        console.log(tablero);

        // Verificar si X gana
        if (verificarGanador("X")) {
            document.querySelector("h2").textContent = "¡Gana X!";
            console.log("¡Gana X!");
            juegoActivo = false;
            return;
        }

        // Verificar empate
        if (verificarEmpate()) {
            document.querySelector("h2").textContent = "¡Empate!";
            console.log("¡Empate!");
            juegoActivo = false;
            return;
        }

        // Turno de la máquina (O)
        let posicionMaquina = Math.floor(Math.random() * 9);

        while (tablero[posicionMaquina] !== "") {
            posicionMaquina = Math.floor(Math.random() * 9);
        }

        tablero[posicionMaquina] = "O";
        celdas[posicionMaquina].classList.add("o");
        console.log(tablero);

        // Verificar si O gana
        if (verificarGanador("O")) {
            document.querySelector("h2").textContent = "¡Gana O!";
            console.log("¡Gana O!");
            juegoActivo = false;
            return;
        }

        // Verificar empate
        if (verificarEmpate()) {
            console.log("¡Empate!");
            juegoActivo = false;
            return;
        }
    });
});
