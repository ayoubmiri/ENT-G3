from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.elements import ElementSchema, ElementCreateSchema, ElementUpdateSchema
from app.services import elements as service
from app.api.deps import get_current_user
from app.database.models import User
from typing import List
from uuid import UUID

router = APIRouter()

@router.post("/", response_model=ElementSchema)
async def create_element(
    data: ElementCreateSchema,
    current_user: User = Depends(get_current_user)
):
    return service.create_element_service(data)

@router.get("/{code}", response_model=ElementSchema)
async def get_element(
    code: str,
    current_user: User = Depends(get_current_user)
):
    return service.get_element_service(code)

@router.get("/", response_model=List[ElementSchema])
async def list_elements(
    current_user: User = Depends(get_current_user)
):
    return service.list_elements_service()

@router.get("/module/{module_id}", response_model=List[ElementSchema])
async def get_elements_by_module(
    module_id: UUID,
    page: int = 1,
    limit: int = 100,
    search: str = "",
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve elements by module ID with pagination and optional search.

    Args:
        module_id: The ID of the module to filter elements.
        page: Page number for pagination (default: 1).
        limit: Maximum number of records to return (default: 100).
        search: Optional search term to filter elements by name.
        current_user: The authenticated user.

    Returns:
        List of elements for the specified module.
    """
    return service.get_elements_by_module_service(module_id=module_id, page=page, limit=limit, search=search)

@router.put("/{code}", response_model=ElementSchema)
async def update_element(
    code: str,
    data: ElementUpdateSchema,
    current_user: User = Depends(get_current_user)
):
    return service.update_element_service(code, data)

@router.delete("/{code}")
async def delete_element(
    code: str,
    current_user: User = Depends(get_current_user)
):
    service.delete_element_service(code)
    return {"success": True}










# from fastapi import APIRouter
# from app.schemas.elements import ElementSchema, ElementCreateSchema, ElementUpdateSchema
# from app.services import elements as service
# from typing import List

# router = APIRouter()
# @router.post("/", response_model=ElementSchema)
# def create_element(data: ElementCreateSchema):
#     return service.create_element_service(data)

# @router.get("/{code}", response_model=ElementSchema)
# def get_element(code: str):
#     return service.get_element_service(code)

# @router.get("/", response_model=List[ElementSchema])
# def list_elements():
#     return service.list_elements_service()

# @router.put("/{code}", response_model=ElementSchema)
# def update_element(code: str, data: ElementUpdateSchema):
#     return service.update_element_service(code, data)

# @router.delete("/{code}")
# def delete_element(code: str):
#     service.delete_element_service(code)
#     return {"success": True}



# # from fastapi import APIRouter, HTTPException
# # from app.schemas.elements import ElementSchema, ElementCreateSchema, ElementUpdateSchema
# # from app.services import elements as service
# # from typing import List

# # router = APIRouter(prefix="/elements", tags=["Elements"])

# # @router.post("/", response_model=ElementSchema)
# # def create_element(data: ElementCreateSchema):
# #     return service.create_element_service(data)

# # @router.get("/{code}", response_model=ElementSchema)
# # def get_element(code: str):
# #     element = service.get_element_service(code)
# #     if not element:
# #         raise HTTPException(status_code=404, detail="Element not found")
# #     return element

# # @router.get("/", response_model=List[ElementSchema])
# # def list_elements():
# #     return service.list_elements_service()

# # @router.put("/{code}", response_model=ElementSchema)
# # def update_element(code: str, data: ElementUpdateSchema):
# #     updated = service.update_element_service(code, data)
# #     if not updated:
# #         raise HTTPException(status_code=404, detail="Element not found")
# #     return updated

# # @router.delete("/{code}")
# # def delete_element(code: str):
# #     deleted = service.delete_element_service(code)
# #     if not deleted:
# #         raise HTTPException(status_code=404, detail="Element not found")
# #     return {"success": True}
