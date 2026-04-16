"use client";

import { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
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
import type { MindMapLabels } from "@/lib/course-content/ui-copy";

interface MindMapNode {
  label: string;
  children?: MindMapNode[];
}

interface InteractiveMindMapProps {
  root: MindMapNode;
  labels: MindMapLabels;
}

interface NodeData {
  label: string;
  depth: number;
  onSelect: (label: string) => void;
  [key: string]: unknown;
}

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

/* ── Horizontal mind-map layout ─────────────────────────────
 *  Root sits at center-left. L1 branches fan vertically on
 *  the right. Each deeper level adds horizontal offset.
 *  This keeps the map compact and readable at any scale.
 * ──────────────────────────────────────────────────────────*/

const X_GAP = 260; // horizontal gap between levels
const Y_GAP_L1 = 140; // vertical spacing between L1 branches
const Y_GAP_LEAF = 52; // vertical spacing between leaf siblings

/** Count total leaves under a node (for vertical sizing). */
function countLeaves(node: MindMapNode): number {
  if (!node.children?.length) return 1;
  return node.children.reduce((sum, c) => sum + countLeaves(c), 0);
}

function buildLayout(
  node: MindMapNode,
  x: number,
  yStart: number,
  yEnd: number,
  parentId: string | null,
  depth: number,
  onSelect: (label: string) => void,
  nodes: Node[],
  edges: Edge[],
  counter: { value: number },
): string {
  const id = `n-${counter.value++}`;
  const y = (yStart + yEnd) / 2;

  const nodeType =
    depth === 0 ? "rootNode" : depth === 1 ? "branchNode" : "leafNode";

  nodes.push({
    id,
    type: nodeType,
    position: { x, y },
    data: { label: node.label, depth, onSelect } satisfies NodeData,
  });

  if (parentId) {
    edges.push({
      id: `e-${parentId}-${id}`,
      source: parentId,
      target: id,
      type: "smoothstep",
      animated: false,
      style: {
        stroke: depth <= 1 ? "var(--edu-accent)" : "var(--border)",
        strokeWidth: depth <= 1 ? 2 : 1.5,
        opacity: depth <= 1 ? 0.5 : 0.4,
      },
    });
  }

  if (node.children?.length) {
    const totalLeaves = countLeaves(node);
    const gap = depth === 0 ? Y_GAP_L1 : Y_GAP_LEAF;
    const blockHeight = totalLeaves * gap;
    const blockStart = y - blockHeight / 2;
    let cursor = blockStart;

    for (const child of node.children) {
      const childLeaves = countLeaves(child);
      const childHeight = childLeaves * gap;
      buildLayout(
        child,
        x + X_GAP,
        cursor,
        cursor + childHeight,
        id,
        depth + 1,
        onSelect,
        nodes,
        edges,
        counter,
      );
      cursor += childHeight;
    }
  }

  return id;
}

/* ── Custom node components ─────────────────────────────── */

function RootNodeComponent({ data }: NodeProps) {
  const d = data as NodeData;
  return (
    <button
      type="button"
      onClick={() => d.onSelect(String(d.label))}
      className="nodrag rounded-2xl px-6 py-3.5 text-center cursor-pointer font-heading text-base font-bold leading-snug shadow-md transition-shadow hover:shadow-lg"
      style={{
        background: "var(--edu-accent, #003d7c)",
        color: "var(--text-inverse, #fff)",
        maxWidth: 240,
        minWidth: 120,
      }}
    >
      {String(d.label)}
    </button>
  );
}

function BranchNodeComponent({ data }: NodeProps) {
  const d = data as NodeData;
  return (
    <button
      type="button"
      onClick={() => d.onSelect(String(d.label))}
      className="nodrag rounded-xl px-4 py-2.5 text-center cursor-pointer font-heading text-sm font-semibold leading-snug shadow-sm border-2 transition-shadow hover:shadow-md"
      style={{
        background: "var(--edu-accent-light, #d6e3ff)",
        borderColor: "var(--edu-accent, #003d7c)",
        color: "var(--text-primary, #1a1a17)",
        maxWidth: 200,
        minWidth: 100,
      }}
    >
      {String(d.label)}
    </button>
  );
}

function LeafNodeComponent({ data }: NodeProps) {
  const d = data as NodeData;
  return (
    <button
      type="button"
      onClick={() => d.onSelect(String(d.label))}
      className="nodrag rounded-lg px-3 py-1.5 text-left cursor-pointer text-xs leading-snug border transition-colors hover:border-[var(--edu-accent)]"
      style={{
        background: "var(--bg-card, #fff)",
        borderColor: "var(--border, #e2dfd8)",
        color: "var(--text-secondary, #4a4a42)",
        maxWidth: 190,
        minWidth: 70,
      }}
    >
      {String(d.label)}
    </button>
  );
}

const NODE_TYPES = {
  rootNode: RootNodeComponent,
  branchNode: BranchNodeComponent,
  leafNode: LeafNodeComponent,
};

/* ── Main component ─────────────────────────────────────── */

export function InteractiveMindMap({ root, labels }: InteractiveMindMapProps) {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const handleSelect = useCallback((label: string) => {
    setSelectedLabel(label);
  }, []);

  const { initialNodes, initialEdges } = useMemo(() => {
    const counter = { value: 0 };
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const totalLeaves = countLeaves(root);
    const totalHeight = totalLeaves * Y_GAP_L1;
    buildLayout(
      root,
      0,
      -totalHeight / 2,
      totalHeight / 2,
      null,
      0,
      handleSelect,
      nodes,
      edges,
      counter,
    );
    return { initialNodes: nodes, initialEdges: edges };
  }, [root, handleSelect]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-border bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={NODE_TYPES}
        fitView
        fitViewOptions={{ padding: 0.15, maxZoom: 1 }}
        onPaneClick={() => setSelectedLabel(null)}
        proOptions={{ hideAttribution: false }}
        minZoom={0.3}
        maxZoom={1.5}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="var(--border)"
        />
        <Controls className="[&>button]:bg-card [&>button]:border-border [&>button]:text-foreground" />
      </ReactFlow>

      {/* Detail panel */}
      <AnimatePresence>
        {selectedLabel && (
          <motion.div
            key="detail"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
            className={cn(
              "absolute top-0 right-0 h-full z-10",
              "w-64 bg-card border-l border-border shadow-md flex flex-col",
            )}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-mono">
                {labels.nodeDetail}
              </span>
              <button
                type="button"
                onClick={() => setSelectedLabel(null)}
                className="p-1 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-4 h-4"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="flex-1 px-4 py-4">
              <p className="text-xs text-muted-foreground mb-1 font-mono uppercase tracking-wide">
                {labels.concept}
              </p>
              <p className="text-foreground font-heading text-lg font-semibold leading-snug">
                {selectedLabel}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
