from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from joblib import load
import pandas as pd

app = FastAPI()

# Load the trained Naive Bayes model
model = load('naive_bayes_model.joblib')

# Define a function to preprocess input data
def preprocess_input(input_data):
    # Ensure that the column names and order match the features expected by the model
    expected_features = [
        'Time_Fruits', 'Correct_Fruits', 'Incorrect_Fruits',
        'Time_Numbers', 'Correct_Numbers', 'Incorrect_Numbers',
        'Time_Commands', 'Correct_Commands', 'Incorrect_Commands',
        'Time_Animals', 'Correct_Animals', 'Incorrect_Animals'
    ]
    
    # Create a DataFrame with the input data
    df = pd.DataFrame([input_data], columns=expected_features)
    
    # Fill missing columns with zeros (assuming missing values are handled this way)
    df = df.fillna(0)
    
    return df

# Define a function to make predictions
def predict_category(input_data):
    # Preprocess the input data
    df = preprocess_input(input_data)
    
    # Make predictions using the loaded model
    predicted_category = model.predict(df)
    return predicted_category[0]

# Define route for the home page
@app.get("/", response_class=HTMLResponse)
async def home():
    return HTMLResponse(content=open("index.html").read(), status_code=200)

# Define route for form submission
@app.post("/predictvoicefeedback")
async def predict(request: Request, input_data: dict):
    # Make predictions
    predicted_category = predict_category(input_data)

    return {"predicted_category": predicted_category}

# Define route for GET requests
@app.get("/predictgetfeedback")
async def predict_get():
    return "GET request received!"
