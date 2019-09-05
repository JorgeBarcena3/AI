let TURNO = "MIN"; //MIN ES EL JUGADOR
let TABLERO = [
    "undefined", "undefined", "undefined",
    "undefined", "undefined", "undefined",
    "undefined", "undefined", "undefined"
];


function crearTablero() {
    let tablero = $(".GameContainer")[0];
    Array.from(tablero.children).forEach(element => {
        element.classList = [];
        if (parseInt(element.id, 10) % 2 == 0) {
            element.classList.add("game-field");
            element.classList.add("blue");
        } else {
            element.classList.add("game-field");
            element.classList.add("green");
        }

    });
}

function selectBox(box) {

    if (TURNO != "") {
        let object = $("#" + box)[0];

        if (object.classList.contains("blue"))
            object.classList.remove("blue");
        else if (object.classList.contains("green"))
            object.classList.remove("green");
        else
            return false;

        let numeroCasilla = parseInt(box, 10);

        if (TURNO === "MIN") { //TURNO DEL JUGADOR
            TABLERO[numeroCasilla] = "MIN";
            object.classList.add("purple");
            TURNO = "MAX";
        } else {
            TABLERO[numeroCasilla] = "MAX";
            object.classList.add("orange");
            TURNO = "MIN";
        }

        if (checkIfGanador()) {
            mostrarGanador();
            acabarElJuego();
            return true;
        }

        if (TURNO === "MAX") {
            turnoDeMAX(TABLERO);
        }
    }

}

function acabarElJuego() {
    TURNO = "";
}

function restart() {
    TURNO = "MIN"; //MIN ES EL JUGADOR
    TABLERO = [
        "undefined", "undefined", "undefined",
        "undefined", "undefined", "undefined",
        "undefined", "undefined", "undefined"
    ];
    $("#TextoFinal")[0].innerText = "";
    crearTablero();
}

function mostrarGanador() {
    let panel = $("#TextoFinal")[0];
    if (TURNO === "MIN") //GANA MAX
        panel.innerText = "Ha ganado la Máquina";
    else if (TURNO === "MAX") //GANA MIN
        panel.innerText = "Has ganado tú";
    else
        panel.innerText = "Hemos empatado";

}

function checkIfGanador() {

    let comprobar = "MAX"; // Por defecto compruebo para MAX
    if (TURNO === "MAX") //Compruebo para MIN
        comprobar = "MIN";
    if (
        (TABLERO[2] === comprobar && TABLERO[5] === comprobar && TABLERO[8] === comprobar) ||
        (TABLERO[0] === comprobar && TABLERO[1] === comprobar && TABLERO[2] === comprobar) ||
        (TABLERO[3] === comprobar && TABLERO[4] === comprobar && TABLERO[5] === comprobar) ||
        (TABLERO[6] === comprobar && TABLERO[7] === comprobar && TABLERO[8] === comprobar) ||
        (TABLERO[0] === comprobar && TABLERO[3] === comprobar && TABLERO[6] === comprobar) ||
        (TABLERO[1] === comprobar && TABLERO[4] === comprobar && TABLERO[7] === comprobar) ||
        (TABLERO[0] === comprobar && TABLERO[4] === comprobar && TABLERO[8] === comprobar) ||
        (TABLERO[6] === comprobar && TABLERO[4] === comprobar && TABLERO[2] === comprobar)
    ) {
        return true
    }

    if (!TABLERO.includes("undefined")) //HEMOS EMPATADO
    {
        TURNO = "";
        return true;
    }

    return false;
}

function turnoDeMAX(_tablero) {
    let pos;

    var movimientoGanador = MINIMAX(_tablero, 1, 0, -10, +10);
    for (let i = 0; i < _tablero.length; i++) {
        if (_tablero[i] != movimientoGanador.tablero[i]) {
            pos = i;
        }
    }

    selectBox(pos.toString());

}

