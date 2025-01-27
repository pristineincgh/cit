import NavLinks from './nav-links';
import SearchBar from './search-bar';
import UserDropDown from './user-dropdown';

const NavBar = () => {
  return (
    <nav className="p-4 flex justify-between items-center border-b">
      <div className="flex items-center gap-6">
        <UserDropDown />
        <NavLinks />
      </div>
      <SearchBar />
    </nav>
  );
};

export default NavBar;
