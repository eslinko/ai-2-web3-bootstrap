"""
Boundary stub for wallet challenge/signature auth service.
Controlled by: security.wallet_auth_mode.
"""


def verify_wallet_signature_stub(*_args, **_kwargs):
    raise NotImplementedError("Implement wallet auth service in project runtime")
