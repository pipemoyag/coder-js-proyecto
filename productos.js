const catalogo = cargarCatalogoDesdeBD();
const carrito = obtenerCarrito();

const renderizarProductos = () => {
  let contenedor = document.getElementById("productos");

  let htmlProductos = "";

  catalogo.forEach((producto) => {
    htmlProductos += `
    <div class="col-md-4 mb-3">
        <div class="card h-100 shadow-sm">
        <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">$${producto.precio.toLocaleString("es-CL")}</p>
            <button onclick="agregarProducto(${
              producto.id
            })" class="btn btn-primary">Agregar al carrito</button>
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
};

renderizarProductos();
