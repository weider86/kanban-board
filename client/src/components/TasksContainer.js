import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Link } from "react-router-dom";
import socketIO from "socket.io-client";


const socket = socketIO.connect("http://localhost:4000");


const TasksContainer = () => {
    const [tasks, setTasks] = useState({});

    const handleDragEnd = ({ destination, source }) => {
        if (!destination) return;
        if (
            destination.index === source.index &&
            destination.droppableId === source.droppableId
        )
            return;
    
        socket.emit("taskDragged", {
            source,
            destination,
        });
    };

    useEffect(() => {
		function fetchTasks() {
			fetch("http://localhost:4000/api")
				.then((res) => res.json())
				.then((data) => setTasks(data));
		}
		fetchTasks();
	}, []);

	useEffect(() => {
		socket.on("tasks", (data) => {
			setTasks(data);
		});
	}, [socket]);

    return (
        <div className='container'>
        <DragDropContext onDragEnd={handleDragEnd}>
            {Object.entries(tasks).map((task) => (
                <div
                    className={`${task[1].title.toLowerCase()}__wrapper`}
                    key={task[1].title}
                >
                    <h3>{task[1].title} Tasks</h3>
                    <div className={`${task[1].title.toLowerCase()}__container`}>
                        <Droppable droppableId={task[1].title}>
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                    {task[1].items.map((item, index) => (
                                         
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`${task[1].title.toLowerCase()}__items`}
                                                >
                                                    <p>{item.title}</p>
                                                    <p className='comment'>
                                                        <Link to={`/comments/${task[1].title}/${item.id}`}>
                                                            {item.comments.length > 0
                                                                ? `View Comments`
                                                                : "Add Comment"}
                                                        </Link>
                                                    </p>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                </div>
            ))}
        </DragDropContext>
    </div>
    )
};

export default TasksContainer;