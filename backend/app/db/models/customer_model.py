from datetime import datetime
from uuid import uuid4

from sqlalchemy import Column, DateTime, String
from sqlalchemy.orm import relationship

from app.db.database import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    name: str = Column(String(50), nullable=False)
    phone_number: str = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.now, nullable=False)
    updated_at = Column(
        DateTime, nullable=False, default=datetime.now, onupdate=datetime.now
    )
    tickets = relationship("Ticket", back_populates="customer", passive_deletes="all")

    def __repr__(self):
        return f"<Customer {self.name}>"
