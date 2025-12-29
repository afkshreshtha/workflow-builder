import React from 'react';
import type { Node } from '../types';

interface FlowNodeProps {
  node: Node;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent, node: Node) => void;
  onClick: (e: React.MouseEvent, nodeId: string) => void;
}

export const FlowNode: React.FC<FlowNodeProps> = ({
  node,
  isSelected,
  onMouseDown,
  onClick,
}) => {
  const isProtected = node.id === 'start-node';

  return (
    <div
      className={`flow-node ${node.type} ${isSelected ? 'selected' : ''} ${
        isProtected ? 'protected' : ''
      }`}
      style={{
        left: node.x,
        top: node.y,
        backgroundColor: node.color,
      }}
      onMouseDown={(e) => onMouseDown(e, node)}
      onClick={(e) => onClick(e, node.id)}
    >
      <div className="node-icon">
        {node.type === 'start' && '▶'}
        {node.type === 'action' && '⚡'}
        {node.type === 'branch' && '◆'}
        {node.type === 'end' && '⏹'}
      </div>
      <div className="node-label">{node.label}</div>

      {isProtected && <div className="protected-badge">🔒</div>}

      {node.type !== 'end' && (
        <div className="connection-indicators">
          {node.type === 'branch' ? (
            <>
              <div
                className={`indicator top ${node.branches?.True ? 'active' : ''}`}
                title="True branch"
              >
                T
              </div>
              <div
                className={`indicator bottom ${node.branches?.False ? 'active' : ''}`}
                title="False branch"
              >
                F
              </div>
            </>
          ) : (
            <div className={`indicator right ${node.childId ? 'active' : ''}`}>→</div>
          )}
        </div>
      )}
    </div>
  );
};
