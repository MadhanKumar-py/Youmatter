import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.core.management import call_command
from django.db import connection
from .models import FriendComment, ForgivenessCount
from .serializers import FriendCommentSerializer, ForgivenessCountSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def run_migrations(request):
    """Force run migrations for special app"""
    try:
        # Check if table exists
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'special_friendcomment'
                );
            """)
            table_exists = cursor.fetchone()[0]
        
        if not table_exists:
            # Run migrations
            call_command('migrate', 'special', verbosity=2)
            return Response({
                'success': True,
                'message': 'Migrations run successfully',
                'table_created': True
            })
        else:
            return Response({
                'success': True,
                'message': 'Table already exists',
                'table_created': False
            })
            
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def add_comment(request):
    """Add a comment to the database"""
    try:
        comment_text = request.data.get('comment', '').strip()
        
        if not comment_text:
            return Response({'error': 'Comment text is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create new comment
        comment = FriendComment.objects.create(
            text=comment_text,
            timestamp=request.data.get('timestamp', None)
        )
        
        serializer = FriendCommentSerializer(comment)
        
        return Response({
            'success': True,
            'message': 'Comment added successfully',
            'comment': serializer.data,
            'total_comments': FriendComment.objects.count()
        }, status=status.HTTP_201_CREATED)
            
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def increment_forgiveness(request):
    """Increment forgiveness count in database"""
    try:
        # Increment forgiveness count
        forgiveness_obj = ForgivenessCount.increment_count()
        
        serializer = ForgivenessCountSerializer(forgiveness_obj)
        
        return Response({
            'success': True,
            'message': 'Forgiveness count updated',
            'forgiveness_data': serializer.data
        }, status=status.HTTP_200_OK)
            
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_friend_data(request):
    """Get current friend data from database"""
    try:
        # Get all comments
        comments = FriendComment.objects.all()
        comment_serializer = FriendCommentSerializer(comments, many=True)
        
        # Get forgiveness count
        forgiveness_obj = ForgivenessCount.get_current_count()
        forgiveness_serializer = ForgivenessCountSerializer(forgiveness_obj)
        
        return Response({
            'comments': comment_serializer.data,
            'forgiveness_data': forgiveness_serializer.data,
            'total_comments': comments.count(),
            'forgiveness_count': forgiveness_obj.count
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)