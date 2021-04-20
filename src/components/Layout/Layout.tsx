import React from 'react'
import { Footer } from './Footer'
import Navbar from './Navbar'
import Head from 'next/head'

interface LayoutProps {
  pageTitle?: string
}

const Layout: React.FC<LayoutProps> = ({ children, pageTitle }) => {
  const title = pageTitle ? pageTitle : 'Seeing Science'
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} key="title" />
      </Head>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

export default Layout
