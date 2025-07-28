import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import RefundPolicyPage from '@/components/RefundPolicyPage'
import React from 'react'

function page() {
  return (
    <div>
        <Navbar />
        <RefundPolicyPage />
        <Footer />
    </div>
  )
}

export default page