
import React from 'react';
import { Notification } from '../types';

interface NotificationContainerProps {
  notifications: Notification[];
}

const NotificationToast: React.FC<{ notification: Notification }> = ({ notification }) => {
    const baseClasses = "w-full max-w-sm p-4 rounded-lg shadow-lg text-white transition-all duration-500 transform";
    
    const colorClasses = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
    };

    return (
        <div className={`${baseClasses} ${colorClasses[notification.type]}`}>
            {notification.message}
        </div>
    );
};

const NotificationContainer: React.FC<NotificationContainerProps> = ({ notifications }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3">
      {notifications.map(notification => (
        <NotificationToast key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationContainer;
