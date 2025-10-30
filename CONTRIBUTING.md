# Contributing to TypeScript MongoDB Accounting App

Thank you for your interest in contributing! Please follow these guidelines to ensure a smooth development process.

## Development Workflow

### 1. Create an Issue First
- **Every task must start with an Issue**
- Use the appropriate Issue template (Bug Report or Feature Request)
- Provide detailed description and acceptance criteria
- Wait for discussion/approval before starting work

### 2. Create a Branch
```bash
# Create and checkout new branch from main
git checkout main
git pull origin main
git checkout -b feature/issue-123-add-user-auth

# Branch naming convention:
# feature/issue-{number}-{short-description}
# bugfix/issue-{number}-{short-description}
# hotfix/issue-{number}-{short-description}
```

### 3. Development Process
- Write clean, documented TypeScript code
- Follow existing code style and patterns
- Add tests for new functionality
- Ensure all tests pass locally

### 4. Testing Requirements
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Build project
npm run build
```

### 5. Create Pull Request
- **Every Issue must be linked to a Pull Request**
- Use the Pull Request template
- Reference the Issue number: "Closes #123"
- Provide detailed description of changes
- Ensure CI/CD checks pass

### 6. Code Review Process
- Self-review your code before requesting review
- Address all feedback and comments
- Keep PR focused and small when possible
- Update documentation if needed

## Code Standards

### TypeScript Guidelines
- Use strict TypeScript settings
- Define proper interfaces and types
- Avoid `any` type when possible
- Use meaningful variable and function names

### Testing Standards
- Write unit tests for all new functions
- Write integration tests for API endpoints
- Maintain test coverage above 80%
- Use Jest testing framework

### Commit Messages
```bash
# Format: type(scope): description
git commit -m "feat(auth): add user login endpoint"
git commit -m "fix(upload): handle large file validation"
git commit -m "test(api): add integration tests"
git commit -m "docs(readme): update installation guide"
```

## Issue-to-PR Workflow Example

1. **Create Issue**: "Add user authentication"
2. **Create Branch**: `feature/issue-123-add-user-auth`
3. **Develop & Test**: Write code, add tests
4. **Create PR**: "Add user authentication (Closes #123)"
5. **Review & Merge**: Code review, CI passes, merge to main
6. **Issue Closed**: Automatically closed when PR merges

## Branch Protection Rules

- `main` branch is protected
- All changes must go through Pull Requests
- At least 1 approval required (even for self-review)
- CI/CD checks must pass
- No direct pushes to `main`

## Questions?

Feel free to open an Issue for questions about contributing!
