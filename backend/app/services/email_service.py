import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings
import logging

logger = logging.getLogger(__name__)


def send_email(
    subject: str,
    body_text: str,
    body_html: str = None,
    to_email: str = None,
    reply_to: str = None,
) -> bool:
    """
    Send email using SMTP.
    
    Args:
        subject: Email subject
        body_text: Plain text body
        body_html: HTML body (optional)
        to_email: Recipient email (default: admin email)
    
    Returns:
        bool: True if email sent successfully
    """
    
    if not settings.smtp_user or not settings.smtp_password:
        logger.warning("Email not configured: SMTP credentials missing")
        return False
    
    try:
        to_email = to_email or settings.email_to_admin
        
        # Create message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        # Some SMTP providers (for example Gmail) require the From address
        # to match the authenticated account.
        from_email = settings.smtp_user or settings.email_from
        msg["From"] = from_email
        msg["To"] = to_email
        if reply_to:
            msg["Reply-To"] = reply_to
        
        # Attach plain text
        msg.attach(MIMEText(body_text, "plain"))
        
        # Attach HTML if provided
        if body_html:
            msg.attach(MIMEText(body_html, "html"))
        
        # Send email
        with smtplib.SMTP(settings.smtp_server, settings.smtp_port) as server:
            server.starttls()
            server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(msg)
        
        logger.info(f"Email sent successfully to {to_email}: {subject}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return False


def send_contact_email(name: str, email: str, message: str) -> bool:
    """Send contact form email to admin."""
    
    subject = f"📧 Liên hệ từ {name} - XangGiau24h.vn"
    
    text_body = f"""
Tin nhắn liên hệ từ {name}

Email: {email}

Nội dung:
{message}

---
Từ: https://xanggiau24h.vn/contact
    """
    
    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #f59e0b;">📧 Tin nhắn liên hệ</h2>
            <p><strong>Từ:</strong> {name}</p>
            <p><strong>Email:</strong> <a href="mailto:{email}">{email}</a></p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <h3>Nội dung:</h3>
            <p style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 5px;">
{message}
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #999;">
                Tin nhắn từ: <a href="https://xanggiau24h.vn/contact">https://xanggiau24h.vn/contact</a>
            </p>
        </body>
    </html>
    """
    
    return send_email(
        subject,
        text_body,
        html_body,
        settings.email_to_admin,
        reply_to=email,
    )


def is_email_configured() -> bool:
    """Return True when SMTP credentials are available."""

    return bool(settings.smtp_user and settings.smtp_password)


def send_test_email(to_email: str = None) -> bool:
    """Send test email."""
    
    subject = "🧪 Email Test - XangGiau24h.vn"
    
    text_body = """
Đây là email test từ XangGiau24h.vn

Nếu bạn nhận được email này, điều đó có nghĩa là hệ thống email đang hoạt động bình thường.

---
Thời gian test: xanggiau24h.vn/admin
    """
    
    html_body = """
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #f59e0b;">🧪 Email Test</h2>
            <p>Đây là email test từ <strong>XangGiau24h.vn</strong></p>
            <p>Nếu bạn nhận được email này, điều đó có nghĩa là hệ thống email đang hoạt động bình thường.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #999;">
                Test từ: <a href="https://xanggiau24h.vn/admin">Admin Dashboard</a>
            </p>
        </body>
    </html>
    """
    
    return send_email(subject, text_body, html_body, to_email)
