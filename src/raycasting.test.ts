import { describe, expect, test, vi } from "vitest";
import {
  findPerpendicularDistance,
  findSidesSize,
  findSidesVector,
} from "./raycasting.js";
import { Vec2 } from "./vec2.js";

// expect.extend({
//   toBeFoo: (received: number, expected: number) => {
//     error++;
//     return {
//       message: () => `expected ${received} to be foo`,
//       pass: true,
//     };
//   },
// });

const { MAP } = await vi.hoisted(async () => {
  const { MAP } = await import("./testSettings.js");
  await import("./vec2");
  return {
    MAP,
    CANVAS_HEIGHT: MAP.length,
  };
});

vi.mock("./settings.js", () => {
  return {
    MAP: MAP,
  };
});

describe("DDA Function", () => {
  test("if the DDA algorithm generate a continuous line", () => {
    const points: Vec2[] = [];

    function hitFunction(mapPos: Vec2) {
      points.push(mapPos);
      if (MAP[mapPos.x][mapPos.y] > 0) return true;
      return false;
    }

    const mapPos: Vec2 = { x: 1, y: 1 };
    const newPos: Vec2 = { x: mapPos.x + 0.5, y: mapPos.y + 0.5 };
    const rayDir: Vec2 = { x: -1, y: 0 };
    points.push(mapPos);

    findPerpendicularDistance({
      mapPos,
      newPos,
      rayDir,
      hitFunction: hitFunction,
    });

    expect(points.length).toBeGreaterThanOrEqual(2);

    if (points.length == 2) {
      const sideDist = findSidesVector(rayDir, mapPos, newPos);
      const mapNextMove = {
        x: rayDir.x > 0 ? 1 : -1,
        y: rayDir.y > 0 ? 1 : -1,
      };

      const proportion = {
        x: rayDir.x == 0 ? Infinity : sideDist.x / rayDir.x,
        y: rayDir.y == 0 ? Infinity : sideDist.y / rayDir.y,
      };

      if (proportion.x <= proportion.y) {
        expect(MAP[mapPos.x + mapNextMove.x][mapPos.y]).toBeGreaterThan(0);
      } else {
        expect(MAP[mapPos.x][mapPos.y + mapNextMove.y]).toBeGreaterThan(0);
      }
    } else {
      for (let i = 1; i < points.length; i++) {
        const distX = Math.abs(points[i].x - points[i - 1].x);
        const distY = Math.abs(points[i].y - points[i - 1].y);

        expect(distX).toBeLessThanOrEqual(1);
        expect(distY).toBeLessThanOrEqual(1);
        expect(Math.abs(distX - distY)).toBe(1);
      }
    }
  });
});

describe("Find sides size with", () => {
  test("if right distance is correct", () => {
    const offsetX = Math.random();
    const offsetY = Math.random();

    const mapPos: Vec2 = { x: 12, y: 12 };
    const newPos: Vec2 = { x: mapPos.x + offsetX, y: mapPos.y + offsetY };
    const rayDirRight: Vec2 = { x: 1, y: 0 };

    const sideDist = findSidesSize(rayDirRight, mapPos, newPos);
    expect(sideDist.x).toBeCloseTo(1 - offsetX);
  });

  test("if left distance is correct", () => {
    const offsetX = Math.random();
    const offsetY = Math.random();

    const mapPos: Vec2 = { x: 12, y: 12 };
    const newPos: Vec2 = { x: mapPos.x + offsetX, y: mapPos.y + offsetY };
    const rayDirRight: Vec2 = { x: -1, y: 0 };

    const sideDist = findSidesSize(rayDirRight, mapPos, newPos);
    expect(sideDist.x).toBeCloseTo(offsetX);
  });

  test("if up distance is correct", () => {
    const offsetX = Math.random();
    const offsetY = Math.random();

    const mapPos: Vec2 = { x: 12, y: 12 };
    const newPos: Vec2 = { x: mapPos.x + offsetX, y: mapPos.y + offsetY };
    const rayDirUp: Vec2 = { x: 0, y: 1 };

    const sideDist = findSidesSize(rayDirUp, mapPos, newPos);
    expect(sideDist.y).toBeCloseTo(1 - offsetY);
  });

  test("if down distance is correct", () => {
    const offsetX = Math.random();
    const offsetY = Math.random();

    const mapPos: Vec2 = { x: 12, y: 12 };
    const newPos: Vec2 = { x: mapPos.x + offsetX, y: mapPos.y + offsetY };
    const rayDirUp: Vec2 = { x: 0, y: -1 };

    const sideDist = findSidesSize(rayDirUp, mapPos, newPos);
    expect(sideDist.y).toBeCloseTo(offsetY);
  });
});

describe("Find sides vector with Top left zero", () => {
  test("if right vector is correct on its axis", () => {
    const offsetX = Math.random();
    const offsetY = Math.random();

    const mapPos: Vec2 = { x: 12, y: 12 };
    const newPos: Vec2 = { x: mapPos.x + offsetX, y: mapPos.y + offsetY };
    const rayDirRight: Vec2 = { x: 1, y: 0 };

    const sideDist = findSidesVector(rayDirRight, mapPos, newPos);
    expect(sideDist.x).toBeCloseTo(1 - offsetX);
  });

  test("if left vector is correct on its axis", () => {
    const offsetX = Math.random();
    const offsetY = Math.random();

    const mapPos: Vec2 = { x: 12, y: 12 };
    const newPos: Vec2 = { x: mapPos.x + offsetX, y: mapPos.y + offsetY };
    const rayDirRight: Vec2 = { x: -1, y: 0 };

    const sideDist = findSidesVector(rayDirRight, mapPos, newPos);
    expect(sideDist.x).toBeCloseTo(-offsetX);
  });

  test("if up vector is correct on its axis", () => {
    const offsetX = Math.random();
    const offsetY = Math.random();

    const mapPos: Vec2 = { x: 12, y: 12 };
    const newPos: Vec2 = { x: mapPos.x + offsetX, y: mapPos.y + offsetY };
    const rayDirUp: Vec2 = { x: 0, y: 1 };

    const sideDist = findSidesVector(rayDirUp, mapPos, newPos);
    expect(sideDist.y).toBeCloseTo(offsetY);
  });

  test("if down vector is correct on its axis", () => {
    const offsetX = Math.random();
    const offsetY = Math.random();

    const mapPos: Vec2 = { x: 12, y: 12 };
    const newPos: Vec2 = { x: mapPos.x + offsetX, y: mapPos.y + offsetY };
    const rayDirUp: Vec2 = { x: 0, y: -1 };

    const sideDist = findSidesVector(rayDirUp, mapPos, newPos);
    expect(sideDist.y).toBeCloseTo(offsetY - 1);
  });
});
