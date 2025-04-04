import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { predictDisease, getNextSymptoms } from '../../../../lib/api';

// Data
import { allSymptoms, followUpQuestions, treatmentSuggestions } from '../../../data/symptoms';

const QuestionnaireScreen = () => {
  // States
  const [step, setStep] = useState(1);
  const [inputSymptom, setInputSymptom] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [deniedSymptoms, setDeniedSymptoms] = useState([]);
  const [filteredSymptoms, setFilteredSymptoms] = useState([]);
  const [currentSymptomOptions, setCurrentSymptomOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [finalPrediction, setFinalPrediction] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [confidenceHistory, setConfidenceHistory] = useState([]);
  const [showTreatment, setShowTreatment] = useState(false);
  const [diagnosisHistory, setDiagnosisHistory] = useState([]);
  
  // Minimum required symptoms before checking confidence
  const MIN_SYMPTOMS = 2;
  // Confidence threshold to finalize diagnosis
  const CONFIDENCE_THRESHOLD = 0.7;
  // Maximum denied symptoms before changing disease focus
  const MAX_DENIED_PER_DISEASE = 3;

  // Filter symptoms based on input
  useEffect(() => {
    if (inputSymptom.trim()) {
      const filtered = allSymptoms.filter(symptom => 
        symptom.toLowerCase().includes(inputSymptom.toLowerCase())
      );
      setFilteredSymptoms(filtered);
    } else {
      setFilteredSymptoms([]);
    }
  }, [inputSymptom]);

  // Add a new symptom to the list
  const addSymptom = (symptom) => {
    if (!selectedSymptoms.includes(symptom)) {
      const updatedSymptoms = [...selectedSymptoms, symptom];
      setSelectedSymptoms(updatedSymptoms);
      setInputSymptom('');
      
      // Get prediction and next symptom suggestions if we have at least one symptom
      if (updatedSymptoms.length > 0) {
        getUpdatedPrediction(updatedSymptoms, deniedSymptoms);
      }
    }
  };

  // Remove a symptom from the list
  const removeSymptom = (symptom) => {
    const updatedSymptoms = selectedSymptoms.filter(s => s !== symptom);
    setSelectedSymptoms(updatedSymptoms);
    
    // Update prediction with remaining symptoms
    if (updatedSymptoms.length > 0) {
      getUpdatedPrediction(updatedSymptoms, deniedSymptoms);
    } else {
      // Reset if no symptoms left
      setCurrentPrediction(null);
      setCurrentSymptomOptions([]); 
      setConfidence(0);
      setDiagnosisHistory([]);
    }
  };

  // Deny a symptom
  const denySymptom = (symptom) => {
    if (!deniedSymptoms.includes(symptom)) {
      const updatedDenied = [...deniedSymptoms, symptom];
      setDeniedSymptoms(updatedDenied);
      
      // Re-evaluate prediction with the denied symptom
      getUpdatedPrediction(selectedSymptoms, updatedDenied);
    }
  };

  // Handle initial symptom input submission
  const handleSymptomInput = () => {
    if (inputSymptom.trim() && allSymptoms.includes(inputSymptom.trim())) {
      addSymptom(inputSymptom.trim());
    }
  };

  // Get prediction from the API
  const getUpdatedPrediction = async (symptoms, denied = []) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await predictDisease(symptoms, denied);
      
      // Track diagnosis changes
      if (currentPrediction && 
          currentPrediction["Most Probable Disease"] !== result.prediction["Most Probable Disease"]) {
        setDiagnosisHistory([
          ...diagnosisHistory, 
          currentPrediction["Most Probable Disease"]
        ]);
      }
      
      setCurrentPrediction(result.prediction);
      
      // Set next symptom options
      setCurrentSymptomOptions(result.suggested_symptoms || []);
      
      // Track confidence
      const newConfidence = result.prediction.Confidence || 0;
      setConfidence(newConfidence);
      setConfidenceHistory([...confidenceHistory, newConfidence]);
      
      // Check if we have enough confidence to finalize the diagnosis
      if (symptoms.length >= MIN_SYMPTOMS && newConfidence >= CONFIDENCE_THRESHOLD) {
        setFinalPrediction(result.prediction);
        setStep(3);
      } else if (step === 1 && symptoms.length >= 1) {
        // Move to step 2 once we have the first prediction
        setStep(2);
      }
      
    } catch (err) {
      setError('Error getting prediction. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle when user selects a symptom option in step 2
  const handleSymptomResponse = (symptom, isPresent) => {
    if (isPresent) {
      addSymptom(symptom);
    } else {
      denySymptom(symptom);
      
      // If too many denials for the same disease, request new symptom suggestions
      const deniedCount = deniedSymptoms.length;
      
      if (deniedCount > 0 && deniedCount % MAX_DENIED_PER_DISEASE === 0) {
        getNextSymptomSuggestions();
      }
    }
  };
  
  // Get fresh symptom suggestions
  const getNextSymptomSuggestions = async () => {
    setIsLoading(true);
    
    try {
      const result = await getNextSymptoms(
        selectedSymptoms, 
        deniedSymptoms,
        currentPrediction ? currentPrediction["Most Probable Disease"] : null,
        currentPrediction ? currentPrediction["Possible Alternatives"] : [],
        confidence
      );
      
      setCurrentSymptomOptions(result.suggested_symptoms || []);
      
      // Update prediction if it changed
      if (result.prediction && 
          (!currentPrediction || 
           currentPrediction["Most Probable Disease"] !== result.prediction["Most Probable Disease"])) {
        setCurrentPrediction(result.prediction);
        setConfidence(result.prediction.Confidence || 0);
      }
    } catch (err) {
      console.error("Error getting next symptoms:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Start over
  const handleStartOver = () => {
    setStep(1);
    setSelectedSymptoms([]);
    setDeniedSymptoms([]);
    setInputSymptom('');
    setCurrentSymptomOptions([]);
    setCurrentPrediction(null);
    setFinalPrediction(null);
    setConfidence(0);
    setConfidenceHistory([]);
    setDiagnosisHistory([]);
    setShowTreatment(false);
  };

  // Finalize diagnosis
  const handleFinalizeDiagnosis = () => {
    setFinalPrediction(currentPrediction);
    setStep(3);
  };

  // Get treatment suggestions for a disease
  const getTreatmentSuggestions = (diseaseName) => {
    return treatmentSuggestions[diseaseName] || treatmentSuggestions.default;
  };

  // Render confidence indicator
  const renderConfidenceIndicator = () => {
    const confidencePercent = Math.round(confidence * 100);
    return (
      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>
          Diagnostic Confidence: {confidencePercent}%
        </Text>
        <View style={{ height: 8, backgroundColor: '#eee', borderRadius: 4 }}>
          <View 
            style={{ 
              height: '100%', 
              width: `${confidencePercent}%`, 
              backgroundColor: confidencePercent > 70 ? '#4CAF50' : confidencePercent > 40 ? '#FFC107' : '#FF5722',
              borderRadius: 4
            }} 
          />
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={{ flex: 1, padding: 15, backgroundColor: '#fff' }}>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#4285F4' }}>MediCure</Text>
        <Text style={{ color: '#666' }}>Your AI Medical Assistant</Text>
      </View>
      
      {/* Step 1: Initial Symptom Input */}
      {step === 1 && (
        <View>
          <Text style={{ fontSize: 18, fontWeight: '500', marginBottom: 10 }}>
            What symptoms are you experiencing?
          </Text>
          <Text style={{ color: '#666', marginBottom: 15 }}>
            Enter your primary symptom below
          </Text>
          
          <TextInput
            value={inputSymptom}
            onChangeText={setInputSymptom}
            placeholder="Type a symptom, e.g. 'fever'"
            style={{ 
              backgroundColor: '#f1f3f4', 
              padding: 12, 
              borderRadius: 8, 
              marginBottom: 15 
            }}
            onSubmitEditing={handleSymptomInput}
          />
          
          {filteredSymptoms.length > 0 && (
            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
                Suggested symptoms:
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {filteredSymptoms.slice(0, 8).map(symptom => (
                  <TouchableOpacity
                    key={symptom}
                    style={{
                      backgroundColor: '#f1f3f4',
                      padding: 8,
                      paddingHorizontal: 12,
                      borderRadius: 20,
                      margin: 4
                    }}
                    onPress={() => addSymptom(symptom)}
                  >
                    <Text style={{ color: '#333', fontWeight: '500' }}>
                      {symptom}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          
          {selectedSymptoms.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
                Selected symptoms:
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {selectedSymptoms.map(symptom => (
                  <TouchableOpacity
                    key={symptom}
                    style={{
                      backgroundColor: '#4285F4',
                      padding: 8,
                      paddingHorizontal: 12,
                      borderRadius: 20,
                      margin: 4,
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                    onPress={() => removeSymptom(symptom)}
                  >
                    <Text style={{ color: '#fff', fontWeight: '500', marginRight: 5 }}>
                      {symptom}
                    </Text>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>✕</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          
          {deniedSymptoms.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
                Denied symptoms:
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {deniedSymptoms.map(symptom => (
                  <View
                    key={symptom}
                    style={{
                      backgroundColor: '#f1f3f4',
                      padding: 8,
                      paddingHorizontal: 12,
                      borderRadius: 20,
                      margin: 4,
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <Text style={{ color: '#777', fontWeight: '500', marginRight: 5 }}>
                      {symptom}
                    </Text>
                    <Text style={{ color: '#FF5722', fontWeight: 'bold' }}>✕</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {isLoading && (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#4285F4" />
              <Text style={{ marginTop: 10, color: '#666' }}>Analyzing your symptoms...</Text>
            </View>
          )}
          
          {error && (
            <Text style={{ color: 'red', marginBottom: 15 }}>{error}</Text>
          )}
          
          {currentPrediction && selectedSymptoms.length > 0 && (
            <View style={{ backgroundColor: '#f0f7ff', padding: 15, borderRadius: 8, marginBottom: 15 }}>
              <Text style={{ fontSize: 16, color: '#333', marginBottom: 5, fontWeight: '500' }}>
                Initial Assessment:
              </Text>
              <Text style={{ color: '#4285F4', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                {currentPrediction["Most Probable Disease"]}
              </Text>
              
              {renderConfidenceIndicator()}
              
              <TouchableOpacity
                style={{
                  backgroundColor: '#4285F4',
                  padding: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                  marginTop: 10
                }}
                onPress={() => setStep(2)}
              >
                <Text style={{ color: '#fff', fontWeight: '500' }}>Continue with Assessment</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {selectedSymptoms.length === 0 && !isLoading && (
            <Text style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', marginTop: 20 }}>
              Please enter your symptoms to begin the assessment
            </Text>
          )}
        </View>
      )}
      
      {/* Step 2: Guided Symptom Questions */}
      {step === 2 && (
        <View>
          <Text style={{ fontSize: 18, fontWeight: '500', marginBottom: 5 }}>
            Follow-up Questions
          </Text>
          
          <Text style={{ color: '#666', marginBottom: 15 }}>
            Do you have any of these symptoms?
          </Text>
          
          {selectedSymptoms.length > 0 && (
            <View style={{ marginBottom: 15, flexDirection: 'row', flexWrap: 'wrap' }}>
              {selectedSymptoms.map(symptom => (
                <TouchableOpacity
                  key={symptom}
                  style={{
                    backgroundColor: '#4285F4',
                    padding: 6,
                    paddingHorizontal: 10,
                    borderRadius: 20,
                    margin: 3,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                  onPress={() => removeSymptom(symptom)}
                >
                  <Text style={{ color: '#fff', fontSize: 13, marginRight: 3 }}>
                    {symptom}
                  </Text>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>✕</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {isLoading ? (
            <View style={{ padding: 30, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#4285F4" />
              <Text style={{ marginTop: 15, color: '#666' }}>Analyzing your symptoms...</Text>
            </View>
          ) : (
            <View>
              {currentSymptomOptions.map((symptom, index) => (
                <View key={symptom} style={{ marginBottom: 15 }}>
                  <Text style={{ fontSize: 16, marginBottom: 10 }}>
                    Do you have <Text style={{ fontWeight: 'bold' }}>{symptom}</Text>?
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#4CAF50',
                        padding: 8,
                        borderRadius: 8,
                        marginRight: 10,
                        flex: 1,
                        alignItems: 'center'
                      }}
                      onPress={() => handleSymptomResponse(symptom, true)}
                    >
                      <Text style={{ color: 'white', fontWeight: '500' }}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#F44336',
                        padding: 8,
                        borderRadius: 8,
                        flex: 1,
                        alignItems: 'center'
                      }}
                      onPress={() => handleSymptomResponse(symptom, false)}
                    >
                      <Text style={{ color: 'white', fontWeight: '500' }}>No</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              
              {currentSymptomOptions.length === 0 && (
                <View style={{ alignItems: 'center', padding: 20 }}>
                  <Text style={{ color: '#666', marginBottom: 15 }}>
                    No more relevant symptoms to suggest.
                  </Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#4285F4',
                      padding: 10,
                      borderRadius: 8,
                    }}
                    onPress={getNextSymptomSuggestions}
                  >
                    <Text style={{ color: 'white' }}>Try Different Symptom Suggestions</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Current prediction display */}
          {currentPrediction && !isLoading && (
            <View style={{ backgroundColor: '#f0f7ff', padding: 15, borderRadius: 8, marginBottom: 15, marginTop: 20 }}>
              <Text style={{ fontSize: 16, color: '#333', marginBottom: 5, fontWeight: '500' }}>
                Current Assessment:
              </Text>
              <Text style={{ color: '#4285F4', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                {currentPrediction["Most Probable Disease"]}
              </Text>
              
              {renderConfidenceIndicator()}
              
              {diagnosisHistory.length > 0 && (
                <View style={{ marginBottom: 10 }}>
                  <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>
                    Previous considerations:
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {diagnosisHistory.map((disease, index) => (
                      <Text key={index} style={{ color: '#888', fontSize: 12, marginRight: 10 }}>
                        {disease}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
              
              {/* Option to go back to symptom search */}
              <TouchableOpacity
                style={{
                  backgroundColor: '#f1f3f4',
                  padding: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                  marginTop: 10,
                  marginBottom: 10
                }}
                onPress={() => setStep(1)}
              >
                <Text style={{ color: '#555', fontWeight: '500' }}>Add Different Symptom</Text>
              </TouchableOpacity>
              
              {/* Finalize diagnosis button */}
              {selectedSymptoms.length >= MIN_SYMPTOMS && (
                <TouchableOpacity
                  style={{
                    backgroundColor: '#4285F4',
                    padding: 12,
                    borderRadius: 8,
                    alignItems: 'center'
                  }}
                  onPress={handleFinalizeDiagnosis}
                >
                  <Text style={{ color: '#fff', fontWeight: '500' }}>Finalize Diagnosis</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}
      
      {/* Step 3: Result */}
      {step === 3 && finalPrediction && (
        <View>
          <Text style={{ fontSize: 18, fontWeight: '500', marginBottom: 10 }}>
            Diagnosis Result
          </Text>
          
          <View style={{ backgroundColor: '#f0f7ff', padding: 15, borderRadius: 8, marginBottom: 20 }}>
            <View style={{ marginBottom: 15 }}>
              <Text style={{ color: '#333', fontWeight: '500', marginBottom: 5 }}>
                Most Probable Disease:
              </Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#4285F4' }}>
                {finalPrediction["Most Probable Disease"]}
              </Text>
              <Text style={{ fontSize: 14, color: '#666', marginTop: 5 }}>
                Confidence: {Math.round(finalPrediction["Confidence"] * 100)}%
              </Text>
            </View>
            
            <View style={{ marginBottom: 15 }}>
              <Text style={{ color: '#333', fontWeight: '500', marginBottom: 5 }}>
                Alternative Possibilities:
              </Text>
              <View>
                {finalPrediction["Possible Alternatives"].map((disease, index) => (
                  <Text key={index} style={{ color: '#555', marginBottom: 3 }}>
                    • {disease} {finalPrediction["All Confidence Scores"] && finalPrediction["All Confidence Scores"][disease] 
                      ? `(${Math.round(finalPrediction["All Confidence Scores"][disease] * 100)}%)` 
                      : ''}
                  </Text>
                ))}
              </View>
            </View>
            
            <View style={{ marginBottom: 15 }}>
              <Text style={{ color: '#333', fontWeight: '500', marginBottom: 5 }}>
                Based on your symptoms:
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {selectedSymptoms.map(symptom => (
                  <View
                    key={symptom}
                    style={{
                      backgroundColor: '#e6effd',
                      padding: 6,
                      paddingHorizontal: 10,
                      borderRadius: 20,
                      margin: 3
                    }}
                  >
                    <Text style={{ color: '#4285F4', fontSize: 13 }}>
                      {symptom}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            
            {!showTreatment ? (
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: '#4285F4',
                  padding: 10,
                  borderRadius: 8,
                  alignItems: 'center',
                  marginTop: 10
                }}
                onPress={() => setShowTreatment(true)}
              >
                <Text style={{ color: '#4285F4', fontWeight: '500' }}>See Recommended Actions</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ marginTop: 10 }}>
                <Text style={{ color: '#333', fontWeight: '500', marginBottom: 10 }}>
                  Recommended Actions:
                </Text>
                {getTreatmentSuggestions(finalPrediction["Most Probable Disease"]).map((suggestion, index) => (
                  <View key={index} style={{ flexDirection: 'row', marginBottom: 8 }}>
                    <Text style={{ color: '#4285F4', marginRight: 8 }}>•</Text>
                    <Text style={{ color: '#555', flex: 1 }}>{suggestion}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
          
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#f1f3f4',
                padding: 12,
                borderRadius: 8,
                alignItems: 'center',
                flex: 1,
                marginRight: 8
              }}
              onPress={handleStartOver}
            >
              <Text style={{ color: '#555', fontWeight: '500' }}>Start New Assessment</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={{ marginTop: 20, color: '#666', fontStyle: 'italic', textAlign: 'center' }}>
            This is not a substitute for professional medical advice. If your symptoms are severe or persist, please consult a healthcare provider.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default QuestionnaireScreen; 