FROM python:3.9-slim

WORKDIR /app

# Copy all files directly to /app
COPY . .

# Install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Set PYTHONPATH to the parent directory so 'brand_intelligence' is a package
ENV PYTHONPATH=/app

# Run uvicorn pointing to the module inside the subdirectory
CMD ["uvicorn", "brand_intelligence.main:app", "--host", "0.0.0.0", "--port", "7860"]
