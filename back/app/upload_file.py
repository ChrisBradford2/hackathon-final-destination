import boto3
from botocore.exceptions import NoCredentialsError
from app import db
from app.models.Audio import Audio
from app.models.FileUpload import FileUpload
from flask import current_app as app

def upload_file(file, bucket_name, s3_file):
    s3 = boto3.client('s3')

    try:
        s3.upload_fileobj(file, bucket_name, s3_file)
        app.logger.info(f"Upload Successful to {bucket_name}/{s3_file}")

        # Générer l'URL du fichier S3
        url = f"https://{bucket_name}.s3.amazonaws.com/{s3_file}"
        
        # Create a new FileUpload object and add it to the database
        new_upload = FileUpload(filename=file.filename, bucket_name=bucket_name, s3_key=s3_file)
        db.session.add(new_upload)
        db.session.commit()
        app.logger.info(f"FileUpload entry created: {new_upload}")

        # Create a new Audio object associated with the FileUpload
        new_audio = Audio(audio=file.filename, file_upload_id=new_upload.id, filename=file.filename, bucket_name=bucket_name, s3_key=s3_file, url=url)
        db.session.add(new_audio)
        db.session.commit()
        app.logger.info(f"Audio entry created: {new_audio}")

        return True
    except FileNotFoundError:
        app.logger.error("The file was not found")
        return False
    except NoCredentialsError:
        app.logger.error("Credentials not available")
        return False
    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}")
        return False
