import React, { useState } from 'react';
import { X, Smartphone, MapPin, Clock, LogOut, AlertCircle } from 'lucide-react';
import { AdminUser, SessionInfo } from '../types/userManagementTypes';

interface SessionManagementModalProps {
  user: AdminUser;
  onClose: () => void;
}

// Mock sessions data
const MOCK_SESSIONS: SessionInfo[] = [
  {
    id: 'session-1',
    userId: '1',
    device: 'MacBook Pro - Chrome 131',
    ipAddress: '192.168.1.100',
    loginTime: new Date('2025-12-12T14:30:00'),
    lastActivity: new Date('2025-12-12T14:45:00'),
    location: 'Stockholm, Sweden',
  },
  {
    id: 'session-2',
    userId: '1',
    device: 'iPhone 14 - Safari',
    ipAddress: '192.168.1.200',
    loginTime: new Date('2025-12-11T09:15:00'),
    lastActivity: new Date('2025-12-11T09:30:00'),
    location: 'Stockholm, Sweden',
  },
  {
    id: 'session-3',
    userId: '1',
    device: 'iPad Air - Safari',
    ipAddress: '192.168.1.220',
    loginTime: new Date('2025-12-10T16:45:00'),
    lastActivity: new Date('2025-12-10T17:00:00'),
    location: 'Stockholm, Sweden',
  },
];

export const SessionManagementModal: React.FC<SessionManagementModalProps> = ({
  user,
  onClose,
}) => {
  const [sessions, setSessions] = useState<SessionInfo[]>(MOCK_SESSIONS);
  const [terminatingSession, setTerminatingSession] = useState<string | null>(
    null
  );

  const handleTerminateSession = (sessionId: string) => {
    if (
      window.confirm(
        'Are you sure you want to terminate this session? The user will be logged out.'
      )
    ) {
      setTerminatingSession(sessionId);
      setTimeout(() => {
        setSessions(sessions.filter((s) => s.id !== sessionId));
        setTerminatingSession(null);
      }, 500);
    }
  };

  const handleTerminateAllSessions = () => {
    if (
      window.confirm(
        'Are you sure you want to terminate all sessions? All devices will be logged out.'
      )
    ) {
      setSessions([]);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Active Sessions
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage active sessions for {user.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48">
              <AlertCircle className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500">No active sessions</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {/* Security Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Tip:</span> You can terminate
                  sessions to log out users from specific devices. This is useful for
                  security purposes.
                </p>
              </div>

              {/* Sessions List */}
              {sessions.map((session, index) => (
                <div
                  key={session.id}
                  className={`border border-gray-200 rounded-lg p-6 transition ${
                    terminatingSession === session.id
                      ? 'opacity-50 pointer-events-none'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-6 mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Smartphone className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {session.device}
                        </h3>
                        <p className="text-sm text-gray-600">{session.location}</p>
                      </div>
                    </div>
                    {index === 0 && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Logged in</p>
                        <p className="text-gray-900 font-medium">
                          {formatDateTime(session.loginTime)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Last activity</p>
                        <p className="text-gray-900 font-medium">
                          {formatTime(session.lastActivity)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">IP Address</p>
                        <p className="text-gray-900 font-medium">
                          {session.ipAddress}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTerminateSession(session.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition font-medium text-sm"
                  >
                    <LogOut className="h-4 w-4" />
                    Terminate Session
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 bg-white flex-shrink-0">
          {sessions.length > 0 && (
            <button
              onClick={handleTerminateAllSessions}
              className="px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition font-medium text-sm"
            >
              Terminate All Sessions
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
