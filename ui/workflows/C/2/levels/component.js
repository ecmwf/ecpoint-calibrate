import React from 'react'

import { Segment, Button, Icon } from 'semantic-ui-react'

import { SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc'

const DragHandle = sortableHandle(() => <Icon name="bars" style={{ cursor: 'move' }} />)

const SortableItem = SortableElement(({ value, showDelete, onDelete }) => (
  <Segment secondary>
    <DragHandle />
    {value}
    {
      <Button
        circular
        icon="close"
        floated="right"
        size="mini"
        style={{ transform: 'translate(0, -15%)' }}
        disabled={!showDelete}
        onClick={onDelete}
      />
    }
  </Segment>
))

const SortableList = SortableContainer(
  ({
    items,
    breakpoints,
    labels,
    fieldRanges,
    setFields,
    setBreakpoints,
    addExcludedPredictor,
  }) => (
    <Segment.Group raised size="mini" style={{ width: '20%' }}>
      {items.map((value, index) => (
        <SortableItem
          key={`item-${index}`}
          index={index}
          value={value}
          showDelete={index === items.length - 1}
          onDelete={() => {
            setFields(items.slice(0, -1))

            const matrix = breakpoints
              .map(row => _.flatMap(row.slice(1)))
              .map(row => row.slice(0, -2))
            const newLabels = labels.slice(0, -2)

            const excludePredictor = labels.slice(-2)[0].replace('_thrL', '')
            addExcludedPredictor(excludePredictor)
            setBreakpoints(newLabels, matrix, fieldRanges)
          }}
        />
      ))}
    </Segment.Group>
  )
)

const Levels = props => {
  return (
    <>
      <h5>Rearrange the levels of the decision tree below:</h5>

      <SortableList
        items={props.fields}
        setFields={props.setFields}
        setBreakpoints={props.setBreakpoints}
        addExcludedPredictor={props.addExcludedPredictor}
        fieldRanges={props.fieldRanges}
        breakpoints={props.thrGridOut}
        labels={props.labels}
        onSortEnd={({ oldIndex, newIndex }) =>
          props.onFieldsSortEnd(
            props.fields,
            props.thrGridIn,
            props.thrGridOut,
            oldIndex,
            newIndex,
            props.fieldRanges
          )
        }
        useDragHandle
      />
      <small>
        <b>⚠️ Caution:</b> Modifying the current arrangement will partially clear the
        threshold breakpoints in the sheet below.
      </small>
    </>
  )
}

export default Levels
