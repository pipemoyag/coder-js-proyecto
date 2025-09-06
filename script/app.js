// Los datos se simulan como si fueran traídos de una API, pero por ahora se traen desde un archivo .json local
const cargarCatalogoDesdeBD = async () => {
  // OJO: como es una funcion async, el return será una Promise, NO directamente los datos
  try {
    const respuesta = await axios.get("../data/catalogo.json", {
      headers: { "Cache-Control": "no-cache" }, // para que el navegador siempre cargue la version actualizada
    });
    return respuesta.data;
  } catch (error) {
    console.error("Error al cargar catálogo:", error);
    return null; // null para indicar error
  }
};

// El carrito será una clase, cuya llave "items" será un objeto cuyas keys serán los id de los productos presentes en el carro, y los
// valores asociados a esas claves será la cantidad de ese producto presente en el carro. Esto facilita implementar metodos como
// Agregar al carro, remover del carro, vaciar carro, actualizar cantidades, etc
class Carro {
  // si el carro ya existe, usara el objeto guardado en el localStorage. Si no, inicializará un objeto vacío
  constructor(items = {}) {
    this.items = items;
  }

  agregarAlCarro(id) {
    this.items[id] = (this.items[id] || 0) + 1;
  }

  eliminarDelCarro(id) {
    delete this.items[id];
  }

  vaciarCarro() {
    this.items = {};
  }

  actualizarCantidad(id, cantidad) {
    // siempre llegará un valor numerico >= 1
    this.items[id] = cantidad;
  }

  obtenerCantidadItems() {
    let cantidadItems = 0;
    for (let id in this.items) {
      cantidadItems += this.items[id];
    }
    return cantidadItems;
  }
}

// definimos funcion para actualizar la cantidad de elementos en el carro que se ve en el HTML
const actualizarElementosCarro = (carro) => {
  let cantidadMobile = document.getElementById("cantidad-productos-mobile");
  let cantidadDesktop = document.getElementById("cantidad-productos-desktop");
  let cantidadItems = carro.obtenerCantidadItems();
  cantidadMobile.textContent = `${cantidadItems}`;
  cantidadDesktop.textContent = `${cantidadItems}`;
};

// definimos una funcion para guardar el atributo carrito.items (objeto) en el localStorage
const guardarEnStorage = (carro) => {
  localStorage.setItem("carritoCR", JSON.stringify(carro.items));
  actualizarElementosCarro(carro);
};

// funcion para inicializar carrito
const obtenerCarrito = () => {
  let carritoJSON = localStorage.getItem("carritoCR");
  let carrito;
  // si el carrito existe, lo rescata desde el localStorage. Si no (carritoJSON = null), lo va a crear en el localStorage
  if (carritoJSON) {
    carrito = new Carro(JSON.parse(carritoJSON));
    actualizarElementosCarro(carrito);
  } else {
    carrito = new Carro();
    guardarEnStorage(carrito);
  }
  return carrito;
};

// Inicializamos variables, para que en caso de error al conectar con BD no arrojen error las funciones que llaman estas variables
// Esto lo hago porque estaba trabajando con estas variables definidas de forma global, y asi evito por ahora modificar tanto el codigo
let catalogo = [];
let carrito = obtenerCarrito();

mensajeErrorBD = `
  <div class="alert alert-danger text-center mt-4" role="alert">
    ⚠️ La página presenta un problema, vuelva más tarde.
  </div>`;
