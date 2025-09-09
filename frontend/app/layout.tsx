import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  preload: false
})

export const metadata: Metadata = {
  title: {
    default: 'FinTwin - AI Financial Twin Platform',
    template: '%s | FinTwin - AI Financial Twin Platform'
  },
  description: 'Your intelligent financial companion for taxes, investments, and business growth. AI-powered insights, automated compliance, and expert CA connections.',
  applicationName: 'FinTwin',
  authors: [
    {
      name: 'FinTwin Team',
      url: 'https://fintwin.com'
    }
  ],
  generator: 'Next.js',
  keywords: [
    'tax filing',
    'income tax',
    'GST',
    'financial planning',
    'CA services',
    'tax optimization',
    'AI financial assistant',
    'business compliance',
    'investment planning',
    'chartered accountant',
    'tax calculator',
    'ITR filing',
    'financial twin',
    'tax savings',
    'business tax',
    'freelancer tax',
    'startup compliance',
    'financial automation'
  ],
  referrer: 'origin-when-cross-origin',
  creator: 'FinTwin',
  publisher: 'FinTwin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://fintwin.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-IN': '/en-IN',
      'hi-IN': '/hi-IN'
    }
  },
  openGraph: {
    type: 'website',
    siteName: 'FinTwin',
    title: 'FinTwin - AI Financial Twin Platform',
    description: 'Your intelligent financial companion for taxes, investments, and business growth. AI-powered insights, automated compliance, and expert CA connections.',
    url: 'https://fintwin.com',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FinTwin - AI Financial Twin Platform'
      },
      {
        url: '/og-image-square.png',
        width: 1200,
        height: 1200,
        alt: 'FinTwin - AI Financial Twin Platform'
      }
    ],
    locale: 'en_IN',
    countryName: 'India'
  },
  twitter: {
    card: 'summary_large_image',
    site: '@FinTwinAI',
    creator: '@FinTwinAI',
    title: 'FinTwin - AI Financial Twin Platform',
    description: 'Your intelligent financial companion for taxes, investments, and business growth.',
    images: ['/twitter-image.png']
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  icons: {
    icon: [
      {
        url: '/icons/icon-32x32.png',
        sizes: '32x32',
        type: 'image/png'
      },
      {
        url: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        url: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ],
    apple: [
      {
        url: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icons/safari-pinned-tab.svg',
        color: '#3b82f6'
      }
    ]
  },
  manifest: '/manifest.json',
  category: 'finance',
  classification: 'business',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'FinTwin',
    'application-name': 'FinTwin',
    'msapplication-TileColor': '#3b82f6',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#3b82f6'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' }
  ],
  colorScheme: 'light dark',
  viewportFit: 'cover'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Preload critical resources */}
        <link 
          rel="preload" 
          href="/icons/icon-192x192.png" 
          as="image" 
          type="image/png"
        />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Preconnect to API */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL} />
        
        {/* PWA iOS meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FinTwin" />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Prevent automatic detection */}
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        
        {/* Critical inline styles for FOUC prevention */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for preventing FOUC */
            *, *::before, *::after {
              box-sizing: border-box;
            }
            
            html {
              line-height: 1.5;
              -webkit-text-size-adjust: 100%;
              -moz-tab-size: 4;
              tab-size: 4;
              font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
              font-feature-settings: normal;
              font-variation-settings: normal;
            }
            
            body {
              margin: 0;
              line-height: inherit;
              background-color: #f8fafc;
            }
            
            /* Loading spinner for initial load */
            .loading-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 9999;
              opacity: 1;
              transition: opacity 0.3s ease;
            }
            
            .loading-spinner {
              width: 40px;
              height: 40px;
              border: 4px solid #e2e8f0;
              border-top: 4px solid #3b82f6;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            /* Hide loading overlay when page is loaded */
            .loaded .loading-overlay {
              opacity: 0;
              pointer-events: none;
            }
          `
        }} />
        
        {/* Service Worker Registration */}
        <script 
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && typeof window !== 'undefined') {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js', { scope: '/' })
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                      
                      // Check for updates
                      registration.addEventListener('updatefound', function() {
                        const newWorker = registration.installing;
                        if (newWorker) {
                          newWorker.addEventListener('statechange', function() {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                              // New content available, show update notification
                              if (window.confirm('New version available! Reload to update?')) {
                                newWorker.postMessage({ type: 'SKIP_WAITING' });
                                window.location.reload();
                              }
                            }
                          });
                        }
                      });
                      
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
                
                // Listen for messages from SW
                navigator.serviceWorker.addEventListener('message', function(event) {
                  if (event.data && event.data.type === 'SW_UPDATED') {
                    window.location.reload();
                  }
                });
              }
              
              // Handle PWA install prompt
              let deferredPrompt;
              window.addEventListener('beforeinstallprompt', function(e) {
                e.preventDefault();
                deferredPrompt = e;
                
                // Show custom install button/banner
                const installBanner = document.getElementById('pwa-install-banner');
                if (installBanner) {
                  installBanner.style.display = 'block';
                }
              });
              
              // Handle app installed
              window.addEventListener('appinstalled', function(e) {
                console.log('PWA installed successfully');
                deferredPrompt = null;
                
                // Hide install banner
                const installBanner = document.getElementById('pwa-install-banner');
                if (installBanner) {
                  installBanner.style.display = 'none';
                }
              });
              
              // Performance monitoring
              if (typeof window !== 'undefined' && 'performance' in window) {
                window.addEventListener('load', function() {
                  setTimeout(function() {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                      console.log('Page Load Performance:', {
                        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                        totalLoadTime: perfData.loadEventEnd - perfData.fetchStart
                      });
                    }
                  }, 0);
                });
              }
              
              // Remove loading overlay when page is fully loaded
              document.addEventListener('DOMContentLoaded', function() {
                document.documentElement.classList.add('loaded');
                setTimeout(function() {
                  const overlay = document.querySelector('.loading-overlay');
                  if (overlay) {
                    overlay.remove();
                  }
                }, 300);
              });
            `
          }}
        />
        
        {/* Critical error handling */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                console.error('Global error:', e.error);
                // Could send to analytics/monitoring service
              });
              
              window.addEventListener('unhandledrejection', function(e) {
                console.error('Unhandled promise rejection:', e.reason);
                // Could send to analytics/monitoring service
              });
            `
          }}
        />
      </head>
      
      <body className="font-inter antialiased min-h-screen">
        {/* Loading overlay */}
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
        
        {/* Skip to main content for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>
        
        {/* Main app content */}
        <div id="main-content" role="main">
          {children}
        </div>
        
        {/* Analytics and monitoring scripts would go here */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics */}
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                    send_page_view: true
                  });
                `
              }}
            />
            
            {/* Microsoft Clarity */}
            {process.env.NEXT_PUBLIC_CLARITY_ID && (
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    (function(c,l,a,r,i,t,y){
                      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                    })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
                  `
                }}
              />
            )}
          </>
        )}
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "FinTwin",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Any",
              "description": "AI-powered financial twin platform for taxes, investments, and business growth",
              "url": "https://fintwin.com",
              "downloadUrl": "https://fintwin.com",
              "softwareVersion": "1.0.0",
              "datePublished": "2024-01-01",
              "author": {
                "@type": "Organization",
                "name": "FinTwin",
                "url": "https://fintwin.com"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR",
                "availability": "https://schema.org/InStock"
              },
              "featureList": [
                "AI-powered tax filing",
                "Automated compliance",
                "Expert CA connections",
                "Business financial management",
                "Investment planning",
                "Document processing",
                "Real-time insights"
              ],
              "screenshot": "https://fintwin.com/og-image.png"
            })
          }}
        />
      </body>
    </html>
  )
}