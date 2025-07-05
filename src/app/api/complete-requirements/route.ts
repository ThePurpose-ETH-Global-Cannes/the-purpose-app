import { NextRequest, NextResponse } from 'next/server';
import { 
  AVAILABLE_TASKS, 
  loadCompletedRequirements, 
  saveCompletedRequirements, 
  calculateUserPoints 
} from '@/lib/file-storage';

// Complete a specific task
export async function POST(request: NextRequest) {
  try {
    const { userAddress, privyId, taskId } = await request.json();

    if (!userAddress || !privyId || !taskId) {
      return NextResponse.json(
        { error: 'User address, Privy ID, and task ID are required' },
        { status: 400 }
      );
    }

    // Check if task exists
    const task = AVAILABLE_TASKS.find(t => t.id === taskId);
    if (!task) {
      return NextResponse.json(
        { error: 'Invalid task ID' },
        { status: 400 }
      );
    }

    const userKey = `${userAddress.toLowerCase()}_${privyId}`;
    
    // Load current requirements
    const completedRequirements = loadCompletedRequirements();
    
    // Get or create user requirements
    const userReqs = completedRequirements.get(userKey) || {
      tasks: [],
      completedAt: Date.now()
    };

    // Check if task already completed
    if (userReqs.tasks.includes(taskId)) {
      return NextResponse.json(
        { error: 'Task already completed' },
        { status: 400 }
      );
    }

    // Add completed task
    userReqs.tasks.push(taskId);
    userReqs.completedAt = Date.now();
    
    // Save updated requirements
    completedRequirements.set(userKey, userReqs);
    saveCompletedRequirements(completedRequirements);

    // Calculate total points using shared helper
    const { totalPoints, isEligible, requiredPoints } = calculateUserPoints(userAddress, privyId);

    return NextResponse.json({
      success: true,
      taskCompleted: task.name,
      completedTasks: userReqs.tasks,
      totalPoints,
      isEligible,
      requiredPoints,
      message: isEligible 
        ? 'Congratulations! You are now eligible to mint your NFT!' 
        : `You need ${50 - totalPoints} more points to become eligible.`
    });

  } catch (error) {
    console.error('Error completing task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get user's progress
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get('userAddress');
    const privyId = searchParams.get('privyId');

    if (!userAddress || !privyId) {
      return NextResponse.json(
        { error: 'User address and Privy ID are required' },
        { status: 400 }
      );
    }

    // Calculate user progress using shared helper
    const { userReqs, totalPoints, requiredPoints, isEligible } = calculateUserPoints(userAddress, privyId);

    // Get available tasks with completion status
    const tasksWithStatus = AVAILABLE_TASKS.map(task => ({
      ...task,
      completed: userReqs.tasks.includes(task.id)
    }));

    return NextResponse.json({
      userAddress,
      privyId,
      completedTasks: userReqs.tasks,
      totalPoints,
      requiredPoints,
      isEligible,
      tasks: tasksWithStatus,
      completedAt: userReqs.completedAt
    });

  } catch (error) {
    console.error('Error getting user progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 