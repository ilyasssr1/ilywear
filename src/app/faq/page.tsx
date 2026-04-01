import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'FAQ - Foire Aux Questions | IlyWear',
  description: 'Toutes vos questions sur les commandes, les livraisons et les retours.',
};

export default function FAQPage() {
  const faqs = [
    {
      q: "Quels sont les délais de livraison ?",
      a: "La livraison prend généralement entre 48h et 72h pour les grandes villes du Maroc. Dans certaines régions moins accessibles ou lors de forte demande, cela peut prendre jusqu'à 4 jours ouvrables."
    },
    {
      q: "Comment puis-je payer ma commande ?",
      a: "Chez IlyWear, la sécurité de nos clients est primordiale. C'est pourquoi nous utilisons exclusivement le paiement à la livraison (Cash on Delivery). Vous payez le livreur en espèces uniquement lorsque vous recevez votre colis en main propre."
    },
    {
      q: "Les frais de livraison sont-ils gratuits ?",
      a: "Oui ! Nous offrons la livraison gratuite partout au Maroc sur toute notre collection premium."
    },
    {
      q: "Puis-je échanger un article si la taille ne me va pas ?",
      a: "Absolument. Vous disposez de 7 jours après la réception de votre commande pour demander un échange. L'article doit être non porté, non lavé, et avec ses étiquettes d'origine. Contactez-nous sur WhatsApp pour lancer la procédure."
    },
    {
      q: "Comment suivre ma commande ?",
      a: "Dès que votre commande est expédiée, vous pouvez suivre son état d'avancement via notre page 'Track Order' en utilisant votre numéro de commande, ou vous serez contacté par le livreur."
    },
    {
      q: "Où êtes-vous situés ?",
      a: "Nous sommes une marque 100% marocaine. Notre centre d'expédition principal et notre showroom de référence sont situés à Agadir."
    }
  ];

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#0A0A0A] py-24 min-h-[80vh]">
        <div className="container mx-auto px-6 max-w-4xl text-white font-sans">
          <div className="flex items-center gap-4 mb-12">
            <HelpCircle className="w-12 h-12 text-accent" />
            <h1 className="text-4xl md:text-6xl font-impact uppercase tracking-wider">F.A.Q</h1>
          </div>
          <p className="text-gray-400 mb-12">Foire Aux Questions : Retrouvez ici les réponses aux questions les plus posées par notre communauté.</p>
          
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#111] border border-[#222] p-8 rounded-2xl hover:border-[#333] transition-colors">
                <h3 className="text-xl font-impact uppercase text-white mb-4 tracking-wide">{faq.q}</h3>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-accent/5 border border-accent/20 p-8 rounded-2xl text-center">
            <h3 className="font-impact text-xl uppercase text-white mb-2">Vous n'avez pas trouvé votre réponse ?</h3>
            <p className="text-gray-400 text-sm mb-6">Notre équipe est disponible sur WhatsApp 24/7 pour vous assister.</p>
            <a href="/contact" className="inline-block bg-accent text-secondary px-8 py-3 font-impact uppercase tracking-wider rounded text-sm hover:bg-white transition-colors">Contactez-nous</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
