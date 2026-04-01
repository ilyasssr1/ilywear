import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Conditions Générales de Vente | IlyWear',
  description: 'Conditions Générales de Vente de la boutique IlyWear.',
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-[#0A0A0A] py-24 min-h-[80vh]">
        <div className="container mx-auto px-6 max-w-4xl text-white font-sans">
          <h1 className="text-4xl md:text-6xl font-impact uppercase tracking-wider mb-12">Conditions Générales de Vente</h1>
          
          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-impact uppercase text-white mb-4">1. Objet</h2>
              <p>Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre IlyWear et toute personne effectuant un achat via le site web ilywear.shop. Toute commande implique l'acceptation sans réserve des présentes CGV.</p>
            </section>

            <section>
              <h2 className="text-2xl font-impact uppercase text-white mb-4">2. Produits</h2>
              <p>Les produits proposés sont ceux qui figurent sur le site ilywear.shop. IlyWear s'efforce de présenter les produits avec la plus grande exactitude possible. Toutefois, des variations minimes de couleurs ou de détails peuvent exister.</p>
            </section>

            <section>
              <h2 className="text-2xl font-impact uppercase text-white mb-4">3. Prix</h2>
              <p>Les prix de nos produits sont indiqués en Dirhams Marocains (MAD) toutes taxes comprises (TTC). IlyWear se réserve le droit de modifier ses prix à tout moment, mais le produit sera facturé sur la base du tarif en vigueur au moment de la validation de la commande.</p>
            </section>

            <section>
              <h2 className="text-2xl font-impact uppercase text-white mb-4">4. Commande et Paiement</h2>
              <p>Le paiement s'effectue exclusivement à la livraison (Cash on Delivery). Le client s'engage à régler le montant total de la commande au livreur lors de la réception du colis. Toute commande validée est ferme et définitive.</p>
            </section>

            <section>
              <h2 className="text-2xl font-impact uppercase text-white mb-4">5. Livraison</h2>
              <p>La livraison est effectuée partout au Maroc. Les délais moyens de livraison sont de 48h à 72h, pouvant aller jusqu'à 4 jours ouvrés en fonction des zones géographiques ou des périodes de forte affluence.</p>
            </section>

            <section>
              <h2 className="text-2xl font-impact uppercase text-white mb-4">6. Service Client</h2>
              <p>Pour toute question ou information, notre service client est à votre disposition via WhatsApp au numéro indiqué sur le site ou via notre page Contact.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
