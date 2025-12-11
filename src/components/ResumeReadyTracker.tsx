"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/ProjectCard";
import { cn } from "@/lib/utils";

interface ProjectWithStatus {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedHours: number;
  tags: string[];
  status: string;
  completedSteps: number[];
  startedAt?: string;
  completedAt?: string;
  tutorialSteps: { title: string }[];
}

interface Progress {
  readinessScore: number;
  status: string;
  completedProjects: unknown[];
  resumeBulletsCount: number;
  resumeLastUpdated?: string;
  totalQuestionsReviewed: number;
  expertCallBooked: boolean;
  expertCallDate?: string;
}

interface DashboardData {
  progress: Progress;
  projects: ProjectWithStatus[];
}

export function ResumeReadyTracker() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refs for scrolling
  const projectsRef = useRef<HTMLDivElement>(null);
  const milestonesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProgress() {
      try {
        const response = await fetch("/api/resume-ready/progress");
        if (!response.ok) {
          throw new Error("Failed to fetch progress");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-red-600 mb-4">Error loading tracker: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  const progress = data?.progress;
  const projects = data?.projects || [];
  const completedCount = projects.filter(
    (p) => p.status === "completed",
  ).length;
  const inProgressCount = projects.filter(
    (p) => p.status === "in-progress" || p.status === "tutorial-complete",
  ).length;
  const inProgressProject = projects.find(
    (p) => p.status === "in-progress" || p.status === "tutorial-complete",
  );

  const isNewUser = completedCount === 0 && inProgressCount === 0;
  const hasInProgress = inProgressCount > 0;

  return (
    <div className="space-y-8">
      {/* Progress Overview - Interactive Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card
          className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-blue-300 active:scale-[0.98]"
          onClick={() => scrollToSection(milestonesRef)}
        >
          <CardContent className="py-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {progress?.readinessScore || 0}%
              </div>
              <div className="text-xs text-gray-500">Readiness Score</div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-green-300 active:scale-[0.98]"
          onClick={() => scrollToSection(projectsRef)}
        >
          <CardContent className="py-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {completedCount}
              </div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
            inProgressCount > 0
              ? "border-2 border-orange-300 hover:border-orange-400"
              : "hover:border-yellow-300",
          )}
          onClick={() => scrollToSection(projectsRef)}
        >
          <CardContent className="py-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {inProgressCount}
              </div>
              <div className="text-xs text-gray-500">In Progress</div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-purple-300 active:scale-[0.98]"
          onClick={() => scrollToSection(milestonesRef)}
        >
          <CardContent className="py-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {progress?.resumeBulletsCount || 0}
              </div>
              <div className="text-xs text-gray-500">Resume Bullets</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dynamic CTA based on state */}
      {isNewUser ? (
        // New user CTA
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="text-5xl flex-shrink-0">🚀</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">
                  Ready to Get Started?
                </h3>
                <p className="text-gray-700 mb-4">
                  Complete guided projects to build your portfolio, generate
                  resume bullets, and prepare for interviews. Each project takes
                  4-8 hours.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600">✓</span>
                    <span>Step-by-step tutorials</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600">✓</span>
                    <span>Ready-to-use resume bullets</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600">✓</span>
                    <span>Prepared interview answers</span>
                  </div>
                </div>

                <Button size="lg" onClick={() => scrollToSection(projectsRef)}>
                  Start Your First Project →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : hasInProgress && inProgressProject ? (
        // In-progress user CTA
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-300">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="text-5xl flex-shrink-0">⚡</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">
                  Great Start! Keep Going!
                </h3>
                <p className="text-gray-700 mb-4">
                  You&apos;ve started the{" "}
                  <strong>{inProgressProject.title}</strong>. Complete it to
                  unlock your first resume bullets and interview prep materials.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-orange-200">
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                      {inProgressProject.completedSteps.length}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Steps Done</p>
                      <p className="text-xs text-gray-600">
                        of {inProgressProject.tutorialSteps.length} total
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold">
                      0
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-500">
                        Resume Bullets
                      </p>
                      <p className="text-xs text-gray-400">After completion</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold">
                      0
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-500">
                        Interview Q&A
                      </p>
                      <p className="text-xs text-gray-400">After completion</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link href={`/resume-ready/projects/${inProgressProject.id}`}>
                    <Button
                      size="lg"
                      className="bg-orange-600 hover:bg-orange-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                    >
                      Continue Your Project →
                    </Button>
                  </Link>
                  <Link href={`/resume-ready/projects/${inProgressProject.id}`}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-orange-300 text-orange-700 hover:bg-orange-50"
                    >
                      📊 View Tutorial Steps
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : completedCount > 0 ? (
        // Completed user CTA
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="text-5xl flex-shrink-0">🎉</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">
                  Great Progress! {completedCount} Project
                  {completedCount > 1 ? "s" : ""} Completed!
                </h3>
                <p className="text-gray-700 mb-4">
                  You&apos;ve earned {progress?.resumeBulletsCount || 0} resume
                  bullets.
                  {completedCount < 2 &&
                    " Complete another project to diversify your portfolio!"}
                </p>
                <div className="flex gap-3">
                  <Button
                    size="lg"
                    onClick={() => scrollToSection(projectsRef)}
                  >
                    {completedCount < 2
                      ? "Start Next Project"
                      : "View All Projects"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Progress Milestones */}
      <div ref={milestonesRef}>
        <h3 className="text-lg font-semibold mb-4">Your Journey</h3>

        <div className="space-y-4">
          {/* Milestone 1 */}
          <div
            className={cn(
              "flex items-start gap-4 transition-opacity",
              completedCount === 0 && inProgressCount === 0 && "opacity-60",
            )}
          >
            <div
              className={cn(
                "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all",
                completedCount >= 1
                  ? "bg-green-500 text-white"
                  : inProgressCount > 0
                    ? "bg-orange-500 text-white animate-pulse"
                    : "bg-gray-200 text-gray-500",
              )}
            >
              {completedCount >= 1 ? "✓" : "1"}
            </div>
            <div className="flex-1 pb-4 border-b border-gray-100">
              <h4 className="font-semibold">Complete First Project</h4>
              <p className="text-sm text-gray-600">
                Build a real ML/AI project and get your first resume bullets
              </p>
              {completedCount >= 1 ? (
                <Badge variant="success" className="mt-1">
                  Completed
                </Badge>
              ) : inProgressCount > 0 ? (
                <Badge variant="warning" className="mt-1">
                  In Progress
                </Badge>
              ) : null}
            </div>
          </div>

          {/* Milestone 2 */}
          <div
            className={cn(
              "flex items-start gap-4 transition-opacity",
              completedCount < 1 && "opacity-40",
            )}
          >
            <div
              className={cn(
                "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold",
                completedCount >= 2
                  ? "bg-green-500 text-white"
                  : completedCount === 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500",
              )}
            >
              {completedCount >= 2 ? "✓" : "2"}
            </div>
            <div className="flex-1 pb-4 border-b border-gray-100">
              <h4
                className={cn(
                  "font-semibold",
                  completedCount < 1 && "text-gray-500",
                )}
              >
                Complete Second Project
              </h4>
              <p
                className={cn(
                  "text-sm",
                  completedCount < 1 ? "text-gray-400" : "text-gray-600",
                )}
              >
                Diversify your portfolio and double your resume content
              </p>
              {completedCount >= 2 && (
                <Badge variant="success" className="mt-1">
                  Completed
                </Badge>
              )}
            </div>
          </div>

          {/* Milestone 3 */}
          <div
            className={cn(
              "flex items-start gap-4 transition-opacity",
              completedCount < 1 && "opacity-40",
            )}
          >
            <div
              className={cn(
                "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold",
                (progress?.totalQuestionsReviewed || 0) >= 6
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-500",
              )}
            >
              {(progress?.totalQuestionsReviewed || 0) >= 6 ? "✓" : "3"}
            </div>
            <div className="flex-1 pb-4 border-b border-gray-100">
              <h4
                className={cn(
                  "font-semibold",
                  completedCount < 1 && "text-gray-500",
                )}
              >
                Prepare Interview Answers
              </h4>
              <p
                className={cn(
                  "text-sm",
                  completedCount < 1 ? "text-gray-400" : "text-gray-600",
                )}
              >
                Review and practice answers to common interview questions
              </p>
              {(progress?.totalQuestionsReviewed || 0) >= 6 && (
                <Badge variant="success" className="mt-1">
                  Completed
                </Badge>
              )}
            </div>
          </div>

          {/* Final Milestone */}
          <div
            className={cn(
              "flex items-start gap-4 transition-opacity",
              completedCount < 2 && "opacity-40",
            )}
          >
            <div
              className={cn(
                "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl",
                progress?.status === "completed"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-500",
              )}
            >
              {progress?.status === "completed"
                ? "🎉"
                : completedCount < 2
                  ? "🔒"
                  : "4"}
            </div>
            <div className="flex-1">
              <h4
                className={cn(
                  "font-semibold",
                  completedCount < 2 && "text-gray-500",
                )}
              >
                Resume Ready!
              </h4>
              <p
                className={cn(
                  "text-sm",
                  completedCount < 2 ? "text-gray-400" : "text-gray-600",
                )}
              >
                Start applying to jobs with confidence
              </p>
              {progress?.status === "completed" && (
                <Button size="sm" className="mt-2">
                  View Your Resume
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interview Prep Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Interview Preparation
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Practice behavioral and technical questions to ace your interviews.
        </p>

        <Link href="/resume-ready/interview-prep">
          <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.01] hover:border-indigo-300 group">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform">
                  🎯
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-indigo-600 transition-colors">
                    Behavioral Questions
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    16 must-know questions with STAR-format answers, practice
                    timer, and personal notes.
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      16 Questions
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      STAR Format
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Practice Timer
                    </Badge>
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all flex-shrink-0">
                  →
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Cover Letter Guide Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Application Materials
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Guides and templates to help you craft compelling application
          materials.
        </p>

        <Link href="/resume-ready/cover-letter-guide">
          <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.01] hover:border-green-300 group">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform">
                  📝
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-green-600 transition-colors">
                    Cover Letter Writing Guide
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Complete guide with templates for startups, big tech, and
                    research labs. Includes examples using your ML projects.
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      3 Templates
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Company Research Tips
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Common Mistakes
                    </Badge>
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all flex-shrink-0">
                  →
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Projects Grid */}
      <div ref={projectsRef}>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Guided Projects
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Complete these projects to build your portfolio, get resume bullets,
          and prepare for interviews.
        </p>

        {projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">
                No projects available yet. Check back soon!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* Expert Help CTA */}
      <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200 shadow-xl overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="text-6xl flex-shrink-0">👨‍💼</div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Need Expert Guidance?</h3>
              <p className="text-gray-700 mb-6">
                Stuck on a project? Want personalized feedback on your resume?
                Book a 1-on-1 call with our experts for tailored advice.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-blue-400 transition-all cursor-pointer">
                  <div className="text-2xl mb-2">📝</div>
                  <h4 className="font-semibold mb-1">Resume Review</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Expert feedback on your resume and project descriptions
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-blue-600">
                      $50
                    </span>
                    <span className="text-sm text-gray-500">/30 min</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-blue-400 transition-all cursor-pointer">
                  <div className="text-2xl mb-2">🎤</div>
                  <h4 className="font-semibold mb-1">Mock Interview</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Practice with real interview questions and get feedback
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-blue-600">
                      $50
                    </span>
                    <span className="text-sm text-gray-500">/30 min</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border-2 border-green-500 hover:border-green-600 transition-all cursor-pointer relative overflow-hidden">
                  <div className="absolute -right-8 top-3 bg-green-500 text-white text-xs font-bold py-1 px-8 rotate-45 shadow">
                    POPULAR
                  </div>
                  <div className="text-2xl mb-2">💼</div>
                  <h4 className="font-semibold mb-1">Full Package</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Resume review + mock interview + career strategy
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-green-600">
                      $120
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      $150
                    </span>
                  </div>
                  <Badge variant="success" className="mt-2">
                    Save $30
                  </Badge>
                </div>
              </div>

              <a
                href="https://calendly.com/polarisaistudio/introduction-call"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                >
                  📅 Book a Call →
                </Button>
              </a>

              {/* Social proof */}
              <div className="mt-6 flex items-center gap-3 text-sm">
                <div className="flex -space-x-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow">
                    JL
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow">
                    MK
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow">
                    SW
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">
                    12+ students coached this month
                  </p>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <span>⭐⭐⭐⭐⭐</span>
                    <span className="text-gray-600 text-xs ml-1">
                      5.0 average rating
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
