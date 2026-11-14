# Hallazgos y prioridades — semana 5

**13/11/2026: sin sesiones de participantes.** No se ha certificado ausencia de bloqueantes. Los registros siguientes proceden del propietario o de revisión técnica, no de usuarios invitados. H-xx identifica hallazgos de este documento, no números de issues de GitHub.

| ID | Origen / hallazgo | Severidad | Frecuencia | Estado | Prioridad |
|---|---|---|---|---|---|
| H-01 | Propietario: recuperación pública no disponible por ausencia de BREVO_API_KEY y RECOVERY_FROM_EMAIL en Render. | Grave: impide recuperar acceso. | Un reporte del propietario; no medida con participantes. | Configuradas por el propietario; confirmó recuperación pública el 13/11. Falta registrar despliegue y probar rechazos de enlace usado/contraseña anterior. Issue no creado. | Semana 5: trazabilidad y T09. |
| H-02 | Código: UsersService.update/remove no comprueba si una operación deja cero administradores activos. | Grave potencial: pérdida de administración. | No medida; no se ejecutó una operación destructiva en Azure. | Pendiente de corrección/prueba aislada. Issue no creado. | Semana 6, antes de ampliar administración. Si bloquea una sesión, resolver antes de cerrar semana 5. |
| H-03 | HTTP/SQL local 14/11: las consultas heredadas del menú devolvían 500. También se detectaron pasos incompletos en pedidos y ventas por vendedor. | Grave: impedía recorridos completos. | Secuencias técnicas; participantes no medidos. | Corregido localmente con migración 004 y navegación determinista; SQL aplicado y verificado en Azure con chatbot_web. Falta desplegar código y verificar la app pública. Issue de trazabilidad no creado. | Semana 5: cerrar tras desplegar y repetir recorridos públicos. |
| H-04 | HTTP local 14/11: stock de jabón no encontraba el producto con o sin tilde. | Moderada: búsqueda por nombre incompleta. | Dos variantes técnicas; participantes no medidos. | Corregido con comparación SQL insensible a tildes; comprobar tras publicar. El catálogo local y Azure siguen siendo distintos. Issue no creado. | Semana 5: incluido en corrección del menú. |

## Borradores de issues

Listos para copiar en https://github.com/AllanFl0r3s/ChatbotBackendLocal/issues, **aún no publicados**. El requisito de issues creados sigue pendiente; añadir aquí los enlaces reales después de crearlos.

### H-01 — Recuperación pública no disponible por configuración de correo

Gravedad: grave. Prioridad: semana 5. Origen: propietario.

Pasos: abrir /forgot-password del frontend público e introducir el correo de una cuenta propia. Antes de configurar las variables faltantes, respondía «La recuperación por correo todavía no está disponible». RecoveryMailService.configuration rechaza la configuración incompleta antes del envío.

Esperado: solicitud válida y enlace recibido para una cuenta activa. Corrección: configurar las dos variables en Render junto con secretos/origen existentes y aplicar el despliegue, sin publicar valores.

Evidencia: propietario confirmó recuperación el 13/11/2026; ID de despliegue corregido pendiente. Cierre: registrar despliegue/commit, repetir T09 y rechazos de contraseña anterior/enlace usado. No adjuntar correo, clave ni enlace de recuperación.

### H-02 — Proteger la última cuenta administradora activa

Gravedad: grave potencial. Prioridad: semana 6. Origen: revisión estática de src/users/users.service.ts, métodos update y remove del backend.

Situación: /users exige administrador, pero el servicio guarda roleId/estado o elimina una cuenta sin comprobar si quedará un administrador activo. No se reprodujo destructivamente en producción.

Aceptación: rechazar eliminación, desactivación o cambio de rol que deje cero administradores activos, también bajo concurrencia; conservar cambios legítimos cuando quede otro administrador. Probar con base temporal o persistencia aislada y respuesta HTTP clara. Registrar commit/PR y verificar el código desplegado sin arriesgar al único administrador público. No conceder permisos a participantes para reproducir este caso.

## Hallazgos futuros de participantes

La evidencia técnica y los pasos de H-03/H-04 están en [validación funcional del 14/11](validacion-funciones-chatbot.md). Para publicar H-03 en el backend: título «Alinear el menú académico con las consultas disponibles», incluir las cinco secuencias de ese informe, esperado = respuesta funcional o indisponibilidad explícita sin 500, y aceptación = menú e implementación coherentes, sin inventar datos, con pruebas de regresión. No se ha creado el issue en GitHub.

Registrar ID, tarea/pasos, esperado/observado, participantes anónimos afectados y n/N, severidad, enlace al issue si grave/bloqueante, responsable, semana objetivo, estado y revalidación pública con commit/despliegue.

Los bloqueantes se corrigen y verifican en semana 5 antes del release. Las mejoras diferibles se priorizan para semanas 6–9 según evidencia. La planificación de semanas 7–9 queda pendiente de los resultados; no se inventan hallazgos para llenarla.
