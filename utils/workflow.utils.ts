import type{ Node, Edge } from '../types';

// Calculate auto-layout positions for nodes
export const calculateLayout = (nodes: Node[]): Node[] => {
  const HORIZONTAL_SPACING = 250;
  const VERTICAL_SPACING = 200;
  const START_X = 150;
  const START_Y = 300;

  const positioned = new Set<string>();
  const result = [...nodes];

  const positionNode = (nodeId: string, x: number, y: number): void => {
    const nodeIndex = result.findIndex((n) => n.id === nodeId);
    if (nodeIndex === -1 || positioned.has(nodeId)) return;

    result[nodeIndex] = { ...result[nodeIndex], x, y };
    positioned.add(nodeId);

    const node = result[nodeIndex];

    if (node.type === 'branch' && node.branches) {
      if (node.branches.True) {
        positionNode(node.branches.True, x + HORIZONTAL_SPACING, y - VERTICAL_SPACING);
      }
      if (node.branches.False) {
        positionNode(node.branches.False, x + HORIZONTAL_SPACING, y + VERTICAL_SPACING);
      }
    } else if (node.childId) {
      positionNode(node.childId, x + HORIZONTAL_SPACING, y);
    }
  };

  positionNode('start-node', START_X, START_Y);
  return result;
};

// Build edges from node relationships
export const buildEdges = (nodes: Node[]): Edge[] => {
  const edges: Edge[] = [];

  nodes.forEach((node) => {
    if (node.type === 'branch' && node.branches) {
      Object.entries(node.branches).forEach(([key, childId]) => {
        if (childId) {
          edges.push({
            id: `${node.id}-${key}-${childId}`,
            from: node.id,
            to: childId,
            label: key,
          });
        }
      });
    } else if (node.childId) {
      edges.push({
        id: `${node.id}-${node.childId}`,
        from: node.id,
        to: node.childId,
        label: null,
      });
    }
  });

  return edges;
};

// Generate SVG path for edges
export const getEdgePath = (fromNode: Node, toNode: Node) => {
  const fromX = fromNode.x + 60;
  const fromY = fromNode.y + 60;
  const toX = toNode.x + 60;
  const toY = toNode.y + 60;

  const controlX = (fromX + toX) / 2;

  return {
    path: `M ${fromX} ${fromY} C ${controlX} ${fromY}, ${controlX} ${toY}, ${toX} ${toY}`,
    midX: (fromX + toX) / 2,
    midY: (fromY + toY) / 2,
  };
};
