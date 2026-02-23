/**
 * Vendored layout pipeline from beautiful-mermaid v0.x dist/index.js
 * (lines ~3143-3902). These functions are not exported from the package
 * but are needed to produce a PositionedGraph for Excalidraw conversion.
 *
 * The only external dependency is @dagrejs/dagre, which is already
 * installed as a transitive dependency of beautiful-mermaid.
 *
 * Source: https://github.com/nicepkg/beautiful-mermaid
 */

import dagre from "@dagrejs/dagre/dist/dagre.js";
import type {
  MermaidGraph,
  PositionedGraph,
} from "beautiful-mermaid";

// ── Types (internal to layout) ─────────────────────────────────

type Direction = "TD" | "TB" | "LR" | "BT" | "RL";
type NodeShape = string;
type EdgeStyle = "solid" | "dotted" | "thick";

interface Point {
  x: number;
  y: number;
}

interface MermaidNode {
  id: string;
  label: string;
  shape: NodeShape;
}

interface MermaidEdge {
  source: string;
  target: string;
  label?: string;
  style: EdgeStyle;
  hasArrowStart: boolean;
  hasArrowEnd: boolean;
}

interface MermaidSubgraph {
  id: string;
  label: string;
  nodeIds: string[];
  children: MermaidSubgraph[];
  direction?: Direction;
}

interface PositionedNode {
  id: string;
  label: string;
  shape: NodeShape;
  x: number;
  y: number;
  width: number;
  height: number;
  inlineStyle?: Record<string, string>;
}

interface PositionedEdge {
  source: string;
  target: string;
  label?: string;
  style: EdgeStyle;
  hasArrowStart: boolean;
  hasArrowEnd: boolean;
  points: Point[];
  labelPosition?: Point;
}

interface PositionedGroup {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  children: PositionedGroup[];
}

interface LayoutOptions {
  font?: string;
  padding?: number;
  nodeSpacing?: number;
  layerSpacing?: number;
}

interface NodeRect {
  cx: number;
  cy: number;
  hw: number;
  hh: number;
}

// ── Constants ──────────────────────────────────────────────────

const FONT_SIZES = {
  nodeLabel: 13,
  edgeLabel: 11,
  groupHeader: 12,
};

const FONT_WEIGHTS = {
  nodeLabel: 500,
  edgeLabel: 400,
  groupHeader: 600,
};

const GROUP_HEADER_CONTENT_PAD = 8;

const NODE_PADDING = {
  horizontal: 16,
  vertical: 10,
  diamondExtra: 24,
};

const LAYOUT_DEFAULTS: LayoutOptions = {
  font: "Inter",
  padding: 40,
  nodeSpacing: 24,
  layerSpacing: 40,
};

const CIRCULAR_SHAPES = new Set([
  "circle",
  "doublecircle",
  "state-start",
  "state-end",
]);

const NON_RECT_SHAPES = new Set([
  "diamond",
  "circle",
  "doublecircle",
  "state-start",
  "state-end",
]);

// ── Geometry helpers ───────────────────────────────────────────

function estimateTextWidth(
  text: string,
  fontSize: number,
  fontWeight: number,
): number {
  const widthRatio =
    fontWeight >= 600 ? 0.58 : fontWeight >= 500 ? 0.55 : 0.52;
  return text.length * fontSize * widthRatio;
}

function centerToTopLeft(
  cx: number,
  cy: number,
  width: number,
  height: number,
) {
  return { x: cx - width / 2, y: cy - height / 2 };
}

function clipToDiamondBoundary(
  point: Point,
  cx: number,
  cy: number,
  hw: number,
  hh: number,
): Point {
  const dx = point.x - cx;
  const dy = point.y - cy;
  if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return point;
  const scale = 1 / (Math.abs(dx) / hw + Math.abs(dy) / hh);
  return { x: cx + scale * dx, y: cy + scale * dy };
}

function clipToCircleBoundary(
  point: Point,
  cx: number,
  cy: number,
  r: number,
): Point {
  const dx = point.x - cx;
  const dy = point.y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 0.5) return point;
  const scale = r / dist;
  return { x: cx + scale * dx, y: cy + scale * dy };
}

function removeCollinear(pts: Point[]): Point[] {
  if (pts.length < 3) return pts;
  const out = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const a = out[out.length - 1];
    const b = pts[i];
    const c = pts[i + 1];
    const sameX = Math.abs(a.x - b.x) < 1 && Math.abs(b.x - c.x) < 1;
    const sameY = Math.abs(a.y - b.y) < 1 && Math.abs(b.y - c.y) < 1;
    if (sameX || sameY) continue;
    out.push(b);
  }
  out.push(pts[pts.length - 1]);
  return out;
}

