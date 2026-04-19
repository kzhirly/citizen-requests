# backend/app/services/s3_service.py
import boto3
from botocore.client import Config
import uuid
import mimetypes  # <-- ДОБАВИТЬ ЭТУ СТРОКУ

# Настройки MinIO
S3_ENDPOINT = "localhost:9000"
S3_ACCESS_KEY = "minioadmin"
S3_SECRET_KEY = "minioadmin"
S3_BUCKET = "citizen-requests"
S3_USE_SSL = False

def get_s3_client():
    return boto3.client(
        "s3",
        endpoint_url=f"http://{S3_ENDPOINT}" if not S3_USE_SSL else f"https://{S3_ENDPOINT}",
        aws_access_key_id=S3_ACCESS_KEY,
        aws_secret_access_key=S3_SECRET_KEY,
        config=Config(signature_version="s3v4"),
        region_name="us-east-1",
    )

def upload_file(file_data: bytes, original_filename: str, request_id: int, username: str) -> dict:
    client = get_s3_client()
    
    # Определяем MIME тип файла
    content_type, _ = mimetypes.guess_type(original_filename)
    if not content_type:
        content_type = "application/octet-stream"
    
    extension = original_filename.split(".")[-1] if "." in original_filename else ""
    unique_key = f"requests/{request_id}/{username}/{uuid.uuid4()}.{extension}" if extension else f"requests/{request_id}/{username}/{uuid.uuid4()}"
    
    # Загружаем файл с правильным Content-Type
    client.put_object(
        Bucket=S3_BUCKET,
        Key=unique_key,
        Body=file_data,
        ContentType=content_type,  # <-- ДОБАВИТЬ ЭТУ СТРОКУ
    )
    
    url = client.generate_presigned_url(
        'get_object',
        Params={'Bucket': S3_BUCKET, 'Key': unique_key},
        ExpiresIn=3600
    )
    
    return {
        "success": True,
        "key": unique_key,
        "original_name": original_filename,
        "bucket": S3_BUCKET,
        "size": len(file_data),
        "url": url
    }

# ... остальные функции без изменений ...

def get_file_url(key: str, expires_in: int = 3600) -> str:
    """Возвращает временную ссылку на файл"""
    client = get_s3_client()
    return client.generate_presigned_url(
        'get_object',
        Params={'Bucket': S3_BUCKET, 'Key': key},
        ExpiresIn=expires_in
    )

def delete_file(key: str) -> bool:
    """Удаляет файл из MinIO"""
    client = get_s3_client()
    client.delete_object(Bucket=S3_BUCKET, Key=key)
    return True

def list_files(prefix: str) -> list:
    """Получает список файлов с заданным префиксом"""
    client = get_s3_client()
    
    response = client.list_objects_v2(Bucket=S3_BUCKET, Prefix=prefix)
    files = []
    
    if 'Contents' in response:
        for obj in response['Contents']:
            files.append({
                "key": obj['Key'],
                "size": obj['Size'],
                "last_modified": obj['LastModified'].isoformat()
            })
    
    return files