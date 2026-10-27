import React from 'react';
import { Link } from 'react-router-dom';

const RoomCard = ({ room }) => {
  const getBadgeClass = (status) => {
    switch (status) {
      case 'Available':
        return 'badge-available';
      case 'Booked':
        return 'badge-booked';
      default:
        return 'badge-maintenance';
    }
  };

  const imageSrc =
    room.images && room.images.length > 0
      ? room.images[0]
      : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="card room-card h-100 shadow-sm">
      <div className="position-relative">
        <img
          src={imageSrc}
          className="room-card-img"
          alt={room.title}
          loading="lazy"
        />
        <div className="position-absolute top-0 end-0 m-3">
          <span className={`badge px-3 py-2 rounded-pill ${getBadgeClass(room.status)}`}>
            {room.status}
          </span>
        </div>
        <div className="position-absolute bottom-0 start-0 m-3">
          <span className="badge bg-dark bg-opacity-75 text-white px-2 py-1 rounded">
            Room #{room.roomNumber}
          </span>
        </div>
      </div>

      <div className="card-body d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title fw-bold text-dark mb-0">{room.title}</h5>
          <span className="badge bg-light text-primary border border-primary-subtle px-2 py-1">
            {room.type}
          </span>
        </div>

        <p className="card-text text-muted small flex-grow-1 mb-3">
          {room.description && room.description.length > 95
            ? `${room.description.substring(0, 95)}...`
            : room.description}
        </p>

        <div className="d-flex align-items-center gap-3 text-muted small mb-3 border-top border-bottom py-2">
          <span>
            <i className="bi bi-people-fill text-primary me-1"></i> {room.capacity} Guests
          </span>
          <span>
            <i className="bi bi-door-closed text-primary me-1"></i> {room.bedType} Bed
          </span>
        </div>

        <div className="d-flex flex-wrap gap-1 mb-3">
          {room.amenities &&
            room.amenities.slice(0, 3).map((amenity, idx) => (
              <span key={idx} className="badge bg-light text-secondary border small">
                {amenity}
              </span>
            ))}
          {room.amenities && room.amenities.length > 3 && (
            <span className="badge bg-light text-secondary border small">
              +{room.amenities.length - 3} more
            </span>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
          <div>
            <span className="price-tag">${room.pricePerNight}</span>
            <span className="text-muted small"> / night</span>
          </div>

          <Link
            to={`/rooms/${room._id}`}
            className="btn btn-outline-primary btn-sm px-3 rounded-pill fw-semibold"
          >
            View & Book <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
