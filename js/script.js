// Script para el menú hamburguesa
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('navLinks');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // --- Lógica del Carrusel (Basado en Andros Fenollosa) ---
    const ARTICULOS = document.querySelectorAll('.articulos-container article');
    const TIEMPO_INTERVALO_MILESIMAS_SEG = 3000;
    let posicionActual = 0;
    let $botonRetroceder = document.querySelector('#retroceder');
    let $botonAvanzar = document.querySelector('#avanzar');
    let $botonPlay = document.querySelector('#play');
    let $botonStop = document.querySelector('#stop');
    let intervalo;

    /**
     * Función que cambia a la tarjeta en la siguiente posición
     */
    function pasarFoto() {
        if (posicionActual >= ARTICULOS.length - 1) {
            posicionActual = 0;
        } else {
            posicionActual++;
        }
        renderizarImagen();
    }

    /**
     * Función que cambia a la tarjeta en la anterior posición
     */
    function retrocederFoto() {
        if (posicionActual <= 0) {
            posicionActual = ARTICULOS.length - 1;
        } else {
            posicionActual--;
        }
        renderizarImagen();
    }

    /**
     * Función que actualiza la tarjeta visible dependiendo de posicionActual
     */
    function renderizarImagen() {
        ARTICULOS.forEach((articulo, index) => {
            if (index === posicionActual) {
                articulo.style.display = 'block';
            } else {
                articulo.style.display = 'none';
            }
        });
    }

    /**
     * Activa el autoplay del carrusel
     */
    function playIntervalo() {
        intervalo = setInterval(pasarFoto, TIEMPO_INTERVALO_MILESIMAS_SEG);
        // Desactivamos los botones de control
        $botonAvanzar.setAttribute('disabled', true);
        $botonRetroceder.setAttribute('disabled', true);
        $botonPlay.setAttribute('disabled', true);
        $botonStop.removeAttribute('disabled');
    }

    /**
     * Para el autoplay del carrusel
     */
    function stopIntervalo() {
        clearInterval(intervalo);
        // Activamos los botones de control
        $botonAvanzar.removeAttribute('disabled');
        $botonRetroceder.removeAttribute('disabled');
        $botonPlay.removeAttribute('disabled');
        $botonStop.setAttribute('disabled', true);
    }

    // Eventos del carrusel
    $botonAvanzar.addEventListener('click', pasarFoto);
    $botonRetroceder.addEventListener('click', retrocederFoto);
    $botonPlay.addEventListener('click', playIntervalo);
    $botonStop.addEventListener('click', stopIntervalo);

    // Iniciar mostrando el primer artículo
    renderizarImagen();
});

// Botón oscuro y claro
const botonOscuro = document.querySelector('.btn-dark');

botonOscuro.addEventListener('click', () => {
    if (document.body.classList.contains('dark-mode')) {
        document.body.classList.remove('dark-mode');
        botonOscuro.textContent = 'Modo Oscuro';
    } else {
        botonOscuro.textContent = 'Modo Claro';
        document.body.classList.toggle('dark-mode');
    }
});

// --- Lógica para mostrar la información y el documento en un Alert ---
const botonesSaberMas = document.querySelectorAll('.btn-saber-mas');

botonesSaberMas.forEach(boton => {
    boton.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Encuentra el contenedor del artículo
        const contenidoBlog = boton.closest('.blog-content');
        
        // Extrae los datos del HTML
        const tituloArticulo = contenidoBlog.querySelector('h2').textContent;
        const textoArticulo = contenidoBlog.querySelector('p').textContent;
        const infoExtra = boton.getAttribute('data-complementaria');
        
        // Muestra la información organizada en la ventana emergente tipo alert
        alert(`📖 ${tituloArticulo}\n\n${textoArticulo}\n\n📄 INFORMACIÓN COMPLEMENTARIA / DOCUMENTO:\n${infoExtra}`);
    });
});