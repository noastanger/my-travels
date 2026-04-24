import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTravelsStore } from '../store/useTravelsStore';
import { usePlacesStore } from '../store/usePlacesStore';
import { fetchPostPreviews, parseUrls, PostPreview } from '../lib/oembed';
import { PostReviewCard } from '../components/import/PostReviewCard';
import { Button } from '../components/ui/Button';
import { ChevronLeft, Link2, Sparkles } from 'lucide-react';
import { generateId } from '../lib/utils';

interface ReviewPost {
  post: PostPreview;
  selected: boolean;
  locationOverride: string;
}

export function ImportPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const travels = useTravelsStore((s) => s.travels);
  const addPlace = usePlacesStore((s) => s.addPlace);

  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [reviewPosts, setReviewPosts] = useState<ReviewPost[]>([]);
  const [selectedTravelId, setSelectedTravelId] = useState<string>('');
  const [imported, setImported] = useState(false);

  // Pre-fill from share target query params
  useEffect(() => {
    const sharedUrl = searchParams.get('url') || searchParams.get('text') || '';
    if (sharedUrl) setUrlInput(sharedUrl);
  }, [searchParams]);

  // Pre-select travel from query param, then fall back to first travel
  useEffect(() => {
    if (travels.length === 0) return;
    const paramId = searchParams.get('travelId');
    if (paramId && travels.find((t) => t.id === paramId)) {
      setSelectedTravelId(paramId);
    } else if (!selectedTravelId) {
      setSelectedTravelId(travels[0].id);
    }
  }, [travels, searchParams]);

  async function handleFetch() {
    const urls = parseUrls(urlInput);
    if (urls.length === 0) return;
    setLoading(true);
    setReviewPosts([]);
    const previews = await fetchPostPreviews(urls);
    setReviewPosts(previews.map((post) => ({ post, selected: true, locationOverride: '' })));
    setLoading(false);
  }

  function togglePost(idx: number) {
    setReviewPosts((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, selected: !p.selected } : p))
    );
  }

  function setLocation(idx: number, val: string) {
    setReviewPosts((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, locationOverride: val } : p))
    );
  }

  function handleImport() {
    const travel = travels.find((t) => t.id === selectedTravelId);
    if (!travel) return;

    const toImport = reviewPosts.filter((p) => p.selected);
    toImport.forEach(({ post, locationOverride }) => {
      addPlace({
        travelId: travel.id,
        name: locationOverride || post.title || post.authorName || 'Imported place',
        source: post.platform === 'tiktok' ? 'tiktok' : post.platform === 'youtube' ? 'other' : 'instagram',
        url: post.url,
        notes: post.authorName ? `@${post.authorName}` : undefined,
        lat: travel.centerLat,
        lng: travel.centerLng,
      });
    });

    setImported(true);
    setTimeout(() => navigate(`/travels/${travel.id}`), 1200);
  }

  const selectedCount = reviewPosts.filter((p) => p.selected).length;

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-4">
          <Button
            variant="ghost"
            className="h-8 gap-1.5 px-3 text-xs"
            onClick={() => {
              const paramId = searchParams.get('travelId');
              navigate(paramId ? `/travels/${paramId}` : '/');
            }}
          >
            <ChevronLeft size={14} /> Back
          </Button>
          <div className="flex items-center gap-2">
            <Link2 size={16} className="text-indigo-400" />
            <h1 className="text-sm font-bold text-white">Import from link</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8 space-y-6">

        {/* URL input */}
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-5 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Paste post links</h2>
            <p className="text-xs text-slate-400 mt-1">
              Paste one or more Instagram or TikTok post URLs — one per line. Works for any public post you've saved.
            </p>
          </div>

          <textarea
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder={`https://www.instagram.com/p/abc123/\nhttps://www.tiktok.com/@user/video/123456\nhttps://www.instagram.com/reel/xyz789/`}
            rows={5}
            className="w-full resize-none rounded-xl bg-slate-800 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 font-mono outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />

          <Button
            onClick={handleFetch}
            loading={loading}
            disabled={!urlInput.trim()}
            className="w-full py-3"
          >
            <Sparkles size={15} />
            {loading ? 'Fetching previews…' : 'Preview posts'}
          </Button>
        </div>

        {/* Review grid */}
        {reviewPosts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">
                Review posts
                <span className="ml-2 text-xs font-normal text-slate-400">
                  {selectedCount} of {reviewPosts.length} selected
                </span>
              </h2>
              <button
                onClick={() =>
                  setReviewPosts((prev) =>
                    prev.map((p) => ({ ...p, selected: selectedCount < prev.length }))
                  )
                }
                className="text-xs text-indigo-400 hover:underline cursor-pointer"
              >
                {selectedCount < reviewPosts.length ? 'Select all' : 'Deselect all'}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {reviewPosts.map((rp, idx) => (
                <PostReviewCard
                  key={rp.post.url}
                  post={rp.post}
                  selected={rp.selected}
                  onToggle={() => togglePost(idx)}
                  locationOverride={rp.locationOverride}
                  onLocationChange={(val) => setLocation(idx, val)}
                />
              ))}
            </div>

            {/* Travel selector + import */}
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Add to travel
                </label>
                {travels.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    No travels yet.{' '}
                    <button onClick={() => navigate('/')} className="text-indigo-400 underline cursor-pointer">
                      Create one first
                    </button>
                  </p>
                ) : (
                  <select
                    value={selectedTravelId}
                    onChange={(e) => setSelectedTravelId(e.target.value)}
                    className="w-full rounded-xl bg-slate-800 border border-white/10 px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                  >
                    {travels.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.coverEmoji ?? '✈️'} {t.city}, {t.country}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <Button
                onClick={handleImport}
                disabled={selectedCount === 0 || !selectedTravelId || imported}
                className="w-full py-3 text-sm font-semibold"
              >
                {imported
                  ? `✓ Imported! Opening map…`
                  : `Import ${selectedCount} place${selectedCount !== 1 ? 's' : ''} to map`}
              </Button>

              <p className="text-center text-xs text-slate-500">
                Places will be added to the travel map. You can reposition them by clicking on the map.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
