import React from 'react';
import type { Node, Edge } from '../types';

interface SidebarProps {
  selectedNode: string | null;
  nodes: Node[];
  edges: Edge[];
  zoom: number;
  historyIndex: number;
  historyLength: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onAddNode: (
    parentId: string,
    nodeType: 'action' | 'branch' | 'end',
    branchKey?: 'True' | 'False' | null
  ) => void;
  onDeleteNode: (nodeId: string) => void;
  onUpdateLabel: (nodeId: string, label: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedNode,
  nodes,
  edges,
  zoom,
  historyIndex,
  historyLength,
  onZoomIn,
  onZoomOut,
  onResetView,
  onUndo,
  onRedo,
  onAddNode,
  onDeleteNode,
  onUpdateLabel,
}) => {
  const selectedNodeData = nodes.find((n) => n.id === selectedNode);
  const isStartNode = selectedNode === 'start-node';
  const canAddAfter = selectedNodeData && selectedNodeData.type !== 'end';

  return (
    <aside className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <h2>⚡ Workflow Builder</h2>
        <p>Visual Flow Editor</p>
      </div>

      {/* Node Types Info */}
      <div className="sidebar-section">
        <h3>Node Types</h3>
        <div className="node-info-list">
          <div className="node-info">
            <div className="info-icon start">▶</div>
            <div>
              <strong>Start</strong>
              <p>Entry point (1 child)</p>
            </div>
          </div>
          <div className="node-info">
            <div className="info-icon action">⚡</div>
            <div>
              <strong>Action</strong>
              <p>Single task (1 child)</p>
            </div>
          </div>
          <div className="node-info">
            <div className="info-icon branch">◆</div>
            <div>
              <strong>Branch</strong>
              <p>Decision (True/False)</p>
            </div>
          </div>
          <div className="node-info">
            <div className="info-icon end">⏹</div>
            <div>
              <strong>End</strong>
              <p>Terminal (0 children)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="sidebar-section">
        <h3>Controls</h3>
        <div className="control-group">
          <button className="control-btn" onClick={onZoomIn}>
            <span>🔍+</span> Zoom In
          </button>
          <button className="control-btn" onClick={onZoomOut}>
            <span>🔍−</span> Zoom Out
          </button>
          <button className="control-btn" onClick={onResetView}>
            <span>🎯</span> Reset View
          </button>
          <button className="control-btn" onClick={onUndo} disabled={historyIndex === 0}>
            <span>↶</span> Undo
          </button>
          <button
            className="control-btn"
            onClick={onRedo}
            disabled={historyIndex === historyLength - 1}
          >
            <span>↷</span> Redo
          </button>
        </div>
        <div className="zoom-indicator">Zoom: {Math.round(zoom * 100)}%</div>
      </div>

      {/* Node Properties */}
      {selectedNode && selectedNodeData && (
        <div className="sidebar-section selected-node-panel">
          <h3>Node Properties</h3>
          {isStartNode && <div className="info-banner">🔒 Start node is protected</div>}

          <div className="property-group">
            <label>Type</label>
            <div className="type-badge">{selectedNodeData.type.toUpperCase()}</div>
          </div>

          <div className="property-group">
            <label>Label</label>
            <input
              type="text"
              value={selectedNodeData.label}
              onChange={(e) => onUpdateLabel(selectedNode, e.target.value)}
              className="property-input"
              disabled={isStartNode}
              placeholder={isStartNode ? 'Cannot edit Start' : 'Enter label...'}
            />
          </div>

          {canAddAfter && (
            <div className="property-group">
              <label>Add Node After</label>
              {selectedNodeData.type === 'branch' ? (
                <div className="branch-add-buttons">
                  <button
                    className="add-branch-btn true"
                    onClick={() => onAddNode(selectedNode, 'action', 'True')}
                  >
                    + Action to True
                  </button>
                  <button
                    className="add-branch-btn action-true"
                    onClick={() => onAddNode(selectedNode, 'branch', 'True')}
                  >
                    + Branch to True
                  </button>
                  <button
                    className="add-branch-btn end-true"
                    onClick={() => onAddNode(selectedNode, 'end', 'True')}
                  >
                    + End to True
                  </button>
                  <div className="divider"></div>
                  <button
                    className="add-branch-btn false"
                    onClick={() => onAddNode(selectedNode, 'action', 'False')}
                  >
                    + Action to False
                  </button>
                  <button
                    className="add-branch-btn action-false"
                    onClick={() => onAddNode(selectedNode, 'branch', 'False')}
                  >
                    + Branch to False
                  </button>
                  <button
                    className="add-branch-btn end-false"
                    onClick={() => onAddNode(selectedNode, 'end', 'False')}
                  >
                    + End to False
                  </button>
                </div>
              ) : (
                <div className="simple-add-buttons">
                  <button
                    className="simple-add-btn action"
                    onClick={() => onAddNode(selectedNode, 'action')}
                  >
                    ⚡ Add Action
                  </button>
                  <button
                    className="simple-add-btn branch"
                    onClick={() => onAddNode(selectedNode, 'branch')}
                  >
                    ◆ Add Branch
                  </button>
                  <button
                    className="simple-add-btn end"
                    onClick={() => onAddNode(selectedNode, 'end')}
                  >
                    ⏹ Add End
                  </button>
                </div>
              )}
            </div>
          )}

          {!isStartNode && (
            <button className="delete-btn" onClick={() => onDeleteNode(selectedNode)}>
              🗑 Delete Node
            </button>
          )}
        </div>
      )}

      {/* Statistics */}
      <div className="sidebar-section">
        <h3>Statistics</h3>
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">Total Nodes:</span>
            <span className="stat-value">{nodes.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Connections:</span>
            <span className="stat-value">{edges.length}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
