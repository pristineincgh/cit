import { Search, X } from 'lucide-react';
import { FC } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface SearchFilterProps {
  search: string;
  placeholder?: string;
  setSearch: (value: string) => void;
}

const SearchBar: FC<SearchFilterProps> = ({
  search,
  setSearch,
  placeholder,
}) => {
  const clearSearch = () => setSearch('');

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-4 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder ? placeholder : 'Search...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
        {search && (
          <Button
            size={'icon'}
            onClick={clearSearch}
            variant={'ghost'}
            className="absolute right-2 top-2 h-7 w-7 rounded-full"
          >
            <X />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
