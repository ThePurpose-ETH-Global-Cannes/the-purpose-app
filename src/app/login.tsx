'use client';
import {usePrivy} from '@privy-io/react-auth';

export default function Login() {
  const {ready, authenticated, user, login, logout} = usePrivy();

  if (!ready) {
    return <p className="text-gray-600 dark:text-gray-400">Loading...</p>;
  }

  const buttonStyles = "rounded-md bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800";

  return (
    <div>
      {authenticated ? (
        <div>
          <button
            onClick={logout}
            className={buttonStyles}
          >
            Logout
          </button>
          <div className="mt-4 rounded-md bg-purple-100 dark:bg-purple-900 p-4">
            <p className="text-sm text-purple-700 dark:text-purple-300">Privy ID</p>
            <p className="text-lg font-semibold text-purple-900 dark:text-purple-100">{user?.id}</p>
            <p className="mt-2 text-sm text-purple-700 dark:text-purple-300">Wallet Address</p>
            <p className="text-lg font-semibold text-purple-900 dark:text-purple-100">{user?.wallet?.address}</p>
          </div>
        </div>
      ) : (
        <button
          onClick={login}
          className={buttonStyles}
        >
          Login with Privy
        </button>
      )}
    </div>
  );
} 