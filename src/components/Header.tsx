import { Search, Bell, Menu, ChevronDown } from 'lucide-react';
import OktoLogo from './OktoLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  totalItems: number;
  totalQuantity: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onMenuClick?: () => void;
}

const Header = ({ totalItems, totalQuantity, searchTerm, onSearchChange, onMenuClick }: HeaderProps) => {
  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Left: Menu & Logo */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-primary-foreground hover:bg-sidebar-accent md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <OktoLogo className="w-8 h-8 text-primary-foreground" />
            <span className="text-xl font-bold tracking-tight hidden sm:inline">OKTODECK</span>
          </div>
        </div>

        {/* Right: Search & Notifications */}
        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-64 pl-9 bg-white/10 border-white/20 text-primary-foreground placeholder:text-white/50 focus:bg-white focus:text-foreground focus:placeholder:text-muted-foreground"
            />
          </div>
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-sidebar-accent">
            <Search className="h-5 w-5 md:hidden" />
          </Button>
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-sidebar-accent relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-destructive rounded-full" />
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-4 pb-3 md:px-6">
        <button className="flex items-center gap-2 text-sm opacity-90 hover:opacity-100 transition-opacity">
          <span className="font-medium">{totalItems} items, {totalQuantity} units</span>
          <ChevronDown className="h-4 w-4" />
        </button>
        {/* Progress bar placeholder */}
        <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${Math.min((totalQuantity / 2000) * 100, 100)}%` }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
