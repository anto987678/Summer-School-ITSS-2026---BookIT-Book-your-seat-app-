import Dashboard from '@/pages/Dashboard';
import BackButton from '@/components/BackButton';
import AIAssistant from '@/pages/AIAssistant';
import InviteModal from './components/InviteModal';

const Invite = () => {
  return (
    <div className='relative min-h-full'>
        <div className="pointer-events-none">
            <Dashboard />
        </div>
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/40 p-6 backdrop-blur-[1px]">
            <BackButton className="absolute left-6 top-6" fallbackTo="/dashboard" />
            <InviteModal />
            <AIAssistant />
        </div>
    </div>
  )
}

export default Invite


