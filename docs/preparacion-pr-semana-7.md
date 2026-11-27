# Publicar la entrega de semana 7

El trabajo está en la rama `semana-7/pipeline-cartera`. main ya requiere PR y ambos checks del pipeline. El propietario conserva el commit y push.

## Commit sugerido

```text
feat: guiar consulta de cartera y agregar pipeline de semana 7
```

Desde GitHub Desktop, seleccionar Frontend-Chatbot y comprobar que la rama actual sea semana-7/pipeline-cartera. Revisar los cambios, crear el commit y publicar la rama. Después abrir el PR hacia main. Puede hacerse desde GitHub Desktop o [desde la comparación de ramas](https://github.com/AllanFl0r3s/Frontend-Chatbot/compare/main...semana-7%2Fpipeline-cartera?expand=1).

## Título del PR

```text
Guiar la consulta de cartera y verificar el flujo con CI
```

## Descripción propuesta

El vendedor puede abrir la cartera de su ruta desde un botón en el chat, sin recordar la secuencia del menú. El atajo conserva el borrador y se detiene si el servidor deniega el acceso o falla la consulta.

Se agrega un pipeline por push y pull request que compila el frontend, prueba sesión y permisos y ejecuta Chromium contra el backend real y SQL aislado. Comprueba saldos y centavos, factura pagada, acceso a otra ruta, reasignación y revocación, además del recorrido login → cartera → pulpería → logout.

Validación local: 18 pruebas Angular en Chromium, 16 comprobaciones Node/Angular de ese conjunto, dos pruebas de configuración y tres pruebas Playwright aprobadas. Build cloud aprobado. El job también obtiene y ejecuta las 196 pruebas Jest del backend fijado por SHA. Las bases de pruebas no son las de Azure.

La estrategia está en docs/pruebas.md y el estado observado en docs/bitacora/semana-7.md. El release manual solo se habilita después del merge, del pipeline verde para main y de confirmar la prueba autenticada en producción.

## Cierre después del push

1. Esperar que terminen `Frontend: pruebas y build` y `E2E: cartera con SQL` en la pestaña Checks del PR. Si falla uno, revisar su log y corregirlo; un resultado local no reemplaza este paso.
2. Mezclar el PR cuando esté en verde. El merge de este trabajo hace superar los 34 commits iniciales; usar commits reales, sin commits vacíos.
3. Esperar al nuevo run de main y al despliegue de Vercel.
4. Probar en producción con una cuenta de ruta S01: entrar, Consultar mi cartera, opción 3, CLI-001, comprobar el saldo y salir. Para otras rutas usar su pulpería correspondiente.
5. En Actions abrir Publicar semana-7 → Run workflow, elegir main y confirmar la casilla solo después de realizar la prueba. Se crea la etiqueta y release semana-7 si pasan todas las validaciones.
6. Registrar en la bitácora las URL reales de PR, run y release y entregar la URL de este repositorio y de la aplicación.

La cuenta y las contraseñas CI son exclusivamente de bases aisladas y no sirven para la aplicación pública. No agregar contraseñas reales a GitHub ni a la documentación.
