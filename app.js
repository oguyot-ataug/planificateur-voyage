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
  'Marche': 'directions_walk',
  'Vélo': 'directions_bike',
  'Autre': 'more_horiz'
};

const ICONES_SCENE_TRANSPORT = {
  'Voiture': 'directions_car',
  'Bus': 'directions_bus',
  'Vélo': 'directions_bike',
  'Train': 'train',
  'Bateau': 'directions_boat',
  'Avion': 'flight'
};

function sceneClassePour(sousType) {
  if (sousType === 'Avion') return 'scene-ciel';
  if (sousType === 'Train') return 'scene-rail';
  if (sousType === 'Bateau') return 'scene-mer';
  return 'scene-route';
}

/** Petite animation décorative en tête de carte quand il n'y a pas de photo (transports sans photo) */
function sceneHTMLPour(e) {
  if (e.type === 'Location' || e.sousType === 'Voiture') {
    return sceneVoitureHTML();
  }
  if (e.type !== 'Transport' || !e.sousType) return '';

  if (e.sousType === 'Avion') return sceneAvionHTML();
  if (e.sousType === 'Marche') return sceneMarcheHTML();

  const icone = ICONES_SCENE_TRANSPORT[e.sousType];
  if (!icone) return '';
  return '<div class="carte-scene ' + sceneClassePour(e.sousType) + '"><span class="material-symbols-rounded scene-icone">' + icone + '</span></div>';
}

function sceneVoitureHTML() {
  const decor =
    '<path d="M0 60 L45 20 L85 60 Z" fill="#93a9c0" opacity="0.55"/>' +
    '<path d="M60 60 L110 14 L150 60 Z" fill="#7d93ab" opacity="0.55"/>' +
    '<path d="M130 60 L175 24 L215 60 Z" fill="#93a9c0" opacity="0.55"/>' +
    '<path d="M195 60 L245 16 L285 60 Z" fill="#7d93ab" opacity="0.55"/>' +
    '<g><rect x="24" y="66" width="5" height="16" fill="#6b4a2f"/><circle cx="26" cy="59" r="12" fill="#4c7a3d"/></g>' +
    '<g><rect x="254" y="66" width="5" height="16" fill="#6b4a2f"/><circle cx="256" cy="59" r="12" fill="#4c7a3d"/></g>' +
    '<g><rect x="288" y="70" width="4" height="12" fill="#6b4a2f"/><circle cx="290" cy="64" r="9" fill="#5a8a49"/></g>' +
    '<g><rect x="6" y="70" width="4" height="12" fill="#6b4a2f"/><circle cx="8" cy="64" r="9" fill="#5a8a49"/></g>';

  return '<div class="carte-scene scene-route">' +
    '<svg class="scene-route-fond" viewBox="0 0 320 96" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' + decor + '</svg>' +
    '<div class="scene-vehicule-wrap">' +
    '<svg class="scene-vehicule" viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M8 44 Q6 44 6 40 Q6 33 14 31 L26 31 L36 16 Q40 11 48 11 L78 11 Q86 11 91 18 L99 31 L106 31 Q114 31 114 40 Q114 44 110 44 Z" fill="#ffffff"/>' +
    '<path d="M40 29 L47 16 L74 16 L83 29 Z" fill="#a9d6ff"/>' +
    '<line x1="58" y1="16" x2="58" y2="29" stroke="#ffffff" stroke-width="2"/>' +
    '<circle cx="30" cy="44" r="10" fill="#2b2b2b"/><circle cx="30" cy="44" r="4" fill="#cbd5e1"/>' +
    '<circle cx="92" cy="44" r="10" fill="#2b2b2b"/><circle cx="92" cy="44" r="4" fill="#cbd5e1"/>' +
    '</svg>' +
    '</div>' +
    '</div>';
}

function sceneAvionHTML() {
  const nuage = '<ellipse cx="30" cy="25" rx="18" ry="12" fill="#ffffff"/><ellipse cx="52" cy="19" rx="24" ry="16" fill="#ffffff"/><ellipse cx="74" cy="26" rx="16" ry="11" fill="#ffffff"/>';
  const aeroport =
    '<rect x="20" y="40" width="110" height="40" fill="#e2e8f0"/>' +
    '<rect x="20" y="34" width="110" height="8" fill="#94a3b8"/>' +
    '<rect x="35" y="50" width="14" height="18" fill="#7dd3fc"/>' +
    '<rect x="58" y="50" width="14" height="18" fill="#7dd3fc"/>' +
    '<rect x="81" y="50" width="14" height="18" fill="#7dd3fc"/>' +
    '<rect x="104" y="50" width="14" height="18" fill="#7dd3fc"/>' +
    '<rect x="152" y="20" width="10" height="60" fill="#94a3b8"/>' +
    '<rect x="141" y="5" width="32" height="18" rx="4" fill="#64748b"/>' +
    '<rect x="145" y="9" width="24" height="9" fill="#bfe3ff"/>';

  return '<div class="carte-scene scene-ciel">' +
    '<svg class="scene-nuage n1" viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">' + nuage + '</svg>' +
    '<svg class="scene-nuage n2" viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">' + nuage + '</svg>' +
    '<svg class="scene-nuage n3" viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">' + nuage + '</svg>' +
    '<svg class="scene-nuage n4" viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">' + nuage + '</svg>' +
    '<div class="scene-aeroport">' +
    '<svg class="scene-aeroport-fond" viewBox="0 0 320 90" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' + aeroport + '</svg>' +
    '<div class="scene-piste"></div>' +
    '</div>' +
    '<div class="scene-avion-wrap">' +
    '<svg class="scene-avion" viewBox="0 0 140 50" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M45 32 L18 45 L52 34 Z" fill="#ffffff" opacity="0.95"/>' +
    '<path d="M10 30 Q10 22 20 22 L100 22 L125 28 L100 34 L20 34 Q10 34 10 30 Z" fill="#ffffff"/>' +
    '<path d="M22 22 L15 7 L28 22 Z" fill="#ffffff"/>' +
    '<path d="M23 31 L11 38 L27 34 Z" fill="#ffffff" opacity="0.95"/>' +
    '<circle cx="40" cy="27" r="1.6" fill="#8fc1f5"/>' +
    '<circle cx="50" cy="27" r="1.6" fill="#8fc1f5"/>' +
    '<circle cx="60" cy="27" r="1.6" fill="#8fc1f5"/>' +
    '<circle cx="70" cy="27" r="1.6" fill="#8fc1f5"/>' +
    '<circle cx="80" cy="27" r="1.6" fill="#8fc1f5"/>' +
    '</svg>' +
    '</div>' +
    '</div>';
}

