import { CANVAS_HEIGHT } from "./settings.js";
import { Vec2 } from "./vec2.js";

type DDAFunction = {
  mapPos: Vec2;
  newPos: Vec2;
  rayDir: Vec2;
  hitFunction: (mapPos: Vec2) => boolean;
};

export function findPerpendicularDistance({
  mapPos: initialMapPos,
  newPos: initialPos,
  rayDir,
  hitFunction,
}: DDAFunction) {
  const mapPos = { x: initialMapPos.x, y: initialMapPos.y };
  const newPos = { x: initialPos.x, y: initialPos.y };

  const deltaDist = {
    x: rayDir.x == 0 ? Infinity : Math.abs(1 / rayDir.x),
    y: rayDir.y == 0 ? Infinity : Math.abs(1 / rayDir.y),
  };

  const sideDist = findSidesSize(rayDir, mapPos, newPos);
  sideDist.x = sideDist.x * deltaDist.x;
  sideDist.y = sideDist.y * deltaDist.y;

  let side: "x" | "y" = "x";

  let hit = false;

  const step = { x: rayDir.x > 0 ? 1 : -1, y: rayDir.y > 0 ? 1 : -1 };

  while (hit == false) {
    if (sideDist.x < sideDist.y) {
      sideDist.x += deltaDist.x;
      mapPos.x += step.x;
      side = "x";
    } else {
      sideDist.y += deltaDist.y;
      mapPos.y += step.y;
      side = "y";
    }

    hit = hitFunction({ x: mapPos.x, y: mapPos.y });
  }

  if (side == "x")
    return {
      perpDist: sideDist.x - deltaDist.x,
      mapHit: { x: mapPos.x, y: mapPos.y },
      side: "x",
    };

  return {
    perpDist: sideDist.y - deltaDist.y,
    mapHit: { x: mapPos.x, y: mapPos.y },
    side: "y",
  };
}

export function findSidesSize(rayDir: Vec2, mapPos: Vec2, newPos: Vec2): Vec2 {
  let sideDist = { x: 0, y: 0 };

  if (rayDir.x > 0) {
    sideDist.x = mapPos.x + 1 - newPos.x;
  } else {
    sideDist.x = newPos.x - mapPos.x;
  }

  if (rayDir.y > 0) {
    sideDist.y = mapPos.y + 1 - newPos.y;
  } else {
    sideDist.y = newPos.y - mapPos.y;
  }

  return sideDist;
}

export function calculteLineHeight(column: number, perpDist: number) {
  const lineHeight = Math.floor(CANVAS_HEIGHT / perpDist);
  const lineStart = -lineHeight / 2 + CANVAS_HEIGHT / 2;
  const lineEnd = lineHeight / 2 + CANVAS_HEIGHT / 2;

  return {
    lineStart: { x: column, y: lineStart < 0 ? 0 : lineStart },
    lineEnd: {
      x: column,
      y: lineEnd >= CANVAS_HEIGHT ? CANVAS_HEIGHT - 1 : lineEnd,
    },
  };
}
//---------------------------------------------------

export function findRayMY({
  mapPos: initialMapPos,
  newPos: initialPos,
  rayDir,
  hitFunction,
}: DDAFunction) {
  const mapPos = { x: initialMapPos.x, y: initialMapPos.y };
  const newPos = { x: initialPos.x, y: initialPos.y };
  let mapNextMove = { x: rayDir.x > 0 ? 1 : -1, y: rayDir.y > 0 ? 1 : -1 };
  let sideDist = { x: 0, y: 0 };

  let hit = false;
  while (!hit) {
    sideDist = findSidesVector(rayDir, mapPos, newPos);

    const proportion = {
      x: rayDir.x == 0 ? Infinity : sideDist.x / rayDir.x,
      y: rayDir.y == 0 ? Infinity : sideDist.y / rayDir.y,
    };

    if (proportion.x == proportion.y) {
      mapPos.x += mapNextMove.x;
      mapPos.y -= mapNextMove.y;
      newPos.x += proportion.x * rayDir.x;
      newPos.y -= proportion.y * rayDir.y;
    } else if (proportion.x < proportion.y) {
      mapPos.x += mapNextMove.x;
      newPos.x += proportion.x * rayDir.x;
      newPos.y -= proportion.x * rayDir.y;
    } else {
      mapPos.y -= mapNextMove.y;
      newPos.x += proportion.y * rayDir.x;
      newPos.y -= proportion.y * rayDir.y;
    }

    hit = hitFunction({ x: mapPos.x, y: mapPos.y });
  }
}

export function findSidesVector(
  rayDir: Vec2,
  mapPos: Vec2,
  newPos: Vec2
): Vec2 {
  let sideDist = { x: 0, y: 0 };

  if (rayDir.x > 0) {
    sideDist.x = mapPos.x + 1 - newPos.x;
  } else {
    sideDist.x = mapPos.x - newPos.x;
  }

  if (rayDir.y > 0) {
    sideDist.y = newPos.y - mapPos.y;
  } else {
    sideDist.y = -(mapPos.y + 1 - newPos.y);
  }

  return sideDist;
}
