from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from joblib import load
import pandas as pd

app = FastAPI()

# Load the trained Naive Bayes model
model = load('naive_bayes_writing_FB_model.joblib')

# Define a function to preprocess input data
def preprocess_input(input_data):
    
    expected_features = [
        'Time_Adjectives', 'Correct_Adjectives', 'Incorrect_Adjectives',
        'Time_Nouns', 'Correct_Nouns', 'Incorrect_Nouns',
        'Time_Preposition', 'Correct_Preposition', 'Incorrect_Preposition',
        'Time_Adverbs', 'Correct_Adverbs', 'Incorrect_Adverbs'
    ]
    
    df = pd.DataFrame([input_data], columns=expected_features)
    
    # Fill missing columns with zeros (assuming missing values are handled this way)
    df = df.fillna(0)
    
    return df



def predict_category(input_data):
    # Preprocess the input data
    df = preprocess_input(input_data)
    
    # Make predictions using the loaded model
    predicted_category = model.predict(df)
    return predicted_category[0]


@app.post("/predictwritingfeedback")
async def predict(request: Request, input_data: dict):
    # Make predictions
    predicted_category = predict_category(input_data)

    return {"predicted_category": predicted_category}


@app.get("/predictgetwritingfeedback")
async def predict_get():
    return "GET request writing received!"

# if __name__ == '__main__':
#     app.run(debug=True)
