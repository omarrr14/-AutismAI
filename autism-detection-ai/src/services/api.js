import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://autismai.onrender.com';

export const predictAutism = async (featuresArray) => {
  try {
    const response = await axios.post(`${API_URL}/predict`, {
      features: featuresArray
    });

    // Ensure we always return a standardized object
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("API Prediction Error:", error);

    let errorMessage = "Failed to connect to the prediction API. Ensure the Flask server is running.";

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = error.response.data.error || `Server error: ${error.response.status}`;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = "No response received from the server. Is it running on port 5000?";
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};
