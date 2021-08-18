import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const unorderedList = [
    {
        id: '1',
        name: 'a.) He travelled 250,000 miles a year.',
    },
    {
        id: '2',
        name: 'b.) His father died.',
    },
    {
        id: '3',
        name: 'c.) He became the manager of a service station.',
    },
    {
        id: '4',
        name: 'd.) He sold the KFC business.',
    },
    {
        id: '5',
        name: 'e.) He developed his secret chicken recipe.',
    },
    {
        id: '6',
        name: 'f.) He learned to cook.',
    }
]

function DragAndDropType(props) {
    const [elements, updateElements] = useState(unorderedList);

    function handleOnDragEnd(result) {
        if (!result.destination) return;

        const items = Array.from(elements);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        updateElements(items);
        console.log(items);
    }

    return (
        <div>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="Elements">
                    {(provided) => (
                        <ul className="draggable" {...provided.droppableProps} ref={provided.innerRef}>
                            {elements.map(({id, name}, index) => {
                                return (
                                    <Draggable key={id} draggableId={id} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <p>
                                                    { name }
                                                </p>
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}

export default DragAndDropType;
