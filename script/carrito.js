let botonVaciar = document.getElementById("boton-vaciar");
let mensajeCompra = document.getElementById("mensaje-compra");
let botonPagar = document.getElementById("boton-pagar");

document.addEventListener("DOMContentLoaded", async () => {
  // Se intenta cargar catalogo. Si no se carga, mostrará un error en la pagina
  catalogo = await cargarCatalogoDesdeBD();
  if (!catalogo) {
    document.querySelector("main").innerHTML = mensajeErrorBD;
    return;
  }
  renderizarCarrito();
  botonVaciar.addEventListener("click", vaciarCarro);
  botonPagar.addEventListener("click", ejecucionPago);
});

const renderizarCarrito = () => {
  let filasCarrito = document.getElementById("carrito");
  let valorTotalHTML = document.getElementById("total");

  let htmlCarrito = "";
  let valorTotal = 0;
  if (carrito.obtenerCantidadItems()) {
    for (let id in carrito.items) {
      let productoCarro = catalogo.find(
        (producto) => producto.id === Number(id)
      );

      let cantidadProducto = carrito.items[id];
      let precioProducto = productoCarro.precio;
      let subtotal = cantidadProducto * precioProducto;
      valorTotal += subtotal;

      htmlCarrito += `
        <tr>
            <td>${productoCarro.nombre}</td>
            <td>
                <input 
                type="number" 
                class="form-control form-control-sm" 
                value="${cantidadProducto}" 
                min="1" 
                onchange="actualizarCantidadCarro(${id}, Number(this.value))">
            </td>
            <td>$${productoCarro.precio.toLocaleString("es-CL")}</td>
            <td>$${subtotal.toLocaleString("es-CL")}</td>
            <td><button onclick="eliminarProducto(${id})" class="btn btn-sm btn-danger">
                <i class="bi bi-trash"></i></button></td>
        </tr>
      `;
    }
  } else {
    htmlCarrito = `
        <tr>
            <td>Carrito Vacío</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td></td>
        </tr>`;
  }
  valorTotalHTML.textContent = `$${valorTotal.toLocaleString("es-CL")}`;
  filasCarrito.innerHTML = htmlCarrito;
};

const eliminarProducto = (id) => {
  carrito.eliminarDelCarro(id);
  guardarEnStorage(carrito);
  renderizarCarrito();
};

const actualizarCantidadCarro = (id, nuevaCantidad) => {
  // si el valor ingresado es string o negativo, dejará la cantidad en 1
  if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
    nuevaCantidad = 1;
  }
  carrito.actualizarCantidad(id, nuevaCantidad);
  guardarEnStorage(carrito);
  renderizarCarrito();
};

const vaciarCarro = () => {
  if (carrito.obtenerCantidadItems()) {
    Swal.fire({
      title: "¿Vaciar el carrito?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, vaciar",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        carrito.vaciarCarro();
        guardarEnStorage(carrito);
        renderizarCarrito();
        Swal.fire("Carrito vacío", "", "success");
      }
    });
  } else {
    Swal.fire({
      title: "Su carrito está vacío",
      icon: "info",
      confirmButtonText: "Aceptar",
    });
  }
};

const ejecucionPago = () => {
  if (carrito.obtenerCantidadItems()) {
    mensajeCompra.innerHTML = `
        <div class="alert alert-success text-center">
        ¡Gracias por comprar en <strong>Cat Republic</strong>!
        </div>
        `;
    carrito.vaciarCarro();
    guardarEnStorage(carrito);
    renderizarCarrito();
  } else {
    mensajeCompra.innerHTML = `
        <div class="alert alert-danger text-center">
        Tu carrito está vacío 🛒
        </div>
        `;
  }
};
