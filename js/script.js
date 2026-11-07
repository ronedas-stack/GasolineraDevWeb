
// Script para el menú hamburguesa (No comprobamos si existe el mobile-menu y navLinks, ya que asumimos que siempre estarán presentes en el HTML)
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('navLinks');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
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

// Al hacer clic en cualquier botón "Saber más"
botonesSaberMas.forEach(boton => {
    boton.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Encuentra el contenedor del artículo
        const contenidoBlog = boton.closest('.blog-content');
        
        // Extrae los datos del HTML
        const tituloArticulo = contenidoBlog.querySelector('h2').textContent;
        const textoArticulo = contenidoBlog.querySelector('p').textContent;
        const infoExtra = boton.getAttribute('data-complementaria'); // Captura la info única del botón
        
        // Muestra la información organizada en la ventana emergente tipo alert
        alert(`📖 ${tituloArticulo}\n\n${textoArticulo}\n\n📄 INFORMACIÓN COMPLEMENTARIA / DOCUMENTO:\n${infoExtra}`);
    });
});