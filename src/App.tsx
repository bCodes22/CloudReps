import React, { useState } from 'react';
import { LogIn, Plus, Check, Trash2, LogOut, ChevronDown, ChevronRight, Dumbbell, Edit2, Calendar as CalendarIcon, Save } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  distance?: number;
  duration?: number;
  completed: boolean;
  isEditing?: boolean;
  tempValues?: {
    sets: number;
    reps: number;
    weight: number;
    duration: number;
  };
}

interface WorkoutDay {
  id: string;
  name: string;
  day: string;
  exercises: Exercise[];
  isExpanded: boolean;
}

interface User {
  email: string;
  password: string;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([
    {
      id: '1',
      name: 'Upper Body',
      day: 'Monday',
      exercises: [],
      isExpanded: false
    },
    {
      id: '2',
      name: 'Lower Body',
      day: 'Wednesday',
      exercises: [],
      isExpanded: false
    },
    {
      id: '3',
      name: 'Full Body',
      day: 'Friday',
      exercises: [],
      isExpanded: false
    }
  ]);
  const [newExercise, setNewExercise] = useState('');
  const [isAddingDay, setIsAddingDay] = useState(false);
  const [newDayName, setNewDayName] = useState('');
  const [newDayOfWeek, setNewDayOfWeek] = useState('');
  const [editingDay, setEditingDay] = useState<WorkoutDay | null>(null);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials or user does not exist. Please sign up first.');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    
    if (users.some(u => u.email === email)) {
      alert('User already exists. Please login instead.');
      return;
    }

    setUsers([...users, { email, password }]);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const toggleDayExpansion = (dayId: string) => {
    setWorkoutDays(workoutDays.map(day =>
      day.id === dayId ? { ...day, isExpanded: !day.isExpanded } : day
    ));
  };

  const addDay = () => {
    if (!newDayName || !newDayOfWeek) return;

    const newDay: WorkoutDay = {
      id: Date.now().toString(),
      name: newDayName,
      day: newDayOfWeek,
      exercises: [],
      isExpanded: false
    };

    setWorkoutDays([...workoutDays, newDay]);
    setNewDayName('');
    setNewDayOfWeek('');
    setIsAddingDay(false);
  };

  const startEditingDay = (day: WorkoutDay) => {
    setEditingDay(day);
    setNewDayName(day.name);
    setNewDayOfWeek(day.day);
  };

  const saveEditDay = () => {
    if (!editingDay || !newDayName || !newDayOfWeek) return;

    setWorkoutDays(workoutDays.map(day =>
      day.id === editingDay.id
        ? { ...day, name: newDayName, day: newDayOfWeek }
        : day
    ));

    setEditingDay(null);
    setNewDayName('');
    setNewDayOfWeek('');
  };

  const deleteDay = (dayId: string) => {
    setWorkoutDays(workoutDays.filter(day => day.id !== dayId));
  };

  const addExercise = (e: React.FormEvent, dayId: string) => {
    e.preventDefault();
    if (!newExercise.trim()) return;
    
    const exercise: Exercise = {
      id: Date.now().toString(),
      name: newExercise.trim(),
      sets: 3,
      reps: 12,
      weight: 0,
      duration: 0,
      distance: 0,
      completed: false,
      isEditing: false,
      tempValues: {
        sets: 3,
        reps: 12,
        weight: 0,
        duration: 0
      }
    };
    
    setWorkoutDays(workoutDays.map(day =>
      day.id === dayId
        ? { ...day, exercises: [...day.exercises, exercise] }
        : day
    ));
    setNewExercise('');
  };

  const startEditingExercise = (dayId: string, exerciseId: string) => {
    setWorkoutDays(workoutDays.map(day =>
      day.id === dayId
        ? {
            ...day,
            exercises: day.exercises.map(exercise =>
              exercise.id === exerciseId
                ? {
                    ...exercise,
                    isEditing: true,
                    tempValues: {
                      sets: exercise.sets,
                      reps: exercise.reps,
                      weight: exercise.weight || 0,
                      duration: exercise.duration || 0
                    }
                  }
                : exercise
            )
          }
        : day
    ));
  };

