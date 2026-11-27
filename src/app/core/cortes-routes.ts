// Sectores de demostración acordados en la migración DW_ISTMA 011.
// El código se conserva como valor de la asignación; el municipio es su etiqueta.
export const CORTES_ROUTES = [
  { code: 'S01', municipality: 'San Pedro Sula' },
  { code: 'S02', municipality: 'Choloma' },
  { code: 'S03', municipality: 'Villanueva' },
  { code: 'S04', municipality: 'Puerto Cortés' },
  { code: 'S05', municipality: 'La Lima' },
  { code: 'S06', municipality: 'San Manuel' },
  { code: 'S07', municipality: 'Pimienta' },
  { code: 'S08', municipality: 'Potrerillos' },
  { code: 'S09', municipality: 'Omoa' },
  { code: 'S10', municipality: 'San Antonio de Cortés' },
] as const;

export function routeLabel(code: string): string {
  const route = CORTES_ROUTES.find(route => route.code === code);
  return route ? `${route.code} · ${route.municipality}, Cortés` : code;
}

export function routeLabels(routes?: readonly string[] | null, fallback?: string | null): string {
  const codes = routes?.length ? routes : fallback ? [fallback] : [];
  return codes.map(routeLabel).join('; ') || 'Sin asignar';
}
