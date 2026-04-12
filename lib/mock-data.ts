export interface Clinic {
    id: string;
    name: string;
    city: string;
    address: string;
    phone: string;
    email: string;
    manager: string;
    image: string;
    description: string;
    rating: number;
}

export interface Diagnosis {
    code: string;
    name: string;
    namePl: string;
}

export interface Medicine {
    id: string;
    name: string;
    unit: string;
    namePl: string
}

export interface LabTest {
    id: string;
    name: string;
}

export interface Veterinarian {
    id: string;
    name: string;
    specialization: string;
    clinicId: string;
    image: string;
    bio: string;}

export interface Blog {
    id: string;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    category: string;
    image: string;
}

export const mockClinics: Clinic[] = [
    {
        id: 'c1',
        name: 'PokiePaws Central',
        city: 'Warsaw',
        address: 'ul. Marszałkowska 10, 00-001 Warszawa',
        phone: '+48 22 123 45 67',
        email: 'central@pokiepaws.pl',
        manager: 'Dr. Anna Kowalska',
        image: '/WWA.jpg',
        description: 'Our flagship clinic in the heart of Warsaw, equipped with the latest diagnostic tools.',
        rating: 4.9
    },
    {
        id: 'c2',
        name: 'PokiePaws West',
        city: 'Wrocław',
        address: 'ul. Grunwaldzka 50, 80-001 Wrocław',
        phone: '+48 58 321 45 67',
        email: 'west@pokiepaws.pl',
        manager: 'Dr. Piotr Zieliński',
        image: '/WRO.jpg',
        description: 'Specializing in marine animal care and general veterinary services.',
        rating: 4.7
    },
    {
        id: 'c3',
        name: 'PokiePaws South',
        city: 'Kraków',
        address: 'ul. Floriańska 15, 31-001 Kraków',
        phone: '+48 12 456 78 90',
        email: 'south@pokiepaws.pl',
        manager: 'Dr. Katarzyna Mazur',
        image: '/KRK.jpg',
        description: 'A cozy clinic with a long tradition of caring for local pets.',
        rating: 4.8
    }
];

