FROM python:3.9-slim

WORKDIR /app

# Create a subdirectory to act as the package
RUN mkdir brand_intelligence

# Copy files into the subdirectory
COPY agents/ brand_intelligence/agents/
COPY platforms/ brand_intelligence/platforms/
COPY static/ brand_intelligence/static/
COPY *.py brand_intelligence/
COPY requirements.txt .

# Install requirements
RUN pip install --no-cache-dir -r requirements.txt

# Set PYTHONPATH to the parent directory so 'brand_intelligence' is a package
ENV PYTHONPATH=/app

# Run uvicorn pointing to the module inside the subdirectory
CMD ["uvicorn", "brand_intelligence.main:app", "--host", "0.0.0.0", "--port", "7860"]
