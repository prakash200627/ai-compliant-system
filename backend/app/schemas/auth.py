from marshmallow import Schema, fields, validate, EXCLUDE

class RegisterSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    name = fields.Str(
        validate=validate.Length(min=1, max=100)
    )
    email = fields.Email(
        required=True,
        validate=validate.Length(max=120),
        error_messages={"required": "email is required"}
    )
    password = fields.Str(
        required=True,
        validate=validate.Length(min=6, max=255),
        error_messages={"required": "password is required"}
    )
    role = fields.Str(
        validate=validate.OneOf(["user", "agent", "admin"]),
        load_default="user"
    )

class LoginSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    email = fields.Email(
        required=True,
        error_messages={"required": "email is required"}
    )
    password = fields.Str(
        required=True,
        error_messages={"required": "password is required"}
    )

class DevLoginSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    email = fields.Email(
        required=True,
        error_messages={"required": "email is required"}
    )
