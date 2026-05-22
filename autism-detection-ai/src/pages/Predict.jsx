import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingScreen from '../components/LoadingScreen';
import { predictAutism } from '../services/api';
import { useTranslation } from 'react-i18next';

const Predict = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    age: '',
    gender: 'm', // Default to male 'm' or female 'f' depending on typical mappings. Leaving as 'm'/'f' or '1'/'0' - string for now.
    country: 'United States',
    ethnicity: 'White-European',
    relation: 'Self',
    // Step 2: Medical
    jaundice: 'no',
    austim: 'no', // Family history (typo 'austim' matching prompt requirement)
    used_app_before: 'no',
    // Step 3: A1-A10
    A1: '0', A2: '0', A3: '0', A4: '0', A5: '0',
    A6: '0', A7: '0', A8: '0', A9: '0', A10: '0',
  });

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Compute 'result' = sum of A1 to A10 (the AQ-10 score used by the model)
    const aqScore = [
      formData.A1, formData.A2, formData.A3, formData.A4, formData.A5,
      formData.A6, formData.A7, formData.A8, formData.A9, formData.A10
    ].reduce((sum, val) => sum + parseInt(val), 0);

    // Prepare array exactly matching model training column order:
    // A1, A2, A3, A4, A5, A6, A7, A8, A9, A10,
    // age, gender, ethnicity, jundice, austim,
    // contry_of_res, used_app_before, result, relation
    const payloadArray = [
      formData.A1, formData.A2, formData.A3, formData.A4, formData.A5,
      formData.A6, formData.A7, formData.A8, formData.A9, formData.A10,
      formData.age,
      formData.gender,
      formData.ethnicity,
      formData.jaundice,
      formData.austim,
      formData.country,
      formData.used_app_before,
      String(aqScore), // result = total AQ-10 score
      formData.relation
    ];

    // Call API Service
    const result = await predictAutism(payloadArray);
    
    if (result.success) {
      // Add artificial delay just to show off the cool loading screen to the professors
      setTimeout(() => {
        navigate('/results', { state: { prediction: result.data, inputData: formData } });
      }, 1500); 
    } else {
      setIsLoading(false);
      setError(t('predict.error_network'));
    }
  };

  // UI variants
  const variants = {
    initial: { opacity: 0, x: i18n.language === 'ar' ? -20 : 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: i18n.language === 'ar' ? 20 : -20 }
  };

  return (
    <div className="max-w-3xl mx-auto w-full relative">
      {isLoading && <LoadingScreen />}

      <div className="mb-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-slate-800 dark:text-white">{t('predict.title')}</h1>
        
        {/* Step Indicator */}
        <div className="flex items-center w-full max-w-md">
          {[1, 2, 3].map((num) => (
            <React.Fragment key={num}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${step >= num ? 'bg-sky-500 dark:bg-teal-500 text-white shadow-md shadow-sky-500/20 dark:shadow-teal-500/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                {num}
              </div>
              {num < 3 && (
                <div className={`flex-1 h-1 mx-2 rounded-full transition-colors duration-500 ${step > num ? 'bg-sky-500 dark:bg-teal-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between w-full max-w-md mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>{t('predict.step_personal')}</span>
          <span className="mx-2 text-center">{t('predict.step_medical')}</span>
          <span>{t('predict.step_behavioral')}</span>
        </div>
      </div>

      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
          <AnimatePresence mode="wait">
            
            {/* STEP 1 */}
            {step === 1 && (
              <motion.div key="step1" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <h2 className="text-xl font-semibold text-sky-600 dark:text-teal-400 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">{t('predict.step1_title')}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('predict.age')}</label>
                    <input 
                      type="number" required min="1" max="100"
                      value={formData.age} onChange={(e) => updateForm('age', e.target.value)}
                      className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-white focus:outline-none focus:border-sky-500 dark:focus:border-teal-500 focus:ring-1 focus:ring-sky-500 dark:focus:ring-teal-500 transition-colors shadow-sm"
                      placeholder={t('predict.age_placeholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('predict.gender')}</label>
                    <select 
                      value={formData.gender} onChange={(e) => updateForm('gender', e.target.value)}
                      className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-white focus:outline-none focus:border-sky-500 dark:focus:border-teal-500 transition-colors appearance-none shadow-sm"
                    >
                      <option value="m">{t('predict.male')}</option>
                      <option value="f">{t('predict.female')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('predict.ethnicity')}</label>
                    <input 
                      type="text" required
                      value={formData.ethnicity} onChange={(e) => updateForm('ethnicity', e.target.value)}
                      className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-white focus:outline-none focus:border-sky-500 dark:focus:border-teal-500 transition-colors shadow-sm"
                      placeholder={t('predict.ethnicity_placeholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('predict.country')}</label>
                    <input 
                      type="text" required
                      value={formData.country} onChange={(e) => updateForm('country', e.target.value)}
                      className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-white focus:outline-none focus:border-sky-500 dark:focus:border-teal-500 transition-colors shadow-sm"
                      placeholder={t('predict.country_placeholder')}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('predict.relation')}</label>
                    <select 
                      value={formData.relation} onChange={(e) => updateForm('relation', e.target.value)}
                      className="w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-white focus:outline-none focus:border-sky-500 dark:focus:border-teal-500 transition-colors appearance-none shadow-sm"
                    >
                      <option value="Self">{t('predict.relation_self')}</option>
                      <option value="Parent">{t('predict.relation_parent')}</option>
                      <option value="Health care professional">{t('predict.relation_hcp')}</option>
                      <option value="Relative">{t('predict.relation_relative')}</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div key="step2" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <h2 className="text-xl font-semibold text-sky-600 dark:text-teal-400 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">{t('predict.step2_title')}</h2>
                
                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-slate-800 dark:text-white font-medium">{t('predict.jaundice_title')}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('predict.jaundice_desc')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => updateForm('jaundice', 'yes')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.jaundice === 'yes' ? 'bg-sky-500 dark:bg-teal-500 text-white shadow-sm' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>{t('predict.yes')}</button>
                      <button type="button" onClick={() => updateForm('jaundice', 'no')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.jaundice === 'no' ? 'bg-sky-500 dark:bg-teal-500 text-white shadow-sm' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>{t('predict.no')}</button>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-slate-800 dark:text-white font-medium">{t('predict.family_title')}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('predict.family_desc')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => updateForm('austim', 'yes')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.austim === 'yes' ? 'bg-sky-500 dark:bg-teal-500 text-white shadow-sm' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>{t('predict.yes')}</button>
                      <button type="button" onClick={() => updateForm('austim', 'no')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.austim === 'no' ? 'bg-sky-500 dark:bg-teal-500 text-white shadow-sm' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>{t('predict.no')}</button>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-slate-800 dark:text-white font-medium">{t('predict.used_title')}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('predict.used_desc')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => updateForm('used_app_before', 'yes')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.used_app_before === 'yes' ? 'bg-sky-500 dark:bg-teal-500 text-white shadow-sm' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>{t('predict.yes')}</button>
                      <button type="button" onClick={() => updateForm('used_app_before', 'no')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.used_app_before === 'no' ? 'bg-sky-500 dark:bg-teal-500 text-white shadow-sm' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>{t('predict.no')}</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <h2 className="text-xl font-semibold text-sky-600 dark:text-teal-400 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">{t('predict.step3_title')}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t('predict.step3_desc')}</p>
                
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                    const key = `A${num}`;
                    return (
                      <div key={key} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between gap-4">
                        <div>
                          <h4 className="text-slate-800 dark:text-white font-medium text-sm">
                            {t('predict.q_title')} <bdi>{key}</bdi>
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {t(`predict.q${num}`)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => updateForm(key, '1')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${formData[key] === '1' ? 'bg-sky-500 dark:bg-teal-500 text-white shadow-sm' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>{t('predict.yes')}</button>
                          <button type="button" onClick={() => updateForm(key, '0')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${formData[key] === '0' ? 'bg-sky-500 dark:bg-teal-500 text-white shadow-sm' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>{t('predict.no')}</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          <div className="mt-8 flex justify-between border-t border-slate-200 dark:border-slate-700 pt-6">
            <button 
              type="button" 
              onClick={prevStep}
              className={`px-6 py-2 rounded-xl font-medium transition-opacity ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}
            >
              {t('predict.btn_back')}
            </button>
            <button 
              type="submit"
              className="btn-primary"
            >
              {step === 3 ? t('predict.btn_analyze') : t('predict.btn_continue')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Predict;
