import { useRef } from 'react';

import Draggable from 'react-draggable';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledObject = styled.foreignObject`
  cursor: pointer;
`;

function Circle(props) {
  const rectRef = useRef(null);
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
        fill={props.fill}
        stroke={props.stroke}
        rx={4}
        ry={4}
        strokeWidth={props.strokeWidth}
      ></rect>
      <StyledObject
        x={props.x}
        y={props.y}
        width={props.width}
        height={props.height}
      >
        <div className='grid-center'>
          <span>{props.text}</span>
        </div>
      </StyledObject>
    </g>
    // </Draggable>
  );
}

Circle.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  text: PropTypes.string,
  choice: PropTypes.bool,
};

export default Circle;
