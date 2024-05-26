import graphene
import graphql_jwt
from django.contrib.auth import get_user_model
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required
from graphql_jwt.shortcuts import create_refresh_token, get_token

class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()

class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)
    token = graphene.String()
    refresh_token = graphene.String()

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)

    def mutate(self, info, username, password, email):
        user = get_user_model()(
            username=username,
            email=email,
        )
        user.set_password(password)
        user.save()
        token = get_token(user)
        refresh_token = create_refresh_token(user)
        return CreateUser(user=user, token=token, refresh_token=refresh_token)
    
class ObtainJSONWebToken(graphql_jwt.JSONWebTokenMutation):
    user = graphene.Field(UserType)  

    @classmethod
    def resolve(cls, root, info, **kwargs):
        return cls(user=info.context.user)

class Query(graphene.ObjectType):
    whoami = graphene.Field(UserType)
    users = graphene.List(UserType)

    def resolve_whoami(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Authentication Failure: You must be signed in")
        return user

    @login_required
    def resolve_users(self, info):
        return get_user_model().objects.all()

class Mutation(graphene.ObjectType):
    token_auth = ObtainJSONWebToken.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    verify_token = graphql_jwt.Verify.Field()
    create_user = CreateUser.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
