'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SizeSelector from '@/components/poster-generator/SizeSelector';
import InputForm from '@/components/poster-generator/InputForm';
import PosterDisplay from '@/components/poster-generator/PosterDisplay';
import SubscriptionModal from '@/components/poster-generator/SubscriptionModal';
import BackButton from '@/components/BackButton';
import type { SizeOption, PosterType } from '@/types/poster';

export default function PosterGenerator() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);

  const [posterType, setPosterType] = useState<PosterType>('Professional');
  const [festivalName, setFestivalName] = useState<string>('');

  const [brandName, setBrandName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // New Contact Fields
  const [contactPhone, setContactPhone] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const [productImages, setProductImages] = useState<File[]>([]);
  const [productUrl, setProductUrl] = useState<string>('');

  const [brandLogo, setBrandLogo] = useState<File | null>(null);

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [userCredits, setUserCredits] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Fetch user credits
  useEffect(() => {
    if (session?.user?.id) {
      fetchUserCredits();
    }
  }, [session]);

  const fetchUserCredits = async () => {
    try {
      const response = await fetch('/api/user/credits');
      if (response.ok) {
        const data = await response.json();
        setUserCredits(data.credits);
        setIsSubscribed(data.isSubscribed || false);
      }
    } catch (error) {
      console.error('Failed to fetch credits:', error);
    }
  };

  const performGeneration = async (isUpdate: boolean) => {
    // Validation: Check for required text fields
    if (!brandName || !description) {
      setError('Please provide a Brand Name and Description.');
      return;
    }

    // Validation: Festival name required if Festival mode is selected
    if (posterType === 'Festival' && !festivalName.trim()) {
      setError('Please provide a name for the festival or occasion.');
      return;
    }

    // Validation: Check that at least one product source is provided (URL or Images)
    // Only strictly required for fresh generation.
    if (!isUpdate && productImages.length === 0 && !productUrl) {
      setError('Please provide at least one product source: either upload Product Photos or enter a Product URL.');
      return;
    }

    if (!selectedSize) {
      setError('Please select a poster size.');
      return;
    }

    // Check credits/subscription
    if (!isSubscribed && userCredits <= 0) {
      setShowSubscriptionModal(true);
      return;
    }

    setError(null);
    setIsLoading(true);
    // Don't clear generatedImage if updating, so user still sees the old one while loading
    if (!isUpdate) setGeneratedImage(null);

    try {
      // Convert files to base64
      const productImagesWithBase64 = await Promise.all(
        productImages.map(async (file) => {
          const base64 = await fileToBase64(file);
          return { name: file.name, base64 };
        })
      );

      const brandLogoWithBase64 = brandLogo
        ? { name: brandLogo.name, base64: await fileToBase64(brandLogo) }
        : null;

      const response = await fetch('/api/poster/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brandName,
          description,
          productImages: productImagesWithBase64,
          productUrl: productUrl || undefined,
          brandLogo: brandLogoWithBase64,
          aspectRatio: selectedSize.aspectRatio,
          posterType,
          festivalName: posterType === 'Festival' ? festivalName : undefined,
          contactPhone: contactPhone.trim() || undefined,
          website: website.trim() || undefined,
          address: address.trim() || undefined,
          baseImage: isUpdate && generatedImage ? generatedImage : undefined
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setGeneratedImage(result.posterUrl);
        if (!isSubscribed) {
          setUserCredits(prev => prev - 1);
        }
      } else {
        const errorData = await response.json();
        
        // Handle subscription upgrade required
        if (errorData.upgradeRequired) {
          setShowSubscriptionModal(true);
          return;
        }

        // Handle any error response (single attempt, no retry)
        // Show user-friendly message from API or fallback message
        setError(errorData.message || errorData.error || 'We encountered an issue while creating your poster. Please try again shortly.');
      }
    } catch (err) {
      console.error(err);
      setError('We encountered an issue while creating your poster. Please try again shortly.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => performGeneration(false);
  const handleUpdateText = () => performGeneration(true);

  const handleReset = () => {
    setBrandName('');
    setDescription('');
    setProductImages([]);
    setProductUrl('');
    setBrandLogo(null);
    setPosterType('Professional');
    setFestivalName('');
    setContactPhone('');
    setWebsite('');
    setAddress('');
    setGeneratedImage(null);
    setError(null);
    setIsLoading(false);
  };

  const handleSizeSelect = (size: SizeOption) => {
    setSelectedSize(size);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChangeSize = () => {
    setSelectedSize(null);
    setGeneratedImage(null);
    setError(null);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-magenta border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BackButton href="/tools" />
              <div className="text-sm text-gray-600">
                {!selectedSize ? 'Select Format' : 'Design Poster'}
              </div>
            </div>
            <div className="text-sm text-charcoal">
              Credits: {userCredits}
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow container mx-auto p-4 md:p-8 space-y-16">

        {!selectedSize ? (
          <SizeSelector onSelect={handleSizeSelect} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <InputForm
              brandName={brandName}
              setBrandName={setBrandName}
              description={description}
              setDescription={setDescription}

              contactPhone={contactPhone}
              setContactPhone={setContactPhone}
              website={website}
              setWebsite={setWebsite}
              address={address}
              setAddress={setAddress}

              productImages={productImages}
              setProductImages={setProductImages}
              productUrl={productUrl}
              setProductUrl={setProductUrl}
              brandLogo={brandLogo}
              setBrandLogo={setBrandLogo}
              posterType={posterType}
              setPosterType={setPosterType}
              festivalName={festivalName}
              setFestivalName={setFestivalName}
              isLoading={isLoading}
              onSubmit={handleSubmit}
              onUpdateText={handleUpdateText}
              hasGeneratedImage={!!generatedImage}
              onReset={handleReset}
              selectedSize={selectedSize}
              onChangeSize={handleChangeSize}
            />
            <PosterDisplay
              generatedImage={generatedImage}
              isLoading={isLoading}
              error={error}
            />
          </div>
        )}
      </main>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </div>
  );
}