function snapToOrthogonal(
  points: Point[],
  verticalFirst = true,
): Point[] {
  if (points.length < 2) return points;
  const result = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const prev = result[result.length - 1];
    const curr = points[i];
    const dx = Math.abs(curr.x - prev.x);
    const dy = Math.abs(curr.y - prev.y);
    if (dx < 1 || dy < 1) {
      result.push(curr);
      continue;
    }
    if (verticalFirst) {
      result.push({ x: prev.x, y: curr.y });
    } else {
      result.push({ x: curr.x, y: prev.y });
    }
    result.push(curr);
  }
  return removeCollinear(result);
}

function clipEndpointsToNodes(
  points: Point[],
  sourceNode: NodeRect | null,
  targetNode: NodeRect | null,
): Point[] {
  if (points.length < 2) return points;
  const result = points.map((p) => ({ ...p }));
  if (targetNode) {
    const last = result.length - 1;
    if (points.length === 2) {
      const first = result[0];
      const curr = result[last];
      const dx = Math.abs(curr.x - first.x);
      const dy = Math.abs(curr.y - first.y);
      if (dy >= dx) {
        const approachFromTop = curr.y > first.y;
        const sideY = approachFromTop
          ? targetNode.cy - targetNode.hh
          : targetNode.cy + targetNode.hh;
        result[last] = { x: curr.x, y: sideY };
      } else {
        const approachFromLeft = curr.x > first.x;
        const sideX = approachFromLeft
          ? targetNode.cx - targetNode.hw
          : targetNode.cx + targetNode.hw;
        result[last] = { x: sideX, y: curr.y };
      }
    } else {
      const prev = result[last - 1];
      const curr = result[last];
      const dx = Math.abs(curr.x - prev.x);
      const dy = Math.abs(curr.y - prev.y);
      const isStrictlyHorizontal = dy < 1 && dx >= 1;
      const isStrictlyVertical = dx < 1 && dy >= 1;
      const isPrimarilyHorizontal =
        !isStrictlyHorizontal && !isStrictlyVertical && dy < dx;
      const isPrimarilyVertical =
        !isStrictlyHorizontal && !isStrictlyVertical && dx < dy;
      if (isStrictlyHorizontal) {
        const approachFromLeft = curr.x > prev.x;
        const sideX = approachFromLeft
          ? targetNode.cx - targetNode.hw
          : targetNode.cx + targetNode.hw;
        result[last] = { x: sideX, y: targetNode.cy };
        result[last - 1] = { ...prev, y: targetNode.cy };
      } else if (isStrictlyVertical) {
        const approachFromTop = curr.y > prev.y;
        const sideY = approachFromTop
          ? targetNode.cy - targetNode.hh
          : targetNode.cy + targetNode.hh;
        result[last] = { x: targetNode.cx, y: sideY };
        result[last - 1] = { ...prev, x: targetNode.cx };
      } else if (isPrimarilyHorizontal) {
        const approachFromLeft = curr.x > prev.x;
        const sideX = approachFromLeft
          ? targetNode.cx - targetNode.hw
          : targetNode.cx + targetNode.hw;
        const withinVerticalBounds =
          prev.y >= targetNode.cy - targetNode.hh &&
          prev.y <= targetNode.cy + targetNode.hh;
        if (withinVerticalBounds) {
          result[last] = { x: sideX, y: prev.y };
        } else {
          result[last] = { x: sideX, y: targetNode.cy };
          result[last - 1] = { ...prev, y: targetNode.cy };
        }
      } else if (isPrimarilyVertical) {
        const approachFromTop = curr.y > prev.y;
        const sideY = approachFromTop
          ? targetNode.cy - targetNode.hh
          : targetNode.cy + targetNode.hh;
        const withinHorizontalBounds =
          prev.x >= targetNode.cx - targetNode.hw &&
          prev.x <= targetNode.cx + targetNode.hw;
        if (withinHorizontalBounds) {
          result[last] = { x: prev.x, y: sideY };
        } else {
          result[last] = { x: targetNode.cx, y: sideY };
          result[last - 1] = { ...prev, x: targetNode.cx };
        }
      }
    }
  }
  if (sourceNode && points.length >= 3) {
    const first = result[0];
    const next = result[1];
    const dx = Math.abs(next.x - first.x);
    const dy = Math.abs(next.y - first.y);
    const isStrictlyHorizontal = dy < 1 && dx >= 1;
    const isStrictlyVertical = dx < 1 && dy >= 1;
    const isPrimarilyHorizontal =
      !isStrictlyHorizontal && !isStrictlyVertical && dy < dx;
    const isPrimarilyVertical =
      !isStrictlyHorizontal && !isStrictlyVertical && dx < dy;
    if (isStrictlyHorizontal) {
      const exitToRight = next.x > first.x;
      const sideX = exitToRight
        ? sourceNode.cx + sourceNode.hw
        : sourceNode.cx - sourceNode.hw;
      result[0] = { x: sideX, y: sourceNode.cy };
      result[1] = { ...result[1], y: sourceNode.cy };
    } else if (isStrictlyVertical) {
      const exitDownward = next.y > first.y;
      const sideY = exitDownward
        ? sourceNode.cy + sourceNode.hh
        : sourceNode.cy - sourceNode.hh;
      result[0] = { x: sourceNode.cx, y: sideY };
      result[1] = { ...result[1], x: sourceNode.cx };
    } else if (isPrimarilyHorizontal) {
      const exitToRight = next.x > first.x;
      const sideX = exitToRight
        ? sourceNode.cx + sourceNode.hw
        : sourceNode.cx - sourceNode.hw;
      const withinVerticalBounds =
        next.y >= sourceNode.cy - sourceNode.hh &&
        next.y <= sourceNode.cy + sourceNode.hh;
      if (withinVerticalBounds) {
        result[0] = { x: sideX, y: next.y };
      } else {
        result[0] = { x: sideX, y: sourceNode.cy };
        result[1] = { ...result[1], y: sourceNode.cy };
      }
    } else if (isPrimarilyVertical) {
      const exitDownward = next.y > first.y;
      const sideY = exitDownward
        ? sourceNode.cy + sourceNode.hh
        : sourceNode.cy - sourceNode.hh;
      const withinHorizontalBounds =
        next.x >= sourceNode.cx - sourceNode.hw &&
        next.x <= sourceNode.cx + sourceNode.hw;
      if (withinHorizontalBounds) {
        result[0] = { x: next.x, y: sideY };
      } else {
        result[0] = { x: sourceNode.cx, y: sideY };
        result[1] = { ...result[1], x: sourceNode.cx };
      }
    }
  }
  return result;
}

