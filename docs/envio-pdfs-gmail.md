# Envío de horarios PDF por Gmail

Este flujo se ejecuta en local, no desde GitHub Pages. Genera PDFs con Chrome/Edge y los envía por Gmail usando SMTP.

## Archivos privados

Coloca el CSV real en:

```text
private/users-primaria.csv
```

La carpeta `private/` está en `.gitignore`, por lo que no se suben emails a GitHub.

Formato:

```text
Profesor;email;Tutor de Grupo
Gonzalo García Corral;ggarcia@alcaste-lasfuentes.com;4º A Primaria
```

## Requisitos

- Python 3 instalado.
- Google Chrome o Microsoft Edge instalado.
- Gmail con verificación en dos pasos.
- Contraseña de aplicación de Gmail.

## Configurar Gmail

En PowerShell:

```powershell
$env:GMAIL_USER="tu-cuenta@gmail.com"
$env:GMAIL_APP_PASSWORD="contraseña-de-aplicación"
```

No uses la contraseña normal de Gmail.

## Simular

Primero genera PDFs y muestra qué enviaría, sin mandar correos:

```powershell
python scripts/send_primaria_pdfs.py --limit 3
```

Procesar solo un email:

```powershell
python scripts/send_primaria_pdfs.py --only-email ggarcia@alcaste-lasfuentes.com
```

## Enviar

Cuando la simulación esté bien:

```powershell
python scripts/send_primaria_pdfs.py --send
```

## Qué adjunta

- Si el profesor tiene horario en `prof-pri`, adjunta su horario.
- Si además es tutor y `Tutor de Grupo` está relleno, adjunta también el horario del grupo.
- Si no encuentra un horario, muestra un aviso y no envía ese adjunto.

Los PDFs generados se guardan en:

```text
out/pdfs-primaria/
```
