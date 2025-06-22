import React from 'react';
    import { Helmet } from 'react-helmet';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';

    const NotFound = () => {
      return (
        <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center text-center p-4">
          <Helmet>
            <title>404 Not Found - GetMax</title>
          </Helmet>
          <h1 className="text-9xl font-extrabold text-brand-green tracking-widest">404</h1>
          <div className="bg-white text-brand-black px-2 text-sm rounded rotate-12 absolute">
            Page Not Found
          </div>
          <p className="text-brand-gray mt-4 mb-8">Sorry, we couldn't find the page you're looking for.</p>
          <Link to="/">
            <Button className="bg-brand-green text-brand-black font-bold rounded-lg hover:bg-white hover:shadow-glow-green transition-all duration-300">
              Go Home
            </Button>
          </Link>
        </div>
      );
    };

    export default NotFound;