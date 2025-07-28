// src/stores/category.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<string[]>([]);
  const taskCategories = ref<Record<number, string[]>>({});

  const setCategoriesFromTasks = (tasks: any[]) => {
    const categorySet = new Set<string>();
    const taskCategoryMap: Record<number, string[]> = {};

    tasks.forEach(task => {
      task.categories?.forEach((cat: string) => categorySet.add(cat));
      taskCategoryMap[task.id] = task.categories || [];
    });

    categories.value = Array.from(categorySet);
    taskCategories.value = taskCategoryMap;
  };

  const getCategoriesForTask = (taskId: number) => {
    return taskCategories.value[taskId] || [];
  };

  const addCategory = (newCat: string) => {
    if (!categories.value.includes(newCat)) {
      categories.value.push(newCat);
    }
  };

  return {
    categories,
    taskCategories,
    setCategoriesFromTasks,
    getCategoriesForTask,
    addCategory,
  };
});
