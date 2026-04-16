// Generate Voronoi-based mahalla zones clipped to Margilan city boundary
import { Delaunay } from "d3-delaunay";
import { writeFileSync } from "fs";

// ── City boundary (from margilan-map-data.ts) ──────────────
const CITY_PATH = "M385.5 125.2 L414.2 150.4 L431.6 153.8 L448 151.1 L444.9 140.9 L454.1 143.6 L468.5 125.9 L491 113.6 L503.3 121.8 L507.4 138.2 L513.5 151.1 L571.9 141.6 L592.4 140.2 L585.3 115 L561.8 107.2 L558.6 106.1 L522.8 107.5 L519.7 93.9 L547.3 81.6 L557.3 83.5 L562.3 89.8 L578.9 85.2 L588 84.3 L585.6 78.1 L595.1 77.8 L593.2 84.8 L595.8 86.2 L606.8 87.5 L606.6 85.9 L614.8 83.8 L608.9 71.1 L605.9 65.7 L613 64.6 L617.7 72.1 L624.1 71.7 L624.6 78.2 L630.1 81.6 L638.6 78 L640.3 82.4 L642.5 87.2 L650.6 84.6 L654.3 83.4 L652.1 80.3 L664.5 77.7 L672.5 74.8 L677.5 73.5 L676.1 65.8 L668 66.2 L668 54.9 L663.1 49.5 L659 43.1 L666.7 46.4 L680.4 30 L681.2 46.5 L681.4 49.7 L681.7 56.9 L685.3 56.2 L686.1 61 L684.8 61.8 L692.8 68.7 L697.8 72.4 L700.9 74.6 L713.3 83.7 L728.7 105.5 L675.4 97.3 L683.6 128 L697.5 134.3 L706.1 138.2 L704.1 150.4 L680.5 147.7 L664.1 166.1 L632.4 180.4 L624.2 166.8 L613 169.8 L601.6 172.9 L601.8 173.5 L604.1 180.5 L604.2 180.8 L590.4 185.9 L579.6 186.6 L586 195.9 L606.8 194.7 L621.1 201.5 L632.8 200.6 L642 196.1 L654.5 189.4 L663.9 183.1 L674.9 180.2 L670.8 165.3 L705.1 152 L712.2 156.9 L721 168.6 L728.8 168.2 L730.7 171.9 L736.8 205.1 L738.7 210.4 L706.7 220.8 L708.6 228.3 L710.4 235.1 L712.4 242.7 L713.9 247 L715.2 250.8 L713.6 258.1 L763.2 266.3 L759.4 288.1 L688.2 297.3 L747.1 308.6 L752.9 312.4 L770 323.9 L764.2 333.4 L768.7 337.6 L769.4 338.3 L769.7 338.6 L762.5 350.2 L744 350.2 L730.7 335.8 L720.5 341.3 L696.9 336.5 L673.4 341.3 L696.9 350.8 L670.3 354.2 L625.1 349 L625.5 359.8 L625.6 362.2 L631.6 373 L609.5 378.6 L589.7 382.7 L552.5 391.7 L525.8 397.2 L518.4 399 L518 399.1 L515.2 399.7 L497.2 404.1 L496.4 404.3 L489 406.1 L486.9 416.3 L479.9 421.3 L473.7 427.2 L473.6 427.3 L462.1 436.9 L456.9 440.1 L432.8 448.9 L419.3 453.8 L418.8 454 L415.3 455 L415.1 455.1 L414.3 454.5 L402.2 458.9 L392.4 462.1 L390.1 463.3 L387 464.7 L383.4 465.6 L376.1 467.4 L363.6 472.2 L357.9 466 L329.2 476.9 L332.8 485 L344 487.6 L350.4 492.4 L360.1 492.8 L360.4 496.9 L361.8 499.3 L383.4 526.8 L397.9 530.6 L398.9 531.9 L406 534.3 L415.4 545.4 L419.1 546.7 L421.7 548.4 L431.4 557.8 L387 570 L377.3 557.9 L361.1 561 L361.1 560.8 L348.6 526.1 L314.8 515.2 L294 510.4 L292.4 510.1 L291.7 509.9 L290.2 509.5 L287 508.8 L286.1 508.6 L285.1 508.4 L259 545.6 L213.5 543.7 L197.5 548.3 L146.5 560.4 L116.1 525 L97.6 505.1 L93 494.9 L118.5 486.2 L104.4 464.2 L100.7 448.3 L123.2 420.4 L112.6 403.2 L106.8 393.8 L63.8 387 L66.9 363.1 L30 356.3 L43.3 338.6 L96.6 342.7 L85.3 330.4 L65.9 320.8 L62.8 307.2 L75.1 305.2 L84.3 288.1 L88 287.3 L117.1 281.3 L193.9 288.8 L205.2 277.9 L202.1 264.3 L196.1 259.9 L186.7 253.3 L171 242.5 L157 232.9 L164.5 233.9 L164.9 234 L176.4 235.5 L177 235.6 L197 238.4 L196.6 237.7 L194.8 234.1 L191.3 227 L169.3 183.1 L222.6 180.4 L226 156.6 L248.4 155 L262.5 152.5 L262.4 152.2 L263 152.2 L265.6 152.2 L309.7 151.8 L337.3 140.2 L331.2 128.6 L339.8 122.5 L342.7 120.4 L343.8 119.7 L334.3 108.9 L298.4 119.1 L261.5 107.5 L236.9 121.1 L229.8 115.7 L242.1 102.7 L252.3 87.1 L265.6 87.1 L295.3 83 L190.8 36.7 L221.7 37.3 L233.4 51.4 L233.8 51.9 L266.6 51 L305.6 68 L328.1 81.6 L334.3 78.9 L341.4 91.8 L349.6 107.5 L378.3 110.9 L385.5 125.2Z";

