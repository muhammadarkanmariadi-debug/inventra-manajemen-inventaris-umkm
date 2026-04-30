FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
# Added 'make' and 'pkg-config' which are sometimes needed for Stan compilation
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    python3-dev \
    build-essential \
    make \
    && rm -rf /var/lib/apt/lists/*

# Step 1: Upgrade pip and install build dependencies separately
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# Step 2: Install prophet BEFORE the rest of the requirements
# This ensures it compiles cleanly with the available GCC/G++
RUN pip install --no-cache-dir prophet==1.1.5

# Step 3: Install remaining dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8001

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]