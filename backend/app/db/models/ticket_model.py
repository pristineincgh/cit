from datetime import datetime
from uuid import uuid4

from sqlalchemy import Column, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.schemas.ticket_schema import Priority, Status


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    title: str = Column(String(50), nullable=False)
    description: str = Column(Text, nullable=True)
    status: str = Column(Enum(Status), nullable=False, default=Status.OPEN)
    priority: str = Column(
        Enum(Priority),
        nullable=False,
        default=Priority.LOW,
    )
    created_at = Column(DateTime, default=datetime.now, nullable=False)
    updated_at = Column(
        DateTime, nullable=False, default=datetime.now, onupdate=datetime.now
    )

    # foreign keys
    # (customer_id) to customers table
    customer_id = Column(
        String(36),
        ForeignKey("customers.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    # (created_by_id) to users table
    created_by_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    # (assigned_to_id) to users table
    assigned_to_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=True,
        index=True,
    )

    # Relationships
    customer = relationship("Customer", back_populates="tickets")
    created_by = relationship(
        "User", back_populates="created_tickets", foreign_keys=[created_by_id]
    )
    assigned_to = relationship(
        "User", back_populates="assigned_tickets", foreign_keys=[assigned_to_id]
    )

    def __repr__(self):
        return f"<Ticket {self.title}>"
