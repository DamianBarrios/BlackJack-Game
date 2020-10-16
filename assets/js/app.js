const miModulo = (() => {
    'use strict'    
    
    let deck = [];
    const tipos = ["C","D","H","S"],
          especiales = ["A","J","Q","K"];

    let puntosJugadores = [];

    //Referencias
    const btnPedir = document.querySelector("#btnPedir"),
          btnDetener = document.querySelector("#btnDetener"),
          btnNuevo = document.querySelector("#btnNuevo"),      
          divCartasJugadores = document.querySelectorAll(".divCartas"),
          puntosHtml = document.querySelectorAll("small");

    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = [];
        for(let i = 0; i< numJugadores; i++){
            puntosJugadores.push(0);
        }
        puntosHtml.forEach(elem => elem.innerText = 0);
        divCartasJugadores.forEach(elem => elem.innerHTML = "");
        btnDetener.disabled = false;
        btnPedir.disabled = false;
    }
    
    //Esta funcion crea un nuevo deck
    const crearDeck = () => {

        deck = [];
        for(let i = 2 ; i <= 10 ; i++){
            for(let letras of tipos){
                deck.push(i + letras);
            }

        }

        for(let tipo of tipos){
            for(let esp of especiales){
                deck.push(esp + tipo)
            }
        }
 
        return _.shuffle(deck);
    
    }

    //Funcion que permite tomar una carta
    const pedirCarta = () => {
        if ( deck.length === 0){
            throw "No hay mas cartas";
        }
        return deck.pop();
    }

    const valorCarta = (carta) => {
        const valor = carta.substring(0,carta.length -1)       
        return (isNaN(valor)) ?
                (valor === "A") ? 11 : 10
                : valor * 1; 
    }

    const acumularPuntos = (carta , turno) => {
        puntosJugadores[turno] += valorCarta(carta);
        puntosHtml[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    };

    const crearCarta = (carta , turno) => {
        const mostrarCarta = document.createElement("img");
        mostrarCarta.src = `assets/cartas/${ carta }.png`;
        mostrarCarta.classList.add("carta");
        divCartasJugadores[turno].append(mostrarCarta);
    }

    const determinarGanador = () => {
        
        const [puntosMinimos, puntosComputadora] = puntosJugadores;
        setTimeout(() => {
            if(puntosMinimos <= 21 && puntosMinimos > puntosComputadora || puntosComputadora > 21){
                alert("Gana el jugador!");
            }else if(puntosJugadores[0] > 21 || puntosComputadora > puntosMinimos && puntosComputadora <= 21){
                alert("Gana la computadora!");
            }else if(puntosComputadora === puntosMinimos){
                alert("Empate!");
            }

        },100);
    }

    //Turno computadora
    const turnoComputadora = (puntosMinimos) => {

        let puntosComputadora = 0;
        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length -1);
            crearCarta(carta, puntosJugadores.length -1);

        }while((puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));

        determinarGanador();
    };

    //Eventos

    btnPedir.addEventListener("click",() =>{

        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta , 0 )

        crearCarta(carta, 0);

        if(puntosJugador > 21){
            console.warn("Perdiste!");
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
            
        } else if (puntosJugador === 21) {
            console.warn("Excelente!");
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
            
        }

    }); 

    btnDetener.addEventListener("click", () => {
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugadores[0]);
        
    });

    btnNuevo.addEventListener("click", () => {
        inicializarJuego();
    });

    return {
       nuevoJuego: inicializarJuego
    };
})();




 