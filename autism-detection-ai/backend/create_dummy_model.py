"""
Generate a dummy autism_model.pkl for testing the API + UI connection.
This mimics the EXACT model structure from the training notebook:
  - RandomForestClassifier(n_estimators=200)
  - 19 integer features (all label-encoded)
  - Binary target: 0 = No ASD, 1 = ASD

Replace this file with your REAL trained model before presenting.
"""

import numpy as np
import joblib
import os
from sklearn.ensemble import RandomForestClassifier

def create_dummy_model():
    print("🔧 Generating dummy training data (19 features, 200 samples)...")
    np.random.seed(42)
    X = np.random.randint(0, 10, size=(200, 19))
    y = np.random.randint(0, 2, size=200)

    print("🧠 Training RandomForestClassifier (n_estimators=200)...")
    model = RandomForestClassifier(n_estimators=200, random_state=42)
    model.fit(X, y)

    save_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "autism_model.pkl")
    joblib.dump(model, save_path)
    print(f"✅ Dummy model saved to: {save_path}")
    print("   You can now run: python app.py")

if __name__ == "__main__":
    create_dummy_model()
