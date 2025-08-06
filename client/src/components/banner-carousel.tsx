import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  linkText: string | null;
  isActive: boolean;
  displayOrder: number;
}

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/banners");
        
        if (!response.ok) {
          throw new Error("Failed to fetch banners");
        }
        
        const data = await response.json();
        setBanners(data);
      } catch (err) {
        console.error("Error fetching banners:", err);
        setError("Failed to load banners");
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) {
    return <div className="h-96 flex items-center justify-center">Loading banners...</div>;
  }

  if (error) {
    return null; // Don't show anything if there's an error
  }

  if (banners.length === 0) {
    return null; // Don't show carousel if no banners
  }

  return (
    <div className="relative w-full">
      <Carousel className="w-full">
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
                <img 
                  src={banner.imageUrl} 
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-center text-white p-6 max-w-3xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">{banner.title}</h2>
                    {banner.subtitle && (
                      <p className="text-lg md:text-xl mb-4">{banner.subtitle}</p>
                    )}
                    {banner.linkUrl && banner.linkText && (
                      <Button 
                        className="bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                        onClick={() => window.open(banner.linkUrl!, "_blank")}
                      >
                        {banner.linkText}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute inset-0 flex items-center justify-between pointer-events-none p-4">
          <CarouselPrevious className="pointer-events-auto" />
          <CarouselNext className="pointer-events-auto" />
        </div>
      </Carousel>
    </div>
  );
}