  const updateTempValues = (dayId: string, exerciseId: string, field: string, value: number) => {
    setWorkoutDays(workoutDays.map(day =>
      day.id === dayId
        ? {
            ...day,
            exercises: day.exercises.map(exercise =>
              exercise.id === exerciseId && exercise.tempValues
                ? {
                    ...exercise,
                    tempValues: {
                      ...exercise.tempValues,
                      [field]: value
                    }
                  }
                : exercise
            )
          }
        : day
    ));
  };

  const saveExercise = (dayId: string, exerciseId: string) => {
    setWorkoutDays(workoutDays.map(day =>
      day.id === dayId
        ? {
            ...day,
            exercises: day.exercises.map(exercise =>
              exercise.id === exerciseId && exercise.tempValues
                ? {
                    ...exercise,
                    sets: exercise.tempValues.sets,
                    reps: exercise.tempValues.reps,
                    weight: exercise.tempValues.weight,
                    duration: exercise.tempValues.duration,
                    isEditing: false
                  }
                : exercise
            )
          }
        : day
    ));
  };

  const cancelEditExercise = (dayId: string, exerciseId: string) => {
    setWorkoutDays(workoutDays.map(day =>
      day.id === dayId
        ? {
            ...day,
            exercises: day.exercises.map(exercise =>
              exercise.id === exerciseId
                ? { ...exercise, isEditing: false }
                : exercise
            )
          }
        : day
    ));
  };

  const toggleExercise = (dayId: string, exerciseId: string) => {
    setWorkoutDays(workoutDays.map(day =>
      day.id === dayId
        ? {
            ...day,
            exercises: day.exercises.map(exercise =>
              exercise.id === exerciseId
                ? { ...exercise, completed: !exercise.completed }
                : exercise
            )
          }
        : day
    ));
  };

  const deleteExercise = (dayId: string, exerciseId: string) => {
    setWorkoutDays(workoutDays.map(day =>
      day.id === dayId
        ? {
            ...day,
            exercises: day.exercises.filter(exercise => exercise.id !== exerciseId)
          }
        : day
    ));
  };

