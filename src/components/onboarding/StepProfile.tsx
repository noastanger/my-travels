import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { User, Mail } from 'lucide-react';

interface FormValues {
  username: string;
  email: string;
}

interface StepProfileProps {
  defaultValues?: Partial<FormValues>;
  onNext: (data: FormValues) => void;
}

export function StepProfile({ defaultValues, onNext }: StepProfileProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="w-full space-y-5">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Username</label>
        <div className="relative">
          <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            placeholder="e.g. john_doe"
            autoComplete="username"
            {...register('username', { required: 'Username is required' })}
          />
        </div>
        {errors.username && <p className="text-xs text-red-400">{errors.username.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</label>
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="email"
            className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            placeholder="you@example.com"
            autoComplete="email"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
            })}
          />
        </div>
        {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
      </div>

      <Button type="submit" className="w-full py-3 text-sm font-semibold">
        Continue →
      </Button>
    </form>
  );
}
