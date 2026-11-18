import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth, useClerk } from '@clerk/react';
import { Navbar } from '@novatrace/components/Navbar';
import { saveReturnUrl } from '@shared/lib/auth';
import { API_ENDPOINTS } from '@shared/lib/config';
import * as S from '@novatrace/styled_pages/GoldSet.styled';

/* The gold set: signed-in users read a GCN Circular and record every value it reports for five
 * fields, or "not reported", without seeing what Starithm or Claude extracted. Two agreeing people
 * make a value gold; against it we measure right, missed and false values. Only after submitting
 * does the page show how Starithm and Claude read the same circular (the server records that, so a
 * later edit is marked as no longer blind). API: novatrace_microservice /api/gold/*. */

type Field = 'redshift' | 'duration' | 'fluence' | 'magnitude' | 'position';
type Choice = 'reported' | 'none' | 'unsure' | null;
type Row = Record<string, string>;
type Value = Record<string, unknown>;
type Circular = { circular: number; decade: string; subject: string | null; body: string; created_on?: string | null; answered_by: number };
type Answer = { field: Field; reported: boolean; values: Value[]; unsure: boolean; note: string | null };
type Compare = { mine: Answer[]; claude: { reported: Record<string, boolean>; values: Value[] } | null; ours: Record<string, Value[]> | null };
type Stats = { circulars: number; answered_once: number; answered_twice: number; checkers: number; mine?: number };

type Col = { key: string; label: string; span?: number; number?: boolean; options?: [string, string][]; placeholder?: string };

const KIND: [string, string][] = [['measurement', 'Measurement'], ['upper_limit', 'Upper limit (<)'], ['lower_limit', 'Lower limit (>)']];
const AS_WRITTEN: Col = { key: 'value_as_written', label: 'As written in the circular', span: 4, placeholder: 'Copy the words or the table row' };

const FIELDS: { field: Field; name: string; question: string; cols: Col[] }[] = [
  { field: 'redshift', name: 'Redshift', question: 'Does it report a redshift (a value or a limit)?', cols: [
    AS_WRITTEN,
    { key: 'value', label: 'Value', number: true, placeholder: '2.8' },
    { key: 'error', label: 'Error', number: true, placeholder: 'none' },
    { key: 'kind', label: 'Kind', options: KIND },
    { key: 'redshift_type', label: 'Whose redshift', options: [
      ['burst', "The burst's own"], ['host_catalogue', 'Host galaxy (catalogue photo-z)'], ['pseudo', 'Pseudo-redshift (from the burst spectrum)'],
      ['absorber', 'Absorber in front'], ['other', 'A candidate or other source'],
    ] },
    { key: 'object_name', label: 'Object', span: 2, placeholder: 'GRB 140419A' },
    { key: 'instrument', label: 'Instrument', span: 2 },
  ] },
  { field: 'duration', name: 'Duration (T90)', question: 'Does it report a burst duration (T90, T50, or a stated length)?', cols: [
    AS_WRITTEN,
    { key: 'value', label: 'Value (s)', number: true, placeholder: '23.4' },
    { key: 'error', label: 'Error (s)', number: true },
    { key: 'band', label: 'Energy band', placeholder: '15-350 keV' },
    { key: 'instrument', label: 'Instrument', placeholder: 'Swift-BAT' },
  ] },
  { field: 'fluence', name: 'Fluence', question: 'Does it report a fluence?', cols: [
    AS_WRITTEN,
    { key: 'value', label: 'Value, in full', number: true, placeholder: '1.42e-6' },
    { key: 'error', label: 'Error', number: true, placeholder: '0.05e-6' },
    { key: 'unit', label: 'Unit', placeholder: 'erg/cm2' },
    { key: 'band', label: 'Energy band', placeholder: '10-1000 keV' },
    { key: 'instrument', label: 'Instrument', span: 4, placeholder: 'Fermi-GBM' },
  ] },
  { field: 'magnitude', name: 'Magnitude', question: 'Does it report a magnitude or a magnitude limit? One row per measurement.', cols: [
    AS_WRITTEN,
    { key: 'value', label: 'Magnitude', number: true, placeholder: '16.01' },
    { key: 'error', label: 'Error', number: true, placeholder: '0.06' },
    { key: 'kind', label: 'Kind', options: KIND },
    { key: 'band', label: 'Filter', placeholder: 'r, wh, clear' },
    { key: 'unit', label: 'System', placeholder: 'AB, Vega, as written' },
    { key: 'time', label: 'Time (as written)', placeholder: 'T0+96 s' },
    { key: 'instrument', label: 'Telescope', span: 2 },
  ] },
  { field: 'position', name: 'Position', question: 'Does it report a sky position (RA, Dec)?', cols: [
    AS_WRITTEN,
    { key: 'ra', label: 'RA (as written)', placeholder: '139.90347' },
    { key: 'dec', label: 'Dec (as written)', placeholder: '+12.63779' },
    { key: 'position_error', label: 'Uncertainty (as written)', span: 2, placeholder: '2.5 arcsec, 90%' },
    { key: 'instrument', label: 'Instrument', span: 2 },
    { key: 'object_name', label: 'Object', span: 2 },
  ] },
];

