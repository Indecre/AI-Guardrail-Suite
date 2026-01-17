FROM python:3.11-slim
WORKDIR /app

COPY reqirements.txt .
RUN pip install --no-cache-dir -r reqirements.txt

COPY app ./app

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
