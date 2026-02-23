/**
 * Convert a PositionedGraph (from layout.ts) to Excalidraw JSON.
 *
 * Maps beautiful-mermaid shapes → Excalidraw element types:
 *   rectangle/rounded/subroutine → "rectangle"
 *   diamond                      → "diamond"
 *   circle/stadium/doublecircle  → "ellipse"
 *   hexagon/trapezoid/asymmetric → "rectangle" (approximation)
 *   state-start/state-end        → "ellipse" (filled)
 *
 * Edges → "arrow" with bindings to source/target shapes.
 * Labels → "text" bound to parent shape or positioned at edge midpoint.
 */

import type { PositionedGraph } from "beautiful-mermaid";

// ── Excalidraw types (minimal subset) ──────────────────────────

interface ExcalidrawElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  strokeColor: string;
  backgroundColor: string;
  fillStyle: string;
  strokeWidth: number;
  strokeStyle: string;
  roughness: number;
  opacity: number;
  groupIds: string[];
  frameId: null;
  roundness: { type: number } | null;
  seed: number;
  version: number;
  versionNonce: number;
  isDeleted: boolean;
  boundElements: { id: string; type: string }[] | null;
  updated: number;
  link: null;
  locked: boolean;
  // Text-specific
  text?: string;
  fontSize?: number;
  fontFamily?: number;
  textAlign?: string;
  verticalAlign?: string;
  containerId?: string | null;
  originalText?: string;
  autoResize?: boolean;
  lineHeight?: number;
  // Arrow-specific
  points?: number[][];
  startBinding?: { elementId: string; focus: number; gap: number } | null;
  endBinding?: { elementId: string; focus: number; gap: number } | null;
  startArrowhead?: string | null;
  endArrowhead?: string | null;
  lastCommittedPoint?: null;
}

interface ExcalidrawFile {
  type: "excalidraw";
  version: 2;
  source: string;
  elements: ExcalidrawElement[];
  appState: {
    gridSize: null;
    viewBackgroundColor: string;
  };
  files: Record<string, never>;
}

// ── Helpers ────────────────────────────────────────────────────

let _seed = 1;
function seed(): number {
  return (_seed = (_seed * 16807 + 0) % 2147483647);
}

function uid(prefix: string, index: number): string {
  return `${prefix}_${index}`;
}

type ExcalidrawShapeType = "rectangle" | "diamond" | "ellipse";

function mapShape(shape: string): ExcalidrawShapeType {
  switch (shape) {
    case "diamond":
      return "diamond";
    case "circle":
    case "doublecircle":
    case "stadium":
    case "state-start":
    case "state-end":
      return "ellipse";
    default:
      return "rectangle";
  }
}

function roundness(
  shape: string,
): { type: number } | null {
  switch (shape) {
    case "rounded":
    case "stadium":
      return { type: 3 };
    case "diamond":
    case "circle":
    case "doublecircle":
    case "state-start":
    case "state-end":
      return null;
    default:
      return { type: 3 };
  }
}

function isFilled(shape: string): boolean {
  return shape === "state-start" || shape === "state-end";
}

function baseElement(): Partial<ExcalidrawElement> {
  return {
    angle: 0,
    strokeColor: "#1e1e1e",
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    roundness: null,
    seed: seed(),
    version: 1,
    versionNonce: seed(),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
  };
}

// ── Converter ──────────────────────────────────────────────────

