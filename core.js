/* KN Consulta — motor demonstrativo, sem serviços externos. */
(function (root) {
  'use strict';
  function analyze(record, thresholdMinutes = 120) {
    const events = [...record.events].sort((a,b) => Date.parse(a.at)-Date.parse(b.at));
    if (!events.length || events.some(e => !Number.isFinite(Date.parse(e.at)))) throw new Error('Histórico vazio ou data inválida');
    const steps = events.map((e,i) => ({...e, minutes: i ? (Date.parse(e.at)-Date.parse(events[i-1].at))/60000 : null}));
    const last = events.at(-1);
    const dispatch = [...events].reverse().find(e => e.status === 'Para despacho');
    const label = [...record.labels].sort((a,b) => Date.parse(b.at)-Date.parse(a.at))[0];
    const gaps = steps.filter(e => e.minutes > thresholdMinutes);
    const repeated = events.filter((e,i) => i && e.status === events[i-1].status).length;
    const flags = [];
    if (gaps.length) flags.push('Intervalo acima do limiar demonstrativo');
    if (repeated) flags.push('Status consecutivo repetido');
    if (events.some(e => !e.actor)) flags.push('Responsável ausente');
    if (events.some(e => e.status === 'Em análise')) flags.push('Passagem por análise');
    if (last.status === 'Devolvido') flags.push('Fluxo de devolução');
    return {id:record.id, status:last.status, count:events.length, totalMinutes:(Date.parse(last.at)-Date.parse(events[0].at))/60000,
      lastActor:last.actor || 'Não identificado', lastGroup:last.group || 'Não identificado',
      sameActor: dispatch?.actor && label?.actor ? dispatch.actor === label.actor : null,
      sameTime: dispatch && label ? Date.parse(dispatch.at) === Date.parse(label.at) : null,
      label, inventory:record.inventory, steps, flags, repeated, gaps:gaps.length};
  }
  function cell(value) {
    let text = String(value ?? '');
    if (/^[\s]*[=+@-]/.test(text)) text = "'" + text;
    return '"' + text.replace(/"/g,'""') + '"';
  }
  function toCSV(results) {
    const max = Math.max(0,...results.map(r=>r.steps.length));
    const headers = ['ID_DEMO','STATUS_ATUAL','MOVIMENTACOES','TEMPO_OBSERVADO_MIN','ULTIMO_RESPONSAVEL','ULTIMO_GRUPO','MESMA_PESSOA_DESPACHO_ETIQUETA','MESMO_INSTANTE_DESPACHO_ETIQUETA','ETIQUETA_RESPONSAVEL','ETIQUETA_DATA','INVENTARIO_LOCAL','INVENTARIO_DATA','PONTOS_ATENCAO'];
    for(let i=1;i<=max;i++) headers.push(`STATUS_${i}`,`DATA_${i}`,`RESPONSAVEL_${i}`,`GRUPO_${i}`,`INTERVALO_MIN_${i}`);
    const rows = results.map(r=>{
      const bool = v => v === null ? 'Indeterminado' : v ? 'Sim' : 'Não';
      const row=[r.id,r.status,r.count,r.totalMinutes,r.lastActor,r.lastGroup,bool(r.sameActor),bool(r.sameTime),r.label?.actor,r.label?.at,r.inventory?.location,r.inventory?.at,r.flags.join(' | ')];
      const reverse=[...r.steps].reverse();
      for(let i=0;i<max;i++){const e=reverse[i];row.push(e?.status,e?.at,e?.actor,e?.group,e?.minutes);}
      return row;
    });
    return '\uFEFF'+[headers,...rows].map(row=>row.map(cell).join(';')).join('\r\n');
  }
  const api={analyze,toCSV};
  if(typeof module !== 'undefined') module.exports=api;
  else root.KNCore=api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
