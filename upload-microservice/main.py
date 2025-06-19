# from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Depends, Request, status
# from fastapi.security import OAuth2PasswordBearer
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import StreamingResponse
# from minio import Minio
# from minio.error import S3Error
# import httpx
# import os
# import logging
# from typing import List, Optional
# from fastapi.responses import JSONResponse
# from io import BytesIO
# from dotenv import load_dotenv
# from pydantic import BaseModel

# # Load environment variables
# load_dotenv()

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# app = FastAPI(title="File Upload Microservice")

# # CORS configuration
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_credentials=True,
#     allow_methods=["GET", "POST", "PUT", "OPTIONS"],
#     allow_headers=["Authorization", "Content-Type"],
# )

# # MinIO configuration
# MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "minio:9000")
# MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
# MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin")
# ALLOWED_EXTENSIONS = {".pdf"}  # Restrict to PDF only

# # Auth microservice URL
# AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth-service:8000/verify-token")

# # Pydantic model for User
# class User(BaseModel):
#     email: str

# # Initialize MinIO client
# try:
#     minio_client = Minio(
#         MINIO_ENDPOINT,
#         access_key=MINIO_ACCESS_KEY,
#         secret_key=MINIO_SECRET_KEY,
#         secure=False  # Set to True if using HTTPS
#     )
#     logger.info("MinIO client initialized successfully")
# except Exception as e:
#     logger.error(f"Failed to initialize MinIO client: {str(e)}")
#     raise HTTPException(status_code=500, detail=f"MinIO client initialization failed: {str(e)}")

# # Function to sanitize email for MinIO bucket name
# def sanitize_email_for_bucket(email: str) -> str:
#     sanitized = email.lower().replace("@", "-").replace(".", "-")
#     sanitized = "".join(c if c.isalnum() or c == "-" else "-" for c in sanitized)
#     sanitized = sanitized.strip("-")
#     if len(sanitized) < 3:
#         sanitized = sanitized + "-bucket"
#     elif len(sanitized) > 63:
#         sanitized = sanitized[:63].rstrip("-")
#     return sanitized

# # Ensure bucket exists for a specific user
# def ensure_user_bucket(email: str):
#     bucket_name = sanitize_email_for_bucket(email)
#     try:
#         if not minio_client.bucket_exists(bucket_name):
#             logger.info(f"Creating bucket: {bucket_name}")
#             minio_client.make_bucket(bucket_name)
#             logger.info(f"Bucket {bucket_name} created successfully")
#         else:
#             logger.info(f"Bucket {bucket_name} already exists")
#         return bucket_name
#     except S3Error as err:
#         logger.error(f"MinIO error creating bucket {bucket_name}: {str(err)}")
#         raise HTTPException(status_code=500, detail=f"MinIO error creating bucket {bucket_name}: {str(err)}")
#     except Exception as e:
#         logger.error(f"Unexpected error creating bucket {bucket_name}: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Unexpected error creating bucket: {str(e)}")

# # Authentication dependency
# async def get_current_user(request: Request) -> User:
#     token = request.headers.get("Authorization")
#     if not token or not token.startswith("Bearer "):
#         logger.warning("Missing or invalid token")
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing or invalid token")

#     try:
#         async with httpx.AsyncClient() as client:
#             response = await client.post(
#                 AUTH_SERVICE_URL,
#                 headers={"Authorization": token}
#             )
#             response.raise_for_status()
#             try:
#                 user_data = response.json()
#                 logger.debug(f"Auth service response: {user_data}")
#             except ValueError:
#                 logger.error("Auth service returned invalid JSON response")
#                 raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid auth response: non-JSON response")

#             if not user_data:
#                 logger.error("Auth service returned empty response")
#                 raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid auth response: empty response")

#             email = user_data.get("email") or user_data.get("preferred_username")
#             if not email:
#                 logger.error("Missing email or preferred_username in auth response")
#                 raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing email in user information")

