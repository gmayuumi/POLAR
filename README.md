# Polar Ar Condicionado Automotivo — site

Site institucional da Polar Ar Condicionado Automotivo (Indaiatuba – SP).
HTML, CSS e JavaScript puros: não precisa de build nem de servidor especial.

## Páginas

| Arquivo         | Página                                                                 |
| --------------- | ---------------------------------------------------------------------- |
| `index.html`    | Início: destaque com agendamento rápido, serviços, carros, vídeo, avaliações, visita |
| `servicos.html` | Serviços, diagrama do circuito do ar e carros elétricos                |
| `sobre.html`    | A Polar: história, jeito de trabalhar, fotos da oficina, avaliações    |
| `duvidas.html`  | Sinais de problema e perguntas frequentes                              |
| `contato.html`  | Formulário que monta a mensagem do WhatsApp, telefones, horário e mapa |
| `404.html`      | Página não encontrada                                                  |

## Ver no computador

```sh
python3 -m http.server 8000
# abra http://localhost:8000
```

## Estrutura

```
assets/
  css/style.css      estilos (cores e escala de texto no topo, em :root)
  js/main.js         menu, "aberto agora", agendamento rápido, mapa sob demanda, formulário do WhatsApp
  js/circuit.js      desenha o diagrama do circuito do ar na página Serviços
  fonts/             Archivo (fonte variável, licença SIL OFL)
  img/               logo, favicon e imagem para redes sociais
  img/fotos/         fotos do site (já recortadas e comprimidas)
  video/             vídeo curto dos manômetros (sem som, em loop)
```

## Design

Inspirado na referência enviada: menu flutuante em pílula sobre fotos escuras, títulos
largos e pesados (fonte Archivo), barra de agendamento sobreposta ao destaque, cards
altos de foto com botão redondo, seções cinza-claro e faixas azul-noite. O azul dos
botões conversa com o azul do logo.

## Fotos

**Da Polar** (Instagram @oficinapolar_indaiatuba e fotos enviadas): oficina nova,
Porsche com manômetros, troca de condensador, Renault Zoe, Ford Landau, Astra, cartões
de visita e o vídeo dos manômetros. As placas dos carros de clientes foram desfocadas.

**Banco de imagens** (Unsplash, licença livre para uso comercial, sem atribuição
obrigatória):

| Arquivo                     | Foto de             |
| --------------------------- | ------------------- |
| `hero-inicio.jpg`           | Ben Hessler (placa desfocada) |
| `banner-esportivo.jpg`      | Matthew McKinney    |
| `hero-servicos.jpg`         | Kate Ibragimova     |
| `hero-duvidas.jpg`          | Ivan Kohut          |
| `hero-contato.jpg`          | Olav Tvedt          |
| `servico-higienizacao.jpg`  | Philipp Katzenberger |
| `servico-compressor.jpg`    | Christian Buehner   |

Quando a Polar tiver fotos próprias para esses espaços, basta trocar os arquivos
mantendo o mesmo nome.

## Editar conteúdo

- Cabeçalho, faixa "Pare de passar calor" e rodapé se repetem em todas as páginas.
  Ao mudar telefone, endereço ou horário, procure e substitua em todos os `.html`.
- O horário usado no aviso "Aberto agora" fica em `assets/js/main.js` (`HOURS`).
- O WhatsApp aparece como `5519971567104` nos links `wa.me` e em `main.js`.

## Publicar

Qualquer hospedagem de arquivos estáticos serve (GitHub Pages, Netlify, Cloudflare Pages,
Hostinger etc.). Depois de definir o domínio:

1. Troque `assets/img/og-polar.jpg` nas tags `og:image` pelo endereço completo
   (ex.: `https://www.seudominio.com.br/assets/img/og-polar.jpg`).
2. Crie um `sitemap.xml` com o domínio.
3. Cadastre o site no Perfil da Empresa no Google (hoje aparece "Adicionar website").

## De onde veio o conteúdo

Perfil da empresa no Google (endereço, horário, nota e avaliações), cartão de visita
(WhatsApp com o Edinei e telefone fixo), legendas públicas do Instagram e o site antigo
no Webnode (2014).

## Para confirmar com a Polar

- Prazo de garantia. O banner antigo da oficina diz "três meses de garantia"; o site diz
  apenas que o prazo vem no orçamento.
- Logo em vetor (SVG, PDF ou AI). O atual é um JPG de 613 × 432 px. Os cartões azuis
  mostram uma versão branca do logo que ficaria ótima nas faixas escuras.
- E-mail de contato (o antigo era @ig.com.br). Não foi incluído.
- A unidade de Salto (Rua Rússia, 47) deve aparecer no site?
- Página do Facebook a ser linkada.
- Nota e número de avaliações do Google (4,9 e 78 em outubro de 2026) precisam de
  atualização de tempos em tempos.
