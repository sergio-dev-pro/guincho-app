function TodoList({ todos, onEdit, onDelete, onToggle }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id} className={todo.completed ? "done" : ""}>
          <span onClick={() => onToggle(todo.id)}>
            {todo.text}
          </span>

          <div>
            <button onClick={() => onEdit(todo)}>Editar</button>
            <button onClick={() => onDelete(todo.id)}>Remover</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TodoList;
