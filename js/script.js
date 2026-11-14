document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Menú Hamburguesa ---
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('navLinks');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // --- 2. Gestión de Artículos con Almacenamiento Permanente (localStorage) ---
    const STORAGE_KEY = 'tu_gasolinera_posts_v1';
    const USERS_STORAGE_KEY = 'tu_gasolinera_users_v1';
    const SESSION_STORAGE_KEY = 'tu_gasolinera_active_user';
    const contenedorArticulos = document.getElementById('imagen');

    const articulosIniciales = [
        {
            id: 'post-1',
            clase: 'art1',
            imagen: 'media/eficiencia.png',
            alt: 'Precio combustibles',
            titulo: 'Nuevos precios de los combustibles',
            contenido: 'Descubre cómo han fluctuado las tarifas en las principales gasolineras del país durante este mes y dónde repostar más barato.',
            complementaria: 'Informe técnico detallado: Las gasolineras low cost han registrado una bajada del 2.3% en promedio de sus carburantes. Documento oficial refrendado por la Asociación de Consumidores.'
        },
        {
            id: 'post-2',
            clase: 'art2',
            imagen: 'media/precios.png',
            alt: 'Ahorrar gasolina',
            titulo: 'Cómo ahorrar gasolina en ciudad',
            contenido: 'Consejos prácticos de conducción eficiente que te ayudarán a reducir notablemente el consumo de combustible en tus trayectos diarios.',
            complementaria: 'Guía de conducción eficiente v4.2: Mantener las revoluciones entre 2000 y 2500 RPM reduce hasta un 15% el gasto en trayectos urbanos cortos. Incluye infografía descargable.'
        },
        {
            id: 'post-3',
            clase: 'art3',
            imagen: 'media/calidad.png',
            alt: 'Gasolineras low cost',
            titulo: 'El auge de las gasolineras Low Cost',
            contenido: 'Analizamos la calidad de los carburantes económicos frente a las marcas tradicionales y si realmente merece la pena repostar en ellas.',
            complementaria: 'Estudio comparativo de aditivos: Los análisis de laboratorio demuestran que el combustible base cumple estrictamente con la normativa europea, diferenciándose únicamente en el paquete de aditivos finales.'
        }
    ];

    function obtenerPosts() {
        const guardados = localStorage.getItem(STORAGE_KEY);
        if (guardados) {
            try {
                return JSON.parse(guardados);
            } catch (e) {
                console.error("Error leyendo localStorage:", e);
            }
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(articulosIniciales));
        return [...articulosIniciales];
    }

    function guardarPosts(listaPosts) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(listaPosts));
    }

    let posts = obtenerPosts();

    // --- 3. Función Reutilizable para Abrir el Modal "Saber Más" ---
    const modalSaberMas = document.getElementById('modalSaberMas');
    const modalTituloTexto = document.getElementById('modal-titulo-texto');
    const modalTexto = document.getElementById('modal-texto');
    const modalComplementaria = document.getElementById('modal-complementaria');
    const btnCerrarModalSaberMas = document.getElementById('cerrarModal');

    function abrirSaberMas(post) {
        if (!post) return;
        modalTituloTexto.textContent = post.titulo;
        modalTexto.textContent = post.contenido;
        modalComplementaria.textContent = post.complementaria || `Artículo publicado en Tu Gasolinera. Imagen asignada: ${post.imagen}`;
        modalSaberMas.classList.add('active');
    }

    if (btnCerrarModalSaberMas) {
        btnCerrarModalSaberMas.addEventListener('click', () => {
            modalSaberMas.classList.remove('active');
        });
    }

    // --- 4. Lógica del Carrusel (3 Artículos Visibles) ---
    const ARTICULOS_VISIBLES = 3;
    const TIEMPO_INTERVALO_MILESIMAS_SEG = 3000;
    let posicionActual = 0;
    const $botonRetroceder = document.querySelector('#retroceder');
    const $botonAvanzar = document.querySelector('#avanzar');
    const $botonPlay = document.querySelector('#play');
    const $botonStop = document.querySelector('#stop');
    let intervalo = null;

    function construirDOMArticulos() {
        contenedorArticulos.innerHTML = '';

        if (posts.length === 0) {
            contenedorArticulos.innerHTML = '<div class="empty-carousel-msg">No hay artículos publicados. Añade un nuevo post desde el menú.</div>';
            return;
        }

        posts.forEach((post, idx) => {
            const article = document.createElement('article');
            article.className = post.clase || `art${(idx % 3) + 1}`;
            article.setAttribute('data-id', post.id);

            const img = document.createElement('img');
            img.src = post.imagen;
            img.alt = post.alt || post.titulo;
            img.className = 'blog-img';

            const contentDiv = document.createElement('div');
            contentDiv.className = 'blog-content';

            const h2 = document.createElement('h2');
            h2.textContent = post.titulo;

            const p = document.createElement('p');
            p.textContent = post.contenido;

            const btn = document.createElement('button');
            btn.className = 'btn-saber-mas';
            btn.setAttribute('data-id', post.id);
            btn.setAttribute('data-complementaria', post.complementaria || `Artículo publicado en Tu Gasolinera. Imagen asignada: ${post.imagen}`);
            btn.textContent = 'Saber más';

            contentDiv.appendChild(h2);
            contentDiv.appendChild(p);
            contentDiv.appendChild(btn);

            article.appendChild(img);
            article.appendChild(contentDiv);

            contenedorArticulos.appendChild(article);
        });
    }

    function renderizarImagen() {
        const articulosDOM = contenedorArticulos.querySelectorAll('article');
        const total = articulosDOM.length;

        if (total === 0) return;

        if (posicionActual >= total) {
            posicionActual = 0;
        }

        const cantidadAMostrar = Math.min(ARTICULOS_VISIBLES, total);
        const indicesVisibles = [];

        for (let i = 0; i < cantidadAMostrar; i++) {
            indicesVisibles.push((posicionActual + i) % total);
        }

        articulosDOM.forEach((articulo, index) => {
            const ordenEnCarrusel = indicesVisibles.indexOf(index);
            if (ordenEnCarrusel !== -1) {
                articulo.style.display = 'flex';
                articulo.style.order = String(ordenEnCarrusel + 1);
            } else {
                articulo.style.display = 'none';
                articulo.style.order = '';
            }
        });
    }

    function pasarFoto() {
        if (posts.length === 0) return;
        if (posicionActual >= posts.length - 1) {
            posicionActual = 0;
        } else {
            posicionActual++;
        }
        renderizarImagen();
    }

    function retrocederFoto() {
        if (posts.length === 0) return;
        if (posicionActual <= 0) {
            posicionActual = posts.length - 1;
        } else {
            posicionActual--;
        }
        renderizarImagen();
    }

    function playIntervalo() {
        if (intervalo) clearInterval(intervalo);
        intervalo = setInterval(pasarFoto, TIEMPO_INTERVALO_MILESIMAS_SEG);
        $botonAvanzar.setAttribute('disabled', true);
        $botonRetroceder.setAttribute('disabled', true);
        $botonPlay.setAttribute('disabled', true);
        $botonStop.removeAttribute('disabled');
    }

    function stopIntervalo() {
        clearInterval(intervalo);
        intervalo = null;
        $botonAvanzar.removeAttribute('disabled');
        $botonRetroceder.removeAttribute('disabled');
        $botonPlay.removeAttribute('disabled');
        $botonStop.setAttribute('disabled', true);
    }

    $botonAvanzar.addEventListener('click', pasarFoto);
    $botonRetroceder.addEventListener('click', retrocederFoto);
    $botonPlay.addEventListener('click', playIntervalo);
    $botonStop.addEventListener('click', stopIntervalo);

    // Delegación de eventos para botones "Saber más" en el carrusel
    contenedorArticulos.addEventListener('click', (e) => {
        const boton = e.target.closest('.btn-saber-mas');
        if (!boton) return;
        e.preventDefault();

        const postId = boton.getAttribute('data-id');
        const postEncontrado = posts.find(p => p.id === postId);

        if (postEncontrado) {
            abrirSaberMas(postEncontrado);
        } else {
            const contenidoBlog = boton.closest('.blog-content');
            abrirSaberMas({
                titulo: contenidoBlog.querySelector('h2').textContent,
                contenido: contenidoBlog.querySelector('p').textContent,
                complementaria: boton.getAttribute('data-complementaria')
            });
        }
    });

    // --- 5. Buscador de Noticias del Blog (con apertura de "Saber más" al pulsar) ---
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');

    function ejecutarBusqueda() {
        const query = searchInput.value.trim().toLowerCase();
        searchResults.innerHTML = '';

        if (!query) {
            searchResults.innerHTML = '<p class="placeholder-text">Escribe una palabra clave para buscar en los artículos del blog.</p>';
            return;
        }

        const resultados = posts.filter(post =>
            post.titulo.toLowerCase().includes(query) ||
            post.contenido.toLowerCase().includes(query) ||
            (post.complementaria && post.complementaria.toLowerCase().includes(query))
        );

        if (resultados.length === 0) {
            searchResults.innerHTML = `<p class="placeholder-text">No se encontraron noticias que coincidan con "${searchInput.value.trim()}".</p>`;
            return;
        }

        const ul = document.createElement('ul');
        ul.className = 'search-result-list';

        resultados.forEach(post => {
            const li = document.createElement('li');
            li.className = 'search-result-item';
            li.title = 'Haz clic para abrir Saber más';

            const h4 = document.createElement('h4');
            h4.innerHTML = `<i class="bi bi-journal-text"></i> ${post.titulo}`;

            const p = document.createElement('p');
            p.textContent = post.contenido;

            li.appendChild(h4);
            li.appendChild(p);

            // Al pulsar el resultado, se abre directamente la ventana "Saber más" de ese artículo
            li.addEventListener('click', () => {
                abrirSaberMas(post);
            });

            ul.appendChild(li);
        });

        searchResults.appendChild(ul);
    }

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', ejecutarBusqueda);
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                ejecutarBusqueda();
            }
        });
    }

    // --- 6. Botón "Ver más detalles" (Información General Emergente) ---
    const btnDetalles = document.getElementById('btnDetalles');
    const modalDetalles = document.getElementById('modalDetalles');
    const cerrarDetalles = document.getElementById('cerrarDetalles');

    if (btnDetalles && modalDetalles) {
        btnDetalles.addEventListener('click', () => {
            modalDetalles.classList.add('active');
        });
    }

    if (cerrarDetalles) {
        cerrarDetalles.addEventListener('click', () => {
            modalDetalles.classList.remove('active');
        });
    }

    // --- 7. Botón "Contacto" (Información de Contacto Inventada) ---
    const menuContact = document.getElementById('menu-contact');
    const modalContacto = document.getElementById('modalContacto');
    const cerrarContacto = document.getElementById('cerrarContacto');

    if (menuContact && modalContacto) {
        menuContact.addEventListener('click', (e) => {
            e.preventDefault();
            navMenu.classList.remove('active');
            modalContacto.classList.add('active');
        });
    }

    if (cerrarContacto) {
        cerrarContacto.addEventListener('click', () => {
            modalContacto.classList.remove('active');
        });
    }

    // --- 8. Registro e Inicio de Sesión de Usuarios (Almacenados en localStorage) ---
    const btnLogin = document.getElementById('btnLogin');
    const btnRegister = document.getElementById('btnRegister');
    const modalLogin = document.getElementById('modalLogin');
    const modalRegister = document.getElementById('modalRegister');
    const formLogin = document.getElementById('formLogin');
    const formRegister = document.getElementById('formRegister');
    const cancelLogin = document.getElementById('cancelLogin');
    const cancelRegister = document.getElementById('cancelRegister');
    const userStatus = document.getElementById('userStatus');

    function obtenerUsuarios() {
        const guardados = localStorage.getItem(USERS_STORAGE_KEY);
        if (guardados) {
            try {
                return JSON.parse(guardados);
            } catch (e) {
                console.error("Error leyendo usuarios:", e);
            }
        }
        return [];
    }

    function guardarUsuarios(listaUsuarios) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(listaUsuarios));
    }

    function actualizarEstadoSesion() {
        const usuarioActivo = localStorage.getItem(SESSION_STORAGE_KEY);
        if (usuarioActivo) {
            userStatus.innerHTML = `<i class="bi bi-person-check-fill"></i> Hola, ${usuarioActivo}`;
            userStatus.classList.add('logged-in');
            btnLogin.textContent = 'Cerrar sesión';
        } else {
            userStatus.textContent = '';
            userStatus.classList.remove('logged-in');
            btnLogin.textContent = 'Iniciar sesión';
        }
    }

    if (btnLogin) {
        btnLogin.addEventListener('click', () => {
            const usuarioActivo = localStorage.getItem(SESSION_STORAGE_KEY);
            if (usuarioActivo) {
                localStorage.removeItem(SESSION_STORAGE_KEY);
                actualizarEstadoSesion();
                alert(`👋 Has cerrado la sesión de "${usuarioActivo}".`);
            } else {
                modalLogin.classList.add('active');
                document.getElementById('loginUsername').focus();
            }
        });
    }

    if (cancelLogin) {
        cancelLogin.addEventListener('click', () => {
            formLogin.reset();
            modalLogin.classList.remove('active');
        });
    }

    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;

            const usuarios = obtenerUsuarios();
            const usuarioValido = usuarios.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

            if (usuarioValido) {
                localStorage.setItem(SESSION_STORAGE_KEY, usuarioValido.username);
                actualizarEstadoSesion();
                formLogin.reset();
                modalLogin.classList.remove('active');
                alert(`✅ ¡Bienvenido de nuevo, ${usuarioValido.username}! Has iniciado sesión correctamente.`);
            } else {
                alert('⚠️ Usuario o contraseña incorrectos. Si aún no tienes cuenta, pulsa en "Registrarse".');
            }
        });
    }

    if (btnRegister) {
        btnRegister.addEventListener('click', () => {
            modalRegister.classList.add('active');
            document.getElementById('regUsername').focus();
        });
    }

    if (cancelRegister) {
        cancelRegister.addEventListener('click', () => {
            formRegister.reset();
            modalRegister.classList.remove('active');
        });
    }

    if (formRegister) {
        formRegister.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('regUsername').value.trim();
            const password = document.getElementById('regPassword').value;

            if (!username || !password) return;

            const usuarios = obtenerUsuarios();
            const existe = usuarios.some(u => u.username.toLowerCase() === username.toLowerCase());

            if (existe) {
                alert('⚠️ Ese nombre de usuario ya está registrado. Por favor, elige otro.');
                return;
            }

            usuarios.push({ username, password });
            guardarUsuarios(usuarios);
            localStorage.setItem(SESSION_STORAGE_KEY, username);
            actualizarEstadoSesion();

            formRegister.reset();
            modalRegister.classList.remove('active');
            alert(`🎉 Usuario "${username}" registrado y guardado correctamente. Se ha iniciado tu sesión.`);
        });
    }

    // --- 9. Funcionalidad Añadir Post (Foto aleatoria Foto1.jpg - Foto10.jpg y persistencia) ---
    const menuAddPost = document.getElementById('menu-add-post');
    const modalAddPost = document.getElementById('modalAddPost');
    const formAddPost = document.getElementById('formAddPost');
    const cancelAddPost = document.getElementById('cancelAddPost');

    if (menuAddPost) {
        menuAddPost.addEventListener('click', (e) => {
            e.preventDefault();
            navMenu.classList.remove('active');
            modalAddPost.classList.add('active');
            document.getElementById('postTitulo').focus();
        });
    }

    if (cancelAddPost) {
        cancelAddPost.addEventListener('click', () => {
            formAddPost.reset();
            modalAddPost.classList.remove('active');
        });
    }

    if (formAddPost) {
        formAddPost.addEventListener('submit', (e) => {
            e.preventDefault();
            const titulo = document.getElementById('postTitulo').value.trim();
            const contenido = document.getElementById('postContenido').value.trim();

            if (!titulo || !contenido) return;

            const numeroAleatorio = Math.floor(Math.random() * 10) + 1;
            const nombreFoto = `Foto${numeroAleatorio}.jpg`;
            const rutaFoto = `media/${nombreFoto}`;

            const nuevoPost = {
                id: 'post-' + Date.now(),
                clase: `art${(posts.length % 3) + 1}`,
                imagen: rutaFoto,
                alt: titulo,
                titulo: titulo,
                contenido: contenido,
                complementaria: `Artículo añadido por el usuario. Fotografía asignada automáticamente: ${nombreFoto}.`
            };

            posts.push(nuevoPost);
            guardarPosts(posts);
            construirDOMArticulos();
            renderizarImagen();

            formAddPost.reset();
            modalAddPost.classList.remove('active');
            alert(`✅ El artículo "${titulo}" se ha añadido correctamente con la imagen "${nombreFoto}".`);
        });
    }

    // --- 10. Funcionalidad Eliminar Post (Lista de títulos y borrado permanente) ---
    const menuDeletePost = document.getElementById('menu-delete-post');
    const modalDeletePost = document.getElementById('modalDeletePost');
    const deletePostList = document.getElementById('deletePostList');
    const closeDeleteModal = document.getElementById('closeDeleteModal');

    function renderizarListaEliminar() {
        deletePostList.innerHTML = '';

        if (posts.length === 0) {
            const li = document.createElement('li');
            li.className = 'delete-post-item';
            li.textContent = 'No hay artículos disponibles para eliminar.';
            deletePostList.appendChild(li);
            return;
        }

        posts.forEach((post, index) => {
            const li = document.createElement('li');
            li.className = 'delete-post-item';

            const spanTitulo = document.createElement('span');
            spanTitulo.className = 'delete-post-title';
            spanTitulo.textContent = `${index + 1}. ${post.titulo}`;

            const btnEliminar = document.createElement('button');
            btnEliminar.className = 'btn-delete-item';
            btnEliminar.innerHTML = '<i class="bi bi-trash"></i> Eliminar';
            btnEliminar.addEventListener('click', () => {
                const confirmar = confirm(`¿Seguro que deseas eliminar permanentemente el post "${post.titulo}"?`);
                if (!confirmar) return;

                posts = posts.filter(p => p.id !== post.id);
                guardarPosts(posts);

                if (posicionActual >= posts.length) {
                    posicionActual = 0;
                }

                construirDOMArticulos();
                renderizarImagen();
                renderizarListaEliminar();
            });

            li.appendChild(spanTitulo);
            li.appendChild(btnEliminar);
            deletePostList.appendChild(li);
        });
    }

    if (menuDeletePost) {
        menuDeletePost.addEventListener('click', (e) => {
            e.preventDefault();
            navMenu.classList.remove('active');
            renderizarListaEliminar();
            modalDeletePost.classList.add('active');
        });
    }

    if (closeDeleteModal) {
        closeDeleteModal.addEventListener('click', () => {
            modalDeletePost.classList.remove('active');
        });
    }

    // Cerrar cualquier modal al hacer clic fuera de la caja blanca
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.classList.remove('active');
        }
    });

    // --- 11. Modo Oscuro / Claro ---
    const botonOscuro = document.querySelector('.btn-dark');
    if (botonOscuro) {
        botonOscuro.addEventListener('click', () => {
            if (document.body.classList.contains('dark-mode')) {
                document.body.classList.remove('dark-mode');
                botonOscuro.textContent = 'Modo Oscuro';
            } else {
                botonOscuro.textContent = 'Modo Claro';
                document.body.classList.toggle('dark-mode');
            }
        });
    }

    // Inicializar estado de sesión y carrusel al cargar la página
    actualizarEstadoSesion();
    construirDOMArticulos();
    renderizarImagen();
});