  const calendarEvents = workoutDays.map(day => ({
    title: `${day.name} (${day.exercises.length} exercises)`,
    daysOfWeek: [daysOfWeek.indexOf(day.day)],
    backgroundColor: day.exercises.every(ex => ex.completed) ? '#10B981' : '#6366F1'
  }));

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <Dumbbell size={40} className="text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Workout Planner</h1>
          
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setIsSignUp(false)}
              className={`px-4 py-2 rounded-md transition-colors ${!isSignUp ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}
            >
              Login
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`px-4 py-2 rounded-md transition-colors ${isSignUp ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>
            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Dumbbell size={32} className="text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-800">Weekly Workout Plan</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsAddingDay(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                Add Day
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          </div>

          {(isAddingDay || editingDay) && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">
                {editingDay ? 'Edit Workout Day' : 'Add New Workout Day'}
              </h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newDayName}
                  onChange={(e) => setNewDayName(e.target.value)}
                  placeholder="Workout name"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <select
                  value={newDayOfWeek}
                  onChange={(e) => setNewDayOfWeek(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select day</option>
                  {daysOfWeek.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <button
                  onClick={editingDay ? saveEditDay : addDay}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  {editingDay ? 'Save' : 'Add'}
                </button>
                <button
                  onClick={() => {
                    setIsAddingDay(false);
                    setEditingDay(null);
                    setNewDayName('');
                    setNewDayOfWeek('');
                  }}
                  className="text-gray-600 hover:text-gray-800 px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {workoutDays.map(day => (
              <div
                key={day.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 bg-gray-50">
                  <div
                    className="flex items-center gap-2 cursor-pointer flex-1"
                    onClick={() => toggleDayExpansion(day.id)}
                  >
                    {day.isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    <h2 className="text-lg font-semibold">{day.day} - {day.name}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {day.exercises.length} exercises
                    </span>
                    <button
                      onClick={() => startEditingDay(day)}
                      className="text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => deleteDay(day.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {day.isExpanded && (
                  <div className="p-4 border-t border-gray-200">
                    <form onSubmit={(e) => addExercise(e, day.id)} className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newExercise}
                        onChange={(e) => setNewExercise(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Add new exercise..."
                      />
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
                      >
                        <Plus size={20} />
                        Add
                      </button>
                    </form>

                    <div className="space-y-2">
                      {day.exercises.map(exercise => (
                        <div
                          key={exercise.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <button
                            onClick={() => toggleExercise(day.id, exercise.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              exercise.completed
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300 hover:border-green-500'
                            }`}
                          >
                            {exercise.completed && <Check size={16} className="text-white" />}
                          </button>
                          <div className="flex-1">
                            <span className={`${exercise.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                              {exercise.name}
                            </span>
                            <div className="grid grid-cols-4 gap-2 mt-2">
                              <div className="flex flex-col">
                                <label className="text-xs text-gray-500">Sets</label>
                                <input
                                  type="number"
                                  value={exercise.isEditing ? exercise.tempValues?.sets : exercise.sets}
                                  onChange={(e) => updateTempValues(day.id, exercise.id, 'sets', parseInt(e.target.value) || 0)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                                  min="0"
                                  onClick={() => !exercise.isEditing && startEditingExercise(day.id, exercise.id)}
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-xs text-gray-500">Reps</label>
                                <input
                                  type="number"
                                  value={exercise.isEditing ? exercise.tempValues?.reps : exercise.reps}
                                  onChange={(e) => updateTempValues(day.id, exercise.id, 'reps', parseInt(e.target.value) || 0)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                                  min="0"
                                  onClick={() => !exercise.isEditing && startEditingExercise(day.id, exercise.id)}
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-xs text-gray-500">Weight (lbs)</label>
                                <input
                                  type="number"
                                  value={exercise.isEditing ? exercise.tempValues?.weight : exercise.weight}
                                  onChange={(e) => updateTempValues(day.id, exercise.id, 'weight', parseInt(e.target.value) || 0)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                                  min="0"
                                  onClick={() => !exercise.isEditing && startEditingExercise(day.id, exercise.id)}
                                />
                              </div>
                              <div className="flex flex-col">
                                <label className="text-xs text-gray-500">Duration (min)</label>
                                <input
                                  type="number"
                                  value={exercise.isEditing ? exercise.tempValues?.duration : exercise.duration}
                                  onChange={(e) => updateTempValues(day.id, exercise.id, 'duration', parseInt(e.target.value) || 0)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                                  min="0"
                                  onClick={() => !exercise.isEditing && startEditingExercise(day.id, exercise.id)}
                                />
                              </div>
                            </div>
                            {exercise.isEditing && (
                              <div className="flex justify-end gap-2 mt-2">
                                <button
                                  onClick={() => saveExercise(day.id, exercise.id)}
                                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors flex items-center gap-1 text-sm"
                                >
                                  <Save size={16} />
                                  Save
                                </button>
                                <button
                                  onClick={() => cancelEditExercise(day.id, exercise.id)}
                                  className="text-gray-600 hover:text-gray-800 px-3 py-1 text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => deleteExercise(day.id, exercise.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))}
                      {day.exercises.length === 0 && (
                        <p className="text-center text-gray-500 py-4">
                          No exercises added yet. Add one to get started!
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon size={24} className="text-indigo-600" />
              <h2 className="text-xl font-semibold">Weekly Schedule</h2>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridWeek"
                headerToolbar={false}
                events={calendarEvents}
                height="auto"
                dayHeaderFormat={{ weekday: 'long' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;