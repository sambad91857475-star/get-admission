"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Clock, CheckCircle, RefreshCw, Filter, Lock, LogIn } from 'lucide-react';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatut, setFilterStatut] = useState('Tous');

  const ADMIN_PASSWORD = "GetAdmission2026";

  // Gestion de la connexion Admin avec typage explicite
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError('');
      fetchCandidates();
    } else {
      setLoginError('Mot de passe incorrect. Accès refusé.');
    }
  };

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pre_inscriptions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setCandidates(data || []);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string | number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('pre_inscriptions')
        .update({ statut: newStatus })
        .eq('id', id);
      if (error) throw error;
      setCandidates(candidates.map(c => c.id === id ? { ...c, statut: newStatus } : c));
    } catch (error) {
      alert("Erreur lors du changement de statut.");
    }
  };

  const total = candidates.length;
  const enAttente = candidates.filter(c => c.statut === 'En attente').length;
  const valides = candidates.filter(c => c.statut === 'Dossier Validé' || c.statut === 'Terminé').length;
  const filteredCandidates = filterStatut === 'Tous' ? candidates : candidates.filter(c => c.statut === filterStatut);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-6">
            <Lock className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-[#0A2540]">Espace Administrateur</h2>
          </div>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input 
              type="password" 
              value={passwordInput} 
              onChange={(e) => setPasswordInput(e.target.value)} 
              required 
              className="w-full px-4 py-2 border rounded-lg" 
              placeholder="Mot de passe agence" 
            />
            {loginError && <p className="text-xs text-red-600 font-medium">{loginError}</p>}
            <button type="submit" className="w-full bg-[#0A2540] text-white py-2 rounded-lg font-bold">Déverrouiller</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#0A2540]">GET ADMISSION - Dashboard</h1>
        <button onClick={() => setIsAuthenticated(false)} className="text-red-700 bg-red-50 px-4 py-2 rounded-lg border border-red-200">Fermer la session</button>
      </div>

      {/* COMPTEURS DE STATISTIQUES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Pré-inscriptions</p>
            <p className="text-3xl font-bold text-slate-900">{loading ? '...' : total}</p>
          </div>
          <div className="bg-blue-50 text-blue-600 p-3 rounded-full"><Users className="h-6 w-6" /></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Dossiers en Attente</p>
            <p className="text-3xl font-bold text-amber-600">{loading ? '...' : enAttente}</p>
          </div>
          <div className="bg-amber-50 text-amber-600 p-3 rounded-full"><Clock className="h-6 w-6" /></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Dossiers Validés / Termines</p>
            <p className="text-3xl font-bold text-emerald-600">{loading ? '...' : valides}</p>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-full"><CheckCircle className="h-6 w-6" /></div>
        </div>
      </div>

      {/* FILTRES ET EN-TÊTE TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <h3 className="font-bold text-slate-700">Liste des Candidats</h3>
          </div>
          <div className="flex gap-2">
            {['Tous', 'En attente', 'Dossier Validé', 'Entretien Préparé', 'Dépôt Visa', 'Terminé'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatut(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  filterStatut === st 
                    ? 'bg-[#0A2540] text-white border-[#0A2540]' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* TABLEAU DES DONNÉES */}
        {loading ? (
          <div className="p-10 text-center text-slate-500 flex items-center justify-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin text-[#D4AF37]" /> Chargement des données...
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="p-10 text-center text-slate-400">Aucun étudiant ne correspond à ce filtre.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100 text-slate-600 font-semibold">
                  <th className="p-4">Nom & Prénom</th>
                  <th className="p-4">Filière / Niveau</th>
                  <th className="p-4">Contacts</th>
                  <th className="p-4">Pièces Jointes</th>
                  <th className="p-4">Statut Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCandidates.map((cand) => (
                  <tr key={cand.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-semibold text-slate-900">{cand.nom_prenom}</td>
                    <td className="p-4 text-slate-600">
                      <div>{cand.niveau_etudes}</div>
                      <div className="text-xs text-slate-400">Bac: {cand.serie_bac}</div>
                    </td>
                    <td className="p-4 text-slate-600 text-xs space-y-0.5">
                      <div>📞 {cand.telephone}</div>
                      <div>✉️ {cand.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 text-xs font-medium">
                        {cand.url_passeport ? (
                          <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded w-fit">✓ Passeport</span>
                        ) : (
                          <span className="text-slate-400 bg-slate-50 px-2 py-0.5 rounded w-fit">⚠️ Passeport</span>
                        )}
                        {cand.url_diplome ? (
                          <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded w-fit">✓ Diplôme</span>
                        ) : (
                          <span className="text-slate-400 bg-slate-50 px-2 py-0.5 rounded w-fit">⚠️ Diplôme</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={cand.statut || 'En attente'}
                        onChange={(e) => handleStatusChange(cand.id, e.target.value)}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold focus:outline-none transition cursor-pointer ${
                          cand.statut === 'Terminé' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          cand.statut === 'Dépôt Visa' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          cand.statut === 'Entretien Préparé' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          cand.statut === 'Dossier Validé' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="En attente">⏳ En attente</option>
                        <option value="Dossier Validé">📂 Dossier Validé</option>
                        <option value="Entretien Préparé">🗣️ Entretien Préparé</option>
                        <option value="Dépôt Visa">🛂 Dépôt Visa</option>
                        <option value="Terminé">🎉 Terminé (Visa obtenu)</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}