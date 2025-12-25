#!/bin/bash

# Update Brand Colors Script - IMPROVED VERSION
# This script updates all brand color references based on .env configuration
# It now works regardless of what color is currently in the files!
#
# Usage:
#   chmod +x scripts/update-brand-colors.sh
#   ./scripts/update-brand-colors.sh [COLOR]
#
# Example:
#   ./scripts/update-brand-colors.sh #04ce56

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "================================================"
echo "🎨 Updating Brand Colors (Improved Script)"
echo "================================================"
echo ""

# Get color from argument or .env
if [ -n "$1" ]; then
    BRAND_PRIMARY_COLOR="$1"
    echo -e "${BLUE}Using color from argument: $BRAND_PRIMARY_COLOR${NC}"
else
    # Try to read from .env
    if [ -f .env ]; then
        BRAND_PRIMARY_COLOR=$(grep "^NEXT_PUBLIC_BRAND_PRIMARY_COLOR=" .env | cut -d'=' -f2)
        if [ -z "$BRAND_PRIMARY_COLOR" ]; then
            BRAND_PRIMARY_COLOR=$(grep "^BRAND_PRIMARY_COLOR=" .env | cut -d'=' -f2)
        fi
    fi

    if [ -z "$BRAND_PRIMARY_COLOR" ]; then
        echo -e "${YELLOW}No color found in .env${NC}"
        read -p "Enter primary color (hex, e.g., #04ce56): " BRAND_PRIMARY_COLOR
        BRAND_PRIMARY_COLOR=${BRAND_PRIMARY_COLOR:-#04ce56}
    else
        echo -e "${BLUE}Using color from .env: $BRAND_PRIMARY_COLOR${NC}"
    fi
fi

# Clean up the color value (remove whitespace, quotes, etc.)
BRAND_PRIMARY_COLOR=$(echo "$BRAND_PRIMARY_COLOR" | tr -d '[:space:]' | tr -d '"' | tr -d "'")

# Validate hex color format
if ! [[ $BRAND_PRIMARY_COLOR =~ ^#[0-9A-Fa-f]{6}$ ]]; then
    echo -e "${RED}❌ Invalid color format. Got: '$BRAND_PRIMARY_COLOR'${NC}"
    echo -e "${RED}Please use hex format like #04ce56${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Applying color: $BRAND_PRIMARY_COLOR${NC}"
echo ""

# Function to convert hex to rgb
hex_to_rgb() {
    local hex=$1
    hex=${hex#"#"}
    printf "rgb(%d %d %d)" 0x${hex:0:2} 0x${hex:2:2} 0x${hex:4:2}
}

# Function to darken color
darken_color() {
    local hex=$1
    local factor=$2
    hex=${hex#"#"}
    local r=$((0x${hex:0:2}))
    local g=$((0x${hex:2:2}))
    local b=$((0x${hex:4:2}))

    r=$(( r * (100 - factor) / 100 ))
    g=$(( g * (100 - factor) / 100 ))
    b=$(( b * (100 - factor) / 100 ))

    printf "#%02x%02x%02x" $r $g $b
}

# Generate color variations
PRIMARY_RGB=$(hex_to_rgb "$BRAND_PRIMARY_COLOR")
PRIMARY_DARK=$(darken_color "$BRAND_PRIMARY_COLOR" 10)
PRIMARY_DARK_RGB=$(hex_to_rgb "$PRIMARY_DARK")

echo -e "${BLUE}Generated color variations:${NC}"
echo "  Primary: $BRAND_PRIMARY_COLOR ($PRIMARY_RGB)"
echo "  Dark: $PRIMARY_DARK ($PRIMARY_DARK_RGB)"
echo ""

# Backup files before modification
BACKUP_DIR=".color-backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

backup_file() {
    local file=$1
    if [ -f "$file" ]; then
        local backup_path="$BACKUP_DIR/$file"
        mkdir -p "$(dirname "$backup_path")"
        cp "$file" "$backup_path"
    fi
}

echo -e "${BLUE}Creating backups...${NC}"
backup_file "packages/ui/src/colors.ts"
backup_file "packages/ui/src/colors.css"
backup_file "apps/builder/src/assets/styles/custom.css"
backup_file "apps/docs/mint.json"
backup_file ".env"
echo -e "${GREEN}  ✓ Backups created${NC}"
echo ""

# Update files
echo -e "${BLUE}Updating color values...${NC}"

# 1. Update packages/ui/src/colors.ts - Use line-based replacement
if [ -f "packages/ui/src/colors.ts" ]; then
    # Replace line 42 (light mode orange-9)
    sed -i '42s/9: "#[0-9A-Fa-f]\{6\}",/9: "'"$BRAND_PRIMARY_COLOR"'",/' packages/ui/src/colors.ts
    # Replace line 43 (light mode orange-10)
    sed -i '43s/10: "#[0-9A-Fa-f]\{6\}",/10: "'"$PRIMARY_DARK"'",/' packages/ui/src/colors.ts
    # Replace line 56 (dark mode orange-9)
    sed -i '56s/9: "#[0-9A-Fa-f]\{6\}",/9: "'"$BRAND_PRIMARY_COLOR"'",/' packages/ui/src/colors.ts
    # Replace line 57 (dark mode orange-10)
    sed -i '57s/10: "#[0-9A-Fa-f]\{6\}",/10: "'"$PRIMARY_DARK"'",/' packages/ui/src/colors.ts
    echo -e "${GREEN}  ✓ packages/ui/src/colors.ts${NC}"
fi

# 2. Update packages/ui/src/colors.css - Use line-based replacement
if [ -f "packages/ui/src/colors.css" ]; then
    # Light mode orange-9 (line 25)
    sed -i '25s/--orange-9: rgb([0-9 ]\+);/--orange-9: '"$PRIMARY_RGB"';/' packages/ui/src/colors.css
    # Light mode orange-10 (line 26)
    sed -i '26s/--orange-10: rgb([0-9 ]\+);/--orange-10: '"$PRIMARY_DARK_RGB"';/' packages/ui/src/colors.css
    # Dark mode orange-9 (line 106)
    sed -i '106s/--orange-9: rgb([0-9 ]\+);/--orange-9: '"$PRIMARY_RGB"';/' packages/ui/src/colors.css
    # Dark mode orange-10 (line 107)
    sed -i '107s/--orange-10: rgb([0-9 ]\+);/--orange-10: '"$PRIMARY_DARK_RGB"';/' packages/ui/src/colors.css
    echo -e "${GREEN}  ✓ packages/ui/src/colors.css${NC}"
fi

# 3. Update apps/builder/src/assets/styles/custom.css - Update comments
if [ -f "apps/builder/src/assets/styles/custom.css" ]; then
    sed -i "s|/\* #[0-9A-Fa-f]\{6\} \*/|/* $BRAND_PRIMARY_COLOR */|g" apps/builder/src/assets/styles/custom.css
    echo -e "${GREEN}  ✓ apps/builder/src/assets/styles/custom.css${NC}"
fi

# 4. Update apps/docs/mint.json - Replace all color instances
if [ -f "apps/docs/mint.json" ]; then
    # Use jq if available for safe JSON manipulation, otherwise use sed
    if command -v jq &> /dev/null; then
        jq --arg color "$BRAND_PRIMARY_COLOR" \
           '.colors.primary = $color | .colors.light = $color | .colors.dark = $color' \
           apps/docs/mint.json > apps/docs/mint.json.tmp && mv apps/docs/mint.json.tmp apps/docs/mint.json
    else
        # Fallback to sed
        sed -i 's/"primary": "#[0-9A-Fa-f]\{6\}"/"primary": "'"$BRAND_PRIMARY_COLOR"'"/' apps/docs/mint.json
        sed -i 's/"light": "#[0-9A-Fa-f]\{6\}"/"light": "'"$BRAND_PRIMARY_COLOR"'"/' apps/docs/mint.json
        sed -i 's/"dark": "#[0-9A-Fa-f]\{6\}"/"dark": "'"$BRAND_PRIMARY_COLOR"'"/' apps/docs/mint.json
    fi
    echo -e "${GREEN}  ✓ apps/docs/mint.json${NC}"
fi

# 5. Update .env file
if [ -f ".env" ]; then
    if grep -q "^NEXT_PUBLIC_BRAND_PRIMARY_COLOR=" .env; then
        sed -i "s/^NEXT_PUBLIC_BRAND_PRIMARY_COLOR=.*/NEXT_PUBLIC_BRAND_PRIMARY_COLOR=$BRAND_PRIMARY_COLOR/" .env
    else
        echo "NEXT_PUBLIC_BRAND_PRIMARY_COLOR=$BRAND_PRIMARY_COLOR" >> .env
    fi
    echo -e "${GREEN}  ✓ .env${NC}"
fi

echo ""
echo "================================================"
echo -e "${GREEN}✅ Brand colors updated successfully!${NC}"
echo "================================================"
echo ""
echo "Backups created in: $BACKUP_DIR"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT - Next steps:${NC}"
echo ""
echo "1. ${BLUE}Restart your dev servers:${NC}"
echo "   Stop current servers (Ctrl+C), then:"
echo "   ${GREEN}bun run dev${NC}"
echo ""
echo "2. ${BLUE}Hard refresh your browser:${NC}"
echo "   ${GREEN}Ctrl+Shift+R${NC} (or Cmd+Shift+R on Mac)"
echo ""
echo "3. ${BLUE}For production:${NC}"
echo "   ${GREEN}bun run build${NC}"
echo ""
echo "Color applied: ${GREEN}$BRAND_PRIMARY_COLOR${NC}"
echo ""
