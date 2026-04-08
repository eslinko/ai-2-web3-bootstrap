"""
Boundary stub for upload token signing/verifying contract.
Controlled by: security.upload_token_mode.
"""


def sign_upload_token_stub(*_args, **_kwargs):
    raise NotImplementedError("Implement JWT upload token signer in project runtime")
