NODE = node
NPM = npm
PORT = 8080
PRETTIER = ./node_modules/.bin/prettier

.PHONY: all
all: install start

# Install Dep
.PHONY: install
install:
	$(NPM) install

# Start the server
.PHONY: start
start:
	$(NPM) start

# Development mode
.PHONY: dev
dev:
	$(NPM) run dev

# Cleaning
.PHONY: clean
clean:
	rm -rf node_modules
	rm -rf *.log

# Format (prettier)
.PHONY: format
format:
	$(PRETTIER) --write "**/*.{js,jsx,ts,tsx,json,css,html}"

.PHONY: format-check
format-check:
	$(PRETTIER) --check "**/*.{js,jsx,ts,tsx,json,css,html}"

# Update
.PHONY: update
update:
	git pull --force --allow-unrelated-histories
	$(NPM) install

.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make          - Install dependencies and start the server"
	@echo "  make install  - Install project dependencies"
	@echo "  make start    - Start the server"
	@echo "  make dev      - Start in development mode"
	@echo "  make clean    - Remove node_modules and logs"
	@echo "  make format   - Format code using Prettier"
	@echo "  make update   - Update repository and dependencies"
	@echo "  make help     - Show this help message"