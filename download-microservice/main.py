# from fastapi import FastAPI, HTTPException, Depends, Request, status
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

# app = FastAPI(title="File Download Microservice")

# # CORS configuration
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:3000",
#         "http://localhost:3001",
#         "http://localhost:8000",
#         "http://localhost:8001",
#         "http://localhost:8002",
#         "http://localhost:8003",
#         "http://127.0.0.1:8000",
#         "http://127.0.0.1:8001",
#         "http://127.0.0.1:8002",
#         "http://127.0.0.1:8003",
#         "http://127.0.0.1:3000",
#         "http://127.0.0.1:3001",
#         "http://192.168.1.30:3000",
#         "http://192.168.1.30:3001",
#         "http://192.168.1.30:8000",
#         "http://192.168.1.30:8001",
#         "http://192.168.1.30:8002",
#         "http://192.168.1.30:8003"
#     ],
#     allow_credentials=True,
#     allow_methods=["GET", "OPTIONS"],
#     allow_headers=["Authorization", "Content-Type"],
# )

# # MinIO configuration
# MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "minio:9000")
# MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
# MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin")

# # Auth microservice URL
# AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth-service:8000/verify-token")

# # Pydantic model for User
# class User(BaseModel):
#     email: str
#     filiere: Optional[str] = None

# # Initialize MinIO client
# try:
#     minio_client = Minio(
#         MINIO_ENDPOINT,
#         access_key=MINIO_ACCESS_KEY,
#         secret_key=MINIO_SECRET_KEY,
#         secure=False
#     )
#     logger.info("MinIO client initialized successfully")
# except Exception as e:
#     logger.error(f"Failed to initialize MinIO client: {str(e)}")
#     raise HTTPException(status_code=500, detail=f"MinIO client initialization failed: {str(e)}")

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

#             filiere = user_data.get("filiere")
#             if not filiere:
#                 logger.error("Missing filiere in user information")
#                 raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid or missing filiere in user information")

#             return User(email=email, filiere=filiere)
#     except httpx.HTTPError as e:
#         logger.error(f"Auth service error: {str(e)}")
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Auth service error: {str(e)}")

# @app.get("/courses/")
# async def list_courses(
#     current_user: User = Depends(get_current_user)
# ):
#     try:
#         # Initialize result structure
#         result = {
#             "filiere": current_user.filiere,
#             "modules": []
#         }

#         # Dictionary to organize modules and elements
#         module_dict = {}

#         # List all buckets
#         buckets = minio_client.list_buckets()
#         for bucket in buckets:
#             bucket_name = bucket.name
#             # List objects in bucket
#             objects = minio_client.list_objects(bucket_name, recursive=True)
#             for obj in objects:
#                 try:
#                     obj_stat = minio_client.stat_object(bucket_name, obj.object_name)
#                     metadata = {
#                         "email": obj_stat.metadata.get("x-amz-meta-email", ""),
#                         "filiere": obj.get("x-amz-meta-filiere", ""),
#                         "module": obj_stat.metadata.get("x-amz-meta-module", ""),
#                         "element": obj_stat.get("x-amz-meta-element", ""),
#                         "titre": obj_stat.metadata.get("x-amz-meta-titre", "")
#                     }
#                     # Include file if filière matches
#                     if metadata["filiere"].lower() == current_user.filiere.lower():
#                         module_name = metadata["module"]
#                         element_name = metadata["element"]
#                         file_info = {
#                             "bucket_name": bucket_name,
#                             "object_name": obj.object_name,
#                             "metadata": metadata,
#                             "titre": metadata["titre"],
#                             "email": metadata["email"]
#                             }
                        

#                         # Initialize module if not exists
#                         if module_name not in module_dict:
#                             module_dict[module_name] = {"name": module_name, "elements": {}}

#                         # Initialize element if not exists
#                         if element_name not in module_dict[module_name]["elements"]:
#                             module_dict[module_name]["elements"][element_name] = {
#                                 "name": element_name,
#                                 "files": []
#                             }

#                         # Add file to element
#                         module_dict[module_name]["elements"][element_name]["files"].append(file_info)
#                 except S3Error as err:
#                     logger.error(f"Failed to fetch metadata for {obj.object_name} in {bucket_name}: {str(err)}")
#                     continue

#         # Convert module_dict to list for JSON response
#         for module_name, module_data in module_dict.items():
#             module = {
#                 "name": module_name,
#                 "elements": []
#             }
#             for element_name, element_data in module_data["elements"].items():
#                 module["elements"].append({
#                     "name": element_name,
#                     "files": element_data["files"]
#                 })
#             result["modules"].append(module)

#         logger.info(f"Listed courses for user {current_user.email} in filière {current_user.filiere}: {len(result['modules'])} modules")
#         return result
#     except S3Error as err:
#         logger.error(f"Failed to list courses: {str(err)}")
#         raise HTTPException(status_code=500, detail="Failed to list courses")
#     except Exception as e:
#         logger.error(f"Unexpected error listing courses: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Unexpected error listing courses: {str(e)}")

# @app.get("/download/{bucket_name}/{object_name}")
# async def download_file(
#     bucket_name: str,
#     object_name: str,
#     current_user: User = Depends(get_current_user)
# ):
#     # Check if bucket exists
#     try:
#         if not minio_client.bucket_exists(bucket_name):
#             logger.warning(f"Bucket {bucket_name} not found")
#             raise HTTPException(status_code=404, detail=f"Bucket {bucket_name} not found")
#     except S3Error as err:
#         logger.error(f"MinIO error checking bucket {bucket_name}: {str(err)}")
#         raise HTTPException(status_code=500, detail=f"MinIO error: {str(err)}")

