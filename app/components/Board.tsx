'use client'

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearAllData } from '../store/timerSlice';
import StudyCharts from './StudyCharts';

type StudySession = {
    id: string;
    discipline: string;
    topic: string;
    duration: number;
    date: string;
};

export default function Board() {
    const dispatch = useAppDispatch();
    const { studySessions, studyData } = useAppSelector(state => state.timer);
    
    // Estado para controlar quais disciplinas estão expandidas
    const [expandedDisciplines, setExpandedDisciplines] = useState<{[key: string]: boolean}>({});
    
    // Toggle para expandir/recolher disciplinas
    const toggleDiscipline = (discipline: string) => {
        setExpandedDisciplines(prev => ({
            ...prev,
            [discipline]: !prev[discipline]
        }));
    };
    
    const formatTime = (timeInSeconds: number) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

   
    const getTopDisciplines = () => {
        return Object.entries(studyData)
            .sort((a, b) => b[1].totalTime - a[1].totalTime)
            .slice(0, 3)
            .map(([name, data]) => ({
                name,
                time: formatTime(data.totalTime),
                // Adicionar os tópicos para esta disciplina
                topics: Object.entries(data.topics)
                    .sort((a, b) => b[1] - a[1])
                    .map(([topicName, topicTime]) => ({
                        name: topicName,
                        time: formatTime(topicTime)
                    }))
            }));
    };

    
    const getTopTopics = () => {
        const allTopics: {name: string, discipline: string, time: number}[] = [];
        
        Object.entries(studyData).forEach(([discipline, data]) => {
            Object.entries(data.topics).forEach(([topic, time]) => {
                allTopics.push({
                    name: topic,
                    discipline,
                    time
                });
            });
        });
        
        return allTopics
            .sort((a, b) => b.time - a.time)
            .slice(0, 5)
            .map(topic => ({
                ...topic,
                formattedTime: formatTime(topic.time)
            }));
    };
    
    const handleClearData = () => {
        if (window.confirm("Tem certeza de que deseja limpar todos os dados de estudo? Esta ação não poderá ser desfeita.")) {
            
            dispatch(clearAllData());
            
            
            localStorage.removeItem('studySessions');
            localStorage.removeItem('studyData');
            
            console.log("Todos os dados foram limpos");
            
            
            window.location.reload();
        }
    };

    
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };
    
    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    useEffect(() => {
        console.log("Board recebeu dados:", {
            "Número de sessões": studySessions.length,
            "Disciplinas": Object.keys(studyData),
            "StudyData completo": studyData
        });
    }, [studySessions, studyData]);

    return (
        <motion.div 
            className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-[#7651B1]">Estatísticas de Estudo</h2>
                
                {Object.keys(studyData).length > 0 && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleClearData}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-red-500 to-red-400 text-white text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        Limpar dados
                    </motion.button>
                )}
            </div>
            
            {Object.keys(studyData).length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-gray-500 py-16 bg-gray-50 rounded-xl border border-gray-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p className="text-lg">Nenhum dado de estudo registrado ainda.</p>
                    <p className="text-sm mt-2">Registre seu tempo de estudo para ver estatísticas aqui.</p>
                </motion.div>
            ) : (
                <div>
                    
                    <motion.div 
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="mb-8"
                    >
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#7651B1]" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Disciplinas Mais Estudadas
                        </h3>
                        <div className="space-y-4">
                            {getTopDisciplines().map((discipline, index) => (
                                <motion.div 
                                    key={index} 
                                    variants={item}
                                    className="relative"
                                >
                                    <div 
                                        className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 sm:p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer"
                                        onClick={() => toggleDiscipline(discipline.name)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-800 flex items-center text-xs sm:text-sm md:text-base">
                                                <span className="flex items-center justify-center h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-[#7651B1] text-white text-xs mr-1 sm:mr-2 flex-shrink-0">
                                                    {index + 1}
                                                </span>
                                                <span className="truncate max-w-[120px] sm:max-w-[150px] md:max-w-none">
                                                    {discipline.name}
                                                </span>
                                            </span>
                                            <div className="flex items-center flex-shrink-0">
                                                <span className="font-mono text-[#7651B1] font-semibold mr-1 sm:mr-3 text-xs sm:text-sm">
                                                    {discipline.time}
                                                </span>
                                                <motion.button
                                                    animate={{ rotate: expandedDisciplines[discipline.name] ? 180 : 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="text-gray-500 hover:text-[#7651B1] transition-colors flex-shrink-0"
                                                    aria-label="Expandir tópicos"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <AnimatePresence>
                                        {expandedDisciplines[discipline.name] && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="mt-2 ml-4 sm:ml-8 space-y-2 border-l-2 border-purple-200 pl-2 sm:pl-4">
                                                    {discipline.topics.length > 0 ? (
                                                        discipline.topics.map((topic, i) => (
                                                            <motion.div 
                                                                key={i}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: i * 0.1 }}
                                                                className="bg-white p-2 sm:p-3 rounded-md shadow-sm flex justify-between items-center"
                                                            >
                                                                <span className="text-xs sm:text-sm text-gray-700 truncate max-w-[140px] sm:max-w-[180px]">{topic.name}</span>
                                                                <span className="text-xs font-mono text-[#7651B1] font-medium flex-shrink-0">{topic.time}</span>
                                                            </motion.div>
                                                        ))
                                                    ) : (
                                                        <div className="text-xs sm:text-sm text-gray-500 italic p-2">
                                                            Nenhum tópico registrado
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                    
                    
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="mb-8"
                    >
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#7651B1]" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                            Tópicos Mais Estudados
                        </h3>
                        <div className="space-y-3">
                            {getTopTopics().map((topic, index) => (
                                <motion.div 
                                    key={index} 
                                    variants={item}
                                    className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 sm:p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:translate-x-1"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-800 flex items-center text-xs sm:text-sm md:text-base">
                                            <span className="flex items-center justify-center h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-[#7651B1] text-white text-xs mr-1 sm:mr-2 flex-shrink-0">
                                                {index + 1}
                                            </span>
                                            <span className="truncate max-w-[120px] sm:max-w-[150px] md:max-w-none">
                                                {topic.name}
                                            </span>
                                        </span>
                                        <span className="font-mono text-[#7651B1] font-semibold text-xs sm:text-sm flex-shrink-0">{topic.formattedTime}</span>
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1 sm:mt-2 pl-6 sm:pl-8">
                                        <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 bg-white rounded-full text-xs">
                                            {topic.discipline}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    
                    <AnimatePresence>
                        {Object.keys(studyData).length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <StudyCharts studyData={studyData} formatTime={formatTime} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
}