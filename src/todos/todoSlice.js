import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { commonApi } from "../../api";
import axios from "axios";

const initialState = {
  boards: [],
  loading: false,
  error: null,
};

// Fetch all boards with tasks from the backend
export const fetchBoards = createAsyncThunk('tasks/fetchBoards', async () => {
  const response = await axios.get(`${commonApi}/api/boards/allboards`);
  return response.data;
});

// Create a new board
export const createBoard = createAsyncThunk(
  'tasks/createBoard',
  async (newBoardName) => {
    const response = await axios.post(`${commonApi}/api/boards/createboards`, { name: newBoardName });
    return response.data;
  }
);

// Delete a board
export const deleteBoard = createAsyncThunk(
  'tasks/deleteBoard',
  async (boardId) => {
    await axios.delete(`${commonApi}/api/boards/${boardId}`);
    return boardId;
  }
);

// Get a single board
export const getBoard = createAsyncThunk('tasks/getBoard', async (id) => {
  const response = await axios.get(`${commonApi}/api/boards/${id}`);
  return response.data; // return the fetched board data
});

// Create a new task in a specific board
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async ({ boardId, task }) => {
    const response = await axios.post(`${commonApi}/api/tasks/${boardId}/addtask`, { boardId, task });
    return response.data; // return the created task data
  }
);

// Update task status
export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ boardId, taskId, status }) => {
    await axios.put(`${commonApi}/api/boards/${boardId}/tasks/${taskId}`, { status });
    return { boardId, taskId, status }; // return data for further processing
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchBoards action
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Handle createBoard action
      .addCase(createBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.boards.push(action.payload);
      })
      .addCase(createBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Handle deleteBoard action
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.boards = state.boards.filter((board) => board.id !== action.payload);
      })
      // Handle getBoard action
      .addCase(getBoard.fulfilled, (state, action) => {
        const existingBoard = state.boards.find(board => board.id === action.payload.id);
        if (!existingBoard) {
          state.boards.push(action.payload); // Add the fetched board if not already in state
        }
      })
      // Handle createTask action
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        const { boardId } = action.meta.arg;
        const board = state.boards.find((b) => b.id === boardId);
        if (board) {
          // Assume tasks are in the first column (To do)
          board.columns[0].tasks.push(action.payload);
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Handle updateTaskStatus action
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const { boardId, taskId, status } = action.payload;
        const board = state.boards.find((b) => b.id === boardId);
        if (board) {
          // Remove task from current columns
          for (const column of board.columns) {
            column.tasks = column.tasks.filter((t) => t.id !== taskId);
          }
          // Add task to the new column based on status
          const targetColumn = board.columns.find(col => col.id === status);
          if (targetColumn) {
            targetColumn.tasks.push({ id: taskId, status }); // Assuming the task still needs its ID
          }
        }
      });
  },
});

export default todoSlice.reducer;
