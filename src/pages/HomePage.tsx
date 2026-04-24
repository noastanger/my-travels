import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTravelsStore } from '../store/useTravelsStore';
import { TravelCard } from '../components/travels/TravelCard';
import { AddTravelModal } from '../components/travels/AddTravelModal';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Plus, Settings } from 'lucide-react';

export function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const travels = useTravelsStore((s) => s.travels);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌍</span>
            <span className="text-lg font-bold text-white">My Travels</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              title="Settings"
            >
              <Settings size={18} />
            </button>
            <Button onClick={() => setModalOpen(true)}>
              <Plus size={16} />
              New travel
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        {travels.length === 0 ? (
          <EmptyState
            icon="✈️"
            title="No travels yet"
            description="Add your first travel destination and start mapping the places you want to visit."
            action={
              <Button onClick={() => setModalOpen(true)}>
                <Plus size={16} /> New travel
              </Button>
            }
          />
        ) : (
          <>
            <p className="mb-6 text-sm text-slate-400">
              {travels.length} {travels.length === 1 ? 'destination' : 'destinations'}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {travels.map((travel) => (
                <TravelCard key={travel.id} travel={travel} />
              ))}
            </div>
          </>
        )}
      </main>

      <AddTravelModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
