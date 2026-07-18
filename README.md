# Estilos para horarios Untis

Este repositorio contiene una hoja de estilos para mejorar la presentación de los horarios exportados desde Untis.

La pagina de inicio del sitio es:

```text
clases/Clases.htm
```

El archivo `index.html` de la raiz redirige automaticamente a esa pagina.

## Uso

1. Copiar `untis.css` en la misma carpeta que los archivos `.htm` exportados por Untis.
2. Añadir en cada archivo `.htm`, antes de `</head>`:

```html
<link rel="stylesheet" type="text/css" href="untis.css">
```

3. Opcionalmente, ejecutar `add-css.bat` desde la carpeta de los `.htm` para añadir el enlace automáticamente.

```bat
add-css.bat
```

Tambien se puede ejecutar `add-css.ps1` desde PowerShell.

```powershell
powershell -ExecutionPolicy Bypass -File .\add-css.ps1
```

El CSS mantiene la estructura generada por Untis, mejora la legibilidad de las tablas y sustituye visualmente los iconos antiguos de navegación por botones modernos.

## Subir la carpeta completa `clases` a GitHub desde Windows

Guardar `upload-clases.bat` en la carpeta que contiene `clases`, por ejemplo:

```text
C:\Users\AsociacionAA\Desktop\Untis\upload-clases.bat
C:\Users\AsociacionAA\Desktop\Untis\clases\
```

Después ejecutar `upload-clases.bat`. Requiere Git for Windows instalado y autenticado en GitHub.
