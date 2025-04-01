#!/bin/bash

echo "Adding all changes one by one..."

git status --short | awk '{print $2}' | while read file; do
    echo "Adding $file..."
    git add "$file"
    echo "Committing $file..."
    git commit -m "Added $file"
    echo "Pushing $file..."
    git push origin main
    echo "Done with $file!"
done

echo "All changes committed and pushed one by one!"
