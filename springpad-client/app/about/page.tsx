"use client";

import AboutPage from '@/components/AboutPage'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import React from 'react'

function page() {
  return (
    <div>
      <Navbar />
      <AboutPage />
      <Footer />
    </div>
  )
}

export default page