import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Upload, Send, BarChart2, PieChart as PieChartIcon, 
  MessageSquare, FileText, Download, Moon, Sun, 
  Zap, Brain, CheckCircle2, AlertCircle
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const EMOTION_COLORS = {
  Joy: '#FBBF24',
  Anger: '#EF4444',
  Fear: '#8B5CF6',
  Sadness: '#3B82F6',
  Trust: '#10B981',
  Anticipation: '#F97316'
};

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [singleResult, setSingleResult] = useState(null);
  const [batchResults, setBatchResults] = useState([]);
  const [activeTab, setActiveTab] = useState('single'); // 'single' or 'batch'

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleTextAnalysis = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/analyze/text`, { text });
      setSingleResult(response.data);
      setActiveTab('single');
    } catch (err) {
      console.error("Analysis failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/analyze/csv`, formData);
      setBatchResults(response.data.results);
      setActiveTab('batch');
    } catch (err) {
      console.error("CSV Analysis failed", err);
    } finally {
      setLoading(false);
    }
  };

  const getAggregatedData = () => {
    if (batchResults.length === 0) return [];
    
    // Calculate total scores for each emotion across all results
    const totals = { Joy: 0, Anger: 0, Fear: 0, Sadness: 0, Trust: 0, Anticipation: 0 };
    batchResults.forEach(r => {
      Object.keys(totals).forEach(emo => {
        totals[emo] += (r.scores[emo] || 0);
      });
    });

    // Return the average intensity for each emotion
    return Object.entries(totals).map(([name, value]) => ({ 
      name, 
      value: value / batchResults.length 
    }));
  };

  const getScoreData = (scores) => {
    return Object.entries(scores).map(([name, value]) => ({ 
      name, 
      score: parseFloat((value * 100).toFixed(1)) 
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-800 backdrop-blur-md sticky top-0 z-50 bg-white/70 dark:bg-slate-950/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Brain className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              Emotion Beyond Words
            </h1>
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
            Detecting Emotions <span className="text-indigo-600">Hidden</span> in Text
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
            Analyze reviews, tweets, and social media text to uncover Joy, Anger, Fear, and more using our Multidimensional Sentiment Intelligence Model.
          </p>
        </section>

        {/* Input Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Manual Input */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2 mb-4">
              <MessageSquare className="text-indigo-500 w-5 h-5" />
              <h3 className="font-semibold text-lg">Analyze Single Text</h3>
            </div>
            <textarea
              className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              onClick={handleTextAnalysis}
              disabled={loading || !text}
              className="mt-4 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20"
            >
              {loading ? <Zap className="w-5 h-5 animate-pulse" /> : <Send className="w-5 h-5" />}
              <span>{loading ? 'Analyzing...' : 'Analyze Emotion'}</span>
            </button>
          </div>

          {/* Dataset Upload */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="text-purple-500 w-5 h-5" />
              <h3 className="font-semibold text-lg">Batch Analysis (CSV)</h3>
            </div>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl h-32 flex flex-col items-center justify-center relative hover:border-indigo-500 transition-colors">
              <input 
                type="file" 
                accept=".csv" 
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="text-slate-400 w-8 h-8 mb-2" />
              <p className="text-sm text-slate-500">Drop your CSV file here or click to browse</p>
            </div>
            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500">
                Ensure CSV has a <span className="font-mono font-bold">text</span> column for analysis.
              </p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {activeTab === 'single' && singleResult && (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center space-x-2">
                <CheckCircle2 className="text-green-500 w-6 h-6" />
                <span>Multidimensional Analysis</span>
              </h3>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg mb-8">
              <p className="text-slate-500 text-sm mb-2 uppercase tracking-wider font-semibold">Analyzed Text</p>
              <p className="text-lg italic text-slate-700 dark:text-slate-200 leading-relaxed border-l-4 border-indigo-500 pl-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-r-xl">
                 "{singleResult.text}"
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold self-center mr-2">Core Profile:</span>
                {Object.entries(singleResult.scores).sort((a,b) => b[1] - a[1]).map(([emo, score]) => (
                  <span key={emo} className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold flex items-center space-x-1 border border-slate-200 dark:border-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: EMOTION_COLORS[emo] }}></div>
                    <span className="capitalize">{emo}</span>
                    <span className="opacity-60">{(score * 100).toFixed(2)}%</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Main Analysis Results */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
                <div className="flex justify-between items-center mb-8">
                  <p className="text-slate-500 text-sm uppercase tracking-wider font-semibold">Emotion Breakdown</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400">Primary:</span>
                    <span className="text-lg font-black capitalize" style={{ color: EMOTION_COLORS[singleResult.emotion] }}>
                      {singleResult.emotion}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-5">
                  {/* Ensure all 6 emotions are shown */}
                  {['Joy', 'Anger', 'Fear', 'Sadness', 'Trust', 'Anticipation'].map((emo) => {
                    const score = singleResult.scores[emo] || 0;
                    return (
                      <div key={emo}>
                        <div className="flex justify-between items-center text-sm mb-2">
                          <span className="font-bold capitalize flex items-center space-x-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: EMOTION_COLORS[emo] }}></div>
                            <span className="text-slate-700 dark:text-slate-300">{emo}</span>
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-500">
                            {(score * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800/50 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-700 ease-out" 
                            style={{ 
                              width: `${score * 100}%`,
                              backgroundColor: EMOTION_COLORS[emo],
                              boxShadow: score > 0.1 ? `0 0 8px ${EMOTION_COLORS[emo]}44` : 'none'
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Data Visualization Summary */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center justify-center">
                 <p className="text-slate-500 text-sm mb-6 uppercase tracking-wider font-semibold self-start">Visual Distribution</p>
                 <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Object.entries(singleResult.scores).map(([name, value]) => ({ name, value }))}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {Object.entries(singleResult.scores).map(([name], index) => (
                            <Cell key={`cell-${index}`} fill={EMOTION_COLORS[name]} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                          itemStyle={{ color: '#f8fafc' }}
                          formatter={(value) => `${(value * 100).toFixed(2)}%`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="mt-4 text-center">
                    <p className="text-sm text-slate-500">
                      The analyzer detected <span className="font-bold text-indigo-500">{singleResult.emotion}</span> as the dominant emotion.
                    </p>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'batch' && batchResults.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
             <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center space-x-2">
                <BarChart2 className="text-purple-500 w-6 h-6" />
                <span>Dataset Insights</span>
              </h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-lg hover:bg-indigo-600 hover:text-white transition-all text-sm font-semibold">
                <Download className="w-4 h-4" />
                <span>Export JSON</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg h-96">
                <h4 className="font-bold mb-4">Emotion Distribution</h4>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie
                      data={getAggregatedData()}
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {getAggregatedData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={EMOTION_COLORS[entry.name]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                      itemStyle={{ color: '#f8fafc' }}
                      formatter={(value) => `${(value * 100).toFixed(2)}%`} 
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg h-96">
                 <h4 className="font-bold mb-4">Intensity Overview</h4>
                 <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={getAggregatedData()}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                      itemStyle={{ color: '#f8fafc' }}
                      formatter={(value) => `${(value * 100).toFixed(2)}%`} 
                    />
                    <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]}>
                       {getAggregatedData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={EMOTION_COLORS[entry.name]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                   <tr>
                    <th className="px-6 py-4 font-bold text-sm">Text Snippet</th>
                    <th className="px-6 py-4 font-bold text-sm">Multidimensional Profile (Joy, Ang, Fea, Sad, Tru, Ant)</th>
                    <th className="px-6 py-4 font-bold text-sm text-right">Top Conf.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {batchResults.slice(0, 5).map((res, i) => (
                     <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate capitalize">
                        {res.text}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1 h-6">
                          {['Joy', 'Anger', 'Fear', 'Sadness', 'Trust', 'Anticipation'].map(emo => (
                            <div 
                              key={emo} 
                              className="h-full rounded-sm relative group cursor-help"
                              style={{ 
                                width: '16%', 
                                backgroundColor: EMOTION_COLORS[emo],
                                opacity: 0.2 + (res.scores[emo] || 0) * 0.8
                              }}
                            >
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50">
                                {emo}: {((res.scores[emo] || 0) * 100).toFixed(2)}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-mono font-bold">
                        <span style={{ color: EMOTION_COLORS[res.emotion] }}>
                          {(Math.max(...Object.values(res.scores)) * 100).toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {batchResults.length > 5 && (
                <div className="p-4 text-center border-t border-slate-100 dark:border-slate-800">
                  <p className="text-sm text-slate-500 italic">Showing 5 of {batchResults.length} records</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features Preview (Stats) */}
        {!singleResult && batchResults.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-in fade-in duration-1000">
            {[
              { icon: <Zap className="text-yellow-500" />, label: "Real-time Processing", desc: "Instant text classification using BERT embeddings." },
              { icon: <PieChartIcon className="text-indigo-500" />, label: "Visual Analytics", desc: "Interactive dashboards and distribution charts." },
              { icon: <Download className="text-green-500" />, label: "Export Results", desc: "Download analysis in CSV or JSON formats." }
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h4 className="font-bold mb-1">{feature.label}</h4>
                <p className="text-sm text-slate-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-20 py-10 border-t border-slate-200 dark:border-slate-800 text-center">
        <p className="text-sm text-slate-500">
          Built with React & FastAPI • Emotion Beyond Words API v1.0
        </p>
      </footer>
    </div>
  );
};

export default App;
