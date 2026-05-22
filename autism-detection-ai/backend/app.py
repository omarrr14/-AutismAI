from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import traceback
import os

app = Flask(__name__)
CORS(app)

# ==============================
# Encoding Maps (must match your LabelEncoder from training)
# ==============================
# These mappings come directly from the model training notebook comments:
#
# gender:       male=1, female=0
# jundice:      yes=1, no=0
# austim:       yes=1, no=0
# used_app_before: yes=1, no=0
# relation:     Self=0, Parent=1, Relative=2, Health care professional=3, Others=4
# ethnicity:    numeric 0-10 (label encoded string)
# contry_of_res: numeric 0-10 (label encoded string)

GENDER_MAP = {"m": 1, "male": 1, "f": 0, "female": 0}
YES_NO_MAP = {"yes": 1, "no": 0}
RELATION_MAP = {
    "self": 0,
    "parent": 1,
    "relative": 2,
    "health care professional": 3,
    "others": 4
}

def encode_value(value, mapping, default=0):
    """Safely encode a string value using a mapping dict."""
    if isinstance(value, (int, float)):
        return int(value)
    return mapping.get(str(value).strip().lower(), default)


def preprocess_features(raw):
    """
    Converts the 19-element list from the frontend into 19 integers
    matching the LabelEncoder order used during model training.
    
    Expected order from frontend:
    [A1, A2, A3, A4, A5, A6, A7, A8, A9, A10,
     age, gender, ethnicity, jundice, austim,
     contry_of_res, used_app_before, result, relation]
    """
    if len(raw) != 19:
        raise ValueError(f"Expected exactly 19 features, but received {len(raw)}.")

    processed = []

    # 0-9: A1 to A10 scores (already 0 or 1)
    for i in range(10):
        processed.append(int(float(raw[i])))

    # 10: age (integer)
    processed.append(int(float(raw[10])))

    # 11: gender (male=1, female=0)
    processed.append(encode_value(raw[11], GENDER_MAP, default=0))

    # 12: ethnicity (label encoded → use numeric 0-10, default 0)
    val = raw[12]
    if isinstance(val, str) and not val.isdigit():
        processed.append(0)  # fallback for unknown string
    else:
        processed.append(int(float(val)))

    # 13: jundice (yes=1, no=0)
    processed.append(encode_value(raw[13], YES_NO_MAP, default=0))

    # 14: austim / family history (yes=1, no=0)
    processed.append(encode_value(raw[14], YES_NO_MAP, default=0))

    # 15: contry_of_res (label encoded → numeric 0-10, default 0)
    val = raw[15]
    if isinstance(val, str) and not val.isdigit():
        processed.append(0)
    else:
        processed.append(int(float(val)))

    # 16: used_app_before (yes=1, no=0)
    processed.append(encode_value(raw[16], YES_NO_MAP, default=0))

    # 17: result (integer score, passed from frontend as '0' placeholder)
    processed.append(int(float(raw[17])))

    # 18: relation (Self=0, Parent=1, Relative=2, HCP=3, Others=4)
    processed.append(encode_value(raw[18], RELATION_MAP, default=4))

    return np.array(processed).reshape(1, -1)


# ==============================
# Load Model
# ==============================
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "autism_model.pkl")

model = None
scaler = None

try:
    if os.path.exists(MODEL_PATH):
        loaded = joblib.load(MODEL_PATH)
        
        # Support both bundled dict and plain model
        if isinstance(loaded, dict):
            model = loaded['model']
            scaler = loaded.get('scaler', None)
            feature_cols = loaded.get('feature_columns', None)
            print(f"[OK] Model bundle loaded from {MODEL_PATH}")
            print(f"   Model type: {type(model).__name__}")
            if scaler:
                print(f"   Scaler: {type(scaler).__name__}")
            if feature_cols:
                print(f"   Features: {feature_cols}")
        else:
            model = loaded
            print(f"[OK] Model loaded from {MODEL_PATH}")
            print(f"   Model type: {type(model).__name__}")
    else:
        print(f"[WARN] Model file NOT found at: {MODEL_PATH}")
        print("   Run: py train_model.py")
except Exception as e:
    print(f"[FAIL] Error loading model: {e}")
    traceback.print_exc()


# ==============================
# Routes
# ==============================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        # 1. Check model
        if model is None:
            return jsonify({"error": "AI model is not loaded. Run 'py train_model.py' first, then restart this server."}), 500

        # 2. Parse JSON body
        data = request.get_json(force=True)
        if not data or "features" not in data:
            return jsonify({"error": "Missing 'features' in request body."}), 400

        raw_features = data["features"]

        # 3. Preprocess
        features_array = preprocess_features(raw_features)
        
        # 4. Apply scaler if available
        if scaler is not None:
            features_array = scaler.transform(features_array)

        # 5. Predict
        prediction = model.predict(features_array)[0]
        result = int(prediction)  # numpy int → python int

        # 6. Build response
        response = {"prediction": result}

        # Optional: probability if model supports it
        if hasattr(model, "predict_proba"):
            proba = model.predict_proba(features_array)[0]
            response["probability"] = round(float(max(proba)), 4)

        print(f"[OK] Prediction: {result} | Probability: {response.get('probability', 'N/A')}")
        return jsonify(response), 200

    except ValueError as ve:
        print(f"[WARN] Validation Error: {ve}")
        return jsonify({"error": str(ve)}), 400

    except Exception as e:
        print(f"[FAIL] Server Error:\n{traceback.format_exc()}")
        return jsonify({"error": "Internal server error during prediction."}), 500


@app.route("/", methods=["GET"])
def health():
    return jsonify({
        "status": "running",
        "model_loaded": model is not None
    })


if __name__ == "__main__":
    print("\n[STARTING] Starting Autism Detection AI API...")
    print("   POST http://127.0.0.1:5000/predict\n")
    app.run(host="127.0.0.1", port=5000, debug=True)
