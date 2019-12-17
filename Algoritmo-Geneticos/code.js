$(document).ready(function() {

    var PoblacionContainer = document.getElementById("Container");

    /*
     * Clase que maneja el mundo donde se va a desarrollar el algoritmo
     */
    class Mundo {

        /*
         * Constructor del objeto mundo
         */
        constructor() {

            this.statsNames = ["Temperatura", "Agua", "Sol", "Nutrientes", "Insectos", "Viento"];
            this.statsValues = new Array(this.statsNames.length);
            this.maxRange = 100;

            for (let i = 0; i < this.statsValues.length; i++) {
                this.statsValues[i] = Math.random() * (this.maxRange);
            }

            this.color = this.arrayToColor(this.statsValues);
        }

        /*
         * Convierte el las stats a un color en especifico
         */
        arrayToColor(stats) {

            let r = ((stats[0] + stats[1]) / 2 / this.maxRange) * 255;
            let g = ((stats[2] + stats[3]) / 2 / this.maxRange) * 255;
            let b = ((stats[4] + stats[5]) / 2 / this.maxRange) * 255;

            // 1 ------- 255
            // 0.8 -----  x

            return [r, g, b];
        }

    }

    /*
     * Clase que muta las distintas flores
     */
    class Flor {

        /*
         * Contruccion del objeto suelo
         */
        constructor(_id, _mundo) {

            this.cromosomas = [];
            this.orden = 0;
            this.aptitud = 0;
            this.id = _id;
            this.mundo = _mundo;
            this.color;

            PoblacionContainer.innerHTML += ("<div class='flor' id='" + this.id + "'></div>");

        }

        /*
         * Se calcula la aptitud de cada flor para ser de un color u otro.
         * 0 es el peor valor posible, y 1 el mejor posible
         */
        calcularAptitud() {

            let distancia = 0;

            for (let i = 0; i < this.cromosomas.length; i++) {
                distancia += Math.abs(this.cromosomas[i] - this.mundo.statsValues[i]);
            }

            this.aptitud = 1 - (distancia / this.cromosomas.length - this.mundo.maxRange);

        }

        /**
         * Funcion que inicializa la flor
         */
        Initialize() {

            this.cromosomas = new Array(this.mundo.statsNames.length);

            for (let i = 0; i < this.cromosomas.length; i++) {

                this.cromosomas[i] = Math.random() * (this.mundo.maxRange);

            }

            this.calcularAptitud();
            this.color = this.mundo.arrayToColor(this.cromosomas);

            // 0 ------------ 19
            // 1 ----------   69
            // aptitud ----  x

            $("#" + this.id).css({
                "background-color": "rgb(" + this.color[0] + "," + this.color[1] + "," + this.color[2] + ")",
                position: "abosolute",
                top: (19 + (50) * (this.aptitud / 100)) + "vh",
                left: "100px"
            });
        }

        /**
         * Funcion que inicializa la flor
         */
        copy(_cromosomas) {

            this.cromosomas = _cromosomas;
            this.calcularAptitud();
            this.color = this.mundo.arrayToColor(this.cromosomas);

            $("#" + this.id).css({
                "background-color": "rgb(" + this.color[0] + "," + this.color[1] + "," + this.color[2] + ")",
                position: "abosolute",
                top: (19 + (69 - 19) * this.aptitud / 100) + "vh",
                left: "100px"
            });

        }
    }

    /**
     * Controlador del algoritmo
     */
    class Controlador {

        /**
         * Contructor del objeto controlador
         */
        constructor(_mundo) {

            this.poblacionSize = 20;
            this.flores = [];
            this.mundo = _mundo;

            this.ratioPadres = 0.25;

            this.primeraGeneracion();
        }

        /**
         * Se genera la primera generacion
         */
        primeraGeneracion() {

            this.flores = new Array(this.poblacionSize);

            for (let i = 0; i < this.flores.length; i++) {

                this.flores[i] = new Flor("florNumero" + i, this.mundo);

                this.flores[i].Initialize();

            }

        }

        /**
         * Reordenamos la siguiente generacion
         */
        siguienteGeneracion() {

            //Se ordenan comparando las flores
            this.flores.sort(function(a, b) {

                if (a.aptitud === b.aptitud)
                    return 0;
                else if (a.aptitud < b.aptitud)
                    return 1;
                else
                    return 1;
            });

            let numPadres = Math.floor(this.poblacionSize * this.ratioPadres);

            let nuevaGeneracion = new Array(this.poblacionSize);

            PoblacionContainer.innerHTML = "";

            for (let i = 0; i < nuevaGeneracion.length; i++) {

                let nuevoCromosomas = new Array(this.mundo.statsNames.length);

                //Todos los padres son elegibles para cada cromosoma
                //Alternativamente: Se eligen X padres de los mas aptos y en el random solo se permiten esos padres
                for (let j = 0; j < nuevoCromosomas.length; j++) {
                    nuevoCromosomas[j] = this.flores[Math.floor(Math.random() * (numPadres))].cromosomas[j];
                }

                nuevaGeneracion[i] = new Flor("florNumero" + i, this.mundo);
                nuevaGeneracion[i].copy(nuevoCromosomas);

            }


        }

    }


    var mundo = new Mundo();
    var controlador = new Controlador(mundo);

    $("#SiguienteGenracion").click(function() {
        controlador.siguienteGeneracion();
    });


});