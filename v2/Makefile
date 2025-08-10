# PokeLink Web V2 Makefile
# Based on package.json scripts

# Default target
.DEFAULT_GOAL := help

# Variables
YARN := yarn
TSC := $(YARN) tsc
WEBPACK := $(YARN) webpack
BUF := $(YARN) buf

# Colors for output
CYAN := \033[96m
GREEN := \033[92m
YELLOW := \033[93m
RED := \033[91m
NC := \033[0m # No Color

# Help target
.PHONY: help
help: ## Show this help message
	@echo "$(CYAN)PokeLink Web V2 Build System$(NC)"
	@echo "Available targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Preparation
.PHONY: prep
prep: ## Install dependencies (yarn install)
	@echo "$(YELLOW)Installing dependencies...$(NC)"
	$(YARN) install
	@echo "$(GREEN)Dependencies installed successfully$(NC)"

# Protocol Buffer generation
.PHONY: buf-generate
buf-generate: ## Generate Protocol Buffer types
	@echo "$(YELLOW)Generating Protocol Buffer types...$(NC)"
	$(BUF) generate
	@echo "$(GREEN)Protocol Buffer types generated$(NC)"

# Core build targets
.PHONY: build-core
build-core: ## Build core TypeScript and webpack bundle
	@echo "$(YELLOW)Building core libraries...$(NC)"
	$(TSC) -p ./assets/tsconfig.json
	$(WEBPACK) --config webpack.config.js
	@echo "$(GREEN)Core build completed$(NC)"

# Theme build targets
.PHONY: build-themes-nodeps
build-themes-nodeps: ## Build themes without dependencies
	@echo "$(YELLOW)Building themes (no dependencies)...$(NC)"
	$(TSC) -p ./themes/tsconfig.json
	@echo "$(GREEN)Themes build completed$(NC)"

.PHONY: build-themes
build-themes: build-core build-themes-nodeps ## Build themes with dependencies
	@echo "$(GREEN)Full themes build completed$(NC)"

# Badge build targets
.PHONY: build-badges-nodeps
build-badges-nodeps: ## Build badges without dependencies
	@echo "$(YELLOW)Building badges (no dependencies)...$(NC)"
	$(TSC) -p ./badges/tsconfig.json
	@echo "$(GREEN)Badges build completed$(NC)"

.PHONY: build-badges
build-badges: build-core build-badges-nodeps ## Build badges with dependencies
	@echo "$(GREEN)Full badges build completed$(NC)"

# Graveyard build targets
.PHONY: build-graveyards-nodeps
build-graveyards-nodeps: ## Build graveyards without dependencies
	@echo "$(YELLOW)Building graveyards (no dependencies)...$(NC)"
	$(TSC) -p ./graveyards/tsconfig.json
	@echo "$(GREEN)Graveyards build completed$(NC)"

.PHONY: build-graveyards
build-graveyards: build-core build-graveyards-nodeps ## Build graveyards with dependencies
	@echo "$(GREEN)Full graveyards build completed$(NC)"

# Full build
.PHONY: build
build: prep buf-generate build-core build-themes-nodeps build-badges-nodeps build-graveyards-nodeps ## Complete build process
	@echo "$(GREEN)Full build completed successfully!$(NC)"

# Development targets
.PHONY: build-watch
build-watch: ## Build and watch for changes
	@echo "$(YELLOW)Starting watch mode...$(NC)"
	@echo "$(CYAN)Press Ctrl+C to stop$(NC)"
	$(TSC) -p ./assets/tsconfig.json --watch &
	$(TSC) -p ./themes/tsconfig.json --watch &
	$(TSC) -p ./badges/tsconfig.json --watch &
	$(TSC) -p ./graveyards/tsconfig.json --watch &
	wait

.PHONY: dev
dev: build-core build-watch ## Development mode with core build and watch

# Clean targets
.PHONY: clean
clean: ## Clean build artifacts
	@echo "$(YELLOW)Cleaning build artifacts...$(NC)"
	@rm -rf assets/dist/ themes/*/assets/js/*.js themes/*/assets/js/*.js.map
	@rm -rf badges/*/assets/js/*.js badges/*/assets/js/*.js.map
	@rm -rf graveyards/*/assets/js/*.js graveyards/*/assets/js/*.js.map
	@echo "$(GREEN)Clean completed$(NC)"

.PHONY: clean-deps
clean-deps: clean ## Clean build artifacts and dependencies
	@echo "$(YELLOW)Removing node_modules...$(NC)"
	@rm -rf node_modules/
	@echo "$(GREEN)Dependencies removed$(NC)"

# Testing and validation
.PHONY: check-types
check-types: ## Type check all TypeScript files
	@echo "$(YELLOW)Type checking...$(NC)"
	$(TSC) -p ./assets/tsconfig.json --noEmit
	$(TSC) -p ./themes/tsconfig.json --noEmit
	$(TSC) -p ./badges/tsconfig.json --noEmit
	$(TSC) -p ./graveyards/tsconfig.json --noEmit
	@echo "$(GREEN)Type checking completed$(NC)"

.PHONY: validate
validate: check-types ## Validate project (type checking, etc.)
	@echo "$(GREEN)Validation completed successfully$(NC)"

# Individual component builds
.PHONY: build-core-only
build-core-only: build-core ## Build only core components

.PHONY: build-themes-only
build-themes-only: build-themes-nodeps ## Build only themes

.PHONY: build-badges-only
build-badges-only: build-badges-nodeps ## Build only badges

.PHONY: build-graveyards-only
build-graveyards-only: build-graveyards-nodeps ## Build only graveyards

# Quick build (skip prep and buf generate)
.PHONY: quick-build
quick-build: build-core build-themes-nodeps build-badges-nodeps build-graveyards-nodeps ## Quick build without prep/buf generate
	@echo "$(GREEN)Quick build completed$(NC)"

# Production build
.PHONY: build-prod
build-prod: ## Production build with optimizations
	@echo "$(YELLOW)Starting production build...$(NC)"
	NODE_ENV=production $(MAKE) build
	@echo "$(GREEN)Production build completed$(NC)"

# Install and setup
.PHONY: setup
setup: prep buf-generate ## Initial project setup
	@echo "$(GREEN)Project setup completed$(NC)"

# Rebuild everything from scratch
.PHONY: rebuild
rebuild: clean build ## Clean and rebuild everything
	@echo "$(GREEN)Rebuild completed$(NC)"

# Show build info
.PHONY: info
info: ## Show build information
	@echo "$(CYAN)PokeLink Web V2 Build Information$(NC)"
	@echo "Node version: $$(node --version)"
	@echo "Yarn version: $$($(YARN) --version)"
	@echo "TypeScript version: $$($(TSC) --version)"
	@echo "Project version: $$(grep '"version"' package.json | cut -d '"' -f 4)"
	@echo ""
	@echo "$(YELLOW)Available build targets:$(NC)"
	@echo "  - Core libraries (TypeScript + Webpack)"
	@echo "  - Themes (Vue.js components)"
	@echo "  - Badges (Badge display components)"
	@echo "  - Graveyards (Death tracking components)"

# Lint and format (if tools are available)
.PHONY: lint
lint: ## Run linting (if available)
	@if command -v eslint >/dev/null 2>&1; then \
		echo "$(YELLOW)Running ESLint...$(NC)"; \
		eslint . --ext .ts,.js,.vue; \
	else \
		echo "$(RED)ESLint not available$(NC)"; \
	fi

.PHONY: format
format: ## Format code (if available)
	@if command -v prettier >/dev/null 2>&1; then \
		echo "$(YELLOW)Running Prettier...$(NC)"; \
		prettier --write "**/*.{ts,js,vue,json,md}"; \
	else \
		echo "$(RED)Prettier not available$(NC)"; \
	fi

# Documentation
.PHONY: docs
docs: ## Build documentation (if available)
	@echo "$(YELLOW)Documentation is available in the docs/ directory$(NC)"
	@echo "Main documentation: ../docs/README.md"

# Aliases for common tasks
.PHONY: install
install: prep ## Alias for prep

.PHONY: compile
compile: build ## Alias for build

.PHONY: watch
watch: build-watch ## Alias for build-watch

# Error handling
.PHONY: check-yarn
check-yarn:
	@command -v $(YARN) >/dev/null 2>&1 || { echo "$(RED)Error: Yarn is not installed$(NC)"; exit 1; }

# All targets should check for yarn first
prep build-core build-themes-nodeps build-badges-nodeps build-graveyards-nodeps buf-generate: check-yarn