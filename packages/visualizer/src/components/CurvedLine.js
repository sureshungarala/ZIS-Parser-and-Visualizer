/**
 *
 * @param {*} param0
 * @returns
 */

function CurvedLine({
  source: {
    x: x1,
    y: y1,
    width: width1,
    height: height1,
    name: name1,
    type: type1,
  },
  target: {
    x: x2,
    y: y2,
    width: width2,
    height: height2,
    name: name2,
    type: type2,
  },
}) {
  const curveLen = 5;
  const strokeWidth = 2;
  let path = [];
  // [50, 734, 100, 100]
  // [50, 934, 150, 100]

  let lastX;
  let lastY;
  // assuming curveLength always more than stroke width 🙂
  // https://www.figma.com/file/JvbFRwOMyhWryfVJQoLrKC/Paths-in-Flowchart?type=design&node-id=3-93&mode=design&t=ikXf5OmMZ9xjfFL8-0
  if (x1 < x2) {
    if (y1 < y2) {
      if (
        x1 + width1 + 2 * (curveLen + strokeWidth) <= x2 &&
        y1 + height1 + 2 * (curveLen + strokeWidth) <= y2
      ) {
        // draw a line from the bottom center of rect1 to the top center of rect2
        lastX = x1 + Math.floor(width1 / 2);
        lastY = y1 + height1;
        path.push(`M${lastX},${lastY}`);
        lastY = y1 + height1 + Math.floor((y2 - (y1 + height1)) / 2) - curveLen;
        path.push(`L${lastX},${lastY}`);
        lastY = lastY + curveLen;
        path.push(`Q${lastX},${lastY} ${lastX + curveLen},${lastY}`);
        // lastX = lastX + curveLen;
        lastX = x2 + Math.floor(width2 / 2) - curveLen;
        path.push(`L${lastX},${lastY}`);
        lastX = lastX + curveLen;
        path.push(`Q${lastX},${lastY} ${lastX},${lastY + curveLen}`);
        // lastY = lastY + curveLen;
        lastY = y2;
        path.push(`L${lastX},${lastY}`);
      } else if (x1 + width1 >= x2) {
        // rect2 is smaller in width than rect1 and is below rect1
        // draw a line from a point on the rect1's bottom edge which is directly
        // above the top center of rect2 to the top center of rect2
        lastX = x2 + Math.floor(width2 / 2);
        lastY = y1 + height1;
        path.push(`M${lastX},${lastY}`);
        lastY = y2;
        path.push(`L${lastX},${lastY}`);
      } else {
        // Frame 1 - 3
        // rect2 is below rect1, diagonally right but overlapping rect1 towards bottom right
        // draw a line from the right visible center of rect1 to the top visible center of rect2
        lastX = x1 + width1;
        lastY =
          y1 +
          (y2 > y1 + height1
            ? Math.floor(height1 / 2)
            : Math.floor((y2 - y1) / 2));
        path.push(`M${lastX},${lastY}`);
        lastX =
          x2 +
          (x1 + width1 > x2
            ? width2 - Math.floor((x2 + width2 - (x1 + width1)) / 2)
            : Math.floor(width2 / 2)) -
          curveLen;
        path.push(`L${lastX},${lastY}`);
        lastX = lastX + curveLen;
        path.push(`Q${lastX},${lastY} ${lastX},${lastY + curveLen}`);
        // lastY = lastY + curveLen;
        lastY = y2;
        path.push(`L${lastX},${lastY}`);
      }
    } else {
      // Frame 2 - top
      // rect2 is above rect1
      // draw a line from the top center of rect1 to the top center of rect2
      lastX =
        x1 +
        (x1 + width1 > x2 ? Math.floor((x2 - x1) / 2) : Math.floor(width1 / 2));
      lastY = y1;
      path.push(`M${lastX},${lastY}`);
      lastY = y2 - curveLen;
      path.push(`L${lastX},${lastY}`);
      lastY = lastY - curveLen;
      path.push(`Q${lastX},${lastY} ${lastX + curveLen},${lastY}`);
      // lastX = lastX + curveLen;
      lastX = x2 + Math.floor(width2 / 2) - curveLen;
      path.push(`L${lastX},${lastY}`);
      lastX = lastX + curveLen;
      path.push(`Q${lastX},${lastY} ${lastX},${lastY + curveLen}`);
      // lastY = lastY + curveLen;
      lastY = y2;
      path.push(`L${lastX},${lastY}`);
    }
  } else if (x1 > x2) {
    if (y1 < y2) {
      if (
        y2 - (y1 + height1) >= 2 * (curveLen + strokeWidth) &&
        x1 - (x2 + width2) >= 2 * (curveLen + strokeWidth)
      ) {
        // Frame 3 - top
        // rect2 is below rect1, diagonally left
        // draw a line from the bottom center of rect1 to the top center of rect2
        lastX = x1 + Math.floor(width1 / 2);
        lastY = y1 + height1;
        path.push(`M${lastX},${lastY}`);
        lastY = y1 + height1 + Math.floor((y2 - (y1 + height1)) / 2) - curveLen;
        path.push(`L${lastX},${lastY}`);
        lastY = lastY + curveLen;
        path.push(`Q${lastX},${lastY} ${lastX - curveLen},${lastY}`);
        // lastX = lastX - curveLen;
        lastX = x2 + Math.floor(width2 / 2) + curveLen;
        path.push(`L${lastX},${lastY}`);
        lastX = lastX - curveLen;
        path.push(`Q${lastX},${lastY} ${lastX},${lastY + curveLen}`);
        // lastY = lastY + curveLen;
        lastY = y2;
        path.push(`L${lastX},${lastY}`);
      } else {
        // Frame 3 - bottom
        // rect2 is below rect1, diagonally left but overlapping rect1 towards bottom left
        // draw a line from the left center of rect1 to the top center of rect2
        lastX = x1;
        lastY =
          y1 +
          (y2 > y1 + height1
            ? Math.floor(height1 / 2)
            : Math.floor((y2 - y1) / 2));
        path.push(`M${lastX},${lastY}`);
        lastX =
          x2 +
          (x2 + width2 > x1
            ? Math.floor((x1 - x2) / 2)
            : Math.floor(width2 / 2)) +
          curveLen;
        path.push(`L${lastX},${lastY}`);
        lastX = lastX - curveLen;
        path.push(`Q${lastX},${lastY} ${lastX},${lastY + curveLen}`);
        // lastY = lastY + curveLen;
        lastY = y2;
        path.push(`L${lastX},${lastY}`);
      }
    } else {
      // Frame 4 - top
      // rect2 is above rect1, diagonally left
      // draw a line from the top center of rect1 to the top center of rect2
      lastX =
        x1 +
        (x1 < x2 + width2
          ? Math.floor((x1 + width1 - (x2 + width2)) / 2)
          : Math.floor(width1 / 2));
      lastY = y1;
      path.push(`M${lastX},${lastY}`);
      lastY = y2 - curveLen;
      path.push(`L${lastX},${lastY}`);
      lastY = lastY - curveLen;
      path.push(`Q${lastX},${lastY} ${lastX - curveLen},${lastY}`);
      // lastX = lastX - curveLen;
      lastX = x2 + Math.floor(width2 / 2) + curveLen;
      path.push(`L${lastX},${lastY}`);
      lastX = lastX - curveLen;
      path.push(`Q${lastX},${lastY} ${lastX},${lastY + curveLen}`);
      // lastY = lastY + curveLen;
      lastY = y2;
      path.push(`L${lastX},${lastY}`);
    }
  } else if (y1 < y2) {
    // Frame 5 - left
    // rect1 is above rect2
    // draw a STRAIGHT line from the bottom center of rect1 to the top center of rect2
    if (y1 + height1 < y2) {
      lastX = x1 + Math.floor(width1 / 2);
      lastY = y1 + height1;
      path.push(`M${lastX},${lastY}`);
      lastY = y2;
      path.push(`L${lastX},${lastY}`);
    } else {
      // draw a line from the left visible center of rect1 to the left visible center of rect2
      lastX = x1;
      lastY =
        y1 +
        (y1 + height1 > y2
          ? Math.floor((y2 - y1) / 2)
          : Math.floor(height1 / 2));
      path.push(`M${lastX},${lastY}`);
      lastX = x1 - 2 * curveLen;
      path.push(`L${lastX},${lastY}`);
      lastX = lastX - curveLen;
      path.push(`Q${lastX},${lastY} ${lastX},${lastY + curveLen}`);
      // lastY = lastY + curveLen;
      lastY =
        y2 +
        (y1 + height1 > y2
          ? height2 - Math.floor((y2 + height2 - (y1 + height1)) / 2)
          : Math.floor(height1 / 2)) -
        curveLen;
      path.push(`L${lastX},${lastY}`);
      lastY = lastY + curveLen;
      path.push(`Q${lastX},${lastY} ${lastX + curveLen},${lastY}`);
      // lastX = lastX + curveLen;
      lastX = x2;
      path.push(`L${lastX},${lastY}`);
    }
  } else {
    // Frame 5 - right
    // rect2 is above rect1
    // draw a line from the left visible center of rect1 to the left visible center of rect2
    lastX = x1;
    lastY =
      y1 +
      (y2 + height2 > y1
        ? height1 - Math.floor((y1 + height1 - (y2 + height2)) / 2)
        : Math.floor(height1 / 2));
    path.push(`M${lastX},${lastY}`);
    lastX = x1 - 2 * curveLen;
    path.push(`L${lastX},${lastY}`);
    lastX = lastX - curveLen;
    path.push(`Q${lastX},${lastY} ${lastX},${lastY - curveLen}`);
    // lastY = lastY - curveLen;
    lastY =
      y2 +
      (y2 + height2 > y1
        ? Math.floor((y1 - y2) / 2)
        : Math.floor(height2 / 2)) -
      curveLen;
    path.push(`L${lastX},${lastY}`);
    lastY = lastY - curveLen;
    path.push(`Q${lastX},${lastY} ${lastX + curveLen},${lastY}`);
    // lastX = lastX + curveLen;
    lastX = x2;
    path.push(`L${lastX},${lastY}`);
  }

  return (
    <path
      name={`${name1}-${name2}`}
      d={path.join(' ')}
      fill='transparent'
      stroke='black'
      strokeWidth={2}
      markerEnd='url(#arrow)'
    />
  );
}

export default CurvedLine;
