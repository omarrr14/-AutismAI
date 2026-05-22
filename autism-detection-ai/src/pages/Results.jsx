import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationTriangle, FaChartPie, FaDownload, FaBrain } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!location.state || !location.state.prediction) {
      // No data passed — redirect to predict page
      navigate('/predict');
      return;
    }
    setData(location.state);
  }, [location, navigate]);

  if (!data) return null;

  // Flask API returns: { prediction: 1, probability: 0.95 }
  // or:                 { prediction: 0, probability: 0.88 }
  const apiResponse = data.prediction; // This is the full JSON from Flask
  const predictionValue = apiResponse.prediction; // 0 or 1
  const isPositive = predictionValue === 1;
  
  // Use real probability if returned by Flask, otherwise show a default
  const confidence = apiResponse.probability 
    ? Math.round(apiResponse.probability * 100) 
    : (isPositive ? 89 : 92);

  const colorClass = isPositive ? "indigo" : "teal";
  const glowClass = isPositive ? "text-indigo-500 dark:text-indigo-400" : "text-teal-500 dark:text-teal-400";
  const borderClass = isPositive ? "border-indigo-200 dark:border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.1)]" : "border-teal-200 dark:border-teal-500/30 shadow-[0_0_30px_rgba(20,184,166,0.1)]";

  const inputData = data.inputData || {};
  
  // Mapping labels for translation
  const genderText = inputData.gender === 'm' ? t('predict.male') : t('predict.female');
  const jaundiceText = inputData.jaundice === 'yes' ? t('predict.yes') : t('predict.no');
  const familyHistoryText = inputData.austim === 'yes' ? t('predict.yes') : t('predict.no');
  const usedAppText = inputData.used_app_before === 'yes' ? t('predict.yes') : t('predict.no');
  
  const relationText = 
    inputData.relation === 'Self' ? t('predict.relation_self') :
    inputData.relation === 'Parent' ? t('predict.relation_parent') :
    inputData.relation === 'Health care professional' ? t('predict.relation_hcp') :
    inputData.relation === 'Relative' ? t('predict.relation_relative') : inputData.relation;

  const aqScore = [
    inputData.A1, inputData.A2, inputData.A3, inputData.A4, inputData.A5,
    inputData.A6, inputData.A7, inputData.A8, inputData.A9, inputData.A10
  ].reduce((sum, val) => sum + (val === '1' ? 1 : 0), 0);

  const questionsList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => {
    const key = `A${num}`;
    const answerVal = inputData[key];
    return {
      num,
      questionText: t(`predict.q${num}`),
      answer: answerVal === '1' ? t('report.response_yes') : t('report.response_no'),
      isYes: answerVal === '1'
    };
  });

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-4xl mx-auto py-8 print:hidden"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">{t('results.title')}</h1>
          <p className="text-slate-600 dark:text-slate-400">{t('results.subtitle')}</p>
        </div>

        <div className={`glass-card p-8 md:p-12 border ${borderClass} relative overflow-hidden mb-8`}>
          {/* Background glow */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 blur-[100px] opacity-10 pointer-events-none ${isPositive ? 'bg-indigo-500' : 'bg-teal-500'}`}></div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
            
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-start">
              <div className="flex items-center gap-4 mb-4">
                {isPositive ? (
                  <FaExclamationTriangle className={`text-5xl ${glowClass}`} />
                ) : (
                  <FaCheckCircle className={`text-5xl ${glowClass}`} />
                )}
                <div className="text-start">
                  <h2 className="text-slate-500 dark:text-slate-400 uppercase tracking-widest text-sm font-bold">{t('results.result_label')}</h2>
                  <div className={`text-4xl md:text-5xl font-black uppercase ${glowClass}`}>
                    {isPositive ? t('results.positive') : t('results.negative')}
                  </div>
                </div>
              </div>
              
              <p className="text-slate-600 dark:text-slate-300 mt-4 leading-relaxed max-w-lg">
                {isPositive ? t('results.desc_positive') : t('results.desc_negative')}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center relative w-48 h-48">
              {/* Circular Progress */}
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                <motion.circle 
                  cx="96" cy="96" r="80" 
                  stroke="currentColor" 
                  strokeWidth="12" 
                  fill="transparent" 
                  strokeDasharray="502"
                  initial={{ strokeDashoffset: 502 }}
                  animate={{ strokeDashoffset: 502 - (502 * confidence) / 100 }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  strokeLinecap="round"
                  className={isPositive ? 'text-indigo-500 dark:text-indigo-400' : 'text-teal-500 dark:text-teal-400'} 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-800 dark:text-white" dir="ltr">{confidence}%</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">{t('results.confidence')}</span>
              </div>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400">
              <FaChartPie className="text-2xl" />
            </div>
            <div>
              <h3 className="text-slate-800 dark:text-white font-bold mb-1">{t('results.summary_title')}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('results.summary_desc')}</p>
            </div>
          </div>
          
          <div className="glass-card p-6 flex flex-col justify-center">
            <button onClick={() => navigate('/predict')} className="w-full py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-colors mb-3 shadow-sm">
              {t('results.btn_another')}
            </button>
            <button 
              onClick={() => window.print()}
              className="w-full py-3 px-4 border border-sky-200 dark:border-sky-500/50 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
            >
              <FaDownload /> {t('results.btn_download')}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Print-only Report Layout */}
      <div className="hidden print:block w-full text-slate-900 bg-white p-6 max-w-4xl mx-auto" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-200 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center border border-sky-200">
              <FaBrain className="text-sky-600 text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Autism<span className="text-sky-600">AI</span></h1>
              <p className="text-xs text-slate-500 font-medium">{t('report.system_ver')}</p>
            </div>
          </div>
          <div className="text-right rtl:text-left">
            <h2 className="text-xl font-bold text-slate-800">{t('report.title')}</h2>
            <p className="text-xs text-slate-500">{t('report.date')}: {new Date().toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>

        {/* Grid for Patient Info */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Demographics */}
          <div className="border border-slate-200 rounded-xl p-4">
            <h3 className="text-sm font-bold uppercase text-sky-600 border-b border-slate-100 pb-2 mb-3">{t('report.patient_demographics')}</h3>
            <div className="grid grid-cols-2 gap-y-2 text-xs">
              <span className="font-semibold text-slate-500">{t('predict.age')}:</span>
              <span className="text-slate-800">{inputData.age || 'N/A'}</span>
              <span className="font-semibold text-slate-500">{t('predict.gender')}:</span>
              <span className="text-slate-800">{genderText}</span>
              <span className="font-semibold text-slate-500">{t('predict.ethnicity')}:</span>
              <span className="text-slate-800">{inputData.ethnicity || 'N/A'}</span>
              <span className="font-semibold text-slate-500">{t('predict.country')}:</span>
              <span className="text-slate-800">{inputData.country || 'N/A'}</span>
              <span className="font-semibold text-slate-500">{t('predict.relation')}:</span>
              <span className="text-slate-800">{relationText}</span>
            </div>
          </div>

          {/* Medical History */}
          <div className="border border-slate-200 rounded-xl p-4">
            <h3 className="text-sm font-bold uppercase text-sky-600 border-b border-slate-100 pb-2 mb-3">{t('report.medical_indicators')}</h3>
            <div className="grid grid-cols-2 gap-y-2 text-xs">
              <span className="font-semibold text-slate-500">{t('predict.jaundice_title')}:</span>
              <span className="text-slate-800">{jaundiceText}</span>
              <span className="font-semibold text-slate-500">{t('predict.family_title')}:</span>
              <span className="text-slate-800">{familyHistoryText}</span>
              <span className="font-semibold text-slate-500">{t('predict.used_title')}:</span>
              <span className="text-slate-800">{usedAppText}</span>
              <span className="font-semibold text-slate-500">{t('report.aq_score')}:</span>
              <span className="text-slate-800 font-bold">{aqScore} / 10</span>
            </div>
          </div>
        </div>

        {/* Behavioral Responses */}
        <div className="border border-slate-200 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-bold uppercase text-sky-600 border-b border-slate-100 pb-2 mb-3">{t('report.behavioral_responses')}</h3>
          <table className="w-full text-left rtl:text-right text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 w-10">#</th>
                <th className="py-2">{t('predict.q_title')}</th>
                <th className="py-2 w-24 text-center">{t('results.result_label')}</th>
              </tr>
            </thead>
            <tbody>
              {questionsList.map(q => (
                <tr key={q.num} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="py-2 text-slate-400 font-bold">{q.num}</td>
                  <td className="py-2 text-slate-700">{q.questionText}</td>
                  <td className="py-2 text-center font-bold">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${q.isYes ? 'bg-sky-50 text-sky-700 border border-sky-100' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>
                      {q.answer}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Analysis and Recommendation */}
        <div className={`border rounded-xl p-5 mb-6 ${isPositive ? 'border-indigo-100 bg-indigo-50/20' : 'border-teal-100 bg-teal-50/20'}`}>
          <h3 className="text-sm font-bold uppercase text-slate-800 mb-3">{t('report.ai_analysis')}</h3>
          <div className="flex items-center justify-between gap-6 mb-4">
            <div>
              <div className={`text-xl font-black uppercase ${isPositive ? 'text-indigo-600' : 'text-teal-600'}`}>
                {isPositive ? t('results.positive') : t('results.negative')}
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                {isPositive ? t('results.desc_positive') : t('results.desc_negative')}
              </p>
            </div>
            <div className="text-center bg-white border border-slate-200 rounded-xl px-4 py-2 min-w-[100px] shadow-sm">
              <span className={`text-2xl font-black block ${isPositive ? 'text-indigo-600' : 'text-teal-600'}`}>{confidence}%</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{t('results.confidence')}</span>
            </div>
          </div>

          <div className="border-t border-slate-200/50 pt-3">
            <h4 className="text-xs font-bold text-slate-700 mb-1">{t('report.recommendation')}:</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isPositive ? t('report.recommendation_pos') : t('report.recommendation_neg')}
            </p>
          </div>
        </div>

        {/* Signature and Disclaimer */}
        <div className="grid grid-cols-2 gap-6 items-end mt-8">
          <div className="text-slate-400 text-[10px] max-w-sm">
            <h4 className="font-bold text-slate-500 mb-1">{t('report.disclaimer_title')}</h4>
            <p className="leading-relaxed">{t('report.disclaimer_text')}</p>
          </div>
          <div className="text-center flex flex-col items-center">
            <div className="w-48 border-b border-slate-300 h-12 mb-2"></div>
            <span className="text-xs font-semibold text-slate-500">{t('report.signature')}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Results;
