import { useEffect, useRef, useState } from 'react';
import ZISValidator from 'zis-parser';

import Box from './components/Box';
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
    const [isBundleValid, errors] = validator.validate();
    if (isBundleValid) {
      const result = validator.constructStatesFlow();
      console.log('result ', result[0]);
      const paths = constructFlowChart(result[0], { x: 500, y: 500 });
      setFlowStates(paths);
      console.log('paths ', paths);
    } else {
      console.log('errors ', errors);
    }
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (svg) {
      // const { width, height } = svg.getBoundingClientRect();
      const { width, height, x, y } = svg.getBBox();
      // console.log('width ', width, ' height ', height, 'x', x, 'y', y);
      svg.setAttribute('viewBox', `${x} ${y} ${width} ${height}`);
      svg.setAttribute('width', width);
      svg.setAttribute('height', height);
    }
  }, [flowStates]);

  return (
    <div id='vis-canvas'>
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
            <path d='M 0 0 L 10 5 L 0 10 z' />
          </marker>
        </defs>
        {flowStates.map((flowState) => {
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
        })}
      </svg>
    </div>
  );
}

export default App;
