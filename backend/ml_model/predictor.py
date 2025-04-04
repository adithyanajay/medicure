import joblib
import numpy as np
import pandas as pd
import os
import traceback

# Load Symptom-Severity Mapping
file_path = os.path.join(os.path.dirname(__file__), "Symptom-severity.csv")
df = pd.read_csv(file_path)

# Create Dictionary
symptom_map = {row["Symptom"].strip().lower(): row["weight"] for _, row in df.iterrows()}

# Print Python version for debugging
import sys
print(f"Python version: {sys.version}")

# Print model paths for debugging
model_nb_path = os.path.join(os.path.dirname(__file__), "model_nb.pkl")
model_rf_path = os.path.join(os.path.dirname(__file__), "model_rf.pkl")
print(f"NB Model path: {model_nb_path}")
print(f"RF Model path: {model_rf_path}")
print(f"Model files exist: NB={os.path.exists(model_nb_path)}, RF={os.path.exists(model_rf_path)}")

# Load the models
try:
    nb_model = joblib.load(model_nb_path)
    rf_model = joblib.load(model_rf_path)
    print("Models loaded successfully")
    
    # Get the expected feature count for both models
    nb_expected_features = nb_model.n_features_in_ if hasattr(nb_model, 'n_features_in_') else 17
    rf_expected_features = rf_model.n_features_in_ if hasattr(rf_model, 'n_features_in_') else 17
    print(f"NB model expects {nb_expected_features} features")
    print(f"RF model expects {rf_expected_features} features")
except Exception as e:
    print(f"Error loading models: {str(e)}")
    raise

def pad_symptoms_array(symptoms_array, target_features):
    """Pad the symptoms array to match the expected number of features"""
    current_features = symptoms_array.shape[1]
    if current_features < target_features:
        # Add zero-filled columns to match the expected feature count
        padding = np.zeros((symptoms_array.shape[0], target_features - current_features))
        return np.hstack((symptoms_array, padding))
    return symptoms_array

