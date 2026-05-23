# Instruções do Copilot

## Comandos

- Não há build, testes ou lint configurados no repositório.
- Valide alterações abrindo diretamente no navegador o HTML editado:
  - `cobertura_metalica_3d.html`
  - `cobertura_metalica_3d_uma_agua.html`

## Arquitetura de alto nível

- O repositório contém duas cenas Three.js independentes, cada uma em um único arquivo HTML autocontido.
- `cobertura_metalica_3d.html` é a versão original com telhado de duas águas.
- `cobertura_metalica_3d_uma_agua.html` é a versão mais estruturada com telhado de uma água, organizada em funções de configuração, montagem da cena, estrutura, labels, carro, controles e resize.
- As duas cenas constroem a garagem proceduralmente com geometrias primitivas do Three.js e `three.min.js` carregado via CDN.

## Convenções principais

- Trate os HTMLs como entregáveis independentes; não existe camada compartilhada de módulos.
- Preserve o uso da CDN do Three.js (`r128`) e dos controles de câmera customizados, sem assumir `OrbitControls`.
- Prefira mudanças derivadas das dimensões da cena, em vez de espalhar offsets manuais.
- Em `cobertura_metalica_3d_uma_agua.html`, siga a estrutura existente: `createConfig()`, `createMaterials()`, helpers `add...`, `createBeam()`, fluxo de resize e labels HTML projetados (`createMeasurementLabels()` / `updateMeasurementLabels()`).
- Se uma mudança introduzir ou alterar padrões, convenções ou parametrizações, confirme com o usuário se `.github/copilot-instructions.md` também deve ser atualizado.
- Ao concluir cada ação solicitada pelo usuário, gerar um único commit (sem push). Se o usuário pedir para desfazer, desfazer o último commit.


# Copilot Instructions — JavaScript Best Practices

Projeto simples em JavaScript puro (Vanilla JS), sem frameworks, sem TypeScript e sem integrações externas.

---

## Declaração de Variáveis

- Prefira `const` por padrão; use `let` apenas quando reatribuição for necessária.
- Nunca use `var`.
- Declare variáveis no escopo mais restrito possível.

```js
// ✅ Correto
const MAX_ITEMS = 10;
let contador = 0;

// ❌ Errado
var total = 0;
```

---

## Nomenclatura

- Variáveis e funções: `camelCase` → `calcularTotal`, `listaDeItens`
- Constantes globais: `UPPER_SNAKE_CASE` → `PRECO_MAXIMO`
- Arquivos: `kebab-case` → `carrinho-compras.js`
- Use nomes descritivos; evite abreviações.

```js
// ✅ Correto
const precoUnitario = 29.90;
function calcularDesconto(preco, percentual) { ... }

// ❌ Errado
const p = 29.90;
function calc(x, y) { ... }
```

---

## Funções

- Cada função deve fazer uma única coisa.
- Mantenha funções com no máximo 3 parâmetros; use um objeto de configuração para mais.
- Prefira funções puras: mesma entrada sempre produz mesma saída, sem efeitos colaterais.
- Evite funções com mais de 20–30 linhas.

```js
// ✅ Correto — objeto de configuração
function criarProduto({ nome, preco, categoria }) { ... }

// ❌ Errado — muitos parâmetros posicionais
function criarProduto(nome, preco, categoria, estoque, ativo) { ... }
```

---

## Manipulação de Dados

- Evite mutações diretas de arrays e objetos; crie cópias com spread operator.
- Use `map`, `filter` e `reduce` para transformar listas.
- Use desestruturação para acessar propriedades de objetos e arrays.
- Use optional chaining (`?.`) e nullish coalescing (`??`) para acesso seguro.

```js
// ✅ Correto
const ativos = produtos.filter(p => p.ativo);
const comDesconto = precos.map(p => p * 0.9);
const { nome, preco } = produto;
const label = produto?.nome ?? 'Sem nome';

// ❌ Errado — mutação direta
produtos.push(novoItem);
lista[0] = 'alterado';
```

---

## Tratamento de Erros

- Lance erros descritivos com `throw new Error('mensagem clara')`.
- Nunca deixe blocos `catch` vazios.
- Valide as entradas no início das funções com guards.

```js
// ✅ Correto
function dividir(a, b) {
  if (b === 0) throw new Error('Divisor não pode ser zero');
  return a / b;
}

// ❌ Errado
try {
  operacaoArriscada();
} catch (e) {} // erro silenciado
```

---

## Manipulação do DOM

- Selecione elementos uma única vez e armazene em variáveis.
- Prefira `textContent` a `innerHTML` ao exibir dados do usuário.
- Use `addEventListener` ao invés de atributos `onclick` no HTML.
- Remova event listeners quando não forem mais necessários.

```js
// ✅ Correto
const btnSalvar = document.querySelector('#btn-salvar');
btnSalvar.addEventListener('click', salvarDados);
elemento.textContent = dadoDoUsuario;

// ❌ Errado
document.querySelector('#btn').innerHTML = dadoDoUsuario; // XSS
<button onclick="salvar()">Salvar</button>
```

---

## Eventos de Alta Frequência

- Aplique debounce em campos de busca e inputs.
- Aplique throttle em eventos de scroll e resize.

```js
// ✅ Correto — debounce simples
let timeout;
campoBusca.addEventListener('input', () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => filtrar(campoBusca.value), 300);
});
```

---

## Organização do Código

- Um arquivo = uma responsabilidade. Evite arquivos com mais de 300 linhas.
- Agrupe funções relacionadas no mesmo arquivo.
- Separe a lógica de negócio da manipulação do DOM.
- Use comentários para explicar o "porquê", não o "o quê".

```js
// ✅ Correto — separação de responsabilidades
// carrinho.js → lógica de negócio
function calcularTotal(itens) { ... }

// carrinho-ui.js → manipulação do DOM
function renderizarCarrinho(itens) { ... }
```

---

## Segurança Básica

- Nunca use `eval()`.
- Nunca insira dados do usuário diretamente via `innerHTML`.
- Não exponha informações sensíveis em variáveis globais ou no console em produção.

---

## Estilo e Formatação

- Use **Prettier** para formatação automática.
- Use **ESLint** com regras definidas no repositório.
- Ponto e vírgula ao final das instruções: sempre ou nunca — seja consistente.
- Aspas simples para strings, salvo quando a string contiver aspas simples.
