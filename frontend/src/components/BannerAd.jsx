'use client';

import { useState, useEffect } from 'react';
import { fetchActiveBannerAd } from '@/lib/admin';

export default function BannerAd({ orientation = 'horizontal' }) {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAd = async () => {
      try {
        const data = await fetchActiveBannerAd(orientation);
        setAd(data);
      } catch (error) {
        console.error("Failed to load banner ad", error);
      } finally {
        setLoading(false);
      }
    };
    loadAd();
  }, [orientation]);

  if (loading) {
    if (orientation === 'vertical') {
      return <div className="w-64 h-[400px] shrink-0 overflow-hidden rounded-2xl border border-[#EEEDFB] bg-[#F8F7FF] shadow-sm animate-pulse"></div>;
    }
    return (
      <div className="w-full h-[350px] overflow-hidden rounded-2xl border border-[#EEEDFB] bg-[#F8F7FF] shadow-md animate-pulse"></div>
    );
  }

  if (!ad) {
    return null; // Don't show anything if there is no active ad
  }

  if (orientation === 'vertical') {
    return (
      <div className="w-64 shrink-0">
        <div className="sticky top-6 overflow-hidden rounded-2xl border border-[#EEEDFB] bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 bg-[#F8F7FF] border-b border-[#EEEDFB]">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#6C5CE7]">
              Sponsored
            </span>
            {ad.targetUrl && (
              <a 
                href={ad.targetUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="rounded-full bg-[#6C5CE7] px-3 py-1 text-xs font-medium text-white hover:bg-[#5849d6]"
              >
                Claim
              </a>
            )}
          </div>

          {ad.targetUrl ? (
            <a href={ad.targetUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={ad.imageUrl}
                alt={ad.title || "Advertisement"}
                className="w-full h-auto object-cover"
              />
            </a>
          ) : (
            <img
              src={ad.imageUrl}
              alt={ad.title || "Advertisement"}
              className="w-full h-auto object-cover"
            />
          )}

          {(ad.title || ad.description) && (
            <div className="p-4">
              {ad.title && (
                <h3 className="font-semibold text-[#1E1B2E]">
                  {ad.title}
                </h3>
              )}
              {ad.description && (
                <p className="mt-2 text-sm text-[#6B6880]">
                  {ad.description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[#EEEDFB] bg-white shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#F8F7FF] border-b border-[#EEEDFB]">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#6C5CE7]">
          Sponsored
        </span>
        {ad.targetUrl && (
          <a 
            href={ad.targetUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="rounded-full bg-[#6C5CE7] px-4 py-2 text-sm font-medium text-white hover:bg-[#5849d6] transition"
          >
            Claim Offer
          </a>
        )}
      </div>

      {/* Advertisement Image */}
      {ad.targetUrl ? (
        <a href={ad.targetUrl} target="_blank" rel="noopener noreferrer">
          <img
            src={ad.imageUrl}
            alt={ad.title || "Advertisement"}
            className="w-full h-auto object-cover max-h-[350px]"
          />
        </a>
      ) : (
        <img
          src={ad.imageUrl}
          alt={ad.title || "Advertisement"}
          className="w-full h-auto object-cover max-h-[350px]"
        />
      )}

      {/* Footer */}
      {(ad.title || ad.description) && (
        <div className="px-5 py-4">
          {ad.title && (
            <h3 className="text-lg font-semibold text-[#1F1B3A]">
              {ad.title}
            </h3>
          )}
          {ad.description && (
            <p className="mt-1 text-sm text-[#6B6880]">
              {ad.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}