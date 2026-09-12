const sb = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

const ICONES = {
  'Transport': 'directions_car',
  'Location': 'car_rental',
  'Hébergement': 'hotel',
  'Activité': 'confirmation_number',
  'Repas': 'restaurant',
  'Autre': 'push_pin'
};

const ICONES_TRANSPORT = {
  'Avion': 'flight',
  'Train': 'train',
  'Voiture': 'directions_car',
  'Bus': 'directions_bus',
  'Bateau': 'directions_boat',
  'Autre': 'more_horiz'
};

let etapes = [];
let voyageurs = [];
let chambresForm = [];
let peutEditer = false;
let estAdmin = false;
let monVoyageurNom = null;
let utilisateursAdmin = [];

function genId() {
  return 'c' + Math.random().toString(36).slice(2, 9);
}

function vide(v) {
  return (v === '' || v === undefined) ? null : v;
}

function heureCourte(t) {
  return t ? t.slice(0, 5) : '';
}

document.querySelectorAll('.tab-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    if (btn.dataset.tab === 'budget') afficherBudget();
    if (btn.dataset.tab === 'admin') chargerUtilisateursAdmin();
  });
});

// Sélection du type principal (pastilles)
document.querySelectorAll('#chips-type .chip').forEach(function (chip) {
  chip.addEventListener('click', function () {
    document.querySelectorAll('#chips-type .chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    document.getElementById('etape-type').value = chip.dataset.type;

    const wrap = document.getElementById('chips-soustype-wrap');
    const wrapLieuArrivee = document.getElementById('champ-lieu-arrivee-wrap');
    if (chip.dataset.type === 'Transport') {
      wrap.classList.remove('hidden');
      wrapLieuArrivee.classList.remove('hidden');
    } else if (chip.dataset.type === 'Location') {
      wrap.classList.add('hidden');
      wrapLieuArrivee.classList.remove('hidden');
      document.getElementById('etape-sousType').value = '';
      document.querySelectorAll('#chips-soustype .chip').forEach(c => c.classList.remove('active'));
    } else {
      wrap.classList.add('hidden');
      wrapLieuArrivee.classList.add('hidden');
      document.getElementById('etape-sousType').value = '';
      document.getElementById('etape-lieuArrivee').value = '';
      document.querySelectorAll('#chips-soustype .chip').forEach(c => c.classList.remove('active'));
    }

    const blocPrixVoyageurs = document.getElementById('bloc-prix-voyageurs');
    const blocChambres = document.getElementById('bloc-chambres');
    if (chip.dataset.type === 'Hébergement') {
      blocChambres.classList.remove('hidden');
      blocPrixVoyageurs.classList.add('hidden');
      if (chambresForm.length === 0) ajouterChambre();
    } else {
      blocChambres.classList.add('hidden');
      blocPrixVoyageurs.classList.remove('hidden');
    }
  });
});

// Sélection du mode de transport (sous-pastilles)
document.querySelectorAll('#chips-soustype .chip').forEach(function (chip) {
  chip.addEventListener('click', function () {
    document.querySelectorAll('#chips-soustype .chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    document.getElementById('etape-sousType').value = chip.dataset.soustype;
  });
});

// ---- Chargement des données ----

function mapEtapeFromDb(row) {
  return {
    id: row.id,
    type: row.type,
    sousType: row.sous_type,
    titre: row.titre,
    lieu: row.lieu,
    lieuArrivee: row.lieu_arrivee,
    dateDebut: row.date_debut,
    heureDebut: heureCourte(row.heure_debut),
    dateFin: row.date_fin,
    heureFin: heureCourte(row.heure_fin),
    details: row.details,
    lien: row.lien,
    prix: row.prix,
    payeurId: row.payeur_id,
    voyageurIds: (row.voyage_etape_voyageurs || []).map(function (v) { return v.voyageur_id; }),
    chambres: (row.voyage_chambres || []).map(function (c) {
      return {
        id: c.id,
        prix: c.prix,
        payeurId: c.payeur_id,
        voyageurIds: (c.voyage_chambre_voyageurs || []).map(function (v) { return v.voyageur_id; })
      };
    })
  };
}

async function chargerEtapes() {
  const { data, error } = await sb
    .from('voyage_etapes')
    .select(`
      id, type, sous_type, titre, lieu, lieu_arrivee, date_debut, heure_debut, date_fin, heure_fin, details, lien, prix, payeur_id,
      voyage_etape_voyageurs ( voyageur_id ),
      voyage_chambres ( id, prix, payeur_id, voyage_chambre_voyageurs ( voyageur_id ) )
    `)
    .order('date_debut', { ascending: true })
    .order('heure_debut', { ascending: true });

  if (error) {
    console.error(error);
    alert('Erreur de chargement des étapes : ' + error.message);
    return;
  }

  etapes = data.map(mapEtapeFromDb);
  afficherListeSaisie();
  afficherVoyage();
}

async function chargerVoyageurs() {
  const { data, error } = await sb
    .from('voyage_voyageurs')
    .select('id, nom')
    .order('created_at', { ascending: true });

  if (error) {
    console.error(error);
    alert('Erreur de chargement des voyageurs : ' + error.message);
    return;
  }

  voyageurs = data;
  afficherChipsVoyageurs();
  afficherListeVoyageurs();
  renderChambresForm();
  remplirSelectVoyageursAdmin();
  remplirSelectPayeur();
}

function remplirSelectPayeur() {
  const select = document.getElementById('etape-payeur');
  if (!select) return;
  const valeurActuelle = select.value;
  select.innerHTML = '<option value="">— Non précisé —</option>' +
    voyageurs.map(function (v) { return '<option value="' + v.id + '">' + escapeHTML(v.nom) + '</option>'; }).join('');
  select.value = valeurActuelle;
}

function formaterDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

function ligneHoraire(e) {
  let s = e.heureDebut || '';
  if (e.dateFin && e.dateFin !== e.dateDebut) {
    s += ' → ' + formaterDate(e.dateFin) + (e.heureFin ? ' ' + e.heureFin : '');
  } else if (e.heureFin) {
    s += ' → ' + e.heureFin;
  }
  return s;
}

function iconePour(e) {
  if (e.type === 'Transport' && e.sousType && ICONES_TRANSPORT[e.sousType]) {
    return ICONES_TRANSPORT[e.sousType];
  }
  return ICONES[e.type] || 'push_pin';
}

function libellePour(e) {
  if (e.type === 'Transport' && e.sousType) {
    return e.sousType;
  }
  return e.type;
}

function urlCartePour(e) {
  const cle = window.MAPS_API_KEY;
  if (!cle) return null;

  if (e.type === 'Transport' && e.lieu && e.lieuArrivee) {
    // L'API Maps Embed ne sait tracer que des itinéraires de surface
    // (voiture, vélo, marche, transport en commun) — pas de vol ni de traversée maritime.
    if (e.sousType === 'Avion' || e.sousType === 'Bateau') {
      return 'https://www.google.com/maps/embed/v1/place?key=' + cle +
        '&q=' + encodeURIComponent(e.lieuArrivee);
    }
    const mode = (e.sousType === 'Train') ? 'transit' : 'driving';
    return 'https://www.google.com/maps/embed/v1/directions?key=' + cle +
      '&origin=' + encodeURIComponent(e.lieu) +
      '&destination=' + encodeURIComponent(e.lieuArrivee) +
      '&mode=' + mode;
  }
  if (e.type === 'Location' && e.lieu && e.lieuArrivee) {
    return 'https://www.google.com/maps/embed/v1/directions?key=' + cle +
      '&origin=' + encodeURIComponent(e.lieu) +
      '&destination=' + encodeURIComponent(e.lieuArrivee) +
      '&mode=driving';
  }
  if (e.lieu) {
    return 'https://www.google.com/maps/embed/v1/place?key=' + cle +
      '&q=' + encodeURIComponent(e.lieu);
  }
  return null;
}

function toggleCarte(id, contexte) {
  const conteneur = document.getElementById('carte-map-' + contexte + '-' + id);
  if (!conteneur) return;
  const ouverte = !conteneur.classList.contains('hidden');
  if (ouverte) {
    conteneur.classList.add('hidden');
    conteneur.innerHTML = '';
    return;
  }
  const e = etapes.find(function (x) { return x.id === id; });
  const url = e ? urlCartePour(e) : null;
  if (!url) return;
  conteneur.innerHTML = '<iframe src="' + url + '" loading="lazy" allowfullscreen></iframe>';
  conteneur.classList.remove('hidden');
}

function nomVoyageur(id) {
  const v = voyageurs.find(function (x) { return x.id === id; });
  return v ? v.nom : null;
}

function nomsVoyageursPour(e) {
  return (e.voyageurIds || []).map(nomVoyageur).filter(Boolean);
}

/** Renvoie les lignes de coût d'une étape : une par chambre pour un hébergement, une seule sinon */
function lignesCoutPour(e) {
  if (e.type === 'Hébergement') {
    return (e.chambres || [])
      .filter(function (c) { return c.prix; })
      .map(function (c, i) {
        return { prix: parseFloat(c.prix), ids: c.voyageurIds || [], payeurId: c.payeurId || null, titre: e.titre + ' — Chambre ' + (i + 1) };
      });
  }
  if (e.prix) {
    return [{ prix: parseFloat(e.prix), ids: e.voyageurIds || [], payeurId: e.payeurId || null, titre: e.titre }];
  }
  return [];
}

function prixTotalPour(e) {
  return lignesCoutPour(e).reduce(function (s, l) { return s + l.prix; }, 0);
}

function formaterPrix(prix) {
  const n = parseFloat(prix);
  if (isNaN(n)) return '';
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function carteHTML(e, avecActions, contexte) {
  const aUneCarte = !!(e.lieu || e.lieuArrivee);
  const prixTotal = prixTotalPour(e);
  const estHebergement = e.type === 'Hébergement';
  const chambres = estHebergement ? (e.chambres || []) : [];
  const noms = estHebergement ? [] : nomsVoyageursPour(e);

  const detailVoyageursHtml = estHebergement
    ? (chambres.length ? '<div class="carte-chambres">' + chambres.map(function (c, i) {
        const nomsChambre = (c.voyageurIds || []).map(nomVoyageur).filter(Boolean);
        return '<div class="ligne-chambre-carte"><span class="chambre-num">Chambre ' + (i + 1) + '</span>' +
          (c.prix ? '<span class="chambre-prix">' + formaterPrix(c.prix) + '</span>' : '') +
          (nomsChambre.length ? nomsChambre.map(function (n) { return '<span class="badge-voyageur">' + escapeHTML(n) + '</span>'; }).join('') : '') +
          '</div>';
      }).join('') + '</div>' : '')
    : (noms.length ? '<div class="carte-voyageurs">' + noms.map(function (n) { return '<span class="badge-voyageur">' + escapeHTML(n) + '</span>'; }).join('') + '</div>' : '');

  return '' +
    '<div class="carte ' + e.type + '">' +
    '  <div class="carte-icone"><span class="material-symbols-rounded">' + iconePour(e) + '</span></div>' +
    '  <div class="carte-body">' +
    '    <div class="carte-top">' +
    '      <span class="carte-type">' + libellePour(e) + '</span>' +
    '      <span style="display:flex; gap:6px; align-items:center;">' +
    (prixTotal ? '<span class="carte-prix">' + formaterPrix(prixTotal) + '</span>' : '') +
    '      <span class="carte-heure">' + ligneHoraire(e) + '</span>' +
    '      </span>' +
    '    </div>' +
    '    <div class="carte-titre">' + escapeHTML(e.titre) + '</div>' +
    (e.lieu ? '<div class="carte-lieu"><span class="material-symbols-rounded">place</span> ' + escapeHTML(e.lieu) +
      (e.lieuArrivee ? ' → ' + escapeHTML(e.lieuArrivee) : '') + '</div>' : '') +
    (e.details ? '<div class="carte-details">' + escapeHTML(e.details) + '</div>' : '') +
    detailVoyageursHtml +
    '    <div class="carte-actions">' +
    (aUneCarte ? '      <button onclick="toggleCarte(\'' + e.id + '\',\'' + contexte + '\')"><span class="material-symbols-rounded">map</span> Voir la carte</button>' : '') +
    (e.lien ? '      <a class="lien-reservation" href="' + escapeHTML(e.lien) + '" target="_blank" rel="noopener"><span class="material-symbols-rounded">confirmation_number</span> Réservation</a>' : '') +
    (avecActions ?
      '      <button onclick="modifierEtape(\'' + e.id + '\')">Modifier</button>' +
      '      <button class="del" onclick="supprimerEtape(\'' + e.id + '\')">Supprimer</button>' : '') +
    '    </div>' +
    (aUneCarte ? '    <div id="carte-map-' + contexte + '-' + e.id + '" class="carte-map hidden"></div>' : '') +
    '  </div>' +
    '</div>';
}

function escapeHTML(str) {
  if (!str) return '';
  const d = document.createElement('div');
  d.innerText = str;
  return d.innerHTML;
}

function afficherListeSaisie() {
  const cible = document.getElementById('liste-saisie');
  if (etapes.length === 0) {
    cible.innerHTML = '<div class="vide">Aucune étape saisie pour le moment.</div>';
    return;
  }
  cible.innerHTML = etapes.map(function (e) { return carteHTML(e, peutEditer, 'saisie'); }).join('');
}

function afficherVoyage() {
  const cible = document.getElementById('liste-voyage');
  if (etapes.length === 0) {
    cible.innerHTML = '<div class="vide">Rien à afficher : ajoutez des étapes dans l\'onglet Saisie.</div>';
    return;
  }
  let html = '';
  let jourCourant = null;
  etapes.forEach(function (e) {
    if (e.dateDebut !== jourCourant) {
      jourCourant = e.dateDebut;
      html += '<div class="jour-titre">' + formaterDate(jourCourant) + '</div>';
    }
    html += carteHTML(e, peutEditer, 'voyage');
  });
  cible.innerHTML = html;
}

function selectionnerChip(container, valeur, attribut) {
  container.querySelectorAll('.chip').forEach(function (c) {
    c.classList.toggle('active', c.dataset[attribut] === valeur);
  });
}

// ---- Voyageurs concernés (pastilles à cocher dans le formulaire d'étape) ----

function afficherChipsVoyageurs(selectionnes) {
  selectionnes = selectionnes || [];
  const cible = document.getElementById('chips-voyageurs');
  const hint = document.getElementById('voyageurs-vide-hint');
  if (voyageurs.length === 0) {
    cible.innerHTML = '';
    hint.classList.remove('hidden');
    return;
  }
  hint.classList.add('hidden');
  cible.innerHTML = voyageurs.map(function (v) {
    const actif = selectionnes.indexOf(v.id) !== -1;
    return '<button type="button" class="chip voyageur' + (actif ? ' active' : '') + '" data-voyageur="' + v.id + '">' +
      '<span class="material-symbols-rounded">person</span><span>' + escapeHTML(v.nom) + '</span></button>';
  }).join('');

  cible.querySelectorAll('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      chip.classList.toggle('active');
    });
  });
}

