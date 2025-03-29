'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';

type StudyData = {
    [key: string]: {
        totalTime: number;
        topics: {
            [key: string]: number;
        };
    };
};

type StudyChartsProps = {
    studyData: StudyData;
    formatTime: (time: number) => string;
};

export default function StudyCharts({ studyData, formatTime }: StudyChartsProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [chartType, setChartType] = useState<'bar' | 'pie' | 'topics'>('bar');

    const prepareChartData = () => {
        return Object.entries(studyData)
            .map(([name, data]) => ({
                name,
                tempo: Math.round(data.totalTime / 60), 
                tempoOriginal: data.totalTime
            }))
            .sort((a, b) => b.tempo - a.tempo);
    };

    const preparePieData = () => {
        return Object.entries(studyData)
            .map(([name, data]) => ({
                name,
                value: data.totalTime
            }))
            .sort((a, b) => b.value - a.value);
    };

    const prepareTopicData = () => {
        const allTopics: {name: string, tempo: number, discipline: string}[] = [];
        
        Object.entries(studyData).forEach(([discipline, data]) => {
            Object.entries(data.topics).forEach(([topic, time]) => {
                allTopics.push({
                    name: topic,
                    tempo: Math.round(time / 60),
                    discipline
                });
            });
        });
        
        return allTopics
            .sort((a, b) => b.tempo - a.tempo)
            .slice(0, 5);
    };

    const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];

    const renderActiveShape = (props: any) => {
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
        
        const sin = Math.sin(-midAngle * Math.PI / 180);
        const cos = Math.cos(-midAngle * Math.PI / 180);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';
        
        return (
            <g>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{payload.name}</text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                    {`${formatTime(value)}`}
                </text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={36} textAnchor={textAnchor} fill="#999">
                    {`(${(percent * 100).toFixed(2)}%)`}
                </text>
            </g>
        );
    };

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    return (
        <div className="mt-8 space-y-8">
            <div className="flex flex-wrap gap-2 justify-center mb-4">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setChartType('bar')}
                    className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-1
                        ${chartType === 'bar' 
                            ? 'bg-[#7651B1] text-white shadow-md' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Barras
                </motion.button>
                
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setChartType('pie')}
                    className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-1
                        ${chartType === 'pie' 
                            ? 'bg-[#7651B1] text-white shadow-md' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                    Pizza
                </motion.button>
                
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setChartType('topics')}
                    className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-1
                        ${chartType === 'topics' 
                            ? 'bg-[#7651B1] text-white shadow-md' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    Tópicos
                </motion.button>
            </div>
            
            <AnimatePresence mode="wait">
                {chartType === 'bar' && (
                    <motion.div
                        key="bar"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-xl shadow-md p-6"
                    >
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#7651B1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Tempo por Disciplina (minutos)
                        </h3>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={prepareChartData()}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                                    <XAxis 
                                        dataKey="name" 
                                        angle={-45} 
                                        textAnchor="end" 
                                        height={70} 
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis />
                                    <Tooltip 
                                        formatter={(value, name) => {
                                            if (name === "tempo") {
                                                return [`${value} min`, "Tempo"];
                                            }
                                            return [value, name];
                                        }}
                                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: 'none' }}
                                    />
                                    <Legend formatter={() => "Tempo (min)"} />
                                    <Bar 
                                        dataKey="tempo" 
                                        fill="#7651B1" 
                                        radius={[4, 4, 0, 0]}
                                        animationDuration={1500}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                )}
                
                {chartType === 'pie' && (
                    <motion.div
                        key="pie"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-xl shadow-md p-6"
                    >
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#7651B1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                            </svg>
                            Distribuição do Tempo de Estudo
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">Passe o mouse sobre um setor para ver detalhes</p>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        activeIndex={activeIndex}
                                        activeShape={renderActiveShape}
                                        data={preparePieData()}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={90}
                                        dataKey="value"
                                        onMouseEnter={onPieEnter}
                                        animationDuration={1000}
                                        animationBegin={0}
                                    >
                                        {preparePieData().map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={COLORS[index % COLORS.length]} 
                                                stroke="rgba(255,255,255,0.5)"
                                                strokeWidth={1}
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                )}
                
                {chartType === 'topics' && (
                    <motion.div
                        key="topics"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-xl shadow-md p-6"
                    >
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#7651B1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            Top 5 Tópicos Mais Estudados (minutos)
                        </h3>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={prepareTopicData()}
                                    layout="vertical"
                                    margin={{ top: 20, right: 30, left: 100, bottom: 30 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" horizontal={true} vertical={false} />
                                    <XAxis type="number" />
                                    <YAxis 
                                        dataKey="name" 
                                        type="category" 
                                        tick={{ fontSize: 12 }}
                                        width={90}
                                    />
                                    <Tooltip 
                                        formatter={(value, name) => {
                                            if (name === "tempo") {
                                                return [`${value} min`, "Tempo"];
                                            }
                                            return [value, name];
                                        }}
                                        contentStyle={{ 
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                                            borderRadius: '8px', 
                                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
                                            border: 'none' 
                                        }}
                                        labelFormatter={(label) => `Tópico: ${label}`}
                                    />
                                    <Legend formatter={() => "Tempo (min)"} />
                                    <Bar 
                                        dataKey="tempo" 
                                        fill="#8884d8"
                                        radius={[0, 4, 4, 0]} 
                                        animationDuration={1500}
                                        label={{
                                            position: 'right',
                                            formatter: (value: any) => `${value} min`,
                                            fill: '#666',
                                            fontSize: 12
                                        }}
                                    >
                                        {prepareTopicData().map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={COLORS[index % COLORS.length]} 
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 