const blankRow = (field: Field): Row => (field === 'redshift' ? { kind: 'measurement', redshift_type: 'burst' } : field === 'magnitude' ? { kind: 'measurement' } : {});
type FormState = Record<Field, { choice: Choice; rows: Row[] }>;
const emptyForm = (): FormState => Object.fromEntries(FIELDS.map((f) => [f.field, { choice: null, rows: [] }])) as unknown as FormState;

const PROFILE_SKIP_KEY = 'goldset.profile.skipped';
const lsGet = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const lsSet = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* private window: fine */ } };

// Agreement used only for the after-submit view; the published measure is computed offline.
const close = (field: Field, a: number, b: number) =>
  field === 'redshift' ? Math.abs(a - b) <= 0.01 : field === 'magnitude' ? Math.abs(a - b) <= 0.05 : b !== 0 && Math.abs(a / b - 1) <= 0.1;
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : typeof v === 'string' && v.trim() && Number.isFinite(Number(v)) ? Number(v) : null);

function show(field: Field, v: Value): string {
  if (field === 'position') return [v.ra, v.dec].filter((x) => x != null && x !== '').join(', ') + (v.position_error ? ` ± ${v.position_error}` : '');
  const value = v.norm_value ?? v.value;
  const prefix = v.kind === 'upper_limit' ? (field === 'magnitude' ? '> ' : '< ') : v.kind === 'lower_limit' ? (field === 'magnitude' ? '< ' : '> ') : '';
  const unit = v.norm_value != null ? v.norm_unit : v.unit;
  const bits = [`${prefix}${value ?? v.value_as_written ?? '?'}`, v.error != null && v.error !== '' ? `± ${v.error}` : '', unit ?? '', v.band ? `(${v.band})` : ''];
  return bits.filter(Boolean).join(' ');
}

/** How a system's values for one field compare with the checker's. */
function verdict(field: Field, mine: Answer | undefined, theirs: Value[] | null | undefined) {
  if (theirs == null) return { tone: 'none' as const, text: 'Not extracted yet' };
  const minePresent = !!mine?.reported && (mine?.values.length ?? 0) > 0;
  if (!minePresent && !theirs.length) return { tone: 'match' as const, text: mine?.unsure ? 'None found (you were unsure)' : 'Agrees: not reported' };
  if (minePresent && !theirs.length) return { tone: 'miss' as const, text: 'Not found: a likely miss' };
  if (!minePresent) return { tone: 'extra' as const, text: `Has ${theirs.length} value${theirs.length > 1 ? 's' : ''} you didn't record` };
  if (field === 'position') return { tone: 'match' as const, text: 'Both report a position' };
  const ys = mine!.values.map((v) => num(v.value)).filter((x): x is number => x != null);
  const ts = theirs.map((v) => num(v.norm_value ?? v.value)).filter((x): x is number => x != null);
  const hit = ys.filter((y) => ts.some((t) => close(field, y, t))).length;
  return { tone: hit === ys.length ? ('match' as const) : ('miss' as const), text: `${hit} of ${ys.length} of your values match` };
}