#             return User(email=email)
#     except httpx.HTTPError as e:
#         logger.error(f"Auth service error: {str(e)}")
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Auth service error: {str(e)}")

# @app.post("/upload/")
# async def upload_file(
#     file: UploadFile = File(...),
#     filiere: str = Form(...),
#     module: str = Form(...),
#     element: str = Form(...),
#     titre: str = Form(...),
#     current_user: User = Depends(get_current_user)
# ):
#     # Validate file extension
#     file_extension = os.path.splitext(file.filename)[1].lower()
#     if file_extension not in ALLOWED_EXTENSIONS:
#         logger.warning(f"Rejected file {file.filename} with extension {file_extension}")
#         raise HTTPException(status_code=400, detail=f"File type {file_extension} not allowed. Only PDF files are allowed.")

#     # Validate required fields
#     if not filiere.strip() or not module.strip() or not element.strip() or not titre.strip():
#         logger.warning("One or more required fields (filiere, module, element, titre) are empty")
#         raise HTTPException(status_code=400, detail="Filiere, module, element, and titre must not be empty")

#     # Get or create bucket for the user
#     bucket_name = ensure_user_bucket(current_user.email)

#     try:
#         logger.info(f"Uploading file {file.filename} to bucket {bucket_name} by user {current_user.email} with metadata: filiere={filiere}, module={module}, element={element}, titre={titre}")
        
#         # Read file content into BytesIO
#         content = await file.read()
#         file_like = BytesIO(content)
        
#         # Create flat object name
#         object_name = f"{filiere}_{module}_{element}_{titre}.pdf"
        
#         # Upload to MinIO with metadata
#         metadata = {
#             "email": current_user.email,
#             "filiere": filiere,
#             "module": module,
#             "element": element,
#             "titre": titre
#         }
#         minio_client.put_object(
#             bucket_name,
#             object_name,
#             data=file_like,
#             length=len(content),
#             content_type="application/pdf",
#             metadata=metadata
#         )
#         logger.info(f"File {file.filename} uploaded successfully to {bucket_name}/{object_name}")
#         return JSONResponse(
#             status_code=200,
#             content={
#                 "message": f"File uploaded successfully to bucket {bucket_name}",
#                 "path": object_name,
#                 "metadata": metadata
#             }
#         )
#     except S3Error as err:
#         logger.error(f"Failed to upload file {file.filename} to {bucket_name}: {str(err)}")
#         raise HTTPException(status_code=500, detail="Failed to upload file")
#     except Exception as e:
#         logger.error(f"Unexpected error uploading file {file.filename}: {str(e)}")
#         raise HTTPException(status_code=500, detail="Unexpected error uploading file")

# @app.put("/update/{object_name}")
# async def update_file(
#     object_name: str,
#     file: Optional[UploadFile] = File(None),
#     filiere: Optional[str] = Form(None),
#     module: Optional[str] = Form(None),
#     element: Optional[str] = Form(None),
#     titre: Optional[str] = Form(None),
#     current_user: User = Depends(get_current_user)
# ):
#     # Get user's bucket
#     bucket_name = ensure_user_bucket(current_user.email)

#     # Check if file exists
#     try:
#         minio_client.stat_object(bucket_name, object_name)
#     except S3Error as err:
#         if err.code == "NoSuchKey":
#             logger.warning(f"File {object_name} not found in bucket {bucket_name}")
#             raise HTTPException(status_code=404, detail=f"File {object_name} not found")
#         logger.error(f"MinIO error checking file {object_name}: {str(err)}")
#         raise HTTPException(status_code=500, detail=f"MinIO error: {str(err)}")

#     # Fetch current metadata using stat_object
#     try:
#         obj_stat = minio_client.stat_object(bucket_name, object_name)
#         current_metadata = obj_stat.metadata
#     except S3Error as err:
#         logger.error(f"Failed to fetch metadata for {object_name}: {str(err)}")
#         raise HTTPException(status_code=500, detail=f"Failed to fetch metadata: {str(err)}")

