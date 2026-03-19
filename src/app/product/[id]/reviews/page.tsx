"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Star, ArrowLeft, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface Review {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  images?: string[];
}

export default function AllReviewsPage({ params }: { params: { id: string } }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAllReviews() {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', params.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setReviews(data);
      }
      setLoading(false);
    }
    loadAllReviews();
  }, [params.id]);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            href={`/product/${params.id}`}
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black hover:-translate-x-1 transition-all mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au produit
          </Link>

          {/* Header */}
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-between mb-16 border-b border-gray-100 pb-12">
            <div>
              <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-4 inline-block">Avis Clients</span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">
                Tous Les Avis
              </h1>
              <p className="text-gray-400 text-sm font-medium mt-4">
                Découvrez ce que nos clients disent de ce produit.
              </p>
            </div>

            {/* Overall Rating Box */}
            <div className="bg-[#FBFBFB] border border-gray-100 rounded-[2.5rem] p-8 text-center min-w-[200px]">
              <div className="text-5xl font-black italic mb-2">{averageRating}</div>
              <div className="flex justify-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${Number(averageRating) >= s ? 'fill-accent text-accent' : 'text-gray-200'}`} />
                ))}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                {reviews.length} Avis au total
              </p>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse h-32 bg-gray-50 rounded-3xl w-full border border-gray-100" />
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-black uppercase tracking-tight italic mb-2">Aucun avis</h3>
                <p className="text-gray-400 text-sm">Ce produit n'a pas encore d'avis complets.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white border border-gray-100 rounded-[2rem] p-8 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-black italic ${
                          review.user_name === 'Anonymous' ? 'bg-gray-100 text-gray-400' : 'bg-black text-white'
                        }`}>
                          {review.user_name.substring(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase tracking-tight">
                            {review.user_name}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 italic">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-4 h-4 ${review.rating >= s ? 'fill-accent text-accent' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide py-1">
                        {review.images.map((img, i) => (
                          <div key={i} className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm transition-transform hover:scale-105 cursor-pointer">
                            <img src={img} alt={`Review ${i}`} className="w-full h-full object-cover" onClick={() => window.open(img, '_blank')} />
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-gray-600 text-[15px] font-medium leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
