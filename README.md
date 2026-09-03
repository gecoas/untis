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
upload-horarios.command
scripts/
```

## Subir a GitHub

### Windows

Ejecutar:

```bat
upload-horarios.bat
```

Este script clona `https://github.com/gecoas/untis.git`, copia las carpetas existentes, aplica CSS/UTF-8/iconos y hace commit y push.

El script exige que existan las cuatro carpetas y que cada una contenga archivos `.htm`. Si falta `clases-eso` o está vacía, se detiene para evitar una subida incompleta.

Requisitos:

- Git for Windows instalado.
- Git autenticado contra GitHub.

### macOS

Ejecutar desde Terminal una primera vez para dar permisos:

```bash
chmod +x upload-horarios.command scripts/*.py
```

Después puedes abrir `upload-horarios.command` con doble clic o desde Terminal:

```bash
./upload-horarios.command
```

En todos los casos se suben los HTML de grupos y profesores de Primaria/ESO desde las carpetas locales habituales. Puedes indicar opcionalmente la ruta de un PDF con el listado: se subirá como `docs/horarios-listado.pdf` y, además, se regenerarán los cuadros de profesores ESO/Bach a partir de sus columnas.

También puedes indicarlo directamente:

```bash
./upload-horarios.command --pdf "/ruta/al/listado-horarios.pdf"
```

Para no subir ningún PDF y evitar la pregunta:

```bash
./upload-horarios.command --no-pdf
```

Requisitos:

- Git de macOS instalado.
- `python3` instalado.
- `pdftotext` instalado para regenerar ESO desde el PDF (`brew install poppler`).
- Clave SSH configurada en GitHub, comprobable con `ssh -T git@github.com`.

Si `clases-eso/Clases.htm` muestra un aviso, significa que todavía no se ha subido la exportación real de clases de ESO.
