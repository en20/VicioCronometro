'use client'

import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch } from '../store/hooks';
import { addStudySession, resetTimer } from '../store/timerSlice';

type SaveSessionModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (message: string) => void;
    discipline: string;
    topic: string;
    time: number;
    formatTime: (time: number) => string;
    studySessions: any[];
    studyData: any;
};

export default function SaveSessionModal({
    isOpen,
    onClose,
    onSuccess,
    discipline,
    topic,
    time,
    formatTime,
    studySessions,
    studyData
}: SaveSessionModalProps) {
    const dispatch = useAppDispatch();

    if (!isOpen) return null;

    const confirmSave = () => {
        if (!discipline || !topic || time <= 0) {
            alert("Não foi possível salvar. Verifique se você selecionou uma disciplina, um tópico e se o tempo é maior que zero.");
            onClose();
            return;
        }
        
        const sessionId = Date.now().toString();
        
        const newSession = {
            id: sessionId,
            discipline: discipline,
            topic: topic,
            duration: time,
            date: new Date().toISOString()
        };
        
        dispatch(addStudySession(newSession));
        
        console.log("Sessão salva:", newSession);
        
        onClose();
        dispatch(resetTimer());
        
        const updatedSessions = [...studySessions, newSession];
        localStorage.setItem('studySessions', JSON.stringify(updatedSessions));
        
        const updatedData = JSON.parse(JSON.stringify(studyData)); 
        
        if (!updatedData[discipline]) {
            updatedData[discipline] = {
                totalTime: 0,
                topics: {}
            };
        }
        
        updatedData[discipline].totalTime += time;
        
        if (!updatedData[discipline].topics[topic]) {
            updatedData[discipline].topics[topic] = 0;
        }
        
        updatedData[discipline].topics[topic] += time;
        
        localStorage.setItem('studyData', JSON.stringify(updatedData));
        
        if (onSuccess) {
            onSuccess("Tempo de estudo salvo com sucesso!");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                >
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        transition={{ 
                            type: "spring", 
                            stiffness: 350, 
                            damping: 30,
                            duration: 0.4
                        }}
                        className="bg-white bg-opacity-95 rounded-2xl p-0 max-w-md w-full shadow-2xl overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-[#7651B1] to-[#9B7ED7] p-6 text-white relative">
                            
                            <div className="absolute -bottom-10 -right-8 w-24 h-24 rounded-full bg-white bg-opacity-10"></div>
                            
                            <div className="flex items-center mb-3">
                                <div className="bg-white rounded-full p-2.5 mr-3 shadow-md">
                                    <img 
                                        src="/vicio.png" 
                                        alt="Vício Logo" 
                                        className="h-12 w-12 object-contain" 
                                    />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">Confirmar Registro</h3>
                                    <p className="text-sm text-purple-100">
                                        Revise os dados da sua sessão de estudo
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                            
                        <div className="p-6">
                            <div className="mb-6 space-y-4">
                               
                                <motion.div 
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-purple-50 rounded-lg p-4 border-l-4 border-[#7651B1] shadow-sm"
                                >
                                    <div className="flex items-center">
                                        <div className="bg-[#7651B1] bg-opacity-10 p-2 rounded-lg mr-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#7651B1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 font-medium">DISCIPLINA</div>
                                            <div className="text-lg font-semibold text-gray-900">{discipline}</div>
                                        </div>
                                    </div>
                                </motion.div>
                                
                                <motion.div 
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-purple-50 rounded-lg p-4 border-l-4 border-[#9B7ED7] shadow-sm"
                                >
                                    <div className="flex items-center">
                                        <div className="bg-[#9B7ED7] bg-opacity-10 p-2 rounded-lg mr-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#9B7ED7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 font-medium">TÓPICO</div>
                                            <div className="text-lg font-semibold text-gray-900">{topic}</div>
                                        </div>
                                    </div>
                                </motion.div>
                                
                                <motion.div 
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-purple-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm"
                                >
                                    <div className="flex items-center">
                                        <div className="bg-indigo-500 bg-opacity-10 p-2 rounded-lg mr-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 font-medium">TEMPO DE ESTUDO</div>
                                            <div className="text-lg font-semibold text-gray-900 font-mono">{formatTime(time).substring(0, 8)}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                            
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-sm text-gray-600 mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100"
                            >
                                <div className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    Deseja salvar esta sessão de estudo? Os dados serão adicionados às suas estatísticas.
                                </div>
                            </motion.div>
                            
                            <div className="flex justify-end gap-3">
                                <motion.button 
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={onClose}
                                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-300 flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Cancelar
                                </motion.button>
                                <motion.button 
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={confirmSave}
                                    className="px-5 py-2.5 bg-gradient-to-r from-[#7651B1] to-[#9B7ED7] text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Confirmar
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
} 