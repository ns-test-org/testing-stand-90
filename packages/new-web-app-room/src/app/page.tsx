'use client';

import { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: Date;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('personal');
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const categories = ['personal', 'work', 'shopping', 'health', 'other'];

  const addTodo = () => {
    if (inputText.trim() !== '') {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputText.trim(),
        completed: false,
        category: selectedCategory,
        priority: selectedPriority,
        dueDate: dueDate || undefined,
        createdAt: new Date()
      };
      setTodos([...todos, newTodo]);
      setInputText('');
      setDueDate('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  // Filter todos based on search and filters
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || todo.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Sort todos by priority and due date
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (a.priority !== b.priority) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'work': return '💼';
      case 'personal': return '👤';
      case 'shopping': return '🛒';
      case 'health': return '🏥';
      default: return '📝';
    }
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          Todo App v2 ✨
        </h1>
        
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search todos..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          
          <div className="flex gap-4 flex-wrap">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {getCategoryIcon(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>
        </div>
        
        {/* Add todo form */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What needs to be done?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            
            <div className="flex gap-3 flex-wrap">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {getCategoryIcon(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
              
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              
              <button
                onClick={addTodo}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
              >
                Add Todo
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        {totalCount > 0 && (
          <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
              <div className="text-sm text-blue-800">Total</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <div className="text-sm text-green-800">Completed</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">{totalCount - completedCount}</div>
              <div className="text-sm text-orange-800">Pending</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">
                {todos.filter(t => !t.completed && isOverdue(t.dueDate)).length}
              </div>
              <div className="text-sm text-red-800">Overdue</div>
            </div>
          </div>
        )}

        {/* Todo list */}
        <div className="space-y-3">
          {sortedTodos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {todos.length === 0 ? "No todos yet. Add one above!" : "No todos match your filters."}
            </p>
          ) : (
            sortedTodos.map(todo => (
              <div
                key={todo.id}
                className={`p-4 rounded-lg border transition-all ${
                  todo.completed
                    ? 'bg-gray-50 border-gray-200 opacity-75'
                    : isOverdue(todo.dueDate)
                    ? 'bg-red-50 border-red-200'
                    : 'bg-white border-gray-300 hover:border-purple-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 mt-1"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{getCategoryIcon(todo.category)}</span>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(todo.priority)}`}>
                        {todo.priority.toUpperCase()}
                      </span>
                      {todo.dueDate && (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          isOverdue(todo.dueDate) && !todo.completed
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          📅 {new Date(todo.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    
                    <p className={`text-gray-800 ${
                      todo.completed ? 'line-through text-gray-500' : ''
                    }`}>
                      {todo.text}
                    </p>
                    
                    <div className="text-xs text-gray-500 mt-1">
                      Created: {todo.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete todo"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action buttons */}
        {totalCount > 0 && (
          <div className="mt-6 flex gap-3 flex-wrap">
            {completedCount > 0 && (
              <button
                onClick={() => setTodos(todos.filter(todo => !todo.completed))}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Completed ({completedCount})
              </button>
            )}
            
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('all');
                setFilterPriority('all');
              }}
              className="px-4 py-2 text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
            >
              Clear Filters
            </button>
            
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete all todos?')) {
                  setTodos([]);
                }
              }}
              className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              Delete All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}







