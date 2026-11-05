/* Ejecutar DESPUÉS de migración 001, solo en una base temporal de pruebas.
   No sirve como datos semilla. Los INSERT se revierten al finalizar.
*/
SET NOCOUNT ON;
-- En estas pruebas esperamos errores CHECK/FK y continuamos comprobando otros casos.
SET XACT_ABORT OFF;

IF DB_NAME() NOT LIKE N'CHATBOT[_]MIGRATION[_]TEST[_]%'
    THROW 51100, N'Esta prueba exige una base temporal CHATBOT_MIGRATION_TEST_.', 1;
IF COALESCE(CONVERT(nvarchar(128), SERVERPROPERTY('InstanceName')), N'') <> N'SQLEXPRESS'
   OR COALESCE(CONVERT(nvarchar(128), SERVERPROPERTY('Edition')), N'') NOT LIKE N'%Express%'
   OR UPPER(COALESCE(CONVERT(nvarchar(128), SERVERPROPERTY('MachineName')), N'')) <> UPPER(HOST_NAME())
    THROW 51101, N'La prueba exige SQL Express en esta misma computadora.', 1;
IF NOT EXISTS (SELECT 1 FROM sys.extended_properties WHERE class = 0 AND name = N'Entorno'
    AND CONVERT(nvarchar(128), value) = N'DEMOSTRACION LOCAL - DATOS FICTICIOS')
    THROW 51102, N'Falta la marca académica de la base temporal.', 1;
IF @@TRANCOUNT <> 0
    THROW 51103, N'Cierra la transacción abierta antes de probar.', 1;

BEGIN TRY
    BEGIN TRANSACTION;

    INSERT INTO academico.Clientes (Codigo, Nombre) VALUES (N'TEST-001', N'Cliente de prueba');
    DECLARE @ClienteId int = CONVERT(int, SCOPE_IDENTITY());
    INSERT INTO academico.Rutas (Codigo, Nombre) VALUES (N'TEST-RUTA', N'Ruta de prueba');
    DECLARE @RutaId int = CONVERT(int, SCOPE_IDENTITY());
    INSERT INTO academico.Categorias (Nombre) VALUES (N'Categoría de prueba 001');
    DECLARE @CategoriaId int = CONVERT(int, SCOPE_IDENTITY());
    INSERT INTO academico.Productos (CategoriaId, SKU, Nombre, PrecioBase)
    VALUES (@CategoriaId, N'TEST-SKU', N'Producto de prueba', 10.50);
    DECLARE @ProductoId int = CONVERT(int, SCOPE_IDENTITY());
    INSERT INTO academico.Bodegas (Codigo, Nombre) VALUES (N'TEST-BOD', N'Bodega de prueba');
    DECLARE @BodegaId int = CONVERT(int, SCOPE_IDENTITY());
    INSERT INTO academico.ClienteRuta (ClienteId, RutaId, Desde)
    VALUES (@ClienteId, @RutaId, '20260101');

    DECLARE @Casos TABLE (Numero int PRIMARY KEY, Nombre nvarchar(100), Consulta nvarchar(max), ErrorEsperado int);
    INSERT INTO @Casos (Numero, Nombre, Consulta, ErrorEsperado) VALUES
    (1, N'Código de cliente duplicado', N'INSERT INTO academico.Clientes(Codigo,Nombre) VALUES(N''TEST-001'',N''Otro'');', 2627),
    (2, N'Nombre de cliente vacío', N'INSERT INTO academico.Clientes(Codigo,Nombre) VALUES(N''TEST-VACIO'',N''   '');', 547),
    (3, N'Categoría inexistente', N'INSERT INTO academico.Productos(CategoriaId,SKU,Nombre,PrecioBase) VALUES(-1,N''TEST-HUERFANO'',N''Inválido'',1);', 547),
    (4, N'Fechas de asignación invertidas', N'INSERT INTO academico.ClienteRuta(ClienteId,RutaId,Desde,Hasta) VALUES(@C,@R,''20260201'',''20260101'');', 547),
    (5, N'Precio negativo', N'INSERT INTO academico.Productos(CategoriaId,SKU,Nombre,PrecioBase) VALUES(@K,N''TEST-PRECIO'',N''Inválido'',-1);', 547),
    (6, N'Stock negativo', N'INSERT INTO academico.Existencias(ProductoId,BodegaId,Cantidad) VALUES(@P,@B,-1);', 547),
    (7, N'Borrado de cliente referenciado', N'DELETE FROM academico.Clientes WHERE Id=@C;', 547);

    DECLARE @Numero int = 1, @Nombre nvarchar(100), @Consulta nvarchar(max), @ErrorEsperado int;
    WHILE @Numero <= 7
    BEGIN
        SELECT @Nombre = Nombre, @Consulta = Consulta, @ErrorEsperado = ErrorEsperado
        FROM @Casos WHERE Numero = @Numero;
        BEGIN TRY
            EXEC sys.sp_executesql @Consulta, N'@C int,@R int,@K int,@P int,@B int',
                @C=@ClienteId, @R=@RutaId, @K=@CategoriaId, @P=@ProductoId, @B=@BodegaId;
            THROW 51110, N'Una restricción no rechazó el dato inválido.', 1;
        END TRY
        BEGIN CATCH
            IF ERROR_NUMBER() <> @ErrorEsperado THROW;
            IF XACT_STATE() <> 1 THROW;
            PRINT N'OK: ' + @Nombre;
        END CATCH;
        SET @Numero = @Numero + 1;
    END;

    INSERT INTO academico.Visitas (ClienteId, RutaId, FechaHora)
    VALUES (@ClienteId,@RutaId,'2026-01-01T15:00:00'), (@ClienteId,@RutaId,'2026-01-01T16:00:00');
    IF (SELECT COUNT(*) FROM academico.Visitas WHERE ClienteId=@ClienteId AND RutaId=@RutaId) <> 2
        THROW 51111, N'No se conservaron los dos registros válidos del cliente.', 1;
    PRINT N'OK: múltiples visitas válidas del mismo cliente.';

    ROLLBACK TRANSACTION;
    PRINT N'Pasaron 8 casos. Datos de prueba revertidos (las identidades pueden conservar saltos).';
END TRY
BEGIN CATCH
    IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
