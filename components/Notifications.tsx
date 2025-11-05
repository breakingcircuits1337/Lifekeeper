import React from 'react';

export interface Notification {
  id: string;
  title: string;
  body: string;
  time?: Date;
}

interface NotificationsProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ notifications, onDismiss }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 space-y-3">
      {notifications.map(n => (
        <div key={n.id} className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-4 w-80">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-100">{n.title}</h4>
              <p className="text-xs text-slate-300 mt-1 whitespace-pre-wrap">{n.body}</p>
              {n.time && (
                <p className="text-[11px] text-slate-500 mt-2">
                  {n.time.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              )}
            </div>
            <button
              onClick={() => onDismiss(n.id)}
              className="text-slate-400 hover:text-white ml-2"
              title="Dismiss"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;