# Define a comprehensive disease-symptom mapping (optimized for most common diseases)
disease_symptom_map = {
    # Respiratory diseases
    "Common Cold": ["cough", "runny_nose", "sore_throat", "mild_fever", "sneezing", "congestion"],
    "Influenza": ["high_fever", "headache", "chills", "fatigue", "body_aches", "cough", "sore_throat"],
    "Pneumonia": ["cough", "high_fever", "chest_pain", "shortness_of_breath", "fatigue", "phlegm"],
    "Bronchitis": ["cough", "phlegm", "fatigue", "slight_fever", "chest_discomfort", "wheezing"],
    "Asthma": ["wheezing", "shortness_of_breath", "chest_tightness", "cough", "rapid_breathing"],
    
    # ENT conditions
    "Allergic Rhinitis": ["sneezing", "runny_nose", "itchy_eyes", "nasal_congestion", "watery_eyes"],
    "Sinusitis": ["facial_pain", "nasal_congestion", "headache", "thick_nasal_discharge", "reduced_smell"],
    
    # Infectious diseases
    "Malaria": ["high_fever", "sweating", "chills", "headache", "nausea", "vomiting", "muscle_pain"],
    "Dengue": ["high_fever", "severe_headache", "joint_pain", "rash", "bleeding_gums", "eye_pain"],
    "Typhoid": ["high_fever", "weakness", "abdominal_pain", "headache", "diarrhea", "constipation", "rash"],
    "Tuberculosis": ["cough", "bloody_sputum", "night_sweats", "weight_loss", "fatigue", "fever", "chest_pain"],
    
    # Digestive system
    "GERD": ["heartburn", "chest_pain", "difficulty_swallowing", "regurgitation", "sour_taste", "cough"],
    "Peptic Ulcer": ["burning_stomach_pain", "bloating", "heartburn", "nausea", "weight_loss", "vomiting"],
    "Gastroenteritis": ["diarrhea", "abdominal_cramps", "nausea", "vomiting", "fever", "dehydration"],
    
    # Liver conditions
    "Jaundice": ["yellowing_of_skin", "dark_urine", "pale_stools", "fatigue", "abdominal_pain", "weight_loss"],
    "Hepatitis": ["fatigue", "nausea", "abdominal_pain", "loss_of_appetite", "yellowing_of_skin", "dark_urine"],
    
    # Neurological
    "Migraine": ["severe_headache", "nausea", "sensitivity_to_light", "blurred_vision", "fatigue", "aura"],
    
    # Cardiovascular
    "Hypertension": ["headache", "shortness_of_breath", "dizziness", "chest_pain", "blurred_vision", "nose_bleeds"],
    
    # Endocrine
    "Diabetes": ["increased_thirst", "frequent_urination", "hunger", "fatigue", "blurred_vision", "weight_loss"],
    
    # Musculoskeletal
    "Arthritis": ["joint_pain", "stiffness", "swelling", "decreased_range_of_motion", "redness", "joint_warmth"],
    "Osteoporosis": ["back_pain", "loss_of_height", "stooped_posture", "bone_fracture", "neck_pain"],
    
    # Genitourinary
    "Urinary Tract Infection": ["burning_urination", "frequent_urination", "cloudy_urine", "strong_odor", "pelvic_pain", "blood_in_urine"],
    
    # Dermatological
    "Psoriasis": ["red_patches", "silver_scales", "dry_skin", "itching", "swollen_joints", "thick_nails"],
    "Eczema": ["itchy_skin", "red_rash", "small_bumps", "thickened_skin", "dry_skin", "sensitive_skin"],
    "Acne": ["pimples", "whiteheads", "blackheads", "skin_inflammation", "oily_skin", "scarring"],
    "Drug Reaction": ["skin_rash", "itching", "fever", "facial_swelling", "joint_pain", "shortness_of_breath"],
    "Fungal infection": ["itching", "rash", "skin_lesion", "scaly_skin", "discoloration", "swelling"],
    
    # Metabolic
    "Hypoglycemia": ["hunger", "shaking", "sweating", "dizziness", "confusion", "anxiety", "weakness"],
    "Hyperthyroidism": ["weight_loss", "rapid_heartbeat", "increased_appetite", "tremor", "sweating", "fatigue"],
    "Hypothyroidism": ["fatigue", "weight_gain", "cold_sensitivity", "dry_skin", "constipation", "depression"],
    
    # Other common conditions
    "Impetigo": ["red_sores", "blisters", "itching", "skin_rash", "swollen_lymph_nodes", "fever"],
    "Paralysis (brain hemorrhage)": ["weakness", "numbness", "confusion", "headache", "difficulty_speaking", "vision_problems"],
    "Cervical spondylosis": ["neck_pain", "stiffness", "headache", "tingling", "numbness_in_arms", "weakness"],
    "Heart attack": ["chest_pain", "shortness_of_breath", "cold_sweat", "nausea", "arm_pain", "dizziness"],
    "Varicose veins": ["visible_veins", "leg_pain", "swelling", "heaviness", "itching", "cramping"],
    "Osteoarthristis": ["joint_pain", "stiffness", "swelling", "reduced_mobility", "grating_sensation", "bone_spurs"]
}

# Add more common respiratory symptoms to relevant diseases
for disease in ["Common Cold", "Influenza", "Pneumonia", "Bronchitis", "Asthma"]:
    if disease in disease_symptom_map:
        disease_symptom_map[disease].extend(["cough", "sore_throat", "fever"])

# Enhance common disease mappings with more variations and symptoms
disease_symptom_map["Common Cold"] = ["runny_nose", "stuffy_nose", "sneezing", "cough", "sore_throat", 
                                     "mild_fever", "headache", "fatigue", "body_aches", "congestion"]
disease_symptom_map["Influenza"] = ["high_fever", "fever", "cough", "body_aches", "fatigue", "headache", 
                                   "chills", "sore_throat", "runny_nose", "congestion"]
disease_symptom_map["Fever"] = ["elevated_temperature", "chills", "sweating", "headache", "muscle_aches",
                               "dehydration", "weakness", "fatigue"]
