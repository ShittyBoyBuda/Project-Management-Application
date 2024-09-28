import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

interface Task {
  id: number;
  title: string;
  description: string;
  projectId: number;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};


export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (projectId: number) => {
  const response = await axios.get(`http://localhost:3000/tasks/${projectId}`);
  return response.data;
});


export const addTask = createAsyncThunk(
  'tasks/addTask',
  async ({ title, description, projectId }: { title: string; description: string; projectId: number }) => {
    const response = await axios.post(`http://localhost:3000/tasks`, {
      title,
      description,
      projectId,
    });
    return response.data; 
  }
);


export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, title, description, completed }: { id: number; title: string; description: string; completed: boolean }) => {
    const response = await axios.put(`http://localhost:3000/tasks/${id}`, {
      title,
      description,
      completed,
    });
    return response.data;
  }
);


export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId: number) => {
  await axios.delete(`http://localhost:3000/tasks/${taskId}`);
  return taskId;
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Получение задач
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch tasks';
      })
      
      // Добавление задачи
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(addTask.rejected, (state) => {
        state.error = 'Failed to add task';
      })

      // Обновление задачи
      .addCase(updateTask.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        const index = state.tasks.findIndex((task) => task.id === updatedTask.id);
        if (index !== -1) {
          state.tasks[index] = updatedTask; 
        }
      })

      // Удаление задачи
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload); // Удаляем задачу из списка
        state.loading = false;
      })
      .addCase(deleteTask.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to delete task';
      });
  },
});

export default taskSlice.reducer;
