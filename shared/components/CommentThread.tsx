import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth, useUser, SignInButton, useClerk } from '@clerk/react';
import { saveReturnUrl } from '../lib/auth';
import { API_ENDPOINTS } from '../lib/config';
import styled from 'styled-components';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Comment {
  id: string;
  userId: string;
  canonicalId: string | null;
  alertKey: string | null;
  body: string;
  magnitude: number | null;
  magnitudeUpperLimit: number | null;
  filter: string | null;
  midTimeSec: number | null;
  telescope: string | null;
  imageUrls: string[] | null;
  createdAt: string;
  user: { displayName: string | null; institution: string | null };
}

interface Props {
  canonicalId?: string;
  alertKey?: string;
  compact?: boolean;
}

// ── Styled ────────────────────────────────────────────────────────────────────

const Container = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
`;

const Title = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 1.25rem;
`;

const CommentCard = styled.div`
  padding: 0.9rem 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 0.75rem;
`;

const CommentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
`;

const CommentAuthor = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.75);
`;

const CommentInstitution = styled.span`
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.35);
`;

const CommentTime = styled.span`
  font-size: 0.76rem;
  color: rgba(255, 255, 255, 0.28);
  margin-left: auto;
`;

const CommentBody = styled.p`
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.75);
  margin: 0 0 0.4rem;
  line-height: 1.55;
  white-space: pre-wrap;
`;

const PhotometryBadge = styled.div`
  display: inline-flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-top: 0.4rem;
`;

const Badge = styled.span`
  font-size: 0.72rem;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  background: rgba(139, 92, 246, 0.15);
  color: rgba(167, 139, 250, 0.9);
  border: 1px solid rgba(139, 92, 246, 0.25);
`;

const DeleteBtn = styled.button`
  font-size: 0.72rem;
  color: rgba(239, 68, 68, 0.5);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  &:hover { color: rgba(239, 68, 68, 0.9); }
`;

const Form = styled.form`
  margin-top: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.75rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.88rem;
  resize: vertical;
  outline: none;
  font-family: inherit;
  &:focus { border-color: rgba(139, 92, 246, 0.5); }
  box-sizing: border-box;
`;

const PhotometryToggle = styled.button`
  font-size: 0.78rem;
  color: rgba(139, 92, 246, 0.7);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-align: left;
  &:hover { color: rgba(167, 139, 250, 0.9); }
`;

const PhotometryFields = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.65rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.82rem;
  outline: none;
  &:focus { border-color: rgba(139, 92, 246, 0.5); }
  box-sizing: border-box;
  &::placeholder { color: rgba(255,255,255,0.25); }
`;

const SubmitBtn = styled.button`
  align-self: flex-start;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.4);
  color: rgba(167, 139, 250, 0.95);
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 500;
  &:hover { background: rgba(139, 92, 246, 0.35); }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
`;

const SignInPrompt = styled.div`
  font-size: 0.84rem;
  color: rgba(255, 255, 255, 0.35);
  padding: 0.75rem 0;
`;

const EmptyState = styled.div`
  font-size: 0.84rem;
  color: rgba(255, 255, 255, 0.25);
  padding: 0.5rem 0;
`;

const ImageRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const CommentImage = styled.img`
  max-width: 200px;
  max-height: 150px;
  border-radius: 6px;
  object-fit: cover;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  &:hover { border-color: rgba(139, 92, 246, 0.5); }
`;

const ImagePickerBtn = styled.button`
  font-size: 0.78rem;
  color: rgba(139, 92, 246, 0.7);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-align: left;
  &:hover { color: rgba(167, 139, 250, 0.9); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const ThumbRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ThumbWrap = styled.div`
  position: relative;
  display: inline-block;
`;

const Thumb = styled.img`
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ThumbRemove = styled.button`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.85);
  border: none;
  color: white;
  font-size: 0.65rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  &:hover { background: rgba(239, 68, 68, 1); }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
const UUID_PREFIX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/i;

// Recover a display name + type from a stored attachment URL. Object keys are
// `<uuid>-<original-name>.<ext>`, so strip the query/hash, take the basename,
// and drop the UUID prefix to reveal the human filename.
function parseAttachment(url: string): { filename: string; ext: string; isImage: boolean } {
  const clean = url.split(/[?#]/)[0];
  const ext = clean.split('.').pop()?.toLowerCase() ?? '';
  const base = decodeURIComponent(clean.split('/').pop() ?? clean);
  const filename = base.replace(UUID_PREFIX, '') || ext.toUpperCase() || 'file';
  return { filename, ext, isImage: IMAGE_EXTS.includes(ext) };
}

const fileLinkStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
  padding: '0.3rem 0.65rem', borderRadius: 6,
  background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)',
  color: 'rgba(167,139,250,0.85)', fontSize: '0.75rem', textDecoration: 'none',
  maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
};

