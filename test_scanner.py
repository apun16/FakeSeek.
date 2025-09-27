#!/usr/bin/env python3
"""
Test script for the deepfake scanner
"""

import json
from deepfake_scanner import DeepfakeScanner

def test_scanner():
    scanner = DeepfakeScanner()
    
    # Test Taylor Swift (should return found results)
    print("Testing Taylor Swift...")
    result = scanner.scan_for_deepfakes("Taylor", "Swift")
    print(json.dumps(result, indent=2))
    
    print("\n" + "="*50 + "\n")
    
    # Test another name (should return clean results)
    print("Testing John Doe...")
    result = scanner.scan_for_deepfakes("John", "Doe")
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    test_scanner()
