"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LogIn, GraduationCap, CheckCircle, Clock, FileText, Compass, Award, Upload, FileCheck, Loader2 } from 'lucide-react';

export default function StudentSuivi() {
  const [credentials, setCredentials] = useState({ email: '', telephone: '' });
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState({ passeport: false, diplome: false, bulletins: false });
  const [errorMsg, setErrorMsg] = useState('');

  const steps = [
    { label: "En attente", desc: "Votre formulaire a été reçu par l'agence.", icon: Clock },
    { label: "Dossier Validé", desc: "Analyse documentaire OK. Choix des universités validé.", icon: FileText },
    { label: "Entretien Préparé", desc: "Simulations terminées. Prêt pour l'oral Campus France.", icon: Compass },
    { label: "Dépôt Visa", desc: "Dossier consulaire déposé auprès de TLS/Consulat.", icon: Award },
    { label: "Terminé", desc: "Visa obtenu ! Bon voyage et succès dans vos études.", icon: CheckCircle }
  ];

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase
        .from('pre_inscriptions')
        .select('*')
        .eq('email', credentials.email.trim())
        .eq('telephone', credentials.telephone.trim())
        .single();

      if (error || !data) throw new Error("Aucun dossier trouvé avec ces identifiants.");
      setStudent(data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fonction universelle pour gérer l'upload d'un fichier
  const handleFileUpload = async (e, typeDoc) => {
    const file = e.target.files[0];
    if (!file) return;

    // Limitation de taille à 5 Mo
    if (file.size > 5 * 1024 * 1024) {
      alert("Le fichier est trop lourd. Limite maximale : 5 Mo.");
      return;
    }

    setUploading({ ...uploading, [typeDoc]: true });

    try {
      // 1. Définir un nom de fichier unique : exemple "12345-passeport-cv.pdf"
      const fileExt = file.name.split('.').pop();
      const fileName = `${student.id}-${typeDoc}.${fileExt}`;
      const filePath = `${fileName}`;

      // 2. Envoyer le fichier dans le Bucket de Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('documents_etudiants')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 3. Mettre à jour la ligne SQL de l'étudiant avec le chemin du fichier
      const columnUpdate = {};
      columnUpdate[`url_${typeDoc}`] = filePath;

      const { error: dbError } = await supabase
        .from('pre_inscriptions')
        .update(columnUpdate)
        .eq('id', student.id);

      if (dbError) throw dbError;

      // Mettre à jour l'état local pour afficher le succès visuel
      setStudent({ ...student, ...columnUpdate });
      alert("Document téléversé avec succès !");

    } catch (error) {
      console.error("Erreur upload:", error.message);
      alert("Échec de l'envoi du document.");
    } finally {
      setUploading({ ...uploading, [typeDoc]: false });
    }
  };

  const currentStepIndex = steps.findIndex(step => step.label === (student?.statut || "En attente"));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6">
      
      {!student ? (
        /* ÉCRAN DE CONNEXION */
        <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
          <div className="text-center mb-6">
            <div className="bg-[#0A2540] text-white p-3 rounded-full w-fit mx-auto mb-3">
              <GraduationCap className="h-6 w-6 text-[#D4AF37]" />
            </div>
            <h2 className="text-2xl font-bold text-[#0A2540]">Espace Étudiant</h2>
            <p className="text-sm text-slate-500 mt-1">Suivez l'avancement de votre dossier Campus France</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Adresse E-mail</label>
              <input type="email" name="email" value={credentials.email} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none text-sm" placeholder="exemple@domaine.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Numéro de Téléphone</label>
              <input type="text" name="telephone" value={credentials.telephone} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none text-sm" placeholder="+223..." />
            </div>

            {errorMsg && <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded border border-red-200 font-medium">{errorMsg}</p>}

            <button type="submit" disabled={loading} className="w-full bg-[#0A2540] hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg transition flex items-center justify-center gap-2 text-sm">
              <LogIn className="h-4 w-4 text-[#D4AF37]" />
              {loading ? "Vérification..." : "Accéder à mon espace"}
            </button>
          </form>
        </div>
      ) : (
        /* INTERFACE COMPLÈTE ÉTUDIANT */
        <div className="max-w-3xl mx-auto w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-6 md:p-10 space-y-10">
          
          {/* Entête profil */}
          <div className="border-b border-slate-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Suivi de dossier</span>
              <h2 className="text-3xl font-extrabold text-[#0A2540] mt-1">{student.nom_prenom}</h2>
              <p className="text-sm text-slate-500 mt-1">Filière d'études : <span className="font-semibold text-slate-700">{student.niveau_etudes} ({student.serie_bac})</span></p>
            </div>
            <button onClick={() => setStudent(null)} className="text-xs font-medium text-slate-400 hover:text-red-500 transition border border-slate-200 px-3 py-1.5 rounded-md">
              Se déconnecter
            </button>
          </div>

          {/* FRISE CHRONOLOGIQUE */}
          <div>
            <h3 className="text-lg font-bold text-[#0A2540] mb-6">Évolution de vos démarches :</h3>
            <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-4">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                const isPastOrCurrent = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={index} className="relative pl-8">
                    <span className={`absolute -left-[17px] top-0.5 rounded-full p-1.5 flex items-center justify-center border-2 transition
                      ${isCurrent ? 'bg-[#0A2540] text-[#D4AF37] border-[#0A2540] scale-110 shadow-md' : ''}
                      ${isPastOrCurrent && !isCurrent ? 'bg-emerald-500 text-white border-emerald-500' : ''}
                      ${!isPastOrCurrent ? 'bg-white text-slate-300 border-slate-200' : ''}
                    `}>
                      <IconComponent className="h-4 w-4" />
                    </span>
                    <div>
                      <h4 className={`text-base font-bold transition ${isCurrent ? 'text-[#0A2540]' : ''} ${isPastOrCurrent && !isCurrent ? 'text-emerald-600' : ''} ${!isPastOrCurrent ? 'text-slate-400' : ''}`}>
                        {step.label} {isCurrent && <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded ml-2 font-semibold">Actuel</span>}
                      </h4>
                      <p className={`text-sm mt-0.5 ${isPastOrCurrent ? 'text-slate-600' : 'text-slate-400'}`}>{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ZONE DE TÉLÉVERSEMENT DES DOCUMENTS */}
          <div className="border-t border-slate-100 pt-8">
            <h3 className="text-lg font-bold text-[#0A2540] mb-2">Pièces justificatives requises</h3>
            <p className="text-sm text-slate-500 mb-6">Ajoutez vos documents au format PDF ou Image (Max 5 Mo) pour validation par l'agence.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Document 1 : Passeport */}
              <div className="border border-slate-200 p-4 rounded-xl bg-slate-50 flex flex-col justify-between items-center text-center">
                <span className="text-sm font-semibold text-slate-700">Pièce d'identité / Passeport</span>
                <div className="my-4">
                  {student.url_passeport ? (
                    <div className="text-emerald-600 flex flex-col items-center gap-1"><FileCheck className="h-8 w-8" /><span className="text-xs font-medium">Ajouté</span></div>
                  ) : (
                    <div className="text-slate-300"><Upload className="h-8 w-8" /></div>
                  )}
                </div>
                <label className="w-full bg-[#0A2540] hover:bg-slate-800 text-white text-xs font-bold py-2 px-3 rounded-lg cursor-pointer transition flex items-center justify-center gap-1 disabled:bg-slate-400">
                  {uploading.passeport ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                  {student.url_passeport ? "Remplacer" : "Choisir un fichier"}
                  <input type="file" accept=".pdf,image/*" onChange={(e) => handleFileUpload(e, 'passeport')} disabled={uploading.passeport} className="hidden" />
                </label>
              </div>

              {/* Document 2 : Diplôme */}
              <div className="border border-slate-200 p-4 rounded-xl bg-slate-50 flex flex-col justify-between items-center text-center">
                <span className="text-sm font-semibold text-slate-700">Dernier Diplôme / Attestation</span>
                <div className="my-4">
                  {student.url_diplome ? (
                    <div className="text-emerald-600 flex flex-col items-center gap-1"><FileCheck className="h-8 w-8" /><span className="text-xs font-medium">Ajouté</span></div>
                  ) : (
                    <div className="text-slate-300"><Upload className="h-8 w-8" /></div>
                  )}
                </div>
                <label className="w-full bg-[#0A2540] hover:bg-slate-800 text-white text-xs font-bold py-2 px-3 rounded-lg cursor-pointer transition flex items-center justify-center gap-1">
                  {uploading.diplome ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                  {student.url_diplome ? "Remplacer" : "Choisir un fichier"}
                  <input type="file" accept=".pdf,image/*" onChange={(e) => handleFileUpload(e, 'diplome')} disabled={uploading.diplome} className="hidden" />
                </label>
              </div>

              {/* Document 3 : Bulletins */}
              <div className="border border-slate-200 p-4 rounded-xl bg-slate-50 flex flex-col justify-between items-center text-center">
                <span className="text-sm font-semibold text-slate-700">Relevés de notes / Bulletins</span>
                <div className="my-4">
                  {student.url_bulletins ? (
                    <div className="text-emerald-600 flex flex-col items-center gap-1"><FileCheck className="h-8 w-8" /><span className="text-xs font-medium">Ajouté</span></div>
                  ) : (
                    <div className="text-slate-300"><Upload className="h-8 w-8" /></div>
                  )}
                </div>
                <label className="w-full bg-[#0A2540] hover:bg-slate-800 text-white text-xs font-bold py-2 px-3 rounded-lg cursor-pointer transition flex items-center justify-center gap-1">
                  {uploading.bulletins ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                  {student.url_bulletins ? "Remplacer" : "Choisir un fichier"}
                  <input type="file" accept=".pdf,image/*" onChange={(e) => handleFileUpload(e, 'bulletins')} disabled={uploading.bulletins} className="hidden" />
                </label>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}