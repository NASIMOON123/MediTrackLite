import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApprovalStatus = () => {
  const [isApproved, setIsApproved] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApproval = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/doctors/approval-status', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Doctor approval response:", res.data); 
        console.log("isApproved value:", res.data.isApproved); 
        setIsApproved(res.data.isApproved);
      } catch (error) {
        console.error("Error fetching approval status", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApproval();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="approval-status">
      <h2>Approval Status</h2>
      {isApproved === true ? (
        <p className="approved">✅ Approved</p>
      ) : (
        <p className="pending">⏳ Pending Approval</p>
      )}
    </div>
  );
};

export default ApprovalStatus;