// ── Node sizing ────────────────────────────────────────────────

function estimateNodeSize(
  _id: string,
  label: string,
  shape: NodeShape,
) {
  const textWidth = estimateTextWidth(
    label,
    FONT_SIZES.nodeLabel,
    FONT_WEIGHTS.nodeLabel,
  );
  let width = textWidth + NODE_PADDING.horizontal * 2;
  let height = FONT_SIZES.nodeLabel + NODE_PADDING.vertical * 2;
  if (shape === "diamond") {
    const side = Math.max(width, height) + NODE_PADDING.diamondExtra;
    width = side;
    height = side;
  }
  if (shape === "circle" || shape === "doublecircle") {
    const diameter =
      Math.ceil(Math.sqrt(width * width + height * height)) + 8;
    width = shape === "doublecircle" ? diameter + 12 : diameter;
    height = width;
  }
  if (shape === "hexagon") width += NODE_PADDING.horizontal;
  if (shape === "trapezoid" || shape === "trapezoid-alt")
    width += NODE_PADDING.horizontal;
  if (shape === "asymmetric") width += 12;
  if (shape === "cylinder") height += 14;
  if (shape === "state-start" || shape === "state-end") {
    width = 28;
    height = 28;
  }
  width = Math.max(width, 60);
  height = Math.max(height, 36);
  return { width, height };
}

// ── Dagre graph construction ───────────────────────────────────

function directionToDagre(dir: Direction): string {
  switch (dir) {
    case "LR":
      return "LR";
    case "RL":
      return "RL";
    case "BT":
      return "BT";
    case "TD":
    case "TB":
    default:
      return "TB";
  }
}

function collectSubgraphNodeIds(sg: MermaidSubgraph, out: Set<string>) {
  for (const id of sg.nodeIds) out.add(id);
  for (const child of sg.children) collectSubgraphNodeIds(child, out);
}

function collectAllSubgraphIds(sg: MermaidSubgraph, out: Set<string>) {
  out.add(sg.id);
  for (const child of sg.children) collectAllSubgraphIds(child, out);
}

function addSubgraphToDagre(
  g: any,
  sg: MermaidSubgraph,
  graph: MermaidGraph,
  parentId?: string,
) {
  g.setNode(sg.id, { label: sg.label });
  if (parentId) g.setParent(sg.id, parentId);
  for (const nodeId of sg.nodeIds) {
    const node = graph.nodes.get(nodeId);
    if (node) {
      const size = estimateNodeSize(nodeId, node.label, node.shape);
      g.setNode(nodeId, {
        label: node.label,
        width: size.width,
        height: size.height,
      });
      g.setParent(nodeId, sg.id);
    }
  }
  for (const child of sg.children) {
    addSubgraphToDagre(g, child, graph, sg.id);
  }
}

