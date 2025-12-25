#!/bin/bash

# Update Brand Colors Script
# This script updates all brand color references based on .env configuration
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
echo "🎨 Updating Brand Colors"
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

# Function to lighten color
lighten_color() {
    local hex=$1
    local factor=$2
    hex=${hex#"#"}
    local r=$((0x${hex:0:2}))
    local g=$((0x${hex:2:2}))
    local b=$((0x${hex:4:2}))

    r=$(( r + (255 - r) * factor / 100 ))
    g=$(( g + (255 - g) * factor / 100 ))
    b=$(( b + (255 - b) * factor / 100 ))

    printf "#%02x%02x%02x" $r $g $b
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

echo -e "${BLUE}Generated color variations:${NC}"
echo "  Primary: $BRAND_PRIMARY_COLOR ($PRIMARY_RGB)"
echo "  Dark: $PRIMARY_DARK"
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
        echo -e "${GREEN}  ✓ Backed up: $file${NC}"
    fi
}

echo -e "${BLUE}Creating backups...${NC}"
backup_file "packages/ui/src/colors.ts"
backup_file "packages/ui/src/colors.css"
backup_file "apps/builder/src/assets/styles/custom.css"
backup_file "apps/docs/mint.json"
backup_file ".env"
echo ""

# Update files
echo -e "${BLUE}Updating color values...${NC}"

# Update packages/ui/src/colors.ts
if [ -f "packages/ui/src/colors.ts" ]; then
    # Replace all instances of the old green color
    sed -i "s/#04ce56/$BRAND_PRIMARY_COLOR/g" packages/ui/src/colors.ts
    sed -i "s/#03b54a/$PRIMARY_DARK/g" packages/ui/src/colors.ts
    echo -e "${GREEN}  ✓ packages/ui/src/colors.ts${NC}"
fi

# Update packages/ui/src/colors.css
if [ -f "packages/ui/src/colors.css" ]; then
    sed -i "s/rgb(4 206 86)/$PRIMARY_RGB/g" packages/ui/src/colors.css
    sed -i "s/rgb(3 181 74)/$(hex_to_rgb "$PRIMARY_DARK")/g" packages/ui/src/colors.css
    echo -e "${GREEN}  ✓ packages/ui/src/colors.css${NC}"
fi

# Update apps/builder/src/assets/styles/custom.css
if [ -f "apps/builder/src/assets/styles/custom.css" ]; then
    sed -i "s|/\* #04ce56 \*/|/* $BRAND_PRIMARY_COLOR */|g" apps/builder/src/assets/styles/custom.css
    sed -i "s|/\* #03b54a \*/|/* $PRIMARY_DARK */|g" apps/builder/src/assets/styles/custom.css
    echo -e "${GREEN}  ✓ apps/builder/src/assets/styles/custom.css${NC}"
fi

# Update apps/docs/mint.json
if [ -f "apps/docs/mint.json" ]; then
    # Replace any existing primary colors
    sed -i "s/\"primary\": \"#[0-9A-Fa-f]\{6\}\"/\"primary\": \"$BRAND_PRIMARY_COLOR\"/g" apps/docs/mint.json
    sed -i "s/\"light\": \"#[0-9A-Fa-f]\{6\}\"/\"light\": \"$BRAND_PRIMARY_COLOR\"/g" apps/docs/mint.json
    sed -i "s/\"dark\": \"#[0-9A-Fa-f]\{6\}\"/\"dark\": \"$BRAND_PRIMARY_COLOR\"/g" apps/docs/mint.json
    echo -e "${GREEN}  ✓ apps/docs/mint.json${NC}"
fi

# Update .env file
if [ -f ".env" ]; then
    if grep -q "^NEXT_PUBLIC_BRAND_PRIMARY_COLOR=" .env; then
        sed -i "s/^NEXT_PUBLIC_BRAND_PRIMARY_COLOR=.*/NEXT_PUBLIC_BRAND_PRIMARY_COLOR=$BRAND_PRIMARY_COLOR/" .env
    else
        echo "NEXT_PUBLIC_BRAND_PRIMARY_COLOR=$BRAND_PRIMARY_COLOR" >> .env
    fi

    if grep -q "^BRAND_PRIMARY_COLOR=" .env; then
        sed -i "s/^BRAND_PRIMARY_COLOR=.*/BRAND_PRIMARY_COLOR=$BRAND_PRIMARY_COLOR/" .env
    else
        echo "BRAND_PRIMARY_COLOR=$BRAND_PRIMARY_COLOR" >> .env
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
echo -e "${YELLOW}⚠️  Next steps:${NC}"
echo "1. Restart your dev servers:"
echo "   ${BLUE}bun run dev${NC}"
echo ""
echo "2. Hard refresh your browser:"
echo "   ${BLUE}Ctrl+Shift+R (or Cmd+Shift+R on Mac)${NC}"
echo ""
echo "3. For production, rebuild:"
echo "   ${BLUE}bun run build${NC}"
echo ""
