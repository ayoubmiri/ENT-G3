from typing import List
from uuid import UUID
from fastapi import HTTPException, status
from app.schemas.elements import ElementCreateSchema, ElementUpdateSchema, ElementSchema
from app.crud import elements as crud
from app.database.models import Element

def create_element_service(data: ElementCreateSchema) -> ElementSchema:
    return crud.create_element(data)

def get_element_service(code: str) -> ElementSchema:
    element = crud.get_element_by_code(code)
    if not element:
        raise HTTPException(status_code=404, detail="Element not found.")
    return element

def list_elements_service() -> List[ElementSchema]:
    return crud.list_elements()

def get_elements_by_module_service(module_id: UUID, page: int = 1, limit: int = 100, search: str = '') -> List[ElementSchema]:
    """
    Retrieve elements by module ID with pagination and optional search.

    Args:
        module_id (UUID): The ID of the module to filter elements.
        page (int): Page number for pagination (default: 1).
        limit (int): Maximum number of records to return (default: 100).
        search (str): Optional search term to filter elements by name (default: '').

    Returns:
        List[ElementSchema]: List of elements for the specified module.
    """
    skip = (page - 1) * limit
    result = crud.get_elements_by_module(module_id=module_id, skip=skip, limit=limit, search=search)
    return result["elements"]

def update_element_service(code: str, data: ElementUpdateSchema) -> ElementSchema:
    element = crud.update_element(code, data)
    if not element:
        raise HTTPException(status_code=404, detail="Element not found.")
    return element

def delete_element_service(code: str) -> bool:
    success = crud.delete_element(code)
    if not success:
        raise HTTPException(status_code=404, detail="Element not found.")
    return success










# from app.schemas.elements import ElementCreateSchema, ElementUpdateSchema
# from app.crud import elements as crud
# from typing import List
# from app.database.models import Element

# def create_element_service(data: ElementCreateSchema) -> Element:
#     return crud.create_element(data)

# def get_element_service(code: str) -> Element:
#     element = crud.get_element_by_code(code)
#     if not element:
#         raise HTTPException(status_code=404, detail="Element not found.")
#     return element

# def list_elements_service() -> List[Element]:
#     return crud.list_elements()

# def update_element_service(code: str, data: ElementUpdateSchema) -> Element:
#     return crud.update_element(code, data)

# def delete_element_service(code: str) -> bool:
#     return crud.delete_element(code)




# # from app.schemas.elements import ElementCreateSchema, ElementUpdateSchema
# # from app.crud import elements as crud
# # from typing import List

# # def create_element_service(data: ElementCreateSchema):
# #     return crud.create_element(data)

# # def get_element_service(code: str):
# #     return crud.get_element_by_code(code)

# # def list_elements_service():
# #     return crud.list_elements()

# # def update_element_service(code: str, data: ElementUpdateSchema):
# #     return crud.update_element(code, data)

# # def delete_element_service(code: str):
# #     return crud.delete_element(code)
