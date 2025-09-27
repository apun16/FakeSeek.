#!/bin/bash

# Setup script for Python deepfake scanner dependencies

echo "Setting up Python environment for deepfake scanner..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "pip3 is not installed. Please install pip3 first."
    exit 1
fi

# Install Python dependencies
echo "Installing Python dependencies..."
pip3 install -r requirements.txt

echo "Python environment setup complete!"
echo "You can now test the deepfake scanner by running:"
echo "python3 deepfake_scanner.py 'John' 'Doe'"
