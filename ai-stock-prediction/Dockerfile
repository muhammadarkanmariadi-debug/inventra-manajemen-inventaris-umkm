FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (compiler for Stan models)
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 1. Upgrade pip
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# 2. Install cmdstanpy (MUST be < 1.3.0 for prophet 1.1.5 compatibility)
RUN pip install --no-cache-dir "cmdstanpy<1.3.0"

# 3. Install cmdstan (the Stan compiler/runtime itself)
RUN python3 -c "import cmdstanpy; cmdstanpy.install_cmdstan()"

# 4. Install prophet
RUN pip install --no-cache-dir "prophet==1.1.5"

# 5. Install remaining dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8001

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]