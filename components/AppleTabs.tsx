import clsx from 'clsx';

type TabKey = 'player' | 'browser' | 'playlist' | 'comments';

interface AppleTabsProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

const tabs: { key: TabKey; label: string }[] = [
  { key: 'player', label: 'Player' },
  { key: 'browser', label: 'Browse' },
  { key: 'playlist', label: 'Playlist' },
  { key: 'comments', label: 'Comments' },
];

export default function AppleTabs({ active, onChange }: AppleTabsProps) {
  return (
    <div className="flex items-center gap-2 bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-full px-1 py-1 backdrop-blur-xl shadow-[0_10px_40px_-25px_rgba(0,0,0,0.6)] transition-all duration-200 ease-out">
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={clsx(
              'px-4 sm:px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ease-out',
              'hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60',
              isActive
                ? 'bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white shadow-lg shadow-red-500/25'
                : 'text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-white/10 hover:text-red-400'
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}


