FROM python:3.9-slim

# تثبيت الأدوات الأساسية
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# نسخ ملف المتطلبات من المجلد الفرعي وتثبيتها
COPY brand_intelligence/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# نسخ محتويات محرك الذكاء الاصطناعي إلى بيئة العمل
COPY brand_intelligence/ .

# المنفذ الخاص بـ Hugging Face
EXPOSE 7860

# تشغيل المحرك
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
