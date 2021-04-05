"use strict";
var teste = "Vértices e Arestas";
var instrucao = "<ul><li>Para adicionar um vértice <b>clique com o botão esquerdo</b>\
 no espaço em branco.</li><li>Para adicionar uma aresta <b>arraste</b>\
  de um vértice para outro.</li><li>Para deletar uma aresta <b>clique com o botão direito</b>\
   sobre ela.</li><li>Para visualizar o nome do vértice e aresta <b>passe o cursor</b>\
    sobre o item.</li></ul>"
var contentData =
  // jshint ignore:line
  {
    "vertices-and-edges": {
      "content-title": teste,

      "theory-content":
        "<div>\
        <span style: 'whitespace: nowrap'>Um grafo é coleção finita de vertices</span>\
        <span style: 'whitespace: nowrap'>\
          <svg width=30 height=30 xml:space='preserve' style='margin-left: 4; margin-right: 0 position:relative'>\
              <g>\
                <circle cx='15' cy='15' r='10' fill='#1f77b4'/>\
              </g>\
          </svg>\
        </span>\
        <span style: 'whitespace: nowrap'>\
          <svg width=30 height=30 xml:space='preserve' style='margin-left: 0; margin-right: 0; position:relative'>\
              <g>\
                <circle cx='15' cy='15' r='10' fill='#ff7f0e'/>\
              </g>\
          </svg>\
        </span>\
        <span style: 'whitespace: nowrap'>\
          <svg width=30 height=30 xml:space='preserve' style='margin-left: 0; margin-right: 4; position:relative'>\
              <g>\
                <circle cx='15' cy='15' r='10' fill='#2ca02c'/>\
              </g>\
          </svg>\
        </span>\
        <span style: 'whitespace: nowrap'>interconectado por arestas</span>\
        <span style: 'whitespace: nowrap'>\
          <svg width=30 height=30 xml:space='preserve' style='margin-left: 4; margin-right: 0 position:relative'>\
              <g>\
                <line x1='5' y1='25' x2='25' y2='5' stroke='#888' stroke-width='2px' stroke-linecap='round' stroke-linejoin='round'/>\
              </g>\
          </svg>\
        </span>\
        <span style: 'whitespace: nowrap'>\
          <svg width=30 height=30 xml:space='preserve' style='margin-left: 0; margin-right: 0; position:relative'>\
              <g>\
                <line x1='5' y1='25' x2='25' y2='5' stroke='#888' stroke-width='2px' stroke-linecap='round' stroke-linejoin='round'/>\
              </g>\
          </svg>\
        </span>\
        <span style: 'whitespace: nowrap'>\
          <svg width=30 height=30 xml:space='preserve' style='margin-left: 0; margin-right: 0; position:relative'>\
              <g>\
                <line x1='5' y1='25' x2='25' y2='5' stroke='#888' stroke-width='2px' stroke-linecap='round' stroke-linejoin='round'/>\
              </g>\
          </svg>\
        </span>\
        <span style: 'whitespace: nowrap'>. Denotado por um conjunto de vertices (V) e de arestas (E).</p>\
        <p> Uma aresta interliga dois vértices.</p>\
        <p>Dois vertices são ditos adjacentes se <b>são conectados</b> por uma aresta.</p>\
        </div>",
      "interface-title": "Manual:",

      "interface-content": instrucao,
      "svg-buttons":
        '<button type="button" id="clear-graph" class="btn btn-default">Limpar Tudo</button>',

      "svg-output": "",

      prev: "index.html",
      next: "?order-and-size",
      script: "app.js",
      star: "n",
      style: "app.css"
    },

    "order-and-size": {
      "content-title": "Ordem e Tamanho",
    "theory-content": "<p><b> A ordem <\ / b> de um grafo é o número de vértices que ele possui.<\/p>\
    <p><b>Tamanho <\/b> de um grafo é o número de arestas que ele possui.<\/p>\
    <p> Agora desenhe algums grafos para se acostumar com os termos. <\/p>\
    <p> Agora limpe o grafo e desenhe alguns vértices (digamos \\(n\\)). Tente atingir o tamanho máximo com esses vértices. Tente isso para diferentes valores de \\(n\\) <\/p>\
    <p> Observou algo? Qual é o tamanho máximo possível para um grafo de ordem \\(n\\)? <\/p>\
    <div class=\"hint\">\
    <span class=\"hint-word\">Dica: <\/span>O tamanho máximo é alcançado quando todos os vértices estão conectados uns aos outros. <\/div>\
    <p> A resposta está abaixo. Não, não olhe ainda. Limpe o grafro e tente novamente algumas vezes. <\/p>\
    <div class=\"toggle-container\">\
    <span class=\"toggle-link target-hidden\">Clique aqui para visualizar as respostas<\/span> \
    <div class=\"toggle-content\">\
    <p> A resposta é \\(\\frac{n(n-1)}{2}\\). <\/p>\
    <p> Mas por que? Porque o número máximo de arestas que você pode desenhar é o mesmo que o número de maneiras que você pode selecionar dois vértices.. <\/p>\
    <p> Então, vamos selecionar o primeiro vértice e chamá-lo de \\(a\\). Podemos selecionar \\(a\\) de \\(n\\) maneiras. Para selecionar o outro vértice, ficamos com \\(n-1\\) vértices. Portanto, podemos selecionar dois vértices de \\(n(n-1)\\) caminhos, certo? <\/p>\
    <p> Não. Isso é porque contamos duas vezes. E se \\(b\\) fosse a primeira seleção e \\(a\\) a outra? Entendeu? Lembre-se de que \\(ab\\) e \\(ba\\) representam a mesma aresta. <\/p>\
    <p> Portanto, dividimos por \\(2\\) e obtemos \\(\\frac {n (n-1)} {2}\\) como a resposta. <\/p><\/div><\/div>",
    "interface-title": "Manual:",
    "interface-content": instrucao,
    "svg-buttons":
      '<button type="button" id="clear-graph" class="btn btn-default">Limpar Tudo</button>',

      "svg-output": "",

      prev: "?vertices-and-edges",
      next: "?directed-graph",
      script: "app.js",
      star: "n",
      style: "app.css"
    },

    "directed-graph": {
      "content-title": "Grafo Dirigido",

      "theory-content":"Grafo dirigido, digrafo ou direcionado G consiste de dois conjuntos finitos:<br>\
      <ul>\
      <li>Vértices \\(V\\) (G)</li>\
      <li>Arestas dirigidas \\E(G)\\, onde cada aresta é associada a um par ordenado de vértices chamados de nós terminais</li>\
      <li>Se a aresta e é associada ao par \\(u, v\\) de vértices, diz-se que e é a aresta dirigida de u para v</li>\
    </ul>\
      ",
      "interface-title": "Manual:",

      "interface-content": instrucao,
      "svg-buttons":
        '<button type="button" id="clear-graph" class="btn btn-default">Limpar Tudo</button>',

      "svg-output": "",

      prev: "?order-and-size",
      next: "?degree-of-vertex",
      script: "app.js",
      star: "n",
      style: "app.css"
    },
    "degree-of-vertex": {
      "content-title": "Grau",

      "theory-content":
        "<p><b>Grau</b> de um vértice é o número de arestas que incidem sobre ele.Isso nos diz o número de vértices adjacentes a ele.</p>\
    <p> Na representação cada grafo está desenhando com seu grau. Faça algumas mudanças e veja a mudança dos graus. </p>\
    <p> Grau de um vértice \\(v\\) é apresentado por \\(deg(v)\\). Os vértices com grau\\(deg(v)=0\\) são chamados de vértices isolados. </p>\
    <p> Os vértices com grau <b>zero</b> não possuem nenhum outro vértice ligado com eles. </p>\
    <p> O grau mínimo em um grafo \\(G\\) é simbolizado pelo \\(\\delta(G)\\). E o grau maximo \\(\\Delta(G)\\). Para evitar confusão lembre-se que \\(\\delta\\) é o 'small delta' e \\(\\Delta\\) é o 'big delta'. </p>\
    <div class='note'><span class='note-word'>Note:</span> Lembre-se que \\(\\delta\\) e \\(\\Delta\\) são propriedades de um grafo, onde \\(deg\\) é propriedade de um vértice. </div>",
      "interface-title": "Manual:",

      "interface-content": instrucao,
      "svg-buttons":
        '<button type="button" id="clear-graph" class="btn btn-default">Limpar Tudo</button>',

      "svg-output": "",

      prev: "?vertices-and-edges",
      next: "?degree-sequence",
      script: "app.js",
      star: "n",
      style: "app.css"
    },

    "degree-sequence": {
      "content-title": "Sequencia de Graus de um Grafo",

      "theory-content":"<p><b>Degree sequence</b> de um grafo é um lista com os graus de todos os vértices. Normalmente a lista de graus é apresentada em uma ordem <b>decrescente</b>, do maior grau para o menor. </p>\
      <div class='note'> <span class='note-word'>Note:</span> A sequencia dos graus (degree sequence) é sempre não crescente. Cada Grafo possui <b>uma sequência de graus única.</b> </div>\
      <p> No digrama, o texto dentro de cada vértice representa o grau. Desenhe algum grafos e veja a sua sequência dos graus. </p>\
      <p> Você pode observar que a soma da sequencia dos graus é sempre duas vezes o tamanho do grafo. Em fato isso é a prova do teorema matematico abaixo. </p>\
      <div class='result'>\
         <span class='result-word'>Teorema:</span> A soma dos graus de todos os vértices de um grafo é duas vezes o tamanho do grafo. \
         <p> Matematicamente, \\[\\sum deg(v_i)=2|E|\\] onde, \\(|E|\\) representa o número de arestas no grafo (tamanho do grafo). </p>\
      </div>\
      <p>A razão por trás deste resultado é simples. Uma aresta é um link que interliga dois vertices. Portanto, cada arestas contribui o exato \\(2\\) a soma dos graus. E, portanto, a soma dos graus deve ser duas vezes o número de arestas. </p>",

      "interface-title": "Manual:",

      "interface-content": instrucao,
      "svg-buttons":
        '<button type="button" id="clear-graph" class="btn btn-default">Limpar Tudo</button>',

      "svg-output": "",

      prev: "?degree-of-vertex",
      next: "?graphic-sequence",
      script: "app.js",
      star: "n",
      style: "app.css"
    },

    "graphic-sequence": {
      "content-title": "Sequencia do Grafo",

      "theory-content":"<p>Uma sequência de números é uma <b>graphic sequence</b> se nós podemos construir um grafo seguindo a sequência dos graus. </p>\
      <p>Ok, isso pode ter ficado um pouco confuso. Então o que é uma graphic sequence? </p>\
      <p> Vamos dizer que você tem uma lista de números. Atribua cada número a um vértice isolado. Agora, você pode conectar esses vértices de forma que cada vértice seja adjacente a tantos vértices quanto o número atribuído a ele? Em caso afirmativo, a lista de números é gráfica. Caso contrário, não. As coisas ficarão claras em breve. </p>\
      <p> <b>Exemplo 1:</b> A sequencia \\((3,3,2,1,1,0)\\) é um grafo. No diagrama, você pode ver que os vértices têm esses números como seus graus. Note que removendo o elemento \\(0\\) a sequencia permanece. </p>\
      <div class='note'> <span class='note-word'>Note:</span> Um sequencia que contem somente zeros é um grafo. </div>\
      <p> <b>Exemplo 2:</b> A sequencia \\((4,3,2,1)\\) não é um grafo. Precisamos de pelo menos quatro outros vértices para satisfazer o grau do vértice tendo \\(4\\) como seu grau. Mas somente temos três. </p>\
      <p> <b>Exemplo 3:</b> A sequencia \\((4,3,3,2,2,1)\\) não é um grafo. Lembre-se que a soma dos graus é <b>duas vezes</b> o número de arestas. Portanto, a soma de um sequência de graus deve ser uniforme. Isso não ocorre aqui. </p>\
      <p> A seguintes sequências são gráficas. Tente desenhar um grafo para cada um deles. Você pode ver a resposta clicando no link ao lado deles. </p>\
      <p> \\((5,1,1,1,1,1)\\) <span class='graph-event-link' id='prob0'> Veja solução</span> </p>\
      <p> \\((2,2,2,2,2)\\) <span class='graph-event-link' id='prob1'> Veja solução</span> </p>\
      <p> \\((4,4,4,4,4,0)\\) <span class='graph-event-link' id='prob2'> Veja solução</span> </p>\
      <p> \\((3,3,2,2,2)\\) <span class='graph-event-link' id='prob3'> Veja solução</span> </p>\
      <p> \\((5,3,3,3,2,2)\\) <span class='graph-event-link' id='prob4'> Veja solução</span> </p>\
      <div class='note'> <span class='note-word'>Note:</span> Um grafo possui uma sequência única de graus. Mas mais de um grafo diferente pode ser possível para a mesma <b>graphic sequence</b>. </div>",

      "interface-title": "Manual:",

      "interface-content": instrucao,
      "svg-buttons":
        '<button type="button" id="clear-graph" class="btn btn-default">Limpar Tudo</button>',

      "svg-output": "",

      prev: "?degree-sequence",
      next: "?regular-graph",
      script: "app.js",
      star: "n",
      style: "app.css"
    },

    "regular-graph": {
      "content-title": "Grafo Regular",

      "theory-content":"<p> Um grafo onde todos os vértices possuem o mesmo grau é chamado de <b>grafo regular</b>. </p>\
      <p> Um grafo regular onde cada grau do vértice é \\(k\\) é chamado de \\(k\\mbox{-}regular\\). </p>\
      <p> A figura apresenta um \\(3\\mbox{-}regular\\) grafo de ordem \\(6\\). </p>\
      <p>Tente construir os seguintes grafos regulares.</p>\
      <p>\\(1\\mbox{-}regular\\) de ordem \\(2\\)</p>\
      <p>\\(1\\mbox{-}regular\\) de ordem \\(6\\)</p>\
      <p>\\(2\\mbox{-}regular\\) de ordem \\(3\\)</p>\
      <p>\\(2\\mbox{-}regular\\) de ordem \\(5\\)</p>\
      <p>\\(4\\mbox{-}regular\\) de ordem \\(5\\)</p>\
      <p>\\(4\\mbox{-}regular\\) de ordem \\(6\\)</p>\
      <p>\\(4\\mbox{-}regular\\) de ordem \\(7\\)</p>\
      <p>\\(5\\mbox{-}regular\\) de ordem \\(6\\)</p>\
      <p> A solução para os problemas abaixo não é apresentada.Você já é capaz de resolve-los. Se tiver dificuldade em desenhar os grafos, você pode ver a dica fornecida a seguir. Mas você deve tentar primeiro. </p>\
      <div class='hint toggle-container'>\
         <span class='toggle-link target-hidden'>Clique para visualizar a dica</span> \
         <div class='toggle-content'> <span class='hint-word'>Dica: </span> Descubra a sequência de graus do grafo regular. Em seguida, use Havel-Hakimi para construir o grafo. Observe que o texto no vértice representa seu grau e não o grau de destino. </div>\
      </div>\
      <p> Uma pequena tafera para você agora. Encontre o número de arestas em um \\(k\\mbox{-}regular\\) grafo de ordem \\(n\\). Comece construindo e observando grafos regulares de pequena ordem. Caso você não consiga, veja a resposta abaixo. </p>\
      <div class='result toggle-container'>\
         <span class='toggle-link target-hidden'>Clique para visualizar a resposta</span> \
         <div class='toggle-content'> \\[|E|=\\frac{nk}{2}\\] Isso é derivado do fato de que a soma dos graus é duas vezes o número de arestas. \\[\\sum deg(v_i)=2|E|\\] Onde a soma dos graus é \\(nk\\).\
          <br>Também vemos que a soma dos graus (\\(nk\\)) será um número ímpar quando ambos \\(n\\) e \\(k\\) são impares. Não podemos ter o número de arestas como um número fracionário e, portanto, um grafo regular com ambos \\(n\\) e \\(k\\) impar não pode existir. </div>\
      </div>",

      "interface-title": "Manual:",

      "interface-content": instrucao,
      "svg-buttons":
        '<button type="button" id="clear-graph" class="btn btn-default">Limpar Tudo</button>',

      "svg-output": "",

      prev: "?graphic-sequence",
      next: "?complete-graph",
      script: "app.js",
      star: "n",
      style: "app.css"
    },

    "complete-graph": {
      "content-title": "Grafo Completo",

      "theory-content":"<p> Um grafo em que cada vértice está conectado a todos os outros vértices é chamado de <b>grafo completo</b>. </p>\
      <p> Observe que o grau de cada vértice será \\(n-1\\), onde \\(n\\) é a ordem do grafo </p>\
      <p> Portanto, podemos dizer que um grafro completo de ordem \\(n\\) nada mais é do que um grafo \\((n-1)\\mbox{-}regular\\) de ordem \\(n\\). </p>\
      <p>Um grafo completo de ordem \\(n\\) é denotado por \\(K_n\\).</p>\
      <p> A figura mostra um grafro completo de ordem \\(5\\). </p>\
      <p> Desenhe alguns grafos completos e observe o número de arestas. </p>\
      <p> Você deve ter observado que o número de arestas em um gráfico completo é \\(\\frac{n(n-1)}{2}\\). \
      Este é o tamanho máximo alcançável para um gráfico de ordem \\(n\\). </p>",

      "interface-title": "Manual:",

      "interface-content": instrucao,
      "svg-buttons":
        '<button type="button" id="clear-graph" class="btn btn-default">Limpar Tudo</button>',

      "svg-output": "",

      prev: "?regular-graph",
      next: "?bipartite",
      script: "app.js",
      star: "n",
      style: "app.css"
    },

    bipartite: {
      "content-title": "Grafo Bipartido",

      "theory-content":"<p> Um gráfico é chamado de <b> bipartido </b> se pudermos dividir o conjunto de vértices em dois conjuntos disjuntos de forma que não haja aresta entre os vértices pertencentes ao mesmo conjunto. </p>\
      <p>Vamos entender.</p>\
      <p> Aqui estamos dividindo o conjunto de vértices em dois grupos (ou conjuntos). Cada vértice entra em um desses grupos. Isso é como rotular cada vértice como A ou B. </p>\
      <p> Cada vértice possui apenas um rótulo. Assim, os dois conjuntos são <b>disjuntos</b>, ou seja, os dois conjuntos não têm nenhum vértice em comum. </p>\
      <p> E não deve haver nenhuma aresta interligando vértices no mesmo conjunto. Isso significa que cada aresta interliga vértices pertencentes a conjuntos diferentes &mdash; um rotulado como A e outro como B. </p>\
      <p> Portanto, se pudermos rotular nossos vértices dessa forma, o grafo será bipartido. Caso contrário, não.</p>\
      <p> Desenhe seus próprios grafos para entendê-lo melhor.</p>\
      <p> Para um grafo bipartido, os vértices do conjunto \\(A\\) e \\(B\\) são mostrados nas cores laranja e verde, respectivamente. Caso não seja bipartido, os vértices terão cores usuais.</p>\
      <div class='note'> <span class='note-word'>Nota: </span> Vértices isolados não influenciam se o grafo é bipartido ou não. Eles podem ser ignorados. Eles podem ser ignorados. </div>\
      <p> Os vértices isolados são coloridos de cinza para mostrar que esses vértices são ignorados. Podemos colocá-los aleatoriamente em qualquer conjunto, e o nosso grafo ainda seria bipartido (ou não bipartido). </p>\
      <p>Você estava prestando atenção na soma dos graus dos dois conjuntos?</p>\
      <div class='result'> <span class='result-word'>Teorema: </span> Em um grafo bipartido, a soma dos graus dos vértices de cada conjunto é igual ao número de arestas. \\[\\ sum_ {v\\ em A} deg(v) =\\ sum_{v\\ em B} deg (v) = | E |\\] </div>\
      <p>Por que isso é verdade? Tente raciocinar sozinho.</p>",

      "interface-title": "Manual:",

      "interface-content": instrucao,
      "svg-buttons":
        '<button type="button" id="clear-graph" class="btn btn-default">Limpar Tudo</button>',

      "svg-output": "",

      prev: "?complete-graph",
      next: "?complete-bipartite",
      script: "app.js",
      star: "n",
      style: "app.css"
    },

    "complete-bipartite": {
      "content-title": "Grafo Bipartido Completo",

      "theory-content":"<p> <b>Grafo bipartido completo</b> é um tipo especial de <a href='?bipartite'> grafo bipartido </a> onde cada vértice de um conjunto é conectado a cada vértice do outro conjunto. </p>\
      <p> A figura mostra um grafo bipartido onde o conjunto \\(A\\) (laranja) consiste em \\(2\\) vértices e o conjunto \\(B\\)(verde) consiste em \\(3\\) vértices.</p>\
      <p> Se os dois conjuntos têm \\(p\\) e \\(q\\) número de vértices, denotamos o grafo bipartido completo por \\(K_ {p, q}\\). </p>\
      <div class='result'>\
         <span class='result-word'>Properties: </span> The following results hold true for a complete bipartite graph \\(K_{p,q}\\). \
         <p></p>\
         <ul>\
            <li>A ordem do grafo é \\(|V|=p+q\\).</li>\
            <li>O tamanho do grafo é \\(|E|=pq\\).<br>Isso pode ser usado para verificar se um grafo bipartido é bipartido completo ou não.</li>\
            <li>A <a href='?degree-sequence'>degree sequence</a> é \\((p,p,...,p,q,...,q)\\) onde \\(p\\) is repetido \\(q\\) vezes e \\(q\\) é repetido \\(p\\) vezes. É assumido aqui que\\(p>q\\).</li>\
         </ul>\
      </div>",

      "interface-title": "Manual:",

      "interface-content": instrucao,
      "svg-buttons":
        '<button type="button" id="clear-graph" class="btn btn-default">Limpar Tudo</button>',

      "svg-output": "",

      prev: "?bipartite",
      next: "?walk",
      script: "app.js",
      star: "n",
      style: "app.css"
    },

    walk: {
      "content-title": "Caminho (Walk)",

      "theory-content":"<p><b>Walk</b> é a sequência de vértices adjacentes (ou arestas) em um grafo.</p>\
      <p> Você pode pensar nos vértices como cidades e as arestas como rodovias que os conectam. Você começa em uma cidade e começa a viajar para outras cidades. Então, a rota pela qual você viajou pode ser chamada de 'caminhada'. </p>\
      <p> Para descrever o trajeto de maneira única, você deve listar as cidades e rodovias que viajou nessa ordem. Essa é a ideia de uma caminhada (walk). </p>\
      <div class='note'> <span class='note-word'>Note:</span> Você não pode simplesmente listar vértices (ou arestas) aleatoriamente e chamar de caminhada. Um vértice subsequente deve ser adjacente ao anterior. </div>\
      <p> Ao viajar pelas cidades, você pode ter revisitado algumas cidades e pode ter viajado pela mesma rodovia várias vezes. </p>\
      <p>Da mesma forma, em uma caminhada, você pode repetir os vértices e arestas. </p>\
      <div class='note'> <span class='note-word'>Note:</span> Uma caminhada pode conter vértices e arestas várias vezes. No entanto, neste aplicativo, você não será capaz de adicionar a mesma aresta novamente à caminhada. </div>\
      <p>O número de arestas na caminhada é chamado de <b>tamanho</b> da caminhada. É um a menos que o número de vértices na caminhada (walk). Arestas repetidas (ou vértices) são contados cada vez que aparecem no caminho (walk).</p>\
      <p> Leia as instruções abaixo e crie suas próprias caminhadas. Faça isso até entender o que é uma caminhada (walk). </p>",

      "interface-title": "Manual:",

      "interface-content": instrucao,
      "svg-buttons":
        '<button type="button" id="clear-graph" class="btn btn-default">Limpar Tudo</button> <button type="button" id="clear-walk" class="btn btn-default">Limpar Caminhada</button> <button type="button" id="reverse-walk" class="btn btn-default">Reverse Walk</button>',

      "svg-output": "",

      prev: "?complete-bipartite",
      next: "?open-vs-closed",
      script: "app.js",
      star: "n",
      style: "app.css"
    },

    "open-vs-closed": {
      "content-title": "Caminho Aberto (Open) vs Caminho Fechado (Closed Walks)",

      "theory-content":"<p>Esta lição descreve alguns tipos especiais de caminhadas. Familiarize-se com eles e brinque. Mas observe que a terminologia a seguir pode ser diferente do seu livro didático.</p>\
      <p>Uma caminhada é considerada <b>aberto</b> se o primeiro e o último vértices são diferentes, ou seja, os vértices terminais são diferentes.</p>\
      <p>Uma caminhada é considerada <b>fechada</b> se o primeiro e o último vértices forem iguais. Isso significa que você começa a andar em um vértice e termina no mesmo.</p>\
      <p>Antes de prosseguir, experimente desenhar percursos abertos e fechados para compreendê-los melhor. Abaixo estão mais alguns termos que você precisa saber</p>\
      <p><b>Trilha</b> é uma caminhada aberta onde os vértices podem se repetir, mas não as arestas.</p>\
      <p><b>Path</b> é uma caminhada aberta sem repetição de vértices e arestas.</p>\
      <p>Se você fizer uma trilha (ou caminho) fechada coincidindo com os vértices terminais, então o que você acaba com é chamado de circuito (ou ciclo).</p>\
      <p><b>Circuit</b> é um passeio fechado onde os vértices podem se repetir, mas não as arestas.</p>\
      <p><b>Cycle</b> é um passeio fechado onde nem vértices nem arestas podem se repetir. Mas como está fechado, o primeiro e o último vértices são iguais (uma repetição).</p>\
      <p>É fácil confundir esses termos uns com os outros. Portanto, brinque até ficar confortável. Lembre-se de que você não poderá repetir arestas no aplicativo.</p>\
      <div class='note'> <span class='note-word'>Note: </span> Um caminho é um tipo especial de trilha onde os vértices não se repetem. Da mesma forma, um ciclo é um tipo especial de circuito. </div>",

      "interface-title": "Manual:",

      "interface-content": instrucao,
      "svg-buttons":
        '<button type="button" id="clear-graph" class="btn btn-default">Limpar Tudo</button> <button type="button" id="clear-walk" class="btn btn-default">Limpar Caminhada</button> <button type="button" id="reverse-walk" class="btn btn-default">Reverse Walk</button>',

      "svg-output": "",

      prev: "?walk",
      next: "?connectivity",
      script: "app.js",
      star: "n",
      style: "app.css"
    },

    connectivity: {
      "content-title": "Conectividade",

      "theory-content":"<p> Diz-se que um gráfico está <b> conectado </b> se um caminho puder ser traçado entre dois de seus vértices. Caso contrário, é chamado de <b>desconectado</b>.</p>\
      <p>Cada subgrafo máximo conectado é chamado de <b> componente conectado </b> ou apenas <b> componente </b> do grafo.</p>\
      <p>Um componente é máximo conectado quando:</p>\
      <ul>\
         <li>Nenhum caminho pode ser desenhado entre um vértice 'externo' e qualquer um dos vértices do componente.</li>\
         <li>Existe um caminho de qualquer vértice do componente para qualquer outro vértice do componente.</li>\
      </ul>\
      <div class='note'> <span class='note-word'>Note: </span> Um <b> vértice isolado é um componente </b> no sentido de que não há vértice no componente que não esteja conectado a ele; e não há vértice 'externo' conectado a ele. </div>\
      <p>O diagrama mostra um grafo desconectado com dois componentes - azul e laranja.</p>\
      <p>Desenhe seus próprios grafos e familiarize-se com os termos. Cada componente terá uma cor própria.</p>",

      "interface-title": "Manual:",

      "interface-content": instrucao,
      "svg-buttons":
        '<button type="button" id="clear-graph" class="btn btn-default">Limpar Tudo</button> <button type="button" id="clear-walk" class="btn btn-default">Limpar Caminhada</button> <button type="button" id="reverse-walk" class="btn btn-default">Reverse Walk</button>',

      "svg-output": "",

      prev: "?open-vs-closed",
      next: "?eulerian-circuit",
      script: "app.js",
      star: "n",
      style: "app.css"
    },

    "eulerian-circuit": {
      "content-title": "Circuito Eureliano",

      "theory-content":"<p>Um circuito que visita cada aresta do grafo exatamente uma vez é chamado de <b>circuito Euleriano</b>. Em outras palavras, um <b> circuito Euleriano </b> é uma caminhada fechada que visita cada aresta do grafo exatamente uma vez.</p>\
      <p>Um grafo que possui um circuito Euleriano é conhecido como <b>grafo Eureliano</b>.</p>\
      <div class='result'> <span class='result-word'>Teorema: </span> Um grafo conectado é euleriano se e somente se o grau de cada vértice for um número par. </div>\
      <p>Observe a equivalência (<i> se e somente se </i>) no teorema acima. Isso significa que:</p>\
      <ol>\
         <li>Se um grafo conectado tem todos os seus vértices de grau par, então ele tem um circuito Euleriano.</li>\
         <li>Se um grafo conectado tem um circuito Euleriano, então todos os seus vértices têm grau par.</li>\
      </ol>\
      <div class='note'> <span class='note-word'>Note: </span> Como um circuito é de natureza cíclica, qualquer vértice pode ser considerado o ponto de partida para a construção de um circuito Euleriano em um grafo Euleriano.. </div>\
      <p>Sua tarefa é desenhar um circuito Euleriano para cada um dos grafos fornecidos.</p>",

      "interface-title": "Manual:",

      "interface-content":
        "<ul> <li>Para mover um vértice <b>segure Ctrl e arraste</b> . </li> <li> Para ver o nome de um vértice/aresta, <b>passe o cursor</b> sobre ele. </li>\
        <li> Para iniciar uma caminhada, clique em qualquer aresta. </ li> <li> O <span style = 'background-color: #ff0; padding: 2px;'>\
         primeiro </span> e <span style='background-color: #8f3; padding: 2px;'> último < / span> vértices da caminhada têm limites coloridos. </li>\
          <li> Para adicionar a próxima aresta da caminhada, clique em uma borda que caia no <span style = 'background-color: #8f3; padding: 2px;'> último </span>\
           vértice da caminhada. </li> <li> A <span style = 'background-color: #8f3; padding: 2px;'> última</span> aresta da caminhada pode ser removida por novamente clicando nele. </li><li> Você não será capaz de deletar vértices/arestas que fazem parte da caminhada. </li></ul>",

      "svg-buttons": "<button type='button' id='prev-prob' class='btn btn-default'>Prev</button> <button type='button' id='clear-walk' class='btn btn-default'>Limpar Caminhada</button> <button type='button' id='reverse-walk' class='btn btn-default'>Reverse Walk</button> <button type='button' id='next-prob' class='btn btn-default'>Next</button>",

      "svg-output":
        '<div class="text-center"> <ul class="pagination" id="prob-list"> <li><a class="prob-current">1</a></li><li><a>2</a></li><li><a>3</a></li><li><a>4</a></li><li><a>5</a></li></ul> </div>',

      prev: "?connectivity",
      next: "?eulerian-trail",
      script: "app.js",
      star: "y",
      style: "app.css"
    },

    "eulerian-trail": {
      "content-title": "Caminho Eureliano",

      "theory-content":"<p> Uma caminhada aberta que visita cada aresta do grafo exatamente uma vez é chamada de <b> Caminhada Euleriana </b>. Por ser aberta e não haver repetição de arestas, também é chamada de <b> Trilha Euleriana </b>. </p>\
      <p>Há uma conexão entre as Trilhas Eulerianas e os Circuitos Eulerianos.</p>\
      <p>Sabemos que em um grafo Euleriano é possível traçar um circuito Euleriano a partir de qualquer vértice. E se removermos a última aresta deste circuito? Ainda podemos percorrer todas as arestas exatamente uma vez?</p>\
      <p>Ao remover a última aresta, os dois vértices dessa aresta agora terão graus ímpares. O resto dos vértices ainda terá grau par. Nosso circuito não é mais um circuito porque os vértices terminais são diferentes. O que temos agora é uma trilha que cobre todos os vértices exatamente uma vez.</p>\
      <div class='result'>\
         <p><span class='result-word'>Teorema: </span> Um grafo conectado contém uma trilha Euleriana se e somente se exatamente dois vértices têm grau ímpar e o resto tem grau par.</p>\
         <p>Os dois vértices com grau ímpar devem ser os vértices terminais da trilha.</p>\
      </div>\
      <p>Observe a equivalência (<i> se e somente se </i>) no resultado acima.</p>\
      <p>Desenhe trilhas Eulerianas para os grafos conectados fornecidos.</p>",

      "interface-title": "Manual:",

      "interface-content":
      "<ul> <li> Para mover um vértice, <b> segure Ctrl e arraste </b>. </li> <li> Para ver o nome de um vértice/aresta, <b> passe o cursor </b> sobre . </li> <li> Para iniciar uma caminhada, clique em qualquer borda. </li> <li> O <span style = 'background-color: #ff0; padding: 2px;'> primeiro </span> e <span style = 'background-color: #8f3; padding: 2px;'> últimos </span> vértices da caminhada têm limites coloridos. </li> <li> Para adicionar a próxima borda da caminhada, clique em uma borda caindo no <span style = 'background-color: # 8f3; padding: 2px;'> último </span> vértice da caminhada. </li> <li> O <span style = 'background-color: # 8f3 ; padding: 2px; '> última </span> borda da caminhada pode ser removida clicando novamente nela. </li> <li> Você não poderá excluir vértices/arestas que fazem parte da caminhada . </li> </ul>",

      "svg-buttons":
        '<button type="button" id="prev-prob" class="btn btn-default">Prev</button> <button type="button" id="clear-walk" class="btn btn-default">Limpar Caminhada</button> <button type="button" id="reverse-walk" class="btn btn-default">Reverse Walk</button> <button type="button" id="next-prob" class="btn btn-default">Next</button>',

      "svg-output":
        '<div class="text-center"> <ul class="pagination" id="prob-list"> <li><a class="prob-current">1</a></li><li><a>2</a></li><li><a>3</a></li><li><a>4</a></li><li><a>5</a></li></ul> </div>',

      prev: "?eulerian-circuit",
      next: "?graph-coloring",
      script: "app.js",
      star: "y",
      style: "app.css"
    },

    "graph-coloring": {
      "content-title": "Coloração de Grafos",

      "theory-content":
        "<p> <b> Coloração de grafo </b> é a atribuição de cores a cada vértice de um grafo de forma que nenhum vértice adjacente tenha a mesma cor.</p>\
        <p>Às vezes, isso também é conhecido como <b> coloração adequada </b> do grafo.</p>\
        <p>Você pode alterar a cor de um vértice clicando com o botão esquerdo nele. Nesta unidade você tem 10 cores disponíveis para cada vértice.</p>\
        <p>Experimente colorir o grafo e veja por si mesmo!</p>",

      "interface-title": "Manual:",

      "interface-content":
        '<ul><li>Para alterar a <span style = "color: #fff; background-color: #d62728; padding: 0 2px;"> cor </span> de um vértice, <b> clique com o botão esquerdo </b> nele. </li> <li> Para adicionar um vértice, <b> clique com o botão esquerdo </b> no espaço em branco. </li> <li> Para adicionar uma aresta, <b> arraste </b> de um vértice para outro. </li> <li > Para excluir um vértice / aresta <b> clique com o botão direito </b> nele. </li> <li> Para mover um vértice <b> segure Ctrl e arraste </b>. </li> <li> Para ver o nome de um vértice/aresta, apenas <b> passe o cursor </b> sobre ele. </li> </ul>',

      "svg-buttons":
        '<button type="button" id="clear-graph" class="btn btn-default">Limpar Tudo</button>',

      "svg-output": "",

      prev: "?eulerian-trail",
      next: "?k-colorable",
      script: "app.js",
      star: "n",
      style: "app.css"
    },

    "k-colorable": {
      "content-title": "Número minímo de cores",

      "theory-content":"<p>Diz-se que um grafo é \\(k\\mbox{-}\\) <b> colorível </b> se puder ser colorido corretamente usando \\(k\\) cores.</p>\
      <p>Por exemplo, um <a href='?bipartite'> gráfico bipartido </a> é \\(2\\mbox{-}\\) colorível. Para ver isso, basta atribuir duas cores diferentes aos dois conjuntos disjuntos em um grafo bipartido.</p>\
      <p>Inversamente, se um grafo é \\(2\\mbox {-}\\) colorível, então os vértices com a mesma cor podem ser considerados conjuntos disjuntos. Portanto, chegamos ao seguinte resultado:</p>\
      <div class = 'result'> <span class = 'result-word'> Teorema: </span> um grafo é bipartido se e somente se for \\(2\\mbox {-}\\) colorível. </div>\
      <p>Agora, considere um grafo que é \\(k\\mbox{-}\\) colorido. Escolha qualquer um dos vértices do grafo e substitua sua cor por uma nova cor \\(\\left(k + 1\\right)\\) <sup> th </sup>. Claramente, o gráfico ainda está devidamente colorido.</p>\
      <div class='note'><span class='note-word'>Note: </span>Se um grafo é \\(k\\mbox{-}\\)colorivel, então também é \\(\\left(k+n\\right)\\mbox{-}\\)colorivel, \\(n \\geq 1\\).</div>\
      <p>Outra coisa que vale a pena notar é que um grafo é \\(1\\mbox{-}\\)colorivel se e somente se ele estiver totalmente desconectado, isto é, todos os seus vértices serão isolados.</p>\
      <p>Em cada um dos exercícios a seguir, você recebe um grafo e um número limitado de cores. Sua tarefa é colorir os grafos (corretamente). Tente <b> minimizar </b> o número de cores que você usa.</p>",

      "interface-title": "Manual:",

      "interface-content":
        '<ul><li> Para alterar a <span style = "color:#fff; background-color: #d62728; padding: 0 2px;"> cor </span> de um vértice <b> clique com o botão esquerdo </b> nela. </li><li>Para mover um vértice <b> segure Ctrl e arraste </b>. </li> <li> Para ver o nome de um vértice/aresta, apenas <b> passe o cursor </b> nele. </li> </ul>',

      "svg-buttons":
        '<button type="button" id="prev-prob" class="btn btn-default">Prev</button> <button type="button" id="next-prob" class="btn btn-default">Next</button>',

      "svg-output":
        '<div id="output-text"></div><div class="text-center"> <ul class="pagination" id="prob-list"> <li><a class="prob-current">1</a></li><li><a>2</a></li><li><a>3</a></li><li><a>4</a></li><li><a>5</a></li><li><a>6</a></li><li><a>7</a></li><li><a>8</a></li><li><a>9</a></li><li><a>10</a></li></ul> </div>',

      prev: "?graph-coloring",
      next: "?trees",
      script: "app.js",
      star: "y",
      style: "app.css"
    },

    trees: {
      "content-title": "Árvores",

      "theory-content":"<p> É hora de aprender sobre árvores. Árvores são tipos especiais de grafos com imensa aplicação como estrutura de dados em ciência da computação..</p>\
      <p>Mas primeiro, falamos sobre florestas.</p>\
      <p>Uma <b>floresta</b> é um grafo acíclico, ou seja, um grafo sem ciclos. Pode ser um único grafo conectado ou ter vários componentes desconectados. Quando é um único grafo conectado, nós o chamamos de árvore.</p>\
      <p>Portanto, uma <b> árvore </b> é um grafo acíclico conectado. E uma floresta é apenas uma coleção de uma ou mais árvores.</p>\
      <p>Brinque para ver o que é uma árvore e o que não é. E tente observar as seguintes propriedades enquanto desenha as coisas.</p>\
      <div class='result'>\
         <span class='result-word'>Teorema:</span> Um grafo conectado é uma árvore se sua ordem for mais um que seu tamanho. Em notação matemática, podemos escrever isso como \\[|V|=|E|+1\\]\
         <p>Observe que a declaração é bicondicional. Portanto, também diz que um grafo conectado que satisfaz a equação acima é uma árvore.</p>\
      </div>\
      <div class='result'><span class='result-word'>Propriedade:</span> Para uma árvore com mais de um vértice, há um <b> caminho único </b> entre quaisquer dois de seus vértices.</div>\
      <div class='result'><span class='result-word'>Propriedade:</span> Uma árvore está <b> minimamente conectada </b>, o que significa que a remoção de qualquer aresta arbitrária dela a converterá em um grafo desconectado.</div>",

      "interface-title": "Manual:",

      "interface-content": instrucao,

      "svg-buttons":
        '<button type="button" id="clear-graph" class="btn btn-default">Limpar Tudo</button>',

      "svg-output": "",

      prev: "?k-colorable",
      next: "?spanning-tree",
      script: "app.js",
      star: "n",
      style: "app.css"
    },

    "spanning-tree": {
      "content-title": "Árvore Geradora",

      "theory-content":
        "<p><b>Spanning tree</b> de um grafo é um subgrafo que forma uma árvore e contém (ou abrange) todos os vértices do grafo.</p>\
        <p>Portanto, se o grafo fornecido \\(G\\) tem \\(n\\) vértices, estamos procurando um subgrafo de \\(G\\) que</p>\
        <ul>\
           <li>tem \\(n\\) vertices</li>\
           <li>tem \\(n-1\\) arestas</li>\
           <li>é conectado</li>\
        </ul>\
        <div class='note'> <span class='note-word'>Note:</span> O grafo em si deve ser conectado a fim de obter sua árvore de abrangência. </div>\
        <p>Portanto, se o grafo estiver conectado, só precisamos deletar algumas de suas arestas para que não haja ciclo e ele permaneça conectado.</p>\
        <p>Nestes exercícios, seu objetivo é reduzir o número de arestas para \\ (n-1 \\) enquanto mantém o grafo conectado.</p>\
        <p>Ao resolver os problemas, você perceberá que a árvore de abrangência de um grafo não é única.</p>",

      "interface-title": "Manual:",

      "interface-content":
        "<ul> <li> Para excluir uma aresta, <b> clique com o botão direito </b> nela. </li> </ul>",

      "svg-buttons":
        '<button type="button" id="prev-prob" class="btn btn-default">Prev</button> <button type="button" id="next-prob" class="btn btn-default">Next</button>',

      "svg-output":
        '<div id="output-text"></div><div class="text-center"><ul class="pagination" id="prob-list"><li><a>1</a></li><li><a>2</a></li><li><a>3</a></li><li><a>4</a></li></ul></div>',

      prev: "?trees",
      next: "",
      script: "app.js",
      star: "y",
      style: "app.css"
    }
  };
