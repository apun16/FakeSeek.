import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import connectDB from '@/lib/mongodb';
import UserProfile from '@/models/UserProfile';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const profile = await UserProfile.findOne({ userId: session.user.sub });
    
    if (!profile) {
      return NextResponse.json({ profile: null });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { firstName, lastName, profileImage1, profileImage2 } = await request.json();

    if (!firstName || !lastName) {
      return NextResponse.json({ error: 'First name and last name are required' }, { status: 400 });
    }

    await connectDB();

    const profileData = {
      userId: session.user.sub,
      firstName,
      lastName,
      profileImage1: profileImage1 || '',
      profileImage2: profileImage2 || '',
    };

    const profile = await UserProfile.findOneAndUpdate(
      { userId: session.user.sub },
      profileData,
      { upsert: true, new: true }
    );

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
