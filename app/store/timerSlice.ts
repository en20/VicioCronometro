import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type StudySession = {
    id: string;
    discipline: string;
    topic: string;
    duration: number; 
    date: string;
};

export type StudyData = {
    [key: string]: { 
        totalTime: number;
        topics: {
            [key: string]: number; 
        };
    };
};

interface TimerState {
    isRunning: boolean;
    time: number;
    discipline: string;
    topic: string;
    customDiscipline: string;
    customTopic: string;
    showCustomDiscipline: boolean;
    showCustomTopic: boolean;
    studySessions: StudySession[];
    studyData: StudyData;
    lastUpdated: number | null;
}

const initialState: TimerState = {
    isRunning: false,
    time: 0,
    discipline: '',
    topic: '',
    customDiscipline: '',
    customTopic: '',
    showCustomDiscipline: false,
    showCustomTopic: false,
    studySessions: [],
    studyData: {},
    lastUpdated: null
};

export const timerSlice = createSlice({
    name: 'timer',
    initialState,
    reducers: {
        startTimer: (state) => {
            if (state.discipline && (state.topic || state.customTopic)) {
                state.isRunning = true;
                state.lastUpdated = Date.now();
            }
        },
        pauseTimer: (state) => {
            state.isRunning = false;
        },
        resetTimer: (state) => {
            state.isRunning = false;
            state.time = 0;
        },
        incrementTimer: (state, action: PayloadAction<number | undefined>) => {
            const increment = action.payload || 1; 
            
            if (state.isRunning) {
                state.time += increment;
                state.lastUpdated = Date.now();
            }
        },
        syncTimer: (state, action: PayloadAction<boolean | undefined>) => {
            const forceSync = action.payload;
            
            if (state.isRunning || forceSync) {
                if (state.lastUpdated) {
                    const now = Date.now();
                    const elapsed = (now - state.lastUpdated) / 1000; 
                    if (elapsed > 0) {
                        state.time += elapsed;
                        state.lastUpdated = now;
                        console.log("Timer sincronizado, adicionado:", elapsed, "segundos. Tempo total:", state.time);
                    }
                } else {
                    state.lastUpdated = Date.now();
                    console.log("Timer inicializado com timestamp");
                }
            }
        },
        setTime: (state, action: PayloadAction<number>) => {
            state.time = action.payload;
        },
        setDiscipline: (state, action: PayloadAction<string>) => {
            state.discipline = action.payload;
            state.topic = '';
            state.showCustomDiscipline = action.payload === 'Outro';
        },
        setTopic: (state, action: PayloadAction<string>) => {
            state.topic = action.payload;
            state.showCustomTopic = action.payload === 'Outro';
        },
        setCustomDiscipline: (state, action: PayloadAction<string>) => {
            state.customDiscipline = action.payload;
        },
        setCustomTopic: (state, action: PayloadAction<string>) => {
            state.customTopic = action.payload;
        },
        addStudySession: (state, action: PayloadAction<StudySession>) => {
            state.studySessions.push(action.payload);
            
            const { discipline, topic, duration } = action.payload;
            
            if (!state.studyData[discipline]) {
                state.studyData[discipline] = {
                    totalTime: 0,
                    topics: {}
                };
            } 
            
           
            state.studyData[discipline].totalTime += duration;
            
            
            if (!state.studyData[discipline].topics[topic]) {
                state.studyData[discipline].topics[topic] = 0;
            }
            
            
            state.studyData[discipline].topics[topic] += duration;
            
           
            console.log("Estado atualizado depois de addStudySession:", 
                JSON.stringify({
                    sessions: state.studySessions,
                    data: state.studyData
                }, null, 2)
            );
        },
        loadSavedData: (state, action: PayloadAction<{sessions: StudySession[], data: StudyData}>) => {
            state.studySessions = action.payload.sessions;
            state.studyData = action.payload.data;
        },
        clearAllData: (state) => {
            state.studySessions = [];
            state.studyData = {};
        }
    },
});

export const { 
    startTimer, 
    pauseTimer, 
    resetTimer, 
    incrementTimer, 
    syncTimer,
    setTime,
    setDiscipline, 
    setTopic, 
    setCustomDiscipline, 
    setCustomTopic, 
    addStudySession,
    loadSavedData,
    clearAllData
} = timerSlice.actions;

export default timerSlice.reducer; 