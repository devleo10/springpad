import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import TermsOfUsePage from '@/components/TermsOfUsePage'
import React from 'react'

function page() {
  return (
    <div>
        <Navbar/>
        <TermsOfUsePage/>
        <Footer />
    </div>
  )
}

export default page