#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Default ports
FRONTEND_PORT=3000
BACKEND_PORT=8000
REDIS_PORT=6379

# Directory structure
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
LOG_DIR="$BACKEND_DIR/logs"
DATA_DIR="$BACKEND_DIR/data"
WEIGHTS_DIR="$BACKEND_DIR/src/weights"
TRAINING_DIR="$BACKEND_DIR/training_results"

# Function to check if command exists
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}Error: $1 is not installed${NC}"
        exit 1
    fi
}

# Function to find next available port
find_available_port() {
    local port=$1
    while lsof -Pi :$port -sTCP:LISTEN -t >/dev/null; do
        echo -e "${YELLOW}Port $port is in use, trying next port...${NC}"
        port=$((port + 1))
    done
    echo $port
}

# Function to create directory if it doesn't exist
create_dir() {
    if [ ! -d "$1" ]; then
        echo -e "${YELLOW}Creating directory: $1${NC}"
        mkdir -p "$1"
    fi
}

# Function to initialize frontend
initialize_frontend() {
    echo -e "${YELLOW}Initializing frontend project...${NC}"
    create_dir "$FRONTEND_DIR"
    cd "$FRONTEND_DIR" || exit 1
    
    # Initialize a new React project using Vite
    npm create vite@latest . -- --template react-ts --force
    
    # Install additional dependencies
    npm install @tailwindcss/forms lucide-react react-router-dom react-hot-toast firebase
    
    # Initialize Tailwind CSS
    npx tailwindcss init -p
    
    # Create basic directory structure
    mkdir -p src/{components,pages,context,utils}
}

# Function to initialize backend
initialize_backend() {
    echo -e "${YELLOW}Initializing backend project...${NC}"
    create_dir "$BACKEND_DIR"
    create_dir "$BACKEND_DIR/src"
    cd "$BACKEND_DIR" || exit 1
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        python3 -m venv venv
        source venv/bin/activate
    fi
    
    # Create requirements.txt if it doesn't exist
    if [ ! -f "requirements.txt" ]; then
        cat > requirements.txt << EOL
# Core ML/DL
transformers==4.35.2
torch==2.2.0
numpy==1.26.2
scikit-learn==1.3.2
pandas==2.1.3
nltk==3.8.1
spacy==3.7.2

# Web Framework
fastapi==0.104.1
uvicorn==0.24.0
python-multipart==0.0.6
python-jose==3.3.0
passlib==1.7.4
bcrypt==4.0.1

# Task Queue
celery==5.3.4
redis==5.0.1

# Google Cloud
google-cloud-storage==2.13.0
google-auth==2.23.4
google-cloud-logging==3.8.0

# Database
sqlalchemy==2.0.23
alembic==1.12.1
psycopg2-binary==2.9.9
pymongo==4.6.0

# Testing and Development
pytest==7.4.3
black==23.11.0
isort==5.12.0
mypy==1.7.1
pytest-asyncio==0.21.1
httpx==0.25.1

# Utilities
python-dotenv==1.0.0
pydantic==2.5.1
aiohttp==3.9.1
requests==2.31.0
tqdm==4.66.1
PyYAML==6.0.1
EOL
    fi
}

# Check if running from correct directory
if [ ! -f "$SCRIPT_DIR/start_services.sh" ]; then
    echo -e "${RED}Error: Please run this script from the project root directory${NC}"
    exit 1
fi

# Check required commands
echo -e "${YELLOW}Checking required commands...${NC}"
check_command "python3"
check_command "npm"
check_command "node"
check_command "pip"
check_command "redis-server"

# Create necessary directories
echo -e "${YELLOW}Creating necessary directories...${NC}"
create_dir "$LOG_DIR"
create_dir "$DATA_DIR"
create_dir "$WEIGHTS_DIR"
create_dir "$TRAINING_DIR"

# Initialize projects if they don't exist
if [ ! -d "$FRONTEND_DIR" ]; then
    initialize_frontend
fi

if [ ! -d "$BACKEND_DIR/src" ]; then
    initialize_backend
fi