// ── Mahalla centers ──────────────────
const MAHALLAS = [
  { id: "bakhrin",    name: "Бахрин",     cx: 309,   cy: 217.4 },
  { id: "bobur",      name: "З.М. Бобур", cx: 452.2, cy: 405.3 },
  { id: "kashkar",    name: "Кашкар",     cx: 338.8, cy: 280.1 },
  { id: "yuksalish",  name: "Юксалиш",    cx: 285.1, cy: 515 },
  { id: "nurafshon",  name: "Нурафшон",   cx: 398.5, cy: 321.8 },
  { id: "gorianval",  name: "Горианвал",  cx: 517.8, cy: 358.4 },
  { id: "toyagum",    name: "Тояагум",    cx: 309,   cy: 374 },
  { id: "pichokchi",  name: "Пичокчи",    cx: 488,   cy: 295.7 },
];

// ── Parse SVG path to polygon points ──────────────────
function parsePath(d) {
  const points = [];
  // Match all coordinate pairs after M or L commands
  const regex = /[ML]\s*([\d.]+)\s+([\d.]+)/g;
  let m;
  while ((m = regex.exec(d)) !== null) {
    points.push([parseFloat(m[1]), parseFloat(m[2])]);
  }
  return points;
}

// ── Sutherland-Hodgman polygon clipping ──────────────────
function clipPolygon(subject, clip) {
  let output = [...subject];

  for (let i = 0; i < clip.length; i++) {
    if (output.length === 0) return [];
    const input = [...output];
    output = [];

    const edgeStart = clip[i];
    const edgeEnd = clip[(i + 1) % clip.length];

    for (let j = 0; j < input.length; j++) {
      const current = input[j];
      const previous = input[(j + input.length - 1) % input.length];

      const currInside = isInside(current, edgeStart, edgeEnd);
      const prevInside = isInside(previous, edgeStart, edgeEnd);

      if (currInside) {
        if (!prevInside) {
          const inter = intersection(previous, current, edgeStart, edgeEnd);
          if (inter) output.push(inter);
        }
        output.push(current);
      } else if (prevInside) {
        const inter = intersection(previous, current, edgeStart, edgeEnd);
        if (inter) output.push(inter);
      }
    }
  }

  return output;
}

function isInside(point, edgeStart, edgeEnd) {
  return (edgeEnd[0] - edgeStart[0]) * (point[1] - edgeStart[1]) -
         (edgeEnd[1] - edgeStart[1]) * (point[0] - edgeStart[0]) >= 0;
}

function intersection(p1, p2, p3, p4) {
  const x1 = p1[0], y1 = p1[1], x2 = p2[0], y2 = p2[1];
  const x3 = p3[0], y3 = p3[1], x4 = p4[0], y4 = p4[1];

  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(denom) < 1e-10) return null;

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;

  return [x1 + t * (x2 - x1), y1 + t * (y2 - y1)];
}

// ── Compute centroid of polygon ──────────────────
function centroid(points) {
  let cx = 0, cy = 0, area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    const cross = points[i][0] * points[j][1] - points[j][0] * points[i][1];
    area += cross;
    cx += (points[i][0] + points[j][0]) * cross;
    cy += (points[i][1] + points[j][1]) * cross;
  }
  area /= 2;
  if (Math.abs(area) < 1e-10) {
    // Fallback: average
    const avgX = points.reduce((s, p) => s + p[0], 0) / points.length;
    const avgY = points.reduce((s, p) => s + p[1], 0) / points.length;
    return [avgX, avgY];
  }
  cx /= (6 * area);
  cy /= (6 * area);
  return [cx, cy];
}

