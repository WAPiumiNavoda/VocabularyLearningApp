FROM python:3.11

COPY . /Api

WORKDIR /Api

RUN pip install -r ./requirements.txt

# Expose port 80
EXPOSE 80

# Command to run the FastAPI application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