// Renders one stored attachment: inline image (with a real filename tooltip),
// falling back to a labelled download link if it's not an image or fails to load.
function CommentAttachment({ url }: { url: string }) {
  const [failed, setFailed] = useState(false);
  const { filename, isImage } = parseAttachment(url);

  if (isImage && !failed) {
    return (
      <CommentImage
        src={url}
        alt={filename}
        title={filename}
        onClick={() => window.open(url, '_blank')}
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" download={filename} title={filename} style={fileLinkStyle}>
      ↓ {filename}
    </a>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export const CommentThread: React.FC<Props> = ({ canonicalId, alertKey, compact = false }) => {
  const { getToken, userId, isSignedIn } = useAuth();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const qc = useQueryClient();
  const [body, setBody] = useState('');
  const [showPhot, setShowPhot] = useState(false);
  const [phot, setPhot] = useState({ magnitude: '', magnitudeUpperLimit: '', filter: '', midTimeSec: '', telescope: '' });
  const [pendingFiles, setPendingFiles] = useState<{ url: string; name: string; isImage: boolean }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryKey = ['comments', canonicalId ?? alertKey];

  const { data: comments = [], isLoading } = useQuery<Comment[]>({
    queryKey,
    queryFn: async () => {
      const url = (API_ENDPOINTS.comments as any)({ canonicalId, alertKey });
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load comments');
      return res.json();
    },
  });

  const uploadFileMut = useMutation({
    mutationFn: async (file: File) => {
      const token = await getToken();
      const form = new FormData();
      form.append('image', file);
      const res = await fetch(API_ENDPOINTS.uploadCommentFile, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any).error || 'Upload failed');
      }
      return res.json() as Promise<{ url: string; name: string; isImage: boolean }>;
    },
    onSuccess: (data) => {
      setPendingFiles(prev => [...prev, data]);
    },
  });

  const createMut = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const res = await fetch(API_ENDPOINTS.createComment, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          canonicalId, alertKey, body: body.trim(),
          magnitude: phot.magnitude ? parseFloat(phot.magnitude) : null,
          magnitudeUpperLimit: phot.magnitudeUpperLimit ? parseFloat(phot.magnitudeUpperLimit) : null,
          filter: phot.filter || null,
          midTimeSec: phot.midTimeSec ? parseFloat(phot.midTimeSec) : null,
          telescope: phot.telescope || null,
          imageUrls: pendingFiles.length > 0 ? pendingFiles.map(f => f.url) : null,
        }),
      });
      if (!res.ok) throw new Error('Failed to post comment');
      return res.json();
    },
    onSuccess: () => {
      setBody('');
      setPhot({ magnitude: '', magnitudeUpperLimit: '', filter: '', midTimeSec: '', telescope: '' });
      setShowPhot(false);
      setPendingFiles([]);
      qc.invalidateQueries({ queryKey });
    },
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      const res = await fetch((API_ENDPOINTS.deleteComment as any)(id), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete comment');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  return (
    <Container style={compact ? { padding: '1rem', marginTop: '0' } : undefined}>
      <Title style={compact ? { fontSize: '0.75rem', marginBottom: '0.75rem' } : undefined}>
        Discussion ({comments.length})
      </Title>

      {isLoading && <EmptyState>Loading…</EmptyState>}

      {!isLoading && comments.length === 0 && (
        <EmptyState>{compact ? 'No comments yet.' : 'No comments yet. Be the first to share an observation.'}</EmptyState>
      )}

      {comments.map(c => (
        <CommentCard key={c.id} style={compact ? { padding: '0.6rem 0.75rem', marginBottom: '0.5rem' } : undefined}>
          <CommentMeta>
            <CommentAuthor>{c.user.displayName || 'Anonymous'}</CommentAuthor>
            {c.user.institution && <CommentInstitution>· {c.user.institution}</CommentInstitution>}
            <CommentTime>{formatTime(c.createdAt)}</CommentTime>
          </CommentMeta>
          <CommentBody>{c.body}</CommentBody>
          {(c.magnitude != null || c.magnitudeUpperLimit != null || c.filter || c.midTimeSec != null || c.telescope) && (
            <PhotometryBadge>
              {c.magnitude != null && <Badge>mag {c.magnitude}</Badge>}
              {c.magnitudeUpperLimit != null && <Badge>&gt; {c.magnitudeUpperLimit}</Badge>}
              {c.filter && <Badge>{c.filter}</Badge>}
              {c.midTimeSec != null && <Badge>T+{c.midTimeSec}s</Badge>}
              {c.telescope && <Badge>{c.telescope}</Badge>}
            </PhotometryBadge>
          )}
          {c.imageUrls && c.imageUrls.length > 0 && (
            <ImageRow>
              {c.imageUrls.map((url, i) => (
                <CommentAttachment key={i} url={url} />
              ))}
            </ImageRow>
          )}
          {userId === c.userId && (
            <div style={{ marginTop: '0.4rem' }}>
              <DeleteBtn onClick={() => deleteMut.mutate(c.id)}>Delete</DeleteBtn>
            </div>
          )}
        </CommentCard>
      ))}

      {isSignedIn ? (
        <Form onSubmit={e => { e.preventDefault(); if (body.trim()) createMut.mutate(); }}
          style={compact ? { marginTop: '0.75rem', gap: '0.5rem' } : undefined}>
          <Textarea
            style={compact ? { minHeight: '60px', fontSize: '0.82rem' } : undefined}
            placeholder={`Share an observation or note as ${user?.firstName || 'yourself'}…`}
            value={body}
            onChange={e => setBody(e.target.value)}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.gif,.webp,.fits,.fit,.fts,.txt,.csv,.dat,.pdf"
            style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) uploadFileMut.mutate(file);
              e.target.value = '';
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <ImagePickerBtn
              type="button"
              disabled={uploadFileMut.isPending}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadFileMut.isPending ? 'Uploading…' : '+ Attach file'}
            </ImagePickerBtn>
            {uploadFileMut.isError && (
              <span style={{ fontSize: '0.75rem', color: 'rgba(239,68,68,0.8)' }}>
                {(uploadFileMut.error as Error).message}
              </span>
            )}
          </div>
          {pendingFiles.length > 0 && (
            <ThumbRow>
              {pendingFiles.map((f, i) => (
                <ThumbWrap key={i}>
                  {f.isImage ? (
                    <Thumb src={f.url} alt={f.name} />
                  ) : (
                    <div style={{
                      width: 64, height: 64, borderRadius: 6,
                      background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      padding: '0.25rem', overflow: 'hidden',
                    }}>
                      <span style={{ fontSize: '0.6rem', color: 'rgba(167,139,250,0.8)', textAlign: 'center', wordBreak: 'break-all', lineHeight: 1.2 }}>
                        {f.name}
                      </span>
                    </div>
                  )}
                  <ThumbRemove type="button" onClick={() => setPendingFiles(prev => prev.filter((_, j) => j !== i))}>
                    ×
                  </ThumbRemove>
                </ThumbWrap>
              ))}
            </ThumbRow>
          )}
          <PhotometryToggle type="button" onClick={() => setShowPhot(v => !v)}>
            {showPhot ? '− Hide photometry fields' : '+ Add photometry data'}
          </PhotometryToggle>
          {showPhot && (
            <PhotometryFields>
              <Input placeholder="Magnitude" value={phot.magnitude} onChange={e => setPhot(p => ({ ...p, magnitude: e.target.value }))} />
              <Input placeholder="Upper limit" value={phot.magnitudeUpperLimit} onChange={e => setPhot(p => ({ ...p, magnitudeUpperLimit: e.target.value }))} />
              <Input placeholder="Filter (r, g, R…)" value={phot.filter} onChange={e => setPhot(p => ({ ...p, filter: e.target.value }))} />
              <Input placeholder="T+ seconds" value={phot.midTimeSec} onChange={e => setPhot(p => ({ ...p, midTimeSec: e.target.value }))} />
              <Input placeholder="Telescope" value={phot.telescope} onChange={e => setPhot(p => ({ ...p, telescope: e.target.value }))} />
            </PhotometryFields>
          )}
          <SubmitBtn type="submit" disabled={!body.trim() || createMut.isPending}>
            {createMut.isPending ? 'Posting…' : 'Post comment'}
          </SubmitBtn>
        </Form>
      ) : (
        <div style={{ marginTop: compact ? '0.75rem' : '1.25rem' }}>
          <Textarea
            placeholder="Sign in to leave a comment or share photometry data…"
            readOnly
            onClick={() => { saveReturnUrl(); openSignIn({ forceRedirectUrl: window.location.href }); }}
            style={{ cursor: 'pointer', opacity: 0.5, minHeight: compact ? '60px' : undefined, fontSize: compact ? '0.82rem' : undefined }}
          />
          <SignInPrompt style={{ marginTop: '0.5rem' }}>
            <SignInButton mode="modal" forceRedirectUrl={typeof window !== 'undefined' ? window.location.href : '/'}>
              <button onClick={saveReturnUrl} style={{ background: 'none', border: 'none', color: 'rgba(167,139,250,0.8)', cursor: 'pointer', fontSize: '0.84rem', padding: 0 }}>
                Sign in
              </button>
            </SignInButton>
            {' '}to leave a comment or share photometry data.
          </SignInPrompt>
        </div>
      )}
    </Container>
  );
};
