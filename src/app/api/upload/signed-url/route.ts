import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}

export async function POST(request: Request) {
  try {
    const { path, contentType } = await request.json();

    if (!path || !contentType) {
      return NextResponse.json({ error: 'path and contentType are required' }, { status: 400 });
    }

    const supabase = getAdminClient();

    const { data, error } = await supabase.storage
      .from('media')
      .createSignedUploadUrl(path);

    if (error || !data) {
      console.error('Signed URL error:', error);
      return NextResponse.json({ error: error?.message ?? 'Failed to create signed URL' }, { status: 500 });
    }

    const publicUrl = supabase.storage.from('media').getPublicUrl(path).data.publicUrl;

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      publicUrl,
    });
  } catch (err) {
    console.error('Upload signed URL error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
