import { useEffect, useState } from "react";

function TodoForm({ addTodo, updateTodo, editingTodo }) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (editingTodo) {
      setText(editingTodo.text);
    }
  }, [editingTodo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (editingTodo) {
      updateTodo({ ...editingTodo, text });
    } else {
      addTodo(text);
    }

    setText("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Digite o nome da tarefa..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button type="submit">
        {editingTodo ? "Editar" : "Criar"}
      </button>
    </form>
  );
}

export default TodoForm;
