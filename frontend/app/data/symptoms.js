// List of all possible symptoms
export const allSymptoms = [
  "fever", "cough", "fatigue", "difficulty_breathing", "sore_throat",
  "headache", "body_ache", "runny_nose", "chest_pain", "nausea",
  "vomiting", "diarrhea", "abdominal_pain", "chills", "joint_pain",
  "high_fever", "sweating", "loss_of_appetite", "weight_loss", "rash",
  "skin_redness", "itching", "dizziness", "fainting", "blurred_vision",
  "neck_pain", "back_pain", "stiff_neck", "swollen_glands", "swollen_lymph_nodes",
  "coughing_with_blood", "yellow_skin", "dark_urine", "stomach_bleeding", "red_spots",
  "muscle_weakness", "anxiety", "irritability", "depression", "constipation",
  "increased_heart_rate", "palpitations", "stomach_pain", "loss_of_smell", "loss_of_taste",
  "dry_cough", "productive_cough", "wheezing", "shortness_of_breath", "frequent_urination",
  "burning_urination", "blood_in_urine", "ear_pain", "ear_discharge", "skin_lesions",
  "night_sweats", "numbness", "tingling", "swelling", "muscle_cramps",
  "confusion", "irregular_heartbeat"
];

// Symptom severity mapping
export const symptomSeverity = {
  "itching": 1,
  "skin_rash": 3,
  "nodal_skin_eruptions": 4,
  "continuous_sneezing": 4,
  "shivering": 5,
  "chills": 3,
  "joint_pain": 3,
  "stomach_pain": 5,
  "acidity": 3,
  "ulcers_on_tongue": 4,
  "muscle_wasting": 3,
  "vomiting": 5,
  "burning_micturition": 6,
  "spotting_urination": 6,
  "fatigue": 4,
  "weight_gain": 3,
  "anxiety": 4,
  "cold_hands_and_feets": 5,
  "mood_swings": 3,
  "weight_loss": 3,
  "restlessness": 5,
  "lethargy": 2,
  "patches_in_throat": 6,
  "irregular_sugar_level": 5,
  "cough": 4,
  "high_fever": 7,
  "sunken_eyes": 3,
  "breathlessness": 4,
  "sweating": 3,
  "dehydration": 4,
  "indigestion": 5,
  "headache": 3,
  "yellowish_skin": 3,
  "dark_urine": 4,
  "nausea": 5,
  "loss_of_appetite": 4,
  "pain_behind_the_eyes": 4,
  "back_pain": 3,
  "constipation": 4,
  "abdominal_pain": 4,
  "diarrhoea": 6,
  "mild_fever": 5,
  "yellow_urine": 4,
  "yellowing_of_eyes": 4,
  "acute_liver_failure": 6,
  "fluid_overload": 6,
  "swelling_of_stomach": 7,
  "swelled_lymph_nodes": 6,
  "malaise": 6,
  "blurred_and_distorted_vision": 5,
  "phlegm": 5,
  "throat_irritation": 4,
  "redness_of_eyes": 5,
  "sinus_pressure": 4,
  "runny_nose": 5,
  "congestion": 5,
  "chest_pain": 7,
  "weakness_in_limbs": 7,
  "fast_heart_rate": 5,
  "pain_during_bowel_movements": 5,
  "pain_in_anal_region": 6,
  "bloody_stool": 5,
  "irritation_in_anus": 6,
  "neck_pain": 5,
  "dizziness": 4,
  "cramps": 4,
  "bruising": 4,
  "obesity": 4,
  "swollen_legs": 5,
  "swollen_blood_vessels": 5,
  "puffy_face_and_eyes": 5,
  "enlarged_thyroid": 6,
  "brittle_nails": 5,
  "swollen_extremeties": 5,
  "excessive_hunger": 4,
  "extra_marital_contacts": 5,
  "drying_and_tingling_lips": 4,
  "slurred_speech": 4,
  "knee_pain": 3,
  "hip_joint_pain": 2,
  "muscle_weakness": 2,
  "stiff_neck": 4,
  "swelling_joints": 5,
  "movement_stiffness": 5,
  "spinning_movements": 6,
  "loss_of_balance": 4,
  "unsteadiness": 4,
  "weakness_of_one_body_side": 4,
  "loss_of_smell": 3,
  "bladder_discomfort": 4,
  "foul_smell_of_urine": 5,
  "continuous_feel_of_urine": 6,
  "passage_of_gases": 5,
  "internal_itching": 4,
  "toxic_look_(typhos)": 5,
  "depression": 3,
  "irritability": 2,
  "muscle_pain": 2,
  "altered_sensorium": 2,
  "red_spots_over_body": 3,
  "belly_pain": 4,
  "abnormal_menstruation": 6,
  "dischromic_patches": 6,
  "watering_from_eyes": 4,
  "increased_appetite": 5,
  "polyuria": 4,
  "family_history": 5,
  "mucoid_sputum": 4,
  "rusty_sputum": 4,
  "lack_of_concentration": 3,
  "visual_disturbances": 3,
  "receiving_blood_transfusion": 5,
  "receiving_unsterile_injections": 2,
  "coma": 7,
  "stomach_bleeding": 6,
  "distention_of_abdomen": 4,
  "history_of_alcohol_consumption": 5,
  "blood_in_sputum": 5,
  "prominent_veins_on_calf": 6,
  "palpitations": 4,
  "painful_walking": 2,
  "pus_filled_pimples": 2,
  "blackheads": 2,
  "scurring": 2,
  "skin_peeling": 3,
  "silver_like_dusting": 2,
  "small_dents_in_nails": 2,
  "inflammatory_nails": 2,
  "blister": 4,
  "red_sore_around_nose": 2,
  "yellow_crust_ooze": 3
};

