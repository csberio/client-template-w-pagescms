# Velsant Self-Care

Demo personal de tres páginas para conocer Pages CMS. Astro genera HTML estático. El contenido y las imágenes se guardan en GitHub; Pages CMS sirve como interfaz editorial. No requiere base de datos, funciones, API keys ni un CMS autohospedado.

## Desarrollo

Requiere Node 22.12+ o Node 24 soportado por Astro.

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

## Conectar Pages CMS

1. Entra a https://app.pagescms.org e inicia sesión con GitHub.
2. Instala/autoriza la GitHub App de Pages CMS con acceso **solo** a `csberio/client-template-w-pagescms`.
3. Abre ese repositorio y selecciona `main`.
4. Pages CMS lee `.pages.yml` automáticamente. Encontrarás Ajustes generales, Introducción, Historia, Catálogo y Proyectos.
5. Cambia el título de Introducción y guarda. El CMS crea un commit. Si Vercel está conectado con GitHub, ese commit dispara la reconstrucción del sitio.

La autorización de la GitHub App debe realizarla el propietario. Tener el archivo de configuración no confirma que la app ya esté autorizada.

## Editar

- Las tres páginas permiten cambiar títulos, textos con formato, imágenes, captions y metadatos SEO.
- Ajustes generales controla nombre, lema, navegación, footer, etiquetas de galería y tres colores HEX. Mantén suficiente contraste al cambiar colores.
- Historia incluye una lista editable de hitos.
- Cada proyecto tiene título, fecha, descripción rich text, imagen principal y secundaria obligatorias y tres extras opcionales. Cada imagen tiene texto alternativo.
- `Publicado` permite guardar borradores. Los borradores no se incluyen en el HTML público.
- La descripción rich text se guarda como Markdown dentro de JSON. Admite párrafos, títulos, listas, enlaces y medios; al generar HTML se sanitiza.
- Las imágenes subidas se guardan en `public/media/` y sus rutas públicas comienzan en `/media/`. El demo incluye ilustraciones SVG locales, sin servicios externos. Recomendado: subir imágenes comprimidas WebP/JPEG, cerca de 1600 px, idealmente menores de 500 KB.
- La estructura de componentes se modifica en código; Pages CMS no es un constructor visual. Los campos y listas establecidos sí son editables.

## Desplegar en Vercel Hobby (gratuito)

1. En una cuenta personal de Vercel, confirma **Settings → Billing → Hobby**. No selecciones un equipo Pro ni aceptes un trial.
2. Importa `csberio/client-template-w-pagescms` desde GitHub.
3. Framework: Astro. Root: repositorio. Build: `npm run build`. Output: `dist`. Node: 22.x o 24.x. Sin variables de entorno.
4. Publica con el subdominio gratuito `*.vercel.app`. No actives add-ons de pago.
5. Production branch: `main`. Habilita el acceso GitHub a ese repositorio para recibir los cambios del CMS.
6. Verifica la URL y el plan efectivo en Vercel. El archivo `vercel.json` configura el build, **no selecciona ni garantiza el plan de facturación**.

Hobby está limitado a uso personal no comercial; este demo está concebido para ese uso. Revisar límites y términos vigentes antes de reutilizarlo comercialmente. El demo no activa compras ni servicios de pago.

## Prueba de aceptación real

Después de conectar ambas aplicaciones: editar un título, reemplazar una imagen, crear un proyecto con rich text y las cinco imágenes, guardar, esperar el despliegue, verificar el contenido público y alternar `Publicado`. Una edición guardada no es instantánea: requiere que termine el build. Las pruebas locales no sustituyen esta comprobación de la integración autorizada.

## Arquitectura

`Pages CMS → commit en GitHub → build Astro en Vercel → HTML/CSS/JS en CDN`

- `content/{site,home,history,catalog}.json`: documentos únicos.
- `content/projects/*.json`: un archivo por proyecto. El nombre de archivo funciona como identificador del catálogo.
- `.pages.yml`: esquema editorial, campos requeridos, rich text y medios.
- `src/lib/content.mjs`: validación de contenido y sanitización Markdown → HTML.
- `src/pages/`: exactamente `/`, `/historia/`, `/proyectos/`.
- El catálogo usa un diálogo nativo, con teclado/Escape y restitución de foco. Sin JavaScript se puede expandir cada proyecto con `details`.
- Tipografías Syne y Space Grotesk autohospedadas. Paleta Velsant: Sapphire `#0E2A47`, Off-White `#F7F9FB`, Bronze `#B48E58`; Charcoal `#2B2D31` como referencia de marca. Se usa wordmark textual editable; no se inventa un logo oficial.
- Los relatos, fechas e ilustraciones son contenido ficticio de ejemplo; no representan proyectos comerciales ni una historia institucional.

## Referencias oficiales consultadas

- https://pagescms.org/docs/quick-start/
- https://pagescms.org/docs/configuration/
- https://pagescms.org/docs/configuration/content/
- https://pagescms.org/docs/configuration/fields/rich-text/
- https://pagescms.org/docs/configuration/fields/image/
- https://pagescms.org/docs/configuration/media/
- https://docs.astro.build/en/guides/deploy/vercel/
- https://vercel.com/docs/plans/hobby
