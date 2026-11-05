# Comprobación de migración y semilla local

Fecha: 5 de noviembre de 2026. SQL Server 2016 SP2 Express, instancia local SQLEXPRESS, acceso desde SSMS mediante Windows.

## Migración 001

- Creada y repetida en CHATBOT_MIGRATION_TEST_20261105_C12: creación correcta y segunda ejecución sin repetir cambios.
- Pasaron los 8 casos de 001_restricciones.sql en esa base temporal. Sus filas de prueba se revirtieron.
- Aplicada posteriormente en DW_ISTMA local: 8 tablas academico y 7 FK con NO ACTION.
- Se conservaron las tres tablas anteriores demo.Clientes, paco.APP_RV y paco.APP_LR_S4HANA.

## Semilla 001

Se aplicó dos veces primero en la base temporal y luego dos veces en DW_ISTMA. En cada base, la segunda ejecución mostró: «Semilla 001 ya aplicada: no se duplicaron ni sobrescribieron datos».

Después de las repeticiones se ejecutó 002_semilla.sql con resultado correcto en ambas bases:

| Tabla | Filas comprobadas |
|---|---:|
| Clientes | 14 |
| Rutas | 2 |
| ClienteRuta | 14 |
| Visitas | 18 |
| Categorias | 3 |
| Productos | 6 |
| Bodegas | 2 |
| Existencias | 12 |

La comprobación también verificó S08 (9 clientes, 13 registros), S09 (3 registros) y el día anterior (2 registros), las existencias agotadas y debajo del mínimo y el cliente inactivo.

La fecha de datos es fija: 2026-11-05 en Honduras; las visitas se guardan en UTC. Los códigos, nombres y productos son ficticios y los precios ilustrativos. No se usaron registros empresariales ni credenciales de la empresa.

## Límites de esta comprobación

- Se probó SQL desde SSMS; el ejecutor PowerShell aún no tiene prueba contra el motor desde la terminal restringida.
- Se agregó un adaptador académico en el cambio complementario del backend y una pantalla /visits en este frontend. Hay que importar ambos para usarlos; la comprobación completa HTTP/SQL desde la interfaz sigue pendiente. Consulta docs/flujo-visitas.md.
- No se comprobó todavía el flujo central contra estas tablas desde el frontend ni en un dominio público.
- La base temporal se conserva para revisión. El despliegue y la bitácora completa de semana 3 siguen pendientes.
