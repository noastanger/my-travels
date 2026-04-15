import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { geocodeCity } from '../../lib/geocode';
import { useTravelsStore } from '../../store/useTravelsStore';
import { useNavigate } from 'react-router-dom';

interface FormValues {
  city: string;
  country: string;
  coverEmoji: string;
}

interface AddTravelModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddTravelModal({ open, onClose }: AddTravelModalProps) {
  const [loading, setLoading] = useState(false);
  const [geoError, setGeoError] = useState(false);
  const addTravel = useTravelsStore((s) => s.addTravel);
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setGeoError(false);

    const coords = await geocodeCity(values.city, values.country);
    const centerLat = coords?.lat ?? 0;
    const centerLng = coords?.lng ?? 0;
    if (!coords) setGeoError(true);

    const travel = addTravel({
      city: values.city,
      country: values.country,
      coverEmoji: values.coverEmoji || undefined,
      centerLat,
      centerLng,
    });

    setLoading(false);
    reset();
    onClose();
    navigate(`/travels/${travel.id}`);
  }

  return (
    <Modal open={open} onClose={onClose} title="New travel">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">City *</label>
          <input
            className="w-full rounded-lg bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none ring-1 ring-white/10 focus:ring-indigo-500"
            placeholder="e.g. Rome"
            {...register('city', { required: true })}
          />
          {errors.city && <p className="text-xs text-red-400">City is required</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">Country *</label>
          <input
            className="w-full rounded-lg bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none ring-1 ring-white/10 focus:ring-indigo-500"
            placeholder="e.g. Italy"
            {...register('country', { required: true })}
          />
          {errors.country && <p className="text-xs text-red-400">Country is required</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">Cover emoji (optional)</label>
          <input
            className="w-full rounded-lg bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none ring-1 ring-white/10 focus:ring-indigo-500"
            placeholder="🗼"
            maxLength={2}
            {...register('coverEmoji')}
          />
        </div>

        {geoError && (
          <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-400 border border-amber-500/20">
            Could not find city coordinates — map will default to world center. You can still add places.
          </p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>
            {loading ? 'Finding city…' : 'Create travel'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
