import Login from './login';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          The Purpose
        </h1>
        
        {/* Testing Info Banner */}
        <div className="max-w-md mx-auto mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-800">Testing Mode</p>
              <p className="text-xs text-blue-600">Use ⚡ Fast Forward in tasks to instantly complete requirements</p>
            </div>
          </div>
        </div>
        
        <Login />
        
        {/* Action Links */}
        <div className="mt-8 space-y-3 w-full max-w-sm">
          <Link 
            href="/tasks" 
            className="block w-full text-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            ✅ Complete Tasks to Earn NFT
          </Link>
          <Link 
            href="/mint" 
            className="block w-full text-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            🚀 Mint Your NFT
          </Link>
          <Link 
            href="/metadata-demo" 
            className="block w-full text-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            🎨 View NFT Metadata Demo
          </Link>
        </div>
      </div>
    </main>
  );
}
