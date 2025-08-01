const resumenProducto = function () {
  return `${this.id}. ${this.nombre} - $${this.precio}`;
};

// Los datos se simulan como si fueran traídos de una base de datos, pero por ahora están dentro de una funcion
const cargarCatalogoDesdeBD = () => [
  {
    id: 1,
    nombre: "Pelota automatica",
    precio: 5000,
    categoria: "Juguete",
    resumen: resumenProducto,
  },
  {
    id: 2,
    nombre: "Rascador circular",
    precio: 6000,
    categoria: "Accesorio",
    resumen: resumenProducto,
  },
  {
    id: 3,
    nombre: "Paquete churus",
    precio: 3000,
    categoria: "Comida",
    resumen: resumenProducto,
  },
  {
    id: 4,
    nombre: "Antiparasitario",
    precio: 14000,
    categoria: "Farmacia",
    resumen: resumenProducto,
  },
  {
    id: 5,
    nombre: "Cama acolchada",
    precio: 20000,
    categoria: "Accesorio",
    resumen: resumenProducto,
  },
  {
    id: 6,
    nombre: "Alimento seco 1.8kg",
    precio: 28000,
    categoria: "Comida",
    resumen: resumenProducto,
  },
];

const resumenCatalogo = function (catalogo) {
  let mensaje = "Catálogo:\n";
  for (const producto of catalogo) {
    mensaje += ` > ${producto.resumen()}\n`;
  }
  return mensaje;
};

const entradaTienda = () =>
  confirm(
    'Bienvenido a Cat Republic, tienda especializada en Gatos. Haz click en "Aceptar" para entrar a la tienda'
  );

const salidaTienda = () => "Gracias por visitar Cat Republic, hasta la próxima";

function iniciarSimulador() {
  const clienteEntra = entradaTienda();

  if (clienteEntra) {
    const catalogoCR = cargarCatalogoDesdeBD();
    let tamanoCatalogo = catalogoCR.length;
    // carrito sera objeto cuya clave sera el id del producto y su valor sera la cantidad de ese producto agregada al carro
    let carrito = {};
    let idProducto = -1; // valor inicial para entrar al ciclo
    while (idProducto != 0) {
      idProducto = Number(
        prompt(
          `${resumenCatalogo(
            catalogoCR
          )}\nIndique el N° del producto que desea agregar (Escriba 0 o presione "Cancelar" para terminar)`
        )
      );
      // validacion de que dato de entrada sea un numero entero
      if (!isNaN(idProducto) && Number.isInteger(idProducto)) {
        // validacion que dato de entrada esté dentro de los ids disponibles
        if (idProducto >= 1 && idProducto <= tamanoCatalogo) {
          // si el producto esta en el carrito, suma uno a la cantidad. Si no, lo agrega como propiedad al carrito
          if (carrito[idProducto]) {
            carrito[idProducto]++;
          } else {
            carrito[idProducto] = 1;
          }
          alert("Producto agregado al carrito!");
        } else if (idProducto === 0) {
          // cliente desea salir del ciclo
          continue;
        } else {
          alert(
            `Error. Ingrese un producto válido (del 1 al ${tamanoCatalogo})`
          );
        }
      } else {
        alert("Error. Ingrese un valor numérico (1, 2, 3...)");
      }
    }
    // cantidad de tipos de productos distintos
    let tamanoCarrito = Object.keys(carrito).length;
    if (tamanoCarrito) {
      let mensaje = "Resumen de tu carrito:\n";
      let totalPagar = 0;
      // recorremos los tipos de productos agregados
      // for (id in objeto) devuelve las claves del objeto
      for (let id in carrito) {
        // identificamos producto por su id
        let producto = catalogoCR.find((p) => p.id == id);
        // vemos cuanto de ese producto lleva el cliente
        let cantidad = carrito[id];
        totalPagar += cantidad * producto.precio;
        mensaje += `  (${cantidad}) ${producto.nombre} (${cantidad} x $${producto.precio})\n`;
      }
      mensaje += `Total a Pagar: $${totalPagar}\nPresione "Aceptar" para confirmar su compra`;
      let confirmacionCompra = confirm(mensaje);
      if (confirmacionCompra) {
        alert("Compra exitosa!\n" + salidaTienda());
      } else {
        alert("Compra cancelada\n" + salidaTienda());
      }
    } else {
      alert("Carrito sin productos.\n" + salidaTienda());
    }
  } else {
    alert(salidaTienda());
  }
}
