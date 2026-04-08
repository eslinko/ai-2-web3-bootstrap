"""
Boundary stub for EVM signing path.
Controlled by: security.evm_signing_mode.
"""


def sign_evm_transaction_stub(*_args, **_kwargs):
    raise NotImplementedError("Implement EVM signing path in project runtime")
