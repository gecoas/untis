# Estilos para horarios Untis

Este repositorio contiene una hoja de estilos para mejorar la presentación de los horarios exportados desde Untis.

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
