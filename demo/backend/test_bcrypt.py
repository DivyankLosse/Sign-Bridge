from passlib.context import CryptContext
import sys

print("Testing bcrypt...")
try:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    password = "password123"
    print(f"Hashing: {password}")
    hashed = pwd_context.hash(password)
    print(f"Hashed: {hashed}")
    print(f"Verify: {pwd_context.verify(password, hashed)}")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()

import bcrypt
print(f"Bcrypt version: {bcrypt.__version__}")