export default function GoldSetPage() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { openSignIn } = useClerk();
  const [stats, setStats] = useState<Stats | null>(null);
  const [circ, setCirc] = useState<Circular | null | undefined>(undefined); // undefined = loading, null = none left
  const [form, setForm] = useState<FormState>(emptyForm);
  const [note, setNote] = useState('');
  const [view, setView] = useState<'check' | 'results'>('check');
  const [compare, setCompare] = useState<Compare | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [profile, setProfile] = useState<'ask' | 'done'>('done');
  const [expertise, setExpertise] = useState('');
  const [credit, setCredit] = useState(false);
  const skipped = useRef<number[]>([]);
  const started = useRef(Date.now());

  const api = useCallback(async (url: string, init?: RequestInit) => {
    const token = isSignedIn ? await getToken() : null;
    const res = await fetch(url, { ...init, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(init?.headers ?? {}) } });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`);
    return body;
  }, [isSignedIn, getToken]);

  const loadStats = useCallback(() => api(API_ENDPOINTS.goldStats).then(setStats).catch(() => {}), [api]);

  const loadNext = useCallback(async () => {
    setCirc(undefined); setError(null); setView('check'); setCompare(null);
    try {
      const { circular } = await api(API_ENDPOINTS.goldNext(skipped.current));
      setCirc(circular); setForm(emptyForm()); setNote(''); started.current = Date.now();
      window.scrollTo({ top: 0 });
    } catch (e) { setError((e as Error).message); setCirc(null); }
  }, [api]);

  useEffect(() => {
    if (!isLoaded) return;
    loadStats();
    if (!isSignedIn) return;
    loadNext();
    if (!lsGet(PROFILE_SKIP_KEY))
      api(API_ENDPOINTS.goldChecker).then(({ checker }) => setProfile(checker ? 'done' : 'ask')).catch(() => {});
  }, [isLoaded, isSignedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  const signIn = () => { saveReturnUrl(); openSignIn({ forceRedirectUrl: window.location.href }); };

  const setChoice = (field: Field, choice: Choice) => setForm((f) => ({
    ...f, [field]: { choice, rows: choice === 'none' ? [] : f[field].rows.length ? f[field].rows : choice === 'reported' ? [blankRow(field)] : [] },
  }));
  const setCell = (field: Field, i: number, key: string, v: string) => setForm((f) => ({
    ...f, [field]: { ...f[field], rows: f[field].rows.map((r, j) => (j === i ? { ...r, [key]: v } : r)) },
  }));
  const addRow = (field: Field) => setForm((f) => ({ ...f, [field]: { ...f[field], rows: [...f[field].rows, blankRow(field)] } }));
  const removeRow = (field: Field, i: number) => setForm((f) => ({ ...f, [field]: { ...f[field], rows: f[field].rows.filter((_, j) => j !== i) } }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!circ) return;
    const unanswered = FIELDS.filter((f) => !form[f.field].choice).map((f) => f.name);
    if (unanswered.length) return setError(`Answer every field: ${unanswered.join(', ')}. "Not reported" is an answer.`);
    const answers: Answer[] = [];
    for (const f of FIELDS) {
      const { choice, rows } = form[f.field];
      const values = rows
        .filter((r) => Object.entries(r).some(([k, v]) => k !== 'kind' && k !== 'redshift_type' && v?.trim()))
        .map((r) => Object.fromEntries(f.cols.map((c) => [c.key, c.number ? num(r[c.key]) : (r[c.key]?.trim() || null)])));
      if (choice === 'reported' && !values.length) return setError(`${f.name}: add the value, or choose "Not reported" or "Can't tell".`);
      answers.push({ field: f.field, reported: choice === 'reported' || (choice === 'unsure' && values.length > 0), values: choice === 'none' ? [] : values, unsure: choice === 'unsure', note: null });
    }
    if (note.trim()) answers[0].note = note.trim();
    setBusy(true); setError(null);
    try {
      await api(API_ENDPOINTS.goldAnswers, { method: 'POST', body: JSON.stringify({ circular: circ.circular, answers, seconds_spent: Math.round((Date.now() - started.current) / 1000) }) });
      setCompare(await api(API_ENDPOINTS.goldCompare(circ.circular)));
      setView('results'); loadStats(); window.scrollTo({ top: 0 });
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  };

  // Back to the form with this checker's saved answers (the server marks later saves as after the reveal).
  const edit = async () => {
    if (!circ) return;
    const { answers } = await api(API_ENDPOINTS.goldCircular(circ.circular));
    const next = emptyForm();
    for (const a of answers as Answer[]) {
      const f = FIELDS.find((x) => x.field === a.field)!;
      next[a.field] = {
        choice: a.unsure ? 'unsure' : a.reported ? 'reported' : 'none',
        rows: a.values.map((v) => Object.fromEntries(f.cols.map((c) => [c.key, v[c.key] == null ? '' : String(v[c.key])]))),
      };
      if (a.note) setNote(a.note);
    }
    setForm(next); setView('check'); started.current = Date.now();
  };

  const skip = () => { if (circ) skipped.current.push(circ.circular); loadNext(); };

  const saveProfile = async (save: boolean) => {
    if (save) await api(API_ENDPOINTS.goldChecker, { method: 'POST', body: JSON.stringify({ expertise, credit_name: credit }) }).catch(() => {});
    else lsSet(PROFILE_SKIP_KEY, '1');
    setProfile('done');
  };

  const statBlock = stats && (
    <S.Stats>
      <S.Stat><span>Checked by two people</span><strong>{stats.answered_twice} <small>/ {stats.circulars}</small></strong></S.Stat>
      <S.Stat><span>Checkers</span><strong>{stats.checkers}</strong></S.Stat>
      {stats.mine != null && <S.Stat><span>Your circulars</span><strong>{stats.mine}</strong></S.Stat>}
    </S.Stats>
  );

  const rules = (
    <S.Rules>
      <summary>Checking rules (v1): what counts as a reported value</summary>
      <ul>
        <li>Record only what this circular reports as its own result. Leave out values it quotes from other circulars or papers ("GCN 12345 reported z = 1.2"), forecasts ("will reach"), and values assumed for a fit.</li>
        <li>Limits count. Record them with their kind: "z &gt; 2.8" is a lower limit; "&gt; 19.6 mag" (not detected) is an upper limit on brightness.</li>
        <li>Tentative values count; keep the word in "As written".</li>
        <li>Redshift: record every redshift the circular gives and say whose it is: the burst's own, a host galaxy's catalogue photo-z, a pseudo-redshift, an absorber in front, or another source.</li>
        <li>Magnitude: one row per measurement, each row of a photometry table on its own.</li>
        <li>Position: the position the circular reports with its uncertainty as written. For an IPN box or annulus, its centre and the size as written.</li>
        <li>"Not reported" means the circular gives no value; the word alone ("no redshift yet") is not a value. Choose "Can't tell" when you're unsure.</li>
      </ul>
    </S.Rules>
  );

  const intro = (
    <S.Head>
      <div>
        <S.H1>Gold set: check a GCN Circular</S.H1>
        <S.Lead>Read the circular and record every value it reports for the five fields, or that it reports none. You answer blind: you see how Starithm and Claude read it only after you submit. A value becomes gold when two people agree, and the finished set, with its rules, is published openly so anyone can measure an extraction system against it.</S.Lead>
      </div>
      {statBlock}
    </S.Head>
  );

  if (isLoaded && !isSignedIn) {
    return (
      <S.Root><Navbar />
        <S.Main>
          {intro}
          <S.Panel>
            <S.Lead>Checking takes about 3 to 4 minutes per circular. Sign in so your answers count once, and so you can be credited by name if you choose.</S.Lead>
            <div><S.Primary type="button" onClick={signIn}>Sign in to start</S.Primary></div>
          </S.Panel>
          {rules}
        </S.Main>
      </S.Root>
    );
  }

  return (
    <S.Root><Navbar />
      <S.Main>
        {intro}

        {profile === 'ask' && (
          <S.Panel aria-label="About you">
            <S.Lead>One question before you start (optional): what do you work on? It lets us report agreement by experience, never your name.</S.Lead>
            <S.Label $span={4}>Your field
              <S.Select value={expertise} onChange={(e) => setExpertise(e.target.value)}>
                <option value="">Choose</option>
                <option>GRB prompt emission (gamma-ray / X-ray)</option>
                <option>Afterglows (optical / NIR)</option>
                <option>Radio</option>
                <option>Spectroscopy / redshifts</option>
                <option>Gravitational waves / neutrinos</option>
                <option>Student</option>
                <option>Other</option>
              </S.Select>
            </S.Label>
            <S.CheckRow><input type="checkbox" checked={credit} onChange={(e) => setCredit(e.target.checked)} />Thank me by name in the acknowledgements when the gold set is published. Results are reported with checkers anonymised either way.</S.CheckRow>
            <S.Actions>
              <S.QuietButton type="button" onClick={() => saveProfile(false)}>Skip</S.QuietButton>
              <S.Primary type="button" onClick={() => saveProfile(true)}>Save</S.Primary>
            </S.Actions>
          </S.Panel>
        )}

        {circ === undefined && <S.Lead>Loading a circular…</S.Lead>}
        {circ === null && !error && (
          <S.Panel><S.Lead>You've checked every circular that still needs a checker. Thank you: that's the whole set for now.</S.Lead></S.Panel>
        )}
        {error && circ === null && <S.Error>{error}</S.Error>}

        {circ && (
          <S.Split>
            <S.CircularCard aria-label="The circular">
              <S.CircularHead>
                <div>
                  <S.CircularId>GCN {circ.circular}{circ.created_on ? ` · ${new Date(circ.created_on).toISOString().slice(0, 10)}` : ''}</S.CircularId>
                  <S.CircularSubject>{circ.subject}</S.CircularSubject>
                </div>
                {circ.circular > 0 && <a href={`https://gcn.nasa.gov/circulars/${circ.circular}`} target="_blank" rel="noreferrer">Open on GCN ↗</a>}
              </S.CircularHead>
              <S.CircularBody>{circ.body}</S.CircularBody>
            </S.CircularCard>

            {view === 'check' ? (
              <S.Form onSubmit={submit} aria-label="Your answers">
                {FIELDS.map((f) => {
                  const st = form[f.field];
                  return (
                    <S.FieldBox key={f.field} $open={st.choice === 'reported' || (st.choice === 'unsure' && st.rows.length > 0)}>
                      <S.Legend>{f.name}</S.Legend>
                      <S.FieldHint>{f.question}</S.FieldHint>
                      <S.Choices role="radiogroup" aria-label={f.question}>
                        {([['reported', 'Reported'], ['none', 'Not reported'], ['unsure', "Can't tell"]] as [Choice, string][]).map(([c, label]) => (
                          <S.Choice key={label} type="button" role="radio" aria-checked={st.choice === c} $on={st.choice === c} onClick={() => setChoice(f.field, c)}>{label}</S.Choice>
                        ))}
                      </S.Choices>
                      {st.choice !== 'none' && st.rows.map((r, i) => (
                        <S.ValueCard key={i}>
                          {f.cols.map((c) => (
                            <S.Label key={c.key} $span={c.span}>{c.label}
                              {c.options ? (
                                <S.Select value={r[c.key] ?? ''} onChange={(e) => setCell(f.field, i, c.key, e.target.value)}>
                                  {c.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                                </S.Select>
                              ) : (
                                <S.Input value={r[c.key] ?? ''} placeholder={c.placeholder} inputMode={c.number ? 'decimal' : undefined} onChange={(e) => setCell(f.field, i, c.key, e.target.value)} />
                              )}
                            </S.Label>
                          ))}
                          <S.RowActions><S.QuietButton type="button" onClick={() => removeRow(f.field, i)}>Remove this value</S.QuietButton></S.RowActions>
                        </S.ValueCard>
                      ))}
                      {(st.choice === 'reported' || st.choice === 'unsure') && (
                        <div style={{ marginTop: 10 }}><S.LinkButton type="button" onClick={() => addRow(f.field)}>+ {st.rows.length ? 'Another' : 'Add a'} {f.name.toLowerCase()} value</S.LinkButton></div>
                      )}
                    </S.FieldBox>
                  );
                })}

                <S.Label $span={4}>Note for the reviewers (optional)
                  <S.TextArea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anything ambiguous, e.g. the redshift is an estimate from a missing u-band detection" />
                </S.Label>
                {error && <S.Error role="alert">{error}</S.Error>}
                <S.Actions>
                  <S.Secondary type="button" onClick={skip}>Skip this one</S.Secondary>
                  <S.Primary type="submit" disabled={busy}>{busy ? 'Saving…' : 'Submit answers'}</S.Primary>
                </S.Actions>
                {rules}
              </S.Form>
            ) : compare && (
              <S.Form as="section" aria-label="How Starithm and Claude read it">
                <S.Lead>Your answers are saved. Here is how Starithm and Claude read the same circular. {circ.answered_by >= 1 ? 'You are its second checker.' : 'A value becomes gold when a second person, answering blind, agrees with you.'}</S.Lead>
                <S.CompareWrap>
                  <S.Table>
                    <thead><tr><th>Field</th><th>You</th><th>Starithm</th><th>Claude</th></tr></thead>
                    <tbody>
                      {FIELDS.map((f) => {
                        const mine = compare.mine.find((a) => a.field === f.field);
                        const ours = compare.ours ? compare.ours[f.field] ?? [] : null;
                        const claude = compare.claude ? compare.claude.values.filter((v) => v.field === f.field) : null;
                        const vo = verdict(f.field, mine, ours), vc = verdict(f.field, mine, claude);
                        const list = (vals: Value[] | null) => vals == null ? <S.Muted>—</S.Muted> : vals.length ? vals.map((v, i) => <div key={i}>{show(f.field, v)}</div>) : <S.Muted>Not reported</S.Muted>;
                        return (
                          <tr key={f.field}>
                            <S.FieldCell>{f.name}</S.FieldCell>
                            <td><S.Vals>{mine?.unsure && !mine.values.length ? <S.Muted>Can't tell</S.Muted> : list(mine?.reported ? mine.values : [])}</S.Vals></td>
                            <td><S.Vals>{list(ours)}</S.Vals><S.Verdict $tone={vo.tone}>{vo.text}</S.Verdict></td>
                            <td><S.Vals>{list(claude)}</S.Vals><S.Verdict $tone={vc.tone}>{vc.text}</S.Verdict></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </S.Table>
                </S.CompareWrap>
                <S.Actions>
                  <S.QuietButton type="button" onClick={edit}>← Change my answers (kept apart: no longer blind)</S.QuietButton>
                  <S.Primary type="button" onClick={loadNext}>Next circular →</S.Primary>
                </S.Actions>
              </S.Form>
            )}
          </S.Split>
        )}
      </S.Main>
    </S.Root>
  );
}