function buildSubgraphRedirects(
  sg: MermaidSubgraph,
  entryMap: Map<string, string>,
  exitMap: Map<string, string>,
) {
  for (const child of sg.children) {
    buildSubgraphRedirects(child, entryMap, exitMap);
  }
  const childIds = [...sg.nodeIds, ...sg.children.map((c) => c.id)];
  if (childIds.length === 0) {
    entryMap.set(sg.id, sg.id);
    exitMap.set(sg.id, sg.id);
    return;
  }
  const firstChild = childIds[0];
  const lastChild = childIds[childIds.length - 1];
  entryMap.set(sg.id, entryMap.get(firstChild) ?? firstChild);
  exitMap.set(sg.id, exitMap.get(lastChild) ?? lastChild);
}

function resolveNodeStyle(
  graph: MermaidGraph,
  nodeId: string,
): Record<string, string> | undefined {
  const className = graph.classAssignments.get(nodeId);
  const classProps = className ? graph.classDefs.get(className) : undefined;
  const inlineProps = graph.nodeStyles.get(nodeId);
  if (!classProps && !inlineProps) return undefined;
  return { ...classProps, ...inlineProps };
}

// ── Subgraph pre-computation ───────────────────────────────────

interface PreComputedSubgraph {
  id: string;
  label: string;
  width: number;
  height: number;
  nodes: PositionedNode[];
  edges: PositionedEdge[];
  groups: PositionedGroup[];
  nodeIds: Set<string>;
  internalEdgeIndices: Set<number>;
}

