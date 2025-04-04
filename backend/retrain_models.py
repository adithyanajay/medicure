import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os

# Create ml_model directory if it doesn't exist
os.makedirs('ml_model', exist_ok=True)

# Load the dataset
df = pd.read_csv('Training.csv')

# Prepare the data
X = df.drop('prognosis', axis=1)
y = df['prognosis']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train Naive Bayes model
nb_model = GaussianNB()
nb_model.fit(X_train_scaled, y_train)
nb_score = nb_model.score(X_test_scaled, y_test)
print(f"Naive Bayes Accuracy: {nb_score:.2f}")

# Train Random Forest model
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train_scaled, y_train)
rf_score = rf_model.score(X_test_scaled, y_test)
print(f"Random Forest Accuracy: {rf_score:.2f}")

# Save the models and scaler
joblib.dump(nb_model, 'ml_model/model_nb.pkl')
joblib.dump(rf_model, 'ml_model/model_rf.pkl')
joblib.dump(scaler, 'ml_model/scaler.pkl')

print("Models and scaler saved successfully!") 