export function toExcalidraw(graph: PositionedGraph): string {
  _seed = 42; // deterministic seeds for reproducible output
  const elements: ExcalidrawElement[] = [];
  const nodeIdMap = new Map<string, string>(); // mermaid id → excalidraw id

  // Pass 1: Create shape + text elements for each node
  for (let i = 0; i < graph.nodes.length; i++) {
    const node = graph.nodes[i];
    const shapeId = uid("shape", i);
    const textId = uid("text", i);
    nodeIdMap.set(node.id, shapeId);

    const filled = isFilled(node.shape);

    // Shape element
    elements.push({
      ...baseElement(),
      id: shapeId,
      type: mapShape(node.shape),
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height,
      roundness: roundness(node.shape),
      backgroundColor: filled ? "#1e1e1e" : "transparent",
      boundElements: [{ id: textId, type: "text" }],
    } as ExcalidrawElement);

    // Bound text element
    elements.push({
      ...baseElement(),
      id: textId,
      type: "text",
      // Position at center of parent — Excalidraw recalculates from containerId
      x: node.x + node.width / 2 - (node.label.length * 5),
      y: node.y + node.height / 2 - 10,
      width: node.label.length * 10,
      height: 20,
      text: node.label,
      originalText: node.label,
      fontSize: 16,
      fontFamily: 1,
      textAlign: "center",
      verticalAlign: "middle",
      containerId: shapeId,
      autoResize: true,
      lineHeight: 1.25,
      strokeColor: filled ? "#ffffff" : "#1e1e1e",
      boundElements: null,
    } as ExcalidrawElement);
  }

  // Pass 2: Create arrow + label elements for each edge
  for (let i = 0; i < graph.edges.length; i++) {
    const edge = graph.edges[i];
    const arrowId = uid("arrow", i);

    const srcShapeId = nodeIdMap.get(edge.source);
    const tgtShapeId = nodeIdMap.get(edge.target);

    // Arrow points are relative to the element's (x, y)
    const pts = edge.points;
    if (pts.length < 2) continue;

    const originX = pts[0].x;
    const originY = pts[0].y;
    const relativePoints = pts.map((p) => [
      p.x - originX,
      p.y - originY,
    ]);

    const boundElements: { id: string; type: string }[] = [];
    if (edge.label) {
      boundElements.push({ id: uid("elabel", i), type: "text" });
    }

    // Update source/target shapes' boundElements to include this arrow
    if (srcShapeId) {
      const srcEl = elements.find((e) => e.id === srcShapeId);
      if (srcEl) {
        srcEl.boundElements = srcEl.boundElements ?? [];
        srcEl.boundElements.push({ id: arrowId, type: "arrow" });
      }
    }
    if (tgtShapeId) {
      const tgtEl = elements.find((e) => e.id === tgtShapeId);
      if (tgtEl) {
        tgtEl.boundElements = tgtEl.boundElements ?? [];
        tgtEl.boundElements.push({ id: arrowId, type: "arrow" });
      }
    }

    const strokeStyle =
      edge.style === "dotted"
        ? "dashed"
        : edge.style === "thick"
          ? "solid"
          : "solid";
    const strokeWidth = edge.style === "thick" ? 4 : 2;

    elements.push({
      ...baseElement(),
      id: arrowId,
      type: "arrow",
      x: originX,
      y: originY,
      width: Math.abs(
        relativePoints[relativePoints.length - 1][0],
      ),
      height: Math.abs(
        relativePoints[relativePoints.length - 1][1],
      ),
      points: relativePoints,
      strokeStyle,
      strokeWidth,
      startBinding: srcShapeId
        ? { elementId: srcShapeId, focus: 0, gap: 1 }
        : null,
      endBinding: tgtShapeId
        ? { elementId: tgtShapeId, focus: 0, gap: 1 }
        : null,
      startArrowhead: edge.hasArrowStart ? "arrow" : null,
      endArrowhead: edge.hasArrowEnd ? "arrow" : null,
      lastCommittedPoint: null,
      roundness: { type: 2 },
      boundElements: boundElements.length > 0 ? boundElements : null,
    } as ExcalidrawElement);

    // Edge label as bound text on the arrow
    if (edge.label && edge.labelPosition) {
      const labelId = uid("elabel", i);
      const labelWidth = edge.label.length * 8;
      elements.push({
        ...baseElement(),
        id: labelId,
        type: "text",
        x: edge.labelPosition.x - labelWidth / 2,
        y: edge.labelPosition.y - 8,
        width: labelWidth,
        height: 16,
        text: edge.label,
        originalText: edge.label,
        fontSize: 13,
        fontFamily: 1,
        textAlign: "center",
        verticalAlign: "middle",
        containerId: arrowId,
        autoResize: true,
        lineHeight: 1.25,
        boundElements: null,
      } as ExcalidrawElement);
    }
  }

  // Pass 3: Create group rectangles for subgraph groups
  for (let i = 0; i < graph.groups.length; i++) {
    addGroupElements(elements, graph.groups[i], i);
  }

  const file: ExcalidrawFile = {
    type: "excalidraw",
    version: 2,
    source: "beautiful-mermaid",
    elements,
    appState: {
      gridSize: null,
      viewBackgroundColor: "#ffffff",
    },
    files: {},
  };

  return JSON.stringify(file, null, 2);
}

function addGroupElements(
  elements: ExcalidrawElement[],
  group: { id: string; label: string; x: number; y: number; width: number; height: number; children: any[] },
  index: number,
  depth = 0,
) {
  if (group.width === 0 && group.height === 0) return;

  const groupShapeId = uid("group", index * 100 + depth);

  // Group background rectangle (dashed border, light fill)
  elements.push({
    ...baseElement(),
    id: groupShapeId,
    type: "rectangle",
    x: group.x,
    y: group.y,
    width: group.width,
    height: group.height,
    strokeStyle: "dashed",
    strokeWidth: 1,
    strokeColor: "#868e96",
    backgroundColor: "#f8f9fa",
    fillStyle: "solid",
    opacity: 40,
    roundness: { type: 3 },
    boundElements: null,
  } as ExcalidrawElement);

  // Group label
  if (group.label) {
    elements.push({
      ...baseElement(),
      id: uid("glabel", index * 100 + depth),
      type: "text",
      x: group.x + 8,
      y: group.y + 4,
      width: group.label.length * 8,
      height: 18,
      text: group.label,
      originalText: group.label,
      fontSize: 14,
      fontFamily: 1,
      textAlign: "left",
      verticalAlign: "top",
      containerId: null,
      autoResize: true,
      lineHeight: 1.25,
      strokeColor: "#868e96",
      boundElements: null,
    } as ExcalidrawElement);
  }

  // Recurse into children
  for (let i = 0; i < group.children.length; i++) {
    addGroupElements(elements, group.children[i], index, depth + i + 1);
  }
}
