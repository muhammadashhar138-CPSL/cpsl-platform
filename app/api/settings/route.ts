import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

// GET settings for authenticated user
export async function GET(request: NextRequest) {
  try {
    // Skip auth check for now - testing
    // const session = await getServerSession();
    // if (!session || !session.user?.email) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // TODO: Fetch from Supabase
    // For now, return default settings
    const defaultSettings = {
      siteName: 'CPSL Platform',
      siteType: 'platform',
      contactEmail: 'demo@cpsl.co.uk',
      subscriptionLevel: 'enterprise',
      notifications: {
        emailAlerts: true,
        smsAlerts: false,
        incidentNotifications: true,
      },
      dataRetention: 90, // days
      twoFactorEnabled: false,
      integrations: {
        slack: { configured: false },
        teams: { configured: false },
        webhooks: { configured: false },
      },
    };

    return NextResponse.json(defaultSettings);
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// UPDATE settings for authenticated user
export async function POST(request: NextRequest) {
  try {
    // Skip auth check for now - testing
    // const session = await getServerSession();
    // if (!session || !session.user?.email) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const data = await request.json();

    // TODO: Save to Supabase
    // For now, just return the data
    console.log('Settings update:', { user: 'demo@cpsl.co.uk', data });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Settings POST error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
