/**
 * Constantes
 */
var OUTPUT_LINEAL     = true;
var RATIO_APRENDIZAJE = 0.3;
var USO_INERCIA       = true;
var RATIO_INERCIA    = 0.5;

/**
 * Clase de una red Neuronal al completo
 */
class RedNeuronal
{
    /**
    * Constructor por defecto del objeto
    */
    constructor(nNeuronasInput, nNeuronasHidden, nNeuronasOutput) 
    {
        this.capaEntrada = new Capa(nNeuronasInput );
        this.capaOculta  = new Capa(nNeuronasHidden);
        this.capaSalida  = new Capa(nNeuronasOutput);

        this.capaEntrada.inicializar(null            , this.capaOculta);
        this.capaOculta.inicializar (this.capaEntrada, this.capaSalida);
        this.capaSalida.inicializar (this.capaOculta , null);

        this.capaEntrada.AsignarPesosAleatorios();
        this.capaOculta.AsignarPesosAleatorios();

    }

    /**
     * Pone valores de neuronas
     */
    setInput(i, valor)
    {
        this.capaEntrada.valoresNeuronas[i] = valor;
    }

    /**
     * Devuelve el valor de la capa de salida
     */
    getOutput(i)
    {
        return this.capaSalida.valoresNeuronas[i];
    }

    /**
     * Actualiza los pesos (por ejemplo)
     */
    feedForward()
    {
        this.capaOculta.calcularValoresNeuronas();
        this.capaSalida.calcularValoresNeuronas();

    }

    /**
     * Obtiene el valor maximo
     */
    getMaxOutputId()
    {
        id = -1;
        max = Number.MIN_VALUE;

        for(let i = 0; i < this.capaSalida.numeroNeuronas ; i++)
        {
            if (this.capaSalida.valoresNeuronas[i] > max)
            {
                max = this.capaSalida.valoresNeuronas[i];
                id = i;
            }
        }

        return id;  
    }

    /**
     * Determinamos cual es el output deseado
     */
    setOutputDeseado(i, valor)
    {
        this.capaSalida.valoresDeseados[i] = valor;
    }

    /**
     * Propagacion hacia atras
     */
    backPropagation()
    {
        this.capaSalida.calcularErrores();
        this.capaOculta.calcularErrores();

        this.capaOculta.ajustarPesos();
        this.capaEntrada.ajustarPesos();
    }

    /**
     * Calculamos el error total de las capas
     */
    calcularError()
    {
        let error = 0;
        for(let i = 0; i < this.capaSalida.numeroNeuronas; i++)
        {
            error += Math.pow(this.capaSalida.valoresNeuronas[i] - this.capaSalida.valoresDeseados[i], 2);
        }
        error /= this.capaSalida.numeroNeuronas;

        return error;
    }

}

/**
 * Clase capa
 */
class Capa 
{
    /**
     * Constructor por defecto del objeto
     */
    constructor(nNeuronas) 
    {
        this.numeroNeuronas              = nNeuronas;
        this.pesos                       = new Array();
        this.biasValores                 = new Array();
        this.biasPesos                   = new Array();
        this.valoresNeuronas             = new Array();

        this.pesosIncremento             = new Array();
        this.valoresDeseados             = new Array();
        this.errores                     = new Array();

        this.capaAnterior                = null;
        this.capaSiguiente               = null;
    }

    /**
     * Inicializamos la capa
     */
    inicializar(anterior, siguiente)
    {

        this.valoresNeuronas    = new Array(this.numeroNeuronas);
        this.valoresDeseados    = new Array(this.numeroNeuronas);
        this.errores            = new Array(this.numeroNeuronas);

        this.capaAnterior       = anterior;
        this.capaSiguiente      = siguiente;

        if(siguiente != undefined || siguiente != null)
        {
         
            this.capaSiguiente  = siguiente;

            this.pesos          = new Array(this.numeroNeuronas);

            for(let i = 0; i < this.numeroNeuronas; i++)
            {
                this.pesos[i] = new Array(siguiente.numeroNeuronas);
            }

            this.biasValores    = new Array(siguiente.numeroNeuronas);
            this.biasPesos      = new Array(siguiente.numeroNeuronas);

            for(let i = 0; i < this.biasValores.length; i++)
            {
               this.biasPesos[i] = -1;
            }


        }
        else
        {
            this.capaSiguiente   = null;
            this.pesos           = null;
            this.pesosIncremento = null;
            this.biasValores     = null;
            this.biasPesos       = null;

        }

        for(let i = 0; i < this.numeroNeuronas; i++)
        {
            this.valoresNeuronas[i] = 0;
            this.valoresDeseados[i] = 0;
            this.errores[i]         = 0;
        }

    }

