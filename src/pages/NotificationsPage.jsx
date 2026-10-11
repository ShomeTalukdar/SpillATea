import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import MobileHeader from '../components/navigation/MobileHeader';
import MobileNav from '../components/navigation/MobileNav';
import { IconNotifications, IconComment, IconLike, IconCheck, IconAlert } from '../components/icons/Icons';
import { formatRelativeTime } from '../utils/time';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'reply',
    title: 'New reply to your post',
    message: 'Someone replied: "Professors love when you are honest, but getting a 94 is peak luck."',
    post_number: 1,
    time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    unread: true
  },
  {
    id: 'notif-2',
    type: 'like',
    title: 'Your confession reached 40 upvotes',
    message: 'Post #01 is trending on the campus board today.',
    post_number: 1,
    time: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    unread: true
  },
  {
    id: 'notif-3',
    type: 'system',
    title: 'Campus Guidelines Reminder',
    message: 'Midterm season is active. Please review academic integrity discussion standards.',
    post_number: null,
    time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    unread: false
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <div className="flex min-h-screen bg-[#0D0D0F] text-[#F0F0F2]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <MobileHeader />

        <main className="flex-1 flex justify-center px-4 sm:px-6 py-6">
          <div className="w-full max-w-xl flex flex-col gap-5 text-left">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2F]">
              <div className="flex flex-col gap-0.5">
                <h1 className="text-xl font-semibold text-[#F0F0F2] tracking-tight">
                  Notifications
                </h1>
                <span className="text-xs text-[#777780]">
                  Updates on your stories, replies, and community alerts
                </span>
              </div>
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs text-[#A0A0A8] hover:text-[#F07845] transition-smooth cursor-pointer"
              >
                Mark all read
              </button>
            </div>

            {/* Notifications List */}
            <div className="flex flex-col gap-2.5">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-smooth flex items-start gap-3.5 text-left ${
                    item.unread
                      ? 'bg-[#151518] border-[#2A2A2F] border-l-2 border-l-[#F07845]'
                      : 'bg-[#151518]/60 border-[#2A2A2F] opacity-80'
                  }`}
                >
                  <div className="mt-0.5 shrink-0 text-[#F07845]">
                    {item.type === 'reply' && <IconComment size={18} />}
                    {item.type === 'like' && <IconLike size={18} active />}
                    {item.type === 'system' && <IconAlert size={18} />}
                  </div>

                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#F0F0F2]">{item.title}</span>
                      <span className="text-[11px] text-[#777780]">{formatRelativeTime(item.time)}</span>
                    </div>
                    <p className="text-xs text-[#A0A0A8] leading-relaxed">
                      {item.message}
                    </p>
                    {item.post_number && (
                      <Link
                        to={`/post/${item.post_number}`}
                        className="text-[11px] font-medium text-[#F07845] hover:underline mt-1 inline-block"
                      >
                        View Post #{item.post_number} &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