#     # Prepare updated metadata
#     metadata = {
#         "email": current_user.email,
#         "filiere": filiere if filiere is not None else current_metadata.get("x-amz-meta-filiere", ""),
#         "module": module if module is not None else current_metadata.get("x-amz-meta-module", ""),
#         "element": element if element is not None else current_metadata.get("x-amz-meta-element", ""),
#         "titre": titre if titre is not None else current_metadata.get("x-amz-meta-titre", "")
#     }

#     # Validate metadata if provided
#     if any(metadata[key] for key in ["filiere", "module", "element", "titre"]) and not all(metadata[key].strip() for key in ["filiere", "module", "element", "titre"]):
#         logger.warning("One or more required fields (filiere, module, element, titre) are empty")
#         raise HTTPException(status_code=400, detail="Filiere, module, element, and titre must not be empty if provided")

#     # Generate new object name if metadata changes
#     new_object_name = object_name
#     if any([filiere, module, element, titre]):
#         new_object_name = f"{metadata['filiere']}_{metadata['module']}_{metadata['element']}_{metadata['titre']}.pdf"

#     try:
#         # If a new file is provided, validate and upload it
#         if file:
#             file_extension = os.path.splitext(file.filename)[1].lower()
#             if file_extension not in ALLOWED_EXTENSIONS:
#                 logger.warning(f"Rejected file {file.filename} with extension {file_extension}")
#                 raise HTTPException(status_code=400, detail=f"File type {file_extension} not allowed. Only PDF files are allowed.")

#             content = await file.read()
#             file_like = BytesIO(content)
#         else:
#             # If no new file, copy existing file content
#             existing_file = minio_client.get_object(bucket_name, object_name)
#             content = existing_file.read()
#             file_like = BytesIO(content)

#         # Upload updated file (or copy existing) with new metadata
#         minio_client.put_object(
#             bucket_name,
#             new_object_name,
#             data=file_like,
#             length=len(content),
#             content_type="application/pdf",
#             metadata=metadata
#         )

#         # Remove old file if object_name changed
#         if new_object_name != object_name:
#             minio_client.remove_object(bucket_name, object_name)

#         logger.info(f"File {new_object_name} updated successfully in bucket {bucket_name} by user {current_user.email}")
#         return JSONResponse(
#             status_code=200,
#             content={
#                 "message": f"File updated successfully in bucket {bucket_name}",
#                 "path": new_object_name,
#                 "metadata": metadata
#             }
#         )
#     except S3Error as err:
#         logger.error(f"Failed to update file {object_name} in {bucket_name}: {str(err)}")
#         raise HTTPException(status_code=500, detail="Failed to update file")
#     except Exception as e:
#         logger.error(f"Unexpected error updating file {object_name}: {str(e)}")
#         raise HTTPException(status_code=500, detail="Unexpected error updating file")

# @app.get("/list-files/")
# async def list_files(current_user: User = Depends(get_current_user)):
#     # Get user's bucket
#     bucket_name = sanitize_email_for_bucket(current_user.email)
    
#     try:
#         if not minio_client.bucket_exists(bucket_name):
#             logger.info(f"No bucket found: {bucket_name}")
#             return {"files": [], "message": f"No bucket found: {bucket_name}"}
        
#         # List objects in the user's bucket
#         objects = minio_client.list_objects(bucket_name, recursive=True)
#         files = []
#         for obj in objects:
#             try:
#                 obj_stat = minio_client.stat_object(bucket_name, obj.object_name)
#                 metadata = {
#                     "email": obj_stat.metadata.get("x-amz-meta-email", ""),
#                     "filiere": obj_stat.metadata.get("x-amz-meta-filiere", ""),
#                     "module": obj_stat.metadata.get("x-amz-meta-module", ""),
#                     "element": obj_stat.metadata.get("x-amz-meta-element", ""),
#                     "titre": obj_stat.metadata.get("x-amz-meta-titre", "")
#                 }
#                 files.append({
#                     "object_name": obj.object_name,
#                     "metadata": metadata
#                 })
#             except S3Error as err:
#                 logger.error(f"Failed to fetch metadata for {obj.object_name}: {str(err)}")
#                 continue
        
