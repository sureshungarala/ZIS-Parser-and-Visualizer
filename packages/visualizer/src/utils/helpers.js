import { flowStateTypes } from './constants';

function drawChart(
  flowStates = [],
  config = { x: 500, y: 500 },
  prevStatesAndPaths = [],
  prevVisited = []
) {
  const statesAndPaths = [];
  const visited = [];
  let lastX = config.x;
  let lastY = config.y;
  const boxWidth = 150;
  const boxHeight = 100;
  // should be a minimum of 3 * line curve length
  const verticalPadding = 50;
  const horizontalPadding = 50;

  function addAction(
    currentState,
    sourceState,
    left,
    distanceFactorFromSource
  ) {
    const state = {
      name: currentState.name,
      type: currentState.type,
      __flowType: 'state',
    };
    if (state.type === flowStateTypes.choice && !sourceState) {
      // TODO: assuming choice action wouldn't directly follow another choice action
      // Also, Choice can be following a Error Catch action
      const rotatedSquareDelta =
        Math.ceil(Math.sqrt(2 * Math.pow(boxHeight, 2))) - boxHeight;
      state.x = lastX + rotatedSquareDelta;
      state.y = lastY + rotatedSquareDelta;
    } else if (!sourceState) {
      state.x = lastX;
      state.y = lastY + verticalPadding;
    } else if (left) {
      state.x =
        sourceState.x -
        horizontalPadding -
        (distanceFactorFromSource + 1) * boxWidth;
      state.y = sourceState.y + (distanceFactorFromSource + 1) * boxHeight;
    } else {
      state.x =
        sourceState.x +
        horizontalPadding +
        (distanceFactorFromSource + 1) * boxWidth;
      state.y = sourceState.y + (distanceFactorFromSource + 1) * boxHeight;
    }
    state.width = state.type === flowStateTypes.choice ? boxHeight : boxWidth;
    state.height = boxHeight;
    statesAndPaths.push(state);
    visited.push(currentState.name);
    lastX = state.x;
    lastY = state.y + boxHeight + verticalPadding;
    return state;
  }

  for (const [source, target] of flowStates) {
    let sourceState;
    let targetState;
    if (!visited.includes(source.name) && !prevVisited.includes(source.name)) {
      sourceState = addAction(source);
    } else {
      sourceState =
        statesAndPaths.find((state) => state.name === source.name) ||
        prevStatesAndPaths.find((state) => state.name === source.name);
    }

    if (!visited.includes(target.name) && !prevVisited.includes(target.name)) {
      if ('childPathId' in source && source.childPathId !== -1) {
        const left = source.childPathId % 2 === 0;
        const distanceFactorFromSource = Math.floor(source.childPathId / 2);
        targetState = addAction(
          target,
          sourceState,
          left,
          distanceFactorFromSource
        );
      } else {
        lastX = sourceState ? sourceState.x : lastX;
        lastY = sourceState
          ? sourceState.y + boxHeight + verticalPadding
          : lastY;
        targetState = addAction(target);
      }
    } else {
      targetState =
        statesAndPaths.find((state) => state.name === target.name) ||
        prevStatesAndPaths.find((state) => state.name === target.name);
    }

    if (sourceState && targetState && targetState.type !== 'End') {
      const pathName = `${sourceState.name}-${targetState.name}`;
      if (!visited.includes(pathName) && !prevVisited.includes(pathName)) {
        statesAndPaths.push({
          __flowType: 'path',
          source: sourceState,
          target: targetState,
        });
        visited.push(pathName);
      }
    }

    if ('childPathId' in source && source.childPaths?.length) {
      const subResult = drawChart(
        source.childPaths,
        { x: lastX, y: lastY },
        [...statesAndPaths, ...prevStatesAndPaths],
        [...visited, ...prevVisited]
      );
      statesAndPaths.push(...subResult[0]);
      visited.push(...subResult[1]);
    }
  }
  return [statesAndPaths, visited];
}

function constructFlowChart(statePaths = []) {
  const result = drawChart(
    statePaths,
    { x: Math.floor(window.innerWidth / 2), y: 0 },
    [],
    []
  );
  return result[0];
}

export { constructFlowChart };
