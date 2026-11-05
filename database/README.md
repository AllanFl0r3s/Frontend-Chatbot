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

Se verifican la sintaxis T-SQL con el analizador de SQL Server 2016 y la sintaxis de PowerShell. No se ha aplicado la migración a CHATBOT ni a DW_ISTMA. La terminal de preparación no logró autenticarse con Windows en SQL Server (SSPI/memoria compartida); la ejecución y la prueba de restricciones en el motor quedan pendientes desde SSMS.

## Cómo seguir

Una migración aplicada no se edita para introducir cambios nuevos: se agrega `002_...sql`, con su propia versión y transacción. Ejecuta por nombre ascendente; ante error se detiene el proceso. No se incluyen borrados automáticos de tablas como rollback: una corrección posterior debe preservar los datos y revisarse antes de ejecutarse.

El siguiente avance separará un script semilla realista de estas migraciones. El despliegue de backend y base pública sigue pendiente; esta versión está limitada explícitamente al entorno local académico.
