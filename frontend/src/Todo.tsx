import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from 'axios';

export interface TodoProps {
  id: Number,
  title: string,
  description: string,
  completed: boolean
}

const Div = styled.div`
  margin: 10px 0;
`

const TitleInput = styled.input`
  margin-left: 10px;
  border: none;
  font-size: 1em;

  &:focus {
    outline: none;
    border-bottom: 1px solid black;
  }
`

export default function Todo(props: TodoProps) {
  const [ title, setTitle ] = useState(props.title);
  const [ description, setDescription ] = useState(props.description);
  const [ completed, setCompleted ] = useState(props.completed);

  useEffect(() => {
    async function updateTodo() {
      await axios.put(`http://localhost:8000/todo/${props.id}`, {
        title: title,
        description: description,
        completed: completed
      });
    }
    updateTodo();
  }, [title, description, completed, props.id]);

  const handleCheck = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompleted(!completed);
  }

  const handleTitleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  }

  return (
    <Div className="todo">
      <input type="checkbox" checked={completed ? true : false} onChange={handleCheck} />
      <TitleInput value={title} onChange={handleTitleChange} />
    </Div>
  )
}