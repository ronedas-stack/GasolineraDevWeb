
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
            iconoMenu.classList.remove('bi-grid');
            iconoMenu.classList.add('bi-grid-fill');
        } else {
            botonOscuro.textContent = 'Modo Claro';
            document.body.classList.toggle('dark-mode');
            iconoMenu.classList.remove('bi-grid-fill');
            iconoMenu.classList.add('bi-grid');
        }
        
    });