function voyageursSelectionnes() {
  return Array.from(document.querySelectorAll('#chips-voyageurs .chip.active'))
    .map(function (c) { return c.dataset.voyageur; });
}

// ---- Chambres (formulaire hébergement) ----

function ajouterChambre() {
  chambresForm.push({ clientId: genId(), prix: '', payeur: '', voyageurs: [] });
  renderChambresForm();
}

function supprimerChambreForm(clientId) {
  chambresForm = chambresForm.filter(function (c) { return c.clientId !== clientId; });
  renderChambresForm();
}

function majPrixChambre(clientId, valeur) {
  const c = chambresForm.find(function (x) { return x.clientId === clientId; });
  if (c) c.prix = valeur;
}

function majPayeurChambre(clientId, valeur) {
  const c = chambresForm.find(function (x) { return x.clientId === clientId; });
  if (c) c.payeur = valeur;
}

function toggleVoyageurChambre(clientId, voyageurId) {
  const c = chambresForm.find(function (x) { return x.clientId === clientId; });
  if (!c) return;
  const idx = c.voyageurs.indexOf(voyageurId);
  if (idx === -1) c.voyageurs.push(voyageurId); else c.voyageurs.splice(idx, 1);
  renderChambresForm();
}

function renderChambresForm() {
  const cible = document.getElementById('chambres-liste');
  if (!cible) return;
  if (chambresForm.length === 0) {
    cible.innerHTML = '<p class="hint">Aucune chambre ajoutée pour le moment.</p>';
    return;
  }
  cible.innerHTML = chambresForm.map(function (c, i) {
    const chipsHtml = voyageurs.length
      ? voyageurs.map(function (v) {
          const actif = c.voyageurs.indexOf(v.id) !== -1;
          return '<button type="button" class="chip voyageur' + (actif ? ' active' : '') + '" onclick="toggleVoyageurChambre(\'' + c.clientId + '\',\'' + v.id + '\')">' +
            '<span class="material-symbols-rounded">person</span><span>' + escapeHTML(v.nom) + '</span></button>';
        }).join('')
      : '<p class="hint">Ajoute des voyageurs dans l\'onglet « Voyageurs » pour pouvoir les cocher ici.</p>';

    const optionsPayeur = '<option value="">— Non précisé —</option>' +
      voyageurs.map(function (v) { return '<option value="' + v.id + '"' + (c.payeur === v.id ? ' selected' : '') + '>' + escapeHTML(v.nom) + '</option>'; }).join('');

    return '<div class="chambre-bloc">' +
      '  <div class="chambre-entete"><span>Chambre ' + (i + 1) + '</span>' +
      '    <button type="button" class="del-chambre" onclick="supprimerChambreForm(\'' + c.clientId + '\')"><span class="material-symbols-rounded">delete</span></button>' +
      '  </div>' +
      '  <label>Prix (€)<input type="number" step="0.01" min="0" value="' + (c.prix || '') + '" oninput="majPrixChambre(\'' + c.clientId + '\', this.value)" placeholder="Ex : 89.00"></label>' +
      '  <label>Payé par<select onchange="majPayeurChambre(\'' + c.clientId + '\', this.value)">' + optionsPayeur + '</select></label>' +
      '  <label>Voyageurs</label>' +
      '  <div class="chips">' + chipsHtml + '</div>' +
      '</div>';
  }).join('');
}