#         logger.info(f"Listed {len(files)} files in bucket {bucket_name} for user {current_user.email}")
#         return {"files": files, "bucket": bucket_name}
#     except S3Error as err:
#         logger.error(f"Failed to list files in {bucket_name}: {str(err)}")
#         raise HTTPException(status_code=500, detail="Failed to list files")
#     except Exception as e:
#         logger.error(f"Unexpected error listing files in {bucket_name}: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Unexpected error listing files: {str(e)}")

# @app.get("/download/{object_name}")
# async def download_file(
#     object_name: str,
#     current_user: User = Depends(get_current_user)
# ):
#     # Get user's bucket
#     bucket_name = ensure_user_bucket(current_user.email)

#     # Check if file exists
#     try:
#         minio_client.stat_object(bucket_name, object_name)
#     except S3Error as err:
#         if err.code == "NoSuchKey":
#             logger.warning(f"File {object_name} not found in bucket {bucket_name}")
#             raise HTTPException(status_code=404, detail=f"File {object_name} not found")
#         logger.error(f"MinIO error checking file {object_name}: {str(err)}")
#         raise HTTPException(status_code=500, detail=f"MinIO error: {str(err)}")

#     try:
#         # Get file content
#         response = minio_client.get_object(bucket_name, object_name)
#         content = response.read()

#         # Stream file content as response
#         return StreamingResponse(
#             BytesIO(content),
#             media_type="application/pdf",
#             headers={
#                 "Content-Disposition": f"attachment; filename={object_name}",
#                 "Content-Length": str(len(content))
#             }
#         )
#     except S3Error as err:
#         logger.error(f"Failed to download file {object_name} from {bucket_name}: {str(err)}")
#         raise HTTPException(status_code=500, detail="Failed to download file")
#     except Exception as e:
#         logger.error(f"Unexpected error downloading file {object_name}: {str(e)}")
#         raise HTTPException(status_code=500, detail="Unexpected error downloading file")
#     finally:
#         response.close()
#         response.release_conn()










from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Depends, Request, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from minio import Minio
from minio.error import S3Error
import httpx
import os
import logging
from typing import List, Optional
from fastapi.responses import JSONResponse
from io import BytesIO
from dotenv import load_dotenv
from pydantic import BaseModel

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="File Upload Microservice")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "").split(",")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    # allow_origins=CORS_ORIGINS,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:8000",  # Add Keycloak callback
        "http://localhost:8001",
        "http://localhost:8002",
        "http://localhost:8003",

        "http://127.0.0.1:8000",  # Add Keycloak callback
        "http://127.0.0.1:8001", # Ensure FastAPI itself # Ensure FastAPI itself
        "http://127.0.0.1:8002",
        "http://127.0.0.1:8003",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        

        "http://192.168.1.30:3000",
        "http://192.168.1.30:3001",
        "http://192.168.1.30:8000",  # Add Keycloak callback
        "http://192.168.1.30:8001",
        "http://192.168.1.30:8002",
        "http://192.168.1.30:8003" 

        ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

# MinIO configuration
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "minio:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin")
ALLOWED_EXTENSIONS = {".pdf"}  # Restrict to PDF only

# Auth microservice URL
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth-service:8000/verify-token")

# Pydantic model for User
class User(BaseModel):
    email: str

# Initialize MinIO client
try:
    minio_client = Minio(
        MINIO_ENDPOINT,
        access_key=MINIO_ACCESS_KEY,
        secret_key=MINIO_SECRET_KEY,
        secure=False  # Set to True if using HTTPS
    )
    logger.info("MinIO client initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize MinIO client: {str(e)}")
    raise HTTPException(status_code=500, detail=f"MinIO client initialization failed: {str(e)}")

