import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center px-4">
        <img 
          src="/burgurry.png" 
          alt="The Burgurry" 
          className="h-24 w-24 mx-auto mb-6 object-contain"
        />
        <h1 className="mb-2 text-4xl font-bold">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">Oops! Page not found</p>
        <a 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors touch-feedback"
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;
