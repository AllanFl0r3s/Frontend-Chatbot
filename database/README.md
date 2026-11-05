# Migraciones académicas — SQL Server 2016

Estos archivos pertenecen al repositorio entregado al curso para que el esquema sea revisable y reproducible. El backend sigue en el repositorio hermano ChatbotBackendLocal. Las migraciones no las ejecuta el navegador, Angular ni Vercel.

## Qué agrega la versión 001

En la base local DW_ISTMA crea el esquema `academico` con **8 tablas de negocio**: Clientes, Rutas, ClienteRuta, Visitas, Categorias, Productos, Bodegas y Existencias. Crea además `dbo.__AcademicMigrations`, que es infraestructura y no cuenta entre las ocho.

- PK, claves únicas, 7 FK con NO ACTION y validaciones CHECK.
- Rechaza cantidades/precios negativos, códigos vacíos y asignaciones con fechas invertidas.
- Conserva códigos como texto y permite varios registros de visita del mismo cliente.
- Fechas de eventos en UTC. ActualizadoEn se inicializa con UTC; el servicio deberá actualizarla al cambiar existencias.
- No crea datos semilla, no renombra tablas antiguas y no conecta todavía los endpoints al esquema nuevo.
- Los períodos superpuestos en ClienteRuta requieren validación transaccional del futuro servicio; el CHECK solo valida el orden Desde/Hasta.

La transacción registra la versión solo al terminar. Si falla la creación, revierte lo creado por esa ejecución. Un bloqueo de aplicación evita que dos ejecuciones compitan. Si 001 ya está registrada y sus ocho tablas existen, repetirla no inserta datos ni vuelve a crear tablas. Esto no sustituye una auditoría completa de cambios manuales en columnas y restricciones.

## Antes de ejecutar

1. Tener SQL Server Express 2016 local, instancia SQLEXPRESS, con la base DW_ISTMA académica preparada por el script original del backend. Si ya existe, **no vuelvas a ejecutar el script que crea la base**.
2. La base debe tener la propiedad Entorno = `DEMOSTRACION LOCAL - DATOS FICTICIOS`, que dejó el script original. No agregues esa marca a una base empresarial para saltar la comprobación.
3. Conectar con autenticación de Windows y una cuenta con permisos DDL en esta base. `chatbot_demo` es la cuenta de ejecución del backend y solo tiene lectura en DW_ISTMA; no ampliamos sus permisos para migrar.
4. Cerrar cualquier transacción abierta. Revisar y ejecutar el archivo completo, no una selección.

## Opción sencilla: SSMS

1. Conecta a `localhost\SQLEXPRESS` mediante Windows.
2. Abre `database/migrations/001_crear_esquema_comercial.sql`.
3. En el selector superior, elige **DW_ISTMA** de la instancia local.
4. Ejecuta. Debe indicar: `Migración 001 aplicada: ocho tablas comerciales, sin datos semilla.`
5. Actualiza el explorador y revisa las tablas `academico.*`.

## Opción de terminal

Desde la raíz del repositorio, en una PowerShell normal de tu computadora:

```powershell
.\database\Invoke-Migrations.ps1
```

El valor por defecto es 127.0.0.1,14330 y DW_ISTMA. Si prefieres la instancia con nombre:

```powershell
.\database\Invoke-Migrations.ps1 -Server 'localhost\SQLEXPRESS'
```

Requiere sqlcmd de las herramientas de SQL Server. Ante un error de autenticación, la ejecución se detiene; usa SSMS con Windows para revisar el acceso. No pongas contraseñas en el script.

## Comprobar desde SSMS

Con la base DW_ISTMA local seleccionada:

```sql
SELECT Version, Nombre, AplicadaEn
FROM dbo.__AcademicMigrations ORDER BY Version;

SELECT s.name AS Esquema, t.name AS Tabla
FROM sys.tables AS t
JOIN sys.schemas AS s ON s.schema_id = t.schema_id
WHERE s.name = N'academico'
ORDER BY t.name;
```

Debe aparecer la versión 1 y las ocho tablas. Volver a ejecutar 001 debe mostrar `ya aplicada` y conservar una sola fila para esa versión.

## Prueba de restricciones en una base temporal

La prueba no se ejecuta en DW_ISTMA. Desde SSMS local con Windows y permisos de crear bases, ejecuta lo siguiente **solo si no existe esa base de prueba**:

```sql
USE master;
GO
CREATE DATABASE CHATBOT_MIGRATION_TEST_001;
GO
USE CHATBOT_MIGRATION_TEST_001;
GO
EXEC sys.sp_addextendedproperty
    @name = N'Entorno', @value = N'DEMOSTRACION LOCAL - DATOS FICTICIOS';
```