# Function to sanitize email for MinIO bucket name
def sanitize_email_for_bucket(email: str) -> str:
    sanitized = email.lower().replace("@", "-").replace(".", "-")
    sanitized = "".join(c if c.isalnum() or c == "-" else "-" for c in sanitized)
    sanitized = sanitized.strip("-")
    if len(sanitized) < 3:
        sanitized = sanitized + "-bucket"
    elif len(sanitized) > 63:
        sanitized = sanitized[:63].rstrip("-")
    return sanitized

# Ensure bucket exists for a specific user
def ensure_user_bucket(email: str):
    bucket_name = sanitize_email_for_bucket(email)
    try:
        if not minio_client.bucket_exists(bucket_name):
            logger.info(f"Creating bucket: {bucket_name}")
            minio_client.make_bucket(bucket_name)
            logger.info(f"Bucket {bucket_name} created successfully")
        else:
            logger.info(f"Bucket {bucket_name} already exists")
        return bucket_name
    except S3Error as err:
        logger.error(f"MinIO error creating bucket {bucket_name}: {str(err)}")
        raise HTTPException(status_code=500, detail=f"MinIO error creating bucket {bucket_name}: {str(err)}")
    except Exception as e:
        logger.error(f"Unexpected error creating bucket {bucket_name}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error creating bucket: {str(e)}")

# Authentication dependency
async def get_current_user(request: Request) -> User:
    token = request.headers.get("Authorization")
    if not token or not token.startswith("Bearer "):
        logger.warning("Missing or invalid token")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing or invalid token")

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                AUTH_SERVICE_URL,
                headers={"Authorization": token}
            )
            response.raise_for_status()
            try:
                user_data = response.json()
                logger.debug(f"Auth service response: {user_data}")
            except ValueError:
                logger.error("Auth service returned invalid JSON response")
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid auth response: non-JSON response")

            if not user_data:
                logger.error("Auth service returned empty response")
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid auth response: empty response")

            email = user_data.get("email") or user_data.get("preferred_username")
            if not email:
                logger.error("Missing email or preferred_username in auth response")
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing email in user information")

            return User(email=email)
    except httpx.HTTPError as e:
        logger.error(f"Auth service error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Auth service error: {str(e)}")

@app.post("/upload/")
async def upload_file(
    file: UploadFile = File(...),
    filiere: str = Form(...),
    module: str = Form(...),
    element: str = Form(...),
    titre: str = Form(...),
    current_user: User = Depends(get_current_user)
):
    # Validate file extension
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        logger.warning(f"Rejected file {file.filename} with extension {file_extension}")
        raise HTTPException(status_code=400, detail=f"File type {file_extension} not allowed. Only PDF files are allowed.")

    # Validate required fields
    if not filiere.strip() or not module.strip() or not element.strip() or not titre.strip():
        logger.warning("One or more required fields (filiere, module, element, titre) are empty")
        raise HTTPException(status_code=400, detail="Filiere, module, element, and titre must not be empty")

    # Get or create bucket for the user
    bucket_name = ensure_user_bucket(current_user.email)

    try:
        logger.info(f"Uploading file {file.filename} to bucket {bucket_name} by user {current_user.email} with metadata: filiere={filiere}, module={module}, element={element}, titre={titre}")
        
        # Read file content into BytesIO
        content = await file.read()
        file_like = BytesIO(content)
        
        # Create flat object name
        object_name = f"{filiere}_{module}_{element}_{titre}.pdf"
        
        # Upload to MinIO with metadata
        metadata = {
            "email": current_user.email,
            "filiere": filiere,
            "module": module,
            "element": element,
            "titre": titre
        }
        minio_client.put_object(
            bucket_name,
            object_name,
            data=file_like,
            length=len(content),
            content_type="application/pdf",
            metadata=metadata
        )
        logger.info(f"File {file.filename} uploaded successfully to {bucket_name}/{object_name}")
        return JSONResponse(
            status_code=200,
            content={
                "message": f"File uploaded successfully to bucket {bucket_name}",
                "path": object_name,
                "metadata": metadata
            }
        )
    except S3Error as err:
        logger.error(f"Failed to upload file {file.filename} to {bucket_name}: {str(err)}")
        raise HTTPException(status_code=500, detail="Failed to upload file")
    except Exception as e:
        logger.error(f"Unexpected error uploading file {file.filename}: {str(e)}")
        raise HTTPException(status_code=500, detail="Unexpected error uploading file")

