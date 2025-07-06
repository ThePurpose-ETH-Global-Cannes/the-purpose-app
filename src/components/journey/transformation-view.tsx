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
import { useGlobal } from "@/contexts/global-context";

type LevelStatus = "completed" | "in-progress" | "locked";

interface Level {
  level: number;
  title: string;
  description: string;
  status: LevelStatus;
}

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
  const { levels, completeLevel } = useGlobal();

  const handleCompleteLevel = (levelNumber: number) => {
    completeLevel(levelNumber);
    setIsLevel3ModalOpen(false);
  };

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
          {levels.map((level) => (
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
      <Level3Modal open={isLevel3ModalOpen} onOpenChange={setIsLevel3ModalOpen} handleCompleteLevel={() => handleCompleteLevel(3)} />
    </>
  );
} 