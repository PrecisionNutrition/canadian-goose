const markdownIt = require('markdown-it');
const attrs = require('markdown-it-attrs');
const escapeExpression = require('escape-html');

const REDIRECT_PATTERN = /#\/redirect\/activity\/([^/]+)\/?/;

function configureRenderer() {
  const md = markdownIt({ html: true }).use(attrs);

  // Remember old renderer, if overridden, or proxy to default renderer
  const defaultRender =
    md.renderer.rules.link_open ||
    function (tokens, idx, options, _env, self) {
      return self.renderToken(tokens, idx, options);
    };

  // Add target and rel to links when anchor tag is opened
  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    const token = tokens[idx];

    if (!isRedirectLinkWithoutTarget(token)) {
      if (!token.attrGet('target')) {
        token.attrPush(['target', '_blank']);
      }

      if (!token.attrGet('rel')) {
        token.attrPush(['rel', 'noopener noreferrer']);
      }
    }

    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self);
  };

  return md;
}

function isRedirectLinkWithoutTarget(token) {
  return REDIRECT_PATTERN.test(token.attrGet('href'))
    && token.attrGet('target') === null;
}

const DEFINITIONS_EXPR = /\[definition:[\s+]?(?<definition>.*?)\](?<term>.*?)\[\/definition\]/g;

/**
 * Look for definition "short-codes" and replace them with markup for a definition.
 * The markup is then used to create Tippy tooltips in es-certification.
 *
 * Shortcode syntax:
 *
 *   [definition: <definition>]<term>[/definition]
 *
 * Example of shortcode:
 *
 *   [definition: used to express a greeting]hello[/definition]
 *
 * For more examples and a regexp explanation, see https://regex101.com/r/3Dpban/4
 */
function parseDefinitions(html) {
  let match;

  while ((match = DEFINITIONS_EXPR.exec(html))) {
    const { definition, term } = match.groups;
    const replacement = `
      <span class="Definition" data-term="${escapeExpression(
        term
      )}" data-definition="${escapeExpression(definition)}">
        ${term}
      </span>
    `.trim();

    html = html.replace(match[0], replacement);
  }

  return html;
}

/**
 * Renders input as Markdown.
 *
 * @param {(null|undefined|String)}
 *
 * @returns {String} rendered HTML, or blank String should the input be "empty"
 */
function renderMarkdown(input) {
  if (typeof input === undefined || input === null || input === '') {
    return '';
  }

  const renderer = configureRenderer();
  const renderedHtml = renderer.render(input);
  const finalOutput = parseDefinitions(renderedHtml);

  return finalOutput;
}

module.exports = renderMarkdown;