@app.put("/update/{object_name}")
async def update_file(
    object_name: str,
    file: Optional[UploadFile] = File(None),
    filiere: Optional[str] = Form(None),
    module: Optional[str] = Form(None),
    element: Optional[str] = Form(None),
    titre: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user)
):
    # Get user's bucket
    bucket_name = ensure_user_bucket(current_user.email)

    # Check if file exists
    try:
        minio_client.stat_object(bucket_name, object_name)
    except S3Error as err:
        if err.code == "NoSuchKey":
            logger.warning(f"File {object_name} not found in bucket {bucket_name}")
            raise HTTPException(status_code=404, detail=f"File {object_name} not found")
        logger.error(f"MinIO error checking file {object_name}: {str(err)}")
        raise HTTPException(status_code=500, detail=f"MinIO error: {str(err)}")

    # Fetch current metadata using stat_object
    try:
        obj_stat = minio_client.stat_object(bucket_name, object_name)
        current_metadata = obj_stat.metadata
    except S3Error as err:
        logger.error(f"Failed to fetch metadata for {object_name}: {str(err)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch metadata: {str(err)}")

    # Prepare updated metadata
    metadata = {
        "email": current_user.email,
        "filiere": filiere if filiere is not None else current_metadata.get("x-amz-meta-filiere", ""),
        "module": module if module is not None else current_metadata.get("x-amz-meta-module", ""),
        "element": element if element is not None else current_metadata.get("x-amz-meta-element", ""),
        "titre": titre if titre is not None else current_metadata.get("x-amz-meta-titre", "")
    }

    # Validate metadata if provided
    if any(metadata[key] for key in ["filiere", "module", "element", "titre"]) and not all(metadata[key].strip() for key in ["filiere", "module", "element", "titre"]):
        logger.warning("One or more required fields (filiere, module, element, titre) are empty")
        raise HTTPException(status_code=400, detail="Filiere, module, element, and titre must not be empty if provided")

    # Generate new object name if metadata changes
    new_object_name = object_name
    if any([filiere, module, element, titre]):
        new_object_name = f"{metadata['filiere']}_{metadata['module']}_{metadata['element']}_{metadata['titre']}.pdf"

    try:
        # If a new file is provided, validate and upload it
        if file:
            file_extension = os.path.splitext(file.filename)[1].lower()
            if file_extension not in ALLOWED_EXTENSIONS:
                logger.warning(f"Rejected file {file.filename} with extension {file_extension}")
                raise HTTPException(status_code=400, detail=f"File type {file_extension} not allowed. Only PDF files are allowed.")

            content = await file.read()
            file_like = BytesIO(content)
        else:
            # If no new file, copy existing file content
            existing_file = minio_client.get_object(bucket_name, object_name)
            content = existing_file.read()
            file_like = BytesIO(content)

        # Upload updated file (or copy existing) with new metadata
        minio_client.put_object(
            bucket_name,
            new_object_name,
            data=file_like,
            length=len(content),
            content_type="application/pdf",
            metadata=metadata
        )

        # Remove old file if object_name changed
        if new_object_name != object_name:
            minio_client.remove_object(bucket_name, object_name)

        logger.info(f"File {new_object_name} updated successfully in bucket {bucket_name} by user {current_user.email}")
        return JSONResponse(
            status_code=200,
            content={
                "message": f"File updated successfully in bucket {bucket_name}",
                "path": new_object_name,
                "metadata": metadata
            }
        )
    except S3Error as err:
        logger.error(f"Failed to update file {object_name} in {bucket_name}: {str(err)}")
        raise HTTPException(status_code=500, detail="Failed to update file")
    except Exception as e:
        logger.error(f"Unexpected error updating file {object_name}: {str(e)}")
        raise HTTPException(status_code=500, detail="Unexpected error updating file")