    /**
     * Asignamos unos pesos aleatorios a nuestra red neuronal
     */
    AsignarPesosAleatorios()
    {

        if(this.capaSiguiente != null)
        {
            for(let i = 0; i < this.numeroNeuronas; i++)
            {
                for(let j = 0; j < this.capaSiguiente.numeroNeuronas; j++)
                {
                    this.pesos[i][j] = (-1) + ((1) - (-1)) * Math.random();
                }

            }

            this.biasPesos.forEach(function (item)
            {
                item = (-1) + ((1) - (-1)) * Math.random();
            });
        }

    }

    /**
     * Calculamos los valores de las neuronas
     */
    calcularValoresNeuronas()
    {
        if(this.capaAnterior != null)
        {
            for(let j = 0; j < this.numeroNeuronas; j++)
            {
                let x = 0;

                for(let i = 0; i < this.capaAnterior.numeroNeuronas; i++)
                {
                    x += this.capaAnterior.valoresNeuronas[i] * this.capaAnterior.pesos[i][j];
                }

                x += this.capaAnterior.biasValores[j] * this.capaAnterior.biasPesos[j];

                if(this.capaSiguiente == null && OUTPUT_LINEAL)
                {
                    this.valoresNeuronas[j] = x;
                }
                else
                {
                    this.valoresNeuronas[j] = 1.0 / (1 + Math.exp(-x));
                }
            }

          
        }
    }

    /**
     * Cualcula los errores de los pesos
     */
    calcularErrores()
    {
        if(this.capaSiguiente == null)
        {
            for(let i = 0; i < this.numeroNeuronas; i++)
            {
                this.errores[i] = (valoresDeseados[i] - this.valoresNeuronas[i]) *
                                  this.valoresNeuronas[i] *
                                  (1 - this.valoresNeuronas[i]);
            }
        }
        else if(this.capaAnterior != null)
        {
            for(let i = 0; i < this.numeroNeuronas; i++)
            {
                let suma = 0;
                for(let j = 0; j < this.capaSiguiente.numeroNeuronas; j++)
                {
                    suma += this.capaSiguiente.errores[i] * this.pesos[i][j];
                }

                this.errores[i] = suma * this.valoresNeuronas[i] * (1 - this.valoresNeuronas[i]);
            }
        }

    }

    /**
     * Se reajustan los pesos
     */
    ajustarPesos()
    {
        if(this.capaSiguiente != null)
        {
            for(let i = 0; i < this.numeroNeuronas; i++)
            {
                for(let j = 0; j < this.capaSiguiente.numeroNeuronas; j++)
                {
                    let dw = RATIO_APRENDIZAJE * this.capaSiguiente.errores[j] * this.capaSiguiente.valoresNeuronas[j];

                    if(USO_INERCIA)
                    {
                        pesos[i][j] += dw + RATIO_INERCIA * this.pesosIncremento[i][j];
                        this.pesosIncremento[i][j] = dw;
                    }
                    else
                    {
                        pesos[i][j] += dw;
                    }
                }
            }

            for(let j = 0; j < this.capaSiguiente.numeroNeuronas; j++)
            {
                let dw = RATIO_APRENDIZAJE * this.capaSiguiente.errores[j] * this.biasValores[j];
                this.biasPesos[j] += dw;
            }

        }
    }

}

let red = new RedNeuronal(5,5,5);