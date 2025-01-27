'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const SearchBar = () => {
  return (
    <div className="relative">
      <Input
        className="w-[25rem] pl-12 hover:border-primary transition-colors duration-300 ease-in-out focus:border-primary focus:ring-primary focus:ring-1"
        placeholder="Search..."
      />
      <span>
        <Search
          size={22}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 text-muted-foreground"
        />
      </span>
    </div>
  );
};

export default SearchBar;
