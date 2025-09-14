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

  const filasCarrito = document.getElementById("carrito");
  // Delegacion para clicks eliminar productos del carrito
  // se usa "closest" para que si se clickea el ícono de basura, aún así retorne el botón padre
  filasCarrito.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-eliminar");
    if (btn) {
      const id = Number(btn.dataset.id);
      eliminarProducto(id);
    }
  });
  // Delegacion para cambios en la cantidad de un producto en el carrito
  // se usa "matches" ..ASDAHS
  filasCarrito.addEventListener("change", (e) => {
    if (e.target.matches(".input-cantidad")) {
      const id = Number(e.target.dataset.id);
      let valor = Number(e.target.value);
      actualizarCantidadCarro(id, valor);
    }
  });

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
                class="form-control form-control-sm input-cantidad" 
                value="${cantidadProducto}" 
                min="1" 
                data-id="${id}">
            </td>
            <td>$${productoCarro.precio.toLocaleString("es-CL")}</td>
            <td>$${subtotal.toLocaleString("es-CL")}</td>
            <td><button class="btn btn-sm btn-danger btn-eliminar" data-id="${id}">
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
