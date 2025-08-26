import { BarChart3 } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-primary to-primary-dark rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Sorting Algorithm Visualizer
              </h1>
              <p className="text-sm text-muted-foreground">
                Interactive learning tool for sorting algorithms
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};