function preComputeSubgraphLayout(
  sg: MermaidSubgraph,
  graph: MermaidGraph,
  opts: Required<LayoutOptions>,
): PreComputedSubgraph {
  const subG = new dagre.graphlib.Graph({ directed: true, compound: true });
  subG.setGraph({
    rankdir: directionToDagre(sg.direction!),
    acyclicer: "greedy",
    nodesep: opts.nodeSpacing,
    ranksep: opts.layerSpacing,
    marginx: 16,
    marginy: 12,
  });
  subG.setDefaultEdgeLabel(() => ({}));
  const nodeIds = new Set<string>();
  nodeIds.add(sg.id);
  collectSubgraphNodeIds(sg, nodeIds);
  for (const nodeId of sg.nodeIds) {
    const node = graph.nodes.get(nodeId);
    if (node) {
      const size = estimateNodeSize(nodeId, node.label, node.shape);
      subG.setNode(nodeId, {
        label: node.label,
        width: size.width,
        height: size.height,
      });
    }
  }
  for (const child of sg.children) {
    addSubgraphToDagre(subG, child, graph);
  }
  const internalEdgeIndices = new Set<number>();
  for (let i = 0; i < graph.edges.length; i++) {
    const edge = graph.edges[i];
    if (nodeIds.has(edge.source) && nodeIds.has(edge.target)) {
      internalEdgeIndices.add(i);
      const edgeLabel: any = { _index: i };
      if (edge.label) {
        edgeLabel.label = edge.label;
        edgeLabel.width =
          estimateTextWidth(
            edge.label,
            FONT_SIZES.edgeLabel,
            FONT_WEIGHTS.edgeLabel,
          ) + 8;
        edgeLabel.height = FONT_SIZES.edgeLabel + 6;
        edgeLabel.labelpos = "c";
      }
      subG.setEdge(edge.source, edge.target, edgeLabel);
    }
  }
  dagre.layout(subG);
  const verticalFirst =
    sg.direction === "TD" ||
    sg.direction === "TB" ||
    sg.direction === "BT";
  const nestedSubgraphIds = new Set<string>();
  for (const child of sg.children) {
    collectAllSubgraphIds(child, nestedSubgraphIds);
  }
  const nodes: PositionedNode[] = [];
  for (const nodeId of subG.nodes()) {
    if (nestedSubgraphIds.has(nodeId)) continue;
    const mNode = graph.nodes.get(nodeId);
    if (!mNode) continue;
    const dagreNode = subG.node(nodeId);
    if (!dagreNode) continue;
    const topLeft = centerToTopLeft(
      dagreNode.x,
      dagreNode.y,
      dagreNode.width,
      dagreNode.height,
    );
    nodes.push({
      id: nodeId,
      label: mNode.label,
      shape: mNode.shape,
      x: topLeft.x,
      y: topLeft.y,
      width: dagreNode.width,
      height: dagreNode.height,
      inlineStyle: resolveNodeStyle(graph, nodeId),
    });
  }
  const edges: PositionedEdge[] = subG.edges().map((edgeObj: any) => {
    const dagreEdge = subG.edge(edgeObj);
    const originalEdge = graph.edges[dagreEdge._index];
    const rawPoints: Point[] = dagreEdge.points ?? [];
    if (rawPoints.length > 0) {
      const srcShape = graph.nodes.get(edgeObj.v)?.shape;
      if (srcShape === "diamond") {
        const sn = subG.node(edgeObj.v);
        rawPoints[0] = clipToDiamondBoundary(
          rawPoints[0],
          sn.x,
          sn.y,
          sn.width / 2,
          sn.height / 2,
        );
      } else if (srcShape && CIRCULAR_SHAPES.has(srcShape)) {
        const sn = subG.node(edgeObj.v);
        rawPoints[0] = clipToCircleBoundary(
          rawPoints[0],
          sn.x,
          sn.y,
          Math.min(sn.width, sn.height) / 2,
        );
      }
      const tgtShape = graph.nodes.get(edgeObj.w)?.shape;
      if (tgtShape === "diamond") {
        const tn = subG.node(edgeObj.w);
        const last = rawPoints.length - 1;
        rawPoints[last] = clipToDiamondBoundary(
          rawPoints[last],
          tn.x,
          tn.y,
          tn.width / 2,
          tn.height / 2,
        );
      } else if (tgtShape && CIRCULAR_SHAPES.has(tgtShape)) {
        const tn = subG.node(edgeObj.w);
        const last = rawPoints.length - 1;
        rawPoints[last] = clipToCircleBoundary(
          rawPoints[last],
          tn.x,
          tn.y,
          Math.min(tn.width, tn.height) / 2,
        );
      }
    }
    const orthoPoints = snapToOrthogonal(rawPoints, verticalFirst);
    const srcShape = graph.nodes.get(edgeObj.v)?.shape;
    const tgtShape = graph.nodes.get(edgeObj.w)?.shape;
    const srcRect =
      (srcShape && !NON_RECT_SHAPES.has(srcShape)) || !srcShape
        ? (() => {
            const sn = subG.node(edgeObj.v);
            return sn
              ? {
                  cx: sn.x,
                  cy: sn.y,
                  hw: sn.width / 2,
                  hh: sn.height / 2,
                }
              : null;
          })()
        : null;
    const tgtRect =
      (tgtShape && !NON_RECT_SHAPES.has(tgtShape)) || !tgtShape
        ? (() => {
            const tn = subG.node(edgeObj.w);
            return tn
              ? {
                  cx: tn.x,
                  cy: tn.y,
                  hw: tn.width / 2,
                  hh: tn.height / 2,
                }
              : null;
          })()
        : null;
    const points = clipEndpointsToNodes(orthoPoints, srcRect, tgtRect);
    let labelPosition: Point | undefined;
    if (originalEdge.label && dagreEdge.x != null && dagreEdge.y != null) {
      labelPosition = { x: dagreEdge.x, y: dagreEdge.y };
    }
    return {
      source: originalEdge.source,
      target: originalEdge.target,
      label: originalEdge.label,
      style: originalEdge.style,
      hasArrowStart: originalEdge.hasArrowStart,
      hasArrowEnd: originalEdge.hasArrowEnd,
      points,
      labelPosition,
    };
  });
  const groups = sg.children.map((child) => extractGroup(subG, child));
  const graphInfo = subG.graph();
  return {
    id: sg.id,
    label: sg.label,
    width: graphInfo.width ?? 200,
    height: graphInfo.height ?? 100,
    nodes,
    edges,
    groups,
    nodeIds,
    internalEdgeIndices,
  };
}

// ── Group extraction ───────────────────────────────────────────

function extractGroup(g: any, sg: MermaidSubgraph): PositionedGroup {
  const dagreNode = g.node(sg.id);
  const topLeft = dagreNode
    ? centerToTopLeft(
        dagreNode.x,
        dagreNode.y,
        dagreNode.width,
        dagreNode.height,
      )
    : { x: 0, y: 0 };
  return {
    id: sg.id,
    label: sg.label,
    x: topLeft.x,
    y: topLeft.y,
    width: dagreNode?.width ?? 0,
    height: dagreNode?.height ?? 0,
    children: sg.children.map((child) => extractGroup(g, child)),
  };
}

function expandGroupsForHeaders(
  groups: PositionedGroup[],
  headerHeight: number,
) {
  for (const group of groups) {
    expandGroupForHeader(group, headerHeight);
  }
}