En esa base temporal ejecuta el archivo 001 completo dos veces. Después ejecuta `database/tests/001_restricciones.sql`. Debe indicar que pasaron 8 casos; los datos de prueba se revierten. No uses esta base para datos personales ni empresariales.

La prueba comprueba códigos duplicados, nombre vacío, FK inexistente, fechas invertidas, precio y stock negativos, borrado protegido y múltiples visitas válidas. No es un script semilla para la aplicación. La creación/limpieza de la base temporal se controla desde SSMS.

## Estado de validación de este commit

El 5 de noviembre de 2026 se ejecutó la migración 001 desde SSMS con autenticación de Windows en SQL Server 2016 SP2 local. Primero se aplicó dos veces en CHATBOT_MIGRATION_TEST_20261105_C12: la primera creó las ocho tablas y la segunda reconoció la versión existente. Pasaron los 8 casos de database/tests/001_restricciones.sql. Después se aplicó a DW_ISTMA: se comprobaron las ocho tablas nuevas, las 7 FK NO ACTION y la conservación de las tres tablas anteriores demo/paco.

La terminal sigue sin poder conectarse al motor por sus permisos/autenticación; no se ha comprobado el ejecutor PowerShell contra SQL. La ejecución real se hizo desde SSMS. No se modificó CHATBOT ni se contactaron servidores empresariales.

## Datos semilla de la demostración

Después de la migración, abre `database/seeds/001_datos_academicos.sql` en SSMS, selecciona **DW_ISTMA local** y ejecuta el archivo completo con Windows. Los comentarios explican las inserciones y las FK. La carga ya fue aplicada y verificada en el entorno local de desarrollo: no necesitas volver a cargarla allí.

La semilla está separada de las migraciones. Usa datos creados desde cero, con precios ilustrativos en HNL y fecha fija **2026-11-05**. Las ocho tablas deben estar vacías para la primera carga; si no lo están y no existe el registro de semilla, se detiene sin sustituir nada. `dbo.__AcademicSeeds` registra la carga en la misma transacción. Una repetición reconoce ese registro y no duplica ni actualiza filas. No es una herramienta de restauración: si posteriormente se editan datos, repetirla no deshace esos cambios.

| Tabla academico.* | Filas iniciales |
|---|---:|
| Clientes | 14 |
| Rutas | 2 |
| ClienteRuta | 14 |
| Visitas | 18 |
| Categorias | 3 |
| Productos | 6 |
| Bodegas | 2 |
| Existencias | 12 |

Casos para probar el producto:

- S08 el 5 de noviembre: 9 clientes distintos y 13 registros de visita.
- S09 el mismo día: 3 clientes y 3 registros; no se mezclan con S08.
- S08 el 4 de noviembre: 2 clientes y 2 registros del día anterior.
- DEMO011 está inactivo y no tiene registros en esa fecha de demostración.
- Hay 2 existencias agotadas y 1 positiva debajo del mínimo; las otras 9 alcanzan su mínimo.
- Cada producto aparece en las dos bodegas; los códigos permiten buscarlo sin depender de IDs consecutivos.

`FechaHora` está en UTC; para obtener la fecha de Honduras en esta demostración usa `CONVERT(date, DATEADD(hour,-6,FechaHora))`. Por ejemplo, 09:00 de Honduras se guarda como 15:00 UTC. No cambies la fecha de referencia por GETDATE(): rompería la repetibilidad de las pruebas.

Abre `database/tests/002_semilla.sql`, selecciona la misma base y ejecuta para comprobar conteos y escenarios. Es una comprobación de solo lectura; los conteos exactos aplican a la carga inicial, antes de agregar registros nuevos. Se ejecutó correctamente en la base temporal y en DW_ISTMA después de repetir la semilla en ambas: los conteos siguieron iguales.

Los datos anteriores de `demo.Clientes` y `paco.APP_RV` conservan su fecha original. **El endpoint heredado sigue consultando paco.APP_RV**; todavía no consume academico.Visitas. La nueva semilla no cambia su respuesta ni habilita las consultas de inventario automáticamente. La integración de servicios/frontend es el siguiente paso.

## Cómo seguir

Una migración aplicada no se edita para introducir cambios nuevos: se agrega `002_...sql`, con su propia versión y transacción. Ejecuta por nombre ascendente; ante error se detiene el proceso. No se incluyen borrados automáticos de tablas como rollback: una corrección posterior debe preservar los datos y revisarse antes de ejecutarse.

Las semillas están en seeds/ y las comprobaciones en tests/; no se incluyen en el bucle automático de migraciones. El siguiente avance integrará un flujo del backend con las tablas nuevas. El despliegue de backend y base pública sigue pendiente; esta versión está limitada explícitamente al entorno local académico.
