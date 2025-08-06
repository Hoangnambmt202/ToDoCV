import { ref } from 'vue';
import { defineStore } from 'pinia';
type Category = {
  id: number;
  name: string;
  task_ids: number[];
};

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([]); // 🟢 Đúng kiểu dữ liệu

  const getCategoriesForTask = (taskId: number): string[] => {
   
    const filtered = categories.value.filter(cat => cat.task_ids.includes(taskId));
    const names = filtered.map(cat => cat.name);
    return names;
  };

  const setCategories = (newCategories: typeof categories.value) => {
    categories.value = newCategories;
  };

  return {
    categories,
    getCategoriesForTask,
    setCategories
  };
});
