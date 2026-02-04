export const PageLayout = ({ children, centered = false }) => (
  <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4${centered ? ' flex items-center justify-center' : ''}`}>
    {children}
  </div>
);
