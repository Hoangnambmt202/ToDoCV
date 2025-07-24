import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Task } from '@/types/task';

export const useTaskStore = defineStore('task', () => {
  // --- State ---
  const tasks = ref<Task[]>([]);
  const selectedTask = ref<Task | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // --- Getters (dưới dạng computed properties) ---
  const todoTasks = computed(() => tasks.value.filter(task => task.status === 'to-do'));
  const completedTasks = computed(() => tasks.value.filter(task => task.status === 'completed'));
  const getTaskById = computed(() => {
    return (id: number) => tasks.value.find(task => task.id === id);
  });

  // --- Actions (dưới dạng functions) ---
  function setTasks(newTasks: Task[]) {
    tasks.value = newTasks;
  }

  function addTaskToStore(task: Task) {
    tasks.value.push(task);
  }

  function updateTask(updatedTask: Task) {
    const index = tasks.value.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      tasks.value[index] = updatedTask;
    }
  }

  function removeTaskFromStore(taskId: number) {
    tasks.value = tasks.value.filter(task => task.id !== taskId);
    if (selectedTask.value?.id === taskId) {
      selectedTask.value = null;
    }
  }

  function setSelectedTask(task: Task | null) {
    selectedTask.value = task;
  }

  function toggleImportant(taskId: number) {
    const task = tasks.value.find(task => task.id === taskId);
    if (task) {
      task.important = !task.important;
    }
  }

  function setLoading(isLoading: boolean) {
    loading.value = isLoading;
  }

  function setError(errorMessage: string | null) {
    error.value = errorMessage;
  }

  return {
    // State
    tasks,
    selectedTask,
    loading,
    error,
    // Getters
    todoTasks,
    completedTasks,
    getTaskById,
    // Actions
    setTasks,
    addTaskToStore,
    updateTask,
    removeTaskFromStore,
    setSelectedTask,
    toggleImportant,
    setLoading,
    setError,
  };
}, {
  persist: true, // Bật persist cho toàn bộ store
});