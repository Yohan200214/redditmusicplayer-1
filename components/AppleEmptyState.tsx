interface AppleEmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function AppleEmptyState({
  icon = '🎵',
  title,
  description,
  actionLabel,
  onAction,
}: AppleEmptyStateProps) {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-white/80 via-white/70 to-white/50 dark:from-white/10 dark:via-white/5 dark:to-white/0 border border-white/40 dark:border-white/10 backdrop-blur-xl shadow-[0_25px_80px_-45px_rgba(0,0,0,0.8)] p-10 text-center space-y-4 animate-fadeIn">
      <div className="text-6xl">{icon}</div>
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h3>
        {description && <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-5 py-3 rounded-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white font-semibold shadow-lg shadow-red-500/25 transition-all duration-200 ease-out hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.02]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}