export const mockDiagnoses: Diagnosis[] = [
    // Human ICD codes
    { code: 'A00.0', name: 'Cholera due to Vibrio cholerae 01, biovar cholerae', namePl: 'Cholera wywołana przez Vibrio cholerae 01, biowar cholerae' },
    { code: 'B01.9', name: 'Varicella without complication', namePl: 'Ospa wietrzna bez powikłań' },
    { code: 'J06.9', name: 'Acute upper respiratory infection, unspecified', namePl: 'Ostra infekcja górnych dróg oddechowych, nieokreślona' },
    { code: 'K29.7', name: 'Gastritis, unspecified', namePl: 'Zapalenie żołądka, nieokreślone' },
    { code: 'M54.5', name: 'Low back pain', namePl: 'Ból dolnej części pleców' },
    { code: 'S06.0', name: 'Concussion', namePl: 'Wstrząśnienie mózgu' },

    // Veterinary - Viral
    { code: 'VET-001', name: 'Canine Parvovirus', namePl: 'Parwowiroza psów' },
    { code: 'VET-002', name: 'Feline Leukemia Virus (FeLV)', namePl: 'Białaczka kotów (FeLV)' },
    { code: 'VET-010', name: 'Canine Distemper', namePl: 'Nosówka psów' },
    { code: 'VET-011', name: 'Feline Panleukopenia', namePl: 'Panleukopenia kotów' },
    { code: 'VET-012', name: 'Feline Immunodeficiency Virus (FIV)', namePl: 'Niedobór odporności kotów (FIV)' },
    { code: 'VET-013', name: 'Canine Infectious Hepatitis', namePl: 'Zakaźne zapalenie wątroby psów' },
    { code: 'VET-014', name: 'Rabies', namePl: 'Wścieklizna' },
    { code: 'VET-015', name: 'Feline Calicivirus', namePl: 'Kaliciwiroza kotów' },
    { code: 'VET-016', name: 'Feline Herpesvirus (Rhinotracheitis)', namePl: 'Herpeswirusowe zapalenie tchawicy i spojówek kotów' },
    { code: 'VET-017', name: 'Canine Coronavirus', namePl: 'Koronawiroza psów' },

    // Veterinary - Bacterial
    { code: 'VET-020', name: 'Leptospirosis', namePl: 'Leptospiroza' },
    { code: 'VET-021', name: 'Bordetella (Kennel Cough)', namePl: 'Kaszel kennelowy (Bordetella)' },
    { code: 'VET-022', name: 'Lyme Disease (Borreliosis)', namePl: 'Borelioza z Lyme' },
    { code: 'VET-023', name: 'Salmonellosis', namePl: 'Salmonelloza' },
    { code: 'VET-024', name: 'Pyoderma', namePl: 'Ropne zapalenie skóry' },
    { code: 'VET-025', name: 'Urinary Tract Infection', namePl: 'Zakażenie układu moczowego' },

    // Veterinary - Parasitic
    { code: 'VET-030', name: 'Heartworm Disease', namePl: 'Dirofilarioza (robak sercowy)' },
    { code: 'VET-031', name: 'Toxoplasmosis', namePl: 'Toksoplazmoza' },
    { code: 'VET-032', name: 'Giardiasis', namePl: 'Giardoza' },
    { code: 'VET-033', name: 'Sarcoptic Mange', namePl: 'Świerzb (nużyca sarkoptyczna)' },
    { code: 'VET-034', name: 'Demodectic Mange', namePl: 'Nużyca demodektyczna' },
    { code: 'VET-035', name: 'Flea Allergy Dermatitis', namePl: 'Alergia na pchły (FAD)' },
    { code: 'VET-036', name: 'Tick-borne Encephalitis', namePl: 'Kleszczowe zapalenie mózgu' },

    // Veterinary - Internal / Chronic
    { code: 'VET-040', name: 'Diabetes Mellitus', namePl: 'Cukrzyca' },
    { code: 'VET-041', name: 'Hypothyroidism', namePl: 'Niedoczynność tarczycy' },
    { code: 'VET-042', name: 'Hyperthyroidism (Feline)', namePl: 'Nadczynność tarczycy (koty)' },
    { code: 'VET-043', name: 'Chronic Kidney Disease', namePl: 'Przewlekła choroba nerek' },
    { code: 'VET-044', name: 'Liver Disease / Hepatopathy', namePl: 'Choroba wątroby / hepatopatia' },
    { code: 'VET-045', name: 'Pancreatitis', namePl: 'Zapalenie trzustki' },
    { code: 'VET-046', name: 'Inflammatory Bowel Disease (IBD)', namePl: 'Nieswoiste zapalenie jelit (IBD)' },
    { code: 'VET-047', name: 'Addison\'s Disease (Hypoadrenocorticism)', namePl: 'Choroba Addisona (niedoczynność nadnerczy)' },
    { code: 'VET-048', name: 'Cushing\'s Disease (Hyperadrenocorticism)', namePl: 'Choroba Cushinga (nadczynność nadnerczy)' },

    // Veterinary - Musculoskeletal
    { code: 'VET-050', name: 'Hip Dysplasia', namePl: 'Dysplazja stawu biodrowego' },
    { code: 'VET-051', name: 'Elbow Dysplasia', namePl: 'Dysplazja stawu łokciowego' },
    { code: 'VET-052', name: 'Osteoarthritis', namePl: 'Choroba zwyrodnieniowa stawów' },
    { code: 'VET-053', name: 'Intervertebral Disc Disease (IVDD)', namePl: 'Choroba dysku międzykręgowego (IVDD)' },
    { code: 'VET-054', name: 'Cruciate Ligament Rupture', namePl: 'Zerwanie więzadła krzyżowego' },

    // Veterinary - Dermatological
    { code: 'VET-060', name: 'Atopic Dermatitis', namePl: 'Atopowe zapalenie skóry' },
    { code: 'VET-061', name: 'Ringworm (Dermatophytosis)', namePl: 'Grzybica skóry (dermatofitoza)' },
    { code: 'VET-062', name: 'Hot Spots (Acute Moist Dermatitis)', namePl: 'Ostre wilgotne zapalenie skóry' },

    // Veterinary - ENT / Eyes
    { code: 'VET-003', name: 'Otitis Externa', namePl: 'Zapalenie ucha zewnętrznego' },
    { code: 'VET-070', name: 'Otitis Media / Interna', namePl: 'Zapalenie ucha środkowego / wewnętrznego' },
    { code: 'VET-071', name: 'Conjunctivitis', namePl: 'Zapalenie spojówek' },
    { code: 'VET-072', name: 'Glaucoma', namePl: 'Jaskra' },
    { code: 'VET-073', name: 'Cataracts', namePl: 'Zaćma' },

    // Veterinary - Dental
    { code: 'VET-004', name: 'Dental Calculus', namePl: 'Kamień nazębny' },
    { code: 'VET-080', name: 'Periodontal Disease', namePl: 'Choroba przyzębia' },
    { code: 'VET-081', name: 'Tooth Resorption (Feline)', namePl: 'Resorpcja zębów (koty)' },

    // Veterinary - Oncology
    { code: 'VET-090', name: 'Mast Cell Tumor', namePl: 'Guz z komórek tucznych' },
    { code: 'VET-091', name: 'Lymphoma', namePl: 'Chłoniak' },
    { code: 'VET-092', name: 'Osteosarcoma', namePl: 'Mięsak kościopochodny' },
    { code: 'VET-093', name: 'Mammary Gland Tumor', namePl: 'Guz gruczołu mlekowego' },
    // Pasożyty zewnętrzne
    { code: 'VET-100', name: 'Flea Infestation', namePl: 'Inwazja pcheł' },
    { code: 'VET-101', name: 'Tick Infestation', namePl: 'Inwazja kleszczy' },
    { code: 'VET-102', name: 'Lice Infestation (Pediculosis)', namePl: 'Wszawica (pediculosis)' },
    { code: 'VET-103', name: 'Cheyletiellosis (Walking Dandruff)', namePl: 'Cheyletieloza (wędrujący łupież)' },
    { code: 'VET-104', name: 'Harvest Mite Infestation (Trombiculosis)', namePl: 'Inwazja roztocza (trombiculoza)' },
];

