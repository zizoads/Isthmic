FROM python:3.9-slim

# تثبيت الأدوات الأساسية
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# نسخ المتطلبات وتثبيتها
COPY brand_intelligence/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# نسخ المجلد بالكامل إلى /app/brand_intelligence
COPY brand_intelligence/ /app/brand_intelligence/

# Set PYTHONPATH to the parent directory so 'brand_intelligence' is a package
ENV PYTHONPATH=/app

# المنفذ الخاص بـ Hugging Face
EXPOSE 7860

# تشغيل المحرك
CMD ["uvicorn", "brand_intelligence.main:app", "--host", "0.0.0.0", "--port", "7860"]
