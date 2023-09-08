package crypto

import "testing"

func TestEcdsa(t *testing.T) {
	// Initialize the Ecdsa struct
	ecdsaObj := &Ecdsa{}

	// Test key generation
	err := ecdsaObj.GenerateKey()
	if err != nil {
		t.Errorf("GenerateKey() failed: %v", err)
	}

	// Test if keys are generated and not empty
	if len(ecdsaObj.PrivateKey) == 0 || len(ecdsaObj.PublicKey) == 0 {
		t.Errorf("Keys were not generated correctly")
	}

	// Sample message
	message := []byte("Hello, ECDSA!")

	// Test signing
	signature, err := ecdsaObj.Sign(message)
	if err != nil {
		t.Errorf("Sign() failed: %v", err)
	}

	// Test if signature is not empty
	if len(signature) == 0 {
		t.Errorf("Signature is empty")
	}

	// Test verification
	valid, err := ecdsaObj.Verify(message, signature)
	if err != nil {
		t.Errorf("Verify() failed: %v", err)
	}

	// Test if signature is valid
	if !valid {
		t.Errorf("Signature verification failed")
	}

	// Test verification with wrong message
	wrongMessage := []byte("Hello, ECDSB!")
	invalid, err := ecdsaObj.Verify(wrongMessage, signature)
	if err != nil {
		t.Errorf("Verify() failed with wrong message: %v", err)
	}

	// Test if signature is invalid with wrong message
	if invalid {
		t.Errorf("Signature verification should fail with wrong message")
	}
}
