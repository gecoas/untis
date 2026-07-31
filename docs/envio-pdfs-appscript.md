# Envío de horarios PDF con Google Apps Script

Este flujo usa Google Apps Script para generar PDFs desde la web publicada y enviarlos con Gmail. No usa Python ni servidor propio.

## Qué hace

- Muestra una web privada con la lista de profesores.
- Separa los profesores en dos pestañas: `Primaria` y `ESO/Bach`.
- En cada pestaña solo propone horarios de ese nivel.
- Para cada profesor muestra los PDFs previstos.
- Permite generar y abrir el PDF para comprobarlo antes de enviar.
- Permite personalizar el texto del correo antes de enviarlo.
- Envía el PDF del profesor por Gmail.
- Si el profesor es tutor, añade también el PDF del grupo, tanto de Primaria como de ESO/Bachillerato.

## Preparar Google Sheet

Crea una hoja de cálculo privada con dos pestañas:

- `Primaria`
- `ESO/Bach`

Cada pestaña debe tener estas columnas exactas:

```text
Profesor | email | Tutor de Grupo
```

Pega en cada pestaña los profesores correspondientes. No se sube a GitHub.

El campo `Tutor de Grupo` acepta valores como:

```text
4º A Primaria
1º ESO A
2º Bachillerato B
BAC 1A
```

## Crear Apps Script

1. Entra en `https://script.google.com`.
2. Crea un proyecto nuevo.
3. Copia el contenido de `apps-script/Code.gs` en el archivo `Code.gs`.
4. Crea un archivo HTML llamado `Index` y copia `apps-script/Index.html`.
5. En configuración del proyecto, activa `Mostrar archivo de manifiesto`.
6. Copia `apps-script/appsscript.json` en el manifiesto.

## Propiedades del script

En `Configuración del proyecto` añade estas propiedades:

```text
SHEET_ID = ID de la hoja de cálculo
SITE_BASE_URL = https://gecoas.github.io/untis
```

Opcional:

```text
PDF_FOLDER_ID = ID de una carpeta de Drive donde guardar los PDFs
SHEET_NAMES = Primaria,ESO/Bach
```

Si no pones `SHEET_NAMES`, el script lee automáticamente `Primaria` y `ESO/Bach`.

Si no pones `PDF_FOLDER_ID`, el script crea o usa una carpeta llamada `Horarios Untis PDF`.

## Desplegar como web app

1. Pulsa `Implementar` > `Nueva implementación`.
2. Tipo: `Aplicación web`.
3. Ejecutar como: `Yo`.
4. Quién tiene acceso: `Solo yo` o usuarios de tu dominio.
5. Autoriza permisos de Gmail, Drive, Sheets y UrlFetch.

## Uso

1. Abre la URL de la aplicación web.
2. Pulsa `Cargar lista`.
3. Revisa o edita el campo `Texto del correo`.
4. Pulsa `Generar/ver PDF` en un profesor.
5. Revisa el PDF que abre desde Drive.
6. Si está correcto, pulsa `Enviar`.
7. Para enviar varios, selecciónalos y pulsa `Enviar seleccionados`.

## Seguridad

- No publiques la web app como `Cualquiera`.
- No guardes emails ni credenciales en GitHub.
- Los correos salen desde la cuenta que despliega el Apps Script.

## Limitación

Apps Script convierte HTML a PDF con el motor de Google, no con Chrome local. Conviene revisar varios PDFs antes de enviar en bloque.
