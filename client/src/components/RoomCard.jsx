import React from 'react';
import { Link } from 'react-router-dom';

const RoomCard = ({ room }) => {
  return (
    <div className="card h-100 card-luxury border-0">
      <div className="position-relative overflow-hidden" style={{ height: 230 }}>
        <img
          src={room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'}
          alt={room.title}
          className="w-100 h-100 object-fit-cover"
        />
        <div className="position-absolute top-0 start-0 m-3 d-flex gap-2">
          <span className="badge bg-primary text-uppercase px-2 py-1 shadow-sm">
            {room.type}
          </span>
          <span className={`badge ${room.status === 'available' ? 'bg-success' : 'bg-secondary'} px-2 py-1 shadow-sm`}>
            {room.status}
          </span>
        </div>
        <div className="position-absolute bottom-0 end-0 m-3">
          <span className="badge bg-dark bg-opacity-75 text-warning px-2 py-1">
            <i className="bi bi-star-fill me-1"></i>{room.rating || 4.8}
          </span>
        </div>
      </div>

      <div className="card-body d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-baseline mb-2">
          <span className="text-muted small fw-semibold">Room #{room.roomNumber}</span>
          <span className="text-muted small">
            <i className="bi bi-people me-1"></i>Up to {room.capacity} Guests
          </span>
        </div>

        <h5 className="card-title fw-bold mb-2 text-truncate" title={room.title}>
          {room.title}
        </h5>

        <p className="card-text text-muted small flex-grow-1 mb-3" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {room.description}
        </p>

        {/* Amenities preview */}
        <div className="d-flex flex-wrap gap-1 mb-3">
          {room.amenities?.slice(0, 3).map((amenity, index) => (
            <span key={index} className="badge bg-light text-secondary border fw-normal" style={{ fontSize: '0.72rem' }}>
              <i className="bi bi-check2 text-success me-1"></i>{amenity}
            </span>
          ))}
          {room.amenities?.length > 3 && (
            <span className="badge bg-light text-muted border fw-normal" style={{ fontSize: '0.72rem' }}>
              +{room.amenities.length - 3} more
            </span>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
          <div>
            <span className="fs-4 fw-bold text-primary">${room.pricePerNight}</span>
            <span className="text-muted small"> / night</span>
          </div>
          <Link to={`/rooms/${room._id}`} className="btn btn-outline-primary btn-sm px-3 rounded-pill fw-semibold">
            Book Now <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
