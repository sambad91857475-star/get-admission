"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { GraduationCap, CheckCircle, FileText, Send, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [formData, setFormData] = useState({
    nom_prenom: '',
    email: '',
    telephone: '',
    niveau_etudes: 'Licence 1',
    serie_bac: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Typage explicite de l'événement de changement
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Typage explicite de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const { error } = await supabase
        .from('pre_inscriptions')
        .insert([{
          ...formData,
          statut: 'En attente',
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      setSubmitSuccess(true);
    } catch (error: any) {
      setErrorMsg(error.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Barre de navigation */}
      <header className="bg-[#0A2540] text-white py-4 px-6 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-[#D4AF37]" />
          <span className="font-bold text-lg tracking-wide">GET ADMISSION</span>
        </div>
        <Link href="/suivi" className="text-xs bg-[#D4AF37] hover:bg-amber-500 text-[#0A2540] font-bold py-2 px-4 rounded-lg transition flex items-center gap-1">
          Suivre mon dossier <ArrowRight className="h-3 w-3" />
        </Link>
      </header>

      {/* Contenu Principal */}
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
          {submitSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="bg-emerald-100 text-emerald-600 p-4 rounded-full w-fit mx-auto">
                <CheckCircle className="h-12 w-12" />
              </div>
              <h2 className="text-2xl font-bold text-[#0A2540]">Demande reçue avec succès !</h2>
              <p className="text-slate-600 text-sm max-w-sm mx-auto">
                Votre dossier de pré-inscription a été transmis à l'agence. Vous pouvez dès maintenant suivre son évolution dans votre espace.
              </p>
              <div className="pt-4">
                <Link href="/suivi" className="inline-flex items-center gap-2 bg-[#0A2540] text-white font-bold py-2.5 px-6 rounded-lg text-sm hover:bg-slate-800 transition">
                  <FileText className="h-4 w-4 text-[#D4AF37]" /> Accéder à mon Espace Suivi
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-[#0A2540]">Formulaire de Pré-inscription</h2>
                <p className="text-sm text-slate-500 mt-2">Initiez vos démarches d'études pour la France en quelques clics</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Nom complet (Nom & Prénom)</label>
                  <input type="text" name="nom_prenom" value={formData.nom_prenom} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0A2540] focus:outline-none" placeholder="Ex: Samba Diallo" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Adresse E-mail</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0A2540] focus:outline-none" placeholder="adresse@mail.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Téléphone (WhatsApp)</label>
                    <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0A2540] focus:outline-none" placeholder="+223..." />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Niveau d'études visé</label>
                    <select name="niveau_etudes" value={formData.niveau_etudes} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#0A2540] focus:outline-none">
                      <option value="Licence 1">Licence 1 (Bac requis)</option>
                      <option value="Licence 2">Licence 2</option>
                      <option value="Licence 3">Licence 3</option>
                      <option value="Master 1">Master 1</option>
                      <option value="Master 2">Master 2</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Série du Baccalauréat</label>
                    <input type="text" name="serie_bac" value={formData.serie_bac} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0A2540] focus:outline-none" placeholder="Ex: TSE, SE, LL, G" />
                  </div>
                </div>

                {errorMsg && <p className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 font-medium">{errorMsg}</p>}

                <button type="submit" disabled={isSubmitting} className="w-full bg-[#0A2540] hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 text-sm shadow-md">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Traitement en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 text-[#D4AF37]" /> Soumettre ma candidature
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </main>

      {/* Pied de page */}
      <footer className="bg-slate-900 text-slate-400 text-center py-4 text-xs border-t border-slate-800">
        &copy; {new Date().getFullYear()} GET ADMISSION. Tous droits réservés.
      </footer>
    </div>
  );
}