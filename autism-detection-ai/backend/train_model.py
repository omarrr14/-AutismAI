"""
Train the Autism Detection Model
================================
This script reproduces the EXACT model from the Colab notebook (aiai.ipynb).
It downloads the Autism Screening dataset, preprocesses it, trains a
LogisticRegression model, and saves it as autism_model.pkl.

Usage:
    py train_model.py
"""

import numpy as np
import pandas as pd
import os
import sys
import joblib
import urllib.request

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

# Fix encoding for Windows terminals
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# ============================================================
# Step 1: Get the dataset
# ============================================================
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(SCRIPT_DIR, "Autism.csv")
MODEL_PATH = os.path.join(SCRIPT_DIR, "autism_model.pkl")

# Multiple possible sources for the dataset
DATASET_URLS = [
    "https://raw.githubusercontent.com/fahadmehfooz/Autism-Prediction-Using-ML/main/autism_screening.csv",
]

def download_dataset():
    """Try to download the Autism dataset if not present locally."""
    if os.path.exists(CSV_PATH):
        print("[OK] Dataset already exists at:", CSV_PATH)
        return True
    
    print("[INFO] Autism.csv not found locally. Attempting to download...")
    
    for url in DATASET_URLS:
        try:
            print("   Trying:", url)
            urllib.request.urlretrieve(url, CSV_PATH)
            # Quick validation
            df = pd.read_csv(CSV_PATH)
            if len(df) > 50:
                print("[OK] Downloaded successfully! ({} rows)".format(len(df)))
                return True
            else:
                os.remove(CSV_PATH)
        except Exception as e:
            print("   [FAIL]:", e)
            if os.path.exists(CSV_PATH):
                os.remove(CSV_PATH)
    
    return False


def create_synthetic_dataset():
    """
    Create a realistic synthetic Autism Screening dataset that matches
    the exact structure from the Colab notebook.
    This is used as a fallback if the real dataset cannot be downloaded.
    """
    print("\n[INFO] Creating synthetic training dataset...")
    np.random.seed(42)
    n_samples = 800
    
    records = []
    for i in range(n_samples):
        # Determine if this person has ASD (roughly 40% positive)
        has_asd = np.random.random() < 0.4
        
        # A1-A10 scores: people with ASD tend to score higher
        if has_asd:
            a_scores = [int(np.random.random() < 0.7) for _ in range(10)]
        else:
            a_scores = [int(np.random.random() < 0.25) for _ in range(10)]
        
        age = np.random.randint(18, 65)
        gender = np.random.choice(["m", "f"])
        ethnicity = np.random.choice([
            "White-European", "Latino", "Others", "Black",
            "Asian", "Middle Eastern", "Pasifika",
            "South Asian", "Hispanic", "Turkish", "others"
        ])
        jaundice = np.random.choice(["yes", "no"], p=[0.15, 0.85])
        autism_family = np.random.choice(["yes", "no"], p=[0.3 if has_asd else 0.1, 0.7 if has_asd else 0.9])
        country = np.random.choice([
            "United States", "Brazil", "Spain", "Egypt",
            "New Zealand", "Bahamas", "Burundi", "Austria",
            "Argentina", "Jordan", "Ireland"
        ])
        used_app = np.random.choice(["yes", "no"], p=[0.2, 0.8])
        result = sum(a_scores)
        relation = np.random.choice(["Self", "Parent", "Relative", "Health care professional", "Others"])
        class_asd = "YES" if has_asd else "NO"
        
        records.append({
            "A1_Score": a_scores[0],
            "A2_Score": a_scores[1],
            "A3_Score": a_scores[2],
            "A4_Score": a_scores[3],
            "A5_Score": a_scores[4],
            "A6_Score": a_scores[5],
            "A7_Score": a_scores[6],
            "A8_Score": a_scores[7],
            "A9_Score": a_scores[8],
            "A10_Score": a_scores[9],
            "age": age,
            "gender": gender,
            "ethnicity": ethnicity,
            "jundice": jaundice,
            "austim": autism_family,
            "contry_of_res": country,
            "used_app_before": used_app,
            "result": result,
            "relation": relation,
            "Class/ASD": class_asd,
        })
    
    df = pd.DataFrame(records)
    df.to_csv(CSV_PATH, index=False)
    print("[OK] Synthetic dataset created: {} ({} samples)".format(CSV_PATH, n_samples))
    return df


