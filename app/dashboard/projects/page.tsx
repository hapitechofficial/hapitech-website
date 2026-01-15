'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BackButton from '@/components/BackButton';

interface PosterProject {
  id: string;
  brandName: string;
  campaignMode: string;
  canvasType: string;
  createdAt: string;
  generatedPosterUrl: string;
}

export default function Projects() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<PosterProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchProjects();
    }
  }, [session]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/user/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <p className="text-charcoal text-lg">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <BackButton />
        <h1 className="text-4xl font-bold text-charcoal mb-8">My Projects</h1>

        {projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-charcoal text-lg mb-4">No poster projects yet.</p>
            <button
              onClick={() => router.push('/tools/poster-generator')}
              className="px-6 py-2 bg-magenta text-white font-semibold rounded-lg hover:bg-opacity-90 transition"
            >
              Create Your First Poster
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                {project.generatedPosterUrl && (
                  <img
                    src={project.generatedPosterUrl}
                    alt={project.brandName}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-charcoal mb-2">{project.brandName}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    <strong>Type:</strong> {project.campaignMode}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    <strong>Size:</strong> {project.canvasType}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}