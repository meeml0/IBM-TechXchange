import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  console.log("✅ WEBHOOK ÇALIŞTI");

  // Gelen body'yi oku
  const body = await req.json();

  // Sadece yeni kullanıcı oluşturma veya güncelleme event’leriyle ilgilen
  if (body.type !== 'user.created' && body.type !== 'user.updated') {
    console.log(`⏭️ Atlanıyor event tipi: ${body.type}`);
    return NextResponse.json({ success: true });
  }

  const user = body.data;

  // Clerk'ten gelen verilerden ihtiyacımız olanları ayıkla
  const clerkUserId = user.id;
  const email = user.email_addresses?.[0]?.email_address ?? null;
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
  const avatarUrl = user.image_url ?? null;

  console.log("🛠 UPSERT için veriler:", {
    clerk_user_id: clerkUserId,
    email,
    full_name: fullName,
    avatar_url: avatarUrl
  });

  // Supabase'e upsert
  const { error } = await supabase
    .from('users')
    .upsert(
      {
        clerk_user_id: clerkUserId,
        email,
        full_name: fullName,
        avatar_url: avatarUrl
      },
      { onConflict: 'clerk_user_id' }
    );

  if (error) {
    console.error("❌ UPSERT HATASI:", error);
  } else {
    console.log("✅ UPSERT BAŞARILI");
  }

  return NextResponse.json({ success: !error });
}