// Follow-up questions for specific symptoms
export const followUpQuestions = {
  fever: {
    question: "How high is your fever?",
    options: [
      { id: 1, label: "Mild (99°F - 100.4°F / 37.2°C - 38°C)" },
      { id: 2, label: "Moderate (100.5°F - 102°F / 38.1°C - 39°C)" },
      { id: 3, label: "High (over 102°F / 39°C)" }
    ]
  },
  cough: {
    question: "What type of cough do you have?",
    options: [
      { id: 1, label: "Dry cough with no phlegm" },
      { id: 2, label: "Wet cough with clear phlegm" },
      { id: 3, label: "Wet cough with colored (yellow/green) phlegm" },
      { id: 4, label: "Cough with blood" }
    ]
  },
  headache: {
    question: "How would you describe your headache?",
    options: [
      { id: 1, label: "Mild pain" },
      { id: 2, label: "Moderate pain" },
      { id: 3, label: "Severe pain" },
      { id: 4, label: "Severe with sensitivity to light" }
    ]
  },
  fatigue: {
    question: "How severe is your fatigue?",
    options: [
      { id: 1, label: "Mild - feel tired but can do most activities" },
      { id: 2, label: "Moderate - need to rest more than usual" },
      { id: 3, label: "Severe - difficulty performing daily activities" }
    ]
  },
  chest_pain: {
    question: "How would you describe your chest pain?",
    options: [
      { id: 1, label: "Sharp pain" },
      { id: 2, label: "Pressure or squeezing sensation" },
      { id: 3, label: "Burning sensation" },
      { id: 4, label: "Pain that worsens with breathing" }
    ]
  },
  stomach_pain: {
    question: "Where is your stomach pain located?",
    options: [
      { id: 1, label: "Upper abdomen" },
      { id: 2, label: "Lower abdomen" },
      { id: 3, label: "Generalized (entire abdomen)" },
      { id: 4, label: "Right side lower abdomen" }
    ]
  }
};

