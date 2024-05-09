import { createSlice } from '@reduxjs/toolkit';

export const clientSlice = createSlice({
    name: 'client',
    initialState: {
        dataNew: [],
        hidden: false,
        dataConversation: {}
    },
    reducers: {
        messDataNew: (state, action) => {
            state.dataNew = action.payload;
        },
        setHidden: (state, action) => {
            state.hidden = !state.hidden
        },
        setConversation: (state, action) => {
            state.dataConversation = state.payload
        }
    },
});

export const { messDataNew, setHidden, setConversation } = clientSlice.actions;
export default clientSlice.reducer;
