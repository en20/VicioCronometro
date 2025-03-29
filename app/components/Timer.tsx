'use client'

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
    startTimer,
    pauseTimer,
    resetTimer,
    incrementTimer,
    setDiscipline,
    setTopic,
    setCustomDiscipline,
    setCustomTopic,
    addStudySession,
    syncTimer,
    StudySession
} from '../store/timerSlice';
import Board from './Board';
import SaveSessionModal from './SaveSessionModal';



export default function Timer() {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [errorType, setErrorType] = useState<'discipline' | 'topic' | 'general'>('general');
    const [successMsg, setSuccessMsg] = useState<string>('');
    const [disableSelectors, setDisableSelectors] = useState<boolean>(false);
    const [selectorMessage, setSelectorMessage] = useState<string>('');
    
    const dispatch = useAppDispatch();
    const {
        isRunning,
        time,
        discipline,
        topic,
        customDiscipline,
        customTopic,
        showCustomDiscipline,
        showCustomTopic,
        studySessions,
        studyData
    } = useAppSelector(state => state.timer);

    const disciplines = ["Matemática", "Português", "História", "Geografia", "Ciências", "Física", "Química", "Biologia", "Inglês", "Outro"];
    
    const topicsByDiscipline: {[key: string]: string[]} = {
        "Matemática": ["Álgebra", "Geometria", "Cálculo", "Estatística", "Outro"],
        "Português": ["Gramática", "Literatura", "Redação", "Interpretação", "Outro"],
        "História": ["História Antiga", "História Medieval", "História Moderna", "História Contemporânea", "Outro"],
        "Geografia": ["Geografia Física", "Geografia Humana", "Geopolítica", "Outro"],
        "Ciências": ["Física", "Química", "Biologia", "Outro"],
        "Física": ["Mecânica", "Termodinâmica", "Eletromagnetismo", "Física Moderna", "Outro"],
        "Química": ["Química Orgânica", "Química Inorgânica", "Físico-química", "Outro"],
        "Biologia": ["Citologia", "Genética", "Ecologia", "Fisiologia", "Outro"],
        "Inglês": ["Gramática", "Vocabulário", "Conversação", "Outro"],
        "Outro": ["Personalizado"]
    };

    useEffect(() => {
        dispatch(syncTimer());
    }, [dispatch]);

    useEffect(() => {
        let animationFrameId: number;
        let lastTime = performance.now();
        
        const updateTimer = (currentTime: number) => {
            if (isRunning) {
                const deltaTime = currentTime - lastTime;
                
                if (deltaTime >= 50) {
                    dispatch(incrementTimer(deltaTime / 1000));
                    lastTime = currentTime;
                }
                
                animationFrameId = requestAnimationFrame(updateTimer);
            }
        };
        
        if (isRunning) {
            animationFrameId = requestAnimationFrame(updateTimer);
        }
        
        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [isRunning, dispatch]);

    useEffect(() => {
        try {
            if (studySessions.length > 0) {
                localStorage.setItem('studySessions', JSON.stringify(studySessions));
            }
            
            if (Object.keys(studyData).length > 0) {
                localStorage.setItem('studyData', JSON.stringify(studyData));
            }
        } catch (error) {
            console.error("Erro ao salvar no localStorage:", error);
        }
    }, [studySessions, studyData]);

    useEffect(() => {
        setDisableSelectors(isRunning || (!isRunning && time > 0));
        
        if (time === 0) {
            setSelectorMessage('');
        }
    }, [isRunning, time]);

    const clearMessages = (delay = 5000) => {
        setTimeout(() => {
            setErrorMsg('');
            setSuccessMsg('');
        }, delay);
    };

    const handleStartTimer = () => {
        if (!discipline && !customDiscipline) {
            setErrorMsg("Por favor, selecione uma disciplina antes de iniciar.");
            setErrorType('discipline');
            clearMessages();
            return;
        }
        
        if (!topic && !customTopic) {
            setErrorMsg("Por favor, selecione um tópico antes de iniciar.");
            setErrorType('topic');
            clearMessages();
            return;
        }
        
        dispatch(pauseTimer());
        
        setTimeout(() => {
            dispatch(startTimer());
            setSuccessMsg("Cronômetro iniciado!");
            clearMessages(2000);
        }, 100);
    };

    const handlePauseTimer = () => {
        dispatch(pauseTimer());
    };

    const handleResetTimer = () => {
        dispatch(resetTimer());
    };

    const saveTime = () => {
        dispatch(pauseTimer());
        
        if (time <= 0) {
            setErrorMsg("Não há tempo para salvar. Por favor, inicie o cronômetro primeiro.");
            setErrorType('general');
            clearMessages();
            return;
        }
        
        if (!discipline && !customDiscipline) {
            setErrorMsg("Por favor selecione uma disciplina antes de salvar.");
            setErrorType('discipline');
            clearMessages();
            return;
        }
        
        if (!topic && !customTopic) {
            setErrorMsg("Por favor selecione um tópico antes de salvar.");
            setErrorType('topic');
            clearMessages();
            return;
        }
        
        console.log("Abrindo modal para salvar tempo:", time);
        setShowModal(true);
    };

    const handleDisciplineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (disableSelectors) {
            e.preventDefault();
            setSelectorMessage("Não é possível alterar a disciplina durante uma sessão em andamento. Resete o timer primeiro.");
            clearSelectorMessage();
            return;
        }
        
        const newDiscipline = e.target.value;
        dispatch(setDiscipline(newDiscipline));
    };

    const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (disableSelectors) {
            e.preventDefault();
            setSelectorMessage("Não é possível alterar o tópico durante uma sessão em andamento. Resete o timer primeiro.");
            clearSelectorMessage();
            return;
        }
        
        dispatch(setTopic(e.target.value));
    };

    const handleCustomDisciplineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disableSelectors) {
            e.preventDefault();
            setSelectorMessage("Não é possível alterar a disciplina durante uma sessão em andamento. Resete o timer primeiro.");
            clearSelectorMessage();
            return;
        }
        
        dispatch(setCustomDiscipline(e.target.value));
    };

    const handleCustomTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disableSelectors) {
            e.preventDefault();
            setSelectorMessage("Não é possível alterar o tópico durante uma sessão em andamento. Resete o timer primeiro.");
            clearSelectorMessage();
            return;
        }
        
        dispatch(setCustomTopic(e.target.value));
    };

    const clearSelectorMessage = (delay = 5000) => {
        setTimeout(() => {
            setSelectorMessage('');
        }, delay);
    };

    const formatTime = (timeInSeconds: number) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    useEffect(() => {
        setErrorMsg('');
        setSuccessMsg('');
    }, [discipline, topic]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                <motion.div 
                    className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl lg:w-1/2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-[#7651B1] mb-6">Cronômetro de Estudos</h2>
                    
                    <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Disciplina</label>
                            <select
                                value={discipline}
                                onChange={handleDisciplineChange}
                                className={`w-full p-3 border ${disableSelectors ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'} border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7651B1] focus:border-[#7651B1] transition-all duration-300`}
                                disabled={disableSelectors}
                            >
                                <option value="">Selecione uma disciplina</option>
                                {disciplines.map((disc) => (
                                    <option key={disc} value={disc}>{disc}</option>
                                ))}
                            </select>
                            
                            {showCustomDiscipline && (
                                <div className="mt-3">
                                    <input
                                        type="text"
                                        value={customDiscipline}
                                        onChange={handleCustomDisciplineChange}
                                        placeholder="Digite a disciplina"
                                        className={`w-full p-3 border ${disableSelectors ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'} border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7651B1] focus:border-[#7651B1] transition-all duration-300`}
                                        disabled={disableSelectors}
                                    />
                                </div>
                            )}
                        </div>
                        
                        {errorType === 'discipline' && errorMsg && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-100"
                            >
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    {errorMsg}
                                </div>
                            </motion.div>
                        )}
                        
        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Tópico</label>
                            {discipline ? (
                                <>
                                    <select
                                        value={topic}
                                        onChange={handleTopicChange}
                                        className={`w-full p-3 border ${disableSelectors ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'} border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7651B1] focus:border-[#7651B1] transition-all duration-300`}
                                        disabled={disableSelectors}
                                    >
                                        <option value="">Selecione um tópico</option>
                                        {topicsByDiscipline[discipline]?.map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                    
                                    {showCustomTopic && (
                                        <div className="mt-3">
                                            <input
                                                type="text"
                                                value={customTopic}
                                                onChange={handleCustomTopicChange}
                                                placeholder="Digite o tópico"
                                                className={`w-full p-3 border ${disableSelectors ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'} border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7651B1] focus:border-[#7651B1] transition-all duration-300`}
                                                disabled={disableSelectors}
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-400">
                                    Selecione uma disciplina primeiro
                                </div>
                            )}
                        </div>
                        
                        {errorType === 'topic' && errorMsg && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-100"
                            >   
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    {errorMsg}
                                </div>
                            </motion.div>
                        )}
                    </div>
                    
                    <div className="flex justify-center mb-8">
                        <motion.div 
                            className="relative w-64 h-64 rounded-full bg-white shadow-md flex items-center justify-center"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="absolute inset-0 rounded-full border-4 border-[#7651B1]/10"></div>
                            
                            <div className="flex flex-col items-center">
                                <div className="text-4xl font-mono font-bold text-[#7651B1]">
                                    {`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`}
                                </div>
                                <div className="text-2xl font-mono text-[#7651B1]/80 mt-1">
                                    {seconds.toString().padStart(2, '0')}
                                </div>
                                
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ 
                                        opacity: 1,
                                        color: isRunning ? "#4CAF50" : "#FFA000" 
                                    }}
                                    className="mt-4 text-sm font-medium"
                                >
                                    {isRunning ? 'Em andamento' : (time > 0 ? 'Pausado' : 'Pronto')}
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 justify-center">
                        {!isRunning ? (
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleStartTimer}
                                className="px-6 py-3 bg-gradient-to-r from-[#7651B1] to-[#9B7ED7] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                                {time > 0 ? "Retomar" : "Iniciar"}
                            </motion.button>
                        ) : (
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handlePauseTimer}
                                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Pausar
                            </motion.button>
                        )}
                        
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleResetTimer}
                            className={`px-6 py-3 bg-gradient-to-r from-red-500 to-red-400 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 ${time === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={time === 0}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                            Resetar
                        </motion.button>
                        
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={saveTime}
                            className={`px-6 py-3 bg-gradient-to-r from-green-500 to-green-400 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 ${time === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={time === 0}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Salvar Tempo
                        </motion.button>
                    </div>
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="lg:w-1/2"
                >
                    <Board />
                </motion.div>
            </div>
            
            <AnimatePresence>
                <SaveSessionModal 
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSuccess={(message) => {
                        setSuccessMsg(message);
                        clearMessages(4000);
                    }}
                    discipline={showCustomDiscipline ? customDiscipline : discipline}
                    topic={showCustomTopic ? customTopic : topic}
                    time={time}
                    formatTime={formatTime}
                    studySessions={studySessions}
                    studyData={studyData}
                />
            </AnimatePresence>

            {errorType === 'general' && errorMsg && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100"
                >
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {errorMsg}
                    </div>
                </motion.div>
            )}

            {successMsg && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded-md border border-green-100"
                >
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {successMsg}
                    </div>
                </motion.div>
            )}

            {selectorMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 text-sm text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-100"
                >
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {selectorMessage}
                    </div>
                </motion.div>
            )}
        </div>
    );
}