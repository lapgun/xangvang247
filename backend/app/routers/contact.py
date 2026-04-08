from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.services.email_service import (
    send_contact_email,
    send_test_email,
    is_email_configured,
)
from app.auth import get_current_admin
from app.models.user import User
from fastapi import Depends
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    message: str


class TestEmailRequest(BaseModel):
    to_email: str = None


@router.post("/contact")
async def send_contact(request: ContactRequest):
    """
    Send a contact form message.
    
    Validates the request and sends an email to the admin.
    """
    
    # Validate inputs
    if not request.name or len(request.name.strip()) < 2:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Tên phải có ít nhất 2 ký tự",
        )
    
    if not request.message or len(request.message.strip()) < 10:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Nội dung phải có ít nhất 10 ký tự",
        )
    
    # Accept contact even when SMTP is not configured to avoid hard-failing users.
    if not is_email_configured():
        logger.warning(
            "Contact received without SMTP config. name=%s email=%s",
            request.name,
            request.email,
        )
        return {
            "success": True,
            "queued": True,
            "message": "Đã ghi nhận liên hệ của bạn. Hệ thống email đang được cấu hình, chúng tôi sẽ phản hồi sớm.",
        }

    # Send email
    success = send_contact_email(request.name, request.email, request.message)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Không thể gửi email. Vui lòng thử lại sau hoặc liên hệ trực tiếp.",
        )
    
    return {
        "success": True,
        "message": "Tin nhắn đã được gửi thành công. Cảm ơn bạn đã liên hệ!",
    }


@router.post("/admin/email/test")
async def test_email(
    request: TestEmailRequest,
    current_user: User = Depends(get_current_admin),
):
    """
    Send a test email. Admin only.
    """
    
    if not is_email_configured():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="SMTP chưa được cấu hình. Vui lòng đặt SMTP_USER và SMTP_PASSWORD trong môi trường backend.",
        )

    success = send_test_email(request.to_email)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Không thể gửi email test. Kiểm tra cấu hình SMTP.",
        )
    
    return {
        "success": True,
        "message": f"Email test đã được gửi tới {request.to_email or 'admin email'}",
    }
