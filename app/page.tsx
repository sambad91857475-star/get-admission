"use client";
import React, { useState } from 'react';
import { BookOpen, Search, FileText, Award, HelpCircle, Plane, MessageCircle, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [formData, setFormData] = useState({
    nomPrenom: '',
    dateNaissance: '',
    telephone: '',
    email: '',
    niveauEtudes: '',
    serieBac: '',
    paysDestination: 'France',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('pre_inscriptions')
        .insert([
          {
            nom_prenom: formData.nomPrenom,
            date_naissance: formData.dateNaissance,
            telephone: formData.telephone,
            email: formData.email,
            niveau_etudes: formData.niveauEtudes,
            serie_bac: formData.serieBac,
            pays_destination: formData.paysDestination,
            message: formData.message
          }
        ]);

      if (error) throw error;

      alert("Félicitations ! Votre demande de pré-inscription a bien été enregistrée.");
      
      setFormData({
        nomPrenom: '',
        dateNaissance: '',
        telephone: '',
        email: '',
        niveauEtudes: '',
        serieBac: '',
        paysDestination: 'France',
        message: ''
      });

    } catch (error) {
      console.error("Erreur d'inscription :", error.message);
      alert("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 relative">
      
      {/* 1. HERO SECTION */}
      <section className="bg-[#0A2540] text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-[#D4AF37] font-bold tracking-widest text-sm uppercase">
            Agence GET ADMISSION
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mt-4 mb-6 leading-tight">
            Obtenir votre admission à l’étranger en <span className="text-[#D4AF37]">toute sérénité</span>.
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            Spécialistes de l'accompagnement des étudiants pour les études en France. 
            Orientation, Campus France, et Visa Étudiant.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#pre-inscription" className="bg-[#D4AF37] hover:bg-yellow-600 text-[#0A2540] font-bold px-8 py-3 rounded-md transition duration-300 shadow-lg inline-block">
              S'inscrire en ligne
            </a>
            <button className="bg-transparent border-2 border-white hover:bg-white hover:text-[#0A2540] font-semibold px-8 py-3 rounded-md transition duration-300">
              Nous contacter
            </button>
          </div>
        </div>
      </section>

      {/* 2. STATISTIQUES */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-4">
              <p className="text-4xl font-extrabold text-[#0A2540]">98%</p>
              <p className="text-slate-500 font-medium mt-1">Taux de réussite Campus France</p>
            </div>
            <div className="p-4">
              <p className="text-4xl font-extrabold text-[#0A2540]">+500</p>
              <p className="text-slate-500 font-medium mt-1">Étudiants accompagnés</p>
            </div>
            <div className="p-4">
              <p className="text-4xl font-extrabold text-[#0A2540]">100%</p>
              <p className="text-slate-500 font-medium mt-1">Suivi personnalisé</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION NOS SERVICES */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#0A2540] mb-4">Nos Services Accompagnés</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Un suivi de A à Z pour garantir le succès de votre projet d'études en France.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="bg-amber-50 text-[#D4AF37] p-3 rounded-lg w-fit mb-6"><BookOpen className="h-6 w-6" /></div>
            <h3 className="text-xl font-bold text-[#0A2540] mb-3">Orientation Académique</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Aide à la définition de votre projet professionnel et choix des filières adaptées.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="bg-blue-50 text-[#0A2540] p-3 rounded-lg w-fit mb-6"><Search className="h-6 w-6" /></div>
            <h3 className="text-xl font-bold text-[#0A2540] mb-3">Choix des Universités</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Sélection des établissements français correspondant à votre profil et vos ambitions.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="bg-amber-50 text-[#D4AF37] p-3 rounded-lg w-fit mb-6"><FileText className="h-6 w-6" /></div>
            <h3 className="text-xl font-bold text-[#0A2540] mb-3">Dossier Campus France</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Création, optimisation et dépôt de votre dossier sur la plateforme Pastel.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="bg-blue-50 text-[#0A2540] p-3 rounded-lg w-fit mb-6"><Award className="h-6 w-6" /></div>
            <h3 className="text-xl font-bold text-[#0A2540] mb-3">Préparation Entretien</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Simulations intensives pour réussir l'entretien oral obligatoire avec les agents Campus France.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="bg-amber-50 text-[#D4AF37] p-3 rounded-lg w-fit mb-6"><HelpCircle className="h-6 w-6" /></div>
            <h3 className="text-xl font-bold text-[#0A2540] mb-3">Demande de Visa</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Assistance pour la constitution du dossier consulaire et le justificatif de blocage financier.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="bg-blue-50 text-[#0A2540] p-3 rounded-lg w-fit mb-6"><Plane className="h-6 w-6" /></div>
            <h3 className="text-xl font-bold text-[#0A2540] mb-3">Conseils avant Départ</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Briefing complet sur le logement, la sécurité sociale et les démarches administratives à l'arrivée.</p>
          </div>
        </div>
      </section>

      {/* 4. SECTION FORMULAIRE */}
      <section id="pre-inscription" className="py-25 bg-white border-t border-b border-slate-100 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A2540] mb-3">Formulaire de Pré-inscription</h2>
            <p className="text-slate-500">Remplissez ce formulaire pour qu'un conseiller de l'agence étudie votre dossier.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-slate-50 p-8 md:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#0A2540] mb-2">Nom et Prénom</label>
                <input type="text" name="nomPrenom" value={formData.nomPrenom} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0A2540] focus:outline-none bg-white" placeholder="Samba Diallo" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0A2540] mb-2">Date de naissance</label>
                <input type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0A2540] focus:outline-none bg-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#0A2540] mb-2">Téléphone</label>
                <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0A2540] focus:outline-none bg-white" placeholder="+223 ..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0A2540] mb-2">Adresse E-mail</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0A2540] focus:outline-none bg-white" placeholder="exemple@domaine.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#0A2540] mb-2">Niveau d'études actuel</label>
                <select name="niveauEtudes" value={formData.niveauEtudes} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0A2540] focus:outline-none bg-white">
                  <option value="">Sélectionnez votre niveau</option>
                  <option value="Terminale">Terminale (En cours)</option>
                  <option value="Bac">Baccalauréat obtenu</option>
                  <option value="Licence 1">Licence 1</option>
                  <option value="Licence 2">Licence 2</option>
                  <option value="Licence 3">Licence 3 / BTS / IUG</option>
                  <option value="Master">Master ou plus</option>
                  <option value="Professionnel">Professionnel en reconversion</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0A2540] mb-2">Série du Baccalauréat</label>
                <input type="text" name="serieBac" value={formData.serieBac} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0A2540] focus:outline-none bg-white" placeholder="Ex: SET, SBT, TSE, G, etc." />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0A2540] mb-2">Pays de destination</label>
              <input type="text" name="paysDestination" value={formData.paysDestination} disabled className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-200 text-slate-500 font-medium cursor-not-allowed" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0A2540] mb-2">Votre message / Projet d'études</label>
              <textarea name="message" value={formData.message} onChange={handleChange} rows="4" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0A2540] focus:outline-none bg-white" placeholder="Expliquez brièvement les filières ou universités qui vous intéressent..."></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#0A2540] hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-2 shadow disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin text-[#D4AF37]" />
              ) : (
                <Send className="h-4 w-4 text-[#D4AF37]" />
              )}
              {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande d'accompagnement"}
            </button>

          </form>
        </div>
      </section>

      {/* 5. BOUTON WHATSAPP */}
      <a 
        href="https://wa.me/22391857475" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition duration-300 z-50 flex items-center justify-center"
      >
        <MessageCircle className="h-7 w-7 fill-white text-[#25D366]" />
      </a>

    </main>
  );
}