document.getElementById('btn-ajouter-chambre').addEventListener('click', ajouterChambre);

// ---- Onglet Voyageurs ----

function afficherListeVoyageurs() {
  const cible = document.getElementById('liste-voyageurs');
  if (voyageurs.length === 0) {
    cible.innerHTML = '<div class="vide">Aucun voyageur ajouté pour le moment.</div>';
    return;
  }
  cible.innerHTML = voyageurs.map(function (v) {
    return '<div class="ligne-voyageur"><span class="nom">' + escapeHTML(v.nom) + '</span>' +
      (peutEditer ? '<button onclick="supprimerVoyageur(\'' + v.id + '\')">Supprimer</button>' : '') + '</div>';
  }).join('');
}

document.getElementById('form-voyageur').addEventListener('submit', async function (evt) {
  evt.preventDefault();
  const nom = document.getElementById('voyageur-nom').value.trim();
  if (!nom) return;

  const { error } = await sb.from('voyage_voyageurs').insert({ nom: nom });
  if (error) {
    alert('Erreur : ' + error.message);
    return;
  }
  document.getElementById('form-voyageur').reset();
  await chargerVoyageurs();
});

async function supprimerVoyageur(id) {
  if (!confirm('Supprimer ce voyageur ? Il sera retiré des étapes et chambres qui le mentionnaient.')) return;
  const { error } = await sb.from('voyage_voyageurs').delete().eq('id', id);
  if (error) {
    alert('Erreur : ' + error.message);
    return;
  }
  await chargerVoyageurs();
  await chargerEtapes();
}

