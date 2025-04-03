#!/bin/bash

# Move to the finanzplaner directory
cd home/ubuntu/finanzplaner_tool

# Make a backup of all files just in case
mkdir -p backup
cp *.js backup/

# Consolidate calculations files
# Keep calculations_updated.js as the main calculation file
cp calculations_updated.js calculations.js

# Remove older and redundant calculation files 
# (using -f flag to avoid error if file doesn't exist)
rm -f calculations_updated_fixed.js
rm -f calculations_updated_fixed2.js
rm -f test_calculations.js
rm -f test_calculations_fixed.js
rm -f test_calculations_fixed2.js

echo "Manually check and update the import statements in ui.js and ui_updated.js:"
echo "1. Change './calculations_updated.js' to './calculations.js'"
echo "2. Make sure ui.js imports all necessary modules like steuerOptimierung, vermoegensAllokation, and liquiditaetsplanung"

echo "Cleanup completed. Backup of original files saved in the backup directory."