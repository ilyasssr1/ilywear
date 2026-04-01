import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Politique de Retour et Échange | IlyWear',
  description: 'Politique de Retour de la boutique IlyWear.',
};

export default function ReturnsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-[#0A0A0A] py-24 min-h-[80vh]">
        <div className="container mx-auto px-6 max-w-4xl text-white font-sans">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-impact uppercase tracking-wider mb-12">Politique de Retour & Échange</h1>
          
          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-impact uppercase text-white mb-4">1. Conditions d'Échange</h2>
              <p>Nous souhaitons que vous soyez totalement satisfait de vos achats chez IlyWear. Si la taille ne vous convient pas ou qu'il y a un défaut de fabrication, vous avez la possibilité de demander un échange dans un délai de <strong>7 jours</strong> suivant la réception de votre commande.</p>
            </section>

            <section>
              <h2 className="text-2xl font-impact uppercase text-white mb-4">2. État du Produit</h2>
              <p>Pour être admissible à un échange, le vêtement doit être :</p>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-400">
                <li>Non porté, non lavé et dans le même état que vous l'avez reçu.</li>
                <li>Dans son emballage d'origine avec toutes ses étiquettes attachées.</li>
              </ul>
              <p className="mt-4 text-red-400 text-sm">Attention : Les articles abîmés, salis ou incomplets ne seront pas repris.</p>
            </section>

            <section>
              <h2 className="text-2xl font-impact uppercase text-white mb-4">3. Procédure de Retour</h2>
              <p>Pour initier un retour ou un échange :</p>
              <ol className="list-decimal pl-6 space-y-2 mt-4 text-gray-400">
                <li>Contactez notre Service Client via WhatsApp ou via la page Contact en précisant votre numéro de commande.</li>
                <li>Expliquez le motif de l'échange (ex: taille trop petite).</li>
                <li>Notre équipe vous guidera pour le processus de retour avec notre partenaire de livraison.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-impact uppercase text-white mb-4">4. Frais de Retour</h2>
              <p>Dans le cas d'une erreur de notre part (erreur de taille expédiée, produit défectueux), les frais de retour et de relivraison sont intégralement à la charge d'IlyWear. Si l'échange est dû à un changement d'avis ou une erreur de sélection du client lors de la commande, les frais de livraison de retour seront à la charge de ce dernier.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-impact uppercase text-white mb-4">5. Remboursements</h2>
              <p>IlyWear privilégiant le paiement à la livraison (Cash on Delivery), nous procédons principalement par avoir (bon d'achat) ou échange d'article équivalent plutôt que par remboursement monétaire direct, sauf cas exceptionnel validé par l'administration.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
