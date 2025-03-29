import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session'; 
import { combineReducers } from 'redux';
import timerReducer from './timerSlice';

  
const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  timer: timerReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 