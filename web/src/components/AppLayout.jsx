import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import Player from './Player';
import AudioProvider from './AudioProvider';

export default function AppLayout() {
  return (
    <AudioProvider>
      <div className="h-screen flex flex-col bg-bg">
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden md:flex">
            <Sidebar />
          </div>
          <main className="flex-1 overflow-y-auto pb-36 md:pb-24">
            <Outlet />
          </main>
        </div>
        <div className="md:hidden">
          <MobileNav />
        </div>
        <Player />
      </div>
    </AudioProvider>
  );
}
