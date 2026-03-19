'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Star, User, MessageSquare, Send, AlertCircle, Check, X } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

interface Review {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  images?: string[];
}

export default function ProductReviews({ productId }: { productId: string | number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', isAnonymous: false, images: [] as string[] });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    async function loadReviews() {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (!error) {
        setReviews(data || []);
      }
      setLoading(false);
    }
    loadReviews();
  }, [productId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of selectedFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      const filePath = `reviews/${productId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        showToast(`Storage error: ${uploadError.message}. Make sure the 'images' bucket exists in Supabase.`, 'error');
        continue;
      }

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
        urls.push(publicUrl);
      }
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    let uploadedImageUrls: string[] = [];
    if (selectedFiles.length > 0) {
      setUploading(true);
      uploadedImageUrls = await uploadImages();
      setUploading(false);
    }
    
    let finalUserName = 'Anonymous';
    if (user && !newReview.isAnonymous) {
      finalUserName = user.email?.split('@')[0] || 'Customer';
    }

    const reviewData = {
      product_id: productId,
      user_id: user?.id || null,
      user_name: finalUserName,
      rating: newReview.rating,
      comment: newReview.comment,
      images: uploadedImageUrls
    };

    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select()
      .single();

    if (error) {
      console.error('Review submit error:', error);
      showToast(`${t('review_failed')}: ${error.message}. Make sure 'images' column exists in 'reviews' table.`, 'error');
    } else {
      setReviews([data, ...reviews]);
      setNewReview({ rating: 5, comment: '', isAnonymous: false, images: [] });
      setSelectedFiles([]);
      showToast(t('review_posted'), 'success');
    }
    setSubmitting(false);
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="border-t border-gray-100 pt-16">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
        {/* Left: Stats */}
        <div className="md:col-span-4 lg:col-span-4">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-6">{t('customer_reviews')}</h2>
          <div className="bg-[#FBFBFB] border border-gray-100 rounded-3xl p-10 text-center sticky top-32 transition-all">
            <div className="text-6xl font-black italic mb-2">{averageRating}</div>
            <div className="flex justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`w-5 h-5 ${Number(averageRating) >= s ? 'fill-accent text-accent' : 'text-gray-200'}`} />
              ))}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('based_on')} {reviews.length} {t('reviews')}</p>
          </div>
        </div>

        {/* Right: Reviews List & Form */}
        <div className="md:col-span-8 lg:col-span-8 space-y-12">
          {/* Form */}
          <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6">{t('add_review')}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button 
                    key={s} 
                    type="button" 
                    onClick={() => setNewReview({ ...newReview, rating: s })}
                    className="transition-transform hover:scale-110"
                  >
                    <Star className={`w-6 h-6 ${newReview.rating >= s ? 'fill-accent text-accent' : 'text-gray-200'}`} />
                  </button>
                ))}
              </div>
              <textarea 
                required
                placeholder={t('review_placeholder')}
                className="w-full bg-gray-50 border border-transparent rounded-2xl p-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all min-h-[120px]"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              />
              <div className="flex flex-col gap-4">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleFileChange}
                  id="review-images"
                  className="hidden"
                />
                <label 
                  htmlFor="review-images"
                  className="flex items-center gap-3 px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all text-[10px] font-black uppercase tracking-widest text-gray-500 w-fit"
                >
                  <MessageSquare className="w-4 h-4" /> {t('upload_image')}
                </label>
                
                {selectedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 group">
                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {user ? (
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                      newReview.isAnonymous ? 'bg-black border-black text-white' : 'bg-white border-gray-200 text-transparent group-hover:border-black'
                    }`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-black transition-colors">{t('post_anonymously')}</span>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={newReview.isAnonymous}
                      onChange={(e) => setNewReview({ ...newReview, isAnonymous: e.target.checked })}
                    />
                  </label>
                ) : (
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <User className="w-3 h-3" /> {t('posting_anonymously')} <Link href="/login" className="text-primary underline hover:text-accent transition-colors">{t('login_for_name')}</Link> {t('to_use_name')}
                  </p>
                )}
                
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-black text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-accent transition-all disabled:opacity-50"
                >
                  {submitting ? t('posting') : t('post_review')}
                  <Send className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </form>
          </div>

          {/* List (Carousel) */}
          <div className="w-full">
            {loading ? (
              <div className="animate-pulse flex gap-6 overflow-hidden">
                <div className="h-40 bg-gray-100 rounded-3xl min-w-[300px]" />
                <div className="h-40 bg-gray-100 rounded-3xl min-w-[300px]" />
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-10 bg-gray-50 rounded-[2rem] border border-gray-100">
                {t('no_reviews')}
              </p>
            ) : (
              <div className="space-y-8">
                <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide">
                  {reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="bg-white border border-gray-100 rounded-[2rem] p-8 min-w-[320px] max-w-[400px] snap-start hover:shadow-xl transition-all flex-shrink-0">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black italic ${
                          review.user_name === 'Anonymous' ? 'bg-gray-100 text-gray-400' : 'bg-black text-white'
                        }`}>
                          {review.user_name.substring(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-tight">
                            {review.user_name}
                          </p>
                          <p className="text-[9px] font-bold text-gray-400 italic">{new Date(review.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-0.5 mb-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3.5 h-3.5 ${review.rating >= s ? 'fill-accent text-accent' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
                      {review.images?.map((img: string, i: number) => (
                        <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 mt-2">
                          <img src={img} alt={`Review ${i}`} className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform" onClick={() => window.open(img, '_blank')} />
                        </div>
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm font-medium leading-relaxed">{review.comment}</p>
                  </div>
                ))}
                </div>
                {reviews.length > 3 && (
                  <div className="flex justify-center border-t border-gray-50 pt-8">
                    <Link 
                      href={`/product/${productId}/reviews`}
                      className="bg-black text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-accent transition-all duration-500 shadow-xl shadow-black/10 flex items-center gap-3"
                    >
                      <MessageSquare className="w-4 h-4" />
                      {t('view_all_reviews')} ({reviews.length})
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
