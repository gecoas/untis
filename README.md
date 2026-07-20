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
upload-horarios.bat
```

## Subir a GitHub

Ejecutar:

```bat
upload-horarios.bat
```

Este script clona `https://github.com/gecoas/untis.git`, copia las carpetas existentes, aplica CSS/UTF-8/iconos y hace commit y push.

El script exige que existan las cuatro carpetas y que cada una contenga archivos `.htm`. Si falta `clases-eso` o está vacía, se detiene para evitar una subida incompleta.

Requisitos:

- Git for Windows instalado.
- Git autenticado contra GitHub.

Si `clases-eso/Clases.htm` muestra un aviso, significa que todavía no se ha subido la exportación real de clases de ESO.