disease_symptom_map["Allergic Rhinitis"] = ["sneezing", "runny_nose", "nasal_congestion", "itchy_eyes", 
                                          "watery_eyes", "itchy_nose", "itchy_throat"]

# Define primary symptoms for each disease (most important diagnostic indicators)
primary_symptoms = {
    "Urinary Tract Infection": ["burning_urination", "frequent_urination", "pelvic_pain", "cloudy_urine"],
    "Fungal infection": ["itching", "rash", "skin_lesion", "scaly_skin"],
    "Common Cold": ["runny_nose", "cough", "sore_throat", "sneezing", "congestion"],
    "Pneumonia": ["cough", "high_fever", "chest_pain", "shortness_of_breath"],
    "Dengue": ["high_fever", "severe_headache", "joint_pain", "rash"],
    "Tuberculosis": ["persistent_cough", "bloody_sputum", "weight_loss", "night_sweats"],
    "Cervical spondylosis": ["neck_pain", "stiffness", "numbness_in_arms", "tingling"],
    "Influenza": ["high_fever", "fever", "cough", "body_aches", "fatigue", "headache"],
    "Jaundice": ["yellowing_of_skin", "dark_urine", "fatigue"],
    "Malaria": ["high_fever", "chills", "sweating", "headache"],
    "Hepatitis": ["yellowing_of_skin", "fatigue", "abdominal_pain", "dark_urine"],
    "Migraine": ["severe_headache", "sensitivity_to_light", "nausea"],
    "Hypertension": ["headache", "dizziness", "nose_bleeds"],
    "Diabetes": ["increased_thirst", "frequent_urination", "fatigue", "weight_loss"],
    "Gastroenteritis": ["diarrhea", "vomiting", "nausea", "abdominal_cramps"],
    "Fever": ["elevated_temperature", "chills", "sweating", "headache"],
    "Allergic Rhinitis": ["sneezing", "runny_nose", "itchy_eyes", "nasal_congestion"]
}

# Fill in primary symptoms for any diseases not explicitly defined
for disease, symptoms in disease_symptom_map.items():
    if disease not in primary_symptoms and len(symptoms) >= 3:
        primary_symptoms[disease] = symptoms[:3]  # Use first 3 symptoms as primary

def calc_symptom_overlap(disease, symptoms):
    """
    Calculate the overlap between the user's symptoms and a disease's symptoms
    Returns:
        - overlap_score: float between 0-1 indicating degree of symptom match
        - primary_match: float between 0-1 indicating match with primary symptoms
    """
    if disease not in disease_symptom_map:
        return 0.0, 0.0
    
    disease_symptoms = disease_symptom_map[disease]
    
    # Convert everything to lowercase for case-insensitive matching
    symptoms_lower = [s.lower() for s in symptoms]
    disease_symptoms_lower = [s.lower() for s in disease_symptoms]
    
    # Calculate overall symptom overlap
    matches = sum(1 for s in symptoms_lower if any(s in ds for ds in disease_symptoms_lower))
    if not symptoms:
        overlap_score = 0.0
    else:
        overlap_score = matches / len(symptoms)
    
    # Calculate primary symptom match
    if disease in primary_symptoms:
        primary_disease_symptoms = [s.lower() for s in primary_symptoms[disease]]
        primary_matches = sum(1 for s in symptoms_lower if any(s in ds for ds in primary_disease_symptoms))
        if not primary_disease_symptoms:
            primary_match = 0.0
        else:
            primary_match = primary_matches / len(primary_disease_symptoms)
    else:
        primary_match = 0.0
    
    return overlap_score, primary_match

def get_key_symptoms_for_disease(disease):
    """Get the most important symptoms for a specific disease"""
    disease_str = str(disease)
    return primary_symptoms.get(disease_str, disease_symptom_map.get(disease_str, [])[:3])

def is_prediction_medically_plausible(disease, symptoms, threshold=0.2):
    """
    Determine if a prediction is medically plausible based on symptom overlap
    """
    if not symptoms:
        return False
        
    overlap, primary_match = calc_symptom_overlap(disease, symptoms)
    
    # Prediction is plausible if there's sufficient overlap with disease symptoms
    # or if there's a match with primary symptoms
    return overlap >= threshold or primary_match > 0