# Find available ports
echo -e "${YELLOW}Checking for available ports...${NC}"
FRONTEND_PORT=$(find_available_port $FRONTEND_PORT)
BACKEND_PORT=$(find_available_port $BACKEND_PORT)
REDIS_PORT=$(find_available_port $REDIS_PORT)

echo -e "${GREEN}Using ports:${NC}"
echo -e "Frontend: ${GREEN}$FRONTEND_PORT${NC}"
echo -e "Backend: ${GREEN}$BACKEND_PORT${NC}"
echo -e "Redis: ${GREEN}$REDIS_PORT${NC}"

# Install dependencies
echo -e "${YELLOW}Installing Python dependencies...${NC}"
cd "$BACKEND_DIR" || exit 1
if [ -d "venv" ]; then
    source venv/bin/activate
fi
pip install -r requirements.txt

echo -e "${YELLOW}Installing Node.js dependencies...${NC}"
cd "$FRONTEND_DIR" || exit 1
npm install

# Start Redis server
echo -e "${YELLOW}Starting Redis server...${NC}"
cd "$SCRIPT_DIR" || exit 1
redis-server --port $REDIS_PORT > "$LOG_DIR/redis.log" 2>&1 &
REDIS_PID=$!
echo $REDIS_PID > "$LOG_DIR/redis.pid"

# Wait for Redis to start
sleep 2

# Start Celery worker with dynamic Redis port
echo -e "${YELLOW}Starting Celery worker...${NC}"
cd "$BACKEND_DIR" || exit 1
if [ -d "venv" ]; then
    source venv/bin/activate
fi
REDIS_URL="redis://localhost:$REDIS_PORT"
celery -A src.tasks worker --broker=$REDIS_URL --loglevel=info > "$LOG_DIR/celery.log" 2>&1 &
CELERY_PID=$!
echo $CELERY_PID > "$LOG_DIR/celery.pid"

# Start backend server with dynamic port
echo -e "${YELLOW}Starting backend server...${NC}"
cd "$BACKEND_DIR/src" || exit 1
uvicorn main:app --host 0.0.0.0 --port $BACKEND_PORT --reload > "$LOG_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > "$LOG_DIR/backend.pid"

# Start frontend development server with dynamic port
echo -e "${YELLOW}Starting frontend development server...${NC}"
cd "$FRONTEND_DIR" || exit 1
export PORT=$FRONTEND_PORT
npm run dev > "$LOG_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > "$LOG_DIR/frontend.pid"

# Function to cleanup processes
cleanup() {
    echo -e "${YELLOW}Stopping services...${NC}"
    for pid_file in "$LOG_DIR"/*.pid; do
        if [ -f "$pid_file" ]; then
            kill $(cat "$pid_file") 2>/dev/null
            rm "$pid_file"
        fi
    done
    exit 0
}

# Register cleanup function
trap cleanup SIGINT SIGTERM

# Save port configuration for other services
cat > "$BACKEND_DIR/.env.ports" << EOL
FRONTEND_PORT=$FRONTEND_PORT
BACKEND_PORT=$BACKEND_PORT
REDIS_PORT=$REDIS_PORT
EOL

# Update backend environment with new ports
if [ -f "$BACKEND_DIR/.env" ]; then
    sed -i.bak "s/REDIS_PORT=.*/REDIS_PORT=$REDIS_PORT/" "$BACKEND_DIR/.env"
    rm "$BACKEND_DIR/.env.bak"
fi

# Print service URLs
echo -e "\n${GREEN}Services started successfully!${NC}"
echo -e "Frontend: ${GREEN}http://localhost:$FRONTEND_PORT${NC}"
echo -e "Backend: ${GREEN}http://localhost:$BACKEND_PORT${NC}"
echo -e "API Documentation: ${GREEN}http://localhost:$BACKEND_PORT/docs${NC}"
echo -e "Redis: ${GREEN}localhost:$REDIS_PORT${NC}"
echo -e "\nLog files are in the ${YELLOW}$LOG_DIR${NC} directory"
echo -e "Press ${YELLOW}Ctrl+C${NC} to stop all services\n"

# Keep script running
wait 