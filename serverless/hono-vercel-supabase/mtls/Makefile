.PHONY: certs clean-certs help

# Default target
help:
	@echo "Available targets:"
	@echo "  make certs       - Generate mTLS certificates (CA, server, client)"
	@echo "  make clean-certs - Remove all generated certificates"
	@echo "  make help        - Show this help message"

# Generate all certificates
certs:
	@echo "Generating mTLS certificates..."
	@bash ./generate-certs.sh

# Clean generated certificates
clean-certs:
	@echo "Removing generated certificates..."
	@rm -rf certs
	@echo "Certificates removed."