function sceneMarcheHTML() {
  const marcheur = '<circle cx="12" cy="6" r="4" fill="#3a3a3a"/>' +
    '<path d="M12 10 L10 24" stroke="#3a3a3a" stroke-width="2.6" stroke-linecap="round" fill="none"/>' +
    '<g class="scene-bras b1" style="transform-origin:12px 12px;"><path d="M12 12 L17 17" stroke="#3a3a3a" stroke-width="2.4" stroke-linecap="round"/></g>' +
    '<g class="scene-bras b2" style="transform-origin:12px 12px;"><path d="M12 12 L7 17" stroke="#3a3a3a" stroke-width="2.4" stroke-linecap="round"/></g>' +
    '<g class="scene-jambe j1" style="transform-origin:10px 24px;"><path d="M10 24 L10 40" stroke="#3a3a3a" stroke-width="2.6" stroke-linecap="round"/></g>' +
    '<g class="scene-jambe j2" style="transform-origin:10px 24px;"><path d="M10 24 L10 40" stroke="#3a3a3a" stroke-width="2.6" stroke-linecap="round"/></g>';
  const ville =
    '<rect x="0" y="34" width="70" height="56" fill="#fbf3e3"/><rect x="0" y="28" width="70" height="8" fill="#c1602e"/>' +
    '<path d="M14 90 L14 58 Q14 48 24 48 Q34 48 34 58 L34 90 Z" fill="#f3e6cc"/>' +
    '<rect x="46" y="52" width="12" height="16" rx="6" fill="#e7d3ab"/>' +
    '<rect x="80" y="10" width="26" height="80" fill="#fdf7ea"/>' +
    '<polygon points="80,10 93,0 106,10" fill="#c1602e"/>' +
    '<rect x="89" y="30" width="8" height="14" fill="#8a6a45"/>' +
    '<rect x="112" y="40" width="90" height="50" fill="#fdf7ea"/><rect x="112" y="34" width="90" height="8" fill="#b9552a"/>' +
    '<path d="M128 90 L128 62 Q128 53 137 53 Q146 53 146 62 L146 90 Z" fill="#f3e6cc"/>' +
    '<path d="M168 90 L168 62 Q168 53 177 53 Q186 53 186 62 L186 90 Z" fill="#f3e6cc"/>' +
    '<rect x="208" y="30" width="70" height="60" fill="#fbf3e3"/><rect x="208" y="24" width="70" height="8" fill="#c1602e"/>' +
    '<rect x="224" y="48" width="14" height="18" rx="7" fill="#e7d3ab"/><rect x="252" y="48" width="14" height="18" rx="7" fill="#e7d3ab"/>' +
    '<rect x="282" y="42" width="42" height="48" fill="#fdf7ea"/><rect x="282" y="36" width="42" height="8" fill="#b9552a"/>';

  const marcheurs = [0, 1, 2, 3].map(function (i) {
    return '<span class="scene-marcheur-wrap" style="animation-delay:' + (i * 0.13) + 's">' +
      '<svg class="scene-marcheur" viewBox="0 0 20 40" xmlns="http://www.w3.org/2000/svg">' + marcheur + '</svg></span>';
  }).join('');

  return '<div class="carte-scene scene-ville-marche">' +
    '<svg class="scene-ville-fond" viewBox="0 0 320 90" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' + ville + '</svg>' +
    '<div class="scene-groupe-marche">' + marcheurs + '</div>' +
    '</div>';
}

// Types qui se décomposent en plusieurs lignes de coût (chambres, billets, parts...)
// plutôt qu'un prix + des voyageurs concernés uniques.
const TYPES_AVEC_LIGNES = ['Hébergement', 'Activité', 'Repas'];
const LIBELLES_LIGNES = {
  'Hébergement': { singulier: 'Chambre', bouton: "Ajouter une chambre", titre: 'Chambres' },
  'Activité': { singulier: 'Billet', bouton: 'Ajouter un billet', titre: 'Billets' },
  'Repas': { singulier: 'Part', bouton: 'Ajouter une part', titre: 'Parts' }
};
function libelleLignes(type) {
  return LIBELLES_LIGNES[type] || { singulier: 'Ligne', bouton: 'Ajouter une ligne', titre: 'Lignes' };
}