function expandGroupForHeader(
  group: PositionedGroup,
  headerHeight: number,
) {
  for (const child of group.children) {
    expandGroupForHeader(child, headerHeight);
  }
  if (group.children.length > 0) {
    let minY = group.y;
    let maxY = group.y + group.height;
    for (const child of group.children) {
      minY = Math.min(minY, child.y);
      maxY = Math.max(maxY, child.y + child.height);
    }
    group.height = maxY - minY;
    group.y = minY;
  }
  if (group.label) {
    const expansion = headerHeight + GROUP_HEADER_CONTENT_PAD;
    group.y -= expansion;
    group.height += expansion;
  }
}

function flattenAllGroups(groups: PositionedGroup[]): PositionedGroup[] {
  const result: PositionedGroup[] = [];
  for (const g of groups) {
    result.push(g);
    result.push(...flattenAllGroups(g.children));
  }
  return result;
}

function findGroupById(
  groups: PositionedGroup[],
  id: string,
): PositionedGroup | undefined {
  for (const g of groups) {
    if (g.id === id) return g;
    const found = findGroupById(g.children, id);
    if (found) return found;
  }
  return undefined;
}

function offsetGroup(
  group: PositionedGroup,
  dx: number,
  dy: number,
): PositionedGroup {
  return {
    ...group,
    x: group.x + dx,
    y: group.y + dy,
    children: group.children.map((c) => offsetGroup(c, dx, dy)),
  };
}

// ── Main layout function ───────────────────────────────────────

