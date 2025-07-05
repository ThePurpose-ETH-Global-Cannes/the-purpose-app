'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Loader2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface Task {
  id: string;
  name: string;
  description: string;
  points: number;
  completed: boolean;
}

interface UserProgress {
  completedTasks: string[];
  totalPoints: number;
  requiredPoints: number;
  isEligible: boolean;
  tasks: Task[];
}

export default function TasksPage() {
  const { ready, authenticated, user } = usePrivy();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [completingTask, setCompletingTask] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const loadProgress = useCallback(async () => {
    if (!user?.wallet?.address || !user.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/complete-requirements?userAddress=${user.wallet.address}&privyId=${user.id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProgress(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load progress');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load user progress when component mounts
  useEffect(() => {
    if (ready && authenticated && user?.wallet?.address) {
      loadProgress();
    }
  }, [ready, authenticated, user, loadProgress]);

  const completeTask = async (taskId: string) => {
    if (!user?.wallet?.address || !user.id) return;

    setCompletingTask(taskId);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/complete-requirements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: user.wallet.address,
          privyId: user.id,
          taskId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete task');
      }

      const data = await response.json();
      setSuccess(data.message);
      
      // Reload progress to get updated data
      await loadProgress();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete task');
    } finally {
      setCompletingTask(null);
    }
  };

  const fastForwardRequirements = async () => {
    if (!user?.wallet?.address || !user.id || !progress) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Complete all remaining tasks to reach eligibility
      const incompleteTasks = progress.tasks.filter(task => !task.completed);
      
      for (const task of incompleteTasks) {
        const response = await fetch('/api/complete-requirements', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userAddress: user.wallet.address,
            privyId: user.id,
            taskId: task.id
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          // Continue with other tasks even if one fails
          console.error(`Failed to complete task ${task.id}:`, errorData.error);
        }
      }

      // Reload progress to get updated data
      await loadProgress();
      setSuccess('🚀 All requirements completed! You are now eligible to mint your NFT!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete all requirements');
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please connect your wallet to view and complete tasks.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Complete Tasks to Earn NFT</h1>
            <p className="text-green-100 mt-1">
              Complete tasks to earn points and become eligible for minting
            </p>
          </div>

          {/* Progress Bar */}
          {progress && (
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-800">Your Progress</h2>
                <span className="text-sm text-gray-600">
                  {progress.totalPoints} / {progress.requiredPoints} points
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    progress.isEligible ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min((progress.totalPoints / progress.requiredPoints) * 100, 100)}%` }}
                ></div>
              </div>
              
              {progress.isEligible ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-800 font-medium">Eligible to mint NFT!</span>
                  </div>
                  <button
                    onClick={() => window.location.href = '/mint'}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Go to Mint
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">
                    Complete {progress.requiredPoints - progress.totalPoints} more points worth of tasks to become eligible
                  </p>
                  <button
                    onClick={fastForwardRequirements}
                    disabled={loading}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium flex items-center"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Fast Forwarding...
                      </>
                    ) : (
                      '⚡ Fast Forward'
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Error/Success Messages */}
          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-800">{success}</p>
                  </div>
                </div>
              </div>
            )}

            {loading && !progress && <LoadingSpinner text="Loading your progress..." />}

            {/* Tasks List */}
            {progress && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Tasks</h3>
                  {!progress.isEligible && (
                    <p className="text-sm text-gray-500 mb-4">
                      💡 Use Fast Forward button above to instantly complete all tasks for testing
                    </p>
                  )}
                </div>
                <div className="grid gap-4">
                  {progress.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`border rounded-lg p-4 transition-all duration-200 ${
                        task.completed 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            {task.completed && (
                              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            <h4 className={`font-medium ${task.completed ? 'text-green-800' : 'text-gray-800'}`}>
                              {task.name}
                            </h4>
                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                              task.completed 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              +{task.points} points
                            </span>
                          </div>
                          <p className={`text-sm mt-1 ${task.completed ? 'text-green-600' : 'text-gray-600'}`}>
                            {task.description}
                          </p>
                        </div>
                        <div className="ml-auto">
                          {task.completed ? (
                            <div className="flex items-center text-green-600">
                              <span className="font-medium">Completed</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => completeTask(task.id)}
                              disabled={completingTask === task.id}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center"
                            >
                              {completingTask === task.id ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Completing...
                                </>
                              ) : (
                                `Complete (${task.points} pts)`
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 