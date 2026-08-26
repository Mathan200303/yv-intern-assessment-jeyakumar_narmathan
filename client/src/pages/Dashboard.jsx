import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getApplications, submitApplication, approveApplication, rejectApplication } from '../services/applicationService';
import { getMembershipTypes } from '../services/membershipTypeService';


const Dashboard = () => {
  const { user, hasPermission } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [appStatusFilter, setAppStatusFilter] = useState('');
  const [appPage, setAppPage] = useState(1);
  const [appTotalPages, setAppTotalPages] = useState(1);

  const [formData, setFormData] = useState({
    applicantType: 'INDIVIDUAL',
    fullName: '',
    nic: '',
    email: '',
    phone: '',
    address: '',
    membershipTypeId: ''
  });
  
  const [submitError, setSubmitError] = useState('');
  
  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const [membershipTypes, setMembershipTypes] = useState([]);

  const isStaff = hasPermission('application.view') || user?.userType === 'CHAIRMAN';
  
  useEffect(() => {
    fetchApplications();
    if (user?.userType === 'MEMBER') {
      fetchMembershipTypes();
    }
  }, [user, appPage, appStatusFilter]);

  const fetchMembershipTypes = async () => {
    try {
      const res = await getMembershipTypes();
      setMembershipTypes(res.data.data);
      if (res.data.data.length > 0) {
        setFormData(prev => ({ ...prev, membershipTypeId: res.data.data[0]._id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await getApplications({
        params: { status: appStatusFilter, page: appPage, limit: 5 }
      });
      setApplications(res.data.data.applications);
      setAppTotalPages(res.data.data.pagination.pages);
    } catch (err) {
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitApplication  = async (e) => {
    e.preventDefault();
    setSubmitError('');
    try {
      await submitApplication(formData);
      alert('Application submitted successfully!');
      fetchApplications();
    } catch (err) {
      setSubmitError(err.response?.data?.error?.details?.[0] || 'Submit failed');
    }
  };

  const approveApp = async (id) => {
    if (!window.confirm('Are you sure you want to approve?')) return;
    try {
      await approveApplication(id);
      fetchApplications();
    } catch (err) {
      alert('Failed to approve');
    }
  };

  const rejectApp = async (id) => {
    if (!rejectReason) return alert('Reason required');
    try {
      await api.patch(ENDPOINTS.APPLICATIONS.REJECT(id), { reason: rejectReason });
      setRejectId(null);
      setRejectReason('');
      fetchApplications();
    } catch (err) {
      alert('Failed to reject');
    }
  };

  if (loading && applications.length === 0) return <div className="p-4">Loading dashboard...</div>;

  const canSubmitApp = user?.userType === 'MEMBER' && !applications.some(a => a.status === 'PENDING' || a.status === 'APPROVED');

  return (
    <div className="space-y-6">
      
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><strong>Name:</strong> {user.fullName}</div>
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Role:</strong> {user.userType}</div>
          {hasPermission('ALL') && <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded w-max">Full Access</span>}
        </div>
        
        <div className="mt-4 p-2 bg-gray-100 text-xs text-gray-500 rounded">
          <p>Debug Info:</p>
          <p>userType: {user?.userType}</p>
          <p>applications length: {applications?.length}</p>
          <p>has Pending/Approved: {applications.some(a => a.status === 'PENDING' || a.status === 'APPROVED') ? 'Yes' : 'No'}</p>
          <p>canSubmitApp: {canSubmitApp ? 'Yes' : 'No'}</p>
        </div>
      </div>

      {canSubmitApp && (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Submit Application</h2>
          <form onSubmit={handleSubmitApplication} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <select name="applicantType" value={formData.applicantType} onChange={handleFormChange} className="border p-2 rounded">
                <option value="INDIVIDUAL">Individual</option>
                <option value="COMPANY">Company</option>
              </select>
              <input type="text" name="fullName" placeholder="Full Name / Company Name" value={formData.fullName} onChange={handleFormChange} className="border p-2 rounded" required />
              <input type="text" name="nic" placeholder="NIC / Reg No." value={formData.nic} onChange={handleFormChange} className="border p-2 rounded" required />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleFormChange} className="border p-2 rounded" required />
              <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleFormChange} className="border p-2 rounded" required />
              <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleFormChange} className="border p-2 rounded" required />
              <select name="membershipTypeId" value={formData.membershipTypeId} onChange={handleFormChange} className="border p-2 rounded" required>
                <option value="">Select Membership Type</option>
                {membershipTypes
                  .filter(type => type.applicableTo === formData.applicantType)
                  .map(type => (
                    <option key={type._id} value={type._id}>{type.name} - LKR {type.annualFee}</option>
                  ))}
              </select>
            </div>
            {submitError && <p className="text-red-500">{submitError}</p>}
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{isStaff ? 'All Applications' : 'My Applications'}</h2>
          
          <select 
            value={appStatusFilter} 
            onChange={(e) => { setAppStatusFilter(e.target.value); setAppPage(1); }}
            className="border p-2 rounded bg-white"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        
        {error && <p className="text-red-500">{error}</p>}
        {applications.length === 0 ? <p>No applications found.</p> : (
          <>
            <table className="w-full text-left border-collapse mb-4">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-2">Applicant</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app._id} className="border-b">
                    <td className="p-2">{app.fullName}</td>
                    <td className="p-2">{app.email}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 text-xs rounded ${app.status === 'APPROVED' ? 'bg-green-100 text-green-800' : app.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {app.status}
                      </span>
                      {app.status === 'REJECTED' && <p className="text-xs text-gray-500 mt-1">Reason: {app.rejectionReason}</p>}
                    </td>
                    <td className="p-2">
                      {app.status === 'PENDING' && isStaff && (
                        <div className="space-x-2 flex">
                          {(hasPermission('application.approve') || user?.userType === 'CHAIRMAN') && (
                            <button onClick={() => approveApp(app._id)} className="bg-green-500 text-white px-2 py-1 text-sm rounded">Approve</button>
                          )}
                          {(hasPermission('application.reject') || user?.userType === 'CHAIRMAN') && (
                            <button onClick={() => setRejectId(app._id)} className="bg-red-500 text-white px-2 py-1 text-sm rounded">Reject</button>
                          )}
                        </div>
                      )}
                      
                      {rejectId === app._id && (
                        <div className="mt-2 flex space-x-2">
                          <input type="text" placeholder="Reason" value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="border p-1 text-sm" />
                          <button onClick={() => rejectApp(app._id)} className="bg-red-600 text-white px-2 py-1 text-sm rounded">Confirm</button>
                          <button onClick={() => setRejectId(null)} className="bg-gray-300 px-2 py-1 text-sm rounded">Cancel</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="flex space-x-2 items-center">
              <button 
                disabled={appPage <= 1} 
                onClick={() => setAppPage(appPage - 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-3 py-1">Page {appPage} of {appTotalPages || 1}</span>
              <button 
                disabled={appPage >= appTotalPages} 
                onClick={() => setAppPage(appPage + 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
      
    </div>
  );
};

export default Dashboard;
