'use client';

import { useToastStore } from '@/lib/toast';
import { X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, remove } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 rounded-lg px-4 py-3 shadow-lg border text-sm backdrop-blur ${
            toast.type === 'success'
              ? 'bg-green-600/90 border-green-500 text-white'
              : toast.type === 'error'
              ? 'bg-red-600/90 border-red-500 text-white'
              : 'bg-gray-800/90 border-gray-700 text-white'
          }`}
        >
          <div className="flex-1">{toast.message}</div>
          <button
            onClick={() => remove(toast.id)}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Dismiss toast"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

