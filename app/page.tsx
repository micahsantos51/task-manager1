"use client";

import { useState, useEffect } from "react";
import React from "react";

export default function Home() {
  const [tasks, setTasks] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetch("api/tasks")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json(); // built-in parsing
      })
      .then(setTasks)
      .catch((err) => {
        console.error("Error fetching tasks: ", err);
      });
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ text: newTask }), 
      headers: { "Content-Type": "application/json" },
    });
    const newTaskData = await res.json();
    setTasks([...tasks, newTaskData]);
    setNewTask("");
  }


  const toggleTask = async (id: string, completed: boolean) => {
    const res = await fetch("api/tasks", {
      method: "PUT",
      body: JSON.stringify({ id, completed: !completed }),
      headers: { "Content-Type": "application/json" },
    });
    const updatedTask = await res.json();
    setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
  };

  const deleteTask = async (id: string) => {
    await fetch("api/tasks", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    });
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <main className="max-w-md mx-auto mt-10 p-5 border rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>

      {/* Input for new tasks */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border p-2 flex-1 rounded md"
          placeholder="Enter a task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={addTask}
        >Add</button>
      </div >

      {/*Task List */}
      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center border-b py-2"
          >
            <span
              className={`cursor-pointer ${task.completed ? "line-through text-gray-500" : ""
                }`}
              onClick={() => toggleTask(task.id, task.completed)}
            >
              {task.text}
            </span>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded-md"
              onClick={() => deleteTask(task.id)}
            >Delete
            </button>
          </li>
        ))}
      </ul>

    </main >
  );
}