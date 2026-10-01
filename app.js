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
