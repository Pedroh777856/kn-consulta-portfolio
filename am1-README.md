# Calculadora De Pacotes AM1

Projeto de portfólio para contar registros classificados como **Faltante**, **A mais** e **Correto**, por data de auditoria e ciclo. Inclui um site executável e um UserScript completo para Tampermonkey. A demonstração e o CSV foram criados do zero, sem usar arquivos operacionais do histórico.

## Usar o site
Baixe **am1.html** e abra no navegador. Esse arquivo inclui interface, motor e exemplo fictício: não precisa instalar dependências ou iniciar servidor. A importação de um ou mais CSVs ocorre no navegador, sem envio à rede ou persistência. O botão “Carregar exemplo fictício” restaura a amostra. Use somente arquivos fictícios ao compartilhar capturas ou publicar exemplos.

## Regras recuperadas do histórico
- Colunas obrigatórias: `Shipment ID`, `Data auditoria`, `ID da rota`, `Estado`.
- Colunas opcionais de exemplo: `Placa`, `Rep auditoria`; não participam da contagem.
- Data: DD/MM/AAAA, com horário opcional HH:MM[:SS]. Datas inválidas são rejeitadas.
- O ciclo é identificado dentro da rota: `A01_AM1 | DEMO-ROTA-A` pertence a AM1. AM10 não é confundido com AM1.
- Faltantes = registros com Estado Faltante; a mais = registros com Estado A mais; corretos = registros com Estado Correto. Espaços e maiúsculas são normalizados.
- Divergências = faltantes + a mais. Outros estados são mostrados separadamente.
- O modo padrão preserva a versão mais recente da calculadora do histórico: **conta linhas de auditoria**, incluindo repetições. Não equivale necessariamente a pacotes únicos.
- A opção “Manter última auditoria” aplica a regra da versão anterior: chave pacote + data + ciclo, preservando o horário mais recente. Em empate, a última linha importada prevalece. Um pacote pode contar novamente em outra data ou ciclo.

O CSV aceita vírgula ou ponto e vírgula, BOM, CRLF, campos entre aspas, aspas escapadas e quebras de linha dentro de campos. Arquivos sem colunas obrigatórias ou com aspas abertas geram erro; linhas com campos ou datas inválidas são rejeitadas e contabilizadas. Sem ciclo reconhecido, o registro aparece em SEM CICLO. A contagem lê o estado informado: não deduz desaparecimento físico nem subtrai faltantes de excedentes.

## Demonstração verificável
CSV fictício com 10 auditorias:

| Data / ciclo | Modo | Total | Faltantes | A mais | Corretos | Divergências |
|---|---|---:|---:|---:|---:|---:|
| 15/01/2026 AM1 | Linhas | 6 | 2 | 1 | 3 | 3 |
| 15/01/2026 AM1 | Última auditoria | 5 | 1 | 1 | 3 | 2 |
| 16/01/2026 AM1 | Ambos | 3 | 1 | 1 | 1 | 2 |
| 15/01/2026 PM1 | Ambos | 1 | 1 | 0 | 0 | 1 |

DEMO-AM1-001 aparece primeiro como Faltante e depois como Correto. No modo de última auditoria, conta apenas como Correto nessa data e ciclo. Os valores são resultados da amostra fictícia, não indicadores operacionais ou ganhos de eficiência.

## Tampermonkey
Crie um novo script na extensão, cole **am1-calculadora.user.js** e salve. O script inclui os dados fictícios, motor e interface. Abra `http://127.0.0.1:8766/am1.html` com uma página demonstrativa servida nesse endereço, ou o endereço correspondente do GitHub Pages se a hospedagem tiver sido ativada. Confirme o selo “Tampermonkey ativo”. O script está limitado aos endereços demonstrativos do cabeçalho. A execução dentro da extensão deve ser verificada no navegador do usuário; o site funciona sem ela.

## Arquitetura e tecnologias
JavaScript, HTML, CSS e CSV. Motor puro em am1-core.js; interface em am1-app.js; página independente em am1.html; UserScript com as mesmas regras embutidas. Sem backend, conexão com sistemas internos ou coleta automática de páginas reais. Os dados importados ficam em memória. A exportação oferece o resumo do ciclo selecionado para todas as datas, segundo o modo ativo.

## Validação
Com Node.js, execute `node am1.test.js` na pasta do repositório. Os testes cobrem filtros, contagens esperadas, última auditoria, estados desconhecidos, AM10, datas inválidas, CSV com aspas e cabeçalhos ausentes.

## Eficiência e limites
O objetivo é reduzir a contagem manual e padronizar o resumo por data. Ganhos de tempo não foram medidos. Para medir, compare o tempo manual e o tempo da ferramenta em lotes equivalentes, incluindo revisão e correções. A leitura mantém os arquivos em memória e não foi avaliada em grandes volumes. Valores conflitantes com mesmo horário exigem revisão, pois a ordem de importação define o desempate.
