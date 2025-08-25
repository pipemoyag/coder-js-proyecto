// Los datos se simulan como si fueran traídos de una base de datos, pero por ahora están dentro de una funcion
const cargarCatalogoDesdeBD = () => [
  {
    id: 1,
    nombre: "Alimento Acana",
    precio: 22990,
    categoria: "Comida",
  },
  {
    id: 2,
    nombre: "Alimento Bravery",
    precio: 19990,
    categoria: "Comida",
  },
  {
    id: 3,
    nombre: "Alimento Leonardo",
    precio: 24990,
    categoria: "Comida",
  },
  {
    id: 4,
    nombre: "Churu 4 unidades",
    precio: 2900,
    categoria: "Snacks",
  },
  {
    id: 5,
    nombre: "Leonardo Latas 200g",
    precio: 3000,
    categoria: "Snacks",
  },
  {
    id: 6,
    nombre: "Catit Nuna insecto",
    precio: 4490,
    categoria: "Snacks",
  },
  {
    id: 7,
    nombre: "Pelota Automática",
    precio: 5000,
    categoria: "Juguete",
  },
  {
    id: 8,
    nombre: "Raton Peludo",
    precio: 1500,
    categoria: "Juguete",
  },
  {
    id: 9,
    nombre: "Catit Treat Puzzle",
    precio: 20990,
    categoria: "Juguete",
  },
  {
    id: 10,
    nombre: "Antiparasitario",
    precio: 14000,
    categoria: "Farmacia",
  },
];

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
  cantidadMobile.textContent = `${carro.obtenerCantidadItems()}`;
  cantidadDesktop.textContent = `${carro.obtenerCantidadItems()}`;
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

obtenerCarrito();
