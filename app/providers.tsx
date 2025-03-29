'use client'
import { ReactNode, useEffect } from "react";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import { syncTimer, loadSavedData } from './store/timerSlice';
import { useSelector } from "react-redux";
import { RootState } from "./store/store";

function InitialDataLoader() {
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem('studySessions');
      const savedData = localStorage.getItem('studyData');
      
      if (savedSessions && savedData) {
        const sessions = JSON.parse(savedSessions);
        const data = JSON.parse(savedData);
        
        store.dispatch(loadSavedData({ sessions, data }));
        console.log("Dados carregados do localStorage:", { sessions, data });
      }
    } catch (error) {
      console.error("Erro ao carregar dados salvos:", error);
    }
  }, []);
  
  return null;
}


function TimerSynchronizer() {
  const isRunning = useSelector((state: RootState) => state.timer?.isRunning);
  
  useEffect(() => {
    if (isRunning) {
      store.dispatch(syncTimer(true));
    }
    
    const syncInterval = setInterval(() => {
      if (isRunning) {
        store.dispatch(syncTimer());
      }
    }, 1000);
    
    return () => {
      clearInterval(syncInterval);
    };
  }, [isRunning]);
  
  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <InitialDataLoader />
        <TimerSynchronizer />
        {children}
      </PersistGate>
    </Provider>
  );
} 