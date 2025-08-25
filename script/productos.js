const catalogo = cargarCatalogoDesdeBD();
const carrito = obtenerCarrito();

const renderizarProductos = (productos = catalogo) => {
  let contenedor = document.getElementById("productos");

  let htmlProductos = "";

  productos.forEach((producto) => {
    // primero revisa si hay de ese producto en el carrito, para agregar un badge con la cantidad de ese producto
    let cantidadProductoEnCarro = carrito.items[producto.id] || 0;
    let displayBadgeProducto;
    if (cantidadProductoEnCarro > 0) {
      displayBadgeProducto = "inline";
    } else {
      displayBadgeProducto = "none";
    }
    // creacion de la tarjeta de producto
    htmlProductos += `
    <div class="col-md-4 mb-3">
        <div class="card h-100 shadow-sm">
        <div class="card-body position-relative">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">$${producto.precio.toLocaleString("es-CL")}</p>
            <button onclick="agregarProducto(${
              producto.id
            })" class="btn btn-primary position-relative">Agregar al carrito
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" id="cantidad-producto-${
              producto.id
            }" style="display: ${displayBadgeProducto};">
            ${cantidadProductoEnCarro}
            </span>
            </button>
        </div>
        </div>
    </div>
    `;
  });

  contenedor.innerHTML = htmlProductos;
};

const agregarProducto = (id) => {
  carrito.agregarAlCarro(id);
  guardarEnStorage(carrito);
  renderizarProductos(actualizarProductos());
};

// Actualizar productos segun Buscador y Orden seleccionado
const inputBuscador = document.getElementById("buscador-productos");
const selectOrdenar = document.getElementById("ordenar-productos");

const actualizarProductos = () => {
  const textoBusqueda = inputBuscador.value.toLowerCase();
  const criterioOrden = selectOrdenar.value;

  // filtra por busqueda
  let catalogoFiltrado = catalogo.filter((producto) =>
    producto.nombre.toLowerCase().includes(textoBusqueda)
  );

  // ordena segun criterio, respecto al catalogo filtrado
  if (criterioOrden === "relevancia") {
    catalogoFiltrado.sort((a, b) => a.id - b.id);
  } else if (criterioOrden === "categoria") {
    catalogoFiltrado.sort((a, b) => a.categoria.localeCompare(b.categoria));
  } else if (criterioOrden === "nombre") {
    catalogoFiltrado.sort((a, b) => a.nombre.localeCompare(b.nombre));
  } else if (criterioOrden === "precio") {
    catalogoFiltrado.sort((a, b) => a.precio - b.precio);
  }

  // al final, renderiza nuevamente
  renderizarProductos(catalogoFiltrado);
  return catalogoFiltrado;
};

renderizarProductos();
inputBuscador.addEventListener("input", actualizarProductos);
selectOrdenar.addEventListener("change", actualizarProductos);
