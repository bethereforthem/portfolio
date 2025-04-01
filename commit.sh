#!/bin/bash

# Function to generate conventional commit message
generate_commit_message() {
    local file="$1"
    local type=""
    local message=""

    # Determine commit type based on file path
    case "$file" in
        package-lock.json)
            type="chore(deps)"
            message="update package lock dependencies"
            ;;
        package.json)
            type="chore(deps)"
            message="update project dependencies"
            ;;
        .gitignore)
            type="chore"
            message="add gitignore configuration"
            ;;
        README.md)
            type="docs"
            message="add project documentation"
            ;;
        .env)
            type="chore"
            message="add environment variables"
            ;;
        eslint.config.mjs)
            type="config"
            message="add ESLint configuration"
            ;;
        next.config.mjs)
            type="config"
            message="add Next.js build configuration"
            ;;
        jsconfig.json)
            type="config"
            message="add JavaScript configuration"
            ;;
        postcss.config.mjs)
            type="config"
            message="add PostCSS configuration"
            ;;
        tailwind.config.mjs)
            type="config"
            message="add Tailwind CSS configuration"
            ;;
        middleware.ts)
            type="feat"
            message="add middleware functionality"
            ;;
        app/*)
            type="feat(app)"
            message="add app routes and pages"
            ;;
        components/*)
            type="feat(components)"
            message="add UI components"
            ;;
        context/*)
            type="feat(context)"
            message="add application context providers"
            ;;
        lib/*)
            type="feat(lib)"
            message="add utility functions and libraries"
            ;;
        models/*)
            type="feat(models)"
            message="add data models"
            ;;
        config/*)
            type="config"
            message="add configuration files"
            ;;
        assets/*)
            type="assets"
            message="add source assets"
            ;;
        public/*)
            type="assets"
            message="add public assets"
            ;;
        Portfolio2/*)
            type="feat"
            message="add Portfolio2 directory"
            ;;
        *)
            type="chore"
            message="add or update ${file##*/}"
            ;;
    esac

    echo "${type}: ${message}"
}

# Function to commit changes
commit_changes() {
    # Get all tracked modified files
    modified_files=$(git ls-files -m)
    
    # Get all untracked files, including Portfolio2
    untracked_files=$(git ls-files --others --exclude-standard)
    
    echo "Starting commit process..."

    # Process modified files
    if [ -n "$modified_files" ]; then
        echo "Processing modified files..."
        for file in $modified_files; do
            commit_message=$(generate_commit_message "$file")
            git add "$file"
            git commit -m "$commit_message"
            echo "Committed modified file: $file with message - $commit_message"
        done
    else
        echo "No modified files to commit."
    fi

    # Process untracked files, ensuring Portfolio2 is committed
    if [ -n "$untracked_files" ]; then
        echo "Processing untracked files..."
        for file in $untracked_files; do
            commit_message=$(generate_commit_message "$file")
            git add "$file"
            git commit -m "$commit_message"
            echo "Committed untracked file: $file with message - $commit_message"
        done
    else
        echo "No untracked files to commit."
    fi
}

# Main function
main() {
    check_git_repo
    setup_remote_repo
    handle_repository_setup
    
    # Only proceed with individual commits if initial commit isn't created
    if ! handle_initial_commit; then
        commit_changes
    fi
    
    push_to_github
}

# Run the script
main
