import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorFeedbackSummary = () => {
  const [averageRating, setAverageRating] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchFeedbackSummary = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/feedback/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data || [];
        const avg = data.reduce((sum, f) => sum + f.rating, 0) / (data.length || 1);
        setAverageRating(avg.toFixed(1));
        setFeedbacks(data.slice(0, 3)); // show top 3 recent feedbacks
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchFeedbackSummary();
  }, [token]);

  const handleRequestDelete = async (feedbackId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/feedback/request-delete/${feedbackId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Deletion request sent');
      setFeedbacks((prev) =>
        prev.map((f) =>
          f._id === feedbackId ? { ...f, deleteRequested: true } : f
        )
      );
    } catch (err) {
      console.error('Failed to request deletion:', err);
      toast.error('Failed to request deletion');
    }
  };

  if (loading)
    return <p className="text-center mt-6 text-purple-700 font-medium">Loading feedback summary...</p>;

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-3xl mx-auto mt-6 transition-all duration-300">
      <h2 className="text-3xl font-bold text-indigo-800 mb-4 text-center">
        🩺 Doctor Feedback Summary
      </h2>

      <div className="flex justify-center items-center mb-6">
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-lg font-semibold shadow-sm">
          ⭐ Average Rating: {averageRating} / 5
        </div>
      </div>

      {feedbacks.length === 0 ? (
        <p className="text-center text-gray-500 italic">No feedback submitted yet.</p>
      ) : (
        <ul className="space-y-5">
          {feedbacks.map((f, i) => (
            <li
              key={i}
              className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 p-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="bg-yellow-300 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold shadow">
                  ⭐ {f.rating} / 5
                </span>
                <span className="text-xs text-gray-500 italic">
                  — {f.patientId?.name || 'Anonymous'}
                </span>
              </div>

              {f.comment?.trim() && (
                <p className="text-gray-800 font-medium italic mb-2">
                  “{f.comment}”
                </p>
              )}

              {!f.deleteRequested ? (
                <button
                  className="text-sm text-red-600 border border-red-400 px-3 py-1 rounded hover:bg-red-50 transition"
                  onClick={() => handleRequestDelete(f._id)}
                >
                   Request Feedback Deletion
                </button>
              ) : (
                <p className="text-sm text-red-500 italic">Deletion Requested</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DoctorFeedbackSummary;
