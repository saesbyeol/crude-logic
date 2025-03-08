"use client";

import React from 'react';

const TestComponent = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#151c2c]">
      <div className="p-8 bg-[#1a2235] rounded-lg border border-[#2a3548] text-white">
        <h1 className="text-2xl font-bold mb-4">Test Component</h1>
        <p className="text-gray-400">This is a test component to verify styling.</p>
        <div className="mt-4 p-4 bg-[#151c2c] rounded">
          <p className="text-[#2ebd85]">This text should be green.</p>
          <p className="text-[#ff5252] mt-2">This text should be red.</p>
        </div>
      </div>
    </div>
  );
};

export default TestComponent; 