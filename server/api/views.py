from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.
def index(request):
    return JsonResponse({"message": "Hello, World!"})

@api_view(['GET'])
def hello_api(request):
    return Response({"message": "Hello, World!"})