// ---- Onglet Budget ----

function afficherBudget() {
  const cible = document.getElementById('budget-contenu');

  if (voyageurs.length === 0) {
    cible.innerHTML = '<div class="vide">Ajoute des voyageurs dans l\'onglet « Voyageurs » pour voir le budget.</div>';
    return;
  }

  const totalDu = {};
  const totalPaye = {};
  const detailDu = {};
  const detailPaye = {};
  voyageurs.forEach(function (v) {
    totalDu[v.id] = 0;
    totalPaye[v.id] = 0;
    detailDu[v.id] = [];
    detailPaye[v.id] = [];
  });
  let nonAttribue = 0;
  let total = 0;

  etapes.forEach(function (e) {
    lignesCoutPour(e).forEach(function (ligne) {
      total += ligne.prix;

      if (ligne.ids.length === 0) {
        nonAttribue += ligne.prix;
      } else {
        const part = ligne.prix / ligne.ids.length;
        ligne.ids.forEach(function (id) {
          if (totalDu.hasOwnProperty(id)) {
            totalDu[id] += part;
            detailDu[id].push({ titre: ligne.titre, montant: part });
          }
        });
      }

      if (ligne.payeurId && totalPaye.hasOwnProperty(ligne.payeurId)) {
        totalPaye[ligne.payeurId] += ligne.prix;
        detailPaye[ligne.payeurId].push({ titre: ligne.titre, montant: ligne.prix });
      }
    });
  });

  let html = '<div class="budget-total"><span class="budget-nom">Total du voyage</span><span class="budget-montant">' + formaterPrix(total) + '</span></div>';

  html += voyageurs.map(function (v) {
    const solde = totalPaye[v.id] - totalDu[v.id];
    const classeSolde = solde > 0.005 ? 'positif' : (solde < -0.005 ? 'negatif' : 'neutre');
    const signeSolde = solde > 0.005 ? '+' : '';

    const detailDuHtml = detailDu[v.id].length
      ? detailDu[v.id].map(function (l) { return '<div class="ligne-detail"><span>' + escapeHTML(l.titre) + '</span><span>' + formaterPrix(l.montant) + '</span></div>'; }).join('')
      : '<div class="accordion-vide">Aucune dépense à sa charge.</div>';

    const detailPayeHtml = detailPaye[v.id].length
      ? detailPaye[v.id].map(function (l) { return '<div class="ligne-detail"><span>' + escapeHTML(l.titre) + '</span><span>' + formaterPrix(l.montant) + '</span></div>'; }).join('')
      : '<div class="accordion-vide">N\'a rien payé pour l\'instant.</div>';

    return '' +
      '<div class="accordion-voyageur" id="accordion-' + v.id + '">' +
      '  <button type="button" class="accordion-header" onclick="toggleAccordionBudget(\'' + v.id + '\')">' +
      '    <span class="nom">' + escapeHTML(v.nom) + '</span>' +
      '    <span style="display:flex; align-items:center; gap:10px;">' +
      '      <span class="solde ' + classeSolde + '">' + signeSolde + formaterPrix(solde) + '</span>' +
      '      <span class="material-symbols-rounded chevron">expand_more</span>' +
      '    </span>' +
      '  </button>' +
      '  <div class="accordion-body hidden">' +
      '    <div class="accordion-section">' +
      '      <h4>Sa part (dû)</h4>' +
      detailDuHtml +
      '      <div class="ligne-detail total"><span>Total dû</span><span>' + formaterPrix(totalDu[v.id]) + '</span></div>' +
      '    </div>' +
      '    <div class="accordion-section">' +
      '      <h4>A payé</h4>' +
      detailPayeHtml +
      '      <div class="ligne-detail total"><span>Total payé</span><span>' + formaterPrix(totalPaye[v.id]) + '</span></div>' +
      '    </div>' +
      '  </div>' +
      '</div>';
  }).join('');

  if (nonAttribue > 0) {
    html += '<div class="budget-ligne"><span class="budget-nom">Non attribué<div class="budget-detail">Étapes avec un prix mais sans voyageur coché</div></span><span class="budget-montant">' + formaterPrix(nonAttribue) + '</span></div>';
  }

  cible.innerHTML = html;
}

