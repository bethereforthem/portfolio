

# Function to check if git repository
check_git_repo() {
    if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
        echo "Error: Not a git repository. Please initialize git first."
        exit 1
    fi
}

# Function to setup remote repository
setup_remote_repo() {
    if ! git remote | grep -q "^origin$"; then
        echo "Setting up remote repository..."
        git remote add origin https://github.com/Entue250/ecommerce-platform.git
        echo "Remote repository setup complete!"
    fi
}

# Function to handle repository setup
handle_repository_setup() {
    current_branch=$(git branch --show-current)
    if [ "$current_branch" = "master" ]; then
        git branch -m master main
        current_branch="main"
    fi
    if [ "$current_branch" != "main" ]; then
        if git show-ref --verify --quiet refs/heads/main; then
            git checkout main
        else
            git checkout -b main
        fi
    fi
    if ! git ls-remote --heads origin main | grep -q main; then
        git push -u origin main
    fi
}

# Function to generate conventional commit message
generate_commit_message() {
    local file="$1"
    case "$file" in
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
    modified_files=$(git ls-files -m)
    untracked_files=$(git ls-files --others --exclude-standard)
    if [ -n "$modified_files" ]; then
        for file in $modified_files; do
            commit_message=$(generate_commit_message "$file")
            git add "$file"
            git commit -m "$commit_message"
        done
    fi
    if [ -n "$untracked_files" ]; then
        for file in $untracked_files; do
            commit_message=$(generate_commit_message "$file")
            git add "$file"
            git commit -m "$commit_message"
        done
    fi
}

# Function to push changes to GitHub
push_to_github() {
    git push -u origin main
}

# Function to handle initial commit
handle_initial_commit() {
    if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
        git add .
        git commit -m "feat: initial commit"
        return 0
    fi
    return 1
}

# Main function
main() {
    check_git_repo
    setup_remote_repo
    handle_repository_setup
    if ! handle_initial_commit; then
        commit_changes
    fi
    push_to_github
}

# Run the script
main