let etapes = [];
let etapesInvite = [];
let voyageurs = [];
let lignesForm = [];
let photoForm = null;
let videoPathForm = null;
let videoEnCoursUpload = false;
let peutEditer = false;
let estAdmin = false;
let monVoyageurNom = null;
let modeInviteActif = false;
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

// ---- Photo d'illustration (redimensionnement côté client avant stockage) ----

function redimensionnerImage(file, maxDim, qualite) {
  return new Promise(function (resolve, reject) {
    const lecteur = new FileReader();
    lecteur.onload = function (evt) {
      const img = new Image();
      img.onload = function () {
        let w = img.width, h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w >= h) { h = Math.round(h * maxDim / w); w = maxDim; }
          else { w = Math.round(w * maxDim / h); h = maxDim; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', qualite));
      };
      img.onerror = reject;
      img.src = evt.target.result;
    };
    lecteur.onerror = reject;
    lecteur.readAsDataURL(file);
  });
}

function afficherApercuPhoto(dataUrl) {
  const wrap = document.getElementById('photo-apercu-wrap');
  const img = document.getElementById('photo-apercu');
  if (dataUrl) {
    img.src = dataUrl;
    wrap.classList.remove('hidden');
  } else {
    img.src = '';
    wrap.classList.add('hidden');
  }
}

document.getElementById('etape-photo-input').addEventListener('change', async function (evt) {
  const file = evt.target.files[0];
  if (!file) return;
  try {
    photoForm = await redimensionnerImage(file, 1000, 0.7);
    afficherApercuPhoto(photoForm);
  } catch (err) {
    alert('Impossible de lire cette image.');
  }
  evt.target.value = '';
});

document.getElementById('btn-supprimer-photo').addEventListener('click', function () {
  photoForm = null;
  afficherApercuPhoto(null);
});

// ---- Vidéo d'illustration (Supabase Storage, bucket privé) ----

document.getElementById('etape-video-input').addEventListener('change', async function (evt) {
  const file = evt.target.files[0];
  if (!file) return;

  if (file.size > 60 * 1024 * 1024) {
    alert('Vidéo trop lourde (60 Mo maximum).');
    evt.target.value = '';
    return;
  }

  const wrap = document.getElementById('video-apercu-wrap');
  const apercu = document.getElementById('video-apercu');
  const hint = document.getElementById('video-upload-hint');

  apercu.src = URL.createObjectURL(file);
  wrap.classList.remove('hidden');
  hint.classList.remove('hidden');
  videoEnCoursUpload = true;

  if (videoPathForm) {
    await sb.storage.from('voyage-media').remove([videoPathForm]);
    videoPathForm = null;
  }

  const extension = (file.name.split('.').pop() || 'mp4').toLowerCase();
  const chemin = genId() + '-' + Date.now() + '.' + extension;
  const { error } = await sb.storage.from('voyage-media').upload(chemin, file, { contentType: file.type });

  videoEnCoursUpload = false;
  hint.classList.add('hidden');

  if (error) {
    alert('Erreur d\'envoi de la vidéo : ' + error.message);
    wrap.classList.add('hidden');
    return;
  }
  videoPathForm = chemin;
  evt.target.value = '';
});

document.getElementById('btn-supprimer-video').addEventListener('click', async function () {
  if (videoPathForm) {
    await sb.storage.from('voyage-media').remove([videoPathForm]);
  }
  videoPathForm = null;
  document.getElementById('video-apercu-wrap').classList.add('hidden');
  document.getElementById('video-apercu').src = '';
});

async function resoudreVideosAffichees() {
  const elements = Array.from(document.querySelectorAll('video.carte-video[data-video-path]:not([data-resolu])'));
  if (elements.length === 0) return;
  const chemins = elements.map(function (el) { return el.dataset.videoPath; });
  const { data, error } = await sb.storage.from('voyage-media').createSignedUrls(chemins, 3600);
  if (error) {
    console.error(error);
    return;
  }
  elements.forEach(function (el, i) {
    const item = data[i];
    if (item && item.signedUrl) {
      el.src = item.signedUrl;
      el.dataset.resolu = '1';
    }
  });
}

document.querySelectorAll('.tab-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    if (btn.dataset.tab === 'budget') afficherBudget();
    if (btn.dataset.tab === 'admin') { chargerUtilisateursAdmin(); chargerCodeInviteActuel(); }
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
    const blocLignes = document.getElementById('bloc-lignes');
    if (TYPES_AVEC_LIGNES.includes(chip.dataset.type)) {
      blocLignes.classList.remove('hidden');
      blocPrixVoyageurs.classList.add('hidden');
      mettreAJourLabelsLignes(chip.dataset.type);
      if (lignesForm.length === 0) ajouterLigne();
    } else {
      blocLignes.classList.add('hidden');
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

function mettreAJourLabelsLignes(type) {
  const lib = libelleLignes(type);
  document.getElementById('label-lignes').textContent = lib.titre;
  document.getElementById('btn-ajouter-ligne').lastChild.textContent = ' ' + lib.bouton;
}

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
    description: row.description,
    lien: row.lien,
    lienInfo: row.lien_info,
    prix: row.prix,
    payeurId: row.payeur_id,
    photo: row.photo,
    videoPath: row.video_path,
    voyageurIds: (row.voyage_etape_voyageurs || []).map(function (v) { return v.voyageur_id; }),
    lignes: (row.voyage_lignes_cout || []).map(function (c) {
      return {
        id: c.id,
        prix: c.prix,
        payeurId: c.payeur_id,
        voyageurIds: (c.voyage_ligne_voyageurs || []).map(function (v) { return v.voyageur_id; })
      };
    })
  };
}