def hybrid_predict(symptoms, denied_symptoms=None):
    """
    Make disease predictions based on symptoms and account for denied symptoms.
    
    Args:
        symptoms (list): List of symptom strings the user has confirmed
        denied_symptoms (list, optional): List of symptoms the user has explicitly denied
    
    Returns:
        dict: Prediction results with disease probabilities and confidence scores
    """
    try:
        print(f"Starting prediction with symptoms: {symptoms}")
        if denied_symptoms:
            print(f"User has denied these symptoms: {denied_symptoms}")
        
        # Convert symptom names to numeric severity values
        symptom_weights = [symptom_map.get(symptom.lower().strip(), 0) for symptom in symptoms]
        print(f"Converted Symptoms to Weights: {symptom_weights}")
        
        # Ensure the array is numeric and properly shaped
        symptoms_array = np.array(symptom_weights, dtype=np.float64).reshape(1, -1)
        print(f"Symptoms array shape: {symptoms_array.shape}")
        
        # Too few symptoms - return minimal confidence or default predictions
        if len(symptoms) < 1:
            return {
                "Most Probable Disease": "Insufficient symptoms",
                "Possible Alternatives": ["Please provide more symptoms", "Unable to diagnose"],
                "Confidence": 0.1,
                "All Confidence Scores": {"Insufficient data": 0.1}
            }
        
        # SPECIAL CASE: Handle common illnesses with simple symptom patterns
        # This overrides the ML model when clear patterns are present
        common_illness_match = None
        common_illness_confidence = 0.0
        
        # Simple cold check
        cold_symptoms = ["runny_nose", "cough", "sore_throat", "sneezing", "congestion", "stuffy_nose"]
        cold_matches = sum(1 for s in symptoms if s in cold_symptoms)
        if cold_matches >= 2 and cold_matches / len(symptoms) >= 0.5:
            common_illness_match = "Common Cold"
            common_illness_confidence = min(0.85, 0.5 + cold_matches * 0.1)
        
        # Simple flu check
        flu_symptoms = ["fever", "high_fever", "cough", "body_aches", "fatigue", "headache", "chills"]
        flu_matches = sum(1 for s in symptoms if s in flu_symptoms)
        if flu_matches >= 2 and "fever" in symptoms and flu_matches / len(symptoms) >= 0.5:
            common_illness_match = "Influenza"
            common_illness_confidence = min(0.85, 0.6 + flu_matches * 0.08)
            
        # Simple allergy check
        allergy_symptoms = ["sneezing", "runny_nose", "itchy_eyes", "watery_eyes", "itchy_nose", "nasal_congestion"]
        allergy_matches = sum(1 for s in symptoms if s in allergy_symptoms)
        if allergy_matches >= 2 and allergy_matches / len(symptoms) >= 0.6:
            common_illness_match = "Allergic Rhinitis"
            common_illness_confidence = min(0.85, 0.5 + allergy_matches * 0.1)
        
        # Pad the array to match the expected features for both models
        nb_padded_array = pad_symptoms_array(symptoms_array, nb_expected_features)
        rf_padded_array = pad_symptoms_array(symptoms_array, rf_expected_features)
        
        print(f"Padded array shape for NB: {nb_padded_array.shape}")
        print(f"Padded array shape for RF: {rf_padded_array.shape}")
        
        # Step 1: Get probabilities from Naive Bayes
        nb_probs = nb_model.predict_proba(nb_padded_array)
        print("NB prediction successful")
        print(f"NB probabilities shape: {nb_probs.shape}")
        
        # Step 2: Get probability scores for all diseases
        all_diseases = nb_model.classes_
        disease_probs = nb_probs[0]
        
        # Get the top diseases and their probability scores (up to 10)
        top_indices = np.argsort(-disease_probs)[:10]
        top_diseases = all_diseases[top_indices]
        top_probs = disease_probs[top_indices]
        
        # Calculate initial confidence scores (normalized probability)
        initial_confidence_scores = {}
        for i, disease in enumerate(top_diseases):
            # Base confidence on probability score
            confidence = float(top_probs[i])
            
            # Boost confidence for common diseases when symptoms match well
            disease_str = str(disease)
            if disease_str in ["Common Cold", "Influenza", "Allergic Rhinitis", "Fever"]:
                overlap_score, primary_match = calc_symptom_overlap(disease_str, symptoms)
                if overlap_score > 0.5 or primary_match > 0.6:
                    confidence = min(0.9, confidence * 1.3)  # 30% boost for well-matching common illnesses
            
            # Adjust confidence based on number of symptoms provided
            symptom_factor = min(1.0, len(symptoms) / 5.0)  # Scale up to 5 symptoms
            confidence = confidence * (0.4 + 0.6 * symptom_factor)
            
            # Penalize confidence if key symptoms for this disease have been denied
            if denied_symptoms:
                key_symptoms = get_key_symptoms_for_disease(disease)
                denied_key_symptoms = [s for s in denied_symptoms if s in key_symptoms]
                denial_penalty = len(denied_key_symptoms) * 0.15  # 15% reduction per denied key symptom
                confidence = max(0.01, confidence - denial_penalty)
            
            initial_confidence_scores[str(disease)] = round(confidence, 2)
        
        # Include our common illness match if we found one
        if common_illness_match and common_illness_confidence > 0.5:
            if common_illness_match in initial_confidence_scores:
                # Blend with ML prediction
                initial_confidence_scores[common_illness_match] = max(
                    initial_confidence_scores[common_illness_match],
                    common_illness_confidence * 0.8  # 80% of our heuristic confidence
                )
            else:
                # Add our heuristic prediction
                initial_confidence_scores[common_illness_match] = common_illness_confidence * 0.8
        
        # Step 3: Use Random Forest for final refinement on top prediction
        rf_prediction = None
        try:
            rf_prediction = rf_model.predict(rf_padded_array)[0]
            print(f"RF prediction successful: {rf_prediction}")
            
            # Boost confidence for RF prediction if it matches a top NB prediction
            if rf_prediction in initial_confidence_scores:
                initial_confidence_scores[rf_prediction] = min(0.95, initial_confidence_scores[rf_prediction] * 1.2)
        except Exception as e:
            print(f"Error in RF prediction: {str(e)}")
            print(f"Traceback: {traceback.format_exc()}")
            # Fallback to NB's top prediction if RF fails
            rf_prediction = top_diseases[0]
            print(f"Falling back to NB's top prediction: {rf_prediction}")
        
        # MEDICAL VALIDATION: Adjust confidence based on symptom relevance
        adjusted_confidence_scores = {}
        for disease, confidence in initial_confidence_scores.items():
            overlap_score, primary_match = calc_symptom_overlap(disease, symptoms)
            
            # Calculate medical plausibility factor (0.1 to 1.0)
            if primary_match > 0:
                # At least one primary symptom matches - good sign
                med_factor = 0.5 + primary_match * 0.5
            elif overlap_score > 0:
                # Some symptoms match but not primary ones
                med_factor = 0.3 + overlap_score * 0.2
            else:
                # No symptom overlap - likely incorrect prediction
                med_factor = 0.1
            
            # Apply medical validation adjustment
            adjusted_confidence = confidence * med_factor
            
            # Ensure confidence stays in reasonable range
            adjusted_confidence = round(min(0.99, max(0.01, adjusted_confidence)), 2)
            adjusted_confidence_scores[disease] = adjusted_confidence
        
        # Sort diseases by adjusted confidence
        sorted_diseases = sorted(adjusted_confidence_scores.items(), key=lambda x: x[1], reverse=True)
        
        # If no medically plausible disease is found with high confidence
        if sorted_diseases and sorted_diseases[0][1] < 0.2 and len(symptoms) > 1:
            # Find the most medically plausible disease from our mapping
            plausible_diseases = []
            for disease in disease_symptom_map.keys():
                overlap, primary_match = calc_symptom_overlap(disease, symptoms)
                score = overlap * 0.4 + primary_match * 0.6
                if score > 0.3:  # Reasonable match
                    plausible_diseases.append((disease, score))
            
            # If found, use the most plausible disease instead
            if plausible_diseases:
                plausible_diseases.sort(key=lambda x: x[1], reverse=True)
                most_plausible = plausible_diseases[0][0]
                adjusted_confidence_scores[most_plausible] = max(
                    adjusted_confidence_scores.get(most_plausible, 0),
                    plausible_diseases[0][1] * 0.8  # 80% of plausibility score
                )
                # Re-sort with the new/adjusted disease
                sorted_diseases = sorted(adjusted_confidence_scores.items(), key=lambda x: x[1], reverse=True)
        
        # Get final prediction and alternatives
        most_probable = sorted_diseases[0][0] if sorted_diseases else "Insufficient data"
        alternatives = [d for d, _ in sorted_diseases[1:3]] if len(sorted_diseases) > 1 else ["Insufficient data"]
        
        # Handle case where there are no alternatives
        if not alternatives or len(alternatives) < 2:
            # Ensure we have at least 2 alternatives
            if len(alternatives) == 0:
                alternatives = ["No alternative diagnosis", "No alternative diagnosis"]
            elif len(alternatives) == 1:
                alternatives.append("No alternative diagnosis")
        
        print(f"Final Prediction: {most_probable}, Alternatives: {alternatives}")
        print(f"Confidence Scores: {adjusted_confidence_scores}")

        # Ensure all values are JSON serializable
        result = {
            "Most Probable Disease": str(most_probable),
            "Possible Alternatives": [str(d) for d in alternatives],
            "Confidence": adjusted_confidence_scores.get(most_probable, 0.1),
            "All Confidence Scores": adjusted_confidence_scores
        }
        return result
        
    except Exception as e:
        print(f"Error in prediction pipeline: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        # Return safe fallback in case of error
        return {
            "Most Probable Disease": "Common Cold",
            "Possible Alternatives": ["Allergic Rhinitis", "Influenza"],
            "Confidence": 0.3,
            "All Confidence Scores": {"Common Cold": 0.3, "Allergic Rhinitis": 0.2, "Influenza": 0.1}
        }

def get_symptom_suggestions(current_symptoms=None, denied_symptoms=None, predicted_disease=None, alternative_diseases=None, confidence_threshold=0.5):
    """
    Suggests next symptoms to ask about based on current diagnosis status.
    
    Args:
        current_symptoms (list): Symptoms the user has confirmed
        denied_symptoms (list): Symptoms the user has explicitly denied
        predicted_disease (str): Current most likely disease
        alternative_diseases (list): Other possible diseases to consider
        confidence_threshold (float): Threshold to determine if we should explore alternatives
        
    Returns:
        list: Top 3 suggested symptoms to ask about next
    """
    # Initialize if None
    current_symptoms = current_symptoms or []
    denied_symptoms = denied_symptoms or []
    
    print(f"Generating suggestions based on: {predicted_disease}")
    print(f"Current symptoms: {current_symptoms}")
    print(f"Denied symptoms: {denied_symptoms}")
    
    # If no prediction available yet, suggest related symptoms based on what's entered
    if not predicted_disease:
        # Map initial symptoms to likely related symptoms
        symptom_relations = {
            "cough": ["sore_throat", "runny_nose", "congestion", "fever", "headache", "shortness_of_breath"],
            "fever": ["headache", "body_ache", "chills", "fatigue", "cough", "sweating"],
            "headache": ["fever", "nausea", "dizziness", "fatigue", "sensitivity_to_light", "neck_pain"],
            "rash": ["itching", "skin_redness", "swelling", "fever", "joint_pain"],
            "diarrhea": ["nausea", "vomiting", "abdominal_pain", "fever", "dehydration"],
            "fatigue": ["weakness", "headache", "fever", "body_ache", "loss_of_appetite"],
            "chest_pain": ["shortness_of_breath", "cough", "fever", "sweating", "nausea"],
            "sore_throat": ["cough", "fever", "runny_nose", "congestion", "headache"],
            "runny_nose": ["congestion", "sneezing", "sore_throat", "cough", "headache"],
            "joint_pain": ["muscle_pain", "swelling", "stiffness", "fever", "fatigue"],
            "abdominal_pain": ["nausea", "vomiting", "diarrhea", "fever", "loss_of_appetite"],
            "vomiting": ["nausea", "diarrhea", "abdominal_pain", "fever", "dehydration"]
        }
        
        # If user entered a symptom we have relations for
        related_symptoms = []
        for symptom in current_symptoms:
            if symptom in symptom_relations:
                related_symptoms.extend(symptom_relations[symptom])
        
        # If we found related symptoms, use them, otherwise use default list
        if related_symptoms:
            filtered_suggestions = [s for s in related_symptoms 
                                  if s not in current_symptoms 
                                  and s not in denied_symptoms]
            return filtered_suggestions[:3]
        else:
            initial_symptoms = ["fever", "cough", "headache", "fatigue", "nausea", "rash"]
            return [s for s in initial_symptoms 
                   if s not in current_symptoms 
                   and s not in denied_symptoms][:3]
    
    # Check if prediction is medically plausible
    is_plausible = is_prediction_medically_plausible(predicted_disease, current_symptoms)
    
    # If prediction doesn't seem plausible, focus on common symptoms
    if not is_plausible and len(current_symptoms) < 3:
        print(f"Prediction '{predicted_disease}' seems implausible with symptoms {current_symptoms}")
        # Suggest more common symptoms to get better prediction
        common_symptoms = ["fever", "headache", "fatigue", "nausea", "dizziness", 
                          "abdominal_pain", "rash", "shortness_of_breath"]
        suggestions = [s for s in common_symptoms 
                      if s not in current_symptoms 
                      and s not in denied_symptoms][:3]
        return suggestions
    
    # Get symptoms for current prediction and alternatives
    primary_disease_symptoms = disease_symptom_map.get(predicted_disease, [])
    
    # Prioritize key symptoms for the predicted disease
    suggestions = []
    
    # If confidence is low, also consider symptoms from alternative diseases
    if alternative_diseases and (len(current_symptoms) < 3 or confidence_threshold < 0.6):
        # Get symptoms from alternative diseases
        alt_symptoms = []
        for alt_disease in alternative_diseases:
            if alt_disease != "No alternative diagnosis":
                alt_symptoms.extend(disease_symptom_map.get(alt_disease, [])[:2])  # Add top 2 symptoms from each alternative
        
        # Create a weighted list giving priority to predicted disease
        all_symptoms = primary_disease_symptoms + alt_symptoms
        
        # Count occurrences to find symptoms that appear in multiple diseases
        symptom_count = {}
        for symptom in all_symptoms:
            symptom_count[symptom] = symptom_count.get(symptom, 0) + 1
        
        # Sort by occurrence count (descending) to prioritize symptoms common to multiple diseases
        prioritized_symptoms = sorted(symptom_count.keys(), key=lambda s: symptom_count[s], reverse=True)
        
        # Filter out symptoms already asked
        suggestions = [s for s in prioritized_symptoms 
                      if s not in current_symptoms 
                      and s not in denied_symptoms]
    else:
        # Just use primary disease symptoms if confidence is high
        suggestions = [s for s in primary_disease_symptoms 
                      if s not in current_symptoms 
                      and s not in denied_symptoms]
    
    # If we don't have enough suggestions, add some common symptoms
    if len(suggestions) < 3:
        common_symptoms = ["fever", "cough", "headache", "fatigue", "nausea", 
                         "abdominal_pain", "dizziness", "chest_pain", "shortness_of_breath"]
        
        for symptom in common_symptoms:
            if (symptom not in suggestions and 
                symptom not in current_symptoms and 
                symptom not in denied_symptoms):
                suggestions.append(symptom)
                if len(suggestions) >= 3:
                    break
    
    # Return top 3 suggestions (ensure no duplicates)
    unique_suggestions = []
    for s in suggestions:
        if s not in unique_suggestions:
            unique_suggestions.append(s)
            if len(unique_suggestions) >= 3:
                break
    
    return unique_suggestions[:3]

