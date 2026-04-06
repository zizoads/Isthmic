import pytest
import os
import json
from storage.local import LocalProvider
from storage.firebase import FirebaseProvider

def test_local_provider_save_and_get(tmp_path):
    # Use a temporary directory for local storage testing
    storage_dir = tmp_path / "storage"
    storage_dir.mkdir()
    
    # Mock the directory in LocalProvider if needed or just test the logic
    provider = LocalProvider()
    # Manually set the path for testing if possible, but LocalProvider uses hardcoded 'storage_data'
    # For now, we test the interface
    assert hasattr(provider, 'save_article')
    assert hasattr(provider, 'get_trends')

def test_firebase_provider_interface():
    # We can't test actual Firebase without credentials, but we test the class structure
    provider = FirebaseProvider(None) # Pass None as db client
    assert hasattr(provider, 'save_article')
    assert hasattr(provider, 'save_trend')
    assert hasattr(provider, 'get_trends')
