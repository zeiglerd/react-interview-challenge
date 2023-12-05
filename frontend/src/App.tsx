import styled from 'styled-components';
import axios from 'axios';

import Todo, { TodoProps } from './Todo';
import { useState, useEffect } from 'react';

const H1 = styled.h1`
  color: green;
  font-size: 3em;
  margin: 20px auto;
  text-align: center;
`;

const Section = styled.section`
  max-width: 800px;
  margin: 0 auto;
  width: 70%;
`

export default function App() {

  const [data, setData] = useState<TodoProps[]>([]);

  useEffect(() => {
    async function getData() {
      const response = await axios.get('http://localhost:8000/todo');
      setData(response.data);
    }
    getData();
  }, []);

  const renderTodoList = () => {
    return data.map(todo => <Todo title={todo.title} description={todo.description} id={todo.id} completed={todo.completed} />);
  }

  return (
    <div className="App">
      <header className="header">
        <H1>AE Todos</H1>
      </header>
      <Section>
        { renderTodoList() }
      </Section>
    </div>
  );
};
