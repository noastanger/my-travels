import { useForm } from 'react-hook-form';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { PlaceSource } from '../../types';

interface FormValues {
  name: string;
  source: PlaceSource;
  url: string;
  notes: string;
}

interface AddPlaceModalProps {
  open: boolean;
  lat: number | null;
  lng: number | null;
  travelId: string;
  onClose: () => void;
  onAdd: (data: FormValues & { lat: number; lng: number }) => void;
}

const sources: { value: PlaceSource; label: string }[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'google-maps', label: 'Google Maps' },
  { value: 'blog', label: 'Blog' },
  { value: 'other', label: 'Other' },
];

export function AddPlaceModal({ open, lat, lng, onClose, onAdd }: AddPlaceModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: { source: 'instagram' },
  });

  function onSubmit(values: FormValues) {
    if (lat === null || lng === null) return;
    onAdd({ ...values, lat, lng });
    reset();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Add a place">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {lat !== null && lng !== null && (
          <div className="rounded-lg bg-slate-700/50 px-3 py-2 text-xs text-slate-400">
            📍 {lat.toFixed(5)}, {lng.toFixed(5)}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">Place name *</label>
          <input
            className="w-full rounded-lg bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none ring-1 ring-white/10 focus:ring-indigo-500"
            placeholder="e.g. Trevi Fountain"
            {...register('name', { required: true })}
          />
          {errors.name && <p className="text-xs text-red-400">Name is required</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">Source *</label>
          <select
            className="w-full rounded-lg bg-slate-700 px-3 py-2 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-indigo-500"
            {...register('source')}
          >
            {sources.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">Link (optional)</label>
          <input
            className="w-full rounded-lg bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none ring-1 ring-white/10 focus:ring-indigo-500"
            placeholder="https://..."
            type="url"
            {...register('url')}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-300">Notes (optional)</label>
          <textarea
            rows={2}
            className="w-full resize-none rounded-lg bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none ring-1 ring-white/10 focus:ring-indigo-500"
            placeholder="Why do you want to visit?"
            {...register('notes')}
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={lat === null}>Add place</Button>
        </div>
      </form>
    </Modal>
  );
}
