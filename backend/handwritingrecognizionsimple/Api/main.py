from fastapi import FastAPI, File, UploadFile
import cv2 as cv
import numpy as np
from pydantic import BaseModel
from typing import Optional
import os
from tensorflow.keras.models import load_model
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["GET", "POST"],
#     allow_headers=["*"],
# )

# Load the trained model
model_file = os.path.abspath('../Model/5')
model = load_model(model_file)

# Dictionary to map predicted labels to characters
dict_word = {0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e', 5: 'f', 6: 'g', 7: 'h', 8: 'i', 9: 'j', 10: 'k', 11: 'l',
             12: 'm', 13: 'n', 14: 'o', 15: 'p', 16: 'q', 17: 'r', 18: 's', 19: 't', 20: 'u', 21: 'v', 22: 'w',
             23: 'x', 24: 'y', 25: 'z'}


class PredictionResult(BaseModel):
    predicted_character: str

def preprocess_image(image):
    gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
    gray = cv.medianBlur(gray, 5)
    _, gray = cv.threshold(gray, 75, 180, cv.THRESH_BINARY)
    element = cv.getStructuringElement(cv.MORPH_RECT, (90, 90))
    gray = cv.morphologyEx(gray, cv.MORPH_GRADIENT, element)
    gray = gray / 255.0
    gray_resized = cv.resize(gray, (32, 32))  # Resize image to (32, 32)
    gray_rescaled = gray_resized.astype(np.float32)  # Convert to float32
    gray_rgb = cv.cvtColor(gray_rescaled, cv.COLOR_GRAY2RGB)  # Convert to 3 channels
    gray_rgb = np.expand_dims(gray_rgb, axis=0)  # Add batch dimension
    return gray_rgb



@app.post("/predictsimple")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv.imdecode(nparr, cv.IMREAD_COLOR)
    processed_img = preprocess_image(img)
    prediction = model.predict(processed_img)
    predicted_label = np.argmax(prediction)
    predicted_character = dict_word[predicted_label]
    return PredictionResult(predicted_character=predicted_character)
