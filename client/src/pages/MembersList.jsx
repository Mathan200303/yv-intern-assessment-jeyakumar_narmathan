import React, { useState, useEffect, useContext } from 'react';
import { getMembers } from '../services/memberService';

import { AuthContext } from '../context/AuthContext';

const MembersList = () => {
  const { hasPermission, user } = useContext(AuthContext);
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  if (!hasPermission('member.view') && user.userType !== 'CHAIRMAN') {
    return <div className="p-4 text-red-500">You do not have permission to view this page.</div>;
  }

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await getMembers({
        params: { search, status, page, limit: 10 }
      });
      setMembers(res.data.data.members);
      setTotalPages(res.data.data.pagination.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [page]);

  const handleFilter = (e) => {
    e.preventDefault();
    setPage(1);
    fetchMembers();
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Members Directory</h2>
      
      <form onSubmit={handleFilter} className="mb-4 flex space-x-4">
        <input 
          type="text" 
          placeholder="Search name or email" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="border p-2 rounded flex-grow"
        />
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)} 
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="EXPIRED">Expired</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Search</button>
      </form>

      {loading ? <p>Loading...</p> : (
        <>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Membership #</th>
                <th className="p-2">Type</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? <tr><td colSpan="5" className="p-2">No members found</td></tr> : null}
              {members.map(m => (
                <tr key={m._id} className="border-b">
                  <td className="p-2">{m.userId?.fullName}</td>
                  <td className="p-2">{m.userId?.email}</td>
                  <td className="p-2 font-mono">{m.membershipNumber}</td>
                  <td className="p-2">{m.membershipTypeId?.name}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 text-xs rounded ${m.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {}
          <div className="flex space-x-2 mt-4">
            <button 
              disabled={page <= 1} 
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-1">Page {page} of {totalPages || 1}</span>
            <button 
              disabled={page >= totalPages} 
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MembersList;
