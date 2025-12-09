"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    estimatedHours: number;
    tags: string[];
    status: string;
    completedSteps: number[];
    tutorialSteps: { title: string }[];
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const status = project.status || "not-started";
  const totalSteps = project.tutorialSteps?.length || 6;
  const completedSteps = project.completedSteps?.length || 0;
  const progress = Math.round((completedSteps / totalSteps) * 100);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isInProgress =
    status === "in-progress" || status === "tutorial-complete";
  const isCompleted = status === "completed";

  const handleCardClick = () => {
    router.push(`/resume-ready/projects/${project.id}`);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/resume-ready/projects/${project.id}`);
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleMenuClick = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    setShowMenu(false);
    router.push(path);
  };

  return (
    <Card
      className={cn(
        "relative transition-all duration-200 cursor-pointer border-2 overflow-hidden",
        isCompleted && "border-green-500",
        isInProgress && "border-orange-500",
        !isCompleted && !isInProgress && "border-gray-200",
        isHovered && !isCompleted && !isInProgress && "border-blue-400",
        isHovered && "shadow-xl -translate-y-1",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
      onClick={handleCardClick}
    >
      {/* Left accent bar for in-progress/completed */}
      {(isInProgress || isCompleted) && (
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-1",
            isCompleted ? "bg-green-500" : "bg-orange-500",
          )}
        />
      )}

      {/* Status indicator badge - top right */}
      {isInProgress && (
        <div className="absolute -top-1 -right-1 z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-400 rounded-full animate-ping opacity-75" />
            <div className="relative bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              ⏱️
            </div>
          </div>
        </div>
      )}

      {/* Completed checkmark */}
      {isCompleted && (
        <div className="absolute -top-2 -left-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg z-10 shadow-lg">
          ✓
        </div>
      )}

      {/* Quick Actions Menu */}
      <div
        className={cn(
          "absolute top-3 right-3 transition-opacity z-20",
          isHovered ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 hover:bg-gray-100 rounded-md bg-white shadow-sm"
          >
            <svg
              className="w-4 h-4 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-30">
              <button
                onClick={(e) =>
                  handleMenuClick(e, `/resume-ready/projects/${project.id}`)
                }
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              >
                📖 View Tutorial
              </button>
              <button
                onClick={(e) =>
                  handleMenuClick(
                    e,
                    `/resume-ready/projects/${project.id}/resume`,
                  )
                }
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              >
                📝 Preview Resume Bullets
              </button>
              <button
                onClick={(e) =>
                  handleMenuClick(
                    e,
                    `/resume-ready/projects/${project.id}/interview`,
                  )
                }
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              >
                🎤 Preview Interview Q&A
              </button>
            </div>
          )}
        </div>
      </div>

      <CardHeader className="pb-2 pl-5">
        <div className="space-y-3 pr-8">
          <h3 className="text-lg font-bold">{project.title}</h3>

          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                getDifficultyColor(project.difficulty),
              )}
            >
              {project.difficulty}
            </span>

            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              ~{project.estimatedHours}h
            </span>

            {isInProgress && <Badge variant="warning">In Progress</Badge>}
            {status === "tutorial-complete" && (
              <Badge variant="info">Tutorial Done</Badge>
            )}
            {isCompleted && <Badge variant="success">Completed</Badge>}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pl-5">
        <p className="text-sm text-gray-600 line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="px-2 py-0.5 text-gray-500 text-xs">
              +{project.tags.length - 4}
            </span>
          )}
        </div>

        {/* Progress Section - Enhanced for in-progress */}
        {isInProgress && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-orange-800">
                  Your Progress
                </span>
              </div>
              <span className="text-sm font-bold text-orange-600">
                {completedSteps} / {totalSteps} steps
              </span>
            </div>
            <div className="w-full bg-orange-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
              <span>~{project.estimatedHours}h total</span>
              <span>
                ~{Math.round(project.estimatedHours * (1 - progress / 100))}h
                remaining
              </span>
            </div>
          </div>
        )}

        {/* Regular progress for completed */}
        {isCompleted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-green-800">
                Completed
              </span>
              <span className="text-sm text-green-600">
                {totalSteps}/{totalSteps} steps ✓
              </span>
            </div>
          </div>
        )}

        {/* Expand/Collapse Details */}
        <button
          onClick={handleExpandClick}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          <svg
            className={cn(
              "w-4 h-4 transition-transform duration-300",
              isExpanded && "rotate-180",
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          {isExpanded ? "Hide Details" : "Show Details"}
        </button>

        {/* Expanded Details with animation */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div
            className="space-y-4 pt-4 border-t"
            onClick={(e) => e.stopPropagation()}
          >
            {/* What You'll Learn */}
            <div>
              <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                <span className="text-lg">🎯</span>
                What You&apos;ll Learn:
              </h4>
              <ul className="space-y-1.5 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Build and deploy ML models to production</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Optimize inference for real-time applications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Create production-ready REST APIs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Handle concurrent users with proper scaling</span>
                </li>
              </ul>
            </div>

            {/* What You'll Get - highlighted box */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                <span className="text-lg">📦</span>
                What You&apos;ll Get After Completion:
              </h4>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold text-xs">
                      {totalSteps}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">Step Tutorial</p>
                    <p className="text-gray-600 text-xs">
                      From setup to deployment
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-xs">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Resume Bullet Versions</p>
                    <p className="text-gray-600 text-xs">
                      Technical, Impact, Full-Stack styles
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold text-xs">
                      3+
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">
                      Interview Q&A with STAR Answers
                    </p>
                    <p className="text-gray-600 text-xs">
                      Prepared answers for common questions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Prerequisites */}
            <div>
              <h4 className="font-semibold mb-2 text-sm text-gray-600 flex items-center gap-2">
                <span>📋</span>
                Prerequisites:
              </h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Python basics</Badge>
                <Badge variant="default">Basic ML concepts</Badge>
                <Badge variant="default">Command line</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div onClick={(e) => e.stopPropagation()}>
          {isCompleted ? (
            <Button
              onClick={handleActionClick}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              View Results
            </Button>
          ) : isInProgress ? (
            <Button
              onClick={handleActionClick}
              className="w-full bg-orange-600 hover:bg-orange-700 shadow-lg font-semibold transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              Continue Learning →
            </Button>
          ) : (
            <Button
              onClick={handleActionClick}
              className="w-full transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Start Project →
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
