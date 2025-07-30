import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import PrivacyPolicyPage from '@/components/PrivacyPolicyPage'
import React from 'react'

function page() {
  return (
    <div>
        <Navbar/>
        <PrivacyPolicyPage/>
        <Footer /> 
    </div>
  )
}

export default page