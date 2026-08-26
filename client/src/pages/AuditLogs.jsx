import React, { useState, useEffect, useContext } from 'react';
import { getAuditLogs } from '../services/auditLogService';

import { AuthContext } from '../context/AuthContext';

const AuditLogs = () => {
  const { user, hasPermission } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  if (user?.userType !== 'CHAIRMAN' && !hasPermission('audit.view')) {
    return <div className="p-4 text-red-500">You do not have permission to view audit logs.</div>;
  }

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await getAuditLogs({
        params: { page, limit: 15 }
      });
      setLogs(res.data.data.logs);
      setTotalPages(res.data.data.pagination.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Audit Logs</h2>
      
      {loading ? <p>Loading logs...</p> : (
        <>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-2">Date / Time</th>
                <th className="p-2">Actor</th>
                <th className="p-2">Action</th>
                <th className="p-2">Entity Type</th>
                <th className="p-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? <tr><td colSpan="5" className="p-2">No audit logs found</td></tr> : null}
              {logs.map(log => (
                <tr key={log._id} className="border-b text-sm">
                  <td className="p-2 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="p-2">{log.actorUserId?.fullName || 'System'}</td>
                  <td className="p-2 font-semibold">{log.action}</td>
                  <td className="p-2">{log.entityType}</td>
                  <td className="p-2">
                    <pre className="text-xs bg-gray-50 p-1 rounded overflow-x-auto">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="flex space-x-2 mt-4 items-center">
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

export default AuditLogs;
