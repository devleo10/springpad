"use client";

import CommissionDisclosuresPage from '@/components/CommisionDisclosuresPage';
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import React from 'react'

function page() {
  return (
    <div>
        <Navbar />
        <CommissionDisclosuresPage />
        <Footer />
    </div>
  )
}

export default page