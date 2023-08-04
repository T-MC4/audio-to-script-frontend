import React from 'react';

const Title = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold title mb-2">
    {children}
  </h2>
)

export default Title;