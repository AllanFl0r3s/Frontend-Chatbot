# Estrategia de pruebas de semana 7

El foco es impedir acceso a clientes ajenos, errores en dinero y pérdida del recorrido de cartera. La entrega principal es Frontend-Chatbot. El pipeline también obtiene y prueba el backend real en la versión indicada por `scripts/ci/backend-ref`; no sustituye la API por respuestas simuladas en las pruebas de integración y E2E.

## Riesgos y niveles

| Riesgo | Prioridad | Prueba y evidencia |
|---|---|---|
| Usuario modifica roles o rutas sin ser administrador | Alta | Jest del backend y `01-api.spec.ts`: 401 sin sesión, 403 para usuario, 400 para ruta inválida y registro con rol inyectado. |
| Consulta de cartera de otro cliente o permisos antiguos | Alta | HTTP con JWT, servicio real y SQL: cliente ajeno sin saldos, reasignación y revocación durante la misma sesión. |
| Saldos, centavos o pagos incorrectos | Alta | SQL real: L 3200 pendientes, L 1800 vencidos y L 500 próximos al 27/11/2026; factura pagada excluida; 1000.05 menos 200.01 da 800.04; SQL rechaza pago mayor al monto. |
| Atajo continúa una consulta después de una denegación | Alta | Cuatro pruebas del componente: denegación detiene la secuencia, error no fabrica dinero, doble clic no duplica y se conserva el borrador. |
| El usuario no puede completar el flujo | Alta | Chromium: login → Consultar mi cartera → CLI-001 → saldo L 800 → logout → administración protegida. Angular, Nest, JWT y SQL reales. |
| Sesión vencida o logout no revocado | Alta | Unitarias de sesión e integración: un JWT cerrado recibe 401. |
| Build publicado apunta a localhost o a HTTP | Alta | `test/cloud-environment.test.cjs` y compilación cloud con URL HTTPS pública. |
| Diferencias de renderizado del shell Angular | Media | Karma con Chromium: todas las especificaciones Angular, incluida la raíz con router-outlet. |

Las pruebas unitarias del backend simulan repositorios en sus fixtures; los tests de integración y E2E de esta entrega usan dos bases SQL reales. Esto permite detectar fallos de consultas y restricciones que un mock no detectaría.

## Pipeline reproducible

`.github/workflows/ci.yml` corre en cada push y pull request y admite ejecución manual. No omite errores ni convierte fallos en éxito. Sus nombres estables para protección de rama son `Frontend: pruebas y build` y `E2E: cartera con SQL`.

El primer job instala con npm ci, ejecuta pruebas de configuración, las 16 comprobaciones Node/Angular y compila para Vercel. El segundo obtiene el backend por SHA, instala y compila, ejecuta sus 196 pruebas Jest, levanta SQL Server Developer 2022 en un contenedor aislado y prepara las bases CHATBOT_WEEK7_CI y DW_ISTMA_WEEK7_CI. Después ejecuta Karma en Chromium y tres pruebas Playwright: dos integraciones de API/SQL y un recorrido completo del navegador.

Los reportes HTML/JUnit, capturas y trazas de fallos se conservan como artefactos durante catorce días. Los tests se ejecutan con un worker y sin reintentos para no ocultar fallos. El backend y Angular se arrancan y esperan mediante webServer de Playwright; no se reutiliza un servidor de otra sesión.

## Datos y seguridad del entorno de prueba

- SQL solo admite loopback y los puertos CI 14339 o Express local 14330. Las bases tienen nombres fijos de prueba y una marca de propiedad; se rechazan bases existentes sin ella. No se borran bases para ocultar inconsistencias.
- Las cuentas `ci.admin` y `ci.vendedor`, sus contraseñas y los secretos CI son ficticios y exclusivos de estas bases. No se usan contraseñas, tokens, Azure, Brevo, OpenAI ni cuentas de producción.
- El adaptador extrae cuerpos de los scripts versionados hacia las bases de CI porque sus protecciones externas solo admiten Azure académico o SQLEXPRESS. No cambia los archivos originales ni certifica la ejecución del guardado de destino en Azure. La cadena completa de tablas y datos sí se ejecuta con SQL real.
- El reloj del negocio del proceso de pruebas se fija al 27/11/2026; el reloj de JWT y sesiones sigue siendo real. Así los vencimientos no cambian entre ejecuciones.
- La prueba de centavos modifica un documento exclusivamente en DW_ISTMA_WEEK7_CI y restaura sus valores en finally. La producción no recibe esas escrituras.

## Comandos

```bash
npm ci
npm run test:cloud-config
npm run test:unit:ci
npm run build:cloud
# PUBLIC_API_URL debe ser https://chatbotbackendlocal-1.onrender.com

# Tras instalar y compilar el backend fijado, y preparar SQL aislado:
npm run test:ci:database
npx playwright install --with-deps chromium
npm run test:browser:ci
npm run test:e2e
```

Para ejecución local de SQL se requiere BACKEND_DIR, CI_SQL_USER, CI_SQL_PASSWORD y CI_SQL_PORT. El script de pruebas configura CHROME_BIN con el Headless Shell de Playwright para Karma; esto evita el bloqueo observado con Chrome completo en Windows. Con CI=true usa el lanzador ChromeHeadlessNoSandbox incluido por Angular, porque Ubuntu rechazó el arranque con «No usable sandbox». El cambio afecta solo al navegador efímero de pruebas y no modifica la aplicación publicada ni la configuración del sistema. El workflow configura las variables SQL automáticamente; nunca copiar las claves CI a Render.

## Alcance y límites

La cadena completa se comprobó localmente con SQL Server Express y Chromium en Windows. El [run remoto](https://github.com/AllanFl0r3s/Frontend-Chatbot/actions/runs/46074459650) aprobó el job de frontend, las 196 pruebas del backend y la preparación de SQL Server 2022, pero falló al arrancar Karma. La corrección del lanzador aprobó 18 pruebas locales con CI=true; falta publicar y verificar ese ajuste en Ubuntu. Un YAML creado o un resultado local no equivale a Actions en verde.

Responder 200 en login y health verifica disponibilidad HTTPS, no el flujo autenticado de producción. El tercer flujo debe llegar mediante PR y probarse después de Vercel antes del release. La recuperación por correo, los servicios empresariales reales y el desempeño con concurrencia no se certifican en esta entrega.

La instalación de dependencias informó 63 avisos de npm audit, incluidos cuatro críticos. Queda pendiente su clasificación y actualización compatible; este pipeline prueba funcionamiento y permisos y no se presenta como una auditoría de seguridad completa. Se mantienen las advertencias de tamaño de estilos existentes.

Referencias: [servicios de GitHub Actions](https://docs.github.com/en/actions/tutorials/use-containerized-services/use-docker-service-containers), [SQL Server en contenedores](https://learn.microsoft.com/en-us/sql/linux/install-upgrade/quickstart-install-docker?view=sql-server-ver17), [webServer de Playwright](https://playwright.dev/docs/test-webserver) y [protección y comprobaciones obligatorias](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks).
