import React from 'react';

const CATEGORIES = [
  'All',
  'Confessions',
  'College Life',
  'Academics',
  'Relationships',
  'Rants',
  'Memes & Fun',
  'Advice'
];

export default function CategoryBar({ selectedCategory, onSelectCategory }) {
  return (
    <div className="w-full overflow-x-auto scrollbar-none py-1 flex items-center gap-1 select-none pb-1">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory.toLowerCase() === (cat === 'Memes & Fun' ? 'memes & fun' : cat.toLowerCase());
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat === 'All' ? 'all' : cat)}
            className={`relative px-3 py-1.5 rounded-xl text-[12.5px] font-medium shrink-0 transition-smooth cursor-pointer flex items-center gap-1.5 ${
              isSelected
                ? 'bg-[#111114] text-[#F5F5F5] font-semibold border border-white/[0.07] shadow-sm'
                : 'text-[#92929A] hover:text-[#F5F5F5] hover:bg-white/[0.02]'
            }`}
          >
            {isSelected && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#F06A3A] shrink-0" />
            )}
            <span>{cat}</span>
          </button>
        );
      })}
    </div>
  );
}
