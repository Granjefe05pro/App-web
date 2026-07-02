boton.addEventListener('click', () => {
    // 3. Cambiamos el contenido del texto
    texto.textContent = '¡Felicidades! Tu app web ya está viva y reaccionando.';
    texto.style.color = 'green';
});

const platosDB = [
    {
        nombre: "Ensalada de Cítricos y Nueces",
        animo: "feliz",
        categoria: "desayuno",
        imagen: "https://unsplash.com",
        descripcion: "Llena de antioxidantes y vitamina C para prolongar tu alegría.",
        ingredientes: ["2 Naranjas", "1 taza de Espinacas", "50g de Nueces", "Miel"],
        instrucciones: "Pela y trocea las naranjas. Mezcla en un bol con las espinacas frescas. Añade las nueces por encima y aliña con un hilo de miel."
    },
    {
        nombre: "Chocolate Negro con Almendras",
        animo: "feliz",
        categoria: "snack",
        imagen: "https://unsplash.com",
        descripcion: "Estimula la producción de endorfinas de manera inmediata.",
        ingredientes: ["Barra de chocolate 70% cacao", "Almendras tostadas"],
        instrucciones: "Disfruta de 2 o 3 onzas acompañadas de un puñado de almendras a media tarde."
    },
    {
        nombre: "Sopa de Pollo Casera",
        animo: "estresado",
        categoria: "almuerzo",
        imagen: "https://unsplash.com",
        descripcion: "Un clásico reconfortante que disminuye los niveles de cortisol.",
        ingredientes: ["1 Pechuga de pollo", "2 Zanahorias", "1 Puerro", "Caldo de verduras"],
        instrucciones: "Hierve el pollo con las verduras picadas a fuego lento durante 45 minutes. Sazona al gusto y sirve bien caliente."
    },
    {
        nombre: "Infusión de Té Verde y Manzanilla",
        animo: "estresado",
        categoria: "snack",
        imagen: "https://unsplash.com",
        descripcion: "Contiene L-teanina para calmar el sistema nervioso.",
        ingredientes: ["1 bolsita de Té verde", "Flores de manzanilla", "Agua caliente"],
        instrucciones: "Infundir en agua a 80°C durante 3 minutos. Tomar despacio respirando profundamente."
    },
    {
        nombre: "Tazón de Avena y Plátano",
        animo: "cansado",
        categoria: "desayuno",
        imagen: "https://unsplash.com",
        descripcion: "Carbohidratos complejos de absorción lenta para darte energía duradera.",
        ingredientes: ["1/2 taza de Avena", "1 Plátano", "1 taza de Leche o agua", "Canela"],
        instrucciones: "Cocina la avena con la leche por 5 minutos. Sirve con rodajas de plátano y espolvorea canela."
    },
    {
        nombre: "Salmón a la Plancha con Brócoli",
        animo: "triste",
        categoria: "almuerzo",
        imagen: "https://unsplash.com",
        descripcion: "Rico en Omega-3, esencial para combatir la inflamación cerebral ligada a la tristeza.",
        ingredientes: ["1 Filete de salmón", "1/2 brócoli", "Limón", "Aceite de oliva"],
        instrucciones: "Cocina el salmón a la plancha 4 minutos por lado. Cocina el brócoli al vapor. Junta ambos y añade zumo de limón."
    }
];

let animoActual = "";
let filtroActual = "todos";

const coloresTematicos = {
    feliz: { bg: "#fef9e7", header: "#f1c40f" },
    estresado: { bg: "#fdedec", header: "#e74c3c" },
    cansado: { bg: "#ebf5fb", header: "#3498db" },
    triste: { bg: "#f5eef8", header: "#9b59b6" }
};

// Captura de Elementos de la Interfaz
const contenedor = document.getElementById('resultado-comidas');
const seccionFiltros = document.getElementById('seccion-filtros');
const tituloResultados = document.getElementById('titulo-resultados');
const buscador = document.getElementById('buscador');
const modal = document.getElementById('modal-receta');

// --- EVENTO 1: Selección de Estado de Ánimo ---
document.querySelectorAll('.btn-animo').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.btn-animo').forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        
        animoActual = btn.getAttribute('data-animo');
        
        // Cambiar colores dinámicos de la interfaz
        document.body.style.backgroundColor = coloresTematicos[animoActual].bg;
        document.getElementById('main-header').style.backgroundColor = coloresTematicos[animoActual].header;
        
        tituloResultados.textContent = "Platos recomendados para sentirte mejor";
        filtrarYMostrarPlatos();

        // 🚀 CORRECCIÓN: Desplaza suavemente la pantalla hacia los filtros y resultados
        seccionFiltros.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// --- EVENTO 2: Filtro por Momento del Día ---
document.querySelectorAll('.btn-filtro').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        filtroActual = btn.getAttribute('data-filtro');
        filtrarYMostrarPlatos();
    });
});

// --- EVENTO 3: Buscador de Texto en Tiempo Real ---
buscador.addEventListener('input', filtrarYMostrarPlatos);

// --- FUNCIÓN CENTRAL: Filtrado Inteligente ---
function filtrarYMostrarPlatos() {
    if (!animoActual) return;

    const textoBusqueda = buscador.value.toLowerCase();

    // Aplicar los tres filtros cruzados
    const platosFiltrados = platosDB.filter(plato => {
        const coincideAnimo = plato.animo === animoActual;
        const coincideFiltro = filtroActual === "todos" || plato.categoria === filtroActual;
        const coincideTexto = plato.nombre.toLowerCase().includes(textoBusqueda) || 
        plato.descripcion.toLowerCase().includes(textoBusqueda);
        
        return coincideAnimo && coincideFiltro && coincideTexto;
    });

    renderizarTarjetas(platosFiltrados);
}

// --- FUNCIÓN: Dibujar las Tarjetas en Pantalla ---
function renderizarTarjetas(platos) {
    contenedor.innerHTML = "";

    if (platos.length === 0) {
        contenedor.innerHTML = <p style="grid-column: 1/-1; text-align:center; color:#7f8c8d;">No se encontraron platos con los filtros seleccionados.</p>;
        return;
    }

    platos.forEach(plato => {
        const card = document.createElement('div');
        card.classList.add('meal-card');
        card.innerHTML = `
            <img src="${plato.imagen}" alt="${plato.nombre}">
            <div class="meal-card-info">
                <div>
                    <span class="tag-categoria">${plato.categoria.toUpperCase()}</span>
                    <h4>${plato.nombre}</h4>
                    <p style="font-size: 14px; color: #555;">${plato.descripcion}</p>
                </div>
                <button class="btn-receta">Ver Receta completa</button>
            </div>
        `;

        // Configurar acción para abrir la receta en el Modal
        card.querySelector('.btn-receta').addEventListener('click', () => abrirModal(plato));
        contenedor.appendChild(card);
    });
}

// --- FUNCIONES: Control de la Ventana Modal ---
function abrirModal(plato) {
    document.getElementById('modal-titulo').textContent = plato.nombre;
    document.getElementById('modal-imagen').src = plato.imagen;
    document.getElementById('modal-instrucciones').textContent = plato.instrucciones;

    const listaIngredientes = document.getElementById('modal-ingredientes');
    listaIngredientes.innerHTML = "";
    plato.ingredientes.forEach(ing => {
        const li = document.createElement('li');
        li.textContent = ing;
        listaIngredientes.appendChild(li);
    });

    modal.style.display = "flex";
}

document.querySelector('.cerrar-modal').addEventListener('click', () => modal.style.display = "none");
window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = "none"; });
