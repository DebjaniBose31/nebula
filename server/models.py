from tortoise import fields
from tortoise.models import Model

class User(Model):
    id = fields.IntField(pk=True)
    firstname = fields.CharField(max_length=100)
    lastname = fields.CharField(max_length=100)
    email = fields.CharField(max_length=255, unique=True)
    username = fields.CharField(max_length=100, unique=True)
    password = fields.CharField(max_length=255)