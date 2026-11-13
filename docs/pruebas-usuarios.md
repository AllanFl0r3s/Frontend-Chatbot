# Pruebas con usuarios — semana 5

**Estado: guion preparado; sesiones pendientes.** Actualizado el 13 de noviembre de 2026, hora de Honduras (UTC-6). El propietario confirmó que recuperó su cuenta pública y aún no tiene participantes. No se registran resultados ficticios ni se cuentan las pruebas automatizadas como participantes.

## Objetivo y preparación

Evaluar el recorrido de acceso, consulta de stock, detalle por bodega y cierre de sesión sin ayuda, además de las acciones correspondientes a cada rol.

Usar https://chatbot-clase-vista-previa.vercel.app y datos ficticios. La base pública tiene el catálogo actualizado de Quartz, Plata Lite, Vitalit, Dropp y 220. La base local conserva productos genéricos: no mezclar sus resultados con producción. Los valores de referencia proceden del [catálogo académico documentado](https://github.com/AllanFl0r3s/ChatbotBackendLocal/blob/main/docs/catalogo-istmania-demo.md); contrastarlos antes de cada sesión.

Propuesta de cobertura: tres personas, dos con rol USUARIO y una ADMINISTRADOR. Es una propuesta operativa, no un mínimo atribuido al curso. Registrar la cantidad real y evitar que el desarrollador sea el único participante.

Explicar el objetivo y pedir consentimiento para notas anónimas. Usar P01, P02…; no publicar nombres, correos, contraseñas, JWT, enlaces de recuperación ni capturas de usuarios reales. No grabar por defecto. Entregar credenciales de demostración privadamente. Para recuperar acceso se necesita un correo controlado por el participante.

Antes de invitar: verificar login público y stock; preparar una cuenta ficticia editable para administración. Para visitas, comprobar la asignación de S08 en VISITS_ROUTE_ACCESS: el rol administrador tampoco concede rutas automáticamente. Si falta acceso, registrar la tarea pendiente; no certificar ese recorrido. No eliminar ni desactivar al único administrador.

## Participantes anónimos

| Código | Rol probado | Experiencia previa | Dispositivo/navegador | Fecha/hora Honduras | Consentimiento |
|---|---|---|---|---|---|
| Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |

## Guion (15–20 minutos)

Introducción: «Estamos probando la aplicación. Realiza estas tareas como lo harías normalmente y comenta qué esperas encontrar». Leer la meta sin dictar los pasos ni la solución. Registrar toda ayuda. Las indicaciones de verificación son para el moderador, después del intento.

| ID | Rol | Meta para el participante | Verificación del moderador |
|---|---|---|---|
| T01 | Ambos | Entra con la cuenta facilitada. | Acceso al chat con el rol preparado. |
| T02 | Ambos | Averigua cuántas unidades de Quartz de 600 ml hay. | 135 unidades. Para diagnóstico posterior: `menu`, luego `stock de quartz 600ml`. |
| T03 | Ambos | Averigua cómo se reparten esas unidades entre bodegas. | Selección del producto: central 120 + ruta 15 = 135. |
| T04 | Ambos | Busca stock del producto inexistente ZZ_NO_EXISTE_2026. | No inventa productos/cifras ni muestra como respuesta el resultado anterior. `menu` reinicia una consulta independiente. |
| T05 | Ambos con ruta | Busca los clientes con registros de S08 del 5 de noviembre de 2026. | /visits: 9 clientes, 13 registros; tamaño 5: páginas de 5 y 4 clientes. No son ventas ni visitas completadas. |
| T06 | USUARIO | Intenta abrir administración en /users. | No puede listar ni modificar usuarios. Redirección o denegación; verificar HTTP 403 aparte con el moderador. |
| T07 | ADMINISTRADOR | Busca la cuenta ficticia preparada y cambia solo su nombre de demostración. | Guardado y persistencia al recargar, conservando rol/estado. Restaurar el nombre y registrar la restauración. No borrar cuentas. |
| T08 | Ambos | Sal e intenta volver a una pantalla protegida. | Regreso al login; sin acceso a datos con la sesión cerrada. Verificar revocación HTTP aparte. |
| T09 | Cuenta con correo propio | Recupera el acceso por correo e inicia sesión con otra contraseña. | Correo recibido, cambio y login correctos. Complementaria en sesión separada; no guardar enlace ni contraseña. |