export async function layoutGraph(
  graph: MermaidGraph,
  options: LayoutOptions = {},
): Promise<PositionedGraph> {
  const opts = { ...LAYOUT_DEFAULTS, ...options } as Required<LayoutOptions>;

  // Pre-compute subgraphs with differing directions
  const preComputed = new Map<string, PreComputedSubgraph>();
  for (const sg of graph.subgraphs) {
    if (sg.direction && sg.direction !== graph.direction) {
      preComputed.set(
        sg.id,
        preComputeSubgraphLayout(sg, graph, opts),
      );
    }
  }

  const g = new dagre.graphlib.Graph({ directed: true, compound: true });
  g.setGraph({
    rankdir: directionToDagre(graph.direction),
    acyclicer: "greedy",
    nodesep: opts.nodeSpacing,
    ranksep: opts.layerSpacing,
    marginx: opts.padding,
    marginy: opts.padding,
  });
  g.setDefaultEdgeLabel(() => ({}));

  // Track which nodes belong to subgraphs
  const subgraphNodeIds = new Set<string>();
  for (const sg of graph.subgraphs) {
    subgraphNodeIds.add(sg.id);
    collectSubgraphNodeIds(sg, subgraphNodeIds);
  }

  // Add top-level nodes
  for (const [id, node] of graph.nodes) {
    if (!subgraphNodeIds.has(id)) {
      const size = estimateNodeSize(id, node.label, node.shape);
      g.setNode(id, {
        label: node.label,
        width: size.width,
        height: size.height,
      });
    }
  }

  // Add subgraphs
  for (const sg of graph.subgraphs) {
    if (preComputed.has(sg.id)) {
      const pc = preComputed.get(sg.id)!;
      g.setNode(sg.id, { width: pc.width, height: pc.height });
    } else {
      addSubgraphToDagre(g, sg, graph);
    }
  }

  // Build redirect maps for subgraph entry/exit nodes
  const subgraphEntryNode = new Map<string, string>();
  const subgraphExitNode = new Map<string, string>();
  for (const sg of graph.subgraphs) {
    if (!preComputed.has(sg.id)) {
      buildSubgraphRedirects(sg, subgraphEntryNode, subgraphExitNode);
    }
  }
  for (const [sgId, pc] of preComputed) {
    for (const nodeId of pc.nodeIds) {
      subgraphEntryNode.set(nodeId, sgId);
      subgraphExitNode.set(nodeId, sgId);
    }
  }

  // Add edges (skip internal edges of pre-computed subgraphs)
  const allInternalIndices = new Set<number>();
  for (const pc of preComputed.values()) {
    for (const idx of pc.internalEdgeIndices) allInternalIndices.add(idx);
  }
  const introducedTargets = new Set<string>();
  for (let i = 0; i < graph.edges.length; i++) {
    if (allInternalIndices.has(i)) continue;
    const edge = graph.edges[i];
    const source = subgraphExitNode.get(edge.source) ?? edge.source;
    const target = subgraphEntryNode.get(edge.target) ?? edge.target;
    const edgeLabel: any = { _index: i };
    if (edge.label) {
      edgeLabel.label = edge.label;
      edgeLabel.width =
        estimateTextWidth(
          edge.label,
          FONT_SIZES.edgeLabel,
          FONT_WEIGHTS.edgeLabel,
        ) + 8;
      edgeLabel.height = FONT_SIZES.edgeLabel + 6;
      edgeLabel.labelpos = "c";
    }
    if (!introducedTargets.has(target)) {
      edgeLabel.weight = 2;
      introducedTargets.add(target);
    }
    g.setEdge(source, target, edgeLabel);
  }

  try {
    dagre.layout(g);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Dagre layout failed: ${message}`);
  }

  return extractPositionedGraph(g, graph, opts.padding, preComputed);
}

// ── Position extraction ────────────────────────────────────────

function extractPositionedGraph(
  g: any,
  graph: MermaidGraph,
  padding: number,
  preComputed: Map<string, PreComputedSubgraph>,
): PositionedGraph {
  const nodes: PositionedNode[] = [];
  const groups: PositionedGroup[] = [];

  const subgraphIds = new Set<string>();
  for (const sg of graph.subgraphs) {
    collectAllSubgraphIds(sg, subgraphIds);
  }

  const preComputedNodeIds = new Set<string>();
  for (const pc of preComputed.values()) {
    for (const nodeId of pc.nodeIds) preComputedNodeIds.add(nodeId);
  }

  for (const nodeId of g.nodes()) {
    if (subgraphIds.has(nodeId)) continue;
    const mNode = graph.nodes.get(nodeId);
    if (!mNode) continue;
    const dagreNode = g.node(nodeId);
    if (!dagreNode) continue;
    const topLeft = centerToTopLeft(
      dagreNode.x,
      dagreNode.y,
      dagreNode.width,
      dagreNode.height,
    );
    nodes.push({
      id: nodeId,
      label: mNode.label,
      shape: mNode.shape,
      x: topLeft.x,
      y: topLeft.y,
      width: dagreNode.width,
      height: dagreNode.height,
      inlineStyle: resolveNodeStyle(graph, nodeId),
    });
  }

  for (const sg of graph.subgraphs) {
    groups.push(extractGroup(g, sg));
  }

  const verticalFirst =
    graph.direction === "TD" ||
    graph.direction === "TB" ||
    graph.direction === "BT";

  const edges: PositionedEdge[] = g.edges().map((edgeObj: any) => {
    const dagreEdge = g.edge(edgeObj);
    const originalEdge = graph.edges[dagreEdge._index];
    const rawPoints: Point[] = dagreEdge.points ?? [];

    if (rawPoints.length > 0) {
      const srcShape = graph.nodes.get(edgeObj.v)?.shape;
      if (srcShape === "diamond") {
        const sn = g.node(edgeObj.v);
        rawPoints[0] = clipToDiamondBoundary(
          rawPoints[0],
          sn.x,
          sn.y,
          sn.width / 2,
          sn.height / 2,
        );
      } else if (srcShape && CIRCULAR_SHAPES.has(srcShape)) {
        const sn = g.node(edgeObj.v);
        rawPoints[0] = clipToCircleBoundary(
          rawPoints[0],
          sn.x,
          sn.y,
          Math.min(sn.width, sn.height) / 2,
        );
      }
      const tgtShape = graph.nodes.get(edgeObj.w)?.shape;
      if (tgtShape === "diamond") {
        const tn = g.node(edgeObj.w);
        const last = rawPoints.length - 1;
        rawPoints[last] = clipToDiamondBoundary(
          rawPoints[last],
          tn.x,
          tn.y,
          tn.width / 2,
          tn.height / 2,
        );
      } else if (tgtShape && CIRCULAR_SHAPES.has(tgtShape)) {
        const tn = g.node(edgeObj.w);
        const last = rawPoints.length - 1;
        rawPoints[last] = clipToCircleBoundary(
          rawPoints[last],
          tn.x,
          tn.y,
          Math.min(tn.width, tn.height) / 2,
        );
      }
    }

    const orthoPoints = snapToOrthogonal(rawPoints, verticalFirst);
    const srcShapeForClip = graph.nodes.get(edgeObj.v)?.shape;
    const tgtShapeForClip = graph.nodes.get(edgeObj.w)?.shape;

    const srcRect: NodeRect | null =
      (srcShapeForClip && !NON_RECT_SHAPES.has(srcShapeForClip)) ||
      !srcShapeForClip
        ? (() => {
            const sn = g.node(edgeObj.v);
            return sn
              ? {
                  cx: sn.x,
                  cy: sn.y,
                  hw: sn.width / 2,
                  hh: sn.height / 2,
                }
              : null;
          })()
        : null;

    const tgtRect: NodeRect | null =
      (tgtShapeForClip && !NON_RECT_SHAPES.has(tgtShapeForClip)) ||
      !tgtShapeForClip
        ? (() => {
            const tn = g.node(edgeObj.w);
            return tn
              ? {
                  cx: tn.x,
                  cy: tn.y,
                  hw: tn.width / 2,
                  hh: tn.height / 2,
                }
              : null;
          })()
        : null;

    const points = clipEndpointsToNodes(orthoPoints, srcRect, tgtRect);

    let labelPosition: Point | undefined;
    if (
      originalEdge.label &&
      dagreEdge.x != null &&
      dagreEdge.y != null
    ) {
      labelPosition = { x: dagreEdge.x, y: dagreEdge.y };
    }

    return {
      source: originalEdge.source,
      target: originalEdge.target,
      label: originalEdge.label,
      style: originalEdge.style,
      hasArrowStart: originalEdge.hasArrowStart,
      hasArrowEnd: originalEdge.hasArrowEnd,
      points,
      labelPosition,
    };
  });

  // Merge pre-computed subgraph content
  if (preComputed.size > 0) {
    const nodePositionMap = new Map<
      string,
      { cx: number; cy: number }
    >();
    for (const n of nodes) {
      nodePositionMap.set(n.id, {
        cx: n.x + n.width / 2,
        cy: n.y + n.height / 2,
      });
    }
    for (const [sgId, pc] of preComputed) {
      const placeholder = g.node(sgId);
      if (!placeholder) continue;
      const topLeft = centerToTopLeft(
        placeholder.x,
        placeholder.y,
        placeholder.width,
        placeholder.height,
      );
      for (const pcNode of pc.nodes) {
        const composed = {
          ...pcNode,
          x: pcNode.x + topLeft.x,
          y: pcNode.y + topLeft.y,
        };
        nodes.push(composed);
        nodePositionMap.set(composed.id, {
          cx: composed.x + composed.width / 2,
          cy: composed.y + composed.height / 2,
        });
      }
      for (const pcEdge of pc.edges) {
        edges.push({
          ...pcEdge,
          points: pcEdge.points.map((p) => ({
            x: p.x + topLeft.x,
            y: p.y + topLeft.y,
          })),
          labelPosition: pcEdge.labelPosition
            ? {
                x: pcEdge.labelPosition.x + topLeft.x,
                y: pcEdge.labelPosition.y + topLeft.y,
              }
            : undefined,
        });
      }
      const group = findGroupById(groups, sgId);
      if (group && pc.groups.length > 0) {
        group.children = pc.groups.map((cg) =>
          offsetGroup(cg, topLeft.x, topLeft.y),
        );
      }
    }

    // Fix edge endpoints touching pre-computed subgraph nodes
    for (const edge of edges) {
      if (
        preComputedNodeIds.has(edge.source) &&
        preComputedNodeIds.has(edge.target)
      )
        continue;
      let modified = false;
      if (preComputedNodeIds.has(edge.source)) {
        const pos = nodePositionMap.get(edge.source);
        if (pos && edge.points.length > 0) {
          edge.points[0] = { x: pos.cx, y: pos.cy };
          modified = true;
        }
      }
      if (preComputedNodeIds.has(edge.target)) {
        const pos = nodePositionMap.get(edge.target);
        if (pos && edge.points.length > 0) {
          edge.points[edge.points.length - 1] = {
            x: pos.cx,
            y: pos.cy,
          };
          modified = true;
        }
      }
      if (modified) {
        edge.points = snapToOrthogonal(edge.points, verticalFirst);
      }
    }
  }

  // Expand groups for header labels
  const headerHeight = FONT_SIZES.groupHeader + 16;
  expandGroupsForHeaders(groups, headerHeight);

  const flatGroups = flattenAllGroups(groups);
  const allYs = [
    ...nodes.map((n) => n.y),
    ...flatGroups.map((g2) => g2.y),
  ];
  const currentMinY = allYs.length > 0 ? Math.min(...allYs) : padding;
  let graphWidth = g.graph().width ?? 800;
  let graphHeight = g.graph().height ?? 600;

  if (currentMinY < padding) {
    const dy = padding - currentMinY;
    for (const n of nodes) n.y += dy;
    for (const e of edges) {
      for (const p of e.points) p.y += dy;
      if (e.labelPosition) e.labelPosition.y += dy;
    }
    for (const fg of flatGroups) fg.y += dy;
    graphHeight += dy;
  }

  const maxBottom = Math.max(
    ...nodes.map((n) => n.y + n.height),
    ...flatGroups.map((g2) => g2.y + g2.height),
    ...edges.flatMap((e) => e.points.map((p) => p.y)),
  );
  if (maxBottom + padding > graphHeight) {
    graphHeight = maxBottom + padding;
  }

  return { width: graphWidth, height: graphHeight, nodes, edges, groups };
}
