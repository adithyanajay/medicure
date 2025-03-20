import joblib
import numpy as np
import pandas as pd
import os

# Load Symptom-Severity Mapping
file_path = os.path.join(os.path.dirname(__file__), "Symptom-severity.csv")
df = pd.read_csv(file_path)

# Create Dictionary
symptom_map = {row["Symptom"].strip().lower(): row["weight"] for _, row in df.iterrows()}


# Load the models
nb_model = joblib.load("ml_model/model_nb.pkl")
rf_model = joblib.load("ml_model/model_rf.pkl")

def hybrid_predict(symptoms):
    # ✅ Convert symptom names to numeric severity values
    symptom_weights = [symptom_map.get(symptom.lower().strip(), 0) for symptom in symptoms]

    print(f"Converted Symptoms to Weights: {symptom_weights}")  # ✅ Debugging Step

    # ✅ Ensure the array is numeric
    symptoms_array = np.array(symptom_weights, dtype=np.float64).reshape(1, -1)  # Ensure numeric dtype

    # Step 1: Get probabilities from Naive Bayes
    nb_probs = nb_model.predict_proba(symptoms_array)

    # Step 2: Get top 3 probable diseases from Naive Bayes
    top_indices = np.argsort(-nb_probs, axis=1)[:, :3]
    top_diseases = np.array(nb_model.classes_)[top_indices]

    # Step 3: Use Random Forest for final refinement
    rf_prediction = rf_model.predict(symptoms_array)[0]

    # Exclude main disease and return top 2 alternatives
    alternatives = [disease for disease in top_diseases[0] if disease != rf_prediction][:2]

    print(f"Final Prediction: {rf_prediction}, Alternatives: {alternatives}")  # ✅ Debugging Step

    return {
        "Most Probable Disease": rf_prediction,
        "Possible Alternatives": alternatives
    }


