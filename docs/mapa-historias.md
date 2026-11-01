# Mapa de historias de usuario — Chatbot Istmania

## 1. Objetivo del producto

Desarrollar una plataforma conversacional para Distribuidora Istmania S.A. de C.V. que permita al personal consultar información comercial y operativa de manera rápida, segura y eficiente.

## 2. Roles del sistema

| Rol | Responsabilidades |
|---|---|
| Usuario interno | Iniciar sesión y consultar información mediante el chatbot. |
| Administrador | Gestionar usuarios, permisos y configuración del sistema. |
| Equipo de desarrollo | Diseñar, implementar, probar y mantener la plataforma. |

## 3. Mapa de historias

### Épica 1: Acceso y seguridad

**US-01. Iniciar sesión**
- Como usuario interno, quiero iniciar sesión para acceder al chatbot.
- Actividades: diseñar formulario, validar credenciales y gestionar sesión.
- Tareas: implementar campos, validaciones y mensajes de error.

**US-02. Cerrar sesión**
- Como usuario, quiero cerrar sesión para proteger mi cuenta.
- Actividades: implementar cierre de sesión.
- Tareas: invalidar sesión y redirigir al login.

**US-03. Controlar acceso**
- Como administrador, quiero restringir el acceso a usuarios autorizados.
- Actividades: definir permisos y protección de rutas.
- Tareas: implementar guardas de rutas y validación de permisos.

### Épica 2: Consultas conversacionales

**US-04. Enviar una consulta**
- Como usuario, quiero escribir una pregunta para obtener información comercial.
- Actividades: diseñar interfaz de chat y conexión con el servicio.
- Tareas: crear campo de mensaje, botón de envío y visualización de respuestas.

**US-05. Consultar inventario**
- Como usuario, quiero consultar existencias para conocer la disponibilidad de productos.
- Actividades: definir datos de inventario y formato de respuesta.
- Tareas: implementar consulta y presentación de resultados.

**US-06. Consultar pedidos**
- Como usuario, quiero consultar pedidos para conocer su estado.
- Actividades: definir criterios de búsqueda y estados.
- Tareas: implementar consulta y mostrar resultados.

**US-07. Consultar ventas**
- Como usuario, quiero consultar información de ventas para apoyar mis decisiones.
- Actividades: definir filtros y datos de ventas.
- Tareas: implementar consulta y presentación.

**US-08. Consultar proyecciones**
- Como usuario, quiero consultar proyecciones para planificar actividades comerciales.
- Actividades: definir datos y criterios de consulta.
- Tareas: implementar consulta y formato de respuesta.

**US-09. Consultar notas de crédito**
- Como usuario, quiero consultar notas de crédito para verificar información relacionada con operaciones comerciales.
- Actividades: definir campos de consulta.
- Tareas: implementar búsqueda y presentación.

**US-10. Consultar promociones**
- Como usuario, quiero consultar promociones vigentes para informar a clientes.
- Actividades: definir datos de promociones y vigencia.
- Tareas: implementar consulta y mostrar condiciones.

### Épica 3: Experiencia de usuario

**US-11. Ver historial de conversación**
- Como usuario, quiero revisar mis consultas anteriores para recuperar información.
- Actividades: diseñar historial.
- Tareas: almacenar y mostrar mensajes de la sesión.

**US-12. Limpiar conversación**
- Como usuario, quiero iniciar una conversación nueva para separar consultas.
- Actividades: definir comportamiento de reinicio.
- Tareas: limpiar mensajes visibles y estado de conversación.

**US-13. Recibir mensajes de error claros**
- Como usuario, quiero comprender los errores para saber cómo continuar.
- Actividades: identificar errores comunes.
- Tareas: mostrar mensajes claros y opciones de reintento.

### Épica 4: Administración y calidad

**US-14. Gestionar usuarios**
- Como administrador, quiero gestionar usuarios para controlar el acceso.
- Actividades: diseñar administración de usuarios.
- Tareas: implementar creación, edición y desactivación.

**US-15. Registrar actividad**
- Como administrador, quiero consultar registros de actividad para supervisar el uso del sistema.
- Actividades: definir eventos y datos de auditoría.
- Tareas: registrar accesos y consultas según los permisos establecidos.

## 4. Cortes de entrega

### Corte 1 — MVP

Objetivo: entregar una aplicación accesible y funcional que permita a usuarios autorizados iniciar sesión y realizar consultas básicas al chatbot.

Historias incluidas:
- US-01: Iniciar sesión.
- US-02: Cerrar sesión.
- US-04: Enviar una consulta.
- US-05: Consultar inventario (con datos de prueba si aún no existe integración).
- US-13: Recibir mensajes de error claros.

Criterio de salida: aplicación desplegada en HTTPS, login funcional y flujo básico de consulta probado.

### Corte 2 — Ampliación funcional

Objetivo: ampliar las consultas disponibles y mejorar la administración y experiencia de usuario.

Historias incluidas:
- US-03: Controlar acceso.
- US-06: Consultar pedidos.
- US-07: Consultar ventas.
- US-08: Consultar proyecciones.
- US-09: Consultar notas de crédito.
- US-10: Consultar promociones.
- US-11: Ver historial de conversación.
- US-12: Limpiar conversación.
- US-14: Gestionar usuarios.
- US-15: Registrar actividad.

Criterio de salida: funcionalidades ampliadas probadas y documentadas.

## 5. Consideraciones

- Las consultas dependen de la disponibilidad y autorización de las fuentes de datos.
- Las historias representan el alcance planificado; su inclusión no implica que estén implementadas.
- Las integraciones con sistemas empresariales deberán validarse con el equipo responsable.
