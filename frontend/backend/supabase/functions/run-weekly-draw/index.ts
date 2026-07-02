// Beduine admin-only weekly draw Edge Function template.
// It freezes DB entries, performs deterministic winner selection with a private seed,
// finalizes results through DB RPC, and optionally publishes the result.
// Winner selection is separate per plan/category round: domestic Silver/Gold/Platinum
// and international Silver/Gold/Platinum each get their own 5% rounded-up pool.

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createAdminClient, requireAdmin } from '../_shared/auth.ts';
import { HttpError, errorResponse, handleCors, json } from '../_shared/http.ts';

type DrawPlanTier = 'silver' | 'gold' | 'platinum' | 'unknown';
type DrawPlanCategory = 'domestic' | 'international' | 'unknown';
type DrawRoundKey = `${DrawPlanCategory}_${DrawPlanTier}`;

type Entry = {
  user_id: string;
  ticket_id: string;
  plan_id?: string;
  plan_category?: string;
  plan_tier?: string;
  plan_round_key?: string;
  verification_status: string;
  verification_reason?: string;
};

type Participant = {
  id: string;
  ticketId: string;
  plan: string;
  planCategory: DrawPlanCategory;
  planTier: DrawPlanTier;
  planRoundKey: DrawRoundKey;
  status: 'verified' | 'failed';
  verification_reason: string;
  winnerRank?: number;
  roundWinnerRank?: number;
  coupon?: string;
};

function winnerCount(valid: number): number {
  return valid <= 0 ? 0 : Math.ceil(valid * 0.05);
}

function normalizeTier(plan: string | undefined, explicitTier?: string): DrawPlanTier {
  const source = `${explicitTier || ''} ${plan || ''}`.toLowerCase();
  if (source.includes('silver')) return 'silver';
  if (source.includes('gold')) return 'gold';
  if (source.includes('platinum') || source.includes('premium') || source.includes('vip')) return 'platinum';
  return 'unknown';
}

function normalizeCategory(plan: string | undefined, explicitCategory?: string): DrawPlanCategory {
  const source = `${explicitCategory || ''} ${plan || ''}`.toLowerCase();
  if (source.includes('international') || source.includes('intl') || source.includes('global') || source.includes('world')) return 'international';
  if (source.includes('domestic')) return 'domestic';
  if (source.includes('silver') || source.includes('gold') || source.includes('platinum') || source.includes('premium') || source.includes('vip')) return 'domestic';
  return 'unknown';
}

function roundKeyFor(entry: Pick<Entry, 'plan_id' | 'plan_category' | 'plan_tier' | 'plan_round_key'>): DrawRoundKey {
  if (entry.plan_round_key && entry.plan_round_key.includes('_')) return entry.plan_round_key as DrawRoundKey;
  const category = normalizeCategory(entry.plan_id, entry.plan_category);
  const tier = normalizeTier(entry.plan_id, entry.plan_tier);
  return `${category}_${tier}` as DrawRoundKey;
}

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function hashSeedToNumber(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createSeededRandom(seed: string) {
  let state = hashSeedToNumber(seed) || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) % 1_000_000) / 1_000_000;
  };
}