# ============================================================
# Step 2: Load and preprocess (matching the Colab notebook)
# ============================================================
def train():
    print("\n" + "=" * 60)
    print("  AUTISM DETECTION MODEL TRAINER")
    print("=" * 60)
    
    # Try to get the dataset
    if not download_dataset():
        print("\n[WARN] Could not download the real dataset.")
        print("   Creating a synthetic dataset instead...")
        print("   (Replace backend/Autism.csv with the real dataset for best results)")
        create_synthetic_dataset()
    
    # Load dataset
    print("\n[INFO] Loading dataset from:", CSV_PATH)
    df = pd.read_csv(CSV_PATH)
    print("   Shape:", df.shape)
    print("   Columns:", list(df.columns))
    
    # ---- Detect column names ----
    # The dataset might have different column name formats
    # Try to standardize
    col_map = {}
    for col in df.columns:
        lower = col.lower().strip()
        if lower in ['class/asd', 'class', 'asd', 'class_asd']:
            col_map[col] = 'Class/ASD'
        elif lower == 'jundice' or lower == 'jaundice':
            col_map[col] = 'jundice'
        elif lower == 'austim' or lower == 'autism':
            col_map[col] = 'austim'
        elif lower in ['contry_of_res', 'country_of_res', 'country']:
            col_map[col] = 'contry_of_res'
    
    if col_map:
        df = df.rename(columns=col_map)
    
    # ---- Drop unnecessary columns ----
    drop_cols = ['ID', 'id', 'age_desc']
    for c in drop_cols:
        if c in df.columns:
            df = df.drop(columns=[c])
            print("   Dropped column:", c)
    
    # ---- Handle missing values ----
    df = df.dropna()
    df = df.drop_duplicates()
    print("   After cleanup:", df.shape)
    
    # ---- Encode target ----
    target_col = 'Class/ASD'
    if target_col not in df.columns:
        # Try to find the target column
        for c in df.columns:
            if 'class' in c.lower() or 'asd' in c.lower():
                target_col = c
                break
    
    print("\n[TARGET] Target column:", target_col)
    print("   Unique values:", df[target_col].unique())
    
    # Encode target: YES/1 -> 1, NO/0 -> 0
    df[target_col] = df[target_col].apply(
        lambda x: 1 if str(x).strip().upper() in ['YES', '1', 'TRUE'] else 0
    )
    
    print("   Target distribution:")
    print(df[target_col].value_counts())
    
    # ---- Label Encode all categorical columns ----
    # (Matching the Colab notebook approach)
    label_encoders = {}
    feature_cols = [c for c in df.columns if c != target_col]
    
    for col in feature_cols:
        # Check if column contains non-numeric data
        is_numeric = pd.api.types.is_numeric_dtype(df[col])
        if not is_numeric:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col].astype(str))
            label_encoders[col] = le
            print("   LabelEncoded:", col)
    
    # ---- Ensure all features are numeric ----
    for col in feature_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0).astype(int)
    
    # ---- Split features and target ----
    X = df[feature_cols].astype(float)
    y = df[target_col].astype(int)
    
    print("\n[INFO] Features shape:", X.shape)
    print("   Feature columns:", list(X.columns))
    
    # ---- Train/Test Split ----
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print("\n[INFO] Train size: {}, Test size: {}".format(X_train.shape[0], X_test.shape[0]))
    
    # ---- Scale features ----
    scaler = MinMaxScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # ---- Train Logistic Regression (matching notebook) ----
    print("\n[TRAINING] Training LogisticRegression...")
    model = LogisticRegression(max_iter=1000, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # ---- Evaluate ----
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    
    print("\n[OK] Model Accuracy: {:.4f} ({:.1f}%)".format(accuracy, accuracy * 100))
    print("\n[REPORT] Classification Report:")
    print(classification_report(y_test, y_pred, target_names=["No ASD (0)", "ASD (1)"]))
    
    # ---- Save the model (with scaler bundled) ----
    # We save both the model AND scaler together so the Flask API can use them
    model_bundle = {
        'model': model,
        'scaler': scaler,
        'feature_columns': list(X.columns),
        'label_encoders': label_encoders
    }
    
    joblib.dump(model_bundle, MODEL_PATH)
    print("\n[SAVED] Model bundle saved to:", MODEL_PATH)
    print("   Contains: model, scaler, feature_columns, label_encoders")
    print("\n[DONE] Training complete! You can now run: py app.py")
    
    return model_bundle


if __name__ == "__main__":
    train()
