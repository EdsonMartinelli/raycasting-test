import { bench } from "vitest";
import { findRayMY, findPerpendicularDistance } from "./raycasting";
import { Vec2 } from "./vec2";
import { MAP } from "./settings";

function hitFunction(mapPos: Vec2) {
  if (MAP[mapPos.x][mapPos.y] > 0) return true;
  return false;
}

bench("my dda", () => {
  const x = Math.random() * 24;
  const y = Math.random() * 24;

  findRayMY({
    mapPos: { x: 12, y: 12 },
    newPos: { x: 12 + 0.5, y: 12 + 0.5 },
    rayDir: { x, y },
    hitFunction: hitFunction,
  });
});

bench("site dda", () => {
  const x = Math.random() * 24;
  const y = Math.random() * 24;
  findPerpendicularDistance({
    mapPos: { x: 12, y: 12 },
    newPos: { x: 12 + 0.5, y: 12 + 0.5 },
    rayDir: { x, y },
    hitFunction: hitFunction,
  });
});
