import { useEffect, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import ZISValidator from '@zis-parser-and-visualizer/parser';

import Box from './components/Box';
// import Line from './components/Line';
import CurvedLine from './components/CurvedLine';

import bundle from './bundle.json';
import './App.css';

import { constructFlowChart } from './utils/helpers';
import { flowStateTypes } from './utils/constants';

function App() {
  const svgRef = useRef(null);
  const [flowStates, setFlowStates] = useState([]);
  useEffect(() => {
    const validator = new ZISValidator(bundle);
    const result = validator.constructStatesFlow();
    console.log('result ', result[0]);
    const paths = constructFlowChart(result[0], { x: 500, y: 500 });
    setFlowStates(paths);
    console.log('paths ', paths);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (svg) {
      // const { width, height } = svg.getBoundingClientRect();
      const { width, height, x, y } = svg.getBBox();
      console.log('width ', width, ' height ', height, 'x', x, 'y', y);
      svg.setAttribute('viewBox', `${x} ${y} ${width} ${height}`);
      svg.setAttribute('width', width);
      svg.setAttribute('height', height);
    }
  }, [flowStates]);

  const testDelta = Math.ceil(Math.sqrt(2 * Math.pow(100, 2))) - 100;
  return (
    <div id='vis-canvas'>
      {/* <TransformWrapper>
        <TransformComponent> */}
      {/* Since SVG is not an instanceOf HTMLElement which draggable supports 
      as a bounding container, moving the id to parent div pasing the same
      in bounds for draggable components*/}
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width={1000}
        height={1000}
        viewBox='0 0 1000 1000'
        overflow={'visible'}
        ref={svgRef}
        // preserveAspectRatio='xMinYMin slice'
      >
        <defs>
          <marker
            id='arrow'
            viewBox='0 0 10 10'
            refX='10'
            refY='5'
            markerWidth='6'
            markerHeight='6'
            orient='auto-start-reverse'
          >
            <path d='M 0 0 L 10 5 L 0 10' />
          </marker>
        </defs>
        {flowStates.map((flowState) => {
          {
            if (flowState.__flowType === 'state') {
              return (
                <Box
                  key={flowState.name}
                  {...flowState}
                  choice={flowState.type === flowStateTypes.choice}
                />
              );
            }
            return (
              <CurvedLine
                key={`${flowState.source.name}-${flowState.target.name}`}
                source={flowState.source}
                target={flowState.target}
              />
            );
          }
        })}
        {/* <Box
          x={0}
          y={0}
          width={150}
          height={100}
          fill='transparent'
          stroke='black'
          strokeWidth={2}
          text='Suresh'
        />
        <Box
          x={0 + testDelta}
          y={175 + testDelta}
          width={100}
          height={100}
          fill='transparent'
          stroke='black'
          strokeWidth={2}
          text='Choice'
          choice={true}
        /> */}
        {/* <Line
          x1={75}
          y1={100}
          x2={75}
          y2={200}
          stroke='black'
          strokeWidth={2}
        /> */}
        {/* <Box
          x={200}
          y={300}
          width={150}
          height={100}
          fill='transparent'
          stroke='black'
          strokeWidth={2}
          text='Sure'
        /> */}
        {/* <CurvedLine rect1={[0, 0, 150, 100]} rect2={[200, 300, 150, 100]} /> */}
      </svg>
      {/* </TransformComponent>
      </TransformWrapper> */}
    </div>
  );
}

export default App;
