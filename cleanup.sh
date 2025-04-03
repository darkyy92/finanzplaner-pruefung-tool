#!/bin/bash

# Move to the finanzplaner directory
cd home/ubuntu/finanzplaner_tool

# Make a backup of all files just in case
mkdir -p backup
cp *.js backup/

# Consolidate calculations files
# Keep calculations_updated.js as the main calculation file
mv calculations_updated.js calculations.js

# Remove older and redundant calculation files
rm -f calculations_updated_fixed.js
rm -f calculations_updated_fixed2.js
rm -f test_calculations.js
rm -f test_calculations_fixed.js
rm -f test_calculations_fixed2.js

# Update imports in UI files to point to the new consolidated files
sed -i 's/\.\/calculations_updated\.js/\.\/calculations\.js/g' ui.js
sed -i 's/\.\/calculations_updated\.js/\.\/calculations\.js/g' ui_updated.js

# Update ui.js to include all necessary modules like ui_updated.js does
sed -i '/const calculations = require/a const steuerOptimierung = require('"'"'./calculations_steueroptimierung.js'"'"');\nconst vermoegensAllokation = require('"'"'./calculations_vermoegensallokation.js'"'"');\nconst liquiditaetsplanung = require('"'"'./calculations_liquiditaetsplanung.js'"'"');' ui.js

# Rename ui_updated.js to ui.js (optional)
# mv ui_updated.js ui.js

echo "Cleanup completed. Backup of original files saved in the backup directory."