async function chargerEtapes() {
  const { data, error } = await sb
    .from('voyage_etapes')
    .select(`
      id, type, sous_type, titre, lieu, lieu_arrivee, date_debut, heure_debut, date_fin, heure_fin, details, description, lien, lien_info, prix, payeur_id, photo, video_path,
      voyage_etape_voyageurs ( voyageur_id ),
      voyage_lignes_cout ( id, prix, payeur_id, voyage_ligne_voyageurs ( voyageur_id ) )
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
  resoudreVideosAffichees();
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
  renderLignesForm();
  remplirSelectVoyageursAdmin();
  const payeurActuel = document.getElementById('etape-payeur') ? document.getElementById('etape-payeur').value : '';
  afficherChipsPayeur(payeurActuel);
}

function afficherChipsPayeur(selectionne) {
  const cible = document.getElementById('chips-payeur');
  if (!cible) return;
  if (voyageurs.length === 0) {
    cible.innerHTML = '';
    return;
  }
  cible.innerHTML = voyageurs.map(function (v) {
    const actif = selectionne === v.id;
    return '<button type="button" class="chip voyageur' + (actif ? ' active' : '') + '" data-payeur="' + v.id + '">' +
      '<span class="material-symbols-rounded">person</span><span>' + escapeHTML(v.nom) + '</span></button>';
  }).join('');

  cible.querySelectorAll('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      const dejaActif = chip.classList.contains('active');
      cible.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('active'); });
      if (!dejaActif) {
        chip.classList.add('active');
        document.getElementById('etape-payeur').value = chip.dataset.payeur;
      } else {
        document.getElementById('etape-payeur').value = '';
      }
    });
  });
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

/** Un lieu simple reste affiché via l'iframe Embed API (pas de bandeau gênant dans ce mode) */
function urlCartePour(e) {
  const cle = window.MAPS_API_KEY;
  if (!cle) return null;

  if (e.type === 'Transport' && (e.sousType === 'Avion' || e.sousType === 'Bateau') && e.lieuArrivee) {
    return 'https://www.google.com/maps/embed/v1/place?key=' + cle +
      '&q=' + encodeURIComponent(e.lieuArrivee);
  }
  if (e.lieu) {
    return 'https://www.google.com/maps/embed/v1/place?key=' + cle +
      '&q=' + encodeURIComponent(e.lieu);
  }
  return null;
}

/** Un itinéraire (deux points) passe par l'API JavaScript pour éviter le bandeau d'infos de l'Embed API */
function itineraireDisponible(e) {
  if (e.type === 'Transport' && e.lieu && e.lieuArrivee && e.sousType !== 'Avion' && e.sousType !== 'Bateau') return true;
  if (e.type === 'Location' && e.lieu && e.lieuArrivee) return true;
  return false;
}

let chargementGoogleMapsJS = null;
function chargerGoogleMapsJS() {
  if (chargementGoogleMapsJS) return chargementGoogleMapsJS;
  chargementGoogleMapsJS = new Promise(function (resolve, reject) {
    if (window.google && window.google.maps) { resolve(); return; }
    window.__googleMapsJSReady = resolve;
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(window.MAPS_API_KEY) + '&loading=async&language=fr&region=FR&callback=__googleMapsJSReady';
    script.onerror = function () { reject(new Error('Échec du chargement de Google Maps.')); };
    document.head.appendChild(script);
  });
  return chargementGoogleMapsJS;
}

function modeItinerairePour(e) {
  if (e.type === 'Location') return google.maps.TravelMode.DRIVING;
  if (e.sousType === 'Train') return google.maps.TravelMode.TRANSIT;
  if (e.sousType === 'Marche') return google.maps.TravelMode.WALKING;
  if (e.sousType === 'Vélo') return google.maps.TravelMode.BICYCLING;
  return google.maps.TravelMode.DRIVING;
}

function afficherItineraireJS(conteneurInfo, conteneurCarte, e) {
  const map = new google.maps.Map(conteneurCarte, { zoom: 8, center: { lat: 40, lng: 0 } });
  const service = new google.maps.DirectionsService();
  const renderer = new google.maps.DirectionsRenderer({ map: map });
  const mode = modeItinerairePour(e);

  service.route({ origin: e.lieu, destination: e.lieuArrivee, travelMode: mode }, function (resultat, statut) {
    if (statut === 'OK') {
      renderer.setDirections(resultat);
      const trajet = resultat.routes[0].legs[0];
      conteneurInfo.textContent = trajet.duration.text + ' · ' + trajet.distance.text;
    } else {
      console.error('Directions API status:', statut);
      conteneurInfo.textContent = '';
      conteneurCarte.innerHTML = '<div class="vide">Itinéraire indisponible (' + statut + ').</div>';
    }
  });
}

async function toggleCarte(id, contexte) {
  const conteneur = document.getElementById('carte-map-' + contexte + '-' + id);
  if (!conteneur) return;

  const ouverte = !conteneur.classList.contains('hidden');
  if (ouverte) {
    conteneur.classList.add('hidden');
    conteneur.innerHTML = '';
    return;
  }

  const e = etapes.find(function (x) { return x.id === id; }) || etapesInvite.find(function (x) { return x.id === id; });
  if (!e) return;

  if (itineraireDisponible(e)) {
    conteneur.innerHTML = '<div class="itineraire-info"></div><div class="carte-map-canvas"></div>';
    conteneur.classList.remove('hidden');
    try {
      await chargerGoogleMapsJS();
      afficherItineraireJS(conteneur.querySelector('.itineraire-info'), conteneur.querySelector('.carte-map-canvas'), e);
    } catch (err) {
      conteneur.innerHTML = '<div class="vide">Carte indisponible.</div>';
    }
    return;
  }

  const url = urlCartePour(e);
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

/** Renvoie les lignes de coût d'une étape : plusieurs pour Hébergement/Activité/Repas, une seule sinon */
function lignesCoutPour(e) {
  if (TYPES_AVEC_LIGNES.includes(e.type)) {
    return (e.lignes || [])
      .filter(function (c) { return c.prix; })
      .map(function (c, i) {
        return { prix: parseFloat(c.prix), ids: c.voyageurIds || [], payeurId: c.payeurId || null, titre: e.titre + ' — ' + libelleLignes(e.type).singulier + ' ' + (i + 1) };
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
  const aDesLignes = TYPES_AVEC_LIGNES.includes(e.type);
  const lignes = aDesLignes ? (e.lignes || []) : [];
  const noms = aDesLignes ? [] : nomsVoyageursPour(e);

  const detailVoyageursHtml = aDesLignes
    ? (lignes.length ? '<div class="carte-lignes-cout">' + lignes.map(function (c, i) {
        const nomsLigne = (c.voyageurIds || []).map(nomVoyageur).filter(Boolean);
        return '<div class="ligne-cout-carte"><span class="ligne-num">' + libelleLignes(e.type).singulier + ' ' + (i + 1) + '</span>' +
          (c.prix ? '<span class="ligne-montant">' + formaterPrix(c.prix) + '</span>' : '') +
          (nomsLigne.length ? nomsLigne.map(function (n) { return '<span class="badge-voyageur">' + escapeHTML(n) + '</span>'; }).join('') : '') +
          '</div>';
      }).join('') + '</div>' : '')
    : (noms.length ? '<div class="carte-voyageurs">' + noms.map(function (n) { return '<span class="badge-voyageur">' + escapeHTML(n) + '</span>'; }).join('') + '</div>' : '');

  return '' +
    '<div class="carte ' + e.type + '">' +
    (e.videoPath ? '<video class="carte-video" data-video-path="' + escapeHTML(e.videoPath) + '" muted loop playsinline autoplay></video>' : (e.photo ? '<img class="carte-photo" src="' + e.photo + '" alt="">' : sceneHTMLPour(e))) +
    '  <div class="carte-content">' +
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
    (e.description ? '<div class="carte-details carte-description">' + escapeHTML(e.description) + '</div>' : '') +
    (e.details ? '<div class="carte-details">' + escapeHTML(e.details) + '</div>' : '') +
    detailVoyageursHtml +
    '    <div class="carte-actions">' +
    (aUneCarte ? '      <button onclick="toggleCarte(\'' + e.id + '\',\'' + contexte + '\')"><span class="material-symbols-rounded">map</span> Voir la carte</button>' : '') +
    (e.lien ? '      <a class="lien-reservation" href="' + escapeHTML(e.lien) + '" target="_blank" rel="noopener"><span class="material-symbols-rounded">confirmation_number</span> Réservation</a>' : '') +
    (e.lienInfo ? '      <a class="lien-reservation lien-info" href="' + escapeHTML(e.lienInfo) + '" target="_blank" rel="noopener"><span class="material-symbols-rounded">language</span> Site</a>' : '') +
    (avecActions ?
      '      <button onclick="modifierEtape(\'' + e.id + '\')">Modifier</button>' +
      '      <button class="del" onclick="supprimerEtape(\'' + e.id + '\')">Supprimer</button>' : '') +
    '    </div>' +
    (aUneCarte ? '    <div id="carte-map-' + contexte + '-' + e.id + '" class="carte-map hidden"></div>' : '') +
    '  </div>' +
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

// ---- Lignes de coût (formulaire hébergement / activité / repas) ----

function ajouterLigne() {
  lignesForm.push({ clientId: genId(), prix: '', payeur: '', voyageurs: [] });
  renderLignesForm();
}

function supprimerLigneForm(clientId) {
  lignesForm = lignesForm.filter(function (c) { return c.clientId !== clientId; });
  renderLignesForm();
}

function majPrixLigne(clientId, valeur) {
  const c = lignesForm.find(function (x) { return x.clientId === clientId; });
  if (c) c.prix = valeur;
}

function toggleVoyageurLigne(clientId, voyageurId) {
  const c = lignesForm.find(function (x) { return x.clientId === clientId; });
  if (!c) return;
  const idx = c.voyageurs.indexOf(voyageurId);
  if (idx === -1) c.voyageurs.push(voyageurId); else c.voyageurs.splice(idx, 1);
  renderLignesForm();
}

function togglePayeurLigne(clientId, voyageurId) {
  const c = lignesForm.find(function (x) { return x.clientId === clientId; });
  if (!c) return;
  c.payeur = (c.payeur === voyageurId) ? '' : voyageurId;
  renderLignesForm();
}

function renderLignesForm() {
  const cible = document.getElementById('lignes-liste');
  if (!cible) return;
  const type = document.getElementById('etape-type').value;
  const singulier = libelleLignes(type).singulier;

  if (lignesForm.length === 0) {
    cible.innerHTML = '<p class="hint">Aucune ligne ajoutée pour le moment.</p>';
    return;
  }
  cible.innerHTML = lignesForm.map(function (c, i) {
    const chipsHtml = voyageurs.length
      ? voyageurs.map(function (v) {
          const actif = c.voyageurs.indexOf(v.id) !== -1;
          return '<button type="button" class="chip voyageur' + (actif ? ' active' : '') + '" onclick="toggleVoyageurLigne(\'' + c.clientId + '\',\'' + v.id + '\')">' +
            '<span class="material-symbols-rounded">person</span><span>' + escapeHTML(v.nom) + '</span></button>';
        }).join('')
      : '<p class="hint">Ajoute des voyageurs dans l\'onglet « Voyageurs » pour pouvoir les cocher ici.</p>';

    const chipsPayeurHtml = voyageurs.length
      ? voyageurs.map(function (v) {
          const actif = c.payeur === v.id;
          return '<button type="button" class="chip voyageur' + (actif ? ' active' : '') + '" onclick="togglePayeurLigne(\'' + c.clientId + '\',\'' + v.id + '\')">' +
            '<span class="material-symbols-rounded">person</span><span>' + escapeHTML(v.nom) + '</span></button>';
        }).join('')
      : '<p class="hint">Ajoute des voyageurs dans l\'onglet « Voyageurs » pour pouvoir les cocher ici.</p>';

    return '<div class="ligne-bloc">' +
      '  <div class="ligne-entete"><span>' + singulier + ' ' + (i + 1) + '</span>' +
      '    <button type="button" class="del-ligne" onclick="supprimerLigneForm(\'' + c.clientId + '\')"><span class="material-symbols-rounded">delete</span></button>' +
      '  </div>' +
      '  <label>Prix (€)<input type="number" step="0.01" min="0" value="' + (c.prix || '') + '" oninput="majPrixLigne(\'' + c.clientId + '\', this.value)" placeholder="Ex : 89.00"></label>' +
      '  <label>Payé par</label>' +
      '  <div class="chips">' + chipsPayeurHtml + '</div>' +
      '  <label>Voyageurs</label>' +
      '  <div class="chips">' + chipsHtml + '</div>' +
      '</div>';
  }).join('');
}

document.getElementById('btn-ajouter-ligne').addEventListener('click', ajouterLigne);

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
  if (!confirm('Supprimer ce voyageur ? Il sera retiré des étapes et lignes de coût qui le mentionnaient.')) return;
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
  document.getElementById('etape-description').value = e.description || '';
  document.getElementById('etape-lien').value = e.lien || '';
  document.getElementById('etape-lien-info').value = e.lienInfo || '';
  document.getElementById('etape-prix').value = e.prix || '';
  document.getElementById('etape-payeur').value = e.payeurId || '';
  afficherChipsPayeur(e.payeurId || '');
  photoForm = e.photo || null;
  afficherApercuPhoto(photoForm);

  videoPathForm = e.videoPath || null;
  const videoWrap = document.getElementById('video-apercu-wrap');
  const videoApercu = document.getElementById('video-apercu');
  if (videoPathForm) {
    videoWrap.classList.remove('hidden');
    videoApercu.src = '';
    sb.storage.from('voyage-media').createSignedUrl(videoPathForm, 3600).then(function (res) {
      if (res.data) videoApercu.src = res.data.signedUrl;
    });
  } else {
    videoWrap.classList.add('hidden');
    videoApercu.src = '';
  }

  if (TYPES_AVEC_LIGNES.includes(e.type)) {
    lignesForm = (e.lignes || []).map(function (c) {
      return { clientId: genId(), prix: c.prix || '', payeur: c.payeurId || '', voyageurs: c.voyageurIds || [] };
    });
    renderLignesForm();
    mettreAJourLabelsLignes(e.type);
    document.getElementById('bloc-lignes').classList.remove('hidden');
    document.getElementById('bloc-prix-voyageurs').classList.add('hidden');
  } else {
    lignesForm = [];
    afficherChipsVoyageurs(e.voyageurIds || []);
    document.getElementById('bloc-lignes').classList.add('hidden');
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
  document.getElementById('etape-lien-info').value = '';
  document.querySelectorAll('#chips-type .chip, #chips-soustype .chip').forEach(c => c.classList.remove('active'));
  document.getElementById('chips-soustype-wrap').classList.add('hidden');
  document.getElementById('champ-lieu-arrivee-wrap').classList.add('hidden');
  afficherChipsVoyageurs([]);
  document.getElementById('etape-payeur').value = '';
  afficherChipsPayeur('');
  photoForm = null;
  afficherApercuPhoto(null);
  videoPathForm = null;
  document.getElementById('video-apercu-wrap').classList.add('hidden');
  document.getElementById('video-apercu').src = '';
  lignesForm = [];
  renderLignesForm();
  document.getElementById('bloc-lignes').classList.add('hidden');
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

  if (videoEnCoursUpload) {
    alert('Attends la fin de l\'envoi de la vidéo avant d\'enregistrer.');
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
    description: vide(document.getElementById('etape-description').value),
    lien: vide(document.getElementById('etape-lien').value),
    lien_info: vide(document.getElementById('etape-lien-info').value),
    prix: TYPES_AVEC_LIGNES.includes(type) ? null : vide(document.getElementById('etape-prix').value),
    payeur_id: TYPES_AVEC_LIGNES.includes(type) ? null : vide(document.getElementById('etape-payeur').value),
    photo: photoForm,
    video_path: videoPathForm
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

    // Voyageurs concernés (types sans lignes) : on repart d'une liste propre à chaque sauvegarde
    const { error: errDelVoy } = await sb.from('voyage_etape_voyageurs').delete().eq('etape_id', id);
    if (errDelVoy) throw errDelVoy;

    if (!TYPES_AVEC_LIGNES.includes(type)) {
      const ids = voyageursSelectionnes();
      if (ids.length) {
        const { error: errInsVoy } = await sb.from('voyage_etape_voyageurs').insert(
          ids.map(function (voyageurId) { return { etape_id: id, voyageur_id: voyageurId }; })
        );
        if (errInsVoy) throw errInsVoy;
      }
    }

    // Lignes de coût (hébergement/activité/repas) : on supprime les anciennes puis on réinsère
    const { error: errDelLignes } = await sb.from('voyage_lignes_cout').delete().eq('etape_id', id);
    if (errDelLignes) throw errDelLignes;

    if (TYPES_AVEC_LIGNES.includes(type)) {
      const lignesValides = lignesForm.filter(function (c) { return c.prix || c.voyageurs.length; });
      for (const c of lignesValides) {
        const { data: ligneData, error: errLigne } = await sb
          .from('voyage_lignes_cout')
          .insert({ etape_id: id, prix: vide(c.prix), payeur_id: vide(c.payeur) })
          .select('id')
          .single();
        if (errLigne) throw errLigne;

        if (c.voyageurs.length) {
          const { error: errLigneVoy } = await sb.from('voyage_ligne_voyageurs').insert(
            c.voyageurs.map(function (voyageurId) { return { ligne_id: ligneData.id, voyageur_id: voyageurId }; })
          );
          if (errLigneVoy) throw errLigneVoy;
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
  if (modeInviteActif) return;

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
  document.getElementById('btn-toggle-invite').classList.toggle('hidden', peutEditer);
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

// ---- Accès invité (code secret, lecture seule sans compte) ----

document.getElementById('btn-toggle-invite').addEventListener('click', function () {
  document.getElementById('form-code-acces').classList.toggle('hidden');
});

document.getElementById('form-code-acces').addEventListener('submit', async function (evt) {
  evt.preventDefault();
  const code = document.getElementById('code-acces-input').value.trim();
  if (!code) return;
  await accederEnInvite(code);
});

async function accederEnInvite(code) {
  const { data, error } = await sb.rpc('voyage_etapes_invite', { code: code });
  if (error) {
    alert('Erreur : ' + error.message);
    return;
  }
  if (!data || data.length === 0) {
    alert('Code invalide, ou aucune étape à afficher pour le moment.');
    return;
  }

  document.getElementById('auth-bar').classList.add('hidden');
  document.getElementById('non-connecte-message').classList.add('hidden');
  document.querySelector('.tabs').classList.add('hidden');
  document.getElementById('vue-invite').classList.remove('hidden');
  modeInviteActif = true;
  afficherListeInvite(data);
  resoudreVideosInvite(code);
}

// Accès direct via URL (?code=...), sans passer par le formulaire
const codeDepuisUrl = new URLSearchParams(window.location.search).get('code');
if (codeDepuisUrl) {
  accederEnInvite(codeDepuisUrl);
}

function afficherListeInvite(lignes) {
  const cible = document.getElementById('liste-invite');
  etapesInvite = lignes.map(function (row) {
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
      description: row.description,
      lienInfo: row.lien_info,
      photo: row.photo,
      videoPath: row.video_path
    };
  });

  let html = '';
  let jourCourant = null;
  etapesInvite.forEach(function (e) {
    if (e.dateDebut !== jourCourant) {
      jourCourant = e.dateDebut;
      html += '<div class="jour-titre">' + formaterDate(jourCourant) + '</div>';
    }
    html += carteInviteHTML(e);
  });
  cible.innerHTML = html;
}

async function resoudreVideosInvite(code) {
  const elements = Array.from(document.querySelectorAll('#liste-invite video.carte-video[data-video-path]'));
  if (elements.length === 0) return;
  const chemins = elements.map(function (el) { return el.dataset.videoPath; });

  try {
    const reponse = await fetch(window.SUPABASE_URL + '/functions/v1/guest-video-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code, paths: chemins })
    });
    const resultat = await reponse.json();
    if (!reponse.ok || resultat.error || !resultat.urls) return;
    elements.forEach(function (el, i) {
      const item = resultat.urls[i];
      if (item && item.signedUrl) el.src = item.signedUrl;
    });
  } catch (err) {
    console.error(err);
  }
}

function carteInviteHTML(e) {
  const aUneCarte = !!(e.lieu || e.lieuArrivee);
  return '' +
    '<div class="carte ' + e.type + '">' +
    (e.videoPath ? '<video class="carte-video" data-video-path="' + escapeHTML(e.videoPath) + '" muted loop playsinline autoplay></video>' : (e.photo ? '<img class="carte-photo" src="' + e.photo + '" alt="">' : sceneHTMLPour(e))) +
    '  <div class="carte-content">' +
    '  <div class="carte-icone"><span class="material-symbols-rounded">' + iconePour(e) + '</span></div>' +
    '  <div class="carte-body">' +
    '    <div class="carte-top">' +
    '      <span class="carte-type">' + libellePour(e) + '</span>' +
    '      <span class="carte-heure">' + ligneHoraire(e) + '</span>' +
    '    </div>' +
    '    <div class="carte-titre">' + escapeHTML(e.titre) + '</div>' +
    (e.lieu ? '<div class="carte-lieu"><span class="material-symbols-rounded">place</span> ' + escapeHTML(e.lieu) +
      (e.lieuArrivee ? ' → ' + escapeHTML(e.lieuArrivee) : '') + '</div>' : '') +
    (e.description ? '<div class="carte-details">' + escapeHTML(e.description) + '</div>' : '') +
    (aUneCarte || e.lienInfo ? '    <div class="carte-actions">' +
      (aUneCarte ? '<button onclick="toggleCarte(\'' + e.id + '\',\'invite\')"><span class="material-symbols-rounded">map</span> Voir la carte</button>' : '') +
      (e.lienInfo ? '<a class="lien-reservation lien-info" href="' + escapeHTML(e.lienInfo) + '" target="_blank" rel="noopener"><span class="material-symbols-rounded">language</span> Site</a>' : '') +
      '</div>' : '') +
    (aUneCarte ? '    <div id="carte-map-invite-' + e.id + '" class="carte-map hidden"></div>' : '') +
    '  </div>' +
    '  </div>' +
    '</div>';
}

// ---- Gestion du code invité (onglet Admin) ----

document.getElementById('form-code-invite').addEventListener('submit', async function (evt) {
  evt.preventDefault();
  const nouveauCode = document.getElementById('admin-code-invite').value.trim();
  if (!nouveauCode) return;

  const { data, error } = await sb.rpc('voyage_definir_code_invite', { nouveau_code: nouveauCode });
  if (error || !data) {
    alert('Erreur : ' + (error ? error.message : 'accès refusé.'));
    return;
  }
  alert('Code mis à jour.');
});

async function chargerCodeInviteActuel() {
  const { data, error } = await sb.rpc('voyage_lire_code_invite');
  if (!error && data) {
    document.getElementById('admin-code-invite').value = data;
  }
}

// ---- Onglet Admin (comptes autorisés) ----

async function chargerUtilisateursAdmin() {
  if (!estAdmin) return;
  remplirSelectVoyageursAdmin();

  const { data, error } = await sb.rpc('voyage_admin_utilisateurs');

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

function formaterConnexion(u) {
  if (!u.compte_cree) return '<span class="statut-connexion jamais">Jamais connecté</span>';

  const cree = new Date(u.compte_cree_le).getTime();
  const derniere = u.derniere_connexion ? new Date(u.derniere_connexion).getTime() : null;

  // La toute première "connexion" est un artefact de la création du compte (quasi simultanée) —
  // seule une connexion nettement postérieure prouve un vrai clic sur le lien reçu par email.
  if (!derniere || (derniere - cree) < 5000) {
    return '<span class="statut-connexion jamais">Compte créé, jamais réellement connecté</span>';
  }

  const d = new Date(u.derniere_connexion);
  const texte = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) +
    ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return '<span class="statut-connexion connecte">Connecté le ' + texte + '</span>';
}

function afficherListeAdmin() {
  const cible = document.getElementById('liste-admin-utilisateurs');
  if (utilisateursAdmin.length === 0) {
    cible.innerHTML = '<div class="vide">Aucun compte autorisé pour le moment.</div>';
    return;
  }
  cible.innerHTML = utilisateursAdmin.map(function (u) {
    return '<div class="ligne-voyageur"><span class="nom">' + escapeHTML(u.email) +
      (u.voyageur_nom ? ' <span class="badge-voyageur">' + escapeHTML(u.voyageur_nom) + '</span>' : '') +
      (u.is_admin ? '<span class="badge-admin">Admin</span>' : '') +
      '<br>' + formaterConnexion(u) + '</span>' +
      '<span class="ligne-actions">' +
      '<button onclick="definirMotDePasseUtilisateur(\'' + encodeURIComponent(u.email) + '\')">Mot de passe</button>' +
      '<button onclick="supprimerUtilisateurAdmin(\'' + encodeURIComponent(u.email) + '\')">Supprimer</button>' +
      '</span></div>';
  }).join('');
}

async function definirMotDePasseUtilisateur(emailEncode) {
  const email = decodeURIComponent(emailEncode);
  const motDePasse = prompt('Nouveau mot de passe pour ' + email + ' (6 caractères minimum) :');
  if (!motDePasse) return;
  if (motDePasse.length < 6) {
    alert('Le mot de passe doit faire au moins 6 caractères.');
    return;
  }

  const { data: sessionData } = await sb.auth.getSession();
  if (!sessionData.session) {
    alert('Session expirée, reconnecte-toi.');
    return;
  }

  try {
    const reponse = await fetch(window.SUPABASE_URL + '/functions/v1/admin-set-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionData.session.access_token
      },
      body: JSON.stringify({ email: email, password: motDePasse })
    });
    const resultat = await reponse.json();
    if (!reponse.ok || resultat.error) {
      alert('Erreur : ' + (resultat.error || reponse.statusText));
      return;
    }
    alert('Mot de passe mis à jour pour ' + email + '.');
  } catch (err) {
    alert('Erreur réseau : ' + err.message);
  }
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
