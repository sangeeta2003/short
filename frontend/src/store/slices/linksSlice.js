import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock data for development
const mockLinks = [
  {
    _id: '1',
    originalUrl: 'https://example.com',
    shortUrl: 'http://localhost:3000/abc123',
    clicks: 0,
    createdAt: new Date().toISOString(),
  }
];

export const fetchLinks = createAsyncThunk(
  'links/fetchLinks',
  async () => {
    // For development, return mock data
    return mockLinks;
  }
);

export const createLink = createAsyncThunk(
  'links/createLink',
  async (linkData) => {
    // For development, create mock link
    const mockLink = {
      _id: Date.now().toString(),
      ...linkData,
      clicks: 0,
      createdAt: new Date().toISOString(),
    };
    mockLinks.push(mockLink);
    return mockLink;
  }
);

const linksSlice = createSlice({
  name: 'links',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLinks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLinks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchLinks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createLink.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default linksSlice.reducer; 