// API functions for MediCure

// Base URL for the API
// Change from localhost to your computer's IP address for mobile compatibility
const API_BASE_URL = 'http://127.0.0.1:8000'; // Your computer's actual IP address

/**
 * Predicts disease based on symptoms
 * @param {Array} symptoms - Array of symptom strings
 * @param {Array} deniedSymptoms - Array of symptoms the user denied having
 * @returns {Promise} - Promise with prediction results
 */
export const predictDisease = async (symptoms, deniedSymptoms = []) => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        symptoms, 
        denied_symptoms: deniedSymptoms 
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error predicting disease: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error predicting disease:', error);
    throw error;
  }
};

/**
 * Gets suggested next symptoms based on current symptoms
 * @param {Array} currentSymptoms - Array of current symptom strings
 * @param {Array} deniedSymptoms - Array of symptoms the user denied having
 * @param {string} predictedDisease - Current most likely disease
 * @param {Array} alternativeDiseases - Other possible diseases to explore
 * @param {number} confidenceThreshold - Optional confidence threshold
 * @returns {Promise} - Promise with next symptom suggestions
 */
export const getNextSymptoms = async (
  currentSymptoms, 
  deniedSymptoms = [], 
  predictedDisease = null,
  alternativeDiseases = [],
  confidenceThreshold = 0.5
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/next-symptoms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        current_symptoms: currentSymptoms,
        denied_symptoms: deniedSymptoms,
        predicted_disease: predictedDisease,
        alternative_diseases: alternativeDiseases,
        confidence_threshold: confidenceThreshold 
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error getting next symptoms: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting next symptoms:', error);
    throw error;
  }
};
