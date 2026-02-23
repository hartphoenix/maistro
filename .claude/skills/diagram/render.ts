import { renderMermaid, renderMermaidAscii, parseMermaid } from "beautiful-mermaid";
import { layoutGraph } from "./layout.ts";
import { toExcalidraw } from "./to-excalidraw.ts";
import { join, dirname } from "path";

const skillDir = dirname(new URL(import.meta.url).pathname);
const outputDir = join(skillDir, "output");

const args = process.argv.slice(2);
const excalidrawFlag = args.includes("--excalidraw");
const positionalArgs = args.filter((a) => a !== "--excalidraw");

const diagram = positionalArgs[0];
const name = positionalArgs[1] || "diagram";

if (!diagram) {
  console.error(
    "Usage: bun render.ts <mermaid-string> [output-name] [--excalidraw]",
  );
  process.exit(1);
}

const svg = await renderMermaid(diagram);
const ascii = renderMermaidAscii(diagram);

const svgPath = join(outputDir, `${name}.svg`);
const txtPath = join(outputDir, `${name}.txt`);

await Bun.write(svgPath, svg);
await Bun.write(txtPath, ascii);

const outputs = [svgPath, txtPath];

if (excalidrawFlag) {
  const graph = parseMermaid(diagram);
  const positioned = await layoutGraph(graph);
  const excalidrawJson = toExcalidraw(positioned);
  const excalidrawPath = join(outputDir, `${name}.excalidraw`);
  await Bun.write(excalidrawPath, excalidrawJson);
  outputs.push(excalidrawPath);
}

console.log(`Saved ${outputs.join(", ")}`);
