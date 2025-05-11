import React from "react";
import type { EventDetailsModalProps } from "../types";

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !event) return null;

  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div
        className="event-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="event-modal-header">
          <h3>Event Detail</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="event-modal-body">
          <div className="event-detail">
            <span className="detail-label"> Staff Name</span>
            <span className="detail-value">{event.staffName}</span>
          </div>
          <div className="event-detail">
            <span className="detail-label">Shift Name</span>
            <span className="detail-value">{event.shiftName}</span>
          </div>
          <div className="event-detail">
            <span className="detail-label">Date</span>
            <span className="detail-value">{event.date}</span>
          </div>
          <div className="event-detail">
            <span className="detail-label">Start Time</span>
            <span className="detail-value">{event.startTime}</span>
          </div>
          <div className="event-detail">
            <span className="detail-label">End Time</span>
            <span className="detail-value">{event.endTime}</span>
          </div>
          {event.isUpdated && (
            <div className="event-updated-badge">Updated</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal; 