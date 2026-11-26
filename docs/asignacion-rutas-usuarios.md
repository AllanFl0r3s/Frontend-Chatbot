# Rutas de usuarios en Administración

El formulario Nuevo usuario y Editar usuario permite elegir S01 a S10 en Zona Norte o dejar la cuenta sin ruta. La lista muestra la asignación. El cambio se persiste por la API de usuarios y se valida en el backend; no es solo una etiqueta visual.

Antes de desplegar el backend actualizado, ejecutar `database/migrations/010_CHATBOT_rutas_usuarios.sql` en **CHATBOT** de Azure, no en DW_ISTMA. Después desplegar el backend en Render y este frontend en Vercel. El propietario hace los commits y push.

Los accesos anteriores se conservan hasta cambiar explícitamente la selección. El formulario advierte cuando una cuenta tenía varias rutas. Quitar la ruta revoca el acceso a Visitas, historial y promociones sugeridas. No crea cuentas de vendedores ni clientes nuevos; las rutas sin registros pueden responder sin resultados.

Verificación: compilación Angular cloud aprobada y revisión visual local del listado y formulario. Backend: 181 pruebas Jest y siete comprobaciones HTTP contra SQL local aprobadas. Ver detalles en `docs/asignacion-rutas-usuarios.md` del backend.
