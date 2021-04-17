import React from 'react'

const PureSvgNodeElement = ({ nodeDatum, toggleNode, onNodeClick }) => {
  const svgShapeProps =
    nodeDatum.children.length === 0
      ? {
          stroke: nodeDatum.nodeSvgShape?.shapeProps?.stroke,
          fill: 'white',
          strokeWidth: '3',
        }
      : {}

  return (
    <>
      <circle r={10} onClick={toggleNode} {...svgShapeProps}></circle>
      <g className="rd3t-label">
        <text className="rd3t-label__title" onClick={onNodeClick}>
          <tspan x="20" fontSize="smaller">
            {nodeDatum.name}
          </tspan>
          <tspan x="20" dy="1.2em" fontSize="smaller">
            {nodeDatum.meta.code && 'WT ' + nodeDatum.meta.code}
          </tspan>
        </text>
      </g>
    </>
  )
}

export default PureSvgNodeElement
