#!/bin/bash

# Cleanup Script for Redundant Documentation
# This script removes redundant .md files while preserving essential documentation

echo "🧹 Starting documentation cleanup..."
echo "Total .md files before cleanup: $(find . -name "*.md" -type f | wc -l)"

# Files to KEEP (Essential Documentation)
KEEP_FILES=(
    "./README.md"
    "./ARCHITECTURE_PLAN.md"
    "./package.json"
)

# Create a backup directory
BACKUP_DIR="./docs-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "📦 Created backup directory: $BACKUP_DIR"

# Function to check if file should be kept
should_keep() {
    local file=$1
    for keep in "${KEEP_FILES[@]}"; do
        if [[ "$file" == "$keep" ]]; then
            return 0
        fi
    done
    return 1
}

# Move all .md files except those in KEEP_FILES to backup
moved_count=0
kept_count=0

while IFS= read -r file; do
    if should_keep "$file"; then
        echo "✅ Keeping: $file"
        ((kept_count++))
    else
        # Create directory structure in backup
        dir=$(dirname "$file")
        mkdir -p "$BACKUP_DIR/$dir"
        
        # Move file to backup
        mv "$file" "$BACKUP_DIR/$file"
        ((moved_count++))
    fi
done < <(find . -name "*.md" -type f -not -path "*/node_modules/*" -not -path "*/.git/*")

echo ""
echo "✨ Cleanup Complete!"
echo "📊 Statistics:"
echo "   - Files kept: $kept_count"
echo "   - Files moved to backup: $moved_count"
echo "   - Backup location: $BACKUP_DIR"
echo ""
echo "Total .md files after cleanup: $(find . -name "*.md" -type f | wc -l)"
echo ""
echo "💡 If you need to restore, the backup is in: $BACKUP_DIR"
echo "   To restore all: mv $BACKUP_DIR/* ."
echo "   To delete backup: rm -rf $BACKUP_DIR"