// ── Points to SVG path ──────────────────
function toSVGPath(points) {
  if (points.length === 0) return "";
  const rounded = points.map(([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
  return `M${rounded[0][0]},${rounded[0][1]} ` +
    rounded.slice(1).map(([x, y]) => `L${x},${y}`).join(" ") + " Z";
}

// ── Main ──────────────────
const boundaryPoints = parsePath(CITY_PATH);
console.log(`Parsed ${boundaryPoints.length} boundary points`);

// Compute bounding box
const xs = boundaryPoints.map(p => p[0]);
const ys = boundaryPoints.map(p => p[1]);
const minX = Math.min(...xs);
const maxX = Math.max(...xs);
const minY = Math.min(...ys);
const maxY = Math.max(...ys);
console.log(`Bounds: [${minX}, ${minY}] → [${maxX}, ${maxY}]`);

// Create Voronoi from mahalla centers
const centers = MAHALLAS.map(m => [m.cx, m.cy]);
const delaunay = Delaunay.from(centers);
const voronoi = delaunay.voronoi([minX - 50, minY - 50, maxX + 50, maxY + 50]);

// Generate clipped zones
const zones = {};
const centroids = {};

for (let i = 0; i < MAHALLAS.length; i++) {
  const cell = voronoi.cellPolygon(i);
  if (!cell) {
    console.warn(`No cell for ${MAHALLAS[i].id}`);
    continue;
  }

  // Clip city boundary (concave subject) against Voronoi cell (convex clip)
  // S-H requires convex clip polygon — Voronoi cells are always convex
  const clipped = clipPolygon(boundaryPoints, cell);

  if (clipped.length < 3) {
    console.warn(`Clipped polygon for ${MAHALLAS[i].id} has only ${clipped.length} points`);
    continue;
  }

  const path = toSVGPath(clipped);
  const center = centroid(clipped);

  zones[MAHALLAS[i].id] = path;
  centroids[MAHALLAS[i].id] = [Math.round(center[0] * 10) / 10, Math.round(center[1] * 10) / 10];

  console.log(`${MAHALLAS[i].id}: ${clipped.length} points, centroid [${centroids[MAHALLAS[i].id]}]`);
}

// ── Output TypeScript file ──────────────────
const output = `// Auto-generated Voronoi zones for Margilan mahallas
// Source: OpenStreetMap city boundary + approximate mahalla centers
// viewBox: 0 0 800 600

export const MARGILAN_VIEWBOX = "0 0 800 600";

/** City outline path for background rendering */
export const MARGILAN_OUTLINE = "${CITY_PATH}";

/** SVG paths for each mahalla zone (Voronoi clipped to city boundary) */
export const MARGILAN_PATHS: Record<string, string> = {
${Object.entries(zones).map(([id, path]) => `  ${id}: "${path}",`).join("\n")}
};

/** Centroids for label placement */
export const MARGILAN_CENTROIDS: Record<string, [number, number]> = {
${Object.entries(centroids).map(([id, c]) => `  ${id}: [${c[0]}, ${c[1]}],`).join("\n")}
};

/** Mahalla metadata */
export interface MahallaData {
  id: string;
  name: string;
  score: number;
  population: number;
  businesses: number;
  competition: "низкая" | "средняя" | "высокая";
  verdict: string;
}

export const MARGILAN_MAHALLAS: MahallaData[] = [
  { id: "bakhrin", name: "Бахрин", score: 92, population: 18200, businesses: 1218, competition: "средняя", verdict: "Центр возвращающихся мигрантов — высокий спрос на переподготовку и IT-курсы" },
  { id: "bobur", name: "З.М. Бобур", score: 88, population: 22400, businesses: 1008, competition: "низкая", verdict: "Молодёжный район — планируется 1,008 рабочих мест, спрос на образование" },
  { id: "kashkar", name: "Кашкар", score: 85, population: 15600, businesses: 1401, competition: "высокая", verdict: "Самая высокая бизнес-активность — 19.6% населения зарегистрированы как ИП" },
  { id: "yuksalish", name: "Юксалиш", score: 82, population: 12800, businesses: 150, competition: "низкая", verdict: "Промзона «Навруз» — работодатели нуждаются в обученных кадрах" },
  { id: "nurafshon", name: "Нурафшон", score: 78, population: 16500, businesses: 340, competition: "средняя", verdict: "Развивающийся район с инвестиционными проектами SHOYI SILK" },
  { id: "gorianval", name: "Горианвал", score: 75, population: 14200, businesses: 280, competition: "средняя", verdict: "Фонтанная площадь — 15 коммерческих объектов, высокий трафик" },
  { id: "toyagum", name: "Тояагум", score: 72, population: 11300, businesses: 165, competition: "низкая", verdict: "Набережная 0.9 км — туристический и молодёжный кластер, 11.3 млрд инвестиций" },
  { id: "pichokchi", name: "Пичокчи", score: 68, population: 13500, businesses: 210, competition: "средняя", verdict: "Gold Silk, ADB проект — потенциал для курсов рядом с производством" },
];
`;

writeFileSync("lib/margilan-paths.ts", output);
console.log("\n✅ Generated lib/margilan-paths.ts");
