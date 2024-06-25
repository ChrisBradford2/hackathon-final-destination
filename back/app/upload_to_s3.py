import boto3
from botocore.exceptions import NoCredentialsError

def upload_to_s3(file, bucket_name, s3_file):
    s3 = boto3.client('s3')

    try:
        s3.upload_fileobj(file, bucket_name, s3_file)
        print(f"Upload Successful to {bucket_name}/{s3_file}")
        return True
    except FileNotFoundError:
        print("The file was not found")
        return False
    except NoCredentialsError:
        print("Credentials not available")
        return False
