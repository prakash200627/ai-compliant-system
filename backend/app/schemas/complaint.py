from marshmallow import Schema, fields, validate, EXCLUDE

class ComplaintCreateSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    title = fields.Str(
        required=True,
        validate=validate.Length(min=1, max=200),
        error_messages={"required": "title is required"}
    )
    description = fields.Str(
        required=True,
        validate=validate.Length(min=1),
        error_messages={"required": "description is required"}
    )

class ComplaintStatusUpdateSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    status = fields.Str(
        required=True,
        validate=validate.Length(min=1, max=20),
        error_messages={"required": "status is required"}
    )
