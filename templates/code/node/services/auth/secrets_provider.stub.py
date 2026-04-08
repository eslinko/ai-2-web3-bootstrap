"""
Boundary stub for secrets source resolution (env / vault / hybrid).
Controlled by: security.secrets_source.
"""


def resolve_secret_stub(*_args, **_kwargs):
    raise NotImplementedError("Implement secrets provider integration in project runtime")
