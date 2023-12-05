import styled from "styled-components";

export interface TodoProps {
  id: Number,
  title: string,
  description: string,
  completed: boolean
}

const Div = styled.div`
  margin: 0;
`

export default function Todo(props: TodoProps) {
  const { title, description, completed } = props;
  return (
    <Div className="todo">
      <input type="checkbox" checked={completed ? true : false}/>
      <span>{ title }</span>
    </Div>
  )
}