// Common treatment suggestions based on disease
export const treatmentSuggestions = {
  "Common Cold": [
    "Rest and stay hydrated",
    "Over-the-counter decongestants or pain relievers may help with symptoms",
    "Use a humidifier or saline nasal spray",
    "Consult a doctor if symptoms persist beyond 7-10 days or worsen"
  ],
  "Influenza (Flu)": [
    "Rest and stay hydrated",
    "Take over-the-counter fever reducers/pain relievers as directed",
    "Stay home to avoid spreading the infection",
    "Seek medical attention if you experience difficulty breathing, persistent chest pain, confusion, or severe symptoms"
  ],
  "Pneumonia": [
    "Seek immediate medical attention - pneumonia requires proper diagnosis and treatment",
    "Take prescribed antibiotics as directed (if bacterial pneumonia)",
    "Rest and stay hydrated",
    "Follow up with your doctor if symptoms don't improve"
  ],
  "Urinary Tract Infection": [
    "See a doctor for antibiotics, which are typically required",
    "Drink plenty of water to help flush out bacteria",
    "Urinate frequently and avoid holding urine",
    "Use a heating pad on your abdomen to reduce pain"
  ],
  "Asthma": [
    "Use prescribed inhalers as directed",
    "Avoid known triggers (allergens, exercise, cold air)",
    "Follow your asthma action plan",
    "Seek emergency care if experiencing severe breathing difficulty"
  ],
  "Tuberculosis": [
    "Seek immediate medical attention - TB requires proper diagnosis and treatment",
    "Take all prescribed medications exactly as directed for the full course (usually 6-9 months)",
    "Attend all follow-up appointments and testing",
    "Practice respiratory hygiene to prevent spreading the infection"
  ],
  "Gastroenteritis": [
    "Stay hydrated with water, clear broths, or oral rehydration solutions",
    "Rest your stomach by eating bland foods when you can tolerate them",
    "Avoid dairy, caffeine, alcohol, and fatty or spicy foods",
    "Seek medical attention if you can't keep fluids down, have bloody diarrhea, or high fever"
  ],
  "Bronchitis": [
    "Rest and stay hydrated",
    "Use over-the-counter medications to reduce fever and pain",
    "Use a humidifier to ease breathing",
    "Consult a doctor if symptoms don't improve within a week or are severe"
  ],
  "Malaria": [
    "Seek immediate medical attention - malaria requires proper diagnosis and treatment",
    "Take prescribed antimalarial medications as directed",
    "Use fever reducers/pain relievers as recommended by your doctor",
    "Rest and stay hydrated"
  ],
  "Dengue": [
    "Seek medical attention for proper diagnosis",
    "Rest and stay hydrated",
    "Take acetaminophen (not aspirin) for fever and pain",
    "Monitor for warning signs like severe abdominal pain, persistent vomiting, bleeding"
  ],
  "Typhoid": [
    "Seek medical attention - typhoid requires antibiotics",
    "Rest and stay hydrated",
    "Take prescribed medications for the full course",
    "Eat soft, easily digestible foods while recovering"
  ],
  "Hepatitis": [
    "Seek medical attention for proper diagnosis and treatment guidance",
    "Rest and avoid alcohol or medications that stress the liver",
    "Maintain good nutrition with a balanced diet",
    "Follow your doctor's recommendations for monitoring and follow-up"
  ],
  "Jaundice": [
    "Seek medical attention to determine the cause",
    "Rest and stay hydrated",
    "Follow dietary restrictions as advised by your doctor",
    "Avoid alcohol and medications that can stress the liver"
  ],
  "Chicken Pox": [
    "Stay home to avoid spreading the infection",
    "Take lukewarm baths with colloidal oatmeal to reduce itching",
    "Use calamine lotion on itchy spots",
    "Take acetaminophen (not aspirin) for fever and discomfort"
  ],
  "Measles": [
    "Rest and stay hydrated",
    "Take acetaminophen or ibuprofen for fever (avoid aspirin for children)",
    "Use a humidifier to ease cough and sore throat",
    "Seek medical attention if symptoms worsen"
  ],
  "Diabetes": [
    "Consult with healthcare providers for proper diagnosis and management",
    "Monitor blood glucose levels regularly",
    "Follow a balanced diet as recommended by your healthcare provider",
    "Take medications as prescribed and stay physically active"
  ],
  "Heart Attack": [
    "Call emergency services (911) immediately",
    "Chew an aspirin if advised by emergency personnel and not allergic",
    "Rest in a position that makes breathing comfortable",
    "This is a medical emergency requiring immediate professional care"
  ],
  "Varicose Veins": [
    "Exercise regularly to improve circulation",
    "Elevate your legs when resting",
    "Avoid standing or sitting for long periods",
    "Consider wearing compression stockings"
  ],
  "Hypertension": [
    "Consult with a healthcare provider for proper diagnosis and treatment",
    "Take prescribed medications as directed",
    "Reduce sodium intake and maintain a healthy diet",
    "Exercise regularly and manage stress"
  ],
  "Migraine": [
    "Rest in a quiet, dark room",
    "Apply cold or warm compresses to your head",
    "Take pain relievers as recommended by your doctor",
    "Identify and avoid personal triggers"
  ],
  "Cervical Spondylosis": [
    "Apply heat or cold to the neck",
    "Take over-the-counter pain relievers as directed",
    "Practice good posture and ergonomics",
    "Consider physical therapy as recommended by your doctor"
  ],
  "Arthritis": [
    "Take medications as prescribed for pain and inflammation",
    "Apply hot or cold packs to affected joints",
    "Engage in gentle exercise as recommended by your doctor",
    "Maintain a healthy weight to reduce stress on joints"
  ],
  "Hypothyroidism": [
    "Take prescribed thyroid hormone replacement medication as directed",
    "Have regular blood tests to monitor thyroid levels",
    "Maintain a healthy diet and exercise regularly",
    "Follow up with your doctor for monitoring and dose adjustments"
  ],
  "Hyperthyroidism": [
    "Take prescribed anti-thyroid medications as directed",
    "Avoid iodine-rich foods if recommended by your doctor",
    "Manage stress with relaxation techniques",
    "Follow up regularly with your healthcare provider"
  ],
  "Hypoglycemia": [
    "Consume 15-20 grams of fast-acting carbohydrates (juice, honey, glucose tablets)",
    "Recheck blood sugar after 15 minutes",
    "Eat a small snack if your next meal is more than an hour away",
    "Seek medical attention if symptoms don't improve"
  ],
  "default": [
    "Consult with a healthcare professional for proper diagnosis and treatment",
    "Rest and stay hydrated",
    "Monitor your symptoms and seek medical attention if they worsen",
    "Follow your doctor's recommendations for medication and self-care"
  ]
};

