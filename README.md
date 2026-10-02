# Polar Ar Condicionado Automotivo — site

Site institucional da Polar Ar Condicionado Automotivo (Indaiatuba – SP).
HTML, CSS e JavaScript puros: não precisa de build nem de servidor especial.

## Páginas

| Arquivo         | Página                                                      |
| --------------- | ----------------------------------------------------------- |
| `index.html`    | Início: apresentação, diagrama do circuito, avaliações, endereço |
| `servicos.html` | Serviços, peça por peça e no sistema todo                    |
| `sobre.html`    | A Polar: jeito de trabalhar, avaliações, dados da oficina    |
| `duvidas.html`  | Sinais de problema e perguntas frequentes                    |
| `contato.html`  | Formulário que monta a mensagem do WhatsApp, horário e mapa  |
| `404.html`      | Página não encontrada                                        |

## Ver no computador

```sh
python3 -m http.server 8000
# abra http://localhost:8000
```

## Estrutura

```
assets/
  css/style.css      estilos (cores e escala tipográfica no topo, em :root)
  js/main.js         menu do celular, "aberto agora", mapa sob demanda, formulário do WhatsApp
  js/circuit.js      desenha o diagrama do circuito do ar (versão larga e versão para celular)
  fonts/             Archivo (fonte variável, licença SIL OFL)
  img/               logo com fundo transparente, favicon e imagem para redes sociais
```

## Design

Estilo tipográfico suíço: grade de 12 colunas, títulos de seção pendurados à esquerda,
texto alinhado à esquerda e uma única família tipográfica (Archivo) usada em larguras
diferentes. A cor é o azul do logo sobre branco. Vermelho e azul claro aparecem só no
diagrama do circuito, como nos manômetros de alta e baixa pressão.

## Editar conteúdo

- Cabeçalho, faixa "Pare de passar calor" e rodapé se repetem em todas as páginas.
  Ao mudar telefone, endereço ou horário, procure e substitua em todos os `.html`.
- O horário usado no aviso "Aberto agora" fica em `assets/js/main.js` (`HOURS`).
- O WhatsApp aparece como `5519971567104` nos links `wa.me`.

## Publicar

Qualquer hospedagem de arquivos estáticos serve (GitHub Pages, Netlify, Cloudflare Pages,
Hostinger etc.). Depois de definir o domínio:

1. Troque `assets/img/og-polar.jpg` nas tags `og:image` pelo endereço completo
   (ex.: `https://www.seudominio.com.br/assets/img/og-polar.jpg`).
2. Crie um `sitemap.xml` com o domínio.
3. Cadastre o site no Perfil da Empresa no Google (hoje aparece "Adicionar website").

## De onde veio o conteúdo

Perfil da empresa no Google (endereço, telefone, horário, nota e avaliações), legendas
públicas do Instagram @oficinapolar_indaiatuba e o site antigo no Webnode (2014).

## Para confirmar com a Polar

- Fotos reais da oficina e dos serviços (o site foi desenhado para funcionar sem elas,
  mas fotos podem entrar no herói e na página A Polar).
- Logo em vetor (SVG, PDF ou AI). O atual é um JPG de 613 × 432 px.
- Prazo de garantia dos serviços (o site antigo dizia três meses; o site novo diz
  apenas que o prazo vem no orçamento).
- Telefone fixo (19) 3016-1134 ainda funciona? Não foi incluído.
- E-mail de contato (o antigo era @ig.com.br). Não foi incluído.
- A unidade de Salto (Rua Rússia, 47) deve aparecer no site?
- Página do Facebook a ser linkada.
- Nota e número de avaliações do Google (4,9 e 78 em outubro de 2026) precisam de
  atualização de tempos em tempos.
