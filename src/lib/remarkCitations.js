import { visit } from 'unist-util-visit';

const CITATION_RE = /\[(\d+)\]/g;

// Splits text nodes containing [1], [2], etc. into a mix of plain text nodes
// and `citation` nodes (data.hName/hProperties so react-markdown can render
// them via a custom `citation` component).
export default function remarkCitations() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === null) return;
      const { value } = node;
      if (!CITATION_RE.test(value)) return;
      CITATION_RE.lastIndex = 0;

      const newNodes = [];
      let lastIndex = 0;
      let match;
      while ((match = CITATION_RE.exec(value)) !== null) {
        if (match.index > lastIndex) {
          newNodes.push({ type: 'text', value: value.slice(lastIndex, match.index) });
        }
        newNodes.push({
          type: 'citation',
          data: { hName: 'citation', hProperties: { num: match[1] } },
        });
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < value.length) {
        newNodes.push({ type: 'text', value: value.slice(lastIndex) });
      }

      parent.children.splice(index, 1, ...newNodes);
      return index + newNodes.length;
    });
  };
}