function shuffleAndPick(participants: Participant[], count: number, seed: string, rankOffset: number): Participant[] {
  const random = createSeededRandom(seed);
  const shuffled = [...participants];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count).map((winner, index) => ({
    ...winner,
    winnerRank: rankOffset + index + 1,
    roundWinnerRank: index + 1,
    coupon: `BEDWIN-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
  }));
}

function selectWinnersByPlanRound(participants: Participant[], seed: string) {
  const verified = participants.filter((entry) => entry.status === 'verified');
  const groups = new Map<DrawRoundKey, Participant[]>();
  for (const participant of verified) {
    if (!groups.has(participant.planRoundKey)) groups.set(participant.planRoundKey, []);
    groups.get(participant.planRoundKey)!.push(participant);
  }

  const winners: Participant[] = [];
  const rounds: Array<{ roundKey: DrawRoundKey; category: DrawPlanCategory; tier: DrawPlanTier; verifiedParticipants: number; winnerCount: number; winnerIds: string[] }> = [];
  let rankOffset = 0;

  for (const [roundKey, members] of Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b))) {
    const [category, tier] = roundKey.split('_') as [DrawPlanCategory, DrawPlanTier];
    const count = winnerCount(members.length);
    const roundWinners = shuffleAndPick(members, count, `${seed}:${roundKey}`, rankOffset);
    rankOffset += roundWinners.length;
    winners.push(...roundWinners);
    rounds.push({ roundKey, category, tier, verifiedParticipants: members.length, winnerCount: count, winnerIds: roundWinners.map((w) => w.id) });
  }

  return { winners, rounds };
}

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    if (req.method !== 'POST') throw new HttpError(405, 'METHOD_NOT_ALLOWED');
    const admin = createAdminClient();
    await requireAdmin(req, admin);

    const body = await req.json().catch(() => ({})) as Record<string, unknown>;
    const cycleId = String(body.cycleId || '');
    const publish = Boolean(body.publish);
    if (!/^BEDUINE-SUN-[0-9]{4}-[0-9]{2}-[0-9]{2}-1800-IST$/.test(cycleId)) {
      throw new HttpError(400, 'DRAW_CYCLE_INVALID');
    }

    const freeze = await admin.rpc('admin_freeze_weekly_draw_cycle_v1', {
      p_cycle_id: cycleId,
      p_draw_date: new Date().toISOString(),
    });
    if (freeze.error) throw new HttpError(409, 'DRAW_FREEZE_FAILED');

    const { data: rows, error: entryError } = await admin
      .from('weekly_draw_entries')
      .select('user_id,ticket_id,plan_id,plan_category,plan_tier,plan_round_key,verification_status,verification_reason')
      .eq('cycle_id', cycleId)
      .order('ticket_id', { ascending: true });
    if (entryError) throw new HttpError(500, 'DRAW_ENTRY_LOOKUP_FAILED');

    const participants: Participant[] = ((rows || []) as Entry[]).map((entry) => {
      const planRoundKey = roundKeyFor(entry);
      const [planCategory, planTier] = planRoundKey.split('_') as [DrawPlanCategory, DrawPlanTier];
      const roundIsValid = planCategory !== 'unknown' && planTier !== 'unknown';
      return {
        id: entry.user_id,
        ticketId: entry.ticket_id,
        plan: entry.plan_id || '',
        planCategory,
        planTier,
        planRoundKey,
        status: entry.verification_status === 'verified' && roundIsValid ? 'verified' : 'failed',
        verification_reason: roundIsValid
          ? entry.verification_reason || ''
          : 'Subscription plan is not eligible for a draw round.',
      };
    });

    const seed = `${cycleId}:${crypto.randomUUID()}:${new Date().toISOString()}`;
    const { winners, rounds } = selectWinnersByPlanRound(participants, seed);
    const winnerIds = new Set(winners.map((winner) => winner.id));
    const nonWinners = participants.filter((entry) => entry.status === 'verified' && !winnerIds.has(entry.id));
    const rejectedParticipants = participants.filter((entry) => entry.status === 'failed');
    const report = {
      cycleId,
      drawDate: new Date().toISOString(),
      totalParticipants: participants.length,
      verifiedParticipants: participants.filter((entry) => entry.status === 'verified').length,
      winnerCount: winners.length,
      rounds,
      winners,
      nonWinners,
      rejectedParticipants,
    };

    const rngSeedHash = `sha256:${await sha256Hex(seed)}`;
    const reportHash = `sha256:${await sha256Hex(JSON.stringify(report))}`;
    const finalize = await admin.rpc('admin_finalize_weekly_draw_cycle_v1', {
      p_cycle_id: cycleId,
      p_report: report,
      p_rng_seed_hash: rngSeedHash,
      p_report_hash: reportHash,
    });
    if (finalize.error) throw new HttpError(409, 'DRAW_FINALIZE_FAILED');

    let published = null;
    if (publish) {
      const publishResult = await admin.rpc('admin_publish_weekly_draw_cycle_v1', {
        p_cycle_id: cycleId,
      });
      if (publishResult.error) throw new HttpError(409, 'DRAW_PUBLISH_FAILED');
      published = publishResult.data;
    }

    return json({
      ok: true,
      cycleId,
      rngSeedHash,
      reportHash,
      winnerCount: winners.length,
      rounds,
      published,
    }, {}, req);
  } catch (error) {
    return errorResponse(error, req);
  }
});
