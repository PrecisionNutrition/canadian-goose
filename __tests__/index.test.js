const renderMarkdown = require('../index');

describe('configureRenderer', function () {
  test('returns a new markdown renderer', () => {
    const expected = '<p><em>foo</em></p>\n';
    const out = renderMarkdown('*foo*');

    expect(out).toBe(expected);
  });

  test('renderer adds safety attributes to links pointing to external sources', () => {
    const expected = '<p><a href="https://example.com" target="_blank" rel="noopener noreferrer">my link</a></p>\n';
    const out = renderMarkdown('[my link](https://example.com)');

    expect(out).toBe(expected);
  });

  test('renderer supports attributes on elements', () => {
    const expected = '<p><a href="example.com" target="new" rel="noopener noreferrer">a link</a></p>\n';

    const out = renderMarkdown('[a link](example.com){target=new}')

    expect(out).toBe(expected);
  });

  test('renderer assigns target to mailto links', () => {
    const expected = '<p><a href="mailto:joe@example.com" target="_blank" rel="noopener noreferrer">Hey</a></p>\n';

    const out = renderMarkdown('[Hey](mailto:joe@example.com)');

    expect(out).toBe(expected);
  });

  test('renderer parses definitions', () => {
    const expected = `<p>This is a <span class="Definition" data-term="definition" data-definition="a statement of the exact meaning of a word, especially in a dictionary">
        definition
      </span></p>\n`;

    const out = renderMarkdown(`This is a [definition: a statement of the exact meaning of a word, especially in a dictionary]definition[/definition]`);

    expect(out).toBe(expected);
  });

  test('renderer escapes definitions', () => {
    const expected = `<p>This is a <span class="Definition" data-term="definition" data-definition="a statement of the exact &amp;quot; meaning of a word, especially in a dictionary">
        definition
      </span></p>\n`;

    const out = renderMarkdown(`This is a [definition: a statement of the exact " meaning of a word, especially in a dictionary]definition[/definition]`);

    expect(out).toBe(expected);
  });

  test('it does not replace improperly formatted definitions', () => {
    const expected = `<p>This is a [definition a statement of the exact &quot; meaning of a word, especially in a dictionary]definition[/definition]</p>\n`;

    const out = renderMarkdown(`This is a [definition a statement of the exact " meaning of a word, especially in a dictionary]definition[/definition]`);

    expect(out).toBe(expected);
  });

  test('it returns an empty string with `undefined` as input', () => {
    const expected = '';

    const out = renderMarkdown(undefined);

    expect(out).toBe(expected);
  });

  test('it returns an empty string with `null` as input', () => {
    const expected = '';

    const out = renderMarkdown(null);

    expect(out).toBe(expected);
  });

  test('it returns an empty string with a blank string as input', () => {
    const expected = '';

    const out = renderMarkdown('');

    expect(out).toBe(expected);
  });

  test('handles weird input too', () => {
    const expected = '';

    const out = renderMarkdown({});

    expect(out).toBe(expected);
  });
});
