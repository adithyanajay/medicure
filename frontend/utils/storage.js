// Simple storage utility for managing symptom data

export const storeSymptoms = (symptoms) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('medicure_symptoms', JSON.stringify(symptoms));
  }
};

export const getStoredSymptoms = () => {
  if (typeof localStorage !== 'undefined') {
    const storedSymptoms = localStorage.getItem('medicure_symptoms');
    return storedSymptoms ? JSON.parse(storedSymptoms) : [];
  }
  return [];
};

export const clearStoredSymptoms = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('medicure_symptoms');
  }
};



