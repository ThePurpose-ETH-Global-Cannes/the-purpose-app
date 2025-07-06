'use client'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Level3Modal } from "@/components/level-3/level-3-modal";

type LevelStatus = "completed" | "in-progress" | "locked";

interface Level {
  level: number;
  title: string;
  description: string;
  status: LevelStatus;
}

const levelsData: Level[] = [
    {
        level: 1,
        title: "Replay & Take Notes",
        description: "Find what hits you in the video.",
        status: "completed",
    },
    {
        level: 2,
        title: "Write & Reflect",
        description: "Journal your insights into clarity.",
        status: "completed",
    },
    {
        level: 3,
        title: "Connect & Match",
        description: "A new way to meet, match, and grow with purpose-driven peers.",
        status: "in-progress",
    },
    {
        level: 4,
        title: "Act",
        description: "Take a small, meaningful action.",
        status: "locked",
    },
    {
        level: 5,
        title: "Team Up",
        description: "Gain insights from others.",
        status: "locked",
    },
    {
        level: 6,
        title: "Test Yourself",
        description: "Show your progress to inspire others.",
        status: "locked",
    },
    {
        level: 7,
        title: "Mentor & Complete",
        description: "Get verified by your team.",
        status: "locked",
    },
];

const StatusBadge = ({ status }: { status: LevelStatus }) => {
  if (status === "locked") return null;

  const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full";
  const statusClasses = {
    completed: "bg-muted text-muted-foreground",
    "in-progress": "bg-primary/20 text-primary",
    locked: "",
  };

  const text = status === 'completed' ? 'Completed' : 'In Progress';

  return (
    <div className={cn(baseClasses, statusClasses[status])}>
      {text}
    </div>
  );
};

export function TransformationView({ userLevel = 3 }: { userLevel?: number }) {
  const [isLevel3ModalOpen, setIsLevel3ModalOpen] = useState(false);
  
  const handleLevelClick = (level: Level) => {
    if (level.level === 3) {
      setIsLevel3ModalOpen(true);
    } else {
        // TODO: Handle navigation to level details
        console.log(`Navigating to level ${level.level}`);
    }
  };

  return (
    <>
      <div className="space-y-4 mt-6">
        <h2 className="text-xl font-bold">Your 7-Level Transformation</h2>
        <div className="space-y-4">
          {levelsData.map((level) => (
            <Card
              key={level.level}
              className={cn(
                level.status !== "locked" && "cursor-pointer transition-all hover:shadow-lg",
                level.status === "locked" && "bg-muted/50",
                level.level === userLevel && "border-primary ring-1 ring-primary",
                "!py-4"
              )}
              onClick={() => level.status !== "locked" && handleLevelClick(level)}
            >
              <CardHeader>
                  <CardTitle>Level {level.level}: {level.title}</CardTitle>
                  <CardDescription>{level.description}</CardDescription>
                  <CardAction>
                      <StatusBadge status={level.status} />
                  </CardAction>
              </CardHeader>
              <CardContent>
                {level.status === "completed" && (
                  <Button variant="outline" onClick={(e) => { e.stopPropagation(); handleLevelClick(level); }}>
                    Review Level
                  </Button>
                )}
                {level.status === "in-progress" && (
                  <Button onClick={(e) => { e.stopPropagation(); handleLevelClick(level); }}>
                    Start Level
                  </Button>
                )}
                {level.status === "locked" && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Lock className="mr-2 h-4 w-4" />
                    Complete previous level to unlock
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Level3Modal open={isLevel3ModalOpen} onOpenChange={setIsLevel3ModalOpen} />
    </>
  );
} 