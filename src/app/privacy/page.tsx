import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Politique de Confidentialité | IlyWear',
  description: 'Politique de confidentialité de la boutique IlyWear.',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-[#0A0A0A] py-24 min-h-[80vh]">
        <div className="container mx-auto px-6 max-w-4xl text-white font-sans">
          <h1 className="text-4xl md:text-6xl font-impact uppercase tracking-wider mb-12">Politique de Confidentialité</h1>
          
          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-impact uppercase text-white mb-4">1. Collecte des Données Personnelles</h2>
              <p>Lors de votre visite sur ilywear.shop et lors du passage de votre commande (nom, téléphone, adresse), nous collectons les informations strictement nécessaires au traitement et à la livraison de vos achats.</p>
            </section>

            <section>
              <h2 className="text-2xl font-impact uppercase text-white mb-4">2. Utilisation des Données</h2>
              <p>Les données que nous collectons sont utilisées exclusivement pour :</p>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-400">
                <li>Le traitement de vos commandes et livraisons.</li>
                <li>L'amélioration de l'expérience utilisateur sur notre site.</li>
                <li>La communication avec vous (suivi de commande, service client).</li>
                <li>L'envoi d'offres promotionnelles si vous y avez consenti.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-impact uppercase text-white mb-4">3. Protection et Partage des Données</h2>
              <p>Vos données personnelles sont stockées en toute sécurité. Elles ne sont partagées qu'avec nos prestataires de livraison partenaires, dans le seul but d'acheminer votre commande. Nous ne vendons en aucun cas vos informations à des tiers.</p>
            </section>

            <section>
              <h2 className="text-2xl font-impact uppercase text-white mb-4">4. Cookies</h2>
              <p>IlyWear utilise des cookies et technologies de suivi similaires (comme les Pixels publicitaires) pour analyser la fréquentation du site et optimiser nos campagnes marketing. Vous pouvez configurer votre navigateur pour refuser les cookies, bien que cela puisse affecter certaines fonctionnalités du site.</p>
            </section>

            <section>
              <h2 className="text-2xl font-impact uppercase text-white mb-4">5. Vos Droits</h2>
              <p>Vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour exercer ce droit, veuillez nous contacter via la page Contact.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
