"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface Project {
  id: string;
  title: string;
  resumeBullets: {
    technical: string[];
    impact: string[];
    fullStack: string[];
  };
}

interface ProjectData {
  project: Project;
  completion: {
    status: string;
    selectedResumeStyle?: string;
  };
}

type BulletStyle = "technical" | "impact" | "fullStack";

const STYLE_INFO: Record<BulletStyle, { name: string; description: string }> = {
  technical: {
    name: "Technical Focus",
    description: "Emphasizes technical skills and implementation details",
  },
  impact: {
    name: "Impact Focus",
    description: "Highlights business outcomes and measurable results",
  },
  fullStack: {
    name: "Full Stack Focus",
    description: "Shows end-to-end development capabilities",
  },
};

export default function ResumeBulletsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState<BulletStyle>("technical");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(
          `/api/resume-ready/project-completion/${id}`,
        );
        if (response.ok) {
          const result = await response.json();
          setData(result);
          if (result.completion?.selectedResumeStyle) {
            setSelectedStyle(
              result.completion.selectedResumeStyle as BulletStyle,
            );
          }
        }
      } catch (err) {
        console.error("Failed to fetch project:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id]);

  async function copyToClipboard(bulletIndex?: number) {
    if (!data) return;
    const bullets = data.project.resumeBullets[selectedStyle];
    const textToCopy =
      bulletIndex !== undefined
        ? bullets[bulletIndex]
        : bullets.map((b) => `• ${b}`).join("\n");
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Project not found</p>
          <Link
            href="/resume-ready/projects"
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const { project } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
          Home
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link
          href="/stages/resume-ready"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Resume Ready
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link
          href={`/resume-ready/projects/${id}`}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {project.title}
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-sm text-gray-900">Resume Bullets</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Resume Bullets
        </h1>
        <p className="text-lg text-gray-600">
          Choose a style that best fits your target role and copy to your
          resume.
        </p>
      </div>

      {/* Style Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Bullet Style
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.keys(STYLE_INFO) as BulletStyle[]).map((style) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`p-4 rounded-lg border-2 text-left transition-colors ${
                selectedStyle === style
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="font-medium text-gray-900">
                {STYLE_INFO[style].name}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {STYLE_INFO[style].description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bullet Display */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Resume Bullets</CardTitle>
            <button
              onClick={() => copyToClipboard()}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                copied
                  ? "bg-green-600 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {copied ? "Copied!" : "Copy All"}
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {project.resumeBullets[selectedStyle].map((bullet, index) => (
              <div
                key={index}
                className="group p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-blue-500 font-bold mt-0.5">•</span>
                  <p className="text-gray-900 leading-relaxed flex-1">
                    {bullet}
                  </p>
                  <button
                    onClick={() => copyToClipboard(index)}
                    className="opacity-0 group-hover:opacity-100 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-all"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Bullets Preview */}
      <Card>
        <CardHeader>
          <CardTitle>All Bullet Styles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {(Object.keys(STYLE_INFO) as BulletStyle[]).map((style) => (
              <div key={style}>
                <h4 className="font-medium text-gray-900 mb-2">
                  {STYLE_INFO[style].name}
                </h4>
                <ul className="space-y-2">
                  {project.resumeBullets[style].map((bullet, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-600 p-3 bg-gray-50 rounded border border-gray-200 flex items-start gap-2"
                    >
                      <span className="text-gray-400">•</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <Link
          href={`/resume-ready/projects/${id}`}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Tutorial
        </Link>
        <Link
          href={`/resume-ready/projects/${id}/interview`}
          className="text-blue-600 hover:text-blue-800"
        >
          Interview Prep →
        </Link>
      </div>
    </div>
  );
}
