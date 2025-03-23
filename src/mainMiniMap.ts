import { pos } from "./mainScreen.js";
import { paintCircle, paintLine, paintRect } from "./paint.js";
import {
  colors,
  MAP,
  MINIMAP_POSITION_X,
  MINIMAP_POSITION_Y,
  MINIMAP_ZOOM,
  PIXEL_SIZE,
  RGB,
} from "./settings.js";
import { Vec2 } from "./vec2.js";

export function drawMinimap(
  euclidianDistArray: Vec2[],
  ctx: CanvasRenderingContext2D
) {
  drawBorderMiniMap(ctx);
  paintMiniMap(pos, ctx);
  drawRaysMiniMap(euclidianDistArray, ctx);
  drawPlayerMiniMap(ctx);
}

function resizeRayOutOfMiniMap(euclidianDist: Vec2) {
  const maxRayDist = MINIMAP_ZOOM;

  const delimitedRay = { x: euclidianDist.x, y: euclidianDist.y };

  if (Math.abs(delimitedRay.x) > maxRayDist) {
    const proportion = maxRayDist / Math.abs(delimitedRay.x);

    (delimitedRay.x = delimitedRay.x > 0 ? maxRayDist : -maxRayDist),
      (delimitedRay.y *= proportion);
  }

  if (Math.abs(delimitedRay.y) > maxRayDist) {
    const proportion = maxRayDist / Math.abs(delimitedRay.y);

    (delimitedRay.x *= proportion),
      (delimitedRay.y = delimitedRay.y > 0 ? maxRayDist : -maxRayDist);
  }

  return delimitedRay;
}

function drawPlayerMiniMap(ctx: CanvasRenderingContext2D) {
  paintCircle(
    {
      x: MINIMAP_ZOOM * PIXEL_SIZE + MINIMAP_POSITION_X,
      y: MINIMAP_ZOOM * PIXEL_SIZE + MINIMAP_POSITION_Y,
    },
    PIXEL_SIZE / 2,
    RGB.magenta,
    ctx
  );
}

function drawRaysMiniMap(
  euclidianDistArray: Vec2[],
  ctx: CanvasRenderingContext2D
) {
  for (let i = 0; i < euclidianDistArray.length; i++) {
    const euclidianDistMiniMap = resizeRayOutOfMiniMap(euclidianDistArray[i]);

    const wallHitMiniMap = {
      x: MINIMAP_ZOOM + euclidianDistMiniMap.x,
      y: MINIMAP_ZOOM + euclidianDistMiniMap.y,
    };

    paintLine(
      {
        x: MINIMAP_ZOOM * PIXEL_SIZE + MINIMAP_POSITION_X,
        y: MINIMAP_ZOOM * PIXEL_SIZE + MINIMAP_POSITION_Y,
      },
      {
        x: wallHitMiniMap.x * PIXEL_SIZE + MINIMAP_POSITION_X,
        y: wallHitMiniMap.y * PIXEL_SIZE + MINIMAP_POSITION_Y,
      },
      RGB.white,
      ctx
    );
  }
}

function drawBorderMiniMap(ctx: CanvasRenderingContext2D) {
  paintRect(
    {
      x: -0.5 * PIXEL_SIZE + MINIMAP_POSITION_X,
      y: -0.5 * PIXEL_SIZE + MINIMAP_POSITION_Y,
    },
    {
      w: (MINIMAP_ZOOM + 0.5) * 2 * PIXEL_SIZE,
      h: (MINIMAP_ZOOM + 0.5) * 2 * PIXEL_SIZE,
    },
    RGB.magenta,
    ctx
  );
}

function paintMiniMap(pos: Vec2, ctx: CanvasRenderingContext2D) {
  const offSetJ = pos.y - MINIMAP_ZOOM;
  const offSetI = pos.x - MINIMAP_ZOOM;
  const floorOffSetJ = Math.floor(offSetJ);
  const floorOffSetI = Math.floor(offSetI);

  for (let j = 0; j < MINIMAP_ZOOM * 2 + 1; j++) {
    for (let i = 0; i < MINIMAP_ZOOM * 2 + 1; i++) {
      const color = getPixelColor(j + floorOffSetJ, i + floorOffSetI);
      const pixelSize = getPixelSize(
        j,
        i,
        offSetI - floorOffSetI,
        offSetJ - floorOffSetJ
      );
      const pixelPos = getPixelPos(
        j,
        i,
        offSetI - floorOffSetI,
        offSetJ - floorOffSetJ
      );
      paintRect(pixelPos, pixelSize, color, ctx);
    }
  }
}

function getPixelColor(jPos: number, iPos: number) {
  if (jPos > MAP.length - 1 || jPos < 0) return RGB.black;
  if (iPos < 0 || iPos > MAP[0].length - 1) return RGB.black;
  return colors[MAP[jPos][iPos]];
}

function getPixelPos(j: number, i: number, offSetI: number, offSetJ: number) {
  const pos = {
    x: (i - offSetI) * PIXEL_SIZE + MINIMAP_POSITION_X,
    y: (j - offSetJ) * PIXEL_SIZE + MINIMAP_POSITION_Y,
  };
  if (i == 0) pos.x = i * PIXEL_SIZE + MINIMAP_POSITION_X;
  if (j == 0) pos.y = j * PIXEL_SIZE + MINIMAP_POSITION_Y;
  return pos;
}

function getPixelSize(j: number, i: number, offSetI: number, offSetJ: number) {
  const size = { w: PIXEL_SIZE, h: PIXEL_SIZE };
  if (i == 0) size.w = (1 - offSetI) * PIXEL_SIZE;
  if (j == 0) size.h = (1 - offSetJ) * PIXEL_SIZE;

  if (i == MINIMAP_ZOOM * 2) size.w = offSetI * PIXEL_SIZE;
  if (j == MINIMAP_ZOOM * 2) size.h = offSetJ * PIXEL_SIZE;
  return size;
}
