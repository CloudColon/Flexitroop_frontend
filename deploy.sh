#!/bin/bash

# BenchList Frontend Deployment Script
# This script automates the deployment process for the Next.js frontend

set -e  # Exit on any error

echo "========================================="
echo "BenchList Frontend Deployment"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/root/Bench-List"
FRONTEND_DIR="$PROJECT_DIR/frontend"
PM2_APP_NAME="bench-frontend"

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

# Navigate to project directory
print_info "Navigating to project directory..."
cd $PROJECT_DIR

# Pull latest changes from git
print_info "Pulling latest changes from git..."
git pull origin main
print_success "Git pull completed"

# Navigate to frontend directory
cd $FRONTEND_DIR

# Install/update dependencies
print_info "Installing Node.js dependencies..."
npm install --production=false
print_success "Dependencies installed"

# Build the Next.js application
print_info "Building Next.js application..."
npm run build
print_success "Build completed"

# Create logs directory if it doesn't exist
mkdir -p /root/logs

# Check if PM2 app is already running
if pm2 list | grep -q "$PM2_APP_NAME"; then
    print_info "Restarting PM2 application..."
    pm2 delete $PM2_APP_NAME
    pm2 start ecosystem.config.js --env production
    pm2 save
    print_success "PM2 application restarted"
else
    print_info "Starting PM2 application for the first time..."
    pm2 start ecosystem.config.js --env production
    pm2 save
    print_success "PM2 application started"
fi

# Display PM2 status
echo ""
echo "========================================="
print_success "Deployment completed successfully!"
echo "========================================="
echo ""
print_info "PM2 Status:"
pm2 status

echo ""
print_info "View logs with: pm2 logs $PM2_APP_NAME"
print_info "Frontend should be available at: http://139.59.75.176:3000"
