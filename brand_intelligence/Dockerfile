FROM python:3.10-slim

WORKDIR /app

# Install build dependencies for lxml
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all files
COPY . .

# Run tests (optional: can be commented out if they require network/credentials)
# RUN pytest tests/

# Set PYTHONPATH to the current directory
ENV PYTHONPATH=/app

# Run uvicorn. Note: if this is the root of the space, main:app is correct.
# If it's part of a larger package, brand_intelligence.main:app might be needed.
# We'll use main:app as it's more common for direct folder deployment.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
