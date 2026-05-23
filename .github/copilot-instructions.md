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

## Regras de alinhamento da garagem (não regredir)

- A largura da garagem/cobertura é fixa em **4 m** e não deve ser alterada sem pedido explícito do usuário.
- A garagem deve iniciar junto à parede da casa, alinhada à esquerda (vista superior).
- Não centralizar automaticamente no eixo Z quando a casa for mais larga.
- Ao alterar dimensões, preservar largura de 4 m e alinhamento à esquerda como padrão.

## Fluxo de trabalho

- Sempre apresentar um plano em checklist e atualizar o progresso durante a execução.
- Ao concluir cada ação solicitada, criar **um único commit** e **não fazer push**.
- Se o usuário pedir para desfazer, desfazer o último commit.
- Se uma mudança criar/alterar convenções do projeto, atualizar este arquivo.
