# KN Consulta — demonstração de portfólio

Automação de análise operacional e rastreabilidade em JavaScript, com consultas em lote, histórico consolidado, comparação com etiquetagem e exportação para CSV.

**Este repositório contém uma reconstrução demonstrativa.** Os dados foram criados do zero: IDs DEMO, operadores genéricos, equipes fictícias e locais fictícios. Não contém conexões com sistemas operacionais, credenciais, nomes reais ou dados internos. O nome KN Consulta é apenas o título do projeto; a publicação não implica vínculo ou endosso institucional.

## Problema e proposta
Consultar históricos separadamente e reorganizar informações manualmente dificulta a revisão de um lote. A proposta consolida eventos, responsáveis e intervalos em uma saída consistente, para apoiar a análise humana.

## Executar
1. Baixe a pasta inteira, preservando os arquivos.
2. Abra **demo.html** em um navegador moderno. Não exige instalação, conta ou internet.
3. Use DEMO-001, DEMO-002 e DEMO-003. Clique em “Analisar lote fictício”.
4. Exporte o CSV para explorar uma linha por registro e histórico à direita, do evento mais recente ao mais antigo.

IDs repetidos são deduplicados; IDs fora do mock são informados na tela. Nenhum dado é enviado à rede ou salvo em armazenamento persistente. O CSV é baixado por ação do usuário.

## Funcionalidades implementadas
- Consulta local de múltiplos IDs com histórico cronológico.
- Responsável e equipe explícitos em cada evento, sem inferir equipe a partir de nomes.
- Duração observada, intervalos entre eventos e status consecutivos repetidos.
- Alertas para intervalo acima do limiar, responsável ausente, passagem por análise e devolução.
- Comparação da última etiquetagem com a última transição “Para despacho”: mesma pessoa e mesmo instante.
- Inventário fictício e exportação CSV com campos entre aspas, BOM UTF-8 e proteção básica contra fórmulas.

## Tecnologias e arquitetura
JavaScript puro, HTML, CSS, DOM e Blob para download local. core.js contém regras e serialização; mock-data.js fornece a fonte fictícia; app.js controla a interface. mock-data.json é o espelho intercambiável do mock. Não há backend, API, autenticação ou dependência externa.

O arquivo kn-consulta.user.js ilustra a estrutura de um UserScript Tampermonkey com escopo restrito à página local e apenas adiciona um indicador. A demonstração funciona sem ele. Para testá-lo, importe-o no Tampermonkey e habilite acesso a arquivos locais; políticas do navegador podem impedir a execução. Ele não é um coletor de produção. A integração original com interfaces dinâmicas, persistência entre páginas e navegação operacional não foi reproduzida.

## Regras e limitações
Datas ISO 8601 em UTC; intervalos em minutos. O tempo total vai do primeiro ao último evento registrado e não equivale automaticamente ao tempo de processamento ativo. O limiar de 120 minutos é ilustrativo, sem significado de SLA. Igualdade de horários significa mesmo instante exato, sem tolerância. Responsável ou evento faltante torna a comparação indeterminada. Correlação não comprova causalidade. Alertas requerem revisão humana.

A base é pequena e controlada. O motor rejeita histórico vazio ou datas de movimentação inválidas; não é um importador genérico de dados operacionais. Repetição detectada significa status igual em eventos consecutivos. Comparar apenas a última etiqueta pode omitir relações anteriores. CSVs têm quantidade variável de colunas de histórico conforme o lote; quem integrar a saída deve usar os cabeçalhos.

## Estrutura publicada
- demo.html, app.js, core.js, mock-data.js: aplicação demonstrativa.
- mock-data.json e kn-consulta-demo.csv: base fictícia e exportação de exemplo.
- portfolio.md: descrições e textos prontos para LinkedIn.
- resumo-tecnico.md: regras, arquitetura e plano de medição.
- capa-briefing.md: direção de arte pronta para execução.
- checklist-publicacao.md: preparação e publicação.
- core.test.js: validação dos cenários principais.

## Validar
Com Node.js disponível: execute node core.test.js na pasta do projeto. A aplicação no navegador não depende de Node.js.

## Impacto
A demonstração evidencia consolidação e estruturação dos dados. Não foram medidos ganhos em operação real. Consulte resumo-tecnico.md para um plano de comparação antes/depois. Não há percentuais de economia ou produtividade alegados.

## Publicação e autoria
Revise os textos para garantir que representem sua participação no projeto. Defina a licença e a atribuição de autoria antes de disponibilizar publicamente o código; este pacote não presume uma licença. Use somente capturas da demonstração e links públicos após publicação autorizada.