Ventas, pedidos, promociones y preguntas generales de IA no están certificados como disponibles. Si el menú invita a esas opciones y genera confusión, registrar el hallazgo. Registrar el arranque en frío de Render por separado, sin ocultar su impacto si afecta al participante.

## Resultados por tarea

Una fila por persona y tarea. Estados: **sin ayuda**, **con ayuda**, **falló**, **no realizada**. Medir desde la lectura de la meta hasta el resultado o abandono. Una tarea dependiente bloqueada queda como no realizada con su causa y hallazgo, no como aprobada.

| Participante | Tarea | Resultado | Tiempo (s) | Ayuda | Observación anónima | Hallazgo |
|---|---|---|---:|---|---|---|
| Pendiente | Pendiente | No realizada | — | — | Aún no se convocan participantes. | — |

## Hallazgos: severidad y frecuencia

- **Bloqueante:** impide terminar el recorrido principal de un rol sin alternativa viable; corregir y verificar en producción antes de cerrar semana 5.
- **Grave:** resultado incorrecto, pérdida de acceso/datos o imposibilidad de una tarea importante; crear issue y priorizar.
- **Moderada:** requiere ayuda o pasos adicionales, con alternativa razonable.
- **Leve:** detalle visual o de redacción sin impedir la tarea.

Frecuencia = participantes afectados / participantes que intentaron la tarea relevante (n/N). Anotar aparte los intentos repetidos. Los hallazgos de código no tienen frecuencia de participantes medida. Vincular cada hallazgo al [registro](hallazgos-semana-5.md), con issue para cada grave/bloqueante.

## Decisión sobre la hipótesis

Se evalúa H3 de [visión](vision.md): al menos 80% de usuarios completa las tareas sin ayuda. Antes de medir se define el recorrido común como T01, T02, T03 y T08. Una persona cumple si completa las cuatro correctamente sin intervención. Métrica: personas que cumplen / personas que iniciaron el recorrido; quienes quedan bloqueados después de iniciarlo siguen en el denominador. Interrupciones ajenas al producto y exclusiones se justifican por separado. T05–T07 también se informan para cubrir roles/rutas, aunque no formen parte de esta métrica común.

| Hipótesis | Evidencia requerida | Estado | Decisión |
|---|---|---|---|
| H3: ≥80% sin ayuda | Resultados individuales del recorrido común y n/N | Sin muestra; porcentaje no calculable | **Pendiente de evaluación** |
| H1: reducir ≥30% el tiempo | Comparación con método manual equivalente | No recogida | No evaluada |
| H2: ≥95% respuestas correctas | Muestra contrastada con la fuente | No recogida con participantes | No evaluada |
| H4: reducir ≥20% la ayuda de terceros | Comparación antes/después | No recogida | No evaluada |

Al terminar H3: registrar n/N y decidir «apoyada en esta muestra», «no apoyada en esta muestra» o «evidencia insuficiente», con limitaciones. Una muestra pequeña no representa toda la organización. No cambiar el umbral después de observar los resultados.

## Cierre

Completar participantes/resultados/decisión; publicar issues graves/bloqueantes; enlazar correcciones y repetir las tareas bloqueadas en la URL pública. Registrar fecha, commit/despliegue y resultado anterior/posterior. Validar cada rol participante. Revisar el [checklist de entrega](bitacora/semana-5.md) antes de crear el release semana-5.