export const mockMedicines: Medicine[] = [
    // Antybiotyki
    { id: 'm1', name: 'Amoxicillin', namePl: 'Amoksycylina', unit: 'mg' },
    { id: 'm2', name: 'Amoxicillin + Clavulanic Acid', namePl: 'Amoksycylina + kwas klawulanowy', unit: 'mg' },
    { id: 'm3', name: 'Doxycycline', namePl: 'Doksycyklina', unit: 'mg' },
    { id: 'm4', name: 'Enrofloxacin', namePl: 'Enrofloksacyna', unit: 'mg' },
    { id: 'm5', name: 'Metronidazole', namePl: 'Metronidazol', unit: 'mg' },
    { id: 'm6', name: 'Clindamycin', namePl: 'Klindamycyna', unit: 'mg' },
    { id: 'm7', name: 'Trimethoprim + Sulfamethoxazole', namePl: 'Trimetoprim + sulfametoksazol', unit: 'mg' },
    { id: 'm8', name: 'Marbofloxacin', namePl: 'Marbofloksacyna', unit: 'mg' },

    // Przeciwzapalne / Przeciwbólowe
    { id: 'm9', name: 'Carprofen', namePl: 'Karprofen', unit: 'mg' },
    { id: 'm10', name: 'Meloxicam', namePl: 'Meloksykam', unit: 'ml' },
    { id: 'm11', name: 'Robenacoxib', namePl: 'Robenakoksyb', unit: 'mg' },
    { id: 'm12', name: 'Grapiprant', namePl: 'Grapiprant', unit: 'mg' },
    { id: 'm13', name: 'Tramadol', namePl: 'Tramadol', unit: 'mg' },
    { id: 'm14', name: 'Buprenorphine', namePl: 'Buprenorfina', unit: 'ml' },
    { id: 'm15', name: 'Gabapentin', namePl: 'Gabapentyna', unit: 'mg' },

    // Kortykosteroidy
    { id: 'm16', name: 'Prednisone', namePl: 'Prednizon', unit: 'mg' },
    { id: 'm17', name: 'Prednisolone', namePl: 'Prednizolon', unit: 'mg' },
    { id: 'm18', name: 'Dexamethasone', namePl: 'Deksametazon', unit: 'mg' },
    { id: 'm19', name: 'Triamcinolone', namePl: 'Triamcynolon', unit: 'mg' },

    // Przeciwpasożytnicze
    { id: 'm20', name: 'Fipronil', namePl: 'Fipronil', unit: 'pipette' },
    { id: 'm21', name: 'Imidacloprid', namePl: 'Imidakloprid', unit: 'pipette' },
    { id: 'm22', name: 'Selamectin', namePl: 'Selamektyna', unit: 'pipette' },
    { id: 'm23', name: 'Milbemycin Oxime', namePl: 'Milbemycyna oksym', unit: 'mg' },
    { id: 'm24', name: 'Praziquantel', namePl: 'Prazikwantel', unit: 'mg' },
    { id: 'm25', name: 'Fenbendazole', namePl: 'Fenbendazol', unit: 'mg' },
    { id: 'm26', name: 'Metronidazole (Antiprotozoal)', namePl: 'Metronidazol (przeciwpierwotniacze)', unit: 'mg' },
    { id: 'm27', name: 'Afoxolaner (NexGard)', namePl: 'Afoksolaner (NexGard)', unit: 'mg' },
    { id: 'm28', name: 'Fluralaner (Bravecto)', namePl: 'Fluralaner (Bravecto)', unit: 'mg' },

    // Kardiologiczne
    { id: 'm29', name: 'Enalapril', namePl: 'Enalapryl', unit: 'mg' },
    { id: 'm30', name: 'Benazepril', namePl: 'Benazepril', unit: 'mg' },
    { id: 'm31', name: 'Furosemide', namePl: 'Furosemid', unit: 'mg' },
    { id: 'm32', name: 'Spironolactone', namePl: 'Spironolakton', unit: 'mg' },
    { id: 'm33', name: 'Pimobendan', namePl: 'Pimobendan', unit: 'mg' },
    { id: 'm34', name: 'Atenolol', namePl: 'Atenolol', unit: 'mg' },
    { id: 'm35', name: 'Digoxin', namePl: 'Digoksyna', unit: 'mg' },

    // Hormonalne / Endokrynologiczne
    { id: 'm36', name: 'Levothyroxine', namePl: 'Lewotyroksyna', unit: 'mg' },
    { id: 'm37', name: 'Methimazole', namePl: 'Metimazol', unit: 'mg' },
    { id: 'm38', name: 'Insulin (Caninsulin)', namePl: 'Insulina (Caninsulin)', unit: 'IU' },
    { id: 'm39', name: 'Trilostane', namePl: 'Trilostan', unit: 'mg' },
    { id: 'm40', name: 'Mitotane (o,p-DDD)', namePl: 'Mitotan (o,p-DDD)', unit: 'mg' },

    // Gastroenterologiczne
    { id: 'm41', name: 'Omeprazole', namePl: 'Omeprazol', unit: 'mg' },
    { id: 'm42', name: 'Famotidine', namePl: 'Famotydyna', unit: 'mg' },
    { id: 'm43', name: 'Maropitant (Cerenia)', namePl: 'Maropitant (Cerenia)', unit: 'mg' },
    { id: 'm44', name: 'Ondansetron', namePl: 'Ondansetron', unit: 'mg' },
    { id: 'm45', name: 'Sucralfate', namePl: 'Sukralfat', unit: 'mg' },
    { id: 'm46', name: 'Lactulose', namePl: 'Laktuloza', unit: 'ml' },
    { id: 'm47', name: 'Probiotics (Enterococcus)', namePl: 'Probiotyki (Enterococcus)', unit: 'capsule' },

    // Dermatologiczne
    { id: 'm48', name: 'Oclacitinib (Apoquel)', namePl: 'Oklacytynib (Apoquel)', unit: 'mg' },
    { id: 'm49', name: 'Lokivetmab (Cytopoint)', namePl: 'Lokivetmab (Cytopoint)', unit: 'ml' },
    { id: 'm50', name: 'Ciclosporin (Atopica)', namePl: 'Cyklosporyna (Atopica)', unit: 'mg' },
    { id: 'm51', name: 'Ketoconazole (topical)', namePl: 'Ketokonazol (miejscowo)', unit: 'g' },
    { id: 'm52', name: 'Chlorhexidine Shampoo', namePl: 'Szampon z chlorheksydyną', unit: 'ml' },

    // Neurologiczne
    { id: 'm53', name: 'Phenobarbital', namePl: 'Fenobarbital', unit: 'mg' },
    { id: 'm54', name: 'Potassium Bromide', namePl: 'Bromek potasu', unit: 'mg' },
    { id: 'm55', name: 'Levetiracetam', namePl: 'Lewetyracetam', unit: 'mg' },
    { id: 'm56', name: 'Diazepam', namePl: 'Diazepam', unit: 'mg' },

    // Okulistyczne
    { id: 'm57', name: 'Dorzolamide Eye Drops', namePl: 'Krople do oczu z dorzolamidem', unit: 'drop' },
    { id: 'm58', name: 'Latanoprost Eye Drops', namePl: 'Krople do oczu z latanoprostem', unit: 'drop' },
    { id: 'm59', name: 'Tobramycin Eye Drops', namePl: 'Krople do oczu z tobramycyną', unit: 'drop' },
    { id: 'm60', name: 'Dexamethasone Eye Drops', namePl: 'Krople do oczu z deksametazonem', unit: 'drop' },

    // Onkologiczne
    { id: 'm61', name: 'Chlorambucil', namePl: 'Chlorambucyl', unit: 'mg' },
    { id: 'm62', name: 'Cyclophosphamide', namePl: 'Cyklofosfamid', unit: 'mg' },
    { id: 'm63', name: 'Vincristine', namePl: 'Winkrystyna', unit: 'mg' },
    { id: 'm64', name: 'Toceranib (Palladia)', namePl: 'Toceranib (Palladia)', unit: 'mg' },

    // Suplementy
    { id: 'm65', name: 'Omega-3 Fatty Acids', namePl: 'Kwasy tłuszczowe Omega-3', unit: 'capsule' },
    { id: 'm66', name: 'Joint Supplement (Glucosamine + Chondroitin)', namePl: 'Suplement na stawy (glukozamina + chondroityna)', unit: 'tablet' },
    { id: 'm67', name: 'Vitamin B12', namePl: 'Witamina B12', unit: 'ml' },
    { id: 'm68', name: 'Iron Supplement', namePl: 'Suplement żelaza', unit: 'mg' },

    // Pasożyty zewnętrzne
    { id: 'm69', name: 'Fipronil + Methoprene (Frontline Combo)', namePl: 'Fipronil + metopren (Frontline Combo)', unit: 'pipette' },
    { id: 'm70', name: 'Imidacloprid + Permethrin (Advantix)', namePl: 'Imidakloprid + permetryna (Advantix)', unit: 'pipette' },
    { id: 'm71', name: 'Spinosad (Comfortis)', namePl: 'Spinosad (Comfortis)', unit: 'mg' },
    { id: 'm72', name: 'Nitenpyram (Capstar)', namePl: 'Nitenpyram (Capstar)', unit: 'mg' },
    { id: 'm73', name: 'Indoxacarb (Activyl)', namePl: 'Indoksykarb (Activyl)', unit: 'pipette' },
    { id: 'm74', name: 'Permethrin Spray', namePl: 'Spray z permetryną', unit: 'ml' },
    { id: 'm75', name: 'Ivermectin', namePl: 'Iwermektyna', unit: 'mg' },
    { id: 'm76', name: 'Lime Sulfur Dip', namePl: 'Kąpiel z siarczanem wapnia', unit: 'ml' },
    ];

