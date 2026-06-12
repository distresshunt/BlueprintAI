import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const blueprint_id = searchParams.get('blueprint_id');

  if (!blueprint_id) {
    return NextResponse.json({ error: 'blueprint_id is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('blueprints')
      .select('blueprint_markdown, is_unlocked')
      .eq('id', blueprint_id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Blueprint not found' }, { status: 404 });
    }

    if (!data.is_unlocked) {
      return NextResponse.json({ error: 'Payment required. User must unlock this blueprint on blueprintagent.dev first.' }, { status: 403 });
    }

    const markdown = data.blueprint_markdown;

    // Extract Agent-to-Agent Rules via [PROJECT_CONTEXT]
    const rulesMatch = markdown.match(/```(?:markdown|text)?\s*([\s\S]*?\[PROJECT_CONTEXT\][\s\S]*?)\s*```/i);
    let agent_directives = rulesMatch ? rulesMatch[1].trim() : null;

    if (!agent_directives) {
      const fallbackMatch = markdown.match(/(\[PROJECT_CONTEXT\][\s\S]*?)\s*```/i);
      agent_directives = fallbackMatch ? fallbackMatch[1].trim() : 'No A2A directives found in this blueprint.';
    }

    // Extract Phase 0 (Tech Stack)
    const phase0Regex = /\*\*Phase 0.*?\*\*\n([\s\S]*?)(?=\*\*Phase 1|\*\*Phase 2)/i;
    const phase0Match = markdown.match(phase0Regex);
    const tech_stack = phase0Match ? phase0Match[1].trim() : 'Tech stack not found.';

    return NextResponse.json({
      status: 'success',
      agent_directives,
      tech_stack
    });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
