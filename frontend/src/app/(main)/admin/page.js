'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin, isAdminVerified, setAdminVerified } from '@/lib/auth';
import {
  verifyAdminPassword,
  fetchAllUsers,
  toggleUserPremium,
  warnUser,
  banUser,
  unbanUser,
  deleteUser,
  fetchReports,
  reviewReport,
  sendCustomNotification,
} from '@/lib/admin';
import { fetchEvents, deleteEvent } from '@/lib/events';
import EventForm from '@/components/EventForm';
import Link from 'next/link';

export default function AdminPanelPage() {
  const router = useRouter();
  
  // Authentication states
  const [authenticated, setAuthenticated] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Tabs: 'users' | 'events' | 'reports' | 'notifications'
  const [activeTab, setActiveTab] = useState('users');

  // Users Tab states
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [userPage, setUserPage] = useState(1);
  const [userPages, setUserPages] = useState(1);
  const [usersLoading, setUsersLoading] = useState(false);

  // User Actions Modals
  const [warnModalUser, setWarnModalUser] = useState(null);
  const [warnReason, setWarnReason] = useState('');
  const [banModalUser, setBanModalUser] = useState(null);
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState('1'); // '1' | '3' | '7' | '30' | 'permanent'

  // Events Tab states
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);

  // Reports Tab states
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsFilter, setReportsFilter] = useState('pending');
  const [adminNotes, setAdminNotes] = useState({}); // reportId -> noteText

  // Notifications Tab states
  const [notifRecipients, setNotifRecipients] = useState('all');
  const [notifCustomIds, setNotifCustomIds] = useState('');
  const [notifText, setNotifText] = useState('');
  const [notifType, setNotifType] = useState('system');
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState(false);
  const [notifError, setNotifError] = useState('');

  // Global actions error/success
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Ensure user is admin
  useEffect(() => {
    if (!isAdmin()) {
      router.replace('/');
      return;
    }

    if (isAdminVerified()) {
      setAuthenticated(true);
    }
  }, [router]);

  // Load active tab data
  useEffect(() => {
    if (!authenticated) return;

    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'events') {
      loadEvents();
    } else if (activeTab === 'reports') {
      loadReports();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, activeTab, userPage, userFilter]);

  // --- USER API CALLS ---
  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const data = await fetchAllUsers({
        search: userSearch,
        page: userPage,
        filter: userFilter,
        limit: 8,
      });
      setUsers(data.users);
      setUserPages(data.pages);
    } catch (err) {
      setActionError(err.message || 'Failed to fetch users');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setUserPage(1);
    loadUsers();
  };

  const handleTogglePremium = async (userId) => {
    try {
      await toggleUserPremium(userId);
      showSuccess('User premium status updated');
      loadUsers();
    } catch (err) {
      showError(err.message || 'Premium toggle failed');
    }
  };

  const handleWarnUserSubmit = async (e) => {
    e.preventDefault();
    if (!warnReason.trim()) return;
    try {
      await warnUser(warnModalUser._id, warnReason);
      showSuccess(`Warning issued to ${warnModalUser.name}`);
      setWarnModalUser(null);
      setWarnReason('');
      loadUsers();
    } catch (err) {
      showError(err.message || 'Failed to warn user');
    }
  };

  const handleBanUserSubmit = async (e) => {
    e.preventDefault();
    if (!banReason.trim()) return;
    try {
      await banUser(banModalUser._id, banDuration, banReason);
      showSuccess(`User ${banModalUser.name} banned successfully`);
      setBanModalUser(null);
      setBanReason('');
      loadUsers();
    } catch (err) {
      showError(err.message || 'Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId, userName) => {
    try {
      await unbanUser(userId);
      showSuccess(`User ${userName} unbanned`);
      loadUsers();
    } catch (err) {
      showError(err.message || 'Unban failed');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you absolutely sure you want to permanently delete user "${userName}"? This will delete all their listings, events, and reports, and cannot be undone.`)) return;
    try {
      await deleteUser(userId);
      showSuccess(`User ${userName} and all associated data deleted.`);
      loadUsers();
    } catch (err) {
      showError(err.message || 'Failed to delete user');
    }
  };

  // --- EVENTS API CALLS ---
  const loadEvents = async () => {
    setEventsLoading(true);
    try {
      const data = await fetchEvents('All');
      setEvents(data);
    } catch (err) {
      setActionError(err.message || 'Failed to load events');
    } finally {
      setEventsLoading(false);
    }
  };

  const handleDeleteEvent = async (id, title) => {
    if (!window.confirm(`Delete event "${title}"?`)) return;
    try {
      await deleteEvent(id);
      showSuccess(`Event "${title}" deleted`);
      loadEvents();
    } catch (err) {
      showError(err.message || 'Failed to delete event');
    }
  };

  // --- REPORTS API CALLS ---
  const loadReports = async () => {
    setReportsLoading(true);
    try {
      const data = await fetchReports(reportsFilter);
      setReports(data.reports);
    } catch (err) {
      setActionError(err.message || 'Failed to load reports');
    } finally {
      setReportsLoading(false);
    }
  };

  const handleResolveReport = async (reportId, status) => {
    const note = adminNotes[reportId] || '';
    try {
      await reviewReport(reportId, status, note);
      showSuccess(`Report marked as ${status}`);
      loadReports();
    } catch (err) {
      showError(err.message || 'Failed to update report status');
    }
  };

  // --- NOTIFICATIONS API CALLS ---
  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!notifText.trim()) return;

    setNotifLoading(true);
    setNotifSuccess(false);
    setNotifError('');

    try {
      let recipients = notifRecipients;
      if (recipients === 'custom') {
        recipients = notifCustomIds.split(',').map((id) => id.trim()).filter(Boolean);
        if (recipients.length === 0) {
          throw new Error('Please enter at least one User ID.');
        }
      }

      await sendCustomNotification({
        recipients,
        text: notifText,
        type: notifType,
      });

      setNotifSuccess(true);
      setNotifText('');
      setNotifCustomIds('');
    } catch (err) {
      setNotifError(err.message || 'Failed to send notification');
    } finally {
      setNotifLoading(false);
    }
  };

  // --- PASSWORD RE-AUTH HANDLER ---
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      await verifyAdminPassword(authPassword);
      setAdminVerified(true);
      setAuthenticated(true);
    } catch (err) {
      setAuthError(err.message || 'Verification failed. Incorrect password.');
    } finally {
      setAuthLoading(false);
    }
  };

  // --- UTILS ---
  const showSuccess = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const showError = (msg) => {
    setActionError(msg);
    setTimeout(() => setActionError(''), 4000);
  };

  // Password Modal Render
  if (!authenticated) {
    return (
      <div className="fixed inset-0 bg-[#F4F3FE] z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-[#EEEDFB] text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 bg-[#F4F3FE] text-[#6C5CE7] rounded-full mx-auto flex items-center justify-center font-bold text-3xl">
            🛡️
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1E1B2E]">Admin Re-Verification</h2>
            <p className="text-sm text-[#8A86A3] mt-2">
              Please re-enter your admin password to access the control panel.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authError && (
              <p className="text-sm text-red-500 bg-red-50 py-2.5 px-4 rounded-xl border border-red-100 font-medium">
                {authError}
              </p>
            )}
            <input
              type="password"
              placeholder="Enter admin password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm text-[#1E1B2E] focus:outline-none focus:border-[#6C5CE7] focus:bg-white transition-all"
              required
            />
            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 px-6 rounded-xl bg-[#6C5CE7] text-white font-semibold hover:bg-[#5b4cc4] active:scale-98 transition-all text-sm flex items-center justify-center gap-2"
            >
              {authLoading ? 'Verifying...' : 'Access Control Panel'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 pb-24">
      {/* Header and status flags */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EEEDFB] pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1E1B2E]">Admin Control Panel</h1>
          <p className="text-sm text-[#8A86A3] mt-1">Manage UniVerse users, events, reports, and system communications.</p>
        </div>

        <div className="flex gap-2">
          {['users', 'events', 'reports', 'notifications'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-[#6C5CE7] text-white shadow-md shadow-[#6C5CE7]/10'
                  : 'bg-white border border-[#EEEDFB] text-[#8A86A3] hover:bg-[#F4F3FE] hover:text-[#6C5CE7]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {actionError && (
        <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium animate-fade-in">
          ⚠️ {actionError}
        </div>
      )}

      {actionSuccess && (
        <div className="p-4 bg-green-50 text-green-600 border border-green-100 rounded-xl text-sm font-medium animate-fade-in">
          ✓ {actionSuccess}
        </div>
      )}

      {/* --- TAB CONTENT: USERS --- */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#EEEDFB] shadow-sm">
            <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search user name, email, university..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] focus:outline-none focus:border-[#6C5CE7] focus:bg-white transition-all"
              />
              <button type="submit" className="px-5 py-2.5 bg-[#6C5CE7] text-white text-sm font-semibold rounded-xl hover:bg-[#5b4cc4] transition-colors">
                Search
              </button>
            </form>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#8A86A3] uppercase tracking-wider">Filter:</span>
              <select
                value={userFilter}
                onChange={(e) => {
                  setUserFilter(e.target.value);
                  setUserPage(1);
                }}
                className="bg-[#FAFAFC] border border-[#EEEDFB] rounded-xl text-sm text-[#1E1B2E] px-3 py-2 outline-none"
              >
                <option value="all">All Users</option>
                <option value="active">Active Only</option>
                <option value="premium">Premium Only</option>
                <option value="banned">Banned Only</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#EEEDFB] overflow-hidden shadow-sm">
            {usersLoading ? (
              <div className="p-12 text-center text-sm text-[#8A86A3]">Loading users list...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAFAFC] border-b border-[#EEEDFB] text-xs font-semibold text-[#8A86A3] uppercase tracking-wider">
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">University</th>
                      <th className="px-6 py-4">Badges</th>
                      <th className="px-6 py-4">Warnings</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEEDFB] text-sm text-[#1E1B2E]">
                    {users.map((u) => {
                      const isBannedActive = u.isBanned && (!u.banExpires || new Date(u.banExpires) > new Date());
                      return (
                        <tr key={u._id} className="hover:bg-[#FAFAFC]/50 transition-colors">
                          <td className="px-6 py-4 font-semibold">{u.name}</td>
                          <td className="px-6 py-4 text-[#8A86A3]">{u.email}</td>
                          <td className="px-6 py-4">{u.university}</td>
                          <td className="px-6 py-4 space-x-1.5 space-y-1">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-[#FAFAFC] text-[#8A86A3]'}`}>
                              {u.role}
                            </span>
                            {u.isPremium && (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#6C5CE7]/10 text-[#6C5CE7] border border-[#6C5CE7]/20">
                                Premium
                              </span>
                            )}
                            {isBannedActive && (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-500 border border-red-100" title={`Reason: ${u.banReason || 'None'}`}>
                                Banned
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-xs font-semibold text-[#8A86A3]">{u.warnings?.length || 0} issued</td>
                          <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => handleTogglePremium(u._id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${u.isPremium ? 'bg-purple-50 text-purple-600 hover:bg-purple-100' : 'bg-[#FAFAFC] text-[#8A86A3] hover:bg-[#F4F3FE] hover:text-[#6C5CE7]'}`}
                            >
                              {u.isPremium ? 'Remove Premium' : 'Give Premium'}
                            </button>

                            <button
                              onClick={() => setWarnModalUser(u)}
                              className="px-3 py-1.5 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 rounded-lg text-xs font-semibold"
                            >
                              Warn
                            </button>

                            {isBannedActive ? (
                              <button
                                onClick={() => handleUnbanUser(u._id, u.name)}
                                className="px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-xs font-semibold"
                              >
                                Unban
                              </button>
                            ) : (
                              <button
                                onClick={() => setBanModalUser(u)}
                                className="px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg text-xs font-semibold"
                              >
                                Ban
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteUser(u._id, u.name)}
                              className="px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-xs font-semibold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-sm text-[#8A86A3] italic">No users found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {userPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <button
                disabled={userPage <= 1}
                onClick={() => setUserPage((p) => p - 1)}
                className="px-4 py-2 bg-white border border-[#EEEDFB] hover:bg-[#F4F3FE] disabled:opacity-50 text-sm font-semibold rounded-xl"
              >
                Previous
              </button>
              <span className="text-sm font-medium text-[#8A86A3]">
                Page {userPage} of {userPages}
              </span>
              <button
                disabled={userPage >= userPages}
                onClick={() => setUserPage((p) => p + 1)}
                className="px-4 py-2 bg-white border border-[#EEEDFB] hover:bg-[#F4F3FE] disabled:opacity-50 text-sm font-semibold rounded-xl"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- TAB CONTENT: EVENTS --- */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#EEEDFB] shadow-sm">
            <h2 className="text-lg font-bold text-[#1E1B2E]">Events Management</h2>
            <button
              onClick={() => setShowEventForm((v) => !v)}
              className="px-4 py-2 rounded-xl bg-[#6C5CE7] text-white text-sm font-medium"
            >
              {showEventForm ? 'Cancel' : '+ Add event'}
            </button>
          </div>

          {showEventForm && (
            <div className="bg-white p-6 rounded-3xl border border-[#EEEDFB] shadow-sm max-w-lg">
              <EventForm
                onSuccess={() => {
                  setShowEventForm(false);
                  loadEvents();
                  showSuccess('Event created successfully');
                }}
                onCancel={() => setShowEventForm(false)}
              />
            </div>
          )}

          <div className="bg-white rounded-3xl border border-[#EEEDFB] overflow-hidden shadow-sm">
            {eventsLoading ? (
              <div className="p-12 text-center text-sm text-[#8A86A3]">Loading events list...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAFAFC] border-b border-[#EEEDFB] text-xs font-semibold text-[#8A86A3] uppercase tracking-wider">
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Society / Org</th>
                      <th className="px-6 py-4">Date / Meta</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEEDFB] text-sm text-[#1E1B2E]">
                    {events.map((ev) => (
                      <tr key={ev.id} className="hover:bg-[#FAFAFC]/50 transition-colors">
                        <td className="px-6 py-4 font-semibold">
                          <Link href={`/events/${ev.id}`} className="hover:text-[#6C5CE7] transition-colors">{ev.title}</Link>
                        </td>
                        <td className="px-6 py-4">{ev.category}</td>
                        <td className="px-6 py-4">{ev.org}</td>
                        <td className="px-6 py-4 text-[#8A86A3]">{ev.meta}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Link
                            href={`/events/${ev.id}/edit`}
                            className="px-3 py-1.5 border border-[#EEEDFB] text-[#1E1B2E] hover:bg-[#F4F3FE] hover:text-[#6C5CE7] rounded-lg text-xs font-semibold inline-block"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteEvent(ev.id, ev.title)}
                            className="px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg text-xs font-semibold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {events.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-sm text-[#8A86A3] italic">No events found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: REPORTS --- */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-[#EEEDFB] shadow-sm">
            <span className="text-xs font-semibold text-[#8A86A3] uppercase tracking-wider">Reports Status:</span>
            {['pending', 'reviewed', 'dismissed', 'all'].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setReportsFilter(filter);
                }}
                className={`px-3- py-1.5 px-3 rounded-full text-xs font-semibold capitalize transition-all ${
                  reportsFilter === filter ? 'bg-[#6C5CE7] text-white' : 'border border-[#EEEDFB] hover:bg-[#F4F3FE] text-[#8A86A3]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportsLoading ? (
              <div className="col-span-2 p-12 text-center text-sm text-[#8A86A3]">Loading reports...</div>
            ) : (
              reports.map((rep) => (
                <div key={rep._id} className="bg-white p-5 rounded-2xl border border-[#EEEDFB] shadow-sm flex flex-col justify-between space-y-4 animate-fade-in">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        rep.targetType === 'user' ? 'bg-orange-50 text-orange-600' :
                        rep.targetType === 'listing' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        Reported {rep.targetType}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        rep.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                        rep.status === 'reviewed' ? 'bg-green-50 text-green-600' : 'bg-[#FAFAFC] text-[#8A86A3]'
                      }`}>
                        {rep.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#1E1B2E] mt-3">
                      Target: <span className="text-[#6C5CE7]">{rep.targetName}</span>
                    </h3>
                    <p className="text-xs text-[#8A86A3] mt-1">
                      Reporter: {rep.reporter?.name || 'Unknown'} ({rep.reporter?.email || 'N/A'})
                    </p>
                    <p className="text-xs text-[#8A86A3] mt-0.5">
                      Submitted: {new Date(rep.createdAt).toLocaleString()}
                    </p>

                    <div className="mt-4 bg-[#F8F7FD] p-3 rounded-xl">
                      <p className="text-xs font-bold text-[#6C5CE7] uppercase tracking-wider">Reason</p>
                      <p className="text-sm font-semibold text-[#1E1B2E] mt-0.5">{rep.reason}</p>
                      {rep.description && (
                        <p className="text-sm text-[#8A86A3] mt-1 leading-relaxed whitespace-pre-wrap">{rep.description}</p>
                      )}
                    </div>

                    {rep.reviewedBy && (
                      <div className="mt-3 text-xs bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-[#8A86A3]">
                        <span className="font-semibold text-gray-700">Reviewed by:</span> {rep.reviewedBy.name}
                        {rep.adminNote && <p className="mt-1"><span className="font-semibold text-gray-700">Note:</span> {rep.adminNote}</p>}
                      </div>
                    )}
                  </div>

                  {rep.status === 'pending' && (
                    <div className="space-y-3 pt-3 border-t border-[#EEEDFB]">
                      <input
                        type="text"
                        placeholder="Add review/action note..."
                        value={adminNotes[rep._id] || ''}
                        onChange={(e) => setAdminNotes({ ...adminNotes, [rep._id]: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#EEEDFB] bg-[#FAFAFC] focus:outline-none focus:bg-white"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleResolveReport(rep._id, 'reviewed')}
                          className="flex-1 py-2 rounded-lg text-xs font-semibold text-white bg-[#6C5CE7] hover:bg-[#5b4cc4] transition-colors"
                        >
                          Mark Reviewed
                        </button>
                        <button
                          onClick={() => handleResolveReport(rep._id, 'dismissed')}
                          className="flex-1 py-2 rounded-lg text-xs font-semibold text-[#8A86A3] bg-[#F4F3FE] hover:bg-[#EEEDFB] transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
            {!reportsLoading && reports.length === 0 && (
              <div className="col-span-2 py-16 text-center text-sm text-[#8A86A3] italic">No reports found.</div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: NOTIFICATIONS --- */}
      {activeTab === 'notifications' && (
        <div className="max-w-xl bg-white p-6 rounded-3xl border border-[#EEEDFB] shadow-sm animate-fade-in">
          <h2 className="text-lg font-bold text-[#1E1B2E] mb-1">Send System Notification</h2>
          <p className="text-xs text-[#8A86A3] mb-6">Compose and dispatch custom system alerts directly to UniVerse users.</p>

          <form onSubmit={handleSendNotification} className="space-y-4">
            {notifError && (
              <p className="text-sm text-red-500 bg-red-50 py-2.5 px-4 rounded-xl border border-red-100 font-medium">
                {notifError}
              </p>
            )}

            {notifSuccess && (
              <p className="text-sm text-green-600 bg-green-50 py-2.5 px-4 rounded-xl border border-green-100 font-medium">
                ✓ Notification broadcast request sent successfully!
              </p>
            )}

            <div>
              <label className="block text-xs font-bold text-[#8A86A3] uppercase tracking-wider mb-2">Recipients</label>
              <select
                value={notifRecipients}
                onChange={(e) => setNotifRecipients(e.target.value)}
                className="w-full bg-[#FAFAFC] border border-[#EEEDFB] rounded-xl text-sm text-[#1E1B2E] px-4 py-3 outline-none focus:border-[#6C5CE7] focus:bg-white transition-all"
              >
                <option value="all">All Users</option>
                <option value="premium">Premium Users Only</option>
                <option value="custom">Custom (Specify User IDs)</option>
              </select>
            </div>

            {notifRecipients === 'custom' && (
              <div>
                <label className="block text-xs font-bold text-[#8A86A3] uppercase tracking-wider mb-2">Specific User IDs</label>
                <input
                  type="text"
                  placeholder="e.g. 64b85c10fa8cd4001fb1e92d, 64b85c10fa8cd4001fb1e92e"
                  value={notifCustomIds}
                  onChange={(e) => setNotifCustomIds(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm text-[#1E1B2E] focus:outline-none focus:border-[#6C5CE7] focus:bg-white transition-all"
                  required
                />
                <p className="text-[10px] text-[#B3AFC9] mt-1">Comma-separated list of MongoDB Object IDs.</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#8A86A3] uppercase tracking-wider mb-2">Notification Type</label>
              <select
                value={notifType}
                onChange={(e) => setNotifType(e.target.value)}
                className="w-full bg-[#FAFAFC] border border-[#EEEDFB] rounded-xl text-sm text-[#1E1B2E] px-4 py-3 outline-none focus:border-[#6C5CE7] focus:bg-white transition-all"
              >
                <option value="system">System Announcement (default)</option>
                <option value="event">Event Highlight</option>
                <option value="listing">Listing Feature</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8A86A3] uppercase tracking-wider mb-2">Message</label>
              <textarea
                rows="4"
                placeholder="Type your system announcement..."
                value={notifText}
                onChange={(e) => setNotifText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm text-[#1E1B2E] focus:outline-none focus:border-[#6C5CE7] focus:bg-white resize-none transition-all"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={notifLoading}
              className="w-full py-3 px-6 rounded-xl bg-[#6C5CE7] text-white font-semibold hover:bg-[#5b4cc4] active:scale-98 transition-all text-sm flex items-center justify-center gap-2"
            >
              {notifLoading ? 'Sending...' : 'Broadcast Notification'}
            </button>
          </form>
        </div>
      )}

      {/* --- WARNING MODAL --- */}
      {warnModalUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <form onSubmit={handleWarnUserSubmit} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#EEEDFB] animate-fade-in">
            <h3 className="text-lg font-bold text-[#1E1B2E]">Issue Warning</h3>
            <p className="text-xs text-[#8A86A3]">
              Send a warning to <span className="font-semibold text-[#6C5CE7]">{warnModalUser.name}</span>. It will be logged in their profile and a notification will alert them.
            </p>
            <div>
              <label className="block text-xs font-semibold text-[#B3AFC9] uppercase tracking-wider mb-2">Reason</label>
              <textarea
                rows="3"
                placeholder="Describe the reason for this warning..."
                value={warnReason}
                onChange={(e) => setWarnReason(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] focus:outline-none focus:bg-white resize-none"
                required
              ></textarea>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setWarnModalUser(null);
                  setWarnReason('');
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-[#6C5CE7] bg-[#F4F3FE] hover:bg-[#EEEDFB] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#6C5CE7] hover:bg-[#5b4cc4] transition-colors"
              >
                Issue Warning
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- BAN MODAL --- */}
      {banModalUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <form onSubmit={handleBanUserSubmit} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#EEEDFB] animate-fade-in">
            <h3 className="text-lg font-bold text-[#1E1B2E]">Ban User</h3>
            <p className="text-xs text-[#8A86A3]">
              Ban user <span className="font-semibold text-[#6C5CE7]">{banModalUser.name}</span>. This will prevent them from signing in or using the app for the selected duration.
            </p>
            
            <div>
              <label className="block text-xs font-semibold text-[#B3AFC9] uppercase tracking-wider mb-2">Ban Duration</label>
              <select
                value={banDuration}
                onChange={(e) => setBanDuration(e.target.value)}
                className="w-full bg-[#FAFAFC] border border-[#EEEDFB] rounded-xl text-sm px-3 py-2.5 outline-none"
              >
                <option value="1">1 Day</option>
                <option value="3">3 Days</option>
                <option value="7">7 Days</option>
                <option value="30">30 Days</option>
                <option value="permanent">Permanent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#B3AFC9] uppercase tracking-wider mb-2">Reason</label>
              <textarea
                rows="3"
                placeholder="Describe the reason for banning this user..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] focus:outline-none focus:bg-white resize-none"
                required
              ></textarea>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setBanModalUser(null);
                  setBanReason('');
                  setBanDuration('1');
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-[#6C5CE7] bg-[#F4F3FE] hover:bg-[#EEEDFB] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Ban User
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