function toggleAccordionBudget(voyageurId) {
  const bloc = document.getElementById('accordion-' + voyageurId);
  if (!bloc) return;
  const body = bloc.querySelector('.accordion-body');
  const ouvert = bloc.classList.toggle('ouvert');
  body.classList.toggle('hidden', !ouvert);
}

function modifierEtape(id) {
  const e = etapes.find(function (x) { return x.id === id; });
  if (!e) return;

  document.getElementById('etape-id').value = e.id;
  document.getElementById('etape-type').value = e.type;
  document.getElementById('etape-sousType').value = e.sousType || '';
  document.getElementById('etape-titre').value = e.titre;
  document.getElementById('etape-lieu').value = e.lieu || '';
  document.getElementById('etape-lieuArrivee').value = e.lieuArrivee || '';
  document.getElementById('etape-dateDebut').value = e.dateDebut || '';
  document.getElementById('etape-heureDebut').value = e.heureDebut || '';
  document.getElementById('etape-dateFin').value = e.dateFin || '';
  document.getElementById('etape-heureFin').value = e.heureFin || '';
  document.getElementById('etape-details').value = e.details || '';
  document.getElementById('etape-lien').value = e.lien || '';
  document.getElementById('etape-prix').value = e.prix || '';
  document.getElementById('etape-payeur').value = e.payeurId || '';

  if (e.type === 'Hébergement') {
    chambresForm = (e.chambres || []).map(function (c) {
      return { clientId: genId(), prix: c.prix || '', payeur: c.payeurId || '', voyageurs: c.voyageurIds || [] };
    });
    renderChambresForm();
    document.getElementById('bloc-chambres').classList.remove('hidden');
    document.getElementById('bloc-prix-voyageurs').classList.add('hidden');
  } else {
    chambresForm = [];
    afficherChipsVoyageurs(e.voyageurIds || []);
    document.getElementById('bloc-chambres').classList.add('hidden');
    document.getElementById('bloc-prix-voyageurs').classList.remove('hidden');
  }

  selectionnerChip(document.getElementById('chips-type'), e.type, 'type');
  const wrap = document.getElementById('chips-soustype-wrap');
  const wrapLieuArrivee = document.getElementById('champ-lieu-arrivee-wrap');
  if (e.type === 'Transport') {
    wrap.classList.remove('hidden');
    wrapLieuArrivee.classList.remove('hidden');
    selectionnerChip(document.getElementById('chips-soustype'), e.sousType || '', 'soustype');
  } else if (e.type === 'Location') {
    wrap.classList.add('hidden');
    wrapLieuArrivee.classList.remove('hidden');
  } else {
    wrap.classList.add('hidden');
    wrapLieuArrivee.classList.add('hidden');
  }

  document.getElementById('btn-save').innerText = 'Enregistrer les modifications';
  document.getElementById('btn-cancel').classList.remove('hidden');

  document.querySelector('.tab-btn[data-tab="saisie"]').click();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function supprimerEtape(id) {
  if (!confirm('Supprimer cette étape ?')) return;
  const { error } = await sb.from('voyage_etapes').delete().eq('id', id);
  if (error) {
    alert('Erreur : ' + error.message);
    return;
  }
  await chargerEtapes();
}

document.getElementById('btn-cancel').addEventListener('click', function () {
  reinitialiserFormulaire();
});

function reinitialiserFormulaire() {
  document.getElementById('form-etape').reset();
  document.getElementById('etape-id').value = '';
  document.getElementById('etape-type').value = '';
  document.getElementById('etape-sousType').value = '';
  document.getElementById('etape-lien').value = '';
  document.querySelectorAll('#chips-type .chip, #chips-soustype .chip').forEach(c => c.classList.remove('active'));
  document.getElementById('chips-soustype-wrap').classList.add('hidden');
  document.getElementById('champ-lieu-arrivee-wrap').classList.add('hidden');
  afficherChipsVoyageurs([]);
  chambresForm = [];
  renderChambresForm();
  document.getElementById('bloc-chambres').classList.add('hidden');
  document.getElementById('bloc-prix-voyageurs').classList.remove('hidden');
  document.getElementById('btn-save').innerText = "Ajouter l'étape";
  document.getElementById('btn-cancel').classList.add('hidden');
}

document.getElementById('form-etape').addEventListener('submit', async function (evt) {
  evt.preventDefault();

  const type = document.getElementById('etape-type').value;
  if (!type) {
    alert('Choisis un type d\'étape.');
    return;
  }

  const etapeId = document.getElementById('etape-id').value || null;

  const etapeRow = {
    type: type,
    sous_type: vide(document.getElementById('etape-sousType').value),
    titre: document.getElementById('etape-titre').value,
    lieu: vide(document.getElementById('etape-lieu').value),
    lieu_arrivee: vide(document.getElementById('etape-lieuArrivee').value),
    date_debut: document.getElementById('etape-dateDebut').value,
    heure_debut: vide(document.getElementById('etape-heureDebut').value),
    date_fin: vide(document.getElementById('etape-dateFin').value),
    heure_fin: vide(document.getElementById('etape-heureFin').value),
    details: vide(document.getElementById('etape-details').value),
    lien: vide(document.getElementById('etape-lien').value),
    prix: type === 'Hébergement' ? null : vide(document.getElementById('etape-prix').value),
    payeur_id: type === 'Hébergement' ? null : vide(document.getElementById('etape-payeur').value)
  };

  const btn = document.getElementById('btn-save');
  btn.disabled = true;

  try {
    let id = etapeId;

    if (id) {
      const { error } = await sb.from('voyage_etapes').update(etapeRow).eq('id', id);
      if (error) throw error;
    } else {
      const { data, error } = await sb.from('voyage_etapes').insert(etapeRow).select('id').single();
      if (error) throw error;
      id = data.id;
    }

    // Voyageurs concernés (hors hébergement) : on repart d'une liste propre à chaque sauvegarde
    const { error: errDelVoy } = await sb.from('voyage_etape_voyageurs').delete().eq('etape_id', id);
    if (errDelVoy) throw errDelVoy;

    if (type !== 'Hébergement') {
      const ids = voyageursSelectionnes();
      if (ids.length) {
        const { error: errInsVoy } = await sb.from('voyage_etape_voyageurs').insert(
          ids.map(function (voyageurId) { return { etape_id: id, voyageur_id: voyageurId }; })
        );
        if (errInsVoy) throw errInsVoy;
      }
    }

    // Chambres (hébergement uniquement) : on supprime les anciennes puis on réinsère
    const { error: errDelChambres } = await sb.from('voyage_chambres').delete().eq('etape_id', id);
    if (errDelChambres) throw errDelChambres;

    if (type === 'Hébergement') {
      const chambresValides = chambresForm.filter(function (c) { return c.prix || c.voyageurs.length; });
      for (const c of chambresValides) {
        const { data: chambreData, error: errChambre } = await sb
          .from('voyage_chambres')
          .insert({ etape_id: id, prix: vide(c.prix), payeur_id: vide(c.payeur) })
          .select('id')
          .single();
        if (errChambre) throw errChambre;

        if (c.voyageurs.length) {
          const { error: errChambreVoy } = await sb.from('voyage_chambre_voyageurs').insert(
            c.voyageurs.map(function (voyageurId) { return { chambre_id: chambreData.id, voyageur_id: voyageurId }; })
          );
          if (errChambreVoy) throw errChambreVoy;
        }
      }
    }

    btn.disabled = false;
    reinitialiserFormulaire();
    await chargerEtapes();
  } catch (err) {
    btn.disabled = false;
    alert('Erreur : ' + err.message);
  }
});

// ---- Authentification ----

document.getElementById('form-login').addEventListener('submit', async function (evt) {
  evt.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  if (!email || !password) {
    alert('Renseigne ton email et ton mot de passe, ou utilise le lien magique si tu n\'as pas encore de mot de passe.');
    return;
  }

  const { error } = await sb.auth.signInWithPassword({ email: email, password: password });
  if (error) {
    alert('Erreur de connexion : ' + error.message);
  }
});

document.getElementById('btn-login-magic').addEventListener('click', async function () {
  const email = document.getElementById('login-email').value.trim();
  if (!email) {
    alert('Renseigne ton email d\'abord.');
    return;
  }

  const redirectTo = window.location.origin + window.location.pathname;
  const { error } = await sb.auth.signInWithOtp({ email: email, options: { emailRedirectTo: redirectTo } });

  if (error) {
    alert('Erreur : ' + error.message);
    return;
  }
  document.getElementById('form-login').classList.add('hidden');
  document.getElementById('login-sent-hint').classList.remove('hidden');
});

document.getElementById('btn-logout').addEventListener('click', async function () {
  await sb.auth.signOut();
});

document.getElementById('btn-toggle-password').addEventListener('click', function () {
  document.getElementById('form-set-password').classList.toggle('hidden');
  document.getElementById('set-password-hint').classList.add('hidden');
});

document.getElementById('form-set-password').addEventListener('submit', async function (evt) {
  evt.preventDefault();
  const password = document.getElementById('set-password-value').value;
  const { error } = await sb.auth.updateUser({ password: password });
  if (error) {
    alert('Erreur : ' + error.message);
    return;
  }
  document.getElementById('form-set-password').reset();
  document.getElementById('form-set-password').classList.add('hidden');
  document.getElementById('set-password-hint').classList.remove('hidden');
});

function mettreAJourUIAuth(session) {
  const formLogin = document.getElementById('form-login');
  const sentHint = document.getElementById('login-sent-hint');
  const connecte = document.getElementById('auth-connecte');
  const emailSpan = document.getElementById('auth-email');
  const tabAdminBtn = document.getElementById('tab-btn-admin');

  if (session && session.user) {
    formLogin.classList.add('hidden');
    sentHint.classList.add('hidden');
    connecte.classList.remove('hidden');
    const nomAffiche = monVoyageurNom || session.user.email;
    emailSpan.textContent = nomAffiche + (peutEditer ? '' : ' (compte non autorisé — contacte l\'admin)');
  } else {
    formLogin.classList.remove('hidden');
    sentHint.classList.add('hidden');
    connecte.classList.add('hidden');
    document.getElementById('form-set-password').classList.add('hidden');
  }

  tabAdminBtn.classList.toggle('hidden', !estAdmin);
  if (!estAdmin && document.getElementById('tab-admin').classList.contains('active')) {
    document.querySelector('.tab-btn[data-tab="saisie"]').click();
  }

  document.getElementById('contenu-protege').classList.toggle('hidden', !peutEditer);
  document.getElementById('non-connecte-message').classList.toggle('hidden', peutEditer);
}

async function gererSession(session) {
  if (session && session.user) {
    const { data, error } = await sb.rpc('voyage_mon_statut');
    if (!error && data && data.length) {
      peutEditer = !!data[0].autorise;
      estAdmin = !!data[0].admin;
      monVoyageurNom = data[0].voyageur_nom || null;
    } else {
      peutEditer = false;
      estAdmin = false;
      monVoyageurNom = null;
    }
  } else {
    peutEditer = false;
    estAdmin = false;
    monVoyageurNom = null;
  }

  mettreAJourUIAuth(session);

  if (peutEditer) {
    await chargerEtapes();
    await chargerVoyageurs();
  } else {
    etapes = [];
    voyageurs = [];
  }
}

sb.auth.onAuthStateChange(function (event, session) {
  gererSession(session);
});

// ---- Onglet Admin (comptes autorisés) ----

async function chargerUtilisateursAdmin() {
  if (!estAdmin) return;
  remplirSelectVoyageursAdmin();

  const { data, error } = await sb
    .from('voyage_utilisateurs')
    .select('email, is_admin, voyageur_id, voyage_voyageurs(nom)')
    .order('created_at', { ascending: true });

  if (error) {
    console.error(error);
    return;
  }
  utilisateursAdmin = data;
  afficherListeAdmin();
}

function remplirSelectVoyageursAdmin() {
  const select = document.getElementById('admin-voyageur');
  if (!select) return;
  const valeurActuelle = select.value;
  select.innerHTML = '<option value="">— Aucun —</option>' +
    voyageurs.map(function (v) { return '<option value="' + v.id + '">' + escapeHTML(v.nom) + '</option>'; }).join('');
  select.value = valeurActuelle;
}

function afficherListeAdmin() {
  const cible = document.getElementById('liste-admin-utilisateurs');
  if (utilisateursAdmin.length === 0) {
    cible.innerHTML = '<div class="vide">Aucun compte autorisé pour le moment.</div>';
    return;
  }
  cible.innerHTML = utilisateursAdmin.map(function (u) {
    const nomVoyageur = u.voyage_voyageurs ? u.voyage_voyageurs.nom : null;
    return '<div class="ligne-voyageur"><span class="nom">' + escapeHTML(u.email) +
      (nomVoyageur ? ' <span class="badge-voyageur">' + escapeHTML(nomVoyageur) + '</span>' : '') +
      (u.is_admin ? '<span class="badge-admin">Admin</span>' : '') + '</span>' +
      '<button onclick="supprimerUtilisateurAdmin(\'' + encodeURIComponent(u.email) + '\')">Supprimer</button></div>';
  }).join('');
}

document.getElementById('form-admin-utilisateur').addEventListener('submit', async function (evt) {
  evt.preventDefault();
  const email = document.getElementById('admin-email').value.trim();
  const isAdminCheck = document.getElementById('admin-est-admin').checked;
  const voyageurId = document.getElementById('admin-voyageur').value || null;
  if (!email) return;

  const { error } = await sb.from('voyage_utilisateurs').upsert({ email: email, is_admin: isAdminCheck, voyageur_id: voyageurId });
  if (error) {
    alert('Erreur : ' + error.message);
    return;
  }
  document.getElementById('form-admin-utilisateur').reset();
  await chargerUtilisateursAdmin();
});

async function supprimerUtilisateurAdmin(emailEncode) {
  const email = decodeURIComponent(emailEncode);
  if (!confirm('Retirer l\'accès de ' + email + ' ?')) return;
  const { error } = await sb.from('voyage_utilisateurs').delete().eq('email', email);
  if (error) {
    alert('Erreur : ' + error.message);
    return;
  }
  await chargerUtilisateursAdmin();
}

sb.auth.getSession().then(function (res) { gererSession(res.data.session); });
