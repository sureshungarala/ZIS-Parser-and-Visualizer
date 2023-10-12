import { useRef } from 'react';

import Draggable from 'react-draggable';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledObject = styled.foreignObject`
  cursor: pointer;
`;

function Box(props) {
  const rectRef = useRef(null);
  let delta = 0;
  if (props.choice) {
    delta = Math.ceil(Math.sqrt(2 * Math.pow(props.width, 2))) - props.width;
  }
  return (
    // <Draggable bounds='#vis-canvas' nodeRef={rectRef}>
    <g
      ref={rectRef}
      className={['box', props.choice ? 'rotate' : ''].join(' ')}
    >
      <rect
        x={props.x}
        y={props.y}
        width={props.width}
        height={props.height}
        fill={props.fill ?? 'transparent'}
        stroke={props.stroke ?? 'black'}
        rx={4}
        ry={4}
        strokeWidth={props.strokeWidth ?? 2}
      ></rect>
      <StyledObject
        x={props.x + delta / 2}
        y={props.y + delta / 2}
        width={props.width - delta}
        height={props.height - delta}
      >
        <div className='grid-center' title={props.name}>
          <span>{props.name}</span>
        </div>
      </StyledObject>
    </g>
    // </Draggable>
  );
}

Box.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  name: PropTypes.string,
  choice: PropTypes.bool,
};

export default Box;
