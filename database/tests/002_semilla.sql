/* Comprobación de solo lectura, después de cargar la semilla.
   Ejecutar inmediatamente después de la carga y después de repetirla.
   Los conteos exactos corresponden a la demostración inicial, no a una base ya ampliada.
*/
SET NOCOUNT ON;
IF DB_NAME()<>N'DW_ISTMA' AND DB_NAME() NOT LIKE N'CHATBOT[_]MIGRATION[_]TEST[_]%'
    THROW 51400,N'Selecciona la base académica local o la temporal.',1;
IF COALESCE(CONVERT(nvarchar(128),SERVERPROPERTY('InstanceName')),N'')<>N'SQLEXPRESS'
   OR UPPER(COALESCE(CONVERT(nvarchar(128),SERVERPROPERTY('MachineName')),N''))<>UPPER(HOST_NAME())
    THROW 51401,N'La comprobación exige la instancia SQLEXPRESS local.',1;
IF NOT EXISTS (SELECT 1 FROM sys.extended_properties WHERE class=0 AND name=N'Entorno'
    AND CONVERT(nvarchar(128),value)=N'DEMOSTRACION LOCAL - DATOS FICTICIOS')
    THROW 51402,N'Falta la marca académica.',1;

IF (SELECT COUNT(*) FROM dbo.__AcademicSeeds WHERE Nombre=N'001_datos_academicos' AND FechaDatos='20261105')<>1
    THROW 51403,N'No hay un único registro de esta semilla con su fecha esperada.',1;

DECLARE @Resumen TABLE(Tabla nvarchar(40), Registros int, Esperados int);
INSERT INTO @Resumen(Tabla,Registros,Esperados)
SELECT N'Clientes',COUNT(*),14 FROM academico.Clientes
UNION ALL SELECT N'Rutas',COUNT(*),2 FROM academico.Rutas
UNION ALL SELECT N'ClienteRuta',COUNT(*),14 FROM academico.ClienteRuta
UNION ALL SELECT N'Visitas',COUNT(*),18 FROM academico.Visitas
UNION ALL SELECT N'Categorias',COUNT(*),3 FROM academico.Categorias
UNION ALL SELECT N'Productos',COUNT(*),6 FROM academico.Productos
UNION ALL SELECT N'Bodegas',COUNT(*),2 FROM academico.Bodegas
UNION ALL SELECT N'Existencias',COUNT(*),12 FROM academico.Existencias;
IF EXISTS(SELECT 1 FROM @Resumen WHERE Registros<>Esperados)
    THROW 51404,N'Los conteos no coinciden con la semilla inicial. Revisa duplicados o cambios posteriores.',1;

DECLARE @ClientesS08 int, @RegistrosS08 int;
SELECT @ClientesS08=COUNT(DISTINCT v.ClienteId),@RegistrosS08=COUNT(*)
FROM academico.Visitas v JOIN academico.Rutas r ON r.Id=v.RutaId
WHERE r.Codigo=N'S08' AND CONVERT(date,DATEADD(hour,-6,v.FechaHora))='20261105';
IF @ClientesS08<>9 OR @RegistrosS08<>13
    THROW 51405,N'S08 debe tener 9 clientes y 13 registros en la fecha de demostración.',1;

IF (SELECT COUNT(*) FROM academico.Visitas v JOIN academico.Rutas r ON r.Id=v.RutaId
    WHERE r.Codigo=N'S09' AND CONVERT(date,DATEADD(hour,-6,v.FechaHora))='20261105')<>3
    THROW 51406,N'S09 debe tener 3 registros separados de S08.',1;
IF (SELECT COUNT(*) FROM academico.Visitas
    WHERE CONVERT(date,DATEADD(hour,-6,FechaHora))='20261104')<>2
    THROW 51407,N'Deben existir 2 registros del día anterior.',1;
IF (SELECT COUNT(*) FROM academico.Existencias WHERE Cantidad=0)<>2
    THROW 51408,N'Deben existir 2 existencias agotadas.',1;
IF (SELECT COUNT(*) FROM academico.Existencias WHERE Cantidad>0 AND Cantidad<Minimo)<>1
    THROW 51409,N'Debe existir 1 existencia positiva debajo del mínimo.',1;
IF NOT EXISTS(SELECT 1 FROM academico.Clientes WHERE Codigo=N'DEMO011' AND Activo=0)
    THROW 51410,N'Falta el cliente inactivo previsto.',1;

SELECT Tabla,Registros,Esperados FROM @Resumen ORDER BY Tabla;
SELECT N'S08' AS Ruta,CONVERT(date,'20261105',112) AS FechaHonduras,
    @ClientesS08 AS ClientesDistintos,@RegistrosS08 AS RegistrosVisita;
PRINT N'Comprobación correcta: conteos, filtros por ruta/fecha, stock e inactividad coinciden.';
