import { Link, useLocation } from "react-router-dom";
import { BarChart3, List } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const location = useLocation();

  const navItems = [
    {
      path: "/",
      label: "Analytics",
      icon: BarChart3,
    },
    {
      path: "/transactions",
      label: "Transactions",
      icon: List,
    },
  ];

  return (
    <>
      {/* Top Navigation - Hidden on mobile, shown on desktop */}
      <nav className="hidden md:block border-b border-border bg-card sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6 lg:gap-8">
              {/* Burcurry Logo and Brand */}
              <Link to="/" className="flex items-center gap-3 touch-feedback">
                <img 
                  src="/burgurry.png" 
                  alt="The Burcurry" 
                  className="h-10 w-10 lg:h-12 lg:w-12 object-contain"
                />
                <div className="flex flex-col">
                  <span className="text-lg lg:text-xl font-bold text-foreground tracking-tight leading-none">
                    THE BURCURRY
                  </span>
                  <span className="text-xs text-muted-foreground font-medium tracking-wider">
                    BY 1765
                  </span>
                </div>
              </Link>
              
              <div className="flex gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all touch-feedback",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header - Visible only on mobile */}
      <header className="md:hidden border-b border-border bg-card sticky top-0 z-50 shadow-sm">
        <div className="px-4 py-2.5">
          <Link to="/" className="flex items-center justify-center gap-2.5 touch-feedback">
            <img 
              src="/burgurry.png" 
              alt="The Burcurry" 
              className="h-8 w-8 object-contain"
            />
            <div className="flex flex-col items-center leading-none">
              <span className="text-sm font-bold text-foreground tracking-tight">
                THE BURCURRY
              </span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wider">
                BY 1765
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* Bottom Navigation Bar - Mobile only (iOS/Android style) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg safe-area-bottom">
        <div className="flex justify-around items-center px-2 py-2" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg transition-all touch-feedback no-select",
                  "min-h-[56px]", // Touch-friendly height
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground active:bg-muted"
                )}
              >
                <Icon className={cn(
                  "h-6 w-6 transition-transform",
                  isActive && "scale-110"
                )} />
                <span className={cn(
                  "text-xs font-medium",
                  isActive ? "font-semibold" : "font-normal"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer for bottom nav on mobile */}
      <div className="md:hidden h-20" style={{ height: 'calc(4rem + env(safe-area-inset-bottom))' }} />
    </>
  );
}

