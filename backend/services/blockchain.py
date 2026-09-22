import hashlib
import json
import os
import time
import uuid

LEDGER_FILE = "data/blockchain_ledger.json"

def _load_ledger():
    if not os.path.exists(LEDGER_FILE):
        os.makedirs(os.path.dirname(LEDGER_FILE), exist_ok=True)
        with open(LEDGER_FILE, "w") as f:
            json.dump({}, f)
    try:
        with open(LEDGER_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return {}

def _save_ledger(data):
    os.makedirs(os.path.dirname(LEDGER_FILE), exist_ok=True)
    with open(LEDGER_FILE, "w") as f:
        json.dump(data, f, indent=4)

def compute_file_hash(filepath):
    """Computes SHA-256 hash of a file."""
    sha256_hash = hashlib.sha256()
    try:
        with open(filepath, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()
    except Exception as e:
        print(f"Error hashing file: {e}")
        return None

def store_hash_on_chain(filename, file_hash, user_id=None):
    """
    Stores ONLY the cryptographic SHA-256 hash of the resume on the blockchain.
    The actual resume content is NEVER written to the blockchain ledger.
    """
    ledger = _load_ledger()
    
    # Generate a cryptographic transaction hash
    tx_hash = "0x" + hashlib.sha256(f"{uuid.uuid4()}{time.time()}".encode()).hexdigest()
    
    # Store strictly non-sensitive metadata and the SHA-256 fingerprint
    ledger[tx_hash] = {
        "filename": filename,
        "file_hash": file_hash, # SHA-256 Digest
        "user_id": user_id or "anonymous_uid",
        "timestamp": time.time(),
        "status": "CONFIRMED",
        "blockchain_network": "Ethereum Goerli / Polygon Testnet (Simulated)"
    }
    _save_ledger(ledger)
    
    return tx_hash

def verify_file_on_chain(filepath_or_hash, tx_hash):
    """Verifies if the current file's hash matches the SHA-256 fingerprint stored on the blockchain."""
    ledger = _load_ledger()
    
    if tx_hash not in ledger:
        return {"verified": False, "error": "Transaction not found on blockchain"}
    
    stored_data = ledger[tx_hash]
    
    # Determine candidate hash
    if os.path.exists(filepath_or_hash):
        candidate_hash = compute_file_hash(filepath_or_hash)
    else:
        candidate_hash = filepath_or_hash
    
    if candidate_hash == stored_data["file_hash"]:
        return {
            "verified": True, 
            "message": "File integrity verified on blockchain. SHA-256 fingerprint matches immutable ledger.",
            "timestamp": stored_data["timestamp"],
            "hash": candidate_hash
        }
    else:
        return {
            "verified": False, 
            "error": "File has been tampered with or modified. Hash mismatch."
        }