#     # Check if file exists and verify filière
#     try:
#         obj_stat = minio_client.stat_object(bucket_name, object_name)
#         metadata = {
#             "filiere": obj_stat.metadata.get("x-amz-meta-filiere", "")
#         }
#         if metadata["filiere"].lower() != current_user.filiere.lower():
#             logger.warning(f"Access denied for {current_user.email} to {object_name} in {bucket_name}: filière mismatch")
#             raise HTTPException(status_code=403, detail="Access denied: File filière does not match your filière")
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



from fastapi import FastAPI, HTTPException, Depends, Request, status, Query
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

app = FastAPI(title="File Download Microservice")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:8000",
        "http://localhost:8001",
        "http://localhost:8002",
        "http://localhost:8003",
        "http://127.0.0.1:8000",
        "http://127.0.0.1:8001",
        "http://127.0.0.1:8002",
        "http://127.0.0.1:8003",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://192.168.1.30:3000",
        "http://192.168.1.30:3001",
        "http://192.168.1.30:8000",
        "http://192.168.1.30:8001",
        "http://192.168.1.30:8002",
        "http://192.168.1.30:8003"
    ],
    allow_credentials=True,
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

# MinIO configuration
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "minio:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin")

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
        secure=False
    )
    logger.info("MinIO client initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize MinIO client: {str(e)}")
    raise HTTPException(status_code=500, detail=f"MinIO client initialization failed: {str(e)}")

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

@app.get("/courses/")
async def list_courses(
    filiere: str = Query(..., description="Student's filiere"),
    current_user: User = Depends(get_current_user)
):
    if not filiere.strip():
        logger.warning("Filiere parameter is empty")
        raise HTTPException(status_code=400, detail="Filiere must not be empty")

    try:
        # Initialize result structure
        result = {
            "filiere": filiere,
            "modules": []
        }

        # Dictionary to organize modules and elements
        module_dict = {}

        # List all buckets
        buckets = minio_client.list_buckets()
        for bucket in buckets:
            bucket_name = bucket.name
            # List objects in bucket
            objects = minio_client.list_objects(bucket_name, recursive=True)
            for obj in objects:
                try:
                    obj_stat = minio_client.stat_object(bucket_name, obj.object_name)
                    metadata = {
                        "email": obj_stat.metadata.get("x-amz-meta-email", ""),
                        "filiere": obj_stat.metadata.get("x-amz-meta-filiere", ""),
                        "module": obj_stat.metadata.get("x-amz-meta-module", ""),
                        "element": obj_stat.metadata.get("x-amz-meta-element", ""),
                        "titre": obj_stat.metadata.get("x-amz-meta-titre", "")
                    }
                    # Include file if filière matches
                    if metadata["filiere"].lower() == filiere.lower():
                        module_name = metadata["module"]
                        element_name = metadata["element"]
                        file_info = {
                            "bucket_name": bucket_name,
                            "object_name": obj.object_name,
                            "metadata": {
                                "titre": metadata["titre"],
                                "email": metadata["email"]
                            }
                        }

                        # Initialize module if not exists
                        if module_name not in module_dict:
                            module_dict[module_name] = {"name": module_name, "elements": {}}

                        # Initialize element if not exists
                        if element_name not in module_dict[module_name]["elements"]:
                            module_dict[module_name]["elements"][element_name] = {
                                "name": element_name,
                                "files": []
                            }

                        # Add file to element
                        module_dict[module_name]["elements"][element_name]["files"].append(file_info)
                except S3Error as err:
                    logger.error(f"Failed to fetch metadata for {obj.object_name} in {bucket_name}: {str(err)}")
                    continue

        # Convert module_dict to list for JSON response
        for module_name, module_data in module_dict.items():
            module = {
                "name": module_name,
                "elements": []
            }
            for element_name, element_data in module_data["elements"].items():
                module["elements"].append({
                    "name": element_name,
                    "files": element_data["files"]
                })
            result["modules"].append(module)

        logger.info(f"Listed courses for user {current_user.email} in filière {filiere}: {len(result['modules'])} modules")
        return result
    except S3Error as err:
        logger.error(f"Failed to list courses: {str(err)}")
        raise HTTPException(status_code=500, detail="Failed to list courses")
    except Exception as e:
        logger.error(f"Unexpected error listing courses: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error listing courses: {str(e)}")

@app.get("/download/{bucket_name}/{object_name}")
async def download_file(
    bucket_name: str,
    object_name: str,
    filiere: str = Query(..., description="Student's filiere"),
    current_user: User = Depends(get_current_user)
):
    if not filiere.strip():
        logger.warning("Filiere parameter is empty")
        raise HTTPException(status_code=400, detail="Filiere must not be empty")

    # Check if bucket exists
    try:
        if not minio_client.bucket_exists(bucket_name):
            logger.warning(f"Bucket {bucket_name} not found")
            raise HTTPException(status_code=404, detail=f"Bucket {bucket_name} not found")
    except S3Error as err:
        logger.error(f"MinIO error checking bucket {bucket_name}: {str(err)}")
        raise HTTPException(status_code=500, detail=f"MinIO error: {str(err)}")

    # Check if file exists and verify filière
    try:
        obj_stat = minio_client.stat_object(bucket_name, object_name)
        metadata = {
            "filiere": obj_stat.metadata.get("x-amz-meta-filiere", "")
        }
        if metadata["filiere"].lower() != filiere.lower():
            logger.warning(f"Access denied for {current_user.email} to {object_name} in {bucket_name}: filière mismatch")
            raise HTTPException(status_code=403, detail="Access denied: File filière does not match your filière")
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