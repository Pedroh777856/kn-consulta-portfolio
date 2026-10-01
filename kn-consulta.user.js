// ==UserScript==
// @name         KN Consulta — Portfólio demonstrativo
// @namespace    kn-consulta-demo
// @version      2.0.0
// @description  Consulta em lote, análise de históricos fictícios e exportação CSV. Sem conexões operacionais.
// @match        http://127.0.0.1:8765/*
// @match        http://localhost:8765/*
// @match        https://pedroh777856.github.io/kn-consulta-portfolio/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(() => {
  'use strict';
  if (!['KN Consulta | Demonstração','KN Consulta — Portfólio'].includes(document.title)) return;
  if (document.querySelector('#kn-userscript-active')) return;
  document.querySelector('main')?.remove();
  const mount=document.createElement('div');
  // HTML fixo desta demonstração; não contém conteúdo vindo de registros.
  mount.innerHTML="<main><header><small>PORTFÓLIO • DADOS 100% FICTÍCIOS</small><h1>KN Consulta</h1><p>Automação de análise operacional e rastreabilidade</p><p>Consulta em lote · Histórico · Etiquetagem · CSV</p></header>\n<label for=\"ids\">Identificadores demonstrativos (um por linha)</label><textarea id=\"ids\" rows=\"4\"></textarea><button id=\"run\">Analisar lote fictício</button><button id=\"export\" disabled>Exportar CSV</button><p id=\"notice\" role=\"status\"></p><p>Limiar de atenção: 120 minutos, escolhido apenas para demonstrar a regra. Um alerta indica revisão; não comprova gargalo nem atribui culpa a pessoas. Todos os horários usam UTC.</p><section id=\"results\"></section></main>";
  document.body.append(mount);
  const css=document.createElement('style');css.textContent="body{margin:0;background:#eef3f8;color:#142b42;font:16px system-ui}main{max-width:1050px;margin:auto;padding:32px}header{background:#102c46;color:white;padding:32px;border-radius:18px}h1{font-size:40px;margin:0}small{color:#aee5e2}textarea{width:100%;box-sizing:border-box;padding:14px;font:16px monospace;border:1px solid #a8b8ca;border-radius:8px}button{padding:12px 20px;border:0;border-radius:8px;background:#056e74;color:white;margin:12px 8px 0 0;cursor:pointer}button:disabled{opacity:.5}article{background:white;padding:24px;margin:18px 0;border-radius:14px}li{margin:8px 0}label{display:block;margin:20px 0 8px}#notice{font-weight:600}";document.head.append(css);
  document.title='KN Consulta | Demonstração';
  const badge=document.createElement('p');badge.id='kn-userscript-active';
  badge.textContent='Tampermonkey ativo • Script completo v2.0 • Somente dados fictícios';
  document.querySelector('header').append(badge);
  /* Dados criados do zero, sem origem operacional. */
const KNMock = [
  {
    "id": "DEMO-001",
    "events": [
      {
        "at": "2026-01-15T08:00:00Z",
        "status": "Recebido",
        "actor": "Operador A",
        "group": "Equipe Alfa"
      },
      {
        "at": "2026-01-15T08:30:00Z",
        "status": "Em triagem",
        "actor": "Operador B",
        "group": "Equipe Beta"
      },
      {
        "at": "2026-01-15T09:00:00Z",
        "status": "Para despacho",
        "actor": "Operador A",
        "group": "Equipe Alfa"
      },
      {
        "at": "2026-01-15T10:00:00Z",
        "status": "Despachado",
        "actor": "Operador C",
        "group": "Equipe Alfa"
      }
    ],
    "labels": [
      {
        "at": "2026-01-15T09:00:00Z",
        "actor": "Operador A"
      }
    ],
    "inventory": {
      "location": "Área fictícia A",
      "at": "2026-01-15T08:10:00Z"
    }
  },
  {
    "id": "DEMO-002",
    "events": [
      {
        "at": "2026-01-15T08:00:00Z",
        "status": "Recebido",
        "actor": "Operador B",
        "group": "Equipe Beta"
      },
      {
        "at": "2026-01-15T08:45:00Z",
        "status": "Em análise",
        "actor": "Operador C",
        "group": "Equipe Alfa"
      },
      {
        "at": "2026-01-15T12:00:00Z",
        "status": "Em análise",
        "actor": "Operador C",
        "group": "Equipe Alfa"
      },
      {
        "at": "2026-01-15T13:00:00Z",
        "status": "Para despacho",
        "actor": "Operador B",
        "group": "Equipe Beta"
      },
      {
        "at": "2026-01-15T14:00:00Z",
        "status": "Devolvido",
        "actor": "Operador A",
        "group": "Equipe Alfa"
      }
    ],
    "labels": [
      {
        "at": "2026-01-15T12:55:00Z",
        "actor": "Operador C"
      }
    ],
    "inventory": {
      "location": "Área fictícia B",
      "at": "2026-01-15T08:15:00Z"
    }
  },
  {
    "id": "DEMO-003",
    "events": [
      {
        "at": "2026-01-15T08:00:00Z",
        "status": "Recebido",
        "actor": null,
        "group": null
      },
      {
        "at": "2026-01-15T08:20:00Z",
        "status": "Em triagem",
        "actor": "Operador A",
        "group": "Equipe Alfa"
      }
    ],
    "labels": [],
    "inventory": null
  }
];
if(typeof module!=="undefined") module.exports=KNMock;

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

  'use strict';
const input=document.querySelector('#ids'), output=document.querySelector('#results'), notice=document.querySelector('#notice');
let results=[];
input.value=KNMock.map(r=>r.id).join('\n');
document.querySelector('#run').onclick=()=>{
  const ids=[...new Set(input.value.split(/[\s,;]+/).filter(Boolean))];
  results=[];output.replaceChildren();
  const missing=[];
  for(const id of ids){
    const record=KNMock.find(r=>r.id===id);
    if(!record){missing.push(id);continue;}
    const r=KNCore.analyze(record);results.push(r);
    const card=document.createElement('article');
    const title=document.createElement('h2');title.textContent=`${r.id} • ${r.status}`;card.append(title);
    const summary=document.createElement('p');summary.textContent=`${r.count} movimentações • ${r.totalMinutes} min observados • Último responsável: ${r.lastActor} (${r.lastGroup})`;card.append(summary);
    const flags=document.createElement('p');flags.textContent=r.flags.join(' • ') || 'Sem alertas pelas regras da demonstração';card.append(flags);
    const details=document.createElement('p');details.textContent=`Etiquetagem: ${r.label?.actor || 'Ausente'} • Inventário: ${r.inventory?.location || 'Ausente'} • Mesma pessoa no despacho e etiqueta: ${r.sameActor===null?'Indeterminado':r.sameActor?'Sim':'Não'}`;card.append(details);
    const list=document.createElement('ol');
    for(const e of [...r.steps].reverse()){const li=document.createElement('li');li.textContent=`${e.at} — ${e.status} — ${e.actor || 'Não identificado'} — ${e.group || 'Não identificado'} — intervalo anterior: ${e.minutes ?? '—'} min`;list.append(li);}
    card.append(list);output.append(card);
  }
  notice.textContent=`${results.length} registros processados. ${missing.length ? 'IDs fora do mock: '+missing.join(', ') : ''}`;
  document.querySelector('#export').disabled=!results.length;
};
document.querySelector('#export').onclick=()=>{
  const url=URL.createObjectURL(new Blob([KNCore.toCSV(results)],{type:'text/csv;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download='kn-consulta-demo.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
document.querySelector('#run').click();

})();
