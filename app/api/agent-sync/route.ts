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

    // Extract .clinerules or .cursorrules or .windsurfrules codeblock
    const a2aRegex = /```(?:a2a|cursorrules|clinerules|windsurfrules)\n([\s\S]*?)```/i;
    const a2aMatch = markdown.match(a2aRegex);
    let agent_directives = a2aMatch ? a2aMatch[1].trim() : 'No A2A directives found in this blueprint.';

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
