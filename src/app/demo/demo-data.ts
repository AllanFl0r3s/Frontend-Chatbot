export const demoTasks = [
  { id: 'stock', title: 'Consultar existencias', goal: 'Averigua cuántas unidades de Quartz de 600 ml hay y en qué bodegas están.', steps: ['menu', '1', 'PT990000001'], hint: 'Al escribir el código, el detalle aparece directamente.' },
  { id: 'orders', title: 'Revisar un pedido', goal: 'Encuentra los productos y cantidades del pedido de demostración 0001001.', steps: ['menu', '2', '0001001'], hint: 'Conserva los ceros iniciales del número.' },
  { id: 'sales', title: 'Consultar ventas', goal: 'Consulta las ventas netas del producto PT990000001 de noviembre de 2026.', steps: ['menu', '3', '1', 'PT990000001', '3', 'noviembre 2026'], hint: 'La opción 3 del período permite escribir mes y año.' },
  { id: 'forecast', title: 'Ver una proyección', goal: 'Consulta la proyección de PT990000001 para noviembre de 2026.', steps: ['menu', '4', '1', 'PT990000001', 'noviembre 2026'], hint: 'Es una proyección de ejemplo guardada en la base, sin IA predictiva.' },
  { id: 'credit', title: 'Revisar notas de crédito', goal: 'Encuentra las notas del cliente ficticio DEMO001.', steps: ['menu', '5', '2', 'DEMO001'], hint: 'No escribas nombres ni códigos de clientes reales.' },
  { id: 'promotions', title: 'Explorar promociones', goal: 'Identifica una promoción de demostración vigente y consulta sus existencias, si hay alguna.', steps: ['menu', '6'], hint: 'La vigencia depende de la fecha. No encontrar ofertas vigentes también puede ser un resultado correcto; estas ofertas no tienen validez comercial.' },
];
export const taskLabel = (id: string) => demoTasks.find(t => t.id === id)?.title ?? 'Experiencia general';
export const outcomeLabel = (value: string) => ({ completed: 'Sin ayuda', assisted: 'Con ayuda', blocked: 'No pude completar' }[value] ?? value);
// Evita que un comentario se interprete como fórmula al abrir el CSV en Excel.
export function feedbackCsv(rows: Array<Record<string, unknown>>): string {
  const safe = (value: unknown) => {
    let text = String(value ?? '');
    if (/^\s*[=+\-@]/.test(text) || /^[\t\r\n]/.test(text)) text = "'" + text;
    return '"' + text.replace(/"/g, '""') + '"';
  };
  const lines = [['Referencia', 'Fecha UTC', 'Consulta', 'Resultado', 'Facilidad (1-5)', 'Utilidad (1-5)', 'Comentario'],
    ...rows.map(r => [r['id'], r['createdAt'], taskLabel(String(r['task'])), outcomeLabel(String(r['outcome'])), r['ease'], r['usefulness'], r['comment']])];
  return '\uFEFF' + lines.map(row => row.map(safe).join(',')).join('\r\n');
}
