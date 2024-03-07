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
model_file = os.path.abspath('../Model/1')
model = load_model(model_file)

# Dictionary to map predicted labels to characters
dict_word = {0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'J', 10: 'K', 11: 'L',
             12: 'M', 13: 'N', 14: 'O', 15: 'P', 16: 'Q', 17: 'R', 18: 'S', 19: 'T', 20: 'U', 21: 'V', 22: 'W',
             23: 'X', 24: 'Y', 25: 'Z'}


class PredictionResult(BaseModel):
    predicted_character: str


def preprocess_image(image):
    gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
    gray = cv.medianBlur(gray, 5)
    _, gray = cv.threshold(gray, 75, 180, cv.THRESH_BINARY)
    element = cv.getStructuringElement(cv.MORPH_RECT, (90, 90))
    gray = cv.morphologyEx(gray, cv.MORPH_GRADIENT, element)
    gray = gray / 255.0
    gray = cv.resize(gray, (28, 28))
    gray = np.reshape(gray, (1, 28, 28, 1))
    return gray


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv.imdecode(nparr, cv.IMREAD_COLOR)
    processed_img = preprocess_image(img)
    prediction = model.predict(processed_img)
    predicted_label = np.argmax(prediction)
    predicted_character = dict_word[predicted_label]
    return PredictionResult(predicted_character=predicted_character)
