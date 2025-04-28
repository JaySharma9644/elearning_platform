import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {

    // Remove password from response
    const response = NextResponse.json({
      message: 'Logout  successful',
    
    });

    response.cookies.delete('token'); // Delete the token cookie on logout

    return response

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
