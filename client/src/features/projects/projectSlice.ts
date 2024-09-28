import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Project {
  id: number;
  title: string;
  description?: string;
  userId: number;
}

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
};


export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (token: string) => {
    const response = await axios.get('http://localhost:3000/projects', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);


export const createProject = createAsyncThunk(
  'projects/createProject',
  async ({ title, token }: { title: string; token: string }) => {
    const response = await axios.post('http://localhost:3000/projects', { title }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);


export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, title, description, token }: { id: number; title: string; description?: string; token: string }) => {
    const response = await axios.put(`http://localhost:3000/projects/${id}`, { title, description }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);


export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id: number, { getState }) => {
    const state = getState() as { auth: { token: string } };
      await axios.delete(`http://localhost:3000/projects/${id}`, {
      headers: { Authorization: `Bearer ${state.auth.token}` },
    });
    return id;
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки проектов';
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(project => project.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(project => project.id !== action.payload);
      });
  },
});

export default projectSlice.reducer;
