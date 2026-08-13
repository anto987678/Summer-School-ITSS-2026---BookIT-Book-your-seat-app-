import Dashboard from '@/pages/Dashboard';
import InviteModal from './components/InviteModal';

const Invite = () => {
  return (
    <div className='relative min-h-full'>
        <div className="pointer-events-none">
            <Dashboard />
        </div>
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/40 p-6 backdrop-blur-[1px]">
            <InviteModal />
        </div>
    </div>
  )
}

export default Invite
