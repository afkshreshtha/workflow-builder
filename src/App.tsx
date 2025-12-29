import React, { useState, useRef, useCallback, useEffect } from 'react';
import type{ Node, Edge }  from '../types';
import { calculateLayout, buildEdges, getEdgePath } from '../utils/workflow.utils';
import { FlowNode } from '../components/FlowNode';
import { Sidebar } from '../components/Sidebar';
import { Toolbar } from '../components/Toolbar';
import './App.css';

// Initial workflow starts with just a Start node
const initialNodes: Node[] = [
  {
    id: 'start-node',
    label: 'Start',
    x: 150,
    y: 300,
    color: '#10b981',
    type: 'start',
    childId: null,
  },
];

let nodeIdCounter = 1;

function App() {
  // State management
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [history, setHistory] = useState<Node[][]>([initialNodes]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  // Canvas interaction state
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // Auto-layout nodes when structure changes
  useEffect(() => {
    const layouted = calculateLayout(nodes);
    if (JSON.stringify(layouted) !== JSON.stringify(nodes)) {
      setNodes(layouted);
    }
  }, [nodes.length]);

  // Build edges from node relationships
  const edges: Edge[] = buildEdges(nodes);

  // Helper to get node by ID
  const getNodeById = (id: string): Node | undefined => nodes.find((n) => n.id === id);

  // History management
  const saveToHistory = (newNodes: Node[]): void => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newNodes);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = (): void => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setNodes(history[historyIndex - 1]);
    }
  };

  const redo = (): void => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setNodes(history[historyIndex + 1]);
    }
  };

  // Add node after selected node
  const addNodeAfter = (
    parentId: string,
    nodeType: 'action' | 'branch' | 'end',
    branchKey: 'True' | 'False' | null = null
  ): void => {
    const parent = getNodeById(parentId);
    if (!parent) return;

    if (parent.type === 'end') {
      alert('⚠️ Cannot add nodes after End node!');
      return;
    }

    const newId = `node-${nodeIdCounter++}`;
    const colors = { action: '#3b82f6', branch: '#f59e0b', end: '#ef4444' };
    const labels = { action: 'New Action', branch: 'New Branch', end: 'End' };

    const newNode: Node = {
      id: newId,
      label: labels[nodeType],
      x: parent.x + 250,
      y: parent.y,
      color: colors[nodeType],
      type: nodeType,
      ...(nodeType === 'branch' ? { branches: { True: null, False: null } } : {}),
      ...(nodeType !== 'end' && nodeType !== 'branch' ? { childId: null } : {}),
    };

    setNodes((prev) => {
      const updated: Node[] = [...prev, newNode];
      let oldChildId: string | null = null;

      // Handle branch parent
      if (parent.type === 'branch' && branchKey) {
        oldChildId = parent.branches![branchKey];
        const result = updated.map((n) => {
          if (n.id === parentId && n.type === 'branch') {
            return {
              ...n,
              branches: { ...n.branches!, [branchKey]: newId },
            };
          }
          // Re-wire old child to new node
          if (n.id === newId && oldChildId && nodeType !== 'end') {
            if (nodeType === 'branch') {
              return { ...n, branches: { True: oldChildId, False: null } };
            } else {
              return { ...n, childId: oldChildId };
            }
          }
          return n;
        });
        saveToHistory(result);
        return result;
      }

      // Handle action/start parent
      if (parent.type !== 'end' && parent.type !== 'branch') {
        oldChildId = parent.childId || null;
        const result = updated.map((n) => {
          if (n.id === parentId) {
            return { ...n, childId: newId };
          }
          // Re-wire old child to new node
          if (n.id === newId && oldChildId && nodeType !== 'end') {
            if (nodeType === 'branch') {
              return { ...n, branches: { True: oldChildId, False: null } };
            } else {
              return { ...n, childId: oldChildId };
            }
          }
          return n;
        });
        saveToHistory(result);
        return result;
      }

      return updated;
    });
  };

  // Delete node and reconnect children to parent
  const deleteNode = (nodeId: string): void => {
    if (nodeId === 'start-node') {
      alert('⚠️ Cannot delete the Start node!');
      return;
    }

    const nodeToDelete = getNodeById(nodeId);
    if (!nodeToDelete) return;

    setNodes((prev) => {
      // Get children of deleted node
      let childIds: string[] = [];
      if (nodeToDelete.type === 'branch' && nodeToDelete.branches) {
        childIds = Object.values(nodeToDelete.branches).filter(
          (id): id is string => id !== null
        );
      } else if (nodeToDelete.childId) {
        childIds = [nodeToDelete.childId];
      }

      // Find parent of deleted node
      const parent = prev.find((n) => {
        if (n.type === 'branch' && n.branches) {
          return Object.values(n.branches).includes(nodeId);
        }
        return n.childId === nodeId;
      });

      const filtered = prev.filter((n) => n.id !== nodeId);

      // Reconnect parent to children
      if (parent) {
        const result = filtered.map((n) => {
          if (n.id === parent.id) {
            if (parent.type === 'branch' && n.type === 'branch') {
              const newBranches = { ...parent.branches! };
              Object.keys(newBranches).forEach((key) => {
                const branchKey = key as 'True' | 'False';
                if (newBranches[branchKey] === nodeId) {
                  newBranches[branchKey] = childIds[0] || null;
                }
              });
              return { ...n, branches: newBranches };
            } else {
              return { ...n, childId: childIds[0] || null };
            }
          }
          return n;
        });
        saveToHistory(result);
        return result;
      }

      saveToHistory(filtered);
      return filtered;
    });

    setSelectedNode(null);
  };

  // Update node label
  const updateNodeLabel = (nodeId: string, newLabel: string): void => {
    if (nodeId === 'start-node') return;
    setNodes((prev) =>
      prev.map((node) => (node.id === nodeId ? { ...node, label: newLabel } : node))
    );
  };

  // Canvas interaction handlers
  const handleNodeMouseDown = useCallback(
    (e: React.MouseEvent, node: Node): void => {
      if (e.button !== 0) return;
      e.stopPropagation();

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const offsetX = (e.clientX - rect.left - pan.x) / zoom - node.x;
      const offsetY = (e.clientY - rect.top - pan.y) / zoom - node.y;

      setDraggedNode(node.id);
      setOffset({ x: offsetX, y: offsetY });
      setSelectedNode(node.id);
    },
    [zoom, pan]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent): void => {
      if (draggedNode) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = (e.clientX - rect.left - pan.x) / zoom - offset.x;
        const y = (e.clientY - rect.top - pan.y) / zoom - offset.y;

        setNodes((prev) =>
          prev.map((node) => (node.id === draggedNode ? { ...node, x, y } : node))
        );
      } else if (isPanning) {
        const dx = e.clientX - panStart.x;
        const dy = e.clientY - panStart.y;
        setPan({ x: pan.x + dx, y: pan.y + dy });
        setPanStart({ x: e.clientX, y: e.clientY });
      }
    },
    [draggedNode, isPanning, offset, zoom, pan, panStart]
  );

  const handleMouseUp = useCallback((): void => {
    setDraggedNode(null);
    setIsPanning(false);
  }, []);

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent): void => {
      if (e.button !== 0 || draggedNode) return;
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      setSelectedNode(null);
    },
    [draggedNode]
  );

  const handleNodeClick = (e: React.MouseEvent, nodeId: string): void => {
    e.stopPropagation();
    setSelectedNode(nodeId);
  };

  // Zoom controls
  const handleZoomIn = (): void => setZoom((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = (): void => setZoom((prev) => Math.max(prev - 0.1, 0.5));
  const handleResetView = (): void => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Save workflow to console
  const saveWorkflow = (): void => {
    const workflowData = {
      nodes: nodes.map((n) => ({
        id: n.id,
        label: n.label,
        type: n.type,
        ...(n.type === 'branch' ? { branches: n.branches } : {}),
        ...(n.childId !== undefined ? { childId: n.childId } : {}),
      })),
      timestamp: new Date().toISOString(),
    };
    console.log('📊 Workflow Data:', JSON.stringify(workflowData, null, 2));
    alert('✅ Workflow saved to console!');
  };

  return (
    <div className="app" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <Sidebar
        selectedNode={selectedNode}
        nodes={nodes}
        edges={edges}
        zoom={zoom}
        historyIndex={historyIndex}
        historyLength={history.length}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        onUndo={undo}
        onRedo={redo}
        onAddNode={addNodeAfter}
        onDeleteNode={deleteNode}
        onUpdateLabel={updateNodeLabel}
      />

      <main className="main-content">
        <Toolbar selectedNode={selectedNode} nodes={nodes} onSave={saveWorkflow} />

        <div className="canvas-wrapper" ref={canvasRef} onMouseDown={handleCanvasMouseDown}>
          <div
            className="canvas"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            }}
          >
            {/* Render edges */}
            <svg className="edges-layer">
              <defs>
                <marker
                  id="arrow"
                  markerWidth="12"
                  markerHeight="12"
                  refX="10"
                  refY="6"
                  orient="auto"
                >
                  <path d="M2,2 L2,10 L10,6 L2,2" fill="#94a3b8" />
                </marker>
              </defs>
              {edges.map((edge) => {
                const fromNode = nodes.find((n) => n.id === edge.from);
                const toNode = nodes.find((n) => n.id === edge.to);
                if (!fromNode || !toNode) return null;

                const { path, midX, midY } = getEdgePath(fromNode, toNode);

                return (
                  <g key={edge.id}>
                    <path
                      d={path}
                      stroke="#94a3b8"
                      strokeWidth="3"
                      fill="none"
                      markerEnd="url(#arrow)"
                      className="edge-path"
                    />
                    {edge.label && (
                      <text
                        x={midX}
                        y={midY - 10}
                        fill="#f59e0b"
                        fontSize="14"
                        fontWeight="700"
                        textAnchor="middle"
                        className="edge-label"
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Render nodes */}
            {nodes.map((node) => (
              <FlowNode
                key={node.id}
                node={node}
                isSelected={selectedNode === node.id}
                onMouseDown={handleNodeMouseDown}
                onClick={handleNodeClick}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
