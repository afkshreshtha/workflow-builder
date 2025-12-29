import React from 'react';
import type { Node } from '../types';

interface ToolbarProps {
  selectedNode: string | null;
  nodes: Node[];
  onSave: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ selectedNode, nodes, onSave }) => {
  const selectedNodeData = nodes.find((n) => n.id === selectedNode);

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <span className="status-badge">
          {selectedNode && selectedNodeData
            ? `📝 Editing: ${selectedNodeData.label}`
            : '✓ Ready'}
        </span>
      </div>
      <div className="toolbar-right">
        <button className="toolbar-btn" onClick={onSave}>
          💾 Save Workflow
        </button>
      </div>
    </div>
  );
};
