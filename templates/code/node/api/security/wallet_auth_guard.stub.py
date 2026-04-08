"""
Boundary stub for wallet auth guard.
Controlled by: security.wallet_auth_mode.
"""


def authenticate_wallet_request_stub(*_args, **_kwargs):
    raise NotImplementedError("Implement wallet auth guard in project runtime")
