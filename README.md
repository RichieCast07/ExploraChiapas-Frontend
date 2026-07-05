# ExploraChiapas — Frontend Web

Panel administrativo y de negocios turísticos para la plataforma ExploraChiapas. Construido con React, TypeScript y Vite bajo una arquitectura limpia con patrón MVVM.

---

## Tecnologías

| Herramienta | Versión | Uso |
|---|---|---|
| React | 19 | Biblioteca de UI |
| TypeScript | 6 | Tipado estático |
| Vite | 8 | Bundler y servidor de desarrollo |
| React Router DOM | 7 | Navegación entre páginas |
| Recharts | 3 | Gráficas del dashboard |
| Lucide React | 1.23 | Iconos |

---

## Arquitectura

El proyecto sigue **Clean Architecture** con el patrón **MVVM** (Model-View-ViewModel). Cada funcionalidad vive en su propio módulo bajo `src/features/`, completamente aislada.

```
src/
├── core/
│   └── shared/
│       ├── config/
│       │   └── navigation/       # Configuración de menús por rol
│       └── layout/               # Sidebar compartido
└── features/
    ├── Auth/
    │   ├── data/
    │   │   ├── models/           # Interfaces de datos (User)
    │   │   └── repository/       # AuthRepository — llamadas HTTP
    │   ├── domain/               # LoginUseCase, RegisterUseCase
    │   └── presentation/
    │       ├── pages/            # Login.tsx, Register.tsx
    │       └── viewmodels/       # useLoginViewModel, useRegisterViewModel
    ├── NegocioTuristico/
    │   ├── Home/                 # Dashboard del negocio
    │   └── Promociones/          # Lista y formulario de promociones
    └── SistemaAdministrador/
        └── Home/                 # Dashboard del administrador
```

### Capas

**Data** — repositorios e implementaciones HTTP. Solo esta capa habla con el backend.

**Domain** — casos de uso puros. No conocen React ni el DOM. Reciben datos, aplican reglas, devuelven resultados.

**Presentation** — páginas y ViewModels. Los ViewModels son hooks de React que orquestan casos de uso y exponen estado a las páginas. Las páginas solo renderizan, no tienen lógica de negocio.

---

## Conexión con el Backend

El backend corre en:

```
https://explora-chiapas.onrender.com/v1/api
```

| Endpoint | Método | Descripción |
|---|---|---|
| `/users/login` | POST | Autenticación, devuelve JWT |
| `/users/register` | POST | Registro de nuevo usuario |
| `/users/profile` | GET / PATCH / DELETE | Perfil del usuario autenticado |
| `/promotions` | GET / POST / PATCH / DELETE | Gestión de promociones |
| `/stats/businesses/:id` | GET | Estadísticas del negocio |
| `/stats/system` | GET | Estadísticas globales (solo admin) |

El token JWT se guarda en `localStorage` al iniciar sesión y debe enviarse en el header `Authorization: Bearer <token>` en las rutas protegidas.

---

## Levantar el servidor

### Requisitos

- Node.js 18 o superior
- npm

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/RichieCast07/ExploraChiapas-Frontend.git
cd ExploraChiapas-Frontend

# 2. Instalar dependencias
npm install

# 3. Levantar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

### Otros comandos

```bash
npm run build      # Compilar para producción
npm run preview    # Previsualizar el build de producción
npm run lint       # Revisar errores de estilo
```

---

## Rutas disponibles

| Ruta | Página | Acceso |
|---|---|---|
| `/` | Login | Público |
| `/login` | Login | Público |
| `/registro` | Registro | Público |
| `/negocio/inicio` | Dashboard del negocio | Autenticado |
| `/negocio/promociones` | Lista de promociones | Autenticado |
| `/negocio/promociones/nueva` | Crear promoción | Autenticado |
| `/admin/dashboard` | Dashboard del administrador | Autenticado |

Cualquier ruta no definida redirige automáticamente a `/login`.

---

## Estructura de un módulo

Cada módulo sigue la misma estructura para mantener consistencia:

```
features/NombreModulo/
├── data/
│   ├── models/         # Interfaces TypeScript
│   └── repository/     # Implementación de llamadas HTTP
├── domain/             # Casos de uso
└── presentation/
    ├── pages/          # Componentes de página (.tsx + .css)
    └── viewmodels/     # Hooks de estado y lógica de presentación
```

---

## Convenciones de código

- Un componente por archivo
- Sin lógica de negocio en las páginas — todo va en el ViewModel
- Los repositorios son la única capa que hace `fetch`
- CSS por módulo junto al componente que lo usa
- Sin comentarios que expliquen qué hace el código — los nombres lo dicen
