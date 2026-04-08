"""
Boundary stub for Bearer guards (GPT / edge callbacks).
Controlled by: security.gpt_actions_protection, security.edge_auth_mode.
"""


def validate_bearer_stub(*_args, **_kwargs):
    raise NotImplementedError("Implement Bearer validation in project runtime")
