from app.main import app

# Vercel expects a handler function
def handler(request, context):
    return app(request.scope, request.receive, request.send)