// Common disease to symptom mapping for follow-up questions
export const diseaseSymptomMapping = {
  "Common Cold": ["runny_nose", "sore_throat", "cough", "headache", "fatigue"],
  "Influenza (Flu)": ["fever", "body_ache", "fatigue", "cough", "headache", "chills"],
  "Pneumonia": ["cough", "high_fever", "difficulty_breathing", "chest_pain", "fatigue"],
  "Urinary Tract Infection": ["burning_urination", "frequent_urination", "abdominal_pain", "blood_in_urine", "fever"],
  "Asthma": ["wheezing", "shortness_of_breath", "cough", "chest_pain", "difficulty_breathing"],
  "Tuberculosis": ["cough", "coughing_with_blood", "chest_pain", "fatigue", "night_sweats", "weight_loss"],
  "Gastroenteritis": ["diarrhea", "vomiting", "nausea", "abdominal_pain", "fever", "headache"],
  "Bronchitis": ["cough", "chest_pain", "fatigue", "shortness_of_breath", "fever", "chills"],
  "Malaria": ["fever", "chills", "headache", "fatigue", "sweating", "nausea", "vomiting"],
  "Dengue": ["high_fever", "headache", "joint_pain", "muscle_pain", "rash", "fatigue"],
  "Typhoid": ["fever", "headache", "abdominal_pain", "loss_of_appetite", "fatigue", "constipation"],
  "Hepatitis": ["yellow_skin", "fatigue", "abdominal_pain", "dark_urine", "loss_of_appetite", "nausea"],
  "Jaundice": ["yellow_skin", "dark_urine", "fatigue", "abdominal_pain", "itching", "weight_loss"],
  "Chicken Pox": ["fever", "rash", "skin_lesions", "itching", "fatigue", "loss_of_appetite"],
  "Measles": ["high_fever", "cough", "runny_nose", "red_spots", "rash", "sore_throat", "conjunctivitis"],
  "Diabetes": ["frequent_urination", "increased_thirst", "hunger", "fatigue", "blurred_vision", "weight_loss"],
  "Heart Attack": ["chest_pain", "shortness_of_breath", "nausea", "anxiety", "sweating", "irregular_heartbeat"],
  "Varicose Veins": ["swelling", "leg_pain", "itching", "visible_veins", "heaviness_in_legs"],
  "Hypertension": ["headache", "shortness_of_breath", "dizziness", "chest_pain", "blurred_vision"],
  "Migraine": ["severe_headache", "sensitivity_to_light", "nausea", "vomiting", "visual_disturbances"],
  "Cervical Spondylosis": ["neck_pain", "stiffness", "headache", "tingling", "numbness_in_arms"],
  "Arthritis": ["joint_pain", "joint_stiffness", "swelling", "reduced_mobility", "fatigue"],
  "Hypothyroidism": ["fatigue", "weight_gain", "cold_sensitivity", "constipation", "dry_skin"],
  "Hyperthyroidism": ["weight_loss", "anxiety", "tremors", "increased_heart_rate", "heat_sensitivity"],
  "Hypoglycemia": ["dizziness", "confusion", "hunger", "sweating", "trembling", "anxiety"]
};

// Default export combining all data
export default {
  allSymptoms,
  symptomSeverity,
  followUpQuestions
}; 