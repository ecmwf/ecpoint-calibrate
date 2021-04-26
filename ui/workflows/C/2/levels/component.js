import React from 'react'

import { Segment } from 'semantic-ui-react'

import { SortableContainer, SortableElement } from 'react-sortable-hoc'

const SortableItem = SortableElement(({ value }) => (
  <Segment secondary textAlign="center">
    {value}
  </Segment>
))

const SortableList = SortableContainer(({ items }) => (
  <Segment.Group raised size="mini">
    {items.map((value, index) => (
      <SortableItem key={`item-${index}`} index={index} value={value} />
    ))}
  </Segment.Group>
))

const Levels = props => (
  <>
    <h5>Rearrange the levels of the decision tree below:</h5>

    <SortableList
      items={props.fields}
      onSortEnd={({ oldIndex, newIndex }) =>
        props.onFieldsSortEnd(
          props.fields,
          props.thrGridIn,
          props.thrGridOut,
          oldIndex,
          newIndex
        )
      }
    />
    <small>
      <b>⚠️ Caution:</b> Modifying the current arrangement will partially clear the
      threshold breakpoints in the sheet below.
    </small>
  </>
)

export default Levels
