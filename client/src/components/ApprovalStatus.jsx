

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';
import '../css/Approval.css';
import { FaDownload } from 'react-icons/fa';


const ApprovalStatus = () => {
  const [doctor, setDoctor] = useState(null);
  const [status, setStatus] = useState(null);
  const [prevStatus, setPrevStatus] = useState(null); // for toast comparison
  const [loading, setLoading] = useState(true);
  const certificateRef = useRef(null);

  useEffect(() => {
    const fetchApproval = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/doctors/approval-status', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Works as expected:
        const { isApproved, name, email, imageUrl } = res.data;
        setDoctor({ name, email, imageUrl });
        console.log(res.data);

        const currentStatus = isApproved ? 'approved' : 'pending';
        setStatus(currentStatus);

        // 🔔 Show toast only when status changes from pending → approved
        if (prevStatus === 'pending' && currentStatus === 'approved') {
          toast.success("🎉 You're now approved to consult patients!");
        }

        setPrevStatus(currentStatus);
      } catch (err) {
        console.error('Error fetching approval status:', err);
        setStatus('error');
      } finally {
        setLoading(false);
      }
    };

    fetchApproval();
  }, [prevStatus]);

  const handleDownload = async () => {
    const input = certificateRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save(`${doctor.name}-Approval-Certificate.pdf`);
  };



  if (loading) return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="flex justify-center items-center p-4 w-75 ml-5 bg-gray-100 min-h-screen status-container">
      {status === 'approved' ? (
        <div className="approval-card" ref={certificateRef}>
        <div className="w-full max-w-2xl">
          <div
            className="bg-white rounded-xl shadow-2xl border-4 border-blue-200 p-8 text-center"
            ref={certificateRef}
          >
            
            <h1 className="text-3xl font-bold text-blue-900 mb-4">Certificate of Approval</h1>
            <p className="text-lg text-gray-700 mb-6">This certifies that</p>

            <h2 className="text-2xl font-semibold text-green-700">{doctor?.name}</h2>
	   <img
	  src={doctor?.imageUrl}
	  alt="Doctor"
	  className="doctor-image"
	/>



            <p className="text-lg text-gray-800 mb-6">
              is officially approved by <strong>MediTrackLite</strong> to consult patients.
            </p>

            <div className="my-4">
              <img src="/images/badge.png" alt="Approval Badge" className="w-28 mx-auto" />
            </div>

            <div className="flex justify-between items-center mt-8 px-4">
              <div className="text-left">
                <p className="text-sm text-gray-600">Issued by:</p>
                <p className="font-semibold text-gray-800">MediTrackLite HealthCare Pvt. Ltd.</p>
              </div>
              <div className="text-center">
                <img src="/images/signature.png" alt="Signature" className="h-12 mx-auto" />
                <p className="text-sm mt-1 font-semibold text-gray-700">Authorized Signatory</p>
              </div>
              {/*<div className="text-right">
                <p className="text-sm text-gray-600">Issued on:</p>
                <p className="text-md font-medium text-gray-800">{issuedDate}</p>
              </div>*/}
            </div>
          </div>
          <div className="text-center mt-6">
            <button
              onClick={handleDownload}
              className="download-btn"
            >
              <FaDownload className="icon" />
              Download Certificate
            </button>
          </div>

        </div>
        </div>
      ) : (

<div className="pending-card">
        <div className="bg-white shadow-xl p-6 rounded-lg w-full max-w-xl text-center border-l-4 border-yellow-400">
          <h2 className="text-2xl font-semibold text-yellow-600 mb-4">Approval Pending</h2>
          <p className="text-gray-700 text-lg mb-6">
            Your profile is currently under review by the MediTrackLite admin team.
          </p>
          <ul className="text-left text-gray-700 list-disc pl-6 space-y-2">
            <li>Ensure your profile is complete and professional</li>
            <li>Upload a clear image and fill your experience</li>
            <li>Wait for verification confirmation</li>
            <li>Contact admin if the wait is too long</li>
          </ul>
        </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalStatus;
