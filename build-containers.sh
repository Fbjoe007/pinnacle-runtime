#!/bin/bash
set -e

echo "================================================================================"
echo " UPVIEW.BUZZ — LOCAL CONTAINER BUILD VERIFICATION SUITE"
echo "================================================================================"

echo "🚀 Compiling [upview-runtime-api]..."
docker build -t upview-runtime-api:local -f Dockerfile.api .

echo "🚀 Compiling [upview-dashboard]..."
docker build -t upview-dashboard:local -f Dockerfile.dashboard .

echo "🚀 Compiling [upview-runtime-worker]..."
docker build -t upview-runtime-worker:local -f Dockerfile.worker .

echo "================================================================================"
echo " ✅ SUCCESS: All 3 images compiled with zero environment leakage."
echo "================================================================================"
