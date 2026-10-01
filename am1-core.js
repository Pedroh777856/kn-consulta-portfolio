(function(root){
 'use strict';
 function parse(text){
  text=text.replace(/^\uFEFF/,'');
  const first=text.split(/\r?\n/)[0]; const delimiter=first.includes(';')?';':',';
  const rows=[];let row=[],cell='',quoted=false;
  for(let i=0;i<text.length;i++){
   const c=text[i];
   if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}
   else if(c===delimiter&&!quoted){row.push(cell);cell='';}
   else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(v=>v.trim()))rows.push(row);row=[];cell='';}
   else cell+=c;
  }
  if(quoted)throw Error('CSV com aspas não fechadas.');
  row.push(cell);if(row.some(v=>v.trim()))rows.push(row);
  if(!rows.length)throw Error('CSV vazio.');
  const headers=rows.shift().map(v=>v.trim());
  const required=['Shipment ID','Data auditoria','ID da rota','Estado'];
  for(const h of required)if(!headers.includes(h))throw Error('Coluna obrigatória ausente: '+h);
  const accepted=[],rejected=[];
  rows.forEach((values,index)=>{
   const get=h=>(values[headers.indexOf(h)]||'').trim();
   const raw=get('Data auditoria');const m=raw.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/);
   const date=m?new Date(Date.UTC(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0),+(m[6]||0))):null;
   if(values.length!==headers.length||!get('Shipment ID')||!m||date.getUTCDate()!==+m[1]||date.getUTCMonth()!==+m[2]-1||date.getUTCFullYear()!==+m[3]||+(m[4]||0)>23||+(m[5]||0)>59||+(m[6]||0)>59||!get('Estado')){rejected.push(index+2);return;}
   const cycle=get('ID da rota').match(/_([A-Z]+\d+)\b/i)?.[1].toUpperCase()||'SEM CICLO';
   const state=get('Estado').toLowerCase().replace(/\s+/g,' ');
   accepted.push({id:get('Shipment ID'),date:raw.slice(0,10),timestamp:+date,cycle,state,route:get('ID da rota')});
  });
  return {accepted,rejected};
 }
 function select(records,date,cycle,latest=false){
  const filtered=records.filter(r=>(!date||r.date===date)&&(!cycle||r.cycle===cycle));
  if(!latest)return filtered;
  const map=new Map();
  for(const r of filtered){const key=JSON.stringify([r.id,r.date,r.cycle]);if(!map.has(key)||r.timestamp>=map.get(key).timestamp)map.set(key,r);}
  return [...map.values()];
 }
 function count(records){const counts={total:records.length,missing:0,extra:0,correct:0,other:0,divergences:0};for(const r of records){if(r.state==='faltante')counts.missing++;else if(r.state==='a mais')counts.extra++;else if(r.state==='correto')counts.correct++;else counts.other++;}counts.divergences=counts.missing+counts.extra;return counts;}
 function summary(records,cycle='AM1',latest=false){return [...new Set(records.map(r=>r.date))].sort((a,b)=>a.split('/').reverse().join('').localeCompare(b.split('/').reverse().join(''))).map(date=>({date,...count(select(records,date,cycle,latest))})).filter(r=>r.total);}
 const api={parse,select,count,summary};if(typeof module!=='undefined')module.exports=api;else root.AM1Core=api;
})(typeof globalThis!=='undefined'?globalThis:this);
