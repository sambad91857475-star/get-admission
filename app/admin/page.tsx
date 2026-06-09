"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Clock, CheckCircle, RefreshCw, Filter, Lock, LogIn } from 'lucide-react';

export default function AdminDashboard() {
  // --- ÉTATS POUR LA SÉCURITÉ ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // --- ÉTATS POUR LES DONNÉES ---
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatut, setFilterStatut] = useState('Tous');

  // Mot de passe de l'agence (Tu pourras le changer ici)
  const ADMIN_PASSWORD = "GetAdmission2026";

  // Gestion de la connexion Admin
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError('');
      fetchCandidates(); // On charge les données seulement si le mot de passe est bon
    } else {
      setLoginError('Mot de passe incorrect. Accès refusé.');
    }
  };

  // Fonction pour récupérer les données depuis Supabase
  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pre_inscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCandidates(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération :", error.message);
      alert("Impossible de charger les données.");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour mettre à jour le statut d'un étudiant
  const handleStatusChange = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('pre_inscriptions')
        .update({ statut: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      // Mettre à jour l'affichage localement
      setCandidates(candidates.map(c => c.id === id ? { ...c, statut: newStatus } : c));
    } catch (error) {
      console.error("Erreur de mise à jour :", error.message);
      alert("Erreur lors du changement de statut.");
    }
  };

  // Calculs des compteurs statistiques
  const total = candidates.length;
  const enAttente = candidates.filter(c => c.statut === 'En attente').length;
  const valides = candidates.filter(c => c.statut === 'Dossier Validé' || c.statut === 'Terminé').length;

  // Filtrage de la liste visible
  const filteredCandidates = filterStatut === 'Tous' 
    ? candidates 
    : candidates.filter(c => c.statut === filterStatut);


  // ─── RENDU 1 : ÉCRAN DE VÉRIFICATION DU MOT DE PASSE ───
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl border border-slate-200">
          <div className="text-center mb-6">
            <div className="bg-red-50 text-red-600 p-3 rounded-full w-fit mx-auto mb-3 border border-red-100">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#0A2540]">Espace Administrateur</h2>
            <p className="text-sm text-slate-500 mt-1">Cet espace est réservé au personnel de l'agence GET ADMISSION.</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Mot de passe Agence</label>
              <input 
                type="password" 
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)}
                required 
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0A2540] focus:outline-none text-sm font-medium tracking-wide bg-slate-50" 
                placeholder="••••••••••••"
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded border border-red-200 font-medium">{loginError}</p>
            )}

            <button type="submit" className="w-full bg-[#0A2540] hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg transition flex items-center justify-center gap-2 text-sm shadow-md">
              <LogIn className="h-4 w-4 text-[#D4AF37]" />
              Déverrouiller le Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── RENDU 2 : LE DASHBOARD COMPLET (S'affiche uniquement si connecté) ───
  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0A2540]">GET ADMISSION - Dashboard Admin</h1>
          <p className="text-slate-500 mt-1">Gestion et suivi des demandes de pré-inscription des étudiants.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchCandidates}
            className="bg-white hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2 transition"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          <button 
            onClick={() => { setIsAuthenticated(false); setPasswordInput(''); }}
            className="bg-red-50 hover:bg-red-100 text-red-700 font-semibold px-4 py-2 rounded-lg border border-red-200 shadow-sm text-sm transition"
          >
            Fermer la session
          </button>
        </div>
      </div>

      {/* CARTES STATISTIQUES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-blue-50 text-[#0A2540] p-3 rounded-lg"><Users className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Demandes</p>
            <p className="text-2xl font-bold text-[#0A2540]">{total}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-amber-50 text-amber-600 p-3 rounded-lg"><Clock className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">En attente de traitement</p>
            <p className="text-2xl font-bold text-amber-600">{enAttente}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg"><CheckCircle className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">Dossiers Approuvés</p>
            <p className="text-2xl font-bold text-emerald-600">{valides}</p>
          </div>
        </div>
      </div>

      {/* FILTRES & TABLEAU */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Barre de Filtre */}
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-600">Filtrer par statut :</span>
          <select 
            value={filterStatut} 
            onChange={(e) => setFilterStatut(e.target.value)}
            className="text-sm px-3 py-1.5 rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
          >
            <option value="Tous">Tous les dossiers</option>
            <option value="En attente">En attente</option>
            <option value="Dossier Validé">Dossier Validé</option>
            <option value="Entretien Préparé">Entretien Préparé</option>
            <option value="Dépôt Visa">Dépôt Visa</option>
            <option value="Terminé">Terminé</option>
          </select>
        </div>

        {/* Tableau des candidatures */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 text-center text-slate-500">Chargement des dossiers étudiants...</div>
          ) : filteredCandidates.length === 0 ? (
            <div className="p-10 text-center text-slate-500">Aucun dossier trouvé pour ce filtre.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-xs uppercase font-semibold tracking-wider border-b border-slate-100">
                  <th className="p-4">Étudiant</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Cursus / Série</th>
                  <th className="p-4">Statut Actuel</th>
                  <th className="p-4 text-right">Actions de Gestion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-4 font-semibold text-[#0A2540]">{candidate.nom_prenom}</td>
                    <td className="p-4 text-slate-600">
                      <div>{candidate.telephone}</div>
                      <div className="text-xs text-slate-400">{candidate.email}</div>
                    </td>
                    <td className="p-4 text-slate-600">
                      <div>{candidate.niveau_etudes}</div>
                      <div className="text-xs text-slate-400">Série : {candidate.serie_bac}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${candidate.statut === 'En attente' ? 'bg-amber-50 text-amber-700 border border-amber-200' : ''}
                        ${candidate.statut === 'Dossier Validé' ? 'bg-blue-50 text-blue-700 border border-blue-200' : ''}
                        ${candidate.statut === 'Entretien Préparé' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : ''}
                        ${candidate.statut === 'Dépôt Visa' ? 'bg-purple-50 text-purple-700 border border-purple-200' : ''}
                        ${candidate.statut === 'Terminé' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : ''}
                      `}>
                        {candidate.statut || 'En attente'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={candidate.statut || 'En attente'}
                        onChange={(e) => handleStatusChange(candidate.id, e.target.value)}
                        className="text-xs px-2 py-1 rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#0A2540] font-medium"
                      >
                        <option value="En attente">Mettre En attente</option>
                        <option value="Dossier Validé">Valider le Dossier</option>
                        <option value="Entretien Préparé">Entretien Préparé</option>
                        <option value="Dépôt Visa">Dossier au Visa</option>
                        <option value="Terminé">Clôturer / Terminé</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}