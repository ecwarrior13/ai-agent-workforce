import React from 'react'
import { SidebarMenuSkeleton } from '../ui/sidebar'
import { Skeleton } from '../ui/skeleton'
import HeroSection from './HeroSection'
import Navigation from './Navigation'
import Footer from './Footer'

const LandingPage = () => {
  return (
    <div className='flex flex-col min-h-screen'>
        {/* Navigation Page */}
        <Navigation />
        <main className='flex-1'>
            {/* hero section */}

            <section className='py-20 md:py-32'>
                <HeroSection />
      
            </section>
        </main>
        {/* Footer */}
        <footer>
            <Footer />
        </footer>
    </div>
  )
}

export default LandingPage