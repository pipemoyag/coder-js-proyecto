const container = document.getElementById("navbar-container");
container.outerHTML = `
    <nav class="navbar navbar-expand-sm navbar-dark bg-dark sticky-top">
        <div class="container-fluid">
          <!-- Logo -->
          <a class="navbar-brand" href="/index.html">Cat Republic</a>

          <!-- Mobile: hamburguesa + carrito -->
          <div class="d-flex d-sm-none ms-auto align-items-center">
            <!-- Botón hamburguesa -->
            <button
              class="navbar-toggler me-2"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Carrito vista mobile -->
            <a
              href="/pages/carrito.html"
              class="btn btn-outline-light position-relative"
            >
              <i class="bi bi-cart"></i>
              <span
                id="cantidad-productos-mobile"
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              ></span>
            </a>
          </div>

          <!-- Contenido colapsable -->
          <div
            class="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul class="navbar-nav text-start text-sm-end">
              <li class="nav-item">
                <a class="nav-link" href="/index.html">Inicio</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/pages/productos.html">Productos</a>
              </li>

              <!-- Carrito vista desktop -->
              <li class="nav-item ms-3 d-none d-sm-block">
                <a
                  href="/pages/carrito.html"
                  class="btn btn-outline-light position-relative"
                >
                  <i class="bi bi-cart"></i>
                  <span
                    id="cantidad-productos-desktop"
                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  ></span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    `;
