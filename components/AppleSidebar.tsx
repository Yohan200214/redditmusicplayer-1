import { useState } from 'react';
import { Library, Heart, Clock, Compass, Search } from 'lucide-react';
import clsx from 'clsx';

const libraryItems = [
  { label: 'Listen To This', value: 'listentothis', icon: Library },
  { label: 'Favorites', value: 'music', icon: Heart },
  { label: 'History', value: 'listentothis+music', icon: Clock },
];

const genreItems = [
  'electronicmusic',
  'hiphopheads',
  'indieheads',
  'metal',
  'jazz',
  'classicalmusic',
];

interface AppleSidebarProps {
  activeSubreddit?: string;
  onSelectSubreddit?: (sub: string) => void;
}

export default function AppleSidebar({ activeSubreddit, onSelectSubreddit }: AppleSidebarProps) {
  const [search, setSearch] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      onSelectSubreddit?.(search.trim());
    }
  };

  return (
    <aside className="h-full rounded-2xl bg-white/5 border border-white/10 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.7)] backdrop-blur-xl p-4 space-y-6 text-gray-100">
      <form onSubmit={handleSubmit} className="relative group">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search subreddits..."
          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400/60"
        />
      </form>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Your Library</p>
        <div className="space-y-1">
          {libraryItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubreddit?.toLowerCase() === item.value.toLowerCase();
            return (
              <button
                key={item.value}
                onClick={() => onSelectSubreddit?.(item.value)}
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200',
                  'hover:bg-white/10 hover:-translate-y-0.5',
                  isActive
                    ? 'bg-red-600/15 text-red-200 border border-red-400/30 shadow-[0_10px_30px_-20px_rgba(239,68,68,0.8)]'
                    : 'text-gray-200 border border-white/5'
                )}
              >
                <Icon size={16} className={isActive ? 'text-red-300' : 'text-gray-400'} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Genres</p>
        <div className="flex flex-wrap gap-2">
          {genreItems.map((g) => (
            <button
              key={g}
              onClick={() => onSelectSubreddit?.(g)}
              className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-200 hover:border-red-300/50 hover:text-red-200 transition-all duration-200"
            >
              r/{g}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Filters</p>
        <div className="grid grid-cols-2 gap-2">
          {['Hot', 'New', 'Top', 'Rising'].map((filter) => (
            <span
              key={filter}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 text-center"
            >
              {filter}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}


