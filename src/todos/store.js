import { configureStore } from "@reduxjs/toolkit";
import totdoReducer from "./todoSlice"

export const store = configureStore({
    reducer:{
        todos:totdoReducer
    }
})
