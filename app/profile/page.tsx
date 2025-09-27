import Navbar from '@/components/Navbar'
import ProfileForm from '@/components/ProfileForm'
import { getSession } from '@auth0/nextjs-auth0'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const session = await getSession()
  
  if (!session?.user) {
    redirect('/api/auth/login')
  }

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-oswald font-bold text-white mb-4">
            User Profile
          </h1>
          <p className="text-lg font-author text-white/80">
            Complete your profile information and upload your images
          </p>
        </div>
        
        <ProfileForm />
      </main>
    </div>
  )
}
