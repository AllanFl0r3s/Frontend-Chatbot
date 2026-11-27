## Cambios

- Acceso guiado a la cartera desde el chat con el botón Consultar mi cartera. Conserva el borrador y se detiene si el servidor deniega el acceso.
- Pipeline por push y pull request con compilación, pruebas de sesión, permisos, dinero y recorrido Chromium contra Nest y SQL reales.
- Fixtures aisladas con cincuenta pulperías, saldos vencidos, próximos y facturas pagadas.
- Estrategia por riesgo y bitácora documentadas.

## Validación

La evidencia del PR y del run aprobado se agrega automáticamente al publicar. El workflow de release comprueba main protegida, CI aprobada para ese commit, PR mezclado, documentos, token, al menos 35 commits y tres en los últimos diez días. También comprueba respuesta HTTPS y requiere confirmación de la prueba autenticada en producción.

Las pruebas no certifican datos empresariales reales, correo transaccional ni una auditoría completa de dependencias.