@app.get("/list-files/")
async def list_files(
    filiere: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    # Get user's bucket
    bucket_name = sanitize_email_for_bucket(current_user.email)
    
    try:
        if not minio_client.bucket_exists(bucket_name):
            logger.info(f"No bucket found: {bucket_name}")
            return {"files": [], "message": f"No bucket found: {bucket_name}"}
        
        # List objects in the user's bucket
        objects = minio_client.list_objects(bucket_name, recursive=True)
        files = []
        for obj in objects:
            try:
                obj_stat = minio_client.stat_object(bucket_name, obj.object_name)
                # Log raw metadata for debugging
                logger.debug(f"Metadata for {obj.object_name}: {obj_stat.metadata}")
                metadata = {
                    "email": obj_stat.metadata.get("x-amz-meta-email", ""),
                    "filiere": obj_stat.metadata.get("x-amz-meta-filiere", ""),
                    "module": obj_stat.metadata.get("x-amz-meta-module", ""),
                    "element": obj_stat.metadata.get("x-amz-meta-element", ""),
                    "titre": obj_stat.metadata.get("x-amz-meta-titre", "")
                }
                # Filter by filiere if provided (case-insensitive)
                if filiere is None or metadata["filiere"].lower() == filiere.lower():
                    files.append({
                        "object_name": obj.object_name,
                        "metadata": metadata
                    })
            except S3Error as err:
                logger.error(f"Failed to fetch metadata for {obj.object_name}: {str(err)}")
                continue
        
        logger.info(f"Listed {len(files)} files in bucket {bucket_name} for user {current_user.email} with filiere filter: {filiere if filiere else 'none'}")
        return {"files": files, "bucket": bucket_name}
    except S3Error as err:
        logger.error(f"Failed to list files in {bucket_name}: {str(err)}")
        raise HTTPException(status_code=500, detail="Failed to list files")
    except Exception as e:
        logger.error(f"Unexpected error listing files in {bucket_name}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error listing files: {str(e)}")

@app.get("/download/{object_name}")
async def download_file(
    object_name: str,
    current_user: User = Depends(get_current_user)
):
    # Get user's bucket
    bucket_name = ensure_user_bucket(current_user.email)

    # Check if file exists
    try:
        minio_client.stat_object(bucket_name, object_name)
    except S3Error as err:
        if err.code == "NoSuchKey":
            logger.warning(f"File {object_name} not found in bucket {bucket_name}")
            raise HTTPException(status_code=404, detail=f"File {object_name} not found")
        logger.error(f"MinIO error checking file {object_name}: {str(err)}")
        raise HTTPException(status_code=500, detail=f"MinIO error: {str(err)}")

    try:
        # Get file content
        response = minio_client.get_object(bucket_name, object_name)
        content = response.read()

        # Stream file content as response
        return StreamingResponse(
            BytesIO(content),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={object_name}",
                "Content-Length": str(len(content))
            }
        )
    except S3Error as err:
        logger.error(f"Failed to download file {object_name} from {bucket_name}: {str(err)}")
        raise HTTPException(status_code=500, detail="Failed to download file")
    except Exception as e:
        logger.error(f"Unexpected error downloading file {object_name}: {str(e)}")
        raise HTTPException(status_code=500, detail="Unexpected error downloading file")
    finally:
        response.close()
        response.release_conn()