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

function selectBox(box, isMachine = false) {

    
    if (TURNO === "MIN" || (TURNO === "MAX" && isMachine) ){
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
            turnoDeMAX(TABLERO)

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
    $("#TextoFinal")[0].innerText = "¡Tres en raya!";
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

    var movimientoGanador = MINIMAX(_tablero, 1);
 
    setTimeout(function(){
        selectBox(movimientoGanador.index, true);
    }, 500);

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


function generarSucesores(_tablero) {

    let sucesores = [];

    for (let i = 0; i < _tablero.length; i++) {
        if (_tablero[i] === "undefined") {
            sucesores.push(i);
        }
    }

    return sucesores;


}




let LIMITE = 4;
/**
 * Algoritmo de MINMAX para obtener la mejor jugada
 * TURNO == 1 -- MAX - TURNO == 2 -- MIN
 */
function MINIMAX(_tablero, _turno) {

    let sucesores = generarSucesores(_tablero, _turno);
    //Casos finales
    if (esGanador(_tablero, 1)) //AI WIN
        return { score: 10 };
    else if (esGanador(_tablero, 2)) //PLAYER WIN
        return { score: -10 };
    else if (sucesores.length == 0)
        return { score: 0 };

    let moves = []; //collect the scores from each of the empty spots to evaluate them later    

    for (let i = 0; i < sucesores.length; i++) {
        var move = {};
        move.index = sucesores[i]; //setting the index number of the empty spot, that was store as a number in the origBoard, to the index property of the move object
        _tablero[sucesores[i]] = _turno == 1 ? "MAX" : "MIN";

        if (_turno == 1) {

            let valor = MINIMAX(_tablero, 2);
            move.score = valor.score;

        } else {

            let valor = MINIMAX(_tablero, 1);
            move.score = valor.score;

        }

        _tablero[sucesores[i]] = "undefined"; // minimax resets newBoard to what it was before

        moves.push(move);

    }

    var bestMove; //minimax algorithm evaluates the best move in the moves array
    if (_turno == 1) {  //choosing the highest score when AI is playing and the lowest score when the human is playing            
        var bestScore = -10000; //if the player is AI player, it sets variable bestScore to a very low number
        for (var i = 0; i < moves.length; i++) { //looping through the moves array
            if (moves[i].score > bestScore) { //if a move has a higher score than the bestScore, the algorithm stores that move
                bestScore = moves[i].score;
                bestMove = i; //if there are moves with similar scores, only the first will be stored
            }
        }
    } else { // when human Player
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) { //minimax looks for a move with the lowest score to store
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove]; //returning object stored in bestMove





}