/**
 * Returns a random integer between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function esGanador(_tablero, _turno) {

    let comprobar = _turno == 1 ? "MAX" : "MIN"; // Por defecto compruebo para MAX

    if (
        (_tablero[2] === comprobar && _tablero[5] === comprobar && _tablero[8] === comprobar) ||
        (_tablero[0] === comprobar && _tablero[1] === comprobar && _tablero[2] === comprobar) ||
        (_tablero[3] === comprobar && _tablero[4] === comprobar && _tablero[5] === comprobar) ||
        (_tablero[6] === comprobar && _tablero[7] === comprobar && _tablero[8] === comprobar) ||
        (_tablero[0] === comprobar && _tablero[3] === comprobar && _tablero[6] === comprobar) ||
        (_tablero[1] === comprobar && _tablero[4] === comprobar && _tablero[7] === comprobar) ||
        (_tablero[0] === comprobar && _tablero[4] === comprobar && _tablero[8] === comprobar) ||
        (_tablero[6] === comprobar && _tablero[4] === comprobar && _tablero[2] === comprobar)
    ) {
        return true
    }

    return false;
}

function esPerdedor(_tablero, _turno) {

    let comprobar = _turno == 1 ? "MAX" : "MIN"; // Por defecto compruebo para MAX

    if (
        (_tablero[2] === comprobar && _tablero[5] === comprobar && _tablero[8] === comprobar) ||
        (_tablero[0] === comprobar && _tablero[1] === comprobar && _tablero[2] === comprobar) ||
        (_tablero[3] === comprobar && _tablero[4] === comprobar && _tablero[5] === comprobar) ||
        (_tablero[6] === comprobar && _tablero[7] === comprobar && _tablero[8] === comprobar) ||
        (_tablero[0] === comprobar && _tablero[3] === comprobar && _tablero[6] === comprobar) ||
        (_tablero[1] === comprobar && _tablero[4] === comprobar && _tablero[7] === comprobar) ||
        (_tablero[0] === comprobar && _tablero[4] === comprobar && _tablero[8] === comprobar) ||
        (_tablero[6] === comprobar && _tablero[4] === comprobar && _tablero[2] === comprobar)
    ) {
        return true
    }

    return false;
}

function esEmpate(_tablero) {
    let index = 0;
    for (element of _tablero) {
        if (element === "undefined")
            index++;
    }

    if (index <= 0)
        return true;
    return false;
}

function generarSucesores(_tablero, _turno) {

    let turno = _turno == 1 ? "MAX" : "MIN";
    let undefinedIndex = new Array();
    for (let i = 0; i < _tablero.length; i++) {
        if (_tablero[i] === "undefined") undefinedIndex.push(i);
    }
    let tableros = new Array();
    for (let i = 0; i < undefinedIndex.length; i++) {
        let __tablero = [..._tablero];
        __tablero[undefinedIndex[i]] = turno;
        tableros.push(__tablero);
    }

    return tableros;

}

function max(a, b) {
    if (a.value >= b.value) {
        a.tablero = b.tablero;
        return a;
    }
    return b;
}

function min(a, b) {
    if (a.value <= b.value) {
        a.tablero = b.tablero;
        return a;
    }
    return b;
}

function evaluacion(_tablero) {

}

let LIMITE = 3;
/**
 * Algoritmo de MINMAX para obtener la mejor jugada
 * TURNO == 1 -- MAX - TURNO == 2 -- MIN
 */
function MINIMAX(_tablero, _turno, _nivel, alpha, beta) {
    //Casos finales
    if (esGanador(_tablero, _turno))
        return { value: 10, tablero: _tablero };
    else if (esPerdedor(_tablero, _turno))
        return { value: -10, tablero: _tablero };
    else if (esEmpate(_tablero))
        return { value: 0, tablero: _tablero };
    else if (_turno == 1) { //Turno de max
        let mejorVal;

        let sucesores = generarSucesores(_tablero, _turno);
        for (let element of sucesores) {
            mejorVal = { value: -10000, tablero: element };
            let valor = MINIMAX(element, 2, _nivel + 1, alpha, beta);
            mejorVal = max(valor, mejorVal);
            alpha = Math.max(alpha, mejorVal.value);
            if (beta <= alpha)
                break;

        }
        return mejorVal;

    } else { //ES MIN

        let mejorVal;
        let sucesores = generarSucesores(_tablero, _turno);
        for (let element of sucesores) {
            mejorVal = { value: 10000, tablero: element };
            let valor = MINIMAX(element, 1, _nivel + 1, alpha, beta);
            mejorVal = min(valor, mejorVal);
            beta = Math.min(beta, mejorVal.value);
            if (beta <= alpha)
                break;

        }
        return mejorVal;
    }
}