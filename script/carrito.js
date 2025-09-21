let botonVaciar = document.getElementById("boton-vaciar");
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
  // se usa "matches" para detectar el input
  filasCarrito.addEventListener("change", (e) => {
    if (e.target.matches(".input-cantidad")) {
      const id = Number(e.target.dataset.id);
      let valor = Number(e.target.value); // si el input ingresado fuera string, arrojara NaN
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
                max="${productoCarro.stock}"
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
  let productoCarro = catalogo.find((producto) => producto.id === id);
  // si el valor ingresado es string, o negativo, o float => dejará la cantidad en 1
  // si el valor ingresado es mayor al stock del producto => dejará cantidad en stock, y tirará una notificacion
  if (
    isNaN(nuevaCantidad) ||
    nuevaCantidad <= 0 ||
    !Number.isInteger(nuevaCantidad)
  ) {
    nuevaCantidad = 1;
  } else if (nuevaCantidad > productoCarro.stock) {
    nuevaCantidad = productoCarro.stock;
    toastProductoAgotado();
  }
  carrito.actualizarCantidad(id, nuevaCantidad);
  guardarEnStorage(carrito);
  renderizarCarrito();
};

const modalCarroVacio = () => {
  Swal.fire({
    title: "Su carrito está vacío",
    icon: "info",
    confirmButtonText: "Aceptar",
  });
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
    modalCarroVacio();
  }
};

const ejecucionPago = () => {
  if (carrito.obtenerCantidadItems()) {
    Swal.fire({
      title: "Completa tus datos",
      html: `
    <input id="nombre" class="swal2-input" placeholder="Nombre del comprador">
    <select id="pago" class="swal2-select">
      <option value="" disabled selected>Seleccione medio de pago</option>
      <option value="Efectivo">Efectivo</option>
      <option value="Tarjeta">Tarjeta</option>
    </select>
  `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const nombre = document.getElementById("nombre").value;
        const pago = document.getElementById("pago").value;
        if (!nombre || !pago) {
          Swal.showValidationMessage(
            "Debes ingresar tu nombre y elegir medio de pago"
          );
          return false;
        }
        return { nombre, pago };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "¡Gracias por comprar en CatRepublic!",
          `Gracias ${result.value.nombre}, pagaste con ${result.value.pago}.`,
          "success"
        );
        carrito.vaciarCarro();
        guardarEnStorage(carrito);
        renderizarCarrito();
      }
    });
  } else {
    modalCarroVacio();
  }
};
