# Базовый образ с Python
FROM python:3.14-slim

# Установка зависимостей системы
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/* && apt-get clean

# Создание рабочей директории
WORKDIR /app

# Копирование и установка зависимостей Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копирование исходного кода приложения
COPY main.py .
COPY src/ ./src/

# Открытие порта
EXPOSE 5555

# Запуск приложения
CMD ["python3", "main.py"]