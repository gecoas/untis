# Estilos para horarios Untis

Este repositorio contiene una hoja de estilos para mejorar la presentación de horarios exportados desde Untis.

## Estructura

La página de inicio del sitio es `index.html` y muestra cuatro accesos: clases de Primaria, profesores de Primaria, clases de ESO y profesores de ESO.

Carpetas esperadas:

```text
clases-pri
prof-pri
clases-eso
prof-eso
```

## Uso Local

Colocar estos archivos junto a las carpetas de horarios:

```text
untis.css
apply-horarios.bat
upload-horarios.bat
```

Para preparar las cuatro carpetas localmente:

```bat
apply-horarios.bat
```

Este script:

- Copia `untis.css` dentro de cada carpeta existente.
- Añade el enlace CSS a todos los `.htm`.
- Convierte los `.htm` a UTF-8.
- Cambia los GIF antiguos de navegación por botones `←`, `🏠`, `→`.

## Subir a GitHub

Ejecutar:

```bat
upload-horarios.bat
```

Este script clona `https://github.com/gecoas/untis.git`, copia las carpetas existentes, aplica CSS/UTF-8/iconos y hace commit y push.

Requisitos:

- Git for Windows instalado.
- Git autenticado contra GitHub.

`upload-clases.bat` queda como compatibilidad y llama internamente a `upload-horarios.bat`.

## Scripts Individuales

También existen scripts para usar dentro de una carpeta concreta:

```bat
add-css.bat
fix-encoding.bat
```

`add-css.bat` añade el enlace a `untis.css`.

`fix-encoding.bat` convierte los `.htm` a UTF-8.
