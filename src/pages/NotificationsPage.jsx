import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import MobileHeader from '../components/navigation/MobileHeader';
import MobileNav from '../components/navigation/MobileNav';
import { IconComment, IconLike, IconAlert } from '../components/icons/Icons';
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
    message: 'Post #01 is trending on the campus feed today.',
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
    <div className="flex min-h-screen bg-[#050506] text-[#F5F5F5]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-12">
        <MobileHeader />

        <main className="flex-1 flex justify-center px-4 sm:px-8 py-6 sm:py-8">
          <div className="w-full max-w-xl flex flex-col gap-5 text-left">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
              <div className="flex flex-col gap-0.5">
                <h1 className="text-xl sm:text-[22px] font-bold text-[#F5F5F5] tracking-tight">
                  Notifications
                </h1>
                <span className="text-[12.5px] text-[#92929A]">
                  Updates on your stories, replies, and community alerts
                </span>
              </div>
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs text-[#92929A] hover:text-[#F5F5F5] transition-smooth cursor-pointer"
              >
                Mark all read
              </button>
            </div>

            {/* Notifications List */}
            <div className="flex flex-col gap-2.5">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-smooth flex items-start gap-3.5 text-left ${
                    item.unread
                      ? 'bg-[#0D0D10] border-white/[0.08] relative'
                      : 'bg-[#0D0D10]/50 border-white/[0.05] opacity-80'
                  }`}
                >
                  {/* Subtle orange halo/dot for unread */}
                  {item.unread && (
                    <span className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-[#F06A3A]" />
                  )}

                  <div className="mt-0.5 shrink-0 text-[#F06A3A]">
                    {item.type === 'reply' && <IconComment size={18} />}
                    {item.type === 'like' && <IconLike size={18} active />}
                    {item.type === 'system' && <IconAlert size={18} />}
                  </div>

                  <div className="flex-1 flex flex-col gap-1 pr-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#F5F5F5]">{item.title}</span>
                      <span className="text-[11px] text-[#92929A]">{formatRelativeTime(item.time)}</span>
                    </div>
                    <p className="text-xs text-[#92929A] leading-relaxed">
                      {item.message}
                    </p>
                    {item.post_number && (
                      <Link
                        to={`/post/${item.post_number}`}
                        className="text-[11.5px] font-medium text-[#F06A3A] hover:underline mt-1 inline-block"
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
