FROM python:3.9-slim

WORKDIR /app

# Copy all files directly to /app
COPY . .

# Install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Run uvicorn pointing to main:app directly
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
