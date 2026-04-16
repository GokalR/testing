"use client";

import { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type Node,
  type Edge,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────

interface MentalMapNode {
  id: string;
  label: string;
  relationship?: string;
  is_key_takeaway?: boolean;
  children: MentalMapNode[];
}

interface MentalMapContent {
  root: MentalMapNode;
}

interface MentalMapProps {
  content: MentalMapContent;
}

// Data payload stored in each ReactFlow node's `data` field
interface NodeData {
  label: string;
  relationship?: string;
  isKeyTakeaway: boolean;
  isRoot: boolean;
  onSelect: (id: string) => void;
  [key: string]: unknown; // satisfies ReactFlow's Record<string, unknown>
}

// Info shown in the detail panel
interface SelectedNodeInfo {
  id: string;
  label: string;
  relationship?: string;
  isKeyTakeaway: boolean;
  isRoot: boolean;
}

// ── Constants ────────────────────────────────────────────────────────────────

const H_GAP = 200; // horizontal spacing between siblings
const V_GAP = 120; // vertical spacing between levels
const EASE_SLIDE = [0.25, 0.46, 0.45, 0.94] as const;
const EASE_FADE = [0.4, 0.0, 0.2, 1.0] as const;

// ── Tree layout algorithm ────────────────────────────────────────────────────

/**
 * Recursively measures the total width a subtree needs so we can
 * evenly space children around their parent.
 */
function measureSubtreeWidth(node: MentalMapNode): number {
  if (node.children.length === 0) return H_GAP;
  return node.children.reduce(
    (sum, child) => sum + measureSubtreeWidth(child),
    0
  );
}

interface LayoutResult {
  nodes: Node[];
  edges: Edge[];
}

/**
 * Converts a recursive MentalMapNode tree into flat ReactFlow node/edge arrays
 * using a top-down layout with measured widths.
 */
function buildLayout(
  node: MentalMapNode,
  x: number,
  y: number,
  parentId: string | null,
  onSelect: (id: string) => void,
  result: LayoutResult
): void {
  const isRoot = parentId === null;

  const rfNode: Node = {
    id: node.id,
    type: isRoot ? "rootNode" : "defaultNode",
    position: { x, y },
    data: {
      label: node.label,
      relationship: node.relationship,
      isKeyTakeaway: node.is_key_takeaway ?? false,
      isRoot,
      onSelect,
    } satisfies NodeData,
  };

  result.nodes.push(rfNode);

  if (parentId !== null) {
    const edge: Edge = {
      id: `e-${parentId}-${node.id}`,
      source: parentId,
      target: node.id,
      type: "smoothstep",
      animated: true,
      label: node.relationship ?? undefined,
      style: { stroke: "var(--border)", strokeWidth: 1.5 },
      labelStyle: {
        fill: "var(--muted-foreground)",
        fontSize: 11,
        fontFamily: "var(--font-mono, monospace)",
      },
      labelBgStyle: {
        fill: "var(--background)",
        fillOpacity: 0.85,
      },
    };
    result.edges.push(edge);
  }

  if (node.children.length === 0) return;

  const totalWidth = measureSubtreeWidth(node);
  let childX = x - totalWidth / 2;
  const childY = y + V_GAP;

  for (const child of node.children) {
    const childWidth = measureSubtreeWidth(child);
    buildLayout(
      child,
      childX + childWidth / 2,
      childY,
      node.id,
      onSelect,
      result
    );
    childX += childWidth;
  }
}

// ── Custom Node Components ────────────────────────────────────────────────────

function RootNode({ data }: NodeProps) {
  const d = data as NodeData;
  return (
    <button
      type="button"
      onClick={() => d.onSelect(String(d.id ?? ""))}
      className={cn(
        "nodrag px-6 py-4 rounded-xl text-center cursor-pointer",
        "text-primary-foreground font-bold text-base leading-snug",
        "shadow-md border-2 border-transparent",
        "transition-shadow duration-200 hover:shadow-lg",
        "max-w-[200px] min-w-[120px]"
      )}
      style={{ background: "var(--edu-accent, #003d7c)" }}
    >
      {String(d.label)}
    </button>
  );
}

function DefaultNode({ id, data }: NodeProps) {
  const d = data as NodeData;
  return (
    <button
      type="button"
      onClick={() => d.onSelect(id)}
      className={cn(
        "nodrag px-4 py-3 rounded-lg text-center cursor-pointer",
        "bg-card text-foreground text-sm leading-snug",
        "shadow-sm transition-shadow duration-200 hover:shadow-md",
        "max-w-[180px] min-w-[100px]",
        d.isKeyTakeaway
          ? "border-2"
          : "border border-border"
      )}
      style={
        d.isKeyTakeaway
          ? { borderColor: "var(--edu-accent, #003d7c)" }
          : undefined
      }
    >
      {d.isKeyTakeaway && (
        <span
          className="inline-block text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded mb-1.5"
          style={{
            background: "var(--edu-accent, #003d7c)",
            color: "#fff",
          }}
        >
          Key
        </span>
      )}
      <p className="font-medium">{String(d.label)}</p>
    </button>
  );
}

const NODE_TYPES = {
  rootNode: RootNode,
  defaultNode: DefaultNode,
};

// ── Detail Panel ─────────────────────────────────────────────────────────────

interface DetailPanelProps {
  node: SelectedNodeInfo | null;
  onClose: () => void;
}

function DetailPanel({ node, onClose }: DetailPanelProps) {
  return (
    <AnimatePresence>
      {node && (
        <motion.div
          key="detail-panel"
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ duration: 0.28, ease: EASE_SLIDE }}
          className={cn(
            "absolute top-0 right-0 h-full z-10",
            "w-72 bg-card border-l border-border shadow-md",
            "flex flex-col overflow-hidden"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-mono">
              {node.isRoot ? "Root Concept" : "Node Detail"}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close detail panel"
              className={cn(
                "p-1 rounded-md text-muted-foreground",
                "hover:bg-secondary hover:text-foreground transition-colors duration-150"
              )}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
            {/* Key takeaway badge */}
            {node.isKeyTakeaway && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, ease: EASE_FADE }}
                className="inline-flex items-center gap-1.5 self-start text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{
                  background: "var(--edu-accent, #003d7c)",
                  color: "#fff",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3 h-3"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                Key Takeaway
              </motion.span>
            )}

            {/* Label */}
            <div>
              <p className="text-xs text-muted-foreground mb-1 font-mono uppercase tracking-wide">
                Concept
              </p>
              <p className="text-foreground font-heading text-lg font-semibold leading-snug">
                {node.label}
              </p>
            </div>

            {/* Relationship */}
            {node.relationship && !node.isRoot && (
              <div>
                <p className="text-xs text-muted-foreground mb-1 font-mono uppercase tracking-wide">
                  Relationship
                </p>
                <p className="text-sm text-foreground bg-secondary px-3 py-2 rounded-lg">
                  {node.relationship}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function MentalMap({ content }: MentalMapProps) {
  const [selectedNode, setSelectedNode] = useState<SelectedNodeInfo | null>(
    null
  );

  // Build a stable onSelect callback; `useCallback` with empty deps is fine
  // because the identity doesn't need to change — it only reads `setSelectedNode`.
  // We derive the node map inside the layout memo below.
  const [nodeMap, setNodeMap] = useState<Map<string, SelectedNodeInfo>>(
    new Map()
  );

  const handleSelect = useCallback(
    (id: string) => {
      const info = nodeMap.get(id);
      if (info) setSelectedNode(info);
    },
    [nodeMap]
  );

  // Build the flat node/edge arrays from the tree
  const { initialNodes, initialEdges } = useMemo(() => {
    const result: LayoutResult = { nodes: [], edges: [] };
    buildLayout(content.root, 0, 0, null, handleSelect, result);

    // Build the node info map for the detail panel
    const map = new Map<string, SelectedNodeInfo>();
    function traverse(node: MentalMapNode, isRoot: boolean): void {
      map.set(node.id, {
        id: node.id,
        label: node.label,
        relationship: node.relationship,
        isKeyTakeaway: node.is_key_takeaway ?? false,
        isRoot,
      });
      for (const child of node.children) traverse(child, false);
    }
    traverse(content.root, true);
    setNodeMap(map);

    return { initialNodes: result.nodes, initialEdges: result.edges };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const handlePaneClick = useCallback(() => setSelectedNode(null), []);

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden border border-border bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={NODE_TYPES}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        onPaneClick={handlePaneClick}
        proOptions={{ hideAttribution: false }}
        minZoom={0.3}
        maxZoom={2}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color="var(--border)"
        />
        <Controls className="[&>button]:bg-card [&>button]:border-border [&>button]:text-foreground" />
        <MiniMap
          nodeColor={(n) => {
            const d = n.data as NodeData;
            if (d.isRoot) return "var(--edu-accent, #003d7c)";
            if (d.isKeyTakeaway) return "var(--edu-accent, #003d7c)";
            return "var(--muted)";
          }}
          maskColor="var(--background)"
          className="border border-border rounded-lg overflow-hidden"
        />
      </ReactFlow>

      <DetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  );
}
