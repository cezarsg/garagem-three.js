# Instruções do Copilot

## Escopo do projeto

- Repositório com duas cenas Three.js independentes em HTML único:
  - `cobertura_metalica_3d.html` (duas águas)
  - `cobertura_metalica_3d_uma_agua.html` (uma água)
- Não há build, lint ou testes automatizados configurados.
- Validação deve ser feita abrindo os HTMLs no navegador.

## Convenções técnicas

- Tratar cada HTML como entregável independente (sem módulos compartilhados).
- Manter Three.js via CDN `r128` e controles de câmera customizados (sem assumir `OrbitControls`).
- Em `cobertura_metalica_3d_uma_agua.html`, seguir a estrutura atual em PT-BR (`criarConfiguracao`, `criarMateriais`, helpers `adicionar...`, `criarViga`, `criarRotulosMedidas`, `atualizarRotulosMedidas`).
- Preferir parametrização por dimensões da cena; evitar offsets manuais espalhados.

## Modularização orientada a objetos (obrigatória)

- Sempre criar novos elementos de cenário em arquivos JavaScript separados, com objeto próprio e API clara.
- Nomear o arquivo conforme o elemento, em PT-BR e minúsculo com hífen quando necessário (ex.: `planta.js`, `cadeira.js`, `poste-luz.js`).
- Cada arquivo deve expor um objeto global com método de criação (ex.: `Planta3D.criar(config)`), seguindo o padrão usado em `casa.js` e `garagem.js`.
- Ao adicionar novos elementos, evitar implementar a geometria diretamente no HTML principal; o HTML deve apenas orquestrar/importar os módulos.

## Regras de alinhamento da garagem (não regredir)

- A largura da garagem/cobertura é fixa em **4 m** e não deve ser alterada sem pedido explícito do usuário.
- A garagem deve iniciar junto à parede da casa, alinhada à esquerda (vista superior).
- Não centralizar automaticamente no eixo Z quando a casa for mais larga.
- Ao alterar dimensões, preservar largura de 4 m e alinhamento à esquerda como padrão.

## Boas práticas de programação (sintético)

- Priorizar funções pequenas, com responsabilidade única e nomes descritivos.
- Preferir `const`; usar `let` apenas quando houver reatribuição; não usar `var`.
- Evitar duplicação; reaproveitar helpers e constantes de configuração.
- Validar entradas em pontos críticos e não silenciar erros.
- Evitar números mágicos; centralizar valores em configuração.
- Manter comentários curtos para explicar decisões, não o óbvio.
- Fazer mudanças incrementais, com impacto localizado e sem regressões visuais.

## Fluxo de trabalho

- Sempre apresentar um plano em checklist e atualizar o progresso durante a execução.
- Ao concluir cada ação solicitada, criar **um único commit** e **não fazer push**.
- Se o usuário pedir para desfazer, desfazer o último commit.
- Se uma mudança criar/alterar convenções do projeto, atualizar este arquivo.
