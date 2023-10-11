import PropTypes from 'prop-types';

function Line(props) {
  return (
    <g>
      <line
        x1={props.x1}
        y1={props.y1}
        x2={props.x2}
        y2={props.y2}
        stroke={props.stroke}
        strokeWidth={props.strokeWidth}
      ></line>
      <foreignObject
        x={props.x}
        y={props.y}
        width={props.width}
        height={props.height}
      >
        <span>Suresh</span>
      </foreignObject>
    </g>
  );
}

Line.propTypes = {
  x1: PropTypes.number,
  y1: PropTypes.number,
  x2: PropTypes.number,
  y2: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
};

export default Line;
