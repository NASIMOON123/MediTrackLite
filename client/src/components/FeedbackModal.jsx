import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import '../css/FeedbackModal.css';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa'; // Only full stars now
import 'react-toastify/dist/ReactToastify.css';

const FeedbackModal = ({ show, onClose, appointment, onFeedbackSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/feedback`, {
        appointmentId: appointment._id,
        doctorId: appointment.doctorId._id || appointment.doctorId,
        rating,
        comment,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Feedback submitted successfully!');
      onFeedbackSubmitted(appointment._id);
      onClose();
    } catch (err) {
      toast.error('Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={onClose} 
      centered 
      size="md" 
      backdrop="static" 
      className="feedback-modal"
    >
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title className="modal-title-custom">Leave Feedback</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-custom">
        <Form className="form">
          <div className="rating-section">
            <Form.Label className="rating-label">How would you rate your experience?</Form.Label>
            
            <div className="stars-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="star-btn"
                >
                  <FaStar
                    className="star-icon"
                    color={(hoverRating || rating) >= star ? '#ffc107' : '#ccc'}
                  />
                </button>
              ))}
            </div>

            <div style={{ fontSize: '0.9rem', color: '#555', marginTop: '0.3rem' }}>
              {rating} / 5
            </div>

            <div className="rating-scale">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>

          <Form.Group className="comment-section">
            <Form.Label className="comment-label">Share your thoughts (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or what could we improve?"
              className="comment-textarea"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="modal-footer-custom">
        <Button variant="outline-custom" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          variant="primary-custom" 
          onClick={handleSubmit} 
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Submitting...
            </>
          ) : 'Submit Feedback'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FeedbackModal;