export const mockLabTests: LabTest[] = [
    { id: 't1', name: 'Complete Blood Count (CBC)' },
    { id: 't2', name: 'Biochemistry Panel' },
    { id: 't3', name: 'Urinalysis' },
    { id: 't4', name: 'Fecal Exam' },
    { id: 't5', name: 'X-Ray' }
];

export const mockVets: Veterinarian[] = [
    {
        id: 'v1',
        name: 'Dr. Anna Kowalska',
        specialization: 'Chirurg (Surgeon)',
        clinicId: 'c1',
        image: 'https://picsum.photos/seed/vet1/400/400',
        bio: 'Specialist in soft tissue and orthopedic surgery.'
    },
    {
        id: 'v2',
        name: 'Dr. Marek Nowak',
        specialization: 'Kardiolog (Cardiologist)',
        clinicId: 'c1',
        image: 'https://picsum.photos/seed/vet2/400/400',
        bio: 'Expert in heart diseases and echocardiography.'
    },
    {
        id: 'v3',
        name: 'Dr. Ewa Wiśniewska',
        specialization: 'Dermatolog (Dermatologist)',
        clinicId: 'c1',
        image: 'https://picsum.photos/seed/vet3/400/400',
        bio: 'Focuses on skin allergies and chronic conditions.'
    },
    {
        id: 'v4',
        name: 'Dr. Piotr Zieliński',
        specialization: 'Neurolog (Neurologist)',
        clinicId: 'c2',
        image: 'https://picsum.photos/seed/vet4/400/400',
        bio: 'Specializes in spinal injuries and brain disorders.'
    },
    {
        id: 'v5',
        name: 'Dr. Maria Lewandowska',
        specialization: 'Onkolog (Oncologist)',
        clinicId: 'c2',
        image: 'https://picsum.photos/seed/vet5/400/400',
        bio: 'Dedicated to cancer treatment and chemotherapy.'
    },
    {
        id: 'v6',
        name: 'Dr. Jan Wójcik',
        specialization: 'Okulista (Ophthalmologist)',
        clinicId: 'c2',
        image: 'https://picsum.photos/seed/vet6/400/400',
        bio: 'Expert in eye surgeries and vision care.'
    },
    {
        id: 'v7',
        name: 'Dr. Katarzyna Mazur',
        specialization: 'Radiolog (Radiologist)',
        clinicId: 'c3',
        image: 'https://picsum.photos/seed/vet7/400/400',
        bio: 'Specialist in advanced imaging (CT, MRI, X-Ray).'
    },
    {
        id: 'v8',
        name: 'Dr. Tomasz Kaczmarek',
        specialization: 'Stomatolog (Dentist)',
        clinicId: 'c3',
        image: 'https://picsum.photos/seed/vet8/400/400',
        bio: 'Focuses on oral hygiene and dental surgeries.'
    },
    {
        id: 'v9',
        name: 'Dr. Agnieszka Zając',
        specialization: 'Lekarz ratunkowy (Emergency Care)',
        clinicId: 'c3',
        image: 'https://picsum.photos/seed/vet9/400/400',
        bio: 'Specialist in critical care and emergency medicine.'
    },
];

export const mockBlog : Blog [] = [
    {
        id: '1',
        title: 'How to Keep Your Pet Cool in Summer',
        excerpt: 'Summer heat can be dangerous for pets. Learn how to prevent heatstroke and keep your furry friends comfortable.',
        author: 'Dr. Sarah Smith',
        date: 'May 10, 2024',
        category: 'Pet Care',
        image: 'https://picsum.photos/seed/summer-pet/800/600',
    }
];
export const mockPrescriptions = [];
export const mockLabOrders = [];
export const